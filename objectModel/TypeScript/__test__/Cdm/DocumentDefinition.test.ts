// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    CdmDocumentCollection,
    CdmDocumentDefinition,
    CdmEntityDefinition,
    CdmFolderDefinition,
    CdmManifestDefinition,
    ImportInfo,
    resolveOptions
} from '../../internal';
import { testHelper } from '../testHelper';

/**
 * Sets the document's isDirty flag to true and reset the importPriority.
 */
function markDocumentsToIndex(documents: CdmDocumentCollection): void {
    documents.allItems.forEach((document: CdmDocumentDefinition) => {
        document.needsIndexing = true;
        document.importPriorities = undefined;
    });
}

/**
 * Test methods for the CdmDocumentDefinition class.
 */
// tslint:disable-next-line: max-func-body-length
describe('Cdm/CdmDocumentDefinition', () => {
    const testsSubpath: string = 'Cdm/Document';

    /**
     * Test when A -> M/B -> C -> B.
     * In this case, although A imports B with a moniker, B should be in the priorityImports because it is imported by C.
     */
    it('testCircularImportWithMoniker', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'testCircularImportWithMoniker');
        const folder: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        const docA: CdmDocumentDefinition = new CdmDocumentDefinition(corpus.ctx, 'A.cdm.json');
        folder.documents.push(docA);
        docA.imports.push('B.cdm.json', 'moniker');

        const docB: CdmDocumentDefinition = new CdmDocumentDefinition(corpus.ctx, 'B.cdm.json');
        folder.documents.push(docB);
        docB.imports.push('C.cdm.json');

        const docC: CdmDocumentDefinition = new CdmDocumentDefinition(corpus.ctx, 'C.cdm.json');
        folder.documents.push(docC);
        docC.imports.push('B.cdm.json');

        // forces docB to be indexed first.
        await docB.indexIfNeeded(new resolveOptions(), true);
        await docA.indexIfNeeded(new resolveOptions(), true);

        // should contain A, B and C.
        expect(docA.importPriorities.importPriority.size)
            .toEqual(3);

        expect(docA.importPriorities.hasCircularImport)
            .toBe(false);

        // docB and docC should have the hasCircularImport set to true.
        expect(docB.importPriorities.hasCircularImport)
            .toBe(true);
        expect(docC.importPriorities.hasCircularImport)
            .toBe(true);
    });

    /**
     * Test when A -> B -> C/M -> D -> C.
     * In this case, although B imports C with a moniker, C should be in the A's priorityImports because it is imported by D.
     */
    it('testDeeperCircularImportWithMoniker', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'testDeeperCircularImportWithMoniker');
        const folder: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        const docA: CdmDocumentDefinition = new CdmDocumentDefinition(corpus.ctx, 'A.cdm.json');
        folder.documents.push(docA);
        docA.imports.push('B.cdm.json');

        const docB: CdmDocumentDefinition = new CdmDocumentDefinition(corpus.ctx, 'B.cdm.json');
        folder.documents.push(docB);
        docB.imports.push('C.cdm.json', 'moniker');

        const docC: CdmDocumentDefinition = new CdmDocumentDefinition(corpus.ctx, 'C.cdm.json');
        folder.documents.push(docC);
        docC.imports.push('D.cdm.json');

        const docD: CdmDocumentDefinition = new CdmDocumentDefinition(corpus.ctx, 'D.cdm.json');
        folder.documents.push(docD);
        docD.imports.push('C.cdm.json');

        // indexIfNeeded will internally call prioritizeImports on every documen, truet.
        await docA.indexIfNeeded(new resolveOptions(), true);

        expect(docA.importPriorities.importPriority.size)
            .toBe(4);

        // reset the importsPriorities.
        markDocumentsToIndex(folder.documents);

        // force docC to be indexed first, so the priorityList will be read from the cache this time.
        await docC.indexIfNeeded(new resolveOptions(), true);
        await docA.indexIfNeeded(new resolveOptions(), true);

        expect(docA.importPriorities.importPriority.size)
            .toBe(4);
        assertImportInfo(docA.importPriorities.importPriority.get(docA), 0, false);
        assertImportInfo(docA.importPriorities.importPriority.get(docB), 1, false);
        assertImportInfo(docA.importPriorities.importPriority.get(docD), 2, false);
        assertImportInfo(docA.importPriorities.importPriority.get(docC), 3, false);

        // indexes the rest of the documents.
        await docB.indexIfNeeded(new resolveOptions(), true);
        await docD.indexIfNeeded(new resolveOptions(), true);

        expect(docA.importPriorities.hasCircularImport)
            .toBe(false);
        expect(docB.importPriorities.hasCircularImport)
            .toBe(false);
        expect(docC.importPriorities.hasCircularImport)
            .toBe(true);
        expect(docD.importPriorities.hasCircularImport)
            .toBe(true);
    });

    /**
     * Test when A -> B -> C/M -> D.
     * Index docB first then docA. Make sure that C does not appear in docA priority list.
     */
    it('testReadingCachedImportPriority', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'testReadingCachedImportPriority');
        const folder: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        const docA: CdmDocumentDefinition = new CdmDocumentDefinition(corpus.ctx, 'A.cdm.json');
        folder.documents.push(docA);
        docA.imports.push('B.cdm.json');

        const docB: CdmDocumentDefinition = new CdmDocumentDefinition(corpus.ctx, 'B.cdm.json');
        folder.documents.push(docB);
        docB.imports.push('C.cdm.json', 'moniker');

        const docC: CdmDocumentDefinition = new CdmDocumentDefinition(corpus.ctx, 'C.cdm.json');
        folder.documents.push(docC);
        docC.imports.push('D.cdm.json');

        const docD: CdmDocumentDefinition = new CdmDocumentDefinition(corpus.ctx, 'D.cdm.json');
        folder.documents.push(docD);

        // index docB first and check its import priorities.
        await docB.indexIfNeeded(new resolveOptions(), true);

        expect(docB.importPriorities.importPriority.size)
            .toBe(3);
        assertImportInfo(docB.importPriorities.importPriority.get(docB), 0, false);
        assertImportInfo(docB.importPriorities.importPriority.get(docD), 1, false);
        assertImportInfo(docB.importPriorities.importPriority.get(docC), 2, true);

        // now index docA, which should read docB's priority list from the cache.
        await docA.indexIfNeeded(new resolveOptions(), true);
        expect(docA.importPriorities.importPriority.size)
            .toBe(3);
        assertImportInfo(docA.importPriorities.importPriority.get(docA), 0, false);
        assertImportInfo(docA.importPriorities.importPriority.get(docB), 1, false);
        assertImportInfo(docA.importPriorities.importPriority.get(docD), 2, false);
    });

    /**
     * Test if monikered imports are added to the end of the priority list.
     */
    it('testMonikeredImportIsAddedToEnd', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'testMonikeredImportIsAddedToEnd');
        const folder: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        const docA: CdmDocumentDefinition = new CdmDocumentDefinition(corpus.ctx, 'A.cdm.json');
        folder.documents.push(docA);
        docA.imports.push('B.cdm.json', 'moniker');

        const docB: CdmDocumentDefinition = new CdmDocumentDefinition(corpus.ctx, 'B.cdm.json');
        folder.documents.push(docB);
        docB.imports.push('C.cdm.json');

        const docC: CdmDocumentDefinition = new CdmDocumentDefinition(corpus.ctx, 'C.cdm.json');
        folder.documents.push(docC);

        // forces docB to be indexed first, so the priorityList will be read from the cache this time.
        await docB.indexIfNeeded(new resolveOptions(docB), true);
        await docA.indexIfNeeded(new resolveOptions(docA), true);

        // should contain all three documents.
        expect(docA.importPriorities.importPriority.size)
            .toBe(3);
        assertImportInfo(docA.importPriorities.importPriority.get(docA), 0, false);
        assertImportInfo(docA.importPriorities.importPriority.get(docC), 1, false);
        // docB is monikered so it should appear at the end of the list.
        assertImportInfo(docA.importPriorities.importPriority.get(docB), 2, true);

        // make sure that the has circular import is set to false.
        expect(docA.importPriorities.hasCircularImport)
            .toBe(false);
        expect(docB.importPriorities.hasCircularImport)
            .toBe(false);
        expect(docC.importPriorities.hasCircularImport)
            .toBe(false);
    });

    /**
     * Setting the forceReload flag to true correctly reloads the document
     */
    it('testDocumentForceReload', async () => {
        const testName: string = 'testDocumentForceReload';
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);

        // load the document and entity the first time
        await corpus.fetchObjectAsync('doc.cdm.json/entity');
        // reload the same doc and make sure it is reloaded correctly
        const reloadedEntity: CdmEntityDefinition = await corpus.fetchObjectAsync('doc.cdm.json/entity', undefined, undefined, true);

        // if the reloaded doc is not indexed correctly, the entity will not be able to be found
        expect(reloadedEntity).not
            .toBeUndefined();
    });

    /**
     * Tests if the DocumentVersion is set on the resolved document
     */
    it('testDocumentVersionSetOnResolution', async () => {
        const testName: string = "testDocumentVersionSetOnResolution";
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);

        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync("local:/default.manifest.cdm.json");
        const document: CdmDocumentDefinition = await corpus.fetchObjectAsync("local:/Person.cdm.json");

        expect(manifest.documentVersion)
            .toEqual('2.1.3');
        expect(document.documentVersion)
            .toEqual('1.5');

        const resManifest: CdmManifestDefinition = await manifest.createResolvedManifestAsync(`res-${manifest.name}`, undefined);
        const resEntity: CdmEntityDefinition = await corpus.fetchObjectAsync(resManifest.entities.allItems[0].entityPath, resManifest);
        var resDocument = resEntity.inDocument;

        expect(resManifest.documentVersion)
            .toEqual('2.1.3');
        expect(resDocument.documentVersion)
            .toEqual('1.5');
    });

    /**
     * Helper function to assert the ImportInfo class.
     */
    function assertImportInfo(importInfo: ImportInfo, expectedPriority: number, expectedIsMoniker: boolean): void {
        expect(importInfo.priority)
            .toEqual(expectedPriority);
        expect(importInfo.isMoniker)
            .toEqual(expectedIsMoniker);
    }
});
