// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmCustomPackageAdapter } from '../../Storage';
import * as path from 'path';
import { CdmStandardsAdapter } from '../../Storage';
import * as cdmstandards from 'cdm.objectmodel.cdmstandards';

/**
 * Tests if the CdmCustomPackageAdapter functions correctly.
 */
describe('Storage.CdmStandardsAdapter', () => {
    const EXTENSION_FILE_PATH: string = '/extensions/pbi.extension.cdm.json';
    const FOUNDATIONS_FILE_PATH: string = '/cdmfoundation/foundations.cdm.json';
    const INVALID_FILE_PATH: string = 'invalidFile.cdm.json';

    /**
     * Tests if the adapter handles correctly if the package is not found.
     */
    it('TestPackageNotFound', () => {
        let errorCalled: boolean = false;
        try {
            new CdmCustomPackageAdapter('someInvalidPackage');
        } catch (e) {
            expect(e.message.includes('Couldn\'t find package \'someInvalidPackage\''));
            errorCalled = true;
        }

        expect(errorCalled).toBeTruthy();
    });

    /**
     * Tests if the corpus path is created correctly.
     */
    it('CreateCdmStandardsCorpusPath', () => {
        const adapter: CdmStandardsAdapter = new CdmStandardsAdapter();
        let corpusPath: string = adapter.createCorpusPath(`${cdmstandards.getRoot()}${EXTENSION_FILE_PATH}`);
        expect(corpusPath).toEqual(EXTENSION_FILE_PATH);

        corpusPath = adapter.createCorpusPath(`${cdmstandards.getRoot()}${FOUNDATIONS_FILE_PATH}`);
        expect(corpusPath).toEqual(FOUNDATIONS_FILE_PATH);

        // invalid paths
        corpusPath = adapter.createCorpusPath(INVALID_FILE_PATH);
        expect(corpusPath).toBeUndefined();
    });

    /**
     * Tests if the adapter path is created correctly.
     */
    it('CreateCdmStandardsAdapterPath', () => {
        const adapter: CdmStandardsAdapter = new CdmStandardsAdapter();
        let adapterPath: string = adapter.createAdapterPath(EXTENSION_FILE_PATH);
        expect(adapterPath).toEqual(path.normalize(`${cdmstandards.getRoot()}${EXTENSION_FILE_PATH}`));

        adapterPath = adapter.createAdapterPath(FOUNDATIONS_FILE_PATH);
        expect(adapterPath).toEqual(path.normalize(`${cdmstandards.getRoot()}${FOUNDATIONS_FILE_PATH}`));
    });

    /**
     * Tests if the adapter is able to read correctly.
     */
    it('ReadCdmStandardsAsync', async () => {
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
    
    /**
     * Tests if the CdmCustomPackageAdapter works when assembly is passed in the constructor.
     */
    it('CustomPackageInConstructor', async () => {
        const cdmstandards = require('cdm.objectmodel.cdmstandards');
        const adapter: CdmCustomPackageAdapter = new CdmCustomPackageAdapter(cdmstandards);
        const foundations: string = await adapter.readAsync(FOUNDATIONS_FILE_PATH);
        expect(foundations).toBeDefined();
    });
});
