// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import java.io.File;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.utilities.ImportInfo;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;

import org.testng.annotations.Test;
import org.testng.Assert;

/**
 * Tests for the CdmDocumentDefinition class.
 */
public class DocumentDefinitionTest {
    private static final String TESTS_SUBPATH = new File("Cdm", "Document").toString();

    /**
     * Test when A -> M/B -> C -> B. In this case, although A imports B with a
     * moniker, B should be in the priorityImports because it is imported by C.
     */
    @Test
    public void testCircularImportWithMoniker() throws InterruptedException {
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testCircularImportWithMoniker");
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
        docB.indexIfNeededAsync(new ResolveOptions(), true).join();
        docA.indexIfNeededAsync(new ResolveOptions(), true).join();

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
    public void testDeeperCircularImportWithMoniker() throws InterruptedException {
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testDeeperCircularImportWithMoniker");
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
        docA.indexIfNeededAsync(new ResolveOptions(), true).join();

        Assert.assertEquals(4, docA.getImportPriorities().getImportPriority().size());
        assertImportInfo(docA.getImportPriorities().getImportPriority().get(docA), 0, false);
        assertImportInfo(docA.getImportPriorities().getImportPriority().get(docB), 1, false);
        assertImportInfo(docA.getImportPriorities().getImportPriority().get(docD), 2, false);
        assertImportInfo(docA.getImportPriorities().getImportPriority().get(docC), 3, false);

        // reset the importsPriorities.
        markDocumentsToIndex(folder.getDocuments());

        // force docC to be indexed first, so the priorityList will be read from the cache this time.
        docC.indexIfNeededAsync(new ResolveOptions(), true).join();
        docA.indexIfNeededAsync(new ResolveOptions(), true).join();

        Assert.assertEquals(4, docA.getImportPriorities().getImportPriority().size());

        // indexes the rest of the documents.
        docB.indexIfNeededAsync(new ResolveOptions(), true).join();
        docD.indexIfNeededAsync(new ResolveOptions(), true).join();

        Assert.assertFalse(docA.getImportPriorities().getHasCircularImport());
        Assert.assertFalse(docB.getImportPriorities().getHasCircularImport());
        Assert.assertTrue(docC.getImportPriorities().getHasCircularImport());
        Assert.assertTrue(docD.getImportPriorities().getHasCircularImport());
    }

    /**
     * Test when A -> B -> C/M -> D.
     * Index docB first then docA. Make sure that C does not appear in docA priority list.
     */
    @Test
    public void testReadingCachedImportPriority() throws InterruptedException {
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testReadingCachedImportPriority");
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

        // index docB first and check its import priorities.
        docB.indexIfNeededAsync(new ResolveOptions(), true).join();

        Assert.assertEquals(3, docB.getImportPriorities().getImportPriority().size());
        assertImportInfo(docB.getImportPriorities().getImportPriority().get(docB), 0, false);
        assertImportInfo(docB.getImportPriorities().getImportPriority().get(docD), 1, false);
        assertImportInfo(docB.getImportPriorities().getImportPriority().get(docC), 2, true);

        // now index docA, which should read docB's priority list from the cache.
        docA.indexIfNeededAsync(new ResolveOptions(), true).join();
        Assert.assertEquals(3, docA.getImportPriorities().getImportPriority().size());
        assertImportInfo(docA.getImportPriorities().getImportPriority().get(docA), 0, false);
        assertImportInfo(docA.getImportPriorities().getImportPriority().get(docB), 1, false);
        assertImportInfo(docA.getImportPriorities().getImportPriority().get(docD), 2, false);
    }

    /**
     * Test if monikered imports are added to the end of the priority list.
     * A -> B/M -> C
     */
    @Test
    public void testMonikeredImportIsAddedToEnd() throws InterruptedException {
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testMonikeredImportIsAddedToEnd");
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
        docB.indexIfNeededAsync(new ResolveOptions(docB), true).join();
        docA.indexIfNeededAsync(new ResolveOptions(docA), true).join();

        // should only contain docA and docC, docB should be excluded.
        Assert.assertEquals(3, docA.getImportPriorities().getImportPriority().size());
        assertImportInfo(docA.getImportPriorities().getImportPriority().get(docA), 0, false);
        assertImportInfo(docA.getImportPriorities().getImportPriority().get(docC), 1, false);
        // docB is monikered so it should appear at the end of the list.
        assertImportInfo(docA.getImportPriorities().getImportPriority().get(docB), 2, true);

        // make sure that the has circular import is set to false.
        Assert.assertFalse(docA.getImportPriorities().getHasCircularImport());
        Assert.assertFalse(docB.getImportPriorities().getHasCircularImport());
        Assert.assertFalse(docC.getImportPriorities().getHasCircularImport());
    }

    /**
     * Setting the forceReload flag to true correctly reloads the document
     */
    @Test
    public void testDocumentForceReload() throws InterruptedException {
        final String testName = "testDocumentForceReload";
        final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName);

        // load the document and entity the first time
        corpus.<CdmEntityDefinition>fetchObjectAsync("doc.cdm.json/entity").join();
        // reload the same doc and make sure it is reloaded correctly
        CdmEntityDefinition reloadedEntity = corpus.<CdmEntityDefinition>fetchObjectAsync("doc.cdm.json/entity", null, null, true).join();

        // if the reloaded doc is not indexed correctly, the entity will not be able to be found
        Assert.assertNotNull(reloadedEntity);
    }

    /**
     * Tests if the DocumentVersion is set on the resolved document
     */
    @Test
    public void testDocumentVersionSetOnResolution() throws InterruptedException {
        String testName = "testDocumentVersionSetOnResolution";
        CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName);

        CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/default.manifest.cdm.json").join();
        CdmDocumentDefinition document = corpus.<CdmDocumentDefinition>fetchObjectAsync("local:/Person.cdm.json").join();

        Assert.assertEquals(manifest.getDocumentVersion(), "2.1.3");
        Assert.assertEquals(document.getDocumentVersion(), "1.5");

        CdmManifestDefinition resManifest = manifest.createResolvedManifestAsync("res-" + manifest.getName(), null).join();
        CdmEntityDefinition resEntity = corpus.<CdmEntityDefinition>fetchObjectAsync(resManifest.getEntities().get(0).getEntityPath(), resManifest).join();
        CdmDocumentDefinition resDocument = resEntity.getInDocument();

        Assert.assertEquals(resManifest.getDocumentVersion(), "2.1.3");
        Assert.assertEquals(resDocument.getDocumentVersion(), "1.5");
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

    /**
     * Helper function to assert the ImportInfo class.
     */
    private static void assertImportInfo(ImportInfo importInfo, int expectedPriority, boolean expectedIsMoniker)
    {
        Assert.assertEquals(expectedPriority, importInfo.getPriority());
        Assert.assertEquals(expectedIsMoniker, importInfo.getIsMoniker());
    }
}