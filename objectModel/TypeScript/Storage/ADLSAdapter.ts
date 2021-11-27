// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as msal from '@azure/msal-node';
import * as crypto from 'crypto';
import { URL } from 'url';
import { CdmHttpClient, CdmHttpRequest, CdmHttpResponse, TokenProvider } from '../Utilities/Network';
import { StorageUtils } from '../Utilities/StorageUtils';
import { NetworkAdapter } from './NetworkAdapter';
import { configObjectType } from '../internal';
import { azureCloudEndpoint, AzureCloudEndpointConvertor } from '../Enums/azureCloudEndpoint';
import { StringUtils } from '../Utilities/StringUtils';

export class ADLSAdapter extends NetworkAdapter {
    /**
     * @internal
     */
    public readonly type: string = 'adls';
    private readonly adlsDefaultTimeout: number = 8000;

    public get root(): string {
        return this._root;
    }

    public set root(val: string) {
        this._root = this.extractRootBlobContainerAndSubPath(val);
    }

    public get tenant(): string {
        return this._tenant;
    }

    public get hostname(): string {
        return this._hostname;
    }

    public set hostname(val: string) {
        if (StringUtils.isNullOrWhiteSpace(val)) {
            throw new URIError('Hostname cannot be null or whitespace.');
        }
        this._hostname = val;
        this.formattedHostname = this.formatHostname(this.removeProtocolFromHostname(this._hostname));
    }

    public get sasToken(): string {
        return this._sasToken;
    }

    /**
     * The SAS token. If supplied string begins with '?' symbol, the symbol gets stripped away.
     */
    public set sasToken(val: string) {
        // Remove the leading question mark, so we can append this token to URLs that already have it
        this._sasToken = val != null ?
            (val.startsWith('?') ? val.substr(1) : val)
            : null;
    }

    public clientId: string;
    public secret: string;
    public sharedKey: string;
    public tokenProvider: TokenProvider;
    public httpMaxResults: number = 5000;
    public endpoint?: azureCloudEndpoint;

    // The map from corpus path to adapter path.
    private readonly adapterPaths: Map<string, string>;
    // The authorization header key, used during shared key auth.
    private readonly httpAuthorization: string = 'Authorization';
    // The MS date header key, used during shared key auth.
    private readonly httpXmsDate: string = 'x-ms-date';
    //  The MS version key, used during shared key auth.
    private readonly httpXmsVersion: string = 'x-ms-version';
    // The MS continuation header key, used when building request url.
    private readonly httpXmsContinuation: string = 'x-ms-continuation';

    private readonly resource: string = 'https://storage.azure.com';
    private readonly scopes: string[] = ['https://storage.azure.com/.default']

    private _hostname: string;
    private _root: string;
    private _tenant: string;
    private _sasToken: string;
    private context: msal.IConfidentialClientApplication;
    private formattedHostname: string = '';
    private rootBlobContainer: string = '';
    private unescapedRootSubPath: string = '';
    private escapedRootSubPath: string = '';
    private fileModifiedTimeCache: Map<string, Date> = new Map<string, Date>();

    // The ADLS constructor for clientId/secret authentication.
    constructor(
        hostname?: string,
        root?: string,
        tenantOrSharedKeyorTokenProvider?: string | TokenProvider,
        clientId?: string,
        secret?: string,
        endpoint?: azureCloudEndpoint) {
        super();

        if (hostname && root) {
            this.hostname = hostname;
            this.root = root;

            if (tenantOrSharedKeyorTokenProvider) {
                if (typeof tenantOrSharedKeyorTokenProvider === 'string') {
                    if (tenantOrSharedKeyorTokenProvider && !clientId && !secret) {
                        this.sharedKey = tenantOrSharedKeyorTokenProvider;
                    } else if (tenantOrSharedKeyorTokenProvider && clientId && secret) {
                        this._tenant = tenantOrSharedKeyorTokenProvider;
                        this.clientId = clientId;
                        this.secret = secret;
                        this.endpoint = endpoint === undefined ? azureCloudEndpoint.AzurePublic : endpoint;
                    }
                } else {
                    this.tokenProvider = tenantOrSharedKeyorTokenProvider;
              }
            }
        }

        this.timeout = this.adlsDefaultTimeout;

        this.adapterPaths = new Map();
        this.httpClient = new CdmHttpClient();
    }

    public canRead(): boolean {
        return true;
    }

    public async readAsync(corpusPath: string): Promise<string> {
        const url: string = this.createFormattedAdapterPath(corpusPath);

        const cdmHttpRequest: CdmHttpRequest = await this.buildRequest(url, 'GET');

        const cdmHttpResponse: CdmHttpResponse = await super.executeRequest(cdmHttpRequest);

        return cdmHttpResponse.content;
    }

    public async writeAsync(corpusPath: string, data: string): Promise<void> {
        if (!this.ensurePath(`${this.root}${corpusPath}`)) {
            throw new Error(`Could not create folder for document ${corpusPath}`);
        }

        const url: string = this.createFormattedAdapterPath(corpusPath);

        let request: CdmHttpRequest = await this.buildRequest(`${url}?resource=file`, 'PUT');
        await super.executeRequest(request);

        request = await this.buildRequest(`${url}?action=append&position=0`, 'PATCH', data, "application/json; charset=utf-8");

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
        if (corpusPath === undefined || corpusPath === null) {
            return undefined;
        }

        const formattedCorpusPath: string = this.formatCorpusPath(corpusPath);

        if (formattedCorpusPath === undefined || formattedCorpusPath === null) {
            return undefined;
        }

        if (this.adapterPaths.has(formattedCorpusPath)) {
            return this.adapterPaths.get(formattedCorpusPath);
        } else {
            return `https://${this.removeProtocolFromHostname(this.hostname)}${this.getEscapedRoot()}${this.escapePath(formattedCorpusPath)}`;
        }
    }

    public createCorpusPath(adapterPath: string): string {
        if (adapterPath) {
            const startIndex: number = 'https://'.length;
            const endIndex: number = adapterPath.indexOf('/', startIndex + 1);

            if (endIndex < startIndex) {
                throw new Error(`Unexpected adapter path: ${adapterPath}`);
            }

            const hostname: string = this.formatHostname(adapterPath.substring(startIndex, endIndex));

            if (hostname === this.formattedHostname
                && adapterPath.substring(endIndex)
                    .startsWith(this.getEscapedRoot())) {
                const escapedCorpusPath: string = adapterPath.substring(endIndex + this.getEscapedRoot().length);
                const corpusPath: string = decodeURIComponent(escapedCorpusPath);
                if (!this.adapterPaths.has(corpusPath)) {
                    this.adapterPaths.set(corpusPath, adapterPath);
                }

                return corpusPath;
            }
        }

        return undefined;
    }

    public async computeLastModifiedTimeAsync(corpusPath: string): Promise<Date> {
        const cachedValue: Date = this.isCacheEnabled() ? this.fileModifiedTimeCache.get(corpusPath) : undefined;
        if (cachedValue) {
            return cachedValue;
        }
        else {

            const url: string = this.createFormattedAdapterPath(corpusPath);

            const request: CdmHttpRequest = await this.buildRequest(url, 'HEAD');

            const cdmResponse: CdmHttpResponse = await super.executeRequest(request);

            if (cdmResponse.statusCode === 200) {
                // http nodejs lib returns lowercase headers.
                // tslint:disable-next-line: no-backbone-get-set-outside-model
                const lastTimeString: string = cdmResponse.responseHeaders.get('last-modified');
                if (lastTimeString) {
                    const lastTime: Date = new Date(lastTimeString);
                    if (this.isCacheEnabled()) {
                        this.fileModifiedTimeCache.set(corpusPath, lastTime);
                    }
                    return lastTime;
                }
            }
        }
    }

    public async fetchAllFilesAsync(folderCorpusPath: string): Promise<string[]> {
        if (folderCorpusPath === undefined || folderCorpusPath === null) {
            return undefined;
        }

        const url: string = `https://${this.formattedHostname}/${this.rootBlobContainer}`;
        const escapedFolderCorpusPath: string = this.escapePath(folderCorpusPath);
        let directory: string = `${this.escapedRootSubPath}${this.formatCorpusPath(escapedFolderCorpusPath)}`;
        if (directory.startsWith('/')) {
            directory = directory.substring(1);
        }

        let continuationToken: string = null;
        const result: string[] = [];

        do {
            let request: CdmHttpRequest;
            if (continuationToken == null) {
                request = await this.buildRequest(`${url}?directory=${directory}&maxResults=${this.httpMaxResults}&recursive=True&resource=filesystem`, 'GET');
            } else {
                request = await this.buildRequest(`${url}?continuation=${encodeURIComponent(continuationToken)}&directory=${directory}&maxResults=${this.httpMaxResults}&recursive=True&resource=filesystem`, 'GET');
            }

            const cdmResponse: CdmHttpResponse = await super.executeRequest(request);

            if (cdmResponse.statusCode === 200) {

                continuationToken = cdmResponse.responseHeaders.has(this.httpXmsContinuation) ? cdmResponse.responseHeaders.get(this.httpXmsContinuation) : null;

                const json: string = cdmResponse.content;
                const jObject1 = JSON.parse(json);

                const jArray = jObject1.paths;

                for (const jObject of jArray) {
                    const isDirectory: boolean = jObject.isDirectory;
                    if (isDirectory === undefined || !isDirectory) {
                        const name: string = jObject.name;
                        const nameWithoutSubPath: string = this.unescapedRootSubPath.length > 0 && name.startsWith(this.unescapedRootSubPath) ?
                            name.substring(this.unescapedRootSubPath.length + 1) : name;

                        const path: string = this.formatCorpusPath(nameWithoutSubPath);
                        result.push(path);

                        if (jObject.lastModified && this.isCacheEnabled()) {
                            this.fileModifiedTimeCache.set(path, new Date(jObject.lastModified));
                        }
                    }
                }
            }
        } while (continuationToken != null);

        return result;
    }

    public clearCache(): void {
        this.fileModifiedTimeCache.clear();
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

        if (this.endpoint !== undefined) {
            configObject.endpoint = azureCloudEndpoint[this.endpoint];
        }

        resultConfig.config = configObject;

        return JSON.stringify(resultConfig);
    }

    public updateConfig(config: string): void {
        if (!config) {
            throw new TypeError('ADLS adapter needs a config.');
        }

        const configJson: configObjectType = JSON.parse(config);

        if (configJson.root) {
            this.root = configJson.root;
        } else {
            throw new TypeError('Root has to be set for ADLS adapter.');
        }

        if (configJson.hostname) {
            this.hostname = configJson.hostname;
        } else {
            throw new TypeError('Hostname has to be set for ADLS adapter.');
        }

        this.updateNetworkConfig(config);

        if (configJson.tenant && configJson.clientId) {
            this._tenant = configJson.tenant;
            this.clientId = configJson.clientId;

            // To keep backwards compatibility with config files that were generated before the introduction of the `endpoint` property.
            if (!this.endpoint) {
                this.endpoint = azureCloudEndpoint.AzurePublic;
            }
        }

        if (configJson.locationHint) {
            this.locationHint = configJson.locationHint;
        }

        if (configJson.endpoint) {
            const endpointStr = configJson.endpoint;
            if (Object.values(azureCloudEndpoint).includes(endpointStr)) {
                this.endpoint = azureCloudEndpoint[endpointStr as unknown as keyof azureCloudEndpoint];
            } else {
                throw new TypeError('Endpoint value should be a string of an enumeration value from the class AzureCloudEndpoint in Pascal case.');
            }
        }
    }

    private applySharedKey(sharedKey: string, url: string, method: string, content?: string, contentType?: string): Map<string, string> {
        const headers: Map<string, string> = new Map<string, string>();

        // Add UTC now time and new version.
        headers.set(this.httpXmsDate, new Date().toUTCString());
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
        builder += contentType ? `${contentType}\n` : '\n'; // Content-type.
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
        const accountName: string = uri.host.split('.')[0];
        builder += '/';
        builder += accountName;
        builder += uri.pathname;

        // Append canonicalized queries.
        if (uri.search) {
            const queryParameters: string[] = (uri.search.startsWith('?') ? uri.search.substr(1) : uri.search).split('&');

            for (const parameter of queryParameters) {
                const keyValuePair: string[] = parameter.split('=');
                builder += `\n${keyValuePair[0].toLowerCase()}:${decodeURIComponent(keyValuePair[1])}`;
            }
        }

        // hash the payload
        const dataToHash: string = builder.trimRight();
        const bytes: Buffer = Buffer.from(sharedKey, 'base64');

        const hmac: crypto.Hmac = crypto.createHmac('sha256', bytes);
        const signedString: string = `SharedKey ${accountName}:${hmac.update(dataToHash)
            .digest('base64')}`;
        headers.set(this.httpAuthorization, signedString);

        return headers;
    }

    /**
     * Appends SAS token to the given URL.
     * @param url URL to be appended with the SAS token
     * @returns URL with the SAS token appended
     */
    private applySasToken(url: string): string {
        return `${url}${url.includes('?') ? '&' : '?'}${this.sasToken}`;
    }

    private async buildRequest(url: string, method: string, content?: string, contentType?: string): Promise<CdmHttpRequest> {
        let request: CdmHttpRequest;

        // Check whether we support shared key or clientId/secret auth
        if (this.sharedKey) {
            request = this.setUpCdmRequest(url, this.applySharedKey(this.sharedKey, url, method, content, contentType), method);
        } else if (this.sasToken) {
            request = this.setUpCdmRequest(this.applySasToken(url), null, method);
        } else if (this.tenant && this.clientId && this.secret) {
            const token: msal.AuthenticationResult = await this.generateBearerToken();
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

    private createFormattedAdapterPath(corpusPath: string): string {
        const adapterPath: string = this.createAdapterPath(corpusPath);

        return adapterPath ? adapterPath.replace(this.hostname, this.formattedHostname) : undefined;
    }

    private ensurePath(pathFor: string): boolean {
        if (pathFor.lastIndexOf('/') === -1) {
            return false;
        }

        // Folders are only of virtual kind in Azure Storage
        return true;
    }

    private escapePath(unescapedPath: string): string {
        return encodeURIComponent(unescapedPath)
            .replace(/%2F/g, '/');
    }

    private extractRootBlobContainerAndSubPath(root: string): string {
        // No root value was set
        if (!root) {
            this.rootBlobContainer = '';
            this.updateRootSubPath('');

            return '';
        }

        // Remove leading and trailing /
        let prepRoot: string = root.startsWith('/') ? root.substring(1) : root;
        prepRoot = prepRoot.endsWith('/') ? prepRoot.substring(0, prepRoot.length - 1) : prepRoot;

        // Root contains only the file-system name, e.g. "fs-name"
        if (prepRoot.indexOf('/') === -1) {
            this.rootBlobContainer = prepRoot;
            this.updateRootSubPath('');

            return `/${this.rootBlobContainer}`;
        }

        // Root contains file-system name and folder, e.g. "fs-name/folder/folder..."
        const prepRootArray: string[] = prepRoot.split('/');
        this.rootBlobContainer = prepRootArray[0];
        this.updateRootSubPath(prepRootArray.slice(1)
            .join('/'));

        return `/${this.rootBlobContainer}/${this.unescapedRootSubPath}`;
    }

    private formatCorpusPath(corpusPath: string): string {
        const pathTuple: [string, string] = StorageUtils.splitNamespacePath(corpusPath);
        if (!pathTuple) {
            return undefined;
        }

        corpusPath = pathTuple[1];

        if (corpusPath.length > 0 && !corpusPath.startsWith('/')) {
            corpusPath = `/${corpusPath}`;
        }

        return corpusPath;
    }

    private formatHostname(hostname: string): string {
        hostname = hostname.replace('.blob.', '.dfs.');

        const port: string = ':443';

        if (hostname.includes(port)) {
            hostname = hostname.substr(0, hostname.length - port.length);
        }

        return hostname;
    }

    private async generateBearerToken(): Promise<msal.AuthenticationResult> {
        this.buildContext();
        return new Promise<msal.AuthenticationResult>((resolve, reject) => {
            const clientCredentialRequest = {
                scopes: this.scopes,
            };
            this.context.acquireTokenByClientCredential(clientCredentialRequest).then((response) => {
                if (response.accessToken && response.accessToken.length !== 0 && response.tokenType) {
                    resolve(response);
                }
                reject(Error('Received invalid ADLS Adapter\'s authentication result. The result might be null, or missing access token or/and token type from the authentication result.'));
            }).catch((error) => {
                reject(Error('There was an error while acquiring ADLS Adapter\'s Token with client ID/secret authentication. Exception:' + JSON.stringify(error)));
            });
        });
    }

    private getEscapedRoot(): string {
        return this.escapedRootSubPath ?
            `/${this.rootBlobContainer}/${this.escapedRootSubPath}`
            : `/${this.rootBlobContainer}`;
    }

    private updateRootSubPath(value: string): void {
        this.unescapedRootSubPath = value;
        this.escapedRootSubPath = this.escapePath(this.unescapedRootSubPath);
    }

    // Build context when users make the first call. Also need to ensure client Id, tenant and secret are not null.
    private buildContext(): void {
        if (this.context === undefined) {
            const clientConfig = {
                auth: {
                    clientId: this.clientId,
                    authority: `${AzureCloudEndpointConvertor.azureCloudEndpointToURL(this.endpoint)}${this.tenant}`,
                    clientSecret: this.secret
                }
            };
            this.context = new msal.ConfidentialClientApplication(clientConfig);
        }
    }

    /**
     * Check if the hostname has a leading protocol. 
     * if it doesn't have, return the hostname
     * if the leading protocol is not "https://", throw an error
     * otherwise, return the hostname with no leading protocol.
     * @param {string} hostname The hostname.
     * @return The hostname without the leading protocol "https://" if original hostname has it, otherwise it is same as hostname.
     */
    private removeProtocolFromHostname(hostname: string): string {
        if (hostname.indexOf('://') == -1) {
            return hostname;
        }

        try {
            const url = new URL(hostname);
            if (url.protocol === 'https:') {
                return hostname.substring('https://'.length);
            } 
        } catch (error) {
            throw new URIError('Please provide a valid hostname.');
        }
        throw new URIError('ADLS Adapter only supports HTTPS, please provide a leading \"https://\" hostname or a non-protocol-relative hostname.');
    }
}
