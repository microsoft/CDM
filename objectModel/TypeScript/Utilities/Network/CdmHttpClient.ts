// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as http from 'http';
import * as https from '../../Storage/request';
import { CdmCorpusContext } from '../../Cdm/CdmCorpusContext';
import { StorageAdapterConfigCallback } from '../../Storage/StorageAdapterConfigCallback';
import { Logger } from '../Logging/Logger';
import { CdmHttpRequest } from './CdmHttpRequest';
import { CdmHttpResponse } from './CdmHttpResponse';
import { HttpRequestCallback } from './HttpRequestCallback';
import { CdmTimedOutException } from './CdmTimedOutException';
import { CdmNumberOfRetriesExceededException } from './CdmNumberOfRetriesExceededException';

const REQUEST_TIMEOUT: string = 'Request timeout.';

/**
 * CDM Http Client is an HTTP client which implements retry logic to execute retries in the case of failed requests.
 * A user can specify API endpoint when creating the client and additional path in the CDM HTTP request.
 * Alternatively, if a user doesn't specify API endpoint in the client, it has to specify the full path in the request.
 * The client also expects a user to specify callback function which will be used in the case of a failure
 * (4xx or 5xx HTTP standard status codes).
 */
export class CdmHttpClient {

    private TAG: string = CdmHttpClient.name;
    /**
     * @internal
     */
    public headers: Map<string, string>;

    private apiEndpoint: string;

    private httpHandler: HttpRequestCallback;

    /**
     * Initializes a new instance of the CdmHttpClient.
     * @param {string} apiEndpoint The API endpoint
     * @param {HttpRequestCallback} httpHandler The HTTP handler which implements the interface to support injection of
     * different system's http request methods.
     */
    constructor(apiEndpoint?: string, httpHandler?: HttpRequestCallback) {
        this.headers = new Map<string, string>();

        this.apiEndpoint = apiEndpoint;

        if (httpHandler !== undefined) {
            this.httpHandler = httpHandler;
        } else {
            // No handler specified, use the default one to make real requests.
            this.httpHandler = https.requestUrl;
        }
    }

    /**
     * Executes a promise that will wait for some specified amount of time by using timeout.
     * @param {number} ms The wait time in milliseconds.
     * @return {Promise}
     */
    public static async sleep(ms: number): Promise<void> {
        return new Promise((resolve => setTimeout(resolve, ms)));
    }

    /**
     * Combine the base URL with the URL's suffix.
     * @param {string} baseUrl The base URL.
     * @param {string} suffix The suffix.
     * @return {string} representing the concatenated URL.
     */
    private static Combine(baseUrl: string, suffix: string): string {
        baseUrl = baseUrl.replace(/^[\/]+|[\/]+$/g, '');
        suffix = suffix.replace(/^[\/]+|[\/]+$/g, '');

        return `${baseUrl}/${suffix}`;
    }

    /**
     * @internal
     * Sends a CDM request with the retry logic.
     * @param {CdmHttpRequest} cdmRequest The CDM Http request.
     * @param {StorageAdapterConfigCallback} callback An optional parameter which specifies a callback function that gets
     * executed after we try to execute the HTTP request.
     * @return {Promise}, representing the CDM HTTP response.
     */
    public async SendAsync(
        cdmRequest: CdmHttpRequest,
        callback?: StorageAdapterConfigCallback,
        ctx?: CdmCorpusContext): Promise<CdmHttpResponse> {
        // Merge headers first.
        this.headers.forEach((value: string, key: string) => {
            cdmRequest.headers.set(key, value);
        });

        // Start counting the time for this request.
        cdmRequest.start();

        try {
            return await this.SendAsyncHelper(cdmRequest, callback, ctx);
        } catch (e) {
            if (e instanceof CdmTimedOutException && cdmRequest.maximumTimeoutExceeded) {
                throw 'Maximum timeout exceeded.';
            }
            throw e;
        }
    }

    /**
     * Sends a CDM request with the retry logic helper function.
     * @param {CdmHttpRequest} cdmRequest The CDM Http request.
     * @param {StorageAdapterConfigCallbackequest} callback An optional parameter which specifies the adapter which
     * contains the callback function that gets executed after we try to execute the HTTP request.
     * @return {Promise}, representing the CDM HTTP response.
     */
    private async SendAsyncHelper(
        cdmRequest: CdmHttpRequest,
        callback?: StorageAdapterConfigCallback,
        ctx?: CdmCorpusContext): Promise<CdmHttpResponse> {
        let fullUrl: string;

        if (this.apiEndpoint !== undefined) {
            fullUrl = CdmHttpClient.Combine(this.apiEndpoint, cdmRequest.stripSasSig());
        } else {
            fullUrl = cdmRequest.requestedUrl;
        }

        // Specific to TS, we have no other way of specifying the content type.
        if (cdmRequest.contentType !== undefined) {
            cdmRequest.headers.set('Content-Type', cdmRequest.contentType);
            cdmRequest.headers.set('Content-Length', Buffer.from(cdmRequest.content).length.toString());
        }

        const outgoingHeaders: http.OutgoingHttpHeaders = {};

        if (cdmRequest.headers !== undefined) {
            cdmRequest.headers.forEach((value: string, key: string) => {
                outgoingHeaders[key] = value;
            });
        }

        // If the number of retries is 0, we only try once, otherwise we retry the specified number of times.
        for (let retryNumber: number = 0; retryNumber <= cdmRequest.numberOfRetries; retryNumber++) {
            let hasFailed: boolean = false;
            let response: CdmHttpResponse;
            const startTime = new Date();

            try {
                if (ctx !== undefined) {
                    Logger.info(ctx, this.TAG, this.SendAsyncHelper.name, undefined, `Sending request ${cdmRequest.requestId}, request type: ${cdmRequest.method}, request url: ${cdmRequest.stripSasSig()}, retry number: ${retryNumber}.`);
                }

                if (cdmRequest.maximumTimeoutExceeded) {
                    throw new CdmTimedOutException(REQUEST_TIMEOUT);
                }

                // Calculate how much longer we have before hitting the maximum timout.
                const maxTimeout: number = cdmRequest.timeForMaximumTimeout;

                // The request should timeout either for its own timeout or if maximum timeout is reached.
                const timeout: number = Math.min(maxTimeout, cdmRequest.timeout);

                response = await this.httpHandler(fullUrl, cdmRequest.method, timeout, cdmRequest.content, outgoingHeaders);

                if (ctx !== undefined) {
                    const endTime = new Date();
                    const contentLength: string = response.responseHeaders.get('content-length') ?? '';
                    const adlsRequestId: string = response.responseHeaders.get('x-ms-request-id') ?? '';
                    Logger.info(
                        ctx,
                        this.TAG,
                        this.SendAsyncHelper.name,
                        undefined,
                        `Response for request id: ${adlsRequestId}, elapsed time: ${endTime.valueOf() - startTime.valueOf()} ms, content length: ${contentLength}, status code: ${response.statusCode}.`);
                }
            } catch (err) {
                hasFailed = true;
                const endTime = new Date();
                
                if (err.code === 'ECONNRESET' && ctx) {
                    Logger.info(ctx, this.TAG, this.SendAsyncHelper.name, undefined,  `Request ${cdmRequest.requestId} timeout after ${endTime.valueOf() - startTime.valueOf()} ms.`);
                }

                // Only throw an exception if another retry is not expected anymore.
                if (callback === undefined || retryNumber === cdmRequest.numberOfRetries) {
                    if (retryNumber !== 0 && !cdmRequest.maximumTimeoutExceeded) {
                        throw new CdmNumberOfRetriesExceededException('The number of retries has exceeded the maximum number allowed by the client.');
                    } else if (err.code === 'ECONNRESET') {
                        throw new CdmTimedOutException(REQUEST_TIMEOUT);
                    } else {
                        throw err;
                    }
                }
            }

            // Check whether we have a callback function set and whether this is not our last retry.
            if (callback && retryNumber !== cdmRequest.numberOfRetries && !cdmRequest.maximumTimeoutExceeded) {

                // Call the callback function with the retry numbers starting from 1.
                const waitTime: number = await callback(response, hasFailed, retryNumber + 1);

                // Callback has returned that we do not want to retry anymore (probably successful request,
                // client can set up what they want here).
                if (waitTime === undefined) {
                    return response;
                } else {
                    // Sleep time specified by the callback.
                    await CdmHttpClient.sleep(waitTime);
                }
            } else {
                // CDM Http Response exists, could be successful or bad (e.g. 403/404), it is up to caller to deal with it.
                if (response !== undefined) {
                    return response;
                } else if (retryNumber  < cdmRequest.numberOfRetries || cdmRequest.maximumTimeoutExceeded) {
                    throw new CdmTimedOutException(REQUEST_TIMEOUT);
                } else {
                    // If response doesn't exist repeatedly, just throw that the number of retries has exceeded
                    // (we don't have any other information).
                    throw new CdmNumberOfRetriesExceededException('The number of retries has exceeded the maximum number allowed by the client.');
                }
            }
        }
        
    }
}