// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.datapartition;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.cdmcollection.CdmCollectionHelperFunctions;
import com.microsoft.commondatamodel.objectmodel.enums.CdmIncrementalPartitionType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ManifestContent;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.ModelJsonTestBase;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.utilities.Constants;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.TimeUtils;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.testng.Assert;
import org.testng.annotations.Test;

public class DataPartitionTest {

  /**
   * The path between TestDataPath and TestName.
   */
  private static final String TESTS_SUBPATH = new File(new File("persistence", "cdmfolder"), "datapartition").toString();
  private static final ResolveContext RESOLVE_CONTEXT = new ResolveContext(new CdmCorpusDefinition());
  private final boolean doesWriteTestDebuggingFiles = false;

  /*
   * Testing for manifest with local entity declaration having data partitions.
   */
  @Test
  public void testLoadLocalEntityWithDataPartition() throws IOException, InterruptedException {
    final String content = TestHelper.getInputFileContent(TESTS_SUBPATH, "testLoadLocalEntityWithDataPartition", "entities.manifest.cdm.json");
    final ManifestContent manifestContent = JMapper.MAP.readValue(content, ManifestContent.class);
    final CdmManifestDefinition cdmManifest = ManifestPersistence.fromObject(RESOLVE_CONTEXT, "entities", "testNamespace", "/", manifestContent);

    Assert.assertEquals(cdmManifest.getEntities().getCount(), 1);
    Assert.assertEquals(cdmManifest.getEntities().get(0).getObjectType(), CdmObjectType.LocalEntityDeclarationDef);

    final CdmEntityDeclarationDefinition entity = cdmManifest.getEntities().get(0);

    Assert.assertEquals(entity.getDataPartitions().getCount(), 2);

    final CdmDataPartitionDefinition relativePartition = entity.getDataPartitions().get(0);
    Assert.assertEquals(relativePartition.getName(), "Sample data partition");
    Assert.assertEquals(relativePartition.getLocation(), "test/location");
    Assert.assertEquals(TimeUtils.formatDateStringIfNotNull(relativePartition.getLastFileModifiedTime()), "2008-09-15T23:53:23Z");
    Assert.assertEquals(relativePartition.getExhibitsTraits().getCount(), 1);
    Assert.assertEquals(relativePartition.getSpecializedSchema(), "teststring");

    final List<String> testList = relativePartition.getArguments().get("test");
    Assert.assertEquals(testList.size(), 3);
    Assert.assertEquals(testList.get(0), "something");
    Assert.assertEquals(testList.get(1), "somethingelse");
    Assert.assertEquals(testList.get(2), "anotherthing");

    final List<String> keyList = relativePartition.getArguments().get("KEY");
    Assert.assertEquals(keyList.size(), 1);
    Assert.assertEquals(keyList.get(0), "VALUE");

    Assert.assertFalse(relativePartition.getArguments().containsKey("wrong"));

    final CdmDataPartitionDefinition absolutePartition = entity.getDataPartitions().get(1);
    Assert.assertEquals("local:/some/test/location", absolutePartition.getLocation());
  }

  /*
   * Manifest.DataPartitions.Arguments can be read in multiple forms,
   * but should always be serialized as {name: 'theName', value: 'theValue'}.
   */
  @Test
  public void testDataPartitionArgumentsAreSerializedAppropriately() throws IOException, InterruptedException {
    final String readFile = TestHelper.getInputFileContent(TESTS_SUBPATH, "testDataPartitionArgumentsAreSerializedAppropriately", "entities.manifest.cdm.json");
    final CdmManifestDefinition cdmManifest = ManifestPersistence.fromObject(
            new ResolveContext(new CdmCorpusDefinition(), null), "entities", "testNamespace", "/", JMapper.MAP.readValue(readFile, ManifestContent.class));
    final ManifestContent obtainedCdmFolder = ManifestPersistence.toData(cdmManifest, null, null);
    if (true) {
      TestHelper.writeActualOutputFileContent(TESTS_SUBPATH, "testDataPartitionArgumentsAreSerializedAppropriately",
              "savedManifest.manifest.cdm.json", ModelJsonTestBase.serialize(obtainedCdmFolder));
    }
    final String expectedOutput = TestHelper.getExpectedOutputFileContent(TESTS_SUBPATH, "testDataPartitionArgumentsAreSerializedAppropriately", "savedManifest-Java.manifest.cdm.json");
    TestHelper.assertSameObjectWasSerialized(expectedOutput, ModelJsonTestBase.serialize(obtainedCdmFolder));
  }


  /*
   * Testing programmatically creating manifest with partitions and persisting.
   */
  @Test
  public void testProgrammaticallyCreatePartitions() throws InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testProgrammaticallyCreatePartitions", false, null, true);
    final CdmManifestDefinition manifest =
        corpus.makeObject(CdmObjectType.ManifestDef, "manifest");
    final CdmEntityDeclarationDefinition entity = manifest.getEntities().add("entity");

    final CdmDataPartitionDefinition relativePartition =
        corpus.makeObject(CdmObjectType.DataPartitionDef, "relative partition");
    relativePartition.setLocation("relative/path");
    relativePartition.getArguments().put("test1", new ArrayList<String>() {{
        add("argument1");
    }});
    relativePartition.getArguments().put("test2", new ArrayList<String>() {{
        add("argument2");
        add("argument3");
    }});

    final CdmDataPartitionDefinition absolutePartition =
        corpus.makeObject(CdmObjectType.DataPartitionDef, "absolute partition");
    absolutePartition.setLocation("local:/absolute/path");
    // add an empty arguments list to test empty list should not be displayed in ToData json.
    absolutePartition.getArguments().put("test", new ArrayList());

    entity.getDataPartitions().add(relativePartition);
    entity.getDataPartitions().add(absolutePartition);

    final ManifestContent manifestData =
        ManifestPersistence.toData(manifest, new ResolveOptions(), new CopyOptions());
    Assert.assertEquals(manifestData.getEntities().size(), 1);
    final JsonNode entityData = manifestData.getEntities().get(0);
    final JsonNode partitionsList = entityData.get("dataPartitions");
    Assert.assertEquals(partitionsList.size(), 2);
    final JsonNode relativePartitionData = partitionsList.get(0);
    final JsonNode absolutePartitionData = partitionsList.get(partitionsList.size() - 1);

    Assert.assertEquals(
        relativePartition.getLocation(),
        relativePartitionData.get("location").asText());
    Assert.assertEquals(3, relativePartitionData.get("arguments").size());
    final JsonNode argumentList = relativePartitionData.get("arguments");
    Assert.assertEquals(2, argumentList.get(0).size());
    Assert.assertEquals("test1", argumentList.get(0).get("name").asText());
    Assert.assertEquals("argument1", argumentList.get(0).get("value").asText());
    Assert.assertEquals(2, argumentList.get(1).size());
    Assert.assertEquals("test2", argumentList.get(1).get("name").asText());
    Assert.assertEquals("argument2", argumentList.get(1).get("value").asText());
    Assert.assertEquals(2, argumentList.get(2).size());
    Assert.assertEquals("test2", argumentList.get(2).get("name").asText());
    Assert.assertEquals("argument3", argumentList.get(2).get("value").asText());

    Assert.assertEquals(
        absolutePartition.getLocation(),
        absolutePartitionData.get("location").asText());
    // test if empty argument list is set to null
    Assert.assertNull(absolutePartitionData.get("arguments"));
  }

  /**
   * Testing loading manifest with local entity declaration having an incremental partition without incremental trait.
   */
  @Test
  public void testFromIncrementalPartitionWithoutTrait() throws InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testFromIncrementalPartitionWithoutTrait");
    // not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition (it shares the same CdmLogCode with partition pattern)
    AtomicBoolean errorMessageVerified = new AtomicBoolean(false);
    corpus.setEventCallback((CdmStatusLevel level, String message) -> {
      if (message.contains("Failed to persist object 'DeletePartition'. This object does not contain the trait 'is.partition.incremental'," +
              " so it should not be in the collection 'incrementalPartitions'. | fromData")) {
        errorMessageVerified.set(true);
      } else{
        Assert.fail("Some unexpected failure - " + message + "!");
      }
    }, CdmStatusLevel.Warning);

    final CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/entities.manifest.cdm.json").join();
    Assert.assertEquals(manifest.getEntities().size(), 1);
    Assert.assertEquals(manifest.getEntities().get(0).getObjectType(), CdmObjectType.LocalEntityDeclarationDef);
    final CdmEntityDeclarationDefinition entity = manifest.getEntities().get(0);
    Assert.assertEquals(entity.getIncrementalPartitions().size(), 1);
    final CdmDataPartitionDefinition incrementalPartition = entity.getIncrementalPartitions().get(0);
    Assert.assertEquals(incrementalPartition.getName(), "UpsertPartition");
    Assert.assertEquals(incrementalPartition.getExhibitsTraits().size(), 1);
    Assert.assertEquals(incrementalPartition.getExhibitsTraits().get(0).fetchObjectDefinitionName(), Constants.IncrementalTraitName);
    Assert.assertTrue(errorMessageVerified.get());
  }

  /**
   * Testing loading manifest with local entity declaration having a data partition with incremental trait.
   */
  @Test
  public void testFromDataPartitionWithIncrementalTrait() throws InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testFromDataPartitionWithIncrementalTrait");
    AtomicBoolean errorMessageVerified = new AtomicBoolean(false);
    // not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition (it shares the same CdmLogCode with partition pattern)
    corpus.setEventCallback((CdmStatusLevel level, String message) -> {
      if (message.contains("Failed to persist object 'UpsertPartition'. This object contains the trait 'is.partition.incremental'," +
              " so it should not be in the collection 'dataPartitions'. | fromData")) {
        errorMessageVerified.set(true);
      } else {
        Assert.fail("Some unexpected failure - " + message + "!");
      }
    }, CdmStatusLevel.Warning);

    final CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/entities.manifest.cdm.json").join();
    Assert.assertEquals(manifest.getEntities().size(), 1);
    Assert.assertEquals(manifest.getEntities().get(0).getObjectType(), CdmObjectType.LocalEntityDeclarationDef);
    final CdmEntityDeclarationDefinition entity = manifest.getEntities().get(0);
    Assert.assertEquals(entity.getDataPartitions().size(), 1);
    Assert.assertEquals(entity.getDataPartitions().get(0).getName(), "TestingPartition");
    Assert.assertTrue(errorMessageVerified.get());
  }

  /**
   * Testing saving manifest with local entity declaration having an incremental partition without incremental trait.
   */
  @Test
  public void testToIncrementalPartitionWithoutTrait() throws InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testToIncrementalPartitionWithoutTrait", false, null, true);
    AtomicBoolean errorMessageVerified = new AtomicBoolean(false);
    // not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition (it shares the same CdmLogCode with partition pattern)
    corpus.setEventCallback((CdmStatusLevel level, String message) -> {
      if (message.contains("Failed to persist object 'DeletePartition'. This object does not contain the trait 'is.partition.incremental'," +
              " so it should not be in the collection 'incrementalPartitions'. | toData")) {
        errorMessageVerified.set(true);
      } else {
        Assert.fail("Some unexpected failure - " + message + "!");
      }
    }, CdmStatusLevel.Warning);

    final CdmManifestDefinition manifest = new CdmManifestDefinition(corpus.getCtx(), "manifest");
    corpus.getStorage().fetchRootFolder("local").getDocuments().add(manifest);

    CdmEntityDefinition entity = new CdmEntityDefinition(corpus.getCtx(), "entityName", null);
    CdmCollectionHelperFunctions.createDocumentForEntity(corpus, entity);
    final CdmEntityDeclarationDefinition localizedEntityDeclaration = manifest.getEntities().add(entity);

    final CdmDataPartitionDefinition upsertIncrementalPartition = corpus.makeObject(CdmObjectType.DataPartitionDef, "UpsertPartition", false);
    upsertIncrementalPartition.setLocation("/IncrementalData");
    upsertIncrementalPartition.setSpecializedSchema("csv");
    upsertIncrementalPartition.getExhibitsTraits().add(Constants.IncrementalTraitName, Collections.singletonList(new ImmutablePair<String, Object>("type", CdmIncrementalPartitionType.Upsert.toString())));

    final CdmDataPartitionDefinition deletePartition = corpus.makeObject(CdmObjectType.DataPartitionDef, "DeletePartition", false);
    deletePartition.setLocation("/IncrementalData");
    deletePartition.setSpecializedSchema("csv");
    localizedEntityDeclaration.getIncrementalPartitions().add(upsertIncrementalPartition);
    localizedEntityDeclaration.getIncrementalPartitions().add(deletePartition);

    try (Logger.LoggerScope logScope = Logger.enterScope("dataPartitionTest", corpus.getCtx(), "testToIncrementalPartitionWithoutTrait")) {
      final ManifestContent manifestData = ManifestPersistence.toData(manifest, null, null);

      Assert.assertEquals(manifestData.getEntities().size(), 1);
      final JsonNode entityData = manifestData.getEntities().get(0);
      Assert.assertEquals(1, entityData.get("incrementalPartitions").size(), 1);
      final JsonNode partitionData = entityData.get("incrementalPartitions").get(0);
      Assert.assertEquals(partitionData.get("name").asText(), "UpsertPartition");
      Assert.assertEquals(partitionData.get("exhibitsTraits").size(), 1);
      Assert.assertEquals((partitionData.get("exhibitsTraits").get(0)).get("traitReference").asText(), Constants.IncrementalTraitName);
    }
    Assert.assertTrue(errorMessageVerified.get());
  }

  /**
   * Testing saving manifest with local entity declaration having a data partition with incremental trait.
   */
  @Test
  public void testToDataPartitionWithIncrementalTrait() throws InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestToDataPartitionWithIncrementalTrait", false, null, true);
    AtomicBoolean errorMessageVerified = new AtomicBoolean(false);
    // not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition (it shares the same CdmLogCode with partition pattern)
    corpus.setEventCallback((CdmStatusLevel level, String message) -> {
      if (message.contains("Failed to persist object 'UpsertPartition'. This object contains the trait 'is.partition.incremental'," +
              " so it should not be in the collection 'dataPartitions'. | toData")) {
        errorMessageVerified.set(true);
      } else {
        Assert.fail("Some unexpected failure - " + message + "!");
      }
    }, CdmStatusLevel.Warning);

    final CdmManifestDefinition manifest = new CdmManifestDefinition(corpus.getCtx(), "manifest");
    corpus.getStorage().fetchRootFolder("local").getDocuments().add(manifest);

    CdmEntityDefinition entity = new CdmEntityDefinition(corpus.getCtx(), "entityName", null);
    CdmCollectionHelperFunctions.createDocumentForEntity(corpus, entity);
    final CdmEntityDeclarationDefinition localizedEntityDeclaration = manifest.getEntities().add(entity);

    final CdmDataPartitionDefinition upsertIncrementalPartition = corpus.makeObject(CdmObjectType.DataPartitionDef, "UpsertPartition", false);
    upsertIncrementalPartition.setLocation("/IncrementalData");
    upsertIncrementalPartition.setSpecializedSchema("csv");
    upsertIncrementalPartition.getExhibitsTraits().add(Constants.IncrementalTraitName, Collections.singletonList(new ImmutablePair<String, Object>("type", CdmIncrementalPartitionType.Upsert.toString())));

    final CdmDataPartitionDefinition testingPartition = corpus.makeObject(CdmObjectType.DataPartitionDef, "TestingPartition", false);
    testingPartition.setLocation("/testingData");
    testingPartition.setSpecializedSchema("csv");
    localizedEntityDeclaration.getDataPartitions().add(upsertIncrementalPartition);
    localizedEntityDeclaration.getDataPartitions().add(testingPartition);

    try (Logger.LoggerScope logScope = Logger.enterScope("dataPartitionTest", corpus.getCtx(), "testToDataPartitionWithIncrementalTrait")) {
      final ManifestContent manifestData = ManifestPersistence.toData(manifest, null, null);

      Assert.assertEquals(manifestData.getEntities().size(), 1);
      final JsonNode entityData = manifestData.getEntities().get(0);
      Assert.assertEquals(1, entityData.get("dataPartitions").size(), 1);
      final JsonNode partitionData = entityData.get("dataPartitions").get(0);
      Assert.assertEquals(partitionData.get("name").asText(), "TestingPartition");
    }
    Assert.assertTrue(errorMessageVerified.get());
  }
}
