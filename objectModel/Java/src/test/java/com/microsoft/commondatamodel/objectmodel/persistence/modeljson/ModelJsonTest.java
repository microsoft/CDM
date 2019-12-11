package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.Import;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ManifestContent;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.LocalEntity;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Model;
import com.microsoft.commondatamodel.objectmodel.storage.AdlsAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.ExecutionException;
import org.json.JSONException;
import org.skyscreamer.jsonassert.JSONAssert;
import org.testng.Assert;
import org.testng.annotations.Test;

public class ModelJsonTest extends ModelJsonTestBase {
  private static final String LOCAL = "local";
  private static final String MODEL_JSON = "model.json";

  /**
   * Whether debugging files should be written or not.
   */
  private final boolean doesWriteTestDebuggingFiles = TestHelper.doesWriteTestDebuggingFiles;
  private final String TESTS_SUBPATH = new File(new File("persistence", "modeljson"), "modeljson").toString();

  @Test
  public void testFromAndToData() throws Exception {
    final String testInputPath = TestHelper.getInputFolderPath(TESTS_SUBPATH, "testFromAndToData");
    final CdmCorpusDefinition cdmCorpus = this.getLocalCorpus(testInputPath);

    final CdmManifestDefinition cdmManifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync(
        MODEL_JSON,
        cdmCorpus.getStorage().fetchRootFolder(LOCAL))
        .join();
    final Model obtainedModelJson = ManifestPersistence.toData(cdmManifest, null, null).join();

    this.handleOutput("testFromAndToData", MODEL_JSON, obtainedModelJson);
  }

  @Test
  public void testLoadingModelJsonWithInvalidPath()
      throws InterruptedException, ExecutionException, IOException, JSONException {
    final String testInputPath =
        TestHelper.getInputFolderPath(TESTS_SUBPATH, "testLoadingModelJsonWithInvalidPath");
    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
    cdmCorpus.getStorage().mount("local", new LocalAdapter(testInputPath));
    cdmCorpus.getStorage().setDefaultNamespace("local");
    final AdlsAdapter adlsAdapter = new AdlsAdapter(
        "<ACCOUNT-NAME>.dfs.core.windows.net",
        "/<FILESYSTEM-NAME>",
        "72f988bf-86f1-41af-91ab-2d7cd011db47",
        "<CLIENT-ID>",
        "<CLIENT-SECRET>"
    );
    cdmCorpus.getStorage().mount("adls", adlsAdapter);

    final CdmManifestDefinition manifest =
        cdmCorpus.<CdmManifestDefinition>fetchObjectAsync("local:/model.json").get();
    final Model obtainedModelJson = ManifestPersistence.toData(manifest, null, null).get();

    this.handleOutput("testLoadingModelJsonWithInvalidPath", MODEL_JSON, obtainedModelJson);
  }

  @Test
  public void testLoadingCdmFolderAndSavingModelJson() throws Exception {
    final String testInputPath = TestHelper.getInputFolderPath(TESTS_SUBPATH, "testLoadingCdmFolderAndSavingModelJson");
    final CdmCorpusDefinition cdmCorpus = this.getLocalCorpus(testInputPath);

    final CdmManifestDefinition cdmManifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync(
        "default.manifest.cdm.json",
        cdmCorpus.getStorage().fetchRootFolder(LOCAL)).join();
    final Model obtainedModelJson = ManifestPersistence.toData(cdmManifest, null, null).get();

    this.handleOutput("testLoadingCdmFolderAndSavingModelJson", MODEL_JSON, obtainedModelJson);
  }

  @Test
  public void testLoadingModelJsonResultAndSavingCdmFolder() throws IOException, InterruptedException, JSONException {
    final String testInputPath = TestHelper.getInputFolderPath(TESTS_SUBPATH, "testLoadingModelJsonResultAndSavingCdmFolder");
    final CdmCorpusDefinition cdmCorpus = this.getLocalCorpus(testInputPath);

    final CdmManifestDefinition cdmManifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync(
        "model.json",
        cdmCorpus.getStorage().fetchRootFolder(LOCAL))
        .join();
    final ManifestContent obtainedCdmFolder = com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence.toData(cdmManifest, null, null);
    this.handleOutput("testLoadingModelJsonResultAndSavingCdmFolder", "cdmFolder.json", obtainedCdmFolder);
  }

  @Test
  public void testLoadingModelJsonAndSavingCdmFolder() throws Exception {
    final String testInputPath = TestHelper.getInputFolderPath(TESTS_SUBPATH, "testLoadingModelJsonAndSavingCdmFolder");
    final CdmCorpusDefinition cdmCorpus = this.getLocalCorpus(testInputPath);

    final CdmManifestDefinition cdmManifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync(
        MODEL_JSON,
        cdmCorpus.getStorage().fetchRootFolder(LOCAL))
        .join();
    final ManifestContent obtainedCdmFolder = com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence.toData(cdmManifest, null, null);

    this.handleOutput("testLoadingModelJsonAndSavingCdmFolder", "cdmFolder.json", obtainedCdmFolder);
  }

  /*
   Test loading CDM folder result files and save as model.json.
   */
  @Test
  public void testLoadingCdmFolderResultAndSavingModelJson()
      throws IOException, InterruptedException, JSONException, ExecutionException {
    final String testInputPath = TestHelper.getInputFolderPath(TESTS_SUBPATH,
            "testLoadingCdmFolderResultAndSavingModelJson");
    final CdmCorpusDefinition cdmCorpus = this.getLocalCorpus(testInputPath);
    final CdmManifestDefinition cdmManifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync(
        "result.model.manifest.cdm.json",
        cdmCorpus.getStorage().fetchRootFolder(LOCAL))
        .join();

    final Model obtainedModelJson = ManifestPersistence.toData(cdmManifest, null, null).get();

    // remove empty description from entities as they interfere with test.
    obtainedModelJson.getEntities().forEach(entity -> removeDescriptionFromEntityIfEmpty(JMapper.MAP.valueToTree(entity)));
    obtainedModelJson.setDescription(null);

    this.handleOutput("testLoadingCdmFolderResultAndSavingModelJson", "model.json", obtainedModelJson);
  }

  /**
   * Test if the imports location are relative to the root level file.
   */
  @Test
  public void testImportsRelativePath() throws ExecutionException, InterruptedException {
    // The corpus path in the imports are relative to the document where it was defined.
    // When saving in model.json the documents are flattened to the manifest level
    // so it is necessary to recalculate the path to be relative to the manifest.
    final CdmCorpusDefinition corpus = this.getLocalCorpus("notImportantLocation");
    final CdmFolderDefinition folder = corpus.getStorage().fetchRootFolder(LOCAL);

    final CdmManifestDefinition manifest = new CdmManifestDefinition(corpus.getCtx(), "manifest");
    final CdmEntityDeclarationDefinition entityDeclaration =
        manifest.getEntities().add("EntityName", "EntityName/EntityName.cdm.json/EntityName");
    folder.getDocuments().add(manifest);

    final CdmFolderDefinition entityFolder = folder.getChildFolders().add("EntityName");

    final CdmDocumentDefinition document =
        new CdmDocumentDefinition(corpus.getCtx(), "EntityName.cdm.json");
    document.getImports().add("subfolder/EntityName.cdm.json");
    document.getDefinitions().add("EntityName");
    entityFolder.getDocuments().add(document);

    final CdmFolderDefinition subFolder = entityFolder.getChildFolders().add("subfolder");
    subFolder.getDocuments().add("EntityName.cdm.json");

    final Model data = ManifestPersistence.toData(manifest, null, null).get();

    Assert.assertEquals(1, data.getEntities().size());
    final List<Import> imports = ((LocalEntity) data.getEntities().get(0)).getImports();
    Assert.assertEquals(1, imports.size());
    Assert.assertEquals("EntityName/subfolder/EntityName.cdm.json", imports.get(0).getCorpusPath());
  }

  /*
  Tests loading Model.json and converting to a CdmFolder.
   */
  @Test
  public void testExtensibilityLoadingModelJsonAndSavingCdmFolder()
      throws InterruptedException, IOException, JSONException, ExecutionException {
    final String testInputPath = TestHelper.getInputFolderPath(TESTS_SUBPATH,
            "testExtensibilityLoadingModelJsonAndSavingCdmFolder");
    final CdmCorpusDefinition cdmCorpus = this.getLocalCorpus(testInputPath);

    final CdmManifestDefinition cdmManifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync(
        "model.json",
        cdmCorpus.getStorage().fetchRootFolder(LOCAL))
        .get();

    final ManifestContent obtainedCdmFolder =
            com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence
                    .toData(cdmManifest, null, null);

    // entityDeclaration contains a GUID that will not match the snapshot.
    obtainedCdmFolder.getEntities().forEach(entity -> removeEntityDeclarationFromEntity(JMapper.MAP.valueToTree(entity)));

    this.handleOutput(
        "testExtensibilityLoadingModelJsonAndSavingCdmFolder",
        "cdmFolder.json",
        obtainedCdmFolder);
  }

  private void handleOutput(
      final String testName,
      final String outputFileName,
      final Object actualOutput)
      throws IOException, InterruptedException, JSONException {
    final String data = JMapper.MAP.valueToTree(actualOutput).toString();
    if (this.doesWriteTestDebuggingFiles) {
      TestHelper.writeActualOutputFileContent(TESTS_SUBPATH, testName, outputFileName, data);
    }

    final String expectedOutput = TestHelper.getExpectedOutputFileContent(TESTS_SUBPATH, testName, outputFileName);
    JSONAssert.assertEquals(expectedOutput, data, false);
  }

  private void removeEntityDeclarationFromEntity(final JsonNode entity) {
    if (entity.has("entityDeclaration")) {
      ((ObjectNode) entity).remove("entityDeclaration");
    }
  }

  private void removeDescriptionFromEntityIfEmpty(final JsonNode entity) {
    if (entity.has("description") && Strings.isNullOrEmpty(entity.get("description").asText())) {
      ((ObjectNode) entity).remove("description");
    }
  }
}