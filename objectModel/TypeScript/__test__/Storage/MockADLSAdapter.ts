// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmHttpClient } from '../../Utilities/Network';
import { ADLSAdapter } from '../../Storage';

export class MockADLSAdapter extends ADLSAdapter {
    constructor(httpClientOrHostName?: CdmHttpClient | string, root?: string, sharedKey?: string) {
        if (typeof httpClientOrHostName === 'string') {
            super(httpClientOrHostName, root ?? 'root', sharedKey ?? process.env['ADLS_SHAREDKEY']);
        } else {
            super('hostname', 'root', process.env['ADLS_SHAREDKEY']);
            this.httpClient = httpClientOrHostName;
        }
    }
}
