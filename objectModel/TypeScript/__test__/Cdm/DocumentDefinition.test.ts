// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { 
    CdmCorpusDefinition,
    CdmDocumentCollection,
    CdmDocumentDefinition,
    CdmFolderDefinition,
    resolveOptions
} from '../../internal';
import { testHelper } from '../testHelper';

/**
 * Sets the document's isDirty flag to true and reset the importPriority.
 * @param documents 
 */
function markDocumentsToIndex(documents: CdmDocumentCollection) {
    documents.allItems.forEach((document: CdmDocumentDefinition) => {
        document.needsIndexing = true;
        document.importPriorities = undefined;
    });
}

/**
 * Test methods for the CdmDocumentDefinition class.
 */
describe('Cdm/CdmDocumentDefinition', () => {
    /**
     * Test when A -> M/B -> C -> B.
     * In this case, although A imports B with a moniker, B should be in the priorityImports because it is imported by C.
     */
    it('testCircularImportWithMoniker', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus('', '');
        const folder: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        var docA = new CdmDocumentDefinition(corpus.ctx, 'A.cdm.json');
        folder.documents.push(docA);
        docA.imports.push('B.cdm.json', 'moniker');

        var docB = new CdmDocumentDefinition(corpus.ctx, 'B.cdm.json');
        folder.documents.push(docB);
        docB.imports.push('C.cdm.json');

        var docC = new CdmDocumentDefinition(corpus.ctx, 'C.cdm.json');
        folder.documents.push(docC);
        docC.imports.push('B.cdm.json');

        // forces docB to be indexed first.
        await docB.indexIfNeeded(new resolveOptions());
        await docA.indexIfNeeded(new resolveOptions());

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
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus('', '');
        const folder: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        var docA = new CdmDocumentDefinition(corpus.ctx, 'A.cdm.json');
        folder.documents.push(docA);
        docA.imports.push('B.cdm.json');

        var docB = new CdmDocumentDefinition(corpus.ctx, 'B.cdm.json');
        folder.documents.push(docB);
        docB.imports.push('C.cdm.json', 'moniker');

        var docC = new CdmDocumentDefinition(corpus.ctx, 'C.cdm.json');
        folder.documents.push(docC);
        docC.imports.push('D.cdm.json');

        var docD = new CdmDocumentDefinition(corpus.ctx, 'D.cdm.json');
        folder.documents.push(docD);
        docD.imports.push('C.cdm.json');

        // indexIfNeeded will internally call prioritizeImports on every document.
        await docA.indexIfNeeded(new resolveOptions());

        expect(docA.importPriorities.importPriority.size)
            .toBe(4);

        // reset the importsPriorities.
        markDocumentsToIndex(folder.documents);

        // force docC to be indexed first, so the priorityList will be read from the cache this time.
        await docC.indexIfNeeded(new resolveOptions());
        await docA.indexIfNeeded(new resolveOptions());

        expect(docA.importPriorities.importPriority.size)
            .toBe(4);

        // indexes the rest of the documents.
        await docB.indexIfNeeded(new resolveOptions());
        await docD.indexIfNeeded(new resolveOptions());

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
     * Test if monikered imports are not being added to the priorityList.
     */
    it('testMonikeredImportIsNotAdded', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus('', '');
        const folder: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        var docA = new CdmDocumentDefinition(corpus.ctx, 'A.cdm.json');
        folder.documents.push(docA);
        docA.imports.push('B.cdm.json', 'moniker');

        var docB = new CdmDocumentDefinition(corpus.ctx, 'B.cdm.json');
        folder.documents.push(docB);
        docB.imports.push('C.cdm.json');
        
        var docC = new CdmDocumentDefinition(corpus.ctx, 'C.cdm.json');
        folder.documents.push(docC);

        // forces docB to be indexed first, so the priorityList will be read from the cache this time.
        await docB.indexIfNeeded(new resolveOptions(docB));
        await docA.indexIfNeeded(new resolveOptions(docA));

        // should only contain docA and docC, docB should be excluded.
        expect(docA.importPriorities.importPriority.size)
            .toBe(2);

        expect(docA.importPriorities.hasCircularImport)
            .toBe(false);
        expect(docB.importPriorities.hasCircularImport)
            .toBe(false);
        expect(docC.importPriorities.hasCircularImport)
            .toBe(false);
    });
});