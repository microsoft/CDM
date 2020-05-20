// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmHttpResponse } from '../Utilities/Network/CdmHttpResponse';

/**
 * Contains the interface for the callback function that is getting called every time a CDM Http client executes a network request. 
 */
export interface StorageAdapterConfigCallback {
    /**
     * The callback function for a CDM Http client.
     * @param {CdmHttpResponse} response The response received by system's Http client.
     * @param {boolean} hasFailed Denotes whether the request has failed (usually an exception or 500 error).
     * @param {number} retryNumber The current retry number (starts from 1) up to the number of retries specified by a CDM request.
     * @return {number}, specifying the waiting time in milliseconds, or undefined if no wait time is necessary.
     */
    (response: CdmHttpResponse, hasFailed: boolean, retryNumber: number): number;
}
