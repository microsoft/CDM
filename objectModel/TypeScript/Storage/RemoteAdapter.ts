// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmHttpClient, CdmHttpRequest, CdmHttpResponse } from '../Utilities/Network';
import { NetworkAdapter } from './NetworkAdapter';
import { configObjectType, StorageAdapter } from './StorageAdapter';

interface HostInfo {
    key?: string;
    protocol: string;
    host: string;
    path?: string;
}

export class RemoteAdapter extends NetworkAdapter {
    /**
     * @internal
     */
    public readonly type: string = 'remote';

    private sources: { [key: string]: string } = {};
    private sourcesById: { [key: string]: { protocol: string; host: string } } = {};
    private _hosts: Map<string, string>;

    constructor(hosts?: Map<string, string>) {
        super();
        if (hosts) {
            this.hosts = hosts;
        }
        // Create a new CDM Http Client without base URL.
        this.httpClient = new CdmHttpClient();
    }

    public get hosts(): Map<string, string> {
        return this._hosts;
    }

    public set hosts(val: Map<string, string>) {
        this._hosts = val;
        for (const pair of this._hosts) {
            this.getOrRegisterHostInfo(pair[1], pair[0]);
        }
    }

    public clearCache(): void {
        this.sources = {};
        this.sourcesById = {};
    }

    public canRead(): boolean {
        return true;
    }

    public async readAsync(corpusPath: string): Promise<string> {
        const url: string = this.createAdapterPath(corpusPath);

        const cdmHttpRequest: CdmHttpRequest = this.setUpCdmRequest(url, new Map<string, string>([['User-Agent', 'CDM']]), 'GET');

        const cdmHttpResponse: CdmHttpResponse = await super.executeRequest(cdmHttpRequest);

        return cdmHttpResponse.content.toString();
    }

    public createAdapterPath(corpusPath: string): string {
        const urlConfig: HostInfo = this.getUrlConfig(corpusPath);

        return `${urlConfig.protocol}://${urlConfig.host}${urlConfig.path}`;
    }

    public createCorpusPath(adapterPath: string): string {
        if (!adapterPath) {
            return undefined;
        }
        const protocolIndex: number = adapterPath.indexOf('://');

        if (protocolIndex === -1) {
            return;
        }

        const pathIndex: number = adapterPath.indexOf('/', protocolIndex + 3);
        const path: string = pathIndex !== -1 ? adapterPath.slice(pathIndex) : '';

        const hostInfo: HostInfo = this.getOrRegisterHostInfo(adapterPath);

        return `/${hostInfo.key}${path}`;
    }

    private getGuid(): string {
        let guid: string;
        // make sure that there is no collision of keys.
        do {
            // tslint:disable-next-line:insecure-random
            guid = Math.random()
                .toString(36)
                .substring(7);
        } while (!!this.sourcesById[guid]);

        return guid;
    }

    public fetchConfig(): string {
        const resultConfig: configObjectType = {
            type: this.type
        };

        const hostsArray = [];

        const configObject: configObjectType = {};

        // Go through the Hosts dictionary and build a JObject for each item.
        for (const host of this.hosts) {
            const hostItem = {};
            hostItem[host[0]] = host[1];

            hostsArray.push(hostItem);
        }

        configObject.hosts = hostsArray;

        // Try constructing network configs.
        const networkConfigList: configObjectType = this.fetchNetworkConfig();
        for (const prop of Object.keys(networkConfigList)) {
            configObject[prop] = networkConfigList[prop];
        }

        if (this.locationHint) {
            configObject.locationHint = this.locationHint;
        }

        resultConfig.config = configObject;

        return JSON.stringify(resultConfig);
    }

    /// <inheritdoc />
    public updateConfig(config: string): void {
        if (!config) {
            throw new Error('Remote adapter needs a config.');
        }

        this.updateNetworkConfig(config);

        const configJson = JSON.parse(config);

        if (configJson.locationHint) {
            this.locationHint = configJson.locationHint;
        }

        const hosts = configJson.hosts;

        // Create a temporary dictionary.
        const hostsDict: Map<string, string> = new Map<string, string>();

        // Iterate through all of the items in the hosts array.
        for (const host of hosts) {
            // Get the property's key and value and save it to the dictionary.
            for (const hostProperty of Object.entries(host)) {
                hostsDict.set(hostProperty[0], hostProperty[1] as string);
            }
        }

        // Assign the temporary dictionary to the Hosts dictionary.
        this.hosts = hostsDict;
    }

    private getOrRegisterHostInfo(adapterPath: string, key?: string): HostInfo {
        const protocolIndex: number = adapterPath.indexOf('://');

        if (protocolIndex === -1) {
            return;
        }

        const pathIndex: number = adapterPath.indexOf('/', protocolIndex + 3);
        const hostIndex: number = pathIndex !== -1 ? pathIndex : adapterPath.length;

        const protocol: string = adapterPath.slice(0, protocolIndex);
        const host: string = adapterPath.slice(protocolIndex + 3, hostIndex);
        const fullHost: string = adapterPath.slice(0, hostIndex);

        if (!this.sources[fullHost] || (key !== undefined && this.sources[fullHost] !== key)) {
            const guid: string = key ? key : this.getGuid();
            this.sources[fullHost] = guid;
            this.sourcesById[guid] = {
                protocol,
                host
            };
        }

        return {
            key: this.sources[fullHost],
            protocol,
            host
        };
    }

    private getUrlConfig(corpusPath: string): HostInfo {
        const hostKeyIndex: number = corpusPath.indexOf('/', 1);
        const hostKey: string = corpusPath.slice(1, hostKeyIndex);

        if (!this.sourcesById[hostKey]) {
            throw new Error('Host id not identified by remote adapter. Make sure to use makeCorpusPath to get the corpus path.');
        }

        const path: string = corpusPath.slice(hostKeyIndex);

        return {
            ...this.sourcesById[hostKey],
            path
        };
    }
}
