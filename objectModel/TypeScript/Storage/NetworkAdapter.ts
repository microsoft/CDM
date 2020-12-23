// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmHttpClient, CdmHttpRequest, CdmHttpResponse } from '../Utilities/Network';
import { configObjectType } from './StorageAdapter';
import { StorageAdapterConfigCallback } from './StorageAdapterConfigCallback';
import { StorageAdapterBase } from './StorageAdapterBase'

/**
 * Network adapter is an abstract class that contains logic for adapters dealing with data across network.
 * Please see GithubAdapter, AdlsAdapter or RemoteAdapter for usage of this class.
 * When extending this class a user has to define CdmHttpClient with the specified endpoint and callback function in the constructor
 * and can then use the class helper methods to set up Cdm HTTP requests and read data.
 * If a user doesn't specify timeout, maximutimeout or number of retries in the config under 'httpConfig' property
 * default values will be used as specified in the class.
 */
export abstract class NetworkAdapter extends StorageAdapterBase {

    // Use some default values in the case a user doesn't set them up.
    protected readonly defaultTimeout: number = 5000;
    protected readonly defaultMaximumTimeout: number = 10000;
    protected readonly defaultNumberOfRetries: number = 2;
    protected readonly defaultShortestTimeWait: number = 500;

    protected httpClient: CdmHttpClient;

    protected _timeout: number = this.defaultTimeout;
    protected _maximumTimeout: number = this.defaultMaximumTimeout;
    protected _numberOfRetries: number = this.defaultNumberOfRetries;
    protected _waitTimeCallback: StorageAdapterConfigCallback;

    public get timeout(): number {
        return this._timeout;
    }

    public set timeout(val: number) {
        this._timeout = (val === undefined || val < 0) ? this.defaultTimeout : val;
    }

    public get maximumTimeout(): number {
        return this._maximumTimeout;
    }

    public set maximumTimeout(val: number) {
        this._maximumTimeout = (val === undefined || val < 0) ? this.defaultMaximumTimeout : val;
    }

    public get numberOfRetries(): number {
        return this._numberOfRetries;
    }

    public set numberOfRetries(val: number) {
        this._numberOfRetries = (val === undefined || val < 0) ? this.defaultNumberOfRetries : val;
    }

    public get waitTimeCallback(): StorageAdapterConfigCallback {
        return this._waitTimeCallback ? this._waitTimeCallback : this.defaultWaitTimeCallback;
    }

    public set waitTimeCallback(val: StorageAdapterConfigCallback) {
        this._waitTimeCallback = val;
    }

    public updateNetworkConfig(config: string): void {
        const configsJson: configObjectType = JSON.parse(config);

        if (configsJson.timeout !== undefined) {
            this.timeout = configsJson.timeout;
        }

        if (configsJson.maximumTimeout !== undefined) {
            this.maximumTimeout = configsJson.maximumTimeout;
        }

        if (configsJson.numberOfRetries !== undefined) {
            this.numberOfRetries = configsJson.numberOfRetries;
        }
    }

    public fetchNetworkConfig(): configObjectType {
        return {
            timeout: this.timeout,
            maximumTimeout: this.maximumTimeout,
            numberOfRetries: this.numberOfRetries
        };
    }

    protected async executeRequest(httpRequest: CdmHttpRequest): Promise<CdmHttpResponse> {
        try {
            const res: CdmHttpResponse = await this.httpClient.SendAsync(httpRequest, this.waitTimeCallback.bind(this), this.ctx);

            if (res === undefined) {
                throw new Error('The result of a network adapter request is undefined.');
            }

            if (!res.isSuccessful) {
                throw new Error(
                    `HTTP ${res.statusCode} - ${res.reason}. Response headers: ${Array.from(res.responseHeaders.entries()).map((m) => `${m[0]}:${m[1]}`).join(', ')}. URL: ${httpRequest.requestedUrl}`);
            }

            return res;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Sets up a CDM request that can be used by CDM Http Client.
     * @param {string} path The partial or full path to a network location.
     * @param {number} numberOfRetries The number of retries.
     * @param {Map<string, string>} headers The headers.
     * @param {string} method The HTTP method.
     * @return {CdmHttpRequest}, representing the CDM HTTP request.
     */
    protected setUpCdmRequest(path: string, headers: Map<string, string>, method: string): CdmHttpRequest {
        const httpRequest: CdmHttpRequest = new CdmHttpRequest(path);

        httpRequest.headers = headers ? headers : new Map<string, string>();
        httpRequest.timeout = this.timeout;
        httpRequest.maximumTimeout = this.maximumTimeout;
        httpRequest.numberOfRetries = this.numberOfRetries;
        httpRequest.method = method;

        return httpRequest;
    }

    /**
     * The callback function for CDM Http client, it does exponential backoff.
     * @param {CdmHttpResponse} response The response received by system's Http client.
     * @param {boolean} hasFailed Denotes whether the request has failed (usually an exception or 500 error).
     * @param {number} retryNumber The current retry number (starts from 1) up to the number of retries specified by a CDM request.
     * @return {number}, specifying the waiting time in milliseconds, or undefined if no wait time is necessary.
     */
    protected defaultWaitTimeCallback(response: CdmHttpResponse, hasFailed: boolean, retryNumber: number): number {
        if (response !== undefined && response.isSuccessful && !hasFailed) {
            return undefined;
        } else {
            const upperBound: number = 1 << retryNumber;

            // Default wait time is calculated using exponential backoff with with random jitter value to avoid 'waves'.
            return Math.floor(Math.random() * upperBound) * this.defaultShortestTimeWait;
        }
    }
}
