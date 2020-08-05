// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

import org.testng.annotations.Test;
import org.testng.Assert;

/**
 * Tests for the CdmDocumentDefinition class.
 */
public class DocumentDefinitionTest {
    /**
     * Test when A -> M/B -> C -> B. In this case, although A imports B with a
     * moniker, B should be in the priorityImports because it is imported by C.
     */
    @Test
    public void TestCircularImportWithMoniker() throws InterruptedException {
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus("", "", null);
        final CdmFolderDefinition folder = corpus.getStorage().fetchRootFolder("local");

        final CdmDocumentDefinition docA = new CdmDocumentDefinition(corpus.getCtx(), "A.cdm.json");
        folder.getDocuments().add(docA);
        docA.getImports().add("B.cdm.json", "moniker");

        final CdmDocumentDefinition docB = new CdmDocumentDefinition(corpus.getCtx(), "B.cdm.json");
        folder.getDocuments().add(docB);
        docB.getImports().add("C.cdm.json");

        final CdmDocumentDefinition docC = new CdmDocumentDefinition(corpus.getCtx(), "C.cdm.json");
        folder.getDocuments().add(docC);
        docC.getImports().add("B.cdm.json");

        // forces docB to be indexed first.
        docB.indexIfNeededAsync(new ResolveOptions()).join();
        docA.indexIfNeededAsync(new ResolveOptions()).join();
        
        // should contain A, B and C.
        Assert.assertEquals(3, docA.getImportPriorities().getImportPriority().size());

        Assert.assertFalse(docA.getImportPriorities().getHasCircularImport());

        // docB and docC should have the hasCircularImport set to true.
        Assert.assertTrue(docB.getImportPriorities().getHasCircularImport());
        Assert.assertTrue(docC.getImportPriorities().getHasCircularImport());
    }

    /** 
     * Test when A -> B -> C/M -> D -> C.
     * In this case, although B imports C with a moniker, C should be in the A's priorityImports because it is imported by D.
     */
    @Test
    public void TestDeeperCircularImportWithMoniker() throws InterruptedException {
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus("", "", null);
        final CdmFolderDefinition folder = corpus.getStorage().fetchRootFolder("local");

        final CdmDocumentDefinition docA = new CdmDocumentDefinition(corpus.getCtx(), "A.cdm.json");
        folder.getDocuments().add(docA);
        docA.getImports().add("B.cdm.json");

        final CdmDocumentDefinition docB = new CdmDocumentDefinition(corpus.getCtx(), "B.cdm.json");
        folder.getDocuments().add(docB);
        docB.getImports().add("C.cdm.json", "moniker");

        final CdmDocumentDefinition docC = new CdmDocumentDefinition(corpus.getCtx(), "C.cdm.json");
        folder.getDocuments().add(docC);
        docC.getImports().add("D.cdm.json");

        final CdmDocumentDefinition docD = new CdmDocumentDefinition(corpus.getCtx(), "D.cdm.json");
        folder.getDocuments().add(docD);
        docD.getImports().add("C.cdm.json");

        // indexIfNeededAsync will internally call prioritizeImports on every document.
        docA.indexIfNeededAsync(new ResolveOptions()).join();
        
        Assert.assertEquals(4, docA.getImportPriorities().getImportPriority().size());

        // reset the importsPriorities.
        markDocumentsToIndex(folder.getDocuments());

        // force docC to be indexed first, so the priorityList will be read from the cache this time.
        docC.indexIfNeededAsync(new ResolveOptions()).join();
        docA.indexIfNeededAsync(new ResolveOptions()).join();

        Assert.assertEquals(4, docA.getImportPriorities().getImportPriority().size());

        // indexes the rest of the documents.
        docB.indexIfNeededAsync(new ResolveOptions()).join();
        docD.indexIfNeededAsync(new ResolveOptions()).join();

        Assert.assertFalse(docA.getImportPriorities().getHasCircularImport());
        Assert.assertFalse(docB.getImportPriorities().getHasCircularImport());
        Assert.assertTrue(docC.getImportPriorities().getHasCircularImport());
        Assert.assertTrue(docD.getImportPriorities().getHasCircularImport());
    }

    /// <summary>
    /// Test if monikered imports are not being added to the priorityList.
    /// A -> B/M -> C
    /// </summary>
    @Test
    public void TestMonikeredImportIsNotAdded() throws InterruptedException {
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus("", "", null);
        final CdmFolderDefinition folder = corpus.getStorage().fetchRootFolder("local");

        final CdmDocumentDefinition docA = new CdmDocumentDefinition(corpus.getCtx(), "A.cdm.json");
        folder.getDocuments().add(docA);
        docA.getImports().add("B.cdm.json", "moniker");

        final CdmDocumentDefinition docB = new CdmDocumentDefinition(corpus.getCtx(), "B.cdm.json");
        folder.getDocuments().add(docB);
        docB.getImports().add("C.cdm.json");
        
        final CdmDocumentDefinition docC = new CdmDocumentDefinition(corpus.getCtx(), "C.cdm.json");
        folder.getDocuments().add(docC);

        // forces docB to be indexed first, so the priorityList will be read from the cache this time.
        docB.indexIfNeededAsync(new ResolveOptions(docB)).join();
        docA.indexIfNeededAsync(new ResolveOptions(docA)).join();

        // should only contain docA and docC, docB should be excluded.
        Assert.assertEquals(2, docA.getImportPriorities().getImportPriority().size());

        Assert.assertFalse(docA.getImportPriorities().getHasCircularImport());
        Assert.assertFalse(docB.getImportPriorities().getHasCircularImport());
        Assert.assertFalse(docC.getImportPriorities().getHasCircularImport());
    }

    /**
     * Sets the document's isDirty flag to true and reset the importPriority.
     */
    private static void markDocumentsToIndex(CdmDocumentCollection documents)
    {
        documents.forEach(document -> {
            document.setNeedsIndexing(true);
            document.setImportPriorities(null);
        });
    }
}