// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as http from 'http';
import { CdmHttpClient } from '../../Utilities/Network/CdmHttpClient';
import { CdmHttpRequest } from '../../Utilities/Network/CdmHttpRequest';
import { CdmHttpResponse } from '../../Utilities/Network/CdmHttpResponse';
import { CdmNumberOfRetriesExceededException } from '../../Utilities/Network/CdmNumberOfRetriesExceededException';
import { CdmTimedOutException } from '../../Utilities/Network/CdmTimedOutException';

let requestsExecutionCounter: number = 0;

describe('Network/MockCdmHttpClientTest', () => {
    /**
     * Testing for an immediate success.
     */
    it('Mock Cdm Http client testing for an immediate success.', async () => {
        const client: CdmHttpClient = new CdmHttpClient('http://www.example.com', completeResponseMethod);
        const httpRequest: CdmHttpRequest = new CdmHttpRequest('/folder1', 0);

        httpRequest.timeout = 1000;
        httpRequest.maximumTimeout = 10000;

        const response: CdmHttpResponse = await client.SendAsync(httpRequest, callback);

        expect(response.statusCode)
            .toBe(200);
    });

    /**
     * Testing for a failure then success with the callback.
     */
    it('Mock Cdm Http client testing for a failure then success with the callback.', async () => {
        requestsExecutionCounter = 0;

        const client: CdmHttpClient = new CdmHttpClient('http://www.example.com', delayedResponseMethod);
        const httpRequest: CdmHttpRequest = new CdmHttpRequest('/folder1', 1, 'GET');

        httpRequest.timeout = 2000;
        httpRequest.maximumTimeout = 10000;
        httpRequest.numberOfRetries = 2;

        const headers: Map<string, string> = new Map<string, string>();
        headers.set('User-Agent', 'CDM');
        httpRequest.headers = headers;

        const response: CdmHttpResponse = await client.SendAsync(httpRequest, callback);

        expect(response.statusCode)
            .toBe(200);
    });

    /**
     * Testing for a failure - number of exceeded retries.
     */
    it('Mock Cdm Http client testing for a failure - number of exceeded retries.', async () => {
        requestsExecutionCounter = 0;
        const client: CdmHttpClient = new CdmHttpClient('http://www.example.com', delayedResponseMethod);
        const httpRequest: CdmHttpRequest = new CdmHttpRequest('/folder1');

        httpRequest.timeout = 100;
        httpRequest.maximumTimeout = 10000;
        httpRequest.numberOfRetries = 2;
        httpRequest.method = 'GET';

        const headers: Map<string, string> = new Map<string, string>();
        headers.set('User-Agent', 'CDM');
        httpRequest.headers = headers;

        try {
            await client.SendAsync(httpRequest, callback);
            throw new Error('This test case should\'ve failed and throw an exception due too many retries.');
        } catch (err) {
            expect(err)
                .toBeInstanceOf(CdmNumberOfRetriesExceededException);
        }
    });

    /**
     * Testing for a timeout.
     */
    it('Mock Cdm Http client testing for a timeout.', async () => {
        requestsExecutionCounter = 0;
        const client: CdmHttpClient = new CdmHttpClient('http://www.example.com', delayedResponseMethod);
        const httpRequest: CdmHttpRequest = new CdmHttpRequest('/folder1');

        httpRequest.timeout = 2000;
        httpRequest.maximumTimeout = 20000;
        httpRequest.numberOfRetries = 0;

        try {
            await client.SendAsync(httpRequest, callback);
            throw new Error('This test case should\'ve failed and throw an exception due timeout.');
        } catch (err) {
            expect(err)
                .toBeInstanceOf(CdmTimedOutException);
        }
    });

    /**
     * Testing for a maximum timeout.
     */
    it('Mock Cdm Http client testing for a maximum timeout.', async () => {
        requestsExecutionCounter = 0;
        const client: CdmHttpClient = new CdmHttpClient('http://www.example.com', delayedResponseMethod);
        const httpRequest: CdmHttpRequest = new CdmHttpRequest('/folder1');

        httpRequest.timeout = 200;
        httpRequest.maximumTimeout = 3500;
        httpRequest.numberOfRetries = 20;

        try {
            await client.SendAsync(httpRequest, callback);
            throw new Error('This test case should\'ve failed and throw an exception due timeout.');
        } catch (err) {
            expect(err)
                .toBe('Maximum timeout exceeded.');
        }
    });

    function completeResponseMethod(fullUrl: string, method: string, requestTimeout: number, content: string, outgoingHeaders: http.OutgoingHttpHeaders) {
        return new Promise<CdmHttpResponse>(async (resolve, reject) => {
            await CdmHttpClient.sleep(100);
            resolve(new CdmHttpResponse(200));
        });
    }

    async function delayedResponseMethod(fullUrl: string, method: string, requestTimeout: number, content: string, outgoingHeaders: http.OutgoingHttpHeaders): Promise<CdmHttpResponse> {
        const waitTime: number = requestsExecutionCounter == 0 ? 4000 : 2000;
        requestsExecutionCounter++;

        const cancelled = requestTimeout < waitTime;

        await CdmHttpClient.sleep(Math.min(waitTime, requestTimeout));

        if (cancelled) {
            const error = {
                code: 'ECONNRESET'
            }
            throw error;
        }

        const response: CdmHttpResponse = new CdmHttpResponse(200);
        response.content = 'REPLY2';

        return response;
    }
});

function callback(response: CdmHttpResponse, hasFailed: boolean, retryNumber: number): number {
    if (response !== undefined && response.isSuccessful && !hasFailed) {
        return undefined;
    } else {
        const upperBound: number = 1 << retryNumber;

        // Default wait time is calculated using exponential backoff with with random jitter value to avoid 'waves'.
        return Math.floor(Math.random() * upperBound) * 500;
    }
}
