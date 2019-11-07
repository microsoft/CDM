package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ManifestContent;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Model;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import java.io.File;
import java.io.IOException;
import org.json.JSONException;
import org.skyscreamer.jsonassert.JSONAssert;
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
        "result.manifest.model.json",
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
  public void testLoadingCdmFolderResultAndSavingModelJson() throws IOException, InterruptedException, JSONException {
    final String testInputPath = TestHelper.getInputFolderPath(TESTS_SUBPATH,
            "testLoadingCdmFolderResultAndSavingModelJson");
    final CdmCorpusDefinition cdmCorpus = this.getLocalCorpus(testInputPath);
    final CdmManifestDefinition cdmManifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync(
        "result.model.manifest.cdm.json",
        cdmCorpus.getStorage().fetchRootFolder(LOCAL))
        .join();

    final Model obtainedModelJson = ManifestPersistence.toData(cdmManifest, null, null).join();

    // remove empty description from entities as they interfere with test.
    obtainedModelJson.getEntities().forEach(entity -> removeDescriptionFromEntityIfEmpty(JMapper.MAP.valueToTree(entity)));
    obtainedModelJson.setDescription(null);

    this.handleOutput("testLoadingCdmFolderResultAndSavingModelJson", "model.json", obtainedModelJson);
  }

  /*
  Tests loading Model.json and converting to a CdmFolder.
   */
  @Test
  public void testExtensibilityLoadingModelJsonAndSavingCdmFolder() throws InterruptedException, IOException, JSONException {
    final String testInputPath = TestHelper.getInputFolderPath(TESTS_SUBPATH,
            "testExtensibilityLoadingModelJsonAndSavingCdmFolder");
    final CdmCorpusDefinition cdmCorpus = this.getLocalCorpus(testInputPath);

    final CdmManifestDefinition cdmManifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync(
        "SerializerTesting-model.json",
        cdmCorpus.getStorage().fetchRootFolder(LOCAL))
        .join();

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

  private void handleOutput(final String testName, final String outputFileName, final Object actualOutput) throws IOException, InterruptedException, JSONException {
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