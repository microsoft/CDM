// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.base.Strings;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmReferencedEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.persistence.CdmConstants;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.Import;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ManifestContent;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.LocalEntity;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Model;
import com.microsoft.commondatamodel.objectmodel.storage.AdlsAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.InterceptLog;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.List;
import java.util.concurrent.ExecutionException;
import org.json.JSONException;
import org.skyscreamer.jsonassert.JSONAssert;
import org.testng.Assert;
import org.testng.annotations.Test;

public class ModelJsonTest extends ModelJsonTestBase {
  private static final String LOCAL = "local";
  private final String TESTS_SUBPATH = new File(new File("persistence", "modeljson"), "modeljson").toString();

  @Test
  public void testModelJsonFromAndToData() throws Exception {
    final CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH,"testModelJsonFromAndToData", null);

    final CdmManifestDefinition cdmManifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync(
            CdmConstants.MODEL_JSON_EXTENSION,
        cdmCorpus.getStorage().fetchRootFolder(LOCAL))
        .join();
    final Model obtainedModelJson = ManifestPersistence.toData(cdmManifest, null, null).join();

    this.handleOutput("testModelJsonFromAndToData",CdmConstants. MODEL_JSON_EXTENSION, obtainedModelJson);
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

    this.handleOutput("testLoadingModelJsonWithInvalidPath", CdmConstants.MODEL_JSON_EXTENSION, obtainedModelJson);
  }

  @Test
  public void testLoadingCdmFolderAndModelJsonToData() throws Exception {
    final CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testLoadingCdmFolderAndModelJsonToData", null);

    final CdmManifestDefinition cdmManifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync(
        "default" + CdmConstants.MANIFEST_EXTENSION,
        cdmCorpus.getStorage().fetchRootFolder(LOCAL)).join();
    final Model obtainedModelJson = ManifestPersistence.toData(cdmManifest, null, null).get();

    this.handleOutput("testLoadingCdmFolderAndModelJsonToData", CdmConstants.MODEL_JSON_EXTENSION, obtainedModelJson);
  }

  @Test
  public void TestLoadingModelJsonResultAndCdmFolderToData() throws IOException, InterruptedException, JSONException {
    final CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestLoadingModelJsonResultAndCdmFolderToData", null);

    final CdmManifestDefinition cdmManifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync(
            CdmConstants.MODEL_JSON_EXTENSION,
        cdmCorpus.getStorage().fetchRootFolder(LOCAL))
        .join();
    final ManifestContent obtainedCdmFolder = com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence.toData(cdmManifest, null, null);
    this.handleOutput("TestLoadingModelJsonResultAndCdmFolderToData", "cdmFolder" + CdmConstants.CDM_EXTENSION, obtainedCdmFolder);
  }

  @Test
  public void testLoadingModelJsonAndCdmFolderToData() throws Exception {
    final CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testLoadingModelJsonAndCdmFolderToData", null);

    final CdmManifestDefinition cdmManifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync(
            CdmConstants.MODEL_JSON_EXTENSION,
        cdmCorpus.getStorage().fetchRootFolder(LOCAL))
        .join();
    final ManifestContent obtainedCdmFolder = com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence.toData(cdmManifest, null, null);

    this.handleOutput("testLoadingModelJsonAndCdmFolderToData", "cdmFolder" + CdmConstants.CDM_EXTENSION, obtainedCdmFolder);
  }

  /*
   Test loading CDM folder result files and save as model.json.
   */
  @Test
  public void testLoadingCdmFolderResultAndModelJsonToData()
      throws IOException, InterruptedException, JSONException, ExecutionException {
    final CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH,
            "testLoadingCdmFolderResultAndModelJsonToData", null);
    final CdmManifestDefinition cdmManifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync(
        "result.model" + CdmConstants.MANIFEST_EXTENSION,
        cdmCorpus.getStorage().fetchRootFolder(LOCAL))
        .join();

    final Model obtainedModelJson = ManifestPersistence.toData(cdmManifest, null, null).get();

    // remove empty description from entities as they interfere with test.
    obtainedModelJson.getEntities().forEach(entity -> removeDescriptionFromEntityIfEmpty(JMapper.MAP.valueToTree(entity)));
    obtainedModelJson.setDescription(null);

    this.handleOutput("testLoadingCdmFolderResultAndModelJsonToData", CdmConstants.MODEL_JSON_EXTENSION, obtainedModelJson);
  }

  /**
   * Test if when loading a model.json file the foundations is imported correctly.
   */
  @Test
  public void testManifestFoundationImport() throws InterruptedException, ExecutionException {
    try (final InterceptLog interceptLog = new InterceptLog(CdmCorpusDefinition.class)) {
      final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testManifestFoundationImport", null);

      final CdmManifestDefinition cdmManifest =
          corpus.<CdmManifestDefinition>fetchObjectAsync(
                  CdmConstants.MODEL_JSON_EXTENSION,
              corpus.getStorage().fetchRootFolder("local"))
              .get();

      // Verify that no errors were logged.
      interceptLog.verifyNumLogEvents(0);
    }
  }

  /**
   * Test if the imports location are relative to the root level file.
   */
  @Test
  public void testImportsRelativePath() throws ExecutionException, InterruptedException {
    // The corpus path in the imports are relative to the document where it was defined.
    // When saving in model.json the documents are flattened to the manifest level
    // so it is necessary to recalculate the path to be relative to the manifest.
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus("notImportant", "notImportantLocation", null);
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

    corpus.getStorage().fetchRootFolder("remote").getDocuments().add(manifest);

    final Model data = ManifestPersistence.toData(manifest, null, null).get();

    Assert.assertEquals(1, data.getEntities().size());
    final List<Import> imports = ((LocalEntity) data.getEntities().get(0)).getImports();
    Assert.assertEquals(1, imports.size());
    Assert.assertEquals("EntityName/subfolder/EntityName.cdm.json", imports.get(0).getCorpusPath());
  }

  /**
   * Test if the referenceModels is generated correctly.
   */
  @Test
  public void testReferenceModels() throws InterruptedException, IOException, JSONException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testReferenceModels", null);

    final CdmManifestDefinition manifest =
        corpus.<CdmManifestDefinition>fetchObjectAsync(
                CdmConstants.MODEL_JSON_EXTENSION,
            corpus.getStorage().fetchRootFolder("local"))
            .join();

    // Entity with same modelId but different location.
    final CdmReferencedEntityDeclarationDefinition referenceEntity1 =
        new CdmReferencedEntityDeclarationDefinition(corpus.getCtx(), "ReferenceEntity1");
    referenceEntity1.setEntityPath("remote:/contoso/entity1.model.json/Entity1");

    final CdmTraitReference modelIdTrait1 =
        referenceEntity1.getExhibitsTraits().add("is.propertyContent.multiTrait");
    modelIdTrait1.setFromProperty(true);
    modelIdTrait1
        .getArguments()
        .add(
            "modelId",
            "f19bbb97-c031-441a-8bd1-61b9181c0b83/1a7ef9c8-c7e8-45f8-9d8a-b80f8ffe4612");
    manifest.getEntities().add(referenceEntity1);

    // Entity without modelId but same location.
    final CdmReferencedEntityDeclarationDefinition referenceEntity2 =
        new CdmReferencedEntityDeclarationDefinition(corpus.getCtx(), "ReferenceEntity2");
    referenceEntity2.setEntityPath("remote:/contoso/entity.model.json/Entity2");
    manifest.getEntities().add(referenceEntity2);

    // Entity with modelId and new location.
    final CdmReferencedEntityDeclarationDefinition referenceEntity3 =
        new CdmReferencedEntityDeclarationDefinition(corpus.getCtx(), "ReferenceEntity3");
    referenceEntity3.setEntityPath("remote:/contoso/entity3.model.json/Entity3");

    final CdmTraitReference modelIdTrait3 =
        referenceEntity3.getExhibitsTraits().add("is.propertyContent.multiTrait");
    modelIdTrait3.setFromProperty(true);
    modelIdTrait3.getArguments().add("modelId", "3b2e040a-c8c5-4508-bb42-09952eb04a50");
    manifest.getEntities().add(referenceEntity3);

    // Entity with same modelId and same location.
    final CdmReferencedEntityDeclarationDefinition referenceEntity4 =
        new CdmReferencedEntityDeclarationDefinition(corpus.getCtx(), "ReferenceEntity4");
    referenceEntity4.setEntityPath("remote:/contoso/entity.model.json/Entity4");

    final CdmTraitReference modelIdTrait4 =
        referenceEntity4.getExhibitsTraits().add("is.propertyContent.multiTrait");
    modelIdTrait4.setFromProperty(true);
    modelIdTrait4
        .getArguments()
        .add(
            "modelId",
            "f19bbb97-c031-441a-8bd1-61b9181c0b83/1a7ef9c8-c7e8-45f8-9d8a-b80f8ffe4612");
    manifest.getEntities().add(referenceEntity4);

    final Model obtainedModelJson = ManifestPersistence.toData(manifest, null, null).join();
    this.handleOutput("testReferenceModels", "model.json", obtainedModelJson);
  }

  /**
   * Tests loading Model.json and converting to a CdmFolder.
   */
  @Test
  public void testExtensibilityLoadingModelJsonAndCdmFolderToData()
      throws InterruptedException, IOException, JSONException, ExecutionException {
    final CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH,
            "testExtensibilityLoadingModelJsonAndCdmFolderToData", null);

    final CdmManifestDefinition cdmManifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync(
            CdmConstants.MODEL_JSON_EXTENSION,
        cdmCorpus.getStorage().fetchRootFolder(LOCAL))
        .get();

    final ManifestContent obtainedCdmFolder =
            com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence
                    .toData(cdmManifest, null, null);

    // entityDeclaration contains a GUID that will not match the snapshot.
    obtainedCdmFolder.getEntities().forEach(entity -> removeEntityDeclarationFromEntity(JMapper.MAP.valueToTree(entity)));

    this.handleOutput(
        "testExtensibilityLoadingModelJsonAndCdmFolderToData",
        "cdmFolder" + CdmConstants.CDM_EXTENSION,
        obtainedCdmFolder);
  }

  @Test
  public void testTypeAttributeIsNotDuplicated() throws IOException, InterruptedException {
    // the java string serializer can make the "$type" key duplicated if the JsonTypeInfo field is misconfigured
    //create a manifest
    final CdmCorpusDefinition cdmCorpus1 = new CdmCorpusDefinition();
    final String testActualOutputPath = TestHelper.getActualOutputFolderPath(TESTS_SUBPATH, "testTypeAttributeIsNotDuplicated");
    cdmCorpus1.getStorage().mount("adls", new LocalAdapter(testActualOutputPath));
    cdmCorpus1.getStorage().setDefaultNamespace("adls");

    final CdmManifestDefinition manifestAbstract = cdmCorpus1.makeObject(CdmObjectType.ManifestDef, "tempAbstract");
    manifestAbstract.getEntities().add("TeamMembership", "cdm:/core/applicationCommon/TeamMembership.cdm.json/TeamMembership");
    final CdmFolderDefinition localRoot = cdmCorpus1.getStorage().fetchRootFolder("adls");
    localRoot.getDocuments().add(manifestAbstract);
    final CdmManifestDefinition manifestResolved = manifestAbstract.createResolvedManifestAsync("default", "").join();
    manifestResolved.getImports().add("cdm:/foundations.cdm.json", "");
    manifestResolved.saveAsAsync(CdmConstants.MODEL_JSON_EXTENSION, true).join();
    // expect only one instance of "$type"
    final String modelFromFile = new String(Files.readAllBytes(
        new File(testActualOutputPath, "model.json").toPath()),
        StandardCharsets.UTF_8);
    Assert.assertNotEquals(modelFromFile.indexOf("$type"), -1);
    Assert.assertEquals(modelFromFile.indexOf("$type"), modelFromFile.lastIndexOf("$type"));
  }

  /**
   * Tests that a description on a CdmFolder entity sets the description on the ModelJson entity.
   */
  @Test
  public void testSettingModelJsonEntityDescription() {
    CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
    CdmManifestDefinition cdmManifest = cdmCorpus.makeObject(CdmObjectType.ManifestDef, "test");
    CdmDocumentDefinition document = cdmCorpus.makeObject(CdmObjectType.DocumentDef, "entity" + CdmConstants.CDM_EXTENSION);

    CdmFolderDefinition folder = cdmCorpus.getStorage().fetchRootFolder("local");
    folder.getDocuments().add(document);

    CdmEntityDefinition entity = (CdmEntityDefinition) document.getDefinitions().add(CdmObjectType.EntityDef, "entity");
    entity.setDescription("test description");

    cdmManifest.getEntities().add(entity);
    folder.getDocuments().add(cdmManifest);

    Model obtainedModelJson = ManifestPersistence.toData(cdmManifest, null, null).join();

    Assert.assertEquals(obtainedModelJson.getEntities().get(0).getDescription(), "test description");
  }

  private void handleOutput(
      final String testName,
      final String outputFileName,
      final Object actualOutput,
      final boolean doesWriteTestDebuggingFiles)
      throws IOException, InterruptedException, JSONException {
    final String data = JMapper.MAP.valueToTree(actualOutput).toString();
    if (doesWriteTestDebuggingFiles) {
      TestHelper.writeActualOutputFileContent(TESTS_SUBPATH, testName, outputFileName, data);
    }

    final String expectedOutput = TestHelper.getExpectedOutputFileContent(TESTS_SUBPATH, testName, outputFileName);
    JSONAssert.assertEquals(expectedOutput, data, false);
  }

  private void handleOutput(
          final String testName,
          final String outputFileName,
          final Object actualOutput)
          throws InterruptedException, JSONException, IOException {
    handleOutput(testName, outputFileName, actualOutput, false);
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
