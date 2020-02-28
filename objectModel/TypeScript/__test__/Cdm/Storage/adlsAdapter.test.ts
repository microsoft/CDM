// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { MockADLSAdapter } from './MockADLSAdapter';

describe('Cdm.Storage.AdlsAdapter', () => {
    /**
     * Tests to create corpus paths and adapter paths in AdlsAdapter
     */
    it('TestCreateCorpusAndAdapterPathInAdlsAdapter', () => {
        const host1: string = 'storageaccount.dfs.core.windows.net';
        const root: string = '/fs';
        let adlsAdapter: MockADLSAdapter = new MockADLSAdapter(host1, root, 'test');

        const adapterPath1: string = 'https://storageaccount.dfs.core.windows.net/fs/a/1.csv';
        const adapterPath2: string = 'https://storageaccount.dfs.core.windows.net:443/fs/a/2.csv';
        const adapterPath3: string = 'https://storageaccount.blob.core.windows.net/fs/a/3.csv';
        const adapterPath4: string = 'https://storageaccount.blob.core.windows.net:443/fs/a/4.csv';

        const corpusPath1: string = adlsAdapter.createCorpusPath(adapterPath1);
        const corpusPath2: string = adlsAdapter.createCorpusPath(adapterPath2);
        const corpusPath3: string = adlsAdapter.createCorpusPath(adapterPath3);
        const corpusPath4: string = adlsAdapter.createCorpusPath(adapterPath4);

        expect(corpusPath1)
        .toBe('/a/1.csv');
        expect(corpusPath2)
        .toBe('/a/2.csv');
        expect(corpusPath3)
        .toBe('/a/3.csv');
        expect(corpusPath4)
        .toBe('/a/4.csv');

        expect(adlsAdapter.createAdapterPath(corpusPath1)).toBe(adapterPath1);
        expect(adlsAdapter.createAdapterPath(corpusPath2)).toBe(adapterPath2);
        expect(adlsAdapter.createAdapterPath(corpusPath3)).toBe(adapterPath3);
        expect(adlsAdapter.createAdapterPath(corpusPath4)).toBe(adapterPath4);

        const host2: string = 'storageaccount.blob.core.windows.net:8888';
        adlsAdapter = new MockADLSAdapter(host2, root, 'test');

        const adapterPath5: string = 'https://storageaccount.blob.core.windows.net:8888/fs/a/5.csv';
        const adapterPath6: string = 'https://storageaccount.dfs.core.windows.net:8888/fs/a/6.csv';
        const adapterPath7: string = 'https://storageaccount.blob.core.windows.net/fs/a/7.csv';

        expect(adlsAdapter.createCorpusPath(adapterPath5))
        .toBe('/a/5.csv');
        expect(adlsAdapter.createCorpusPath(adapterPath6))
        .toBe('/a/6.csv');
        expect(adlsAdapter.createCorpusPath(adapterPath7))
        .toBeUndefined();
    });
});
