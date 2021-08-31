// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    CdmManifestDefinition,
    cdmStatusLevel,
    resolveOptions,
    importsLoadStrategy,
    StorageAdapter
} from '../../internal';
import { LocalAdapter } from '../../Storage';
import { testHelper } from '../testHelper';

/**
 * Testing loading imports on a cdm file
 */
// tslint:disable-next-line: max-func-body-length
describe('Cdm/ImportsTest', () => {
    const testsSubpath: string = 'Cdm/Imports';

    /**
     * Does not fail with a missing import
     */
    it('TestEntityWithMissingImport', async () => {
        const localAdapter: LocalAdapter = createStorageAdapterForTest('TestEntityWithMissingImport');
        const cdmCorpus: CdmCorpusDefinition = createTestCorpus(localAdapter);
        const resOpt = new resolveOptions();
        resOpt.importsLoadStrategy = importsLoadStrategy.load;

        const doc: CdmDocumentDefinition = await cdmCorpus.fetchObjectAsync<CdmDocumentDefinition>('local:/missingImport.cdm.json', null, resOpt);
        expect(doc)
            .not
            .toBeUndefined();
        expect(doc.imports.length)
            .toBe(1);
        expect(doc.imports.allItems[0].corpusPath)
            .toBe('missing.cdm.json');
        expect((doc.imports.allItems[0]).document)
            .toBeUndefined();
    });

    /**
     * Does not fail with a missing nested import
     */
    it('TestEntityWithMissingNestedImportsAsync', async () => {
        const localAdapter: LocalAdapter = createStorageAdapterForTest('TestEntityWithMissingNestedImportsAsync');
        const cdmCorpus: CdmCorpusDefinition = createTestCorpus(localAdapter);
        const resOpt = new resolveOptions();
        resOpt.importsLoadStrategy = importsLoadStrategy.load;

        const doc: CdmDocumentDefinition = await cdmCorpus.fetchObjectAsync<CdmDocumentDefinition>('local:/missingNestedImport.cdm.json', null, resOpt);
        expect(doc)
            .not
            .toBeUndefined();
        expect(doc.imports.length)
            .toBe(1);
        const firstImport: CdmDocumentDefinition = (doc.imports.allItems[0]).document;
        expect(firstImport.imports.length)
            .toBe(1);
        expect(firstImport.name)
            .toBe('notMissing.cdm.json');
        const nestedImport: CdmDocumentDefinition = (firstImport.imports.allItems[0]).document;
        expect(nestedImport)
            .toBeUndefined();
    });

    /**
     * Testing loading where import is listed multiple times in different files
     */
    it('TestEntityWithSameImportsAsync', async () => {
        const localAdapter: LocalAdapter = createStorageAdapterForTest('TestEntityWithSameImportsAsync');
        const cdmCorpus: CdmCorpusDefinition = createTestCorpus(localAdapter);
        const resOpt = new resolveOptions();
        resOpt.importsLoadStrategy = importsLoadStrategy.load;


        const doc: CdmDocumentDefinition = await cdmCorpus.fetchObjectAsync<CdmDocumentDefinition>('local:/multipleImports.cdm.json', null, resOpt);
        expect(doc)
            .not
            .toBeUndefined();
        expect(doc.imports.length)
            .toBe(2);
        const firstImport: CdmDocumentDefinition = (doc.imports.allItems[0]).document;
        expect(firstImport.name)
            .toBe('missingImport.cdm.json');
        expect(firstImport.imports.length)
            .toBe(1);
        const secondImport: CdmDocumentDefinition = (doc.imports.allItems[1]).document;
        expect(secondImport.name)
            .toBe('notMissing.cdm.json');
    });

    /**
     * Testing an import with a non-existing namespace name.
     */
    it('TestNonExistingAdapterNamespace', async () => {
        const localAdapter: LocalAdapter = createStorageAdapterForTest('TestNonExistingAdapterNamespace');
        const cdmCorpus: CdmCorpusDefinition = createTestCorpus(localAdapter);
        cdmCorpus.storage.mount('erp', localAdapter);

        // Set local as our default.
        cdmCorpus.storage.defaultNamespace = 'erp';

        const manifestPath: string = cdmCorpus.storage.createAbsoluteCorpusPath('erp.missingImportManifest.cdm');
        const rootManifest: CdmManifestDefinition = await cdmCorpus.createRootManifest(manifestPath);

        // Load a manifest that is trying to import from 'cdm' namespace.
        // The manifest does't exist since the import couldn't get resolved,
        // so the error message will be logged and the null value will be propagated back to a user.
        expect(rootManifest)
            .toBeUndefined();
    });

    /**
     * Testing docs that load the same import
     */
    it('TestLoadingSameImportsAsync', async () => {
        const localAdapter: LocalAdapter = createStorageAdapterForTest('TestLoadingSameImportsAsync');
        const cdmCorpus: CdmCorpusDefinition = createTestCorpus(localAdapter);
        const resOpt = new resolveOptions();
        resOpt.importsLoadStrategy = importsLoadStrategy.load;

        const mainDoc: CdmDocumentDefinition = await cdmCorpus.fetchObjectAsync<CdmDocumentDefinition>('mainEntity.cdm.json', null, resOpt);
        expect(mainDoc)
            .not
            .toBeUndefined();
        expect(mainDoc.imports.length)
            .toBe(2);
        const firstImport: CdmDocumentDefinition = mainDoc.imports.allItems[0].document;
        const secondImport: CdmDocumentDefinition = mainDoc.imports.allItems[1].document;

        // since these two imports are loaded asyncronously, we need to make sure that
        // the import that they share (targetImport) was loaded, and that the
        // targetImport doc is attached to both of these import objects
        expect(firstImport.imports.length)
            .toBe(1);
        expect(firstImport.imports.allItems[0].document)
            .toBeDefined();

        expect(secondImport.imports.length)
            .toBe(1);
        expect(secondImport.imports.allItems[0].document)
            .toBeDefined();
    });

    /**
     * Testing docs that load the same import of which, the file cannot be found
     */
    it('TestLoadingSameMissingImportsAsync', async () => {
        const localAdapter: LocalAdapter = createStorageAdapterForTest('TestLoadingSameMissingImportsAsync');
        const cdmCorpus: CdmCorpusDefinition = createTestCorpus(localAdapter);
        const resOpt = new resolveOptions();
        resOpt.importsLoadStrategy = importsLoadStrategy.load;

        const mainDoc: CdmDocumentDefinition = await cdmCorpus.fetchObjectAsync<CdmDocumentDefinition>('mainEntity.cdm.json', null, resOpt);
        expect(mainDoc)
            .not
            .toBeUndefined();
        expect(mainDoc.imports.length)
            .toBe(2);

        // make sure imports loaded correctly, despite them missing imports
        const firstImport: CdmDocumentDefinition = (mainDoc.imports.allItems[0]).document;
        const secondImport: CdmDocumentDefinition = (mainDoc.imports.allItems[1]).document;

        expect(firstImport.imports.length)
            .toBe(1);
        expect(firstImport.imports.allItems[0].document)
            .toBeUndefined();

        expect(secondImport.imports.length)
            .toBe(1);
        expect(firstImport.imports.allItems[0].document)
            .toBeUndefined();
    });

    /**
     * Testing doc that loads an import that has already been loaded before
     */
    it('TestLoadingAlreadyPresentImportsAsync', async () => {
        const localAdapter: LocalAdapter = createStorageAdapterForTest('TestLoadingAlreadyPresentImportsAsync');
        const cdmCorpus: CdmCorpusDefinition = createTestCorpus(localAdapter);
        const resOpt = new resolveOptions();
        resOpt.importsLoadStrategy = importsLoadStrategy.load;

        // load the first doc
        const mainDoc: CdmDocumentDefinition = await cdmCorpus.fetchObjectAsync<CdmDocumentDefinition>('mainEntity.cdm.json', null, resOpt);
        expect(mainDoc)
            .not
            .toBeUndefined();
        expect(mainDoc.imports.length)
            .toBe(1);

        const importDoc: CdmDocumentDefinition = (mainDoc.imports.allItems[0]).document;
        expect(importDoc)
            .toBeDefined();

        // now load the second doc, which uses the same import
        // the import should not be loaded again, it should be the same object
        const secondDoc: CdmDocumentDefinition = await cdmCorpus.fetchObjectAsync<CdmDocumentDefinition>('secondEntity.cdm.json', null, resOpt);
        expect(secondDoc)
            .not
            .toBeUndefined();
        expect(secondDoc.imports.length)
            .toBe(1);

        const secondImportDoc: CdmDocumentDefinition = (mainDoc.imports.allItems[0]).document;
        expect(secondImportDoc)
            .toBeDefined();

        expect(importDoc)
            .toBe(secondImportDoc);
    });

    /**
     * Testing that import priorites update correctly when imports are changed
     */
    it('TestPrioritizingImportsAfterEdit', async () => {
        var corpus = testHelper.getLocalCorpus(testsSubpath, 'TestPrioritizingImportsAfterEdit');

        var document = await corpus.fetchObjectAsync<CdmDocumentDefinition>('local:/mainDoc.cdm.json');
        await document.refreshAsync(new resolveOptions(document));

        expect(document.imports.length)
            .toEqual(0);
        // the current doc itself is added to the list of priorities
        expect(document.importPriorities.importPriority.size)
            .toEqual(1);

        document.imports.push('importDoc.cdm.json', true);
        await document.refreshAsync(new resolveOptions(document));

        expect(document.imports.length)
            .toEqual(1);
        expect(document.importPriorities.importPriority.size)
            .toEqual(2);
    });

    function createTestCorpus(adapter: StorageAdapter): CdmCorpusDefinition {
        const cdmCorpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        cdmCorpus.storage.mount('local', adapter);
        cdmCorpus.storage.defaultNamespace = 'local';

        // Set empty callback to avoid breaking tests due too many errors in logs,
        // change the event callback to console or file status report if wanted.
        // tslint:disable-next-line: no-empty
        cdmCorpus.setEventCallback(() => { }, cdmStatusLevel.error);

        return cdmCorpus;
    }

    function createStorageAdapterForTest(testName: string): LocalAdapter {
        return new LocalAdapter(testHelper.getInputFolderPath(testsSubpath, testName));
    }
});
