// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as http from 'http';
import { CdmHttpClient } from '../../Utilities/Network/CdmHttpClient';
import { CdmHttpRequest } from '../../Utilities/Network/CdmHttpRequest';
import { CdmHttpResponse } from '../../Utilities/Network/CdmHttpResponse';

let method2executedTimes: number = 0;

describe('Network/MockCdmHttpClientTest', () => {
    /**
     * Testing for an immediate success.
     */
    it('Mock Cdm Http client testing for an immediate success.', async () => {
        const client: CdmHttpClient = new CdmHttpClient('http://www.example.com', method1);
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
        method2executedTimes = 0;

        const client: CdmHttpClient = new CdmHttpClient('http://www.example.com', method2);
        const httpRequest: CdmHttpRequest = new CdmHttpRequest('/folder1', 1, 'GET');

        httpRequest.timeout = 2000;
        httpRequest.maximumTimeout = 10000;
        httpRequest.numberOfRetries = 2;

        const dict: Map<string, string> = new Map<string, string>();
        dict.set('User-Agent', 'CDM');
        httpRequest.headers = dict;

        const response: CdmHttpResponse = await client.SendAsync(httpRequest, callback);

        expect(response.statusCode)
            .toBe(200);
    });

    /**
     * Testing for a failure - number of exceeded retries.
     */
    it('Mock Cdm Http client testing for a failure - number of exceeded retries.', async () => {
        method2executedTimes = 0;
        const client: CdmHttpClient = new CdmHttpClient('http://www.example.com', method2);
        const httpRequest: CdmHttpRequest = new CdmHttpRequest('/folder1');

        httpRequest.timeout = 100;
        httpRequest.maximumTimeout = 10000;
        httpRequest.numberOfRetries = 2;
        httpRequest.method = 'GET';

        const dict: Map<string, string> = new Map<string, string>();
        dict.set('User-Agent', 'CDM');
        httpRequest.headers = dict;

        try {
            await client.SendAsync(httpRequest, callback);
            fail('This test case should\'ve failed and throw an exception due too many retries.');
        } catch (err) {
            expect(err)
                .toBe('The number of retries has exceeded the maximum number allowed by the client.');
        }
    });

    /**
     * Testing for a timeout.
     */
    it('Mock Cdm Http client testing for a timeout.', async () => {
        method2executedTimes = 0;
        const client: CdmHttpClient = new CdmHttpClient('http://www.example.com', method2);
        const httpRequest: CdmHttpRequest = new CdmHttpRequest('/folder1');

        httpRequest.timeout = 2000;
        httpRequest.maximumTimeout = 20000;
        httpRequest.numberOfRetries = 0;

        try {
            await client.SendAsync(httpRequest, callback);
            fail('This test case should\'ve failed and throw an exception due timeout.');
        } catch (err) {
            expect(err)
                .toBe('Request timeout.');
        }
    });

    /**
     * Testing for a maximum timeout.
     */
    it('Mock Cdm Http client testing for a maximum timeout.', async () => {
        method2executedTimes = 0;
        const client: CdmHttpClient = new CdmHttpClient('http://www.example.com', method2);
        const httpRequest: CdmHttpRequest = new CdmHttpRequest('/folder1');

        httpRequest.timeout = 200;
        httpRequest.maximumTimeout = 3500;
        httpRequest.numberOfRetries = 20;

        try {
            await client.SendAsync(httpRequest, callback);
            fail('This test case should\'ve failed and throw an exception due timeout.');
        } catch (err) {
            expect(err)
                .toBe('Maximum timeout exceeded.');
        }
    });

    function method1(fullUrl: string, method: string, content: string, outgoingHeaders: http.OutgoingHttpHeaders) {
        return new Promise<CdmHttpResponse>(async (resolve, reject) => {
            await CdmHttpClient.sleep(100);
            resolve(new CdmHttpResponse(200));
        });
    }

    function method2(fullUrl: string, method: string, content: string, outgoingHeaders: http.OutgoingHttpHeaders) {
        return new Promise<CdmHttpResponse>(async (resolve, reject) => {
            method2executedTimes++;
            if (method2executedTimes === 1) {
                await CdmHttpClient.sleep(3000);
                resolve(new CdmHttpResponse(500));
            } else {
                await CdmHttpClient.sleep(300);
                const res: CdmHttpResponse = new CdmHttpResponse(200);
                res.isSuccessful = true;
                resolve(res);
            }
        });
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
