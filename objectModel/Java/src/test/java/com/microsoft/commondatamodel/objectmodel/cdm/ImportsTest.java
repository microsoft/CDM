package com.microsoft.commondatamodel.objectmodel.cdm;

import static org.testng.Assert.assertNotNull;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.StorageAdapter;
import java.io.File;
import org.testng.Assert;
import org.testng.annotations.Test;

public class ImportsTest {
  /**
   * The path between TestDataPath and TestName.
   */
  private static final String TESTS_SUBPATH = new File("cdm", "imports").toString();

  @Test
  public void testEntityWithMissingImport() throws InterruptedException {
    final StorageAdapter localAdapter =
        this.createStorageAdapterForTest("testEntityWithMissingImport");

    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
    cdmCorpus.getStorage().mount("local", localAdapter);

    final CdmDocumentDefinition doc =
        cdmCorpus.<CdmDocumentDefinition>fetchObjectAsync(
            "local:/missingImport.cdm.json"
        ).join();
    assertNotNull(doc);
    Assert.assertEquals(doc.getImports().getCount(), 1);
    Assert.assertEquals(
        doc.getImports().getAllItems().get(0).getCorpusPath(),
        "missing.cdm.json");
    Assert.assertNull((doc.getImports().getAllItems().get(0)).getDoc());
  }

  @Test
  public void testEntityWithMissingNestedImports() throws InterruptedException {
    final StorageAdapter localAdapter =
        this.createStorageAdapterForTest("testEntityWithMissingNestedImports");

    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
    cdmCorpus.getStorage().mount("local", localAdapter);

    final CdmDocumentDefinition doc =
        cdmCorpus.<CdmDocumentDefinition>fetchObjectAsync(
            "local:/missingNestedImport.cdm.json"
        ).join();

    assertNotNull(doc);
    Assert.assertEquals(doc.getImports().getCount(), 1);
    final CdmDocumentDefinition firstImport = doc.getImports().getAllItems().get(0).getDoc();
    Assert.assertEquals(firstImport.getImports().getCount(), 1);
    Assert.assertEquals(firstImport.getName(), "notMissing.cdm.json");
    final CdmDocumentDefinition nestedImport = firstImport.getImports().getAllItems().get(0).getDoc();
    Assert.assertNull(nestedImport);
  }

  @Test
  public void testEntityWithSameImports() throws InterruptedException {
    final StorageAdapter localAdapter = this.createStorageAdapterForTest("testEntityWithSameImports");

    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
    cdmCorpus.getStorage().mount("local", localAdapter);

    final CdmDocumentDefinition doc = cdmCorpus.<CdmDocumentDefinition>fetchObjectAsync("local:/multipleImports.cdm.json").join();

    assertNotNull(doc);
    Assert.assertEquals(doc.getImports().getCount(), 2);
    final CdmDocumentDefinition firstImport = doc.getImports().getAllItems().get(0).getDoc();
    Assert.assertEquals(firstImport.getName(), "missingImport.cdm.json");
    Assert.assertEquals(firstImport.getImports().getCount(), 1);
    final CdmDocumentDefinition secondImport = doc.getImports().getAllItems().get(1).getDoc();
    Assert.assertEquals(secondImport.getName(), "notMissing.cdm.json");
  }

  /**
   * Test an import with a non-existing namespace name.
   */
  @Test
  public void testNonExistingAdapterNamespace() throws InterruptedException {
    final StorageAdapter localAdapter = this.createStorageAdapterForTest("testNonExistingAdapterNamespace");

    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();

    // Register it as a 'local' adapter.
    cdmCorpus.getStorage().mount("erp", localAdapter);

    // Set local as our default.
    cdmCorpus.getStorage().setDefaultNamespace("erp");

    // Load a manifest that is trying to import from 'cdm' namespace.
    // The manifest does't exist since the import couldn't get resolved,
    // so the error message will be logged and the null value will be propagated back to a user.
    Assert.assertNull(cdmCorpus.<CdmManifestDefinition>fetchObjectAsync("erp.missingImportManifest.cdm").join());
  }

  /**
   * Creates a storage adapter used to retrieve input files associated with test.
   *
   * @param testName The name of the test we should retrieve input files for.
   * @return The storage adapter to be used by the named test method.
   */
  private StorageAdapter createStorageAdapterForTest(String testName) throws InterruptedException {
    return new LocalAdapter(TestHelper.getInputFolderPath(TESTS_SUBPATH, testName));
  }
}
