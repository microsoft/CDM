// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmStandardsAdapter } from '../../Storage';

/**
 * Tests if the CdmStandardsAdapter functions correctly.
 */
describe('Storage.CdmStandardsAdapter', () => {
    const ENDPOINT: string =  "https://cdm-schema.microsoft.com/logical";
    const TEST_FILE_PATH: string = "/foundations.cdm.json";
    
    /**
     * Tests if the adapter path is created correctly.
     */
    it('CreateAdapterPath', () => {
        const adapter: CdmStandardsAdapter = new CdmStandardsAdapter();
        const corpusPath: string = TEST_FILE_PATH;
        const adapterPath: string = adapter.createAdapterPath(corpusPath);
        expect(adapterPath).toEqual(`${ENDPOINT}${corpusPath}`);
    });

    /**
     * Tests if the corpus path is created correctly.
     */
    it('CreateCorpusPath', () => {
        const adapter: CdmStandardsAdapter = new CdmStandardsAdapter();
        const adapterPath: string = `${ENDPOINT}${TEST_FILE_PATH}`;
        const corpusPath: string = adapter.createCorpusPath(adapterPath);
        expect(corpusPath).toEqual(TEST_FILE_PATH);
    });

    /**
     * Tests if the adapter is able to read correctly.
     */
    it('ReadAsync', async () => {
        const adapter: CdmStandardsAdapter = new CdmStandardsAdapter();
        const foundations: string = await adapter.readAsync(TEST_FILE_PATH);
        expect(foundations).not.toBeNull();
    });
})