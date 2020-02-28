// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

/**
 * The CDM Http response class that a CDM Http client returns to a client.
 */
export class CdmHttpResponse {

    /**
     * The standard HTTP status code.
     */
    public statusCode: number;

    /**
     * The reason.
     */
    public reason: string;

    /**
     * The response headers.
     */
    public responseHeaders: Map<string, string>;

    /**
     * The content.
     */
    public content: string;

    /**
     * The boolean that denotes whether the request was successful.
     */
    public isSuccessful: boolean;

    constructor(statusCode: number = undefined) {
        if (statusCode != undefined) {
            this.statusCode = statusCode;
        }

        this.responseHeaders = new Map<string, string>();
    }
}
