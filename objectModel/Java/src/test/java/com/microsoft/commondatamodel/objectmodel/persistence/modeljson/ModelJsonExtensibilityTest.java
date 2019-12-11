package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.DocumentPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.DocumentContent;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.AttributeReference;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Entity;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Model;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.ReferenceModel;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.SingleKeyRelationship;
import java.io.File;
import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Objects;
import java.util.UUID;
import org.json.JSONException;
import org.skyscreamer.jsonassert.JSONAssert;
import org.testng.Assert;
import org.testng.annotations.Test;

public class ModelJsonExtensibilityTest extends ModelJsonTestBase {
  /**
   * Whether debugging files should be written or not.
   */
  private final boolean doesWriteTestDebuggingFiles = TestHelper.doesWriteTestDebuggingFiles;
  private final String TESTS_SUBPATH =
      new File(
          new File("persistence", "modeljson"),
          "modeljsonextensibility"
      ).toString();

  /**
   * Tests the serializer and the deserializer.
   * Checks whether reading a Model.Json file into an instance of {@link Model} class
   * and then serializing back results in a "similar" string. (the order of serialization can vary)
   * Serializing back timedate is tricky,
   * as the strings can differ if the serializer uses a different format
   * / timezone than original file. (using GMT time)
   * C# only test. This test does not have a Typescript equivalent.
   */
  @Test
  public void testSerializer() throws IOException, InterruptedException, JSONException {
    final String originalModelJson =
        TestHelper.getInputFileContent(
            TESTS_SUBPATH,
            "testSerializer",
            "SerializerTesting-model.json");
    Model deserialized = deserialize(originalModelJson, Model.class);
    final String serialized = serialize(deserialized);
    if (doesWriteTestDebuggingFiles) {
      TestHelper.writeActualOutputFileContent(
          TESTS_SUBPATH,
          "testSerializer",
          "SerializerTesting-model.json",
          serialized);
    }

    JSONAssert.assertEquals(originalModelJson, serialized, false);
  }

  /**
   * Tests the serializer and the deserializer work for different time zones.
   *
   * @throws IOException
   * @throws InterruptedException
   */
  @Test
  public void testEntityTimeDateReadInLocalFormat() throws IOException, InterruptedException {
    final String originalModelJson = TestHelper.getInputFileContent(
        TESTS_SUBPATH,
        "testEntityTimeDateReadInLocalFormat",
        "SerializerTesting-entity2.json");

    final Entity deserialized = deserialize(originalModelJson, Entity.class);

    final String expectedSerializedLastChildFileModifiedTime = "\"2018-12-19T02:05:03.2374986Z\"";
    final String expectedSerializedLastFileModifiedTime = "\"2018-12-19T05:05:03.2374986Z\"";
    final String expectedSerializedLastFileStatusCheckTime = "\"2018-12-19T21:35:03.2374986Z\"";

    if (deserialized != null) {
      final OffsetDateTime lastChildFileModifiedTime = deserialized.getLastChildFileModifiedTime();
      final OffsetDateTime lastFileModifiedTime = deserialized.getLastFileModifiedTime();
      final OffsetDateTime lastFileStatusCheckTime = deserialized.getLastFileStatusCheckTime();

      Assert.assertEquals(
          serialize(lastChildFileModifiedTime),
          expectedSerializedLastChildFileModifiedTime);
      Assert.assertEquals(
          serialize(lastFileModifiedTime),
          expectedSerializedLastFileModifiedTime);
      Assert.assertEquals(
          serialize(lastFileStatusCheckTime),
          expectedSerializedLastFileStatusCheckTime);

      final String serialized = serialize(deserialized);
      Assert.assertTrue(serialized.contains(expectedSerializedLastChildFileModifiedTime));
      Assert.assertTrue(serialized.contains(expectedSerializedLastFileModifiedTime));
      Assert.assertTrue(serialized.contains(expectedSerializedLastFileStatusCheckTime));
    } else {
      throw new RuntimeException("deserialized is null");
    }
  }

  /**
   * Checks whether reading a Model.Json into a {@link Model},
   * converting to a {@link CdmManifestDefinition},
   * converting back to a {@link Model},
   * and then serializing back to a string
   * results in a similar content (up to a different order of serialization)
   */
  @Test
  public void testModelJsonExtensibility() throws IOException, InterruptedException, JSONException {
    final String inputPath = TestHelper.getInputFolderPath(
        TESTS_SUBPATH,
        "testModelJsonExtensibility");

    final CdmCorpusDefinition cdmCorpus = this.getLocalCorpus(inputPath);
    final CdmManifestDefinition cdmManifest =
        cdmCorpus.<CdmManifestDefinition>fetchObjectAsync(
            "model.json",
            cdmCorpus.getStorage().fetchRootFolder("local")
        ).join();
    final Model obtainedModel = ManifestPersistence.toData(cdmManifest, null, null).join();

    // The imports were generated during processing and are not present in the original file.
    obtainedModel.setImports(null);

    if (doesWriteTestDebuggingFiles) {
      TestHelper.writeActualOutputFileContent(
          TESTS_SUBPATH,
          "testModelJsonExtensibility",
          "SerializerTesting-model.json",
          serialize(obtainedModel));
    }
    final String obtainedModelJson = serialize(obtainedModel);
    final String originalModelJson = TestHelper.getExpectedOutputFileContent(
        TESTS_SUBPATH,
        "testModelJsonExtensibility",
        "SerializerTesting-model.json");

    JSONAssert.assertEquals(originalModelJson, obtainedModelJson, false);
  }

  /**
   * Reads Model.Json, converts to manifest and compares files from obtained manifest to stored files.
   */
  @Test
  public void modelJsonExtensibilityManifestDocumentsTest()
      throws InterruptedException, IOException, JSONException {
    final String inputPath = TestHelper.getInputFolderPath(
        TESTS_SUBPATH,
        "ModelJsonExtensibilityManifestDocuments");
    final CdmCorpusDefinition cdmCorpus = this.getLocalCorpus(inputPath);
    final CdmManifestDefinition manifest =
        cdmCorpus.<CdmManifestDefinition>fetchObjectAsync(
            "model.json",
            cdmCorpus.getStorage().fetchRootFolder("local")
        ).join();
    final CdmFolderDefinition folderObject =
        cdmCorpus
            .getStorage()
            .fetchRootFolder("default");

    final String serializedManifest =
        serialize(
            com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence
                .toData(
                    manifest,
                    null,
                    null));

    if (doesWriteTestDebuggingFiles) {
      for (final CdmDocumentDefinition document : folderObject.getDocuments()) {
        if (Objects.equals(document.getName(), manifest.getName())) {
          continue;
        }

        final DocumentContent docContent = DocumentPersistence.toData(document, null, null);
        final String serializedDocument = TEST_MAPPER.valueToTree(docContent).asText();

        TestHelper.writeActualOutputFileContent(
            TESTS_SUBPATH,
            "ModelJsonExtensibilityManifestDocuments",
            document.getName(),
            serializedDocument);
      }

      TestHelper.writeActualOutputFileContent(
          TESTS_SUBPATH,
          "ModelJsonExtensibilityManifestDocuments",
          manifest.getName(),
          serializedManifest);
    }

    for (final CdmDocumentDefinition document : folderObject.getDocuments()) {
      // manifest shows up twice. once as a manifest and again as the model.json conversion cached
      if (Objects.equals(document.getName(), manifest.getName())) {
        continue;
      }

      final String serializedDocument = serialize(DocumentPersistence.toData(document, null, null));
      final String expectedOutputDocument = TestHelper.getExpectedOutputFileContent(
          TESTS_SUBPATH,
          "ModelJsonExtensibilityManifestDocuments",
          document.getName());

      JSONAssert.assertEquals(expectedOutputDocument, serializedDocument, false);
    }

    final String expectedOutputManifest = TestHelper.getExpectedOutputFileContent(
        TESTS_SUBPATH,
        "ModelJsonExtensibilityManifestDocuments",
        manifest.getName());
    JSONAssert.assertEquals(expectedOutputManifest, serializedManifest, false);
  }

  /**
   * Creates an instance of {@link Model} with huge content.
   * This is used to test the serializer performance.
   *
   * @param dimension The dimension of the desired class.
   *                  This actually controls the number of elements in the lists of the {@link Model}
   * @return An instance of {@link Model} that contains many {@link SingleKeyRelationship} and {@link ReferenceModel}.
   */
  private Model createHugeModel(int dimension) {
    final Model ret = new Model();
    ret.setDescription("The description of the Entity");
    ret.setLastChildFileModifiedTime(OffsetDateTime.now());
    ret.setLastFileStatusCheckTime(OffsetDateTime.now());
    ret.setName("The name of the entity");
    ret.setReferenceModels(new ArrayList<>());
    for (int i = 0; i < dimension; i++) {
      final ReferenceModel referenceModel = new ReferenceModel();
      referenceModel.setId("ReferenceModel Id no " + i);
      referenceModel.setLocation("Location no" + i);

      ret.getReferenceModels().add(referenceModel);
    }
    ret.setRelationships(new ArrayList<>());
    for (int i = 0; i < dimension; i++) {
      final ObjectNode extensionFields = JsonNodeFactory.instance.objectNode();
      for (int j = 1; j < 3; j++) {
        extensionFields.put("extension " + j, "value of extension " + j + " for relationship " + i);
      }
      AttributeReference fromAttribute = new AttributeReference();
      fromAttribute.setEntityName("fromAttribute.getEntityName() no " + i);
      fromAttribute.setAttributeName("fromAttribute.getAttributeName() no" + i);

      AttributeReference toAttribute = new AttributeReference();
      toAttribute.setEntityName("toAttribute.getEntityName() no " + i);
      toAttribute.setAttributeName("toAttribute.getAttributeName() no" + i);
      final SingleKeyRelationship relationship = new SingleKeyRelationship();
      relationship.setFromAttribute(fromAttribute);
      relationship.setToAttribute(toAttribute);

      relationship.setType("Type of Relationship no " + i);
      relationship.setName("Name of Relationship no " + i);
      relationship.setDescription("Description of Relationship no " + i);

      relationship.setOverrideExtensionFields(new LinkedHashMap<String, Object>() {{
        put(UUID.randomUUID().toString(), extensionFields);
      }});

      ret.getRelationships().add(relationship);
    }
    return ret;
  }
}
