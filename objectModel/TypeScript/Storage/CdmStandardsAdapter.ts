// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmHttpClient, CdmHttpRequest, CdmHttpResponse } from '../Utilities/Network';
import { NetworkAdapter } from './NetworkAdapter';
import { configObjectType, StorageAdapter } from './StorageAdapter';

/**
 * An adapter pre-configured to read the standard schema files published by CDM.
 */
export class CdmStandardsAdapter extends NetworkAdapter {
    private readonly STANDARDS_ENDPOINT = "https://cdm-schema.microsoft.com";
    /**
     * @internal
     */
    public readonly type: string = "cdm-standards";
    public locationHint: string;
    public root: string;

    /**
     * Constructs a CdmStandardsAdapter.
     * @param root The root path specifies either to read the standard files in logical or resolved form.
     */
    constructor(root: string = "/logical") {
        super();

        this.httpClient = new CdmHttpClient(this.STANDARDS_ENDPOINT);
        this.root = root;
    }

    /**
     * The combinating of the standards endpoint and the root path.
     */
    private get absolutePath(): string {
        return this.STANDARDS_ENDPOINT + this.root;
    }

    public canRead(): boolean {
        return true;
    }

    public async readAsync(corpusPath: string): Promise<string> {
        const cdmHttpRequest: CdmHttpRequest =
            this.setUpCdmRequest(
                `${this.root}${corpusPath}`,
                null,
                'GET'
            );

        const cdmHttpResponse: CdmHttpResponse = await super.executeRequest(cdmHttpRequest);

        return cdmHttpResponse.content;
    }

    public canWrite(): boolean {
        return false;
    }

    public async writeAsync(corpusPath: string, data: string): Promise<void> {
        throw new Error('Write operation not supported.');
    }

    public createAdapterPath(corpusPath: string): string {
        return `${this.absolutePath}${corpusPath}`;
    }

    public createCorpusPath(adapterPath: string): string {
        if (!adapterPath.startsWith(this.absolutePath)) {
            return undefined;
        }

        return adapterPath.slice(this.absolutePath.length);;
    }

    public async computeLastModifiedTimeAsync(corpusPath: string): Promise<Date> {
        return new Date();
    }

    public async fetchAllFilesAsync(currFullPath: string): Promise<string[]> {
        return undefined;
    }

    public clearCache(): void {}

    public fetchConfig(): string {
        const resultConfig: configObjectType = {
            type: this.type
        };

        // Construct network configs.
        const configObject: configObjectType = this.fetchNetworkConfig();

        if (this.locationHint) {
            configObject.locationHint = this.locationHint;
        }

        if (this.root) {
            configObject.root = this.root;
        }

        resultConfig.config = configObject;

        return JSON.stringify(resultConfig);
    }

    public updateConfig(config: string): void {
        if (!config) {
            // It is fine just to skip it for GitHub adapter.
            return;
        }

        this.updateNetworkConfig(config);

        const configJson: configObjectType = JSON.parse(config);

        if (configJson.locationHint) {
            this.locationHint = JSON.stringify(configJson.locationHint);
        }

        if (configJson.root) {
            this.root = JSON.stringify(configJson.root);
        }
    }
}
