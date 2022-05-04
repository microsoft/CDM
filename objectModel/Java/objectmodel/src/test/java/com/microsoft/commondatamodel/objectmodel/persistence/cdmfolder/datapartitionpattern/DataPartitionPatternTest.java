// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.datapartitionpattern;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionPatternDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.cdmcollection.CdmCollectionHelperFunctions;
import com.microsoft.commondatamodel.objectmodel.enums.CdmIncrementalPartitionType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ManifestContent;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.utilities.Constants;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.concurrent.atomic.AtomicBoolean;

public class DataPartitionPatternTest {

  private static final String TESTS_SUBPATH = new File(new File("persistence", "cdmfolder"), "datapartitionpattern").toString();
  private static final ResolveContext RESOLVE_CONTEXT = new ResolveContext(new CdmCorpusDefinition());
  private static final String LOCAL = "local";
  private static final String CDM = "cdm";
  private static final String REMOTE = "remote";

  /**
   * Testing for folder with local entity declaration with data partition patterns.
   */
  @Test
  public void testLoadLocalEntityWithDataPartitionPattern() throws IOException, InterruptedException {
    final String content = TestHelper.getInputFileContent(TESTS_SUBPATH, "testLoadLocalEntityWithDataPartitionPattern", "entities.manifest.cdm.json");
    final ManifestContent manifestContent = JMapper.MAP.readValue(content, ManifestContent.class);
    final CdmManifestDefinition cdmManifest = ManifestPersistence.fromObject(RESOLVE_CONTEXT,
            "entities", "testNamespace", "/", manifestContent);

    Assert.assertEquals(cdmManifest.getEntities().getCount(), 2);

    final CdmEntityDeclarationDefinition entity1 = cdmManifest.getEntities().get(0);
    Assert.assertEquals(entity1.getObjectType(), CdmObjectType.LocalEntityDeclarationDef);
    Assert.assertEquals(entity1.getDataPartitionPatterns().getCount(), 1);

    final CdmDataPartitionPatternDefinition pattern1 = entity1.getDataPartitionPatterns().get(0);
    Assert.assertEquals(pattern1.getName(), "testPattern");
    Assert.assertEquals(pattern1.getExplanation(), "test explanation");
    Assert.assertEquals(pattern1.getRootLocation(), "test location");
    Assert.assertEquals(pattern1.getRegularExpression(), "\\s*");
    Assert.assertEquals(pattern1.getParameters().size(), 2);
    Assert.assertEquals(pattern1.getParameters().get(0), "testParam1");
    Assert.assertEquals(pattern1.getParameters().get(1), "testParam2");
    Assert.assertEquals(pattern1.getSpecializedSchema(), "test special schema");
    Assert.assertEquals(pattern1.getExhibitsTraits().getCount(), 1);

    final CdmEntityDeclarationDefinition entity2 = cdmManifest.getEntities().get(1);
    Assert.assertEquals(entity2.getObjectType(), CdmObjectType.LocalEntityDeclarationDef);
    Assert.assertEquals(entity2.getDataPartitionPatterns().getCount(), 1);
    final CdmDataPartitionPatternDefinition pattern2 = entity2.getDataPartitionPatterns().get(0);
    Assert.assertEquals(pattern2.getName(), "testPattern2");
    Assert.assertEquals(pattern2.getRootLocation(), "test location2");
    Assert.assertEquals(pattern2.getGlobPattern(), "/*.csv");

    final ManifestContent manifestData =
            ManifestPersistence.toData(cdmManifest, new ResolveOptions(), new CopyOptions());
    Assert.assertEquals(manifestData.getEntities().size(), 2);

    final JsonNode entityData1 = manifestData.getEntities().get(0);
    Assert.assertEquals(entityData1.get("dataPartitionPatterns").size(), 1);
    final JsonNode patternData1 = entityData1.get("dataPartitionPatterns").get(0);
    Assert.assertEquals(patternData1.get("name").asText(), "testPattern");
    Assert.assertEquals(patternData1.get("explanation").asText(), "test explanation");
    Assert.assertEquals(patternData1.get("rootLocation").asText(), "test location");
    Assert.assertEquals(patternData1.get("regularExpression").asText(), "\\s*");
    Assert.assertEquals(patternData1.get("parameters").size(), 2);
    Assert.assertEquals(patternData1.get("parameters").get(0).asText(), "testParam1");
    Assert.assertEquals(patternData1.get("parameters").get(1).asText(), "testParam2");
    Assert.assertEquals(patternData1.get("specializedSchema").asText(), "test special schema");
    Assert.assertEquals(patternData1.get("exhibitsTraits").size(), 1);

    final JsonNode entityData2 = manifestData.getEntities().get(1);
    Assert.assertEquals(entityData2.get("dataPartitionPatterns").size(), 1);
    final JsonNode patternData2 = entityData2.get("dataPartitionPatterns").get(0);
    Assert.assertEquals(patternData2.get("name").asText(), "testPattern2");
    Assert.assertEquals(patternData2.get("rootLocation").asText(), "test location2");
    Assert.assertEquals(patternData2.get("globPattern").asText(), "/*.csv");
  }

  /**
   * Testing loading manifest with local entity declaration having an incremental partition pattern without incremental trait.
   */
  @Test
  public void testFromIncrementalPartitionPatternWithoutTrait() throws InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testFromIncrementalPartitionPatternWithoutTrait");
    // not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition pattern (it shares the same CdmLogCode with partition)
    AtomicBoolean errorMessageVerified = new AtomicBoolean(false);
    corpus.setEventCallback((CdmStatusLevel level, String message) -> {
      if (message.contains("Failed to persist object 'DeletePattern'. This object does not contain the trait 'is.partition.incremental'," +
              " so it should not be in the collection 'incrementalPartitionPatterns'. | fromData")) {
        errorMessageVerified.set(true);
      } else{
        Assert.fail("Some unexpected failure - " + message + "!");
      }
    }, CdmStatusLevel.Warning);

    final CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/entities.manifest.cdm.json").join();
    Assert.assertEquals(manifest.getEntities().size(), 1);
    Assert.assertEquals(manifest.getEntities().get(0).getObjectType(), CdmObjectType.LocalEntityDeclarationDef);
    final CdmEntityDeclarationDefinition entity = manifest.getEntities().get(0);
    Assert.assertEquals(entity.getIncrementalPartitionPatterns().size(), 1);
    final CdmDataPartitionPatternDefinition incrementalPartitionPattern = entity.getIncrementalPartitionPatterns().get(0);
    Assert.assertEquals(incrementalPartitionPattern.getName(), "UpsertPattern");
    Assert.assertEquals(incrementalPartitionPattern.getExhibitsTraits().size(), 1);
    Assert.assertEquals(incrementalPartitionPattern.getExhibitsTraits().get(0).fetchObjectDefinitionName(), Constants.IncrementalTraitName);
    Assert.assertTrue(errorMessageVerified.get());
  }

  /**
   * Testing loading manifest with local entity declaration having a data partition pattern with incremental trait.
   */
  @Test
  public void testFromDataPartitionPatternWithIncrementalTrait() throws InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testFromDataPartitionPatternWithIncrementalTrait");
    AtomicBoolean errorMessageVerified = new AtomicBoolean(false);
    // not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition pattern (it shares the same CdmLogCode with partition)
    corpus.setEventCallback((CdmStatusLevel level, String message) -> {
      if (message.contains("Failed to persist object 'UpsertPattern'. This object contains the trait 'is.partition.incremental'," +
              " so it should not be in the collection 'dataPartitionPatterns'. | fromData")) {
        errorMessageVerified.set(true);
      } else {
        Assert.fail("Some unexpected failure - " + message + "!");
      }
    }, CdmStatusLevel.Warning);

    final CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/entities.manifest.cdm.json").join();
    Assert.assertEquals(manifest.getEntities().size(), 1);
    Assert.assertEquals(manifest.getEntities().get(0).getObjectType(), CdmObjectType.LocalEntityDeclarationDef);
    final CdmEntityDeclarationDefinition entity = manifest.getEntities().get(0);
    Assert.assertEquals(entity.getDataPartitionPatterns().size(), 1);
    Assert.assertEquals(entity.getDataPartitionPatterns().get(0).getName(), "TestingPattern");
    Assert.assertTrue(errorMessageVerified.get());
  }

  /**
   * Testing saving manifest with local entity declaration having an incremental partition pattern without incremental trait.
   */
  @Test
  public void testToIncrementalPartitionPatternWithoutTrait() throws InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testToIncrementalPartitionPatternWithoutTrait", false, null, true);
    AtomicBoolean errorMessageVerified = new AtomicBoolean(false);
    // not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition pattern (it shares the same CdmLogCode with partition)
    corpus.setEventCallback((CdmStatusLevel level, String message) -> {
      if (message.contains("Failed to persist object 'DeletePartitionPattern'. This object does not contain the trait 'is.partition.incremental'," +
              " so it should not be in the collection 'incrementalPartitionPatterns'. | toData")) {
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

    final CdmDataPartitionPatternDefinition upsertIncrementalPartition = corpus.makeObject(CdmObjectType.DataPartitionPatternDef, "UpsertPattern", false);
    upsertIncrementalPartition.setRootLocation("/IncrementalData");
    upsertIncrementalPartition.setSpecializedSchema("csv");
    upsertIncrementalPartition.setRegularExpression("/(.*)/(.*)/(.*)/Upserts/upsert(\\d+)\\.csv$");
    upsertIncrementalPartition.setParameters(Arrays.asList("year", "month", "day", "detelePartitionNumber"));
    upsertIncrementalPartition.getExhibitsTraits().add(Constants.IncrementalTraitName, Collections.singletonList(new ImmutablePair<String, Object>("type", CdmIncrementalPartitionType.Upsert.toString())));

    final CdmDataPartitionPatternDefinition deletePartitionPattern = corpus.makeObject(CdmObjectType.DataPartitionPatternDef, "DeletePartitionPattern", false);
    deletePartitionPattern.setRootLocation("/IncrementalData");
    deletePartitionPattern.setSpecializedSchema("csv");
    deletePartitionPattern.setRegularExpression("/(.*)/(.*)/(.*)/Upserts/upsert(\\d+)\\.csv$");
    deletePartitionPattern.setParameters(Arrays.asList("year", "month", "day", "detelePartitionNumber"));
    localizedEntityDeclaration.getIncrementalPartitionPatterns().add(upsertIncrementalPartition);
    localizedEntityDeclaration.getIncrementalPartitionPatterns().add(deletePartitionPattern);

    try (Logger.LoggerScope logScope = Logger.enterScope("dataPartitionPatternTest", corpus.getCtx(), "testToIncrementalPartitionPatternWithoutTrait")) {
      final ManifestContent manifestData = ManifestPersistence.toData(manifest, null, null);

      Assert.assertEquals(manifestData.getEntities().size(), 1);
      final JsonNode entityData = manifestData.getEntities().get(0);
      Assert.assertEquals(1, entityData.get("incrementalPartitionPatterns").size(), 1);
      final JsonNode patternData = entityData.get("incrementalPartitionPatterns").get(0);
      Assert.assertEquals(patternData.get("name").asText(), "UpsertPattern");
      Assert.assertEquals(patternData.get("exhibitsTraits").size(), 1);
      Assert.assertEquals((patternData.get("exhibitsTraits").get(0)).get("traitReference").asText(), Constants.IncrementalTraitName);
    }
    Assert.assertTrue(errorMessageVerified.get());
  }

  /**
   * Testing saving manifest with local entity declaration having a data partition pattern with incremental trait.
   */
  @Test
  public void testToDataPartitionPatternWithIncrementalTrait() throws InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testToDataPartitionPatternWithIncrementalTrait", false, null, true);
    AtomicBoolean errorMessageVerified = new AtomicBoolean(false);
    // not checking the CdmLogCode here as we want to check if this error message constructed correctly for the partition pattern (it shares the same CdmLogCode with partition)
    corpus.setEventCallback((CdmStatusLevel level, String message) -> {
      if (message.contains("Failed to persist object 'UpsertPartitionPattern'. This object contains the trait 'is.partition.incremental'," +
              " so it should not be in the collection 'dataPartitionPatterns'. | toData")) {
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

    final CdmDataPartitionPatternDefinition upsertIncrementalPartitionPattern = corpus.makeObject(CdmObjectType.DataPartitionPatternDef, "UpsertPartitionPattern", false);
    upsertIncrementalPartitionPattern.setRootLocation("/IncrementalData");
    upsertIncrementalPartitionPattern.setSpecializedSchema("csv");
    upsertIncrementalPartitionPattern.getExhibitsTraits().add(Constants.IncrementalTraitName, Collections.singletonList(new ImmutablePair<String, Object>("type", CdmIncrementalPartitionType.Upsert.toString())));

    final CdmDataPartitionPatternDefinition testingPartition = corpus.makeObject(CdmObjectType.DataPartitionPatternDef, "TestingPartitionPattern", false);
    testingPartition.setRootLocation("/testingData");
    testingPartition.setSpecializedSchema("csv");
    localizedEntityDeclaration.getDataPartitionPatterns().add(upsertIncrementalPartitionPattern);
    localizedEntityDeclaration.getDataPartitionPatterns().add(testingPartition);

    try (Logger.LoggerScope logScope = Logger.enterScope("dataPartitionPatternTest", corpus.getCtx(), "testToDataPartitionPatternWithIncrementalTrait")) {
      final ManifestContent manifestData = ManifestPersistence.toData(manifest, null, null);

      Assert.assertEquals(manifestData.getEntities().size(), 1);
      final JsonNode entityData = manifestData.getEntities().get(0);
      Assert.assertEquals(1, entityData.get("dataPartitionPatterns").size(), 1);
      final JsonNode patternData = entityData.get("dataPartitionPatterns").get(0);
      Assert.assertEquals(patternData.get("name").asText(), "TestingPartitionPattern");
    }
    Assert.assertTrue(errorMessageVerified.get());
  }
}
