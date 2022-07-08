// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmHttpClient } from '../../Utilities/Network/CdmHttpClient';
import { CdmHttpRequest } from '../../Utilities/Network/CdmHttpRequest';
import { CdmHttpResponse } from '../../Utilities/Network/CdmHttpResponse';
import { CdmNumberOfRetriesExceededException } from '../../Utilities/Network/CdmNumberOfRetriesExceededException';

describe('Network/CdmHttpClientTest', () => {
    /**
     * Testing for a successful return of a result from Cdm Http Client.
     */
    it('Cdm Http client returns the result.', async () => {
        const githubUrl: string = 'https://raw.githubusercontent.com/';
        const corpusPath: string = '/Microsoft/CDM/master/schemaDocuments/foundations.cdm.json';

        const client: CdmHttpClient = new CdmHttpClient(githubUrl);
        const request: CdmHttpRequest = new CdmHttpRequest(corpusPath, 1, 'GET');

        request.timeout = 5000;
        request.maximumTimeout = 10000;

        const dict: Map<string, string> = new Map<string, string>();
        // tslint:disable-next-line: no-backbone-get-set-outside-model
        dict.set('User-Agent', 'CDM');
        request.headers = dict;

        const response: CdmHttpResponse = await client.SendAsync(request, callback);

        expect(response.content)
            .toBeDefined();
    });

    /**
     * Testing for a failed return of a result back from Cdm Http Client.
     */
    it('Cdm Http client returns the error back.', async () => {
        const githubUrl: string = 'https://raw.githubusercontent2.com/';
        const corpusPath: string = '/Microsoft/CDM/master/schemaDocuments/foundations.cdm.json';

        const client: CdmHttpClient = new CdmHttpClient(githubUrl);
        const request: CdmHttpRequest = new CdmHttpRequest(corpusPath, 1, 'GET');

        request.timeout = 5000;
        request.maximumTimeout = 10000;

        const dict: Map<string, string> = new Map<string, string>();
        // tslint:disable-next-line: no-backbone-get-set-outside-model
        dict.set('User-Agent', 'CDM');
        request.headers = dict;

        await expect(client.SendAsync(request, callback))
            .rejects
            .toThrowError(new CdmNumberOfRetriesExceededException('The number of retries has exceeded the maximum number allowed by the client.'));
    });
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
