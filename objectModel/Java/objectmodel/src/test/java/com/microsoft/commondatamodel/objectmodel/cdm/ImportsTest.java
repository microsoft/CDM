// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import static org.testng.Assert.assertNotNull;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmRelationshipDiscoveryStyle;
import com.microsoft.commondatamodel.objectmodel.enums.ImportsLoadStrategy;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import java.io.File;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;

import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapterBase;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import org.testng.Assert;
import org.testng.annotations.Test;

public class ImportsTest {
  /**
   * The path between TestDataPath and TestName.
   */
  private static final String TESTS_SUBPATH = new File("Cdm", "Imports").toString();

  @Test
  public void testEntityWithMissingImport() throws InterruptedException {
    final HashSet<CdmLogCode> expectedLogCodes = new HashSet<> (Arrays.asList(CdmLogCode.ErrPersistFileReadFailure, CdmLogCode.WarnResolveImportFailed, CdmLogCode.WarnDocImportNotLoaded));
    final CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testEntityWithMissingImport", null, false, expectedLogCodes);

    final ResolveOptions resOpt = new ResolveOptions();
    resOpt.setImportsLoadStrategy(ImportsLoadStrategy.Load);

    final CdmDocumentDefinition doc =
            cdmCorpus.<CdmDocumentDefinition>fetchObjectAsync(
                    "local:/missingImport.cdm.json",
                    null,
                    resOpt
            ).join();
    assertNotNull(doc);
    Assert.assertEquals(doc.getImports().getCount(), 1);
    Assert.assertEquals(
            doc.getImports().get(0).getCorpusPath(),
            "missing.cdm.json");
    Assert.assertNull((doc.getImports().get(0)).getDocument());
  }

  @Test
  public void testEntityWithMissingNestedImportsAsync() throws InterruptedException {
    final HashSet<CdmLogCode> expectedLogCodes = new HashSet<> (Arrays.asList(CdmLogCode.ErrPersistFileReadFailure, CdmLogCode.WarnResolveImportFailed, CdmLogCode.WarnDocImportNotLoaded));
    final CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testEntityWithMissingNestedImportsAsync", null, false, expectedLogCodes);

    final ResolveOptions resOpt = new ResolveOptions();
    resOpt.setImportsLoadStrategy(ImportsLoadStrategy.Load);

    final CdmDocumentDefinition doc =
            cdmCorpus.<CdmDocumentDefinition>fetchObjectAsync(
                    "local:/missingNestedImport.cdm.json",
                    null,
                    resOpt
            ).join();

    assertNotNull(doc);
    Assert.assertEquals(doc.getImports().getCount(), 1);
    final CdmDocumentDefinition firstImport = doc.getImports().get(0).getDocument();
    Assert.assertEquals(firstImport.getImports().getCount(), 1);
    Assert.assertEquals(firstImport.getName(), "notMissing.cdm.json");
    final CdmDocumentDefinition nestedImport = firstImport.getImports().get(0).getDocument();
    Assert.assertNull(nestedImport);
  }

  @Test
  public void testEntityWithSameImportsAsync() throws InterruptedException {
    final HashSet<CdmLogCode> expectedLogCodes = new HashSet<> (Arrays.asList(CdmLogCode.ErrPersistFileReadFailure, CdmLogCode.WarnResolveImportFailed, CdmLogCode.WarnDocImportNotLoaded));
    final CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testEntityWithSameImportsAsync", null, false, expectedLogCodes);

    final ResolveOptions resOpt = new ResolveOptions();
    resOpt.setImportsLoadStrategy(ImportsLoadStrategy.Load);

    final CdmDocumentDefinition doc = cdmCorpus.<CdmDocumentDefinition>fetchObjectAsync("local:/multipleImports.cdm.json", null, resOpt).join();

    assertNotNull(doc);
    Assert.assertEquals(doc.getImports().getCount(), 2);
    final CdmDocumentDefinition firstImport = doc.getImports().get(0).getDocument();
    Assert.assertEquals(firstImport.getName(), "missingImport.cdm.json");
    Assert.assertEquals(firstImport.getImports().getCount(), 1);
    final CdmDocumentDefinition secondImport = doc.getImports().get(1).getDocument();
    Assert.assertEquals(secondImport.getName(), "notMissing.cdm.json");
  }

  /**
   * Test an import with a non-existing namespace name.
   */
  @Test
  public void testNonExistingAdapterNamespace() throws InterruptedException {
    final HashSet<CdmLogCode> expectedLogCodes = new HashSet<> (Collections.singletonList(CdmLogCode.ErrPersistFileReadFailure));
    final CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testNonExistingAdapterNamespace", null, false, expectedLogCodes);

    // Register it as a 'local' adapter.
    cdmCorpus.getStorage().mount("erp", new LocalAdapter(TestHelper.getInputFolderPath(TESTS_SUBPATH, "testNonExistingAdapterNamespace")));

    // Set local as our default.
    cdmCorpus.getStorage().setDefaultNamespace("erp");

    // Load a manifest that is trying to import from 'cdm' namespace.
    // The manifest does't exist since the import couldn't get resolved,
    // so the error message will be logged and the null value will be propagated back to a user.
    Assert.assertNull(cdmCorpus.<CdmManifestDefinition>fetchObjectAsync("erp.missingImportManifest.cdm").join());
  }

  /**
   * Testing docs that load the same import.
   */
  @Test
  public void testLoadingSameImportsAsync() throws InterruptedException {
    final CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testLoadingSameImportsAsync");
    final ResolveOptions resOpt = new ResolveOptions();
    resOpt.setImportsLoadStrategy(ImportsLoadStrategy.Load);

    CdmDocumentDefinition mainDoc = cdmCorpus.<CdmDocumentDefinition>fetchObjectAsync("mainEntity.cdm.json", null, resOpt).join();
    Assert.assertNotNull(mainDoc);
    Assert.assertEquals(mainDoc.getImports().getCount(), 2);

    CdmDocumentDefinition firstImport = mainDoc.getImports().get(0).getDocument();
    CdmDocumentDefinition secondImport = mainDoc.getImports().get(1).getDocument();

    // Since these two imports are loaded asynchronously, we need to make sure that
    // the import that they share (targetImport) was loaded, and that the
    // targetImport doc is attached to both of these import objects.
    Assert.assertEquals(firstImport.getImports().getCount(), 1);
    Assert.assertNotNull(firstImport.getImports().get(0).getDocument());
    Assert.assertEquals(secondImport.getImports().getCount(), 1);
    Assert.assertNotNull(secondImport.getImports().get(0).getDocument());
  }

  /**
   * Testing docs that load the same import.
   */
  @Test
  public void testLoadingSameMissingImportsAsync() throws InterruptedException {
    final HashSet<CdmLogCode> expectedLogCodes = new HashSet<> (Arrays.asList(CdmLogCode.ErrPersistFileReadFailure, CdmLogCode.WarnResolveImportFailed, CdmLogCode.WarnDocImportNotLoaded));
    final CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testLoadingSameMissingImportsAsync", null, false, expectedLogCodes);

    final ResolveOptions resOpt = new ResolveOptions();
    resOpt.setImportsLoadStrategy(ImportsLoadStrategy.Load);

    CdmDocumentDefinition mainDoc = cdmCorpus.<CdmDocumentDefinition>fetchObjectAsync("mainEntity.cdm.json", null, resOpt).join();
    Assert.assertNotNull(mainDoc);
    Assert.assertEquals(mainDoc.getImports().getCount(), 2);

    // Make sure imports loaded correctly, despite them missing imports.
    CdmDocumentDefinition firstImport = mainDoc.getImports().get(0).getDocument();
    CdmDocumentDefinition secondImport = mainDoc.getImports().get(0).getDocument();

    Assert.assertEquals(firstImport.getImports().getCount(), 1);
    Assert.assertNull(firstImport.getImports().get(0).getDocument());

    Assert.assertEquals(secondImport.getImports().getCount(), 1);
    Assert.assertNull(firstImport.getImports().get(0).getDocument());
  }

  /**
   * Testing docs that load the same import.
   */
  @Test
  public void testLoadingAlreadyPresentImportsAsync() throws InterruptedException {
    final CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testLoadingAlreadyPresentImportsAsync");
    final ResolveOptions resOpt = new ResolveOptions();
    resOpt.setImportsLoadStrategy(ImportsLoadStrategy.Load);

    // Load the first doc.
    CdmDocumentDefinition mainDoc = cdmCorpus.<CdmDocumentDefinition>fetchObjectAsync("mainEntity.cdm.json", null, resOpt).join();
    Assert.assertNotNull(mainDoc);
    Assert.assertEquals(mainDoc.getImports().getCount(), 1);

    CdmDocumentDefinition importDoc = mainDoc.getImports().get(0).getDocument();
    Assert.assertNotNull(importDoc);

    // Now load the second doc, which uses the same import.
    // The import should not be loaded again, it should be the same object.
    CdmDocumentDefinition secondDoc = cdmCorpus.<CdmDocumentDefinition>fetchObjectAsync("secondEntity.cdm.json").join();
    Assert.assertNotNull(secondDoc);
    Assert.assertEquals(secondDoc.getImports().getCount(), 1);

    CdmDocumentDefinition secondImportDoc = mainDoc.getImports().get(0).getDocument();
    Assert.assertNotNull(secondImportDoc);

    Assert.assertEquals(importDoc, secondImportDoc);
  }

  /**
   * Testing that import priorities update correctly when imports are changed
   */
  @Test
  public void testPrioritizingImportsAfterEdit() throws InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testPrioritizingImportsAfterEdit");

    final CdmDocumentDefinition document = corpus.<CdmDocumentDefinition>fetchObjectAsync("local:/mainDoc.cdm.json").join();
    document.refreshAsync(new ResolveOptions(document)).join();

    Assert.assertEquals(document.getImports().size(), 0);
    // the current doc itself is added to the list of priorities
    Assert.assertEquals(document.getImportPriorities().getImportPriority().size(), 1);

    document.getImports().add("importDoc.cdm.json", true);
    document.refreshAsync(new ResolveOptions(document)).join();

    Assert.assertEquals(document.getImports().size(), 1);
    Assert.assertEquals(document.getImportPriorities().getImportPriority().size(), 2);
  }

  /**
   * Testing that import for elevated purpose traits for relationships are added.
   */
  @Test
  public void testImportsForRelElevatedPurposeTraits() throws InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testImportsForRelElevatedPurposeTraits");
    final CdmManifestDefinition rootManifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/default.manifest.cdm.json").join();
    final CdmManifestDefinition subManifest = corpus.<CdmManifestDefinition>fetchObjectAsync(rootManifest.getSubManifests().get(0).getDefinition()).join();

    corpus.calculateEntityGraphAsync(rootManifest).join();
    rootManifest.populateManifestRelationshipsAsync(CdmRelationshipDiscoveryStyle.Exclusive).join();

    // Assert having relative path
    Assert.assertEquals(rootManifest.getImports().get(0).getCorpusPath(), "specialized/Gold.cdm.json");
    Assert.assertEquals(subManifest.getImports().get(0).getCorpusPath(), "/Lead.cdm.json");

    corpus.getStorage().fetchRootFolder("output").getDocuments().add(rootManifest);
    corpus.getStorage().fetchRootFolder("output").getDocuments().add(subManifest);
    CopyOptions co = new CopyOptions();
    co.setSaveConfigFile(false);
    rootManifest.saveAsAsync("output:/default.manifest.cdm.json", false, co).join();
    // "acct.trait" in Acct.cdm.json. relationships in the manifests contain these 2 traits, 
    // so the manifest should import these two entity documents, but Lead.cdm.json imports Acct.cdm.json. 
    // Thus, the manifest can only import Lead.cdm.json
    subManifest.saveAsAsync("output:/default-submanifest.manifest.cdm.json", false, co).join();

    // Compare the result.
    TestHelper.assertFolderFilesEquality(
            TestHelper.getExpectedOutputFolderPath(TESTS_SUBPATH, "testImportsForRelElevatedPurposeTraits"),
            TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, "testImportsForRelElevatedPurposeTraits"));
  }
}
