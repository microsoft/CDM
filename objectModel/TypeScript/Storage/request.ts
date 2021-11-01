// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as http from 'http';
import * as https from 'https';
import { CdmHttpResponse } from '../Utilities/Network/CdmHttpResponse'

export async function requestUrl(url: string, method: string, requestTimeout: number, content: string = undefined, headers: http.OutgoingHttpHeaders = undefined): Promise<CdmHttpResponse> {
    const protocolIndex: number = url.indexOf('://');

    if (protocolIndex === -1) {
        return Promise.reject('Protocol not present in the URL');
    }
    const pathIndex: number = url.indexOf('/', protocolIndex + 3);
    const hostIndex: number = pathIndex !== -1 ? pathIndex : url.length;

    const protocol: string = url.slice(0, protocolIndex);
    const host: string = url.slice(protocolIndex + 3, hostIndex);
    const path: string = pathIndex !== -1 ? url.slice(pathIndex) : '';

    return request(protocol, host, path, method, requestTimeout, content, headers);
}

export async function request(protocol: string, host: string, path: string, method: string, requestTimeout: number, content: string = undefined, headers: http.OutgoingHttpHeaders = undefined): Promise<CdmHttpResponse> {
    return new Promise((resolve, reject) => {
        let lib;
        switch (protocol) {
            case 'https':
                lib = https;
                break;
            case 'http':
                lib = http;
                break;
            default:
                reject(new Error('Protocol does not exist.'));
                return;
        }

        const options = {
            hostname: host,
            path: path,
            port: undefined,
            method: method,
            headers: headers,
        };

        // If the host has a port on it, break it down. E.g.: 'localhost:8000'
        const portIndex = host.indexOf(':')
        if (portIndex !== -1) {
            options.hostname = host.slice(0, portIndex);
            options.port = host.slice(portIndex + 1)
        }

        const req = lib.request(options, (res: http.IncomingMessage) => {
            const arr = [];

            res.on('data', (chunk) => {
                arr.push(chunk);
            });
            res.on('end', () => {
                const cdmHttpResponse = new CdmHttpResponse();
                const buf: Buffer = Buffer.concat(arr);

                // Process results from incoming message directly here and save the results to the newly created CDM Http response object.
                cdmHttpResponse.content = buf.toString('utf-8');
                cdmHttpResponse.statusCode = res.statusCode;

                // Successful responses are in the 2xx format.
                cdmHttpResponse.isSuccessful = Math.floor(cdmHttpResponse.statusCode / 100) === 2;
                cdmHttpResponse.reason = res.statusMessage;

                if (res.headers !== undefined) {
                    const headers = Object.entries(res.headers);

                    // Covert the incoming headers back to the CDM Http headers format.
                    headers.forEach((header: [string, string | string[]]) => {
                        let headerValue: string = undefined;
                        if (header[1] instanceof Array) {
                            headerValue = (header[1] as string[]).join(',');
                        } else {
                            headerValue = header[1];
                        }
                        cdmHttpResponse.responseHeaders.set(header[0], headerValue);
                    })
                }

                resolve(cdmHttpResponse);
            });
            res.on('error', (err) => {
                reject(err);
            });
        });

        req.on('socket', (socket) => {
            // Set the timeout on the socket.
            socket.setTimeout(requestTimeout);  
            socket.on('timeout', () => req.abort());
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (content !== undefined) {
            // Be sure to set the content in the case of a POST or PUT HTTP request.
            req.write(content, 'utf-8');
        }

        req.end();
    });
};
