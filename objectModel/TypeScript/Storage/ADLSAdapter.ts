// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as adal from 'adal-node';
import * as crypto from 'crypto';
import { URL } from 'url';
import { CdmHttpClient, CdmHttpRequest, CdmHttpResponse, TokenProvider } from '../Utilities/Network';
import { NetworkAdapter } from './NetworkAdapter';
import { configObjectType, StorageAdapter } from './StorageAdapter';

export class ADLSAdapter extends NetworkAdapter implements StorageAdapter {
    /**
     * @internal
     */
    public readonly type: string = 'adls';

    public get root(): string {
        return this._root;
    }

    public set root(val: string) {
        this._root = val;
        this.extractFilesystemAndSubPath(this._root);
    }

    public get hostname(): string {
        return this._hostname;
    }

    public set hostname(val: string) {
        this._hostname = val;
        this.formattedHostname = this.formatHostname(this._hostname);
    }

    public clientId: string;
    public tenant: string;
    public locationHint: string;
    public secret: string;
    public sharedKey: string;

    // The map from corpus path to adapter path.
    private readonly adapterPaths: Map<string, string>; 
    // The authorization header key, used during shared key auth.
    private readonly httpAuthorization: string = 'Authorization';
    // The MS date header key, used during shared key auth.
    private readonly httpXmsDate: string = 'x-ms-date';
    //  The MS version key, used during shared key auth.
    private readonly httpXmsVersion: string = 'x-ms-version';

    private readonly resource: string = 'https://storage.azure.com';

    private readonly tokenProvider: TokenProvider;

    private _hostname: string;
    private _root: string;
    private context: adal.AuthenticationContext;
    private fileSystem: string = '';
    private formattedHostname: string = '';
    private subPath: string = '';
    private tokenResponse: adal.TokenResponse;

    // The ADLS constructor for clientId/secret authentication.
    constructor(
        hostname?: string,
        root?: string,
        tenantOrSharedKeyorTokenProvider?: string | TokenProvider,
        clientId?: string,
        secret?: string) {
        super();
        if (hostname && root && tenantOrSharedKeyorTokenProvider) {
            this.root = root;
            this.hostname = hostname;
            if (typeof tenantOrSharedKeyorTokenProvider === 'string') {
                if (tenantOrSharedKeyorTokenProvider && !clientId && !secret) {
                    this.sharedKey = tenantOrSharedKeyorTokenProvider;
                } else if (tenantOrSharedKeyorTokenProvider && clientId && secret) {
                    this.tenant = tenantOrSharedKeyorTokenProvider;
                    this.clientId = clientId;
                    this.secret = secret;
                    this.context = new adal.AuthenticationContext(`https://login.windows.net/${this.tenant}`);
                }
            } else {
                this.tokenProvider = tenantOrSharedKeyorTokenProvider;
            }
        }

        this.adapterPaths = new Map();
        this.httpClient = new CdmHttpClient();
    }

    public canRead(): boolean {
        return true;
    }

    public async readAsync(corpusPath: string): Promise<string> {
        const url: string = this.createAdapterPath(corpusPath);

        const cdmHttpRequest: CdmHttpRequest = await this.buildRequest(url, 'GET');

        const cdmHttpResponse: CdmHttpResponse = await super.executeRequest(cdmHttpRequest);

        return cdmHttpResponse.content;
    }

    public async writeAsync(corpusPath: string, data: string): Promise<void> {
        if (this.ensurePath(`${this.root}${corpusPath}`)) {
            throw new Error(`Could not create folder for document ${corpusPath}`);
        }
        const url: string = this.createAdapterPath(corpusPath);

        let request: CdmHttpRequest = await this.buildRequest(`${url}?resource=file`, 'PUT');
        await super.executeRequest(request);

        request = await this.buildRequest(`${url}?action=append&position=0`, 'PATCH');
        request.content = data;
        request.contentType = 'application/json; charset=utf-8';

        await super.executeRequest(request);

        // Building a request and setting a URL with a position argument to be the length of the byte array
        // of the string content (or length of UTF-8 string content).
        request = await this.buildRequest(`${url}?action=flush&position=${Buffer.from(request.content).length}`, 'PATCH');
        await super.executeRequest(request);
    }

    public canWrite(): boolean {
        return true;
    }

    public createAdapterPath(corpusPath: string): string {
        const formattedCorpusPath: string = this.formatCorpusPath(corpusPath);

        if (this.adapterPaths.has(formattedCorpusPath)) {
            return this.adapterPaths.get(formattedCorpusPath);
        } else {
            return `https://${this.hostname}${this.root}${formattedCorpusPath}`;
        }
    }

    public createCorpusPath(adapterPath: string): string {
        if (adapterPath) {
            const startIndex: number = "https://".length;
            const endIndex: number = adapterPath.indexOf("/", startIndex + 1);

            if (endIndex < startIndex) {
                throw new Error(`Unexpected adapter path: ${adapterPath}`);
            }

            const hostname: string = this.formatHostname(adapterPath.substring(startIndex, endIndex));

            if (hostname === this.formattedHostname
                && adapterPath.substring(endIndex)
                .startsWith(this.root)) {
                const corpusPath: string = adapterPath.substring(endIndex + this.root.length);
                if (!this.adapterPaths.has(corpusPath))
                {
                    this.adapterPaths.set(corpusPath, adapterPath);
                }

                return corpusPath;
            }
        }

        return undefined;
    }

    public async computeLastModifiedTimeAsync(corpusPath: string): Promise<Date> {
        const adapterPath: string = this.createAdapterPath(corpusPath);

        const request: CdmHttpRequest = await this.buildRequest(adapterPath, 'HEAD');

        try {
            const cdmResponse: CdmHttpResponse = await super.executeRequest(request);

            if (cdmResponse.statusCode === 200) {
                // tslint:disable-next-line: no-backbone-get-set-outside-model
                return new Date(cdmResponse.responseHeaders.get('lastModified'));
            }
        } catch (e) {
            // We don't have standard logger here, so use one from system diagnostics
            console.debug(`ADLS file not found, skipping last modified time calculation for it. Exception: ${e}`);
        }
    }

    public async fetchAllFilesAsync(folderCorpusPath: string): Promise<string[]> {
        const url: string = `https://${this.hostname}/${this.fileSystem}`;
        const directory: string = `${this.subPath}/${folderCorpusPath}`;
        const request: CdmHttpRequest = await this.buildRequest(`${url}?directory=${directory}&recursive=True&resource=filesystem`, 'GET');
        const cdmResponse: CdmHttpResponse = await super.executeRequest(request);

        if (cdmResponse.statusCode === 200) {
            const json: string = cdmResponse.content;
            const jObject1 = JSON.parse(json);

            const jArray = jObject1.paths;
            const result: string[] = [];

            for (const jObject of jArray) {
                const isDirectory: boolean = jObject.isDirectory;
                if (isDirectory === undefined || typeof isDirectory !== 'boolean') {
                    const name: string = jObject.name;
                    const nameWithoutSubPath: string = this.subPath.length > 0 && name.startsWith(this.subPath) ?
                        name.substring(this.subPath.length + 1) : name;
                    result.push(this.formatCorpusPath(nameWithoutSubPath));
                }
            }

            return result;
        }
    }

    public clearCache(): void {
        return;
    }

    public fetchConfig(): string {
        const resultConfig: configObjectType = {
            type: this.type
        };

        const configObject: configObjectType = {
            hostname: this.hostname,
            root: this.root
        };

        // Check for clientId auth, we won't write shared key or secrets to JSON.
        if (this.clientId && this.tenant) {
            configObject.tenant = this.tenant;
            configObject.clientId = this.clientId;
        }

        // Try constructing network configs.
        const networkConfigArray: configObjectType = this.fetchNetworkConfig();
        for (const key of Object.keys(networkConfigArray)) {
            configObject[key] = networkConfigArray[key];
        }

        if (this.locationHint) {
            configObject.locationHint = this.locationHint;
        }

        resultConfig.config = configObject;

        return JSON.stringify(resultConfig);
    }

    public updateConfig(config: string): void {
        if (!config) {
            throw new Error('ADLS adapter needs a config.');
        }

        const configJson: configObjectType = JSON.parse(config);

        if (configJson.root) {
            this.root = configJson.root;
        } else {
            throw new Error('Root has to be set for ADLS adapter.');
        }

        if (configJson.hostname) {
            this.hostname = configJson.hostname;
        } else {
            throw new Error('Hostname has to be set for ADLS adapter.');
        }

        this.updateNetworkConfig(config);

        // Check first for clientId/secret auth.
        if (configJson.tenant && configJson.clientId) {
            this.tenant = configJson.tenant;
            this.clientId = configJson.clientId;

            // Check for a secret, we don't really care is it there, but it is nice if it is.
            if (configJson.secret) {
                this.secret = configJson.secret;
            }
        }

        // Check then for shared key auth.
        if (configJson.sharedKey) {
            this.sharedKey = configJson.sharedKey;
        }

        if (configJson.locationHint) {
            this.locationHint = configJson.locationHint;
        }

        if (this.tenant) {
            this.context = new adal.AuthenticationContext(`https://login.windows.net/${this.tenant}`);
        }
    }

    private async buildRequest(url: string, method: string, content?: string, contentType?: string): Promise<CdmHttpRequest> {
        let request: CdmHttpRequest;

        // Check whether we support shared key or clientId/secret auth
        if (this.sharedKey) {
            request = this.setUpCdmRequest(url, this.applySharedKey(this.sharedKey, url, method, content, contentType), method);
        } else if (this.tenant && this.clientId && this.secret) {
            const token: adal.TokenResponse = await this.generateBearerToken();
            request = this.setUpCdmRequest(
                url,
                new Map<string, string>([['authorization', `${token.tokenType} ${token.accessToken}`]]),
                method
            );
        } else if (this.tokenProvider) {
            request = this.setUpCdmRequest(
                url,
                new Map<string, string>([['authorization', `${this.tokenProvider.getToken()}`]]),
                method
            );
        } else {
            throw new Error('Adls adapter is not configured with any auth method');
        }

        if (content) {
            request.content = content;
            request.contentType = contentType;
        }

        return request;
    }

    private applySharedKey(sharedKey: string, url: string, method: string, content?: string, contentType?: string): Map<string, string> {
        const headers: Map<string, string> = new Map<string, string>();

        // Add UTC now time and new version.
        headers.set(this.httpXmsDate, new Date().toISOString());
        headers.set(this.httpXmsVersion, '2018-06-17');

        let contentLength: number = 0;

        const uri: URL = new URL(url);

        if (content) {
            contentLength = Buffer.from(content).length;
        }

        let builder: string = '';
        builder += `${method}\n`; // verb;
        builder += '\n'; // Content-Encoding
        builder += ('\n'); // Content-Language.
        builder += (contentLength !== 0) ? `${contentLength}\n` : '\n'; // Content length.
        builder += '\n'; // Content-md5.
        builder += contentType ? `${contentType}; charset=utf-8\n` : '\n'; // Content-type.
        builder += '\n'; // Date.
        builder += '\n'; // If-modified-since.
        builder += '\n'; // If-match.
        builder += '\n'; // If-none-match.
        builder += '\n'; // If-unmodified-since.
        builder += '\n'; // Range.

        for (const header of headers) {
            builder += `${header[0]}:${header[1]}\n`;
        }

        // Append canonicalized resource.
        const accountName: string =
            builder += '/';
        builder += accountName;
        builder += uri.pathname;

        // Append canonicalized queries.
        if (uri.search) {
            const queryParameters: string[] = uri.search.split('&');

            for (const parameter of queryParameters) {
                const keyValuePair: string[] = parameter.split('=');
                builder += `\n${keyValuePair[0]}:${keyValuePair[1]}`;
            }
        }

        // hash the payload
        const dataToHash: Buffer = Buffer.from(builder.trimRight());
        const bytes: Buffer = new Buffer(sharedKey);

        const hmac: crypto.Hmac = crypto.createHmac('sha256', bytes);

        hmac.on('readable', () => {
            const data: string | Buffer = hmac.read();
            if (data) {
                const signedString: string = `SharedKey ${accountName}:${data.toString()}`;
                headers.set(this.httpAuthorization, signedString);
            }
        });

        hmac.write(dataToHash);
        hmac.end();

        return headers;
    }

    private extractFilesystemAndSubPath(root: string): void {
        // No root value was set
        if (!root) {
            this.fileSystem = '';
            this.subPath = '';

            return;
        }

        // Remove leading /
        const prepRoot: string = this.root.startsWith('/') ? this.root.substring(1) : this.root;

        // Root contains only the file-system name, e.g. "fs-name"
        if (prepRoot.indexOf('/') === -1) {
            this.fileSystem = prepRoot;
            this.subPath = '';

            return;
        }

        // Root contains file-system name and folder, e.g. "fs-name/folder/folder..."
        const prepRootArray: string[] = prepRoot.split('/');
        this.fileSystem = prepRootArray[0];
        this.subPath = prepRootArray.slice(1)
            .join('/');
    }

    private formatCorpusPath(corpusPath: string): string {
        if (corpusPath.startsWith('adls:')) {
            corpusPath = corpusPath.substring(5);
        } else if (corpusPath.length > 0 && !corpusPath.startsWith('/')) {
            corpusPath = `/${corpusPath}`;
        }

        return corpusPath;
    }

    private formatHostname(hostname: string): string {
        hostname = hostname.replace('.blob.', '.dfs.');

        const port: string = ':443';

        if (hostname.includes(port))
        {
            hostname = hostname.substr(0, hostname.length - port.length);
        }

        return hostname;
    }

    private async generateBearerToken(): Promise<adal.TokenResponse> {
        return new Promise<adal.TokenResponse>((resolve, reject) => {
            // In-memory token caching is handled by adal by default.
            this.context.acquireTokenWithClientCredentials(
                this.resource,
                this.clientId,
                this.secret,
                (error: Error, response: adal.TokenResponse | adal.ErrorResponse) => {
                    this.tokenResponse = response as adal.TokenResponse;
                    resolve(this.tokenResponse);
                }
            );
        });
    }

    private ensurePath(pathFor: string): boolean {
        if (pathFor.lastIndexOf('/') === -1) {
            return false;
        }

        // Folders are only of virtual kind in Azure Storage
        return true;
    }
}
