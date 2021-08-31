// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.TestStorageAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.RemoteAdapter;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import org.testng.AssertJUnit;
import org.testng.annotations.Test;
import org.testng.Assert;

public class PersistenceLayerTest {
  private static String testsSubpath = new File("persistence", "persistencelayer").toString();

  @Test
  public void testInvalidJson() throws InterruptedException {
    String testInputPath = TestHelper.getInputFolderPath(testsSubpath, "testInvalidJson");

    CdmCorpusDefinition corpus = new CdmCorpusDefinition();
    corpus.getStorage().mount("local", new LocalAdapter(testInputPath));
    corpus.getStorage().setDefaultNamespace("local");

    CdmManifestDefinition invalidManifest = null;
    try {
      invalidManifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/invalidManifest.manifest.cdm.json").get();
    } catch (Exception e) {
      AssertJUnit.fail("Error should not be thrown when input json is invalid.");
    }
    AssertJUnit.assertNull(invalidManifest);
  }

  /**
   * Test that a document is fetched and saved using the correct persistence class, regardless of the case sensitivity of the file name/extension.
   * @throws InterruptedException
   * @throws ExecutionException
   * @throws IOException
   */
  @Test
  public void testFetchingAndSavingDocumentsWithCaseInsensitiveCheck() throws InterruptedException, ExecutionException, IOException {
    String testName = "testFetchingAndSavingDocumentsWithCaseInsensitiveCheck";
    String testInputPath = TestHelper.getInputFolderPath(testsSubpath, testName);

    CdmCorpusDefinition corpus = new CdmCorpusDefinition();
    LocalAdapter localAdapter = new LocalAdapter(testInputPath);
    corpus.getStorage().mount("local", localAdapter);

    final RemoteAdapter remoteAdapter = new RemoteAdapter();
    final Map<String, String> hosts = new HashMap<>();
    hosts.put("contoso", "http://contoso.com");
    remoteAdapter.setHosts(hosts);

    corpus.getStorage().mount("remote", remoteAdapter);
    corpus.getStorage().unmount("cdm");
    corpus.getStorage().setDefaultNamespace("local");

    CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("empty.manifest.cdm.json").get();
    CdmManifestDefinition manifestFromModelJson = corpus.<CdmManifestDefinition>fetchObjectAsync("model.json").get();

    // Swap out the adapter for a fake one so that we aren't actually saving files. 
    Map<String, String> allDocs = new LinkedHashMap<>();
    TestStorageAdapter testAdapter = new TestStorageAdapter(allDocs);
    corpus.getStorage().setAdapter("local", testAdapter);

    String newManifestName = "empty.MANIFEST.CDM.json";
    manifest.saveAsAsync(newManifestName, true).get();
    // Verify that manifest persistence was called by comparing the saved document to the original manifest.
    String serializedManifest = allDocs.get("/" + newManifestName);;
    String expectedOutputManifest = TestHelper.getExpectedOutputFileContent(testsSubpath, testName, manifest.getName());
    TestHelper.assertSameObjectWasSerialized(expectedOutputManifest, serializedManifest);

    String newManifestFromModelJsonName = "MODEL.json";
    manifestFromModelJson.saveAsAsync(newManifestFromModelJsonName, true).get();
    // Verify that model.json persistence was called by comparing the saved document to the original model.json.
    serializedManifest = allDocs.get("/" + newManifestFromModelJsonName);
    expectedOutputManifest = TestHelper.getExpectedOutputFileContent(testsSubpath, testName, manifestFromModelJson.getName());
    TestHelper.assertSameObjectWasSerialized(expectedOutputManifest, serializedManifest);
  }

  /**
   * Test that saving a model.json that isn't named exactly as such fails to save.
   * @throws ExecutionException
   * @throws InterruptedException
   */
  @Test
  public void testSavingInvalidModelJsonName() throws ExecutionException, InterruptedException {
    CdmCorpusDefinition corpus = new CdmCorpusDefinition();
    corpus.getStorage().unmount("cdm");
    corpus.getStorage().setDefaultNamespace("local");
    CdmManifestDefinition manifest = new CdmManifestDefinition(corpus.getCtx(), "manifest");
    corpus.getStorage().fetchRootFolder("local").getDocuments().add(manifest);

    Map<String, String> allDocs = new LinkedHashMap<>();
    TestStorageAdapter testAdapter = new TestStorageAdapter(allDocs);
    corpus.getStorage().setAdapter("local", testAdapter);

    String newManifestFromModelJsonName = "my.model.json";
    manifest.saveAsAsync(newManifestFromModelJsonName, true).get();
    // TODO: because we can load documents properly now, SaveAsAsync returns false. Will check the value returned from SaveAsAsync() when the problem is solved
    AssertJUnit.assertFalse(allDocs.containsKey("/" + newManifestFromModelJsonName));
  }

  /**
   * Test that loading a model.json that isn't named exactly as such fails to load.
   */
  @Test
  public void testLoadingInvalidModelJsonName() throws InterruptedException, ExecutionException {
    String testName = "testLoadingInvalidModelJsonName";
    String testInputPath = TestHelper.getInputFolderPath(testsSubpath, testName);

    CdmCorpusDefinition corpus = new CdmCorpusDefinition();
    corpus.getStorage().mount("local", new LocalAdapter(testInputPath));
    corpus.getStorage().setDefaultNamespace("local");

    // We are trying to load a file with an invalid name, so FetchObjectAsync() should just return null.
    CdmManifestDefinition invalidModelJson = corpus.<CdmManifestDefinition>fetchObjectAsync("test.model.json").get();
    AssertJUnit.assertNull(invalidModelJson);
  }

  /**
   * 
   */
  @Test
  public void testModelJsonTypeAttributePersistence() throws InterruptedException, ExecutionException {
    CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(testsSubpath, "TestModelJsonTypeAttributePersistence");

    // we need to create a second adapter to the output folder to fool the OM into thinking it's different
    // this is because there is a bug currently that prevents us from saving and then loading a model.json
    corpus.getStorage().mount("alternateOutput", new LocalAdapter(TestHelper.getActualOutputFolderPath(testsSubpath, "TestModelJsonTypeAttributePersistence")));

    // create manifest
    String entityName = "TestTypeAttributePersistence";
    CdmFolderDefinition localRoot = corpus.getStorage().fetchRootFolder("local");
    CdmFolderDefinition outputRoot = corpus.getStorage().fetchRootFolder("output");
    CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>makeObject(CdmObjectType.ManifestDef, "tempAbstract");
    manifest.getImports().add("cdm:/foundations.cdm.json", null);
    localRoot.getDocuments().add(manifest);

    // create entity
    CdmDocumentDefinition doc = corpus.<CdmDocumentDefinition>makeObject(CdmObjectType.DocumentDef, entityName + ".cdm.json");
    doc.getImports().add("cdm:/foundations.cdm.json", null);
    localRoot.getDocuments().add(doc, doc.getName());
    CdmEntityDefinition entityDef = (CdmEntityDefinition)doc.getDefinitions().add(CdmObjectType.EntityDef, entityName);

    // create type attribute
    CdmTypeAttributeDefinition cdmTypeAttributeDefinition = corpus.<CdmTypeAttributeDefinition>makeObject(CdmObjectType.TypeAttributeDef, entityName, false);
    cdmTypeAttributeDefinition.updateIsReadOnly(true);
    entityDef.getAttributes().add(cdmTypeAttributeDefinition);

    manifest.getEntities().add(entityDef);

    CdmManifestDefinition manifestResolved = manifest.createResolvedManifestAsync("default", null).join();
    outputRoot.getDocuments().add(manifestResolved);
    manifestResolved.getImports().add("cdm:/foundations.cdm.json");
    manifestResolved.saveAsAsync("model.json", true).join();
    CdmManifestDefinition newManifest = corpus.<CdmManifestDefinition>fetchObjectAsync("alternateOutput:/model.json").join();

    CdmEntityDefinition newEnt = corpus.<CdmEntityDefinition>fetchObjectAsync(newManifest.getEntities().get(0).getEntityPath(), manifest).join();
    CdmTypeAttributeDefinition typeAttribute = (CdmTypeAttributeDefinition)newEnt.getAttributes().get(0);
    Assert.assertTrue(typeAttribute.fetchIsReadOnly());
  }

  /**
   * Test that the persistence layer handles the case when the persistence format cannot be found.
   */
  @Test
  public void testMissingPersistenceFormat() throws InterruptedException{
    CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(testsSubpath, "TestMissingPersistenceFormat");
    CdmFolderDefinition folder = corpus.getStorage().fetchRootFolder(corpus.getStorage().getDefaultNamespace());

    CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>makeObject(CdmObjectType.ManifestDef, "someManifest");
    folder.getDocuments().add(manifest);
    // trying to save to an unsupported format should return false and not fail
    boolean succeded = manifest.saveAsAsync("manifest.unSupportedExtension").join();
    Assert.assertFalse(succeded);
  }
}
