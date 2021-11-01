// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as http from 'http';
import { CdmHttpResponse } from './CdmHttpResponse';

/**
 * The inteface that specifies the signature for HTTP method used by CDM Http client to execute network requests.
 */
export interface HttpRequestCallback {
    (url: string, method: string, requestTimeout: number, content: string, headers: http.OutgoingHttpHeaders): Promise<CdmHttpResponse>
}
