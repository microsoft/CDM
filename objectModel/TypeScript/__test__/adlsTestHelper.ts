// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { azureCloudEndpoint, StringUtils } from '../internal';
import { ADLSAdapter } from '../Storage';

export const adlsTestHelper = {
    createAdapterWithSharedKey(rootRelativePath?: string, testBlobHostname: boolean = false, httpsHostname: boolean = false): ADLSAdapter {
        let hostname: string = httpsHostname ? process.env['ADLS_HTTPS_HOSTNAME'] : process.env['ADLS_HOSTNAME'];
        const rootPath: string = process.env['ADLS_ROOTPATH'];
        const sharedKey: string = process.env['ADLS_SHAREDKEY'];

        expect(StringUtils.isNullOrWhiteSpace(hostname))
            .toBe(false);
        expect(StringUtils.isNullOrWhiteSpace(rootPath))
            .toBe(false);
        expect(StringUtils.isNullOrWhiteSpace(sharedKey))
            .toBe(false);

        if (testBlobHostname) {
            hostname = hostname.replace('dfs', 'blob');
        }

        return new ADLSAdapter(hostname, adlsTestHelper.getFullRootPath(rootPath, rootRelativePath), sharedKey);
    },

    createAdapterWithClientId(rootRelativePath?: string, specifyEndpoint: boolean = false, testBlobHostname: boolean = false): ADLSAdapter {
        let hostname: string = process.env['ADLS_HOSTNAME'];
        const rootPath: string = process.env['ADLS_ROOTPATH'];
        const tenant: string = process.env['ADLS_TENANT'];
        const clientId: string = process.env['ADLS_CLIENTID'];
        const clientSecret: string = process.env['ADLS_CLIENTSECRET'];

        expect(StringUtils.isNullOrWhiteSpace(hostname))
            .toBe(false);
        expect(StringUtils.isNullOrWhiteSpace(rootPath))
            .toBe(false);
        expect(StringUtils.isNullOrWhiteSpace(tenant))
            .toBe(false);
        expect(StringUtils.isNullOrWhiteSpace(clientId))
            .toBe(false);
        expect(StringUtils.isNullOrWhiteSpace(clientSecret))
            .toBe(false);

        if (testBlobHostname) {
            hostname = hostname.replace('dfs', 'blob');
        }

        if (specifyEndpoint) {
            return new ADLSAdapter(hostname, adlsTestHelper.getFullRootPath(rootPath, rootRelativePath), tenant, clientId, clientSecret, azureCloudEndpoint.AzurePublic);
        }

        return new ADLSAdapter(hostname, adlsTestHelper.getFullRootPath(rootPath, rootRelativePath), tenant, clientId, clientSecret);
    },

    getFullRootPath(first: string, second: string): string {
        if (second === undefined || second === null) {
            return first;
        }

        if (first.endsWith('/')) {
            first = first.substring(0, first.length - 1);
        }

        if (second.startsWith('/')) {
            second = second.substring(1);
        }

        return `${first}/${second}`;
    },

    isAdlsEnvironmentEnabled(): boolean {
        return process.env['ADLS_RUNTESTS'] === '1';
    }
};
