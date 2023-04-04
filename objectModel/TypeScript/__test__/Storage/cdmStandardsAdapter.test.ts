// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as path from 'path';
import { CdmStandardsAdapter } from '../../Storage';

/**
 * Tests if the CdmStandardsAdapter functions correctly.
 */
describe('Storage.CdmStandardsAdapter', () => {
    const ROOT: string =  path.resolve('./CdmStandards/schemaDocuments');
    const EXTENSION_FILE_PATH: string = '/extensions/pbi.extension.cdm.json';
    const FOUNDATIONS_FILE_PATH: string = '/cdmfoundation/foundations.cdm.json';
    const INVALID_FILE_PATH: string = 'invalidFile.cdm.json';

    /**
     * Tests if the corpus path is created correctly.
     */
    it('CreateCorpusPath', () => {
        const adapter: CdmStandardsAdapter = new CdmStandardsAdapter();
        let corpusPath: string = adapter.createCorpusPath(`${ROOT}${EXTENSION_FILE_PATH}`);
        expect(corpusPath).toEqual(EXTENSION_FILE_PATH);

        corpusPath = adapter.createCorpusPath(`${ROOT}${FOUNDATIONS_FILE_PATH}`);
        expect(corpusPath).toEqual(FOUNDATIONS_FILE_PATH);

        // invalid paths
        corpusPath = adapter.createCorpusPath(INVALID_FILE_PATH);
        expect(corpusPath).toBeUndefined();
    });

    /**
     * Tests if the adapter path is created correctly.
     */
    it('CreateAdapterPath', () => {
        const adapter: CdmStandardsAdapter = new CdmStandardsAdapter();
        let adapterPath: string = adapter.createAdapterPath(EXTENSION_FILE_PATH);
        expect(adapterPath).toEqual(path.normalize(`${ROOT}${EXTENSION_FILE_PATH}`));

        adapterPath = adapter.createAdapterPath(FOUNDATIONS_FILE_PATH);
        expect(adapterPath).toEqual(path.normalize(`${ROOT}${FOUNDATIONS_FILE_PATH}`));
    });

    /**
     * Tests if the adapter is able to read correctly.
     */
    it('ReadAsync', async () => {
        const adapter: CdmStandardsAdapter = new CdmStandardsAdapter();
        const extensions: string = await adapter.readAsync(EXTENSION_FILE_PATH);
        const foundations: string = await adapter.readAsync(FOUNDATIONS_FILE_PATH);
        expect(extensions).toBeDefined();
        expect(foundations).toBeDefined();

        let errorWasThrown: boolean = false;
        try {
            await adapter.readAsync(INVALID_FILE_PATH);
        } catch (e) {
            const errorMessageSubstring: string = 'ENOENT: no such file or directory';
            expect(e.message.substring(0, errorMessageSubstring.length)).toEqual(errorMessageSubstring);
            errorWasThrown = true;
        }

        expect(errorWasThrown).toBeTruthy();
    });
})