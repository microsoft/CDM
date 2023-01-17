// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.datapartitionpattern;

import java.io.File;
import java.io.IOException;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import com.microsoft.commondatamodel.objectmodel.AdlsTestHelper;
import com.microsoft.commondatamodel.objectmodel.TestHelper;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCollection;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionPatternDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmLocalEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmParameterDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.enums.CdmIncrementalPartitionType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.enums.PartitionFileStatusCheckType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ManifestContent;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.testAdapters.FetchAllMetadataNullAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.testAdapters.NoOverrideAdapter;
import com.microsoft.commondatamodel.objectmodel.storage.testAdapters.OverrideFetchAllFilesAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.Constants;
import com.microsoft.commondatamodel.objectmodel.utilities.FileStatusCheckOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;

import org.apache.commons.lang3.tuple.ImmutablePair;
import org.testng.Assert;
import org.testng.AssertJUnit;
import org.testng.annotations.Test;

public class DataPartitionPatternTest {
  private static final String CDM = "cdm";
  private static final String TESTS_SUBPATH = new File(CDM, "dataPartitionPattern").toString();
  
  /**
   * Tests refreshing files that match the regular expression
   */
  @Test
  public void testRefreshesDataPartitionPatterns() throws InterruptedException {
    final CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testRefreshDataPartitionPatterns");
    final CdmManifestDefinition cdmManifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync("local:/patternManifest.manifest.cdm.json").join();

    final CdmLocalEntityDeclarationDefinition partitionEntity = (CdmLocalEntityDeclarationDefinition)cdmManifest.getEntities().get(1);
    Assert.assertEquals(partitionEntity.getDataPartitions().size(), 1);

    final OffsetDateTime timeBeforeLoad = OffsetDateTime.now();
    // adding sleep here to avoid failure(comparison between timeBeforeLoad and getLastFileStatusCheckTime) caused by machine running too fast
    Thread.sleep(100);

    cdmManifest.fileStatusCheckAsync().join();

    // file status check should check patterns and add two more partitions that match the pattern
    // should not re-add already existing partitions

    // Mac and Windows behave differently when listing file content, so we don't want to be strict about partition file order
    int totalExpectedPartitionsFound = 0;
    for (CdmDataPartitionDefinition partition : partitionEntity.getDataPartitions()) {
      switch (partition.getLocation()) {
        case "partitions/existingPartition.csv":
          totalExpectedPartitionsFound++;
          break;

        case "partitions/someSubFolder/someSubPartition.csv":
          totalExpectedPartitionsFound++;
          Assert.assertEquals(partition.getSpecializedSchema(), "test special schema");
          Assert.assertTrue(partition.getLastFileStatusCheckTime().compareTo(timeBeforeLoad) > 0);

          // inherits the exhibited traits from pattern
          Assert.assertEquals(partition.getExhibitsTraits().size(), 1);
          Assert.assertEquals(partition.getExhibitsTraits().get(0).getNamedReference(), "is");

          Assert.assertEquals(partition.getArguments().size(), 1);
          Assert.assertTrue(partition.getArguments().containsKey("testParam1"));
          List<String> argArray = partition.getArguments().get("testParam1");
          Assert.assertEquals(argArray.size(), 1);
          Assert.assertEquals(argArray.get(0), "/someSubFolder/someSub");
          break;
        case "partitions/newPartition.csv":
          totalExpectedPartitionsFound++;
          Assert.assertEquals(partition.getArguments().size(), 1);
          break;
        case "partitions/2018/folderCapture.csv":
          totalExpectedPartitionsFound++;
          Assert.assertEquals(partition.getArguments().size(), 1);
          Assert.assertEquals(partition.getArguments().containsKey("year"), true);
          Assert.assertEquals(partition.getArguments().get("year").get(0), "2018");
          break;
        case "partitions/2018/8/15/folderCapture.csv":
          totalExpectedPartitionsFound++;
          Assert.assertEquals(partition.getArguments().size(), 3);
          Assert.assertEquals(partition.getArguments().containsKey("year"), true);
          Assert.assertEquals(partition.getArguments().get("year").get(0), "2018");
          Assert.assertEquals(partition.getArguments().containsKey("month"), true);
          Assert.assertEquals(partition.getArguments().get("month").get(0), "8");
          Assert.assertEquals(partition.getArguments().containsKey("day"), true);
          Assert.assertEquals(partition.getArguments().get("day").get(0), "15");
          break;
        case "partitions/2018/8/15/folderCaptureRepeatedGroup.csv":
          totalExpectedPartitionsFound++;
          Assert.assertEquals(partition.getArguments().size(), 1);
          Assert.assertEquals(partition.getArguments().containsKey("day"), true);
          Assert.assertEquals(partition.getArguments().get("day").get(0), "15");
          break;
        case "partitions/testTooFew.csv":
          totalExpectedPartitionsFound++;
          Assert.assertEquals(partition.getArguments().size(), 0);
          break;
        case "partitions/testTooMany.csv":
          totalExpectedPartitionsFound++;
          Assert.assertEquals(partition.getArguments().size(), 0);
          break;
      }
    }
    Assert.assertEquals(totalExpectedPartitionsFound, 8);
  }

  /**
   * Tests data partition objects created by a partition pattern do not share the same trait with the partition pattern
   */
  @Test
  public void testRefreshesDataPartitionPatternsWithTrait() throws InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testRefreshesDataPartitionPatternsWithTrait");
    final CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/patternManifest.manifest.cdm.json").join();

    final CdmLocalEntityDeclarationDefinition partitionEntity = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(0);
    Assert.assertEquals(partitionEntity.getDataPartitionPatterns().size(), 1);
    Assert.assertEquals(partitionEntity.getDataPartitions().size(), 0);

    final CdmTraitDefinition traitDef = new CdmTraitDefinition(corpus.getCtx(), "testTrait");
    traitDef.getParameters().add(new CdmParameterDefinition(corpus.getCtx(), "argument value"));
    CdmTraitReference patternTraitRef = (CdmTraitReference)partitionEntity.getDataPartitionPatterns().get(0).getExhibitsTraits().add("testTrait");
    patternTraitRef.getArguments().add("int", 1);
    patternTraitRef.getArguments().add("bool", (Object)true);
    patternTraitRef.getArguments().add("string", "a");

    manifest.fileStatusCheckAsync().join();

    Assert.assertEquals(partitionEntity.getDataPartitions().size(), 2);
    patternTraitRef = (CdmTraitReference)partitionEntity.getDataPartitionPatterns().get(0).getExhibitsTraits().item("testTrait");
    Assert.assertEquals(patternTraitRef.getArguments().get(0).getValue(), 1);
    Assert.assertTrue((Boolean) patternTraitRef.getArguments().get(1).getValue());
    patternTraitRef.getArguments().get(0).setValue(3);
    patternTraitRef.getArguments().get(1).setValue(false);

    final CdmTraitReference partitionTraitRef = (CdmTraitReference)partitionEntity.getDataPartitions().get(0).getExhibitsTraits().item("testTrait");
    Assert.assertNotEquals(partitionTraitRef, patternTraitRef);
    Assert.assertEquals(partitionTraitRef.getArguments().get(0).getValue(), 1);
    Assert.assertTrue((Boolean) partitionTraitRef.getArguments().get(1).getValue());
    partitionTraitRef.getArguments().get(0).setValue(2);

    Assert.assertEquals(((CdmTraitReference)partitionEntity.getDataPartitions().get(1).getExhibitsTraits().item("testTrait")).getArguments().get(0).getValue(), 1);
  }

  /**
   * Tests refreshing incremental partition files that match the regular expression
   */
  @Test
  public void testIncrementalPatternsRefreshesFullAndIncremental() throws InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testIncrementalPatternsRefreshesFullAndIncremental");
    final CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/pattern.manifest.cdm.json").join();

    final CdmLocalEntityDeclarationDefinition partitionEntity = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(0);
    Assert.assertEquals(partitionEntity.getDataPartitions().size(), 0);
    Assert.assertEquals(partitionEntity.getIncrementalPartitions().size(), 0);
    Assert.assertEquals(partitionEntity.getDataPartitionPatterns().size(), 1);
    Assert.assertEquals(partitionEntity.getIncrementalPartitionPatterns().size(), 2);

    manifest.fileStatusCheckAsync(PartitionFileStatusCheckType.FullAndIncremental).join();

    // Mac and Windows behave differently when listing file content, so we don't want to be strict about partition file order
    int totalExpectedPartitionsFound = 0;

    Assert.assertEquals(partitionEntity.getDataPartitionPatterns().size(), 1);
    totalExpectedPartitionsFound++;
    Assert.assertFalse(partitionEntity.getDataPartitions().get(0).isIncremental());

    for (CdmDataPartitionDefinition partition : partitionEntity.getIncrementalPartitions()) {
      switch (partition.getLocation()) {
        case "/IncrementalData/2018/8/15/Deletes/delete1.csv":
          totalExpectedPartitionsFound++;
          Assert.assertEquals(partition.getArguments().size(), 4);
          Assert.assertTrue(partition.getArguments().containsKey("year"));
          Assert.assertEquals(partition.getArguments().get("year").get(0), "2018");
          Assert.assertTrue(partition.getArguments().containsKey("month"));
          Assert.assertEquals(partition.getArguments().get("month").get(0), "8");
          Assert.assertTrue(partition.getArguments().containsKey("day"));
          Assert.assertEquals(partition.getArguments().get("day").get(0), "15");
          Assert.assertTrue(partition.getArguments().containsKey("deletePartitionNumber"));
          Assert.assertEquals(partition.getArguments().get("deletePartitionNumber").get(0), "1");
          CdmTraitReference trait1 = (CdmTraitReference)partition.getExhibitsTraits().get(0);
          Assert.assertEquals(trait1.fetchObjectDefinitionName(), Constants.IncrementalTraitName);
          Assert.assertEquals(trait1.getArguments().item(Constants.IncrementalPatternParameterName).getValue(), "DeletePattern");
          Assert.assertEquals(trait1.getArguments().item("type").getValue(), CdmIncrementalPartitionType.Delete.toString());
          Assert.assertEquals(trait1.getArguments().item("fullDataPartitionPatternName").getValue(), "FullDataPattern");
          break;
        case "/IncrementalData/2018/8/15/Deletes/delete2.csv":
          totalExpectedPartitionsFound++;
          Assert.assertEquals(partition.getArguments().size(), 4);
          Assert.assertEquals(partition.getArguments().get("year").get(0), "2018");
          Assert.assertEquals(partition.getArguments().get("month").get(0), "8");
          Assert.assertEquals(partition.getArguments().get("day").get(0), "15");
          Assert.assertEquals(partition.getArguments().get("deletePartitionNumber").get(0), "2");
          CdmTraitReference trait2 = (CdmTraitReference)partition.getExhibitsTraits().get(0);
          Assert.assertEquals(trait2.fetchObjectDefinitionName(), Constants.IncrementalTraitName);
          Assert.assertEquals(trait2.getArguments().item(Constants.IncrementalPatternParameterName).getValue(), "DeletePattern");
          Assert.assertEquals(trait2.getArguments().item("type").getValue(), CdmIncrementalPartitionType.Delete.toString());
          Assert.assertEquals(trait2.getArguments().item("fullDataPartitionPatternName").getValue(), "FullDataPattern");
          break;
        case "/IncrementalData/2018/8/15/Upserts/upsert1.csv":
          totalExpectedPartitionsFound++;
          Assert.assertEquals(partition.getArguments().size(), 4);
          Assert.assertEquals(partition.getArguments().get("year").get(0), "2018");
          Assert.assertEquals(partition.getArguments().get("month").get(0), "8");
          Assert.assertEquals(partition.getArguments().get("day").get(0), "15");
          Assert.assertEquals(partition.getArguments().get("upsertPartitionNumber").get(0), "1");
          CdmTraitReference trait3 = (CdmTraitReference)partition.getExhibitsTraits().get(0);
          Assert.assertEquals(trait3.fetchObjectDefinitionName(), Constants.IncrementalTraitName);
          Assert.assertEquals(trait3.getArguments().item(Constants.IncrementalPatternParameterName).getValue(), "UpsertPattern");
          Assert.assertEquals(trait3.getArguments().item("type").getValue(), CdmIncrementalPartitionType.Upsert.toString());
          break;
        default:
          totalExpectedPartitionsFound++;
          break;
      }
    }
    Assert.assertEquals(totalExpectedPartitionsFound, 4);
  }

  /**
   * Tests refreshing incremental partition files that match the regular expression
   */
  @Test
  public void testIncrementalPatternsRefreshesDeleteIncremental() throws InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testIncrementalPatternsRefreshesDeleteIncremental");
    final CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/pattern.manifest.cdm.json").join();

    // Test without incremental partition added
    final CdmLocalEntityDeclarationDefinition partitionEntity = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(0);
    Assert.assertEquals(partitionEntity.getIncrementalPartitions().size(), 0);
    Assert.assertEquals(partitionEntity.getIncrementalPartitionPatterns().size(), 2);
    CdmTraitReference trait0 = (CdmTraitReference)partitionEntity.getIncrementalPartitionPatterns().get(0).getExhibitsTraits().get(0);
    Assert.assertEquals(trait0.getArguments().item("type").getValue().toString(), CdmIncrementalPartitionType.Upsert.toString());
    CdmTraitReference trait1 = (CdmTraitReference)partitionEntity.getIncrementalPartitionPatterns().get(1).getExhibitsTraits().get(0);
    Assert.assertEquals(trait1.getArguments().item("type").getValue().toString(), CdmIncrementalPartitionType.Delete.toString());

    OffsetDateTime timeBeforeLoad = OffsetDateTime.now(ZoneOffset.UTC).minusSeconds(1);
    manifest.fileStatusCheckAsync(PartitionFileStatusCheckType.Incremental, CdmIncrementalPartitionType.Delete).join();

    int totalExpectedPartitionsFound = 0;
    for (final CdmDataPartitionDefinition partition : partitionEntity.getIncrementalPartitions()) {
      if (partition.getLastFileStatusCheckTime().compareTo(timeBeforeLoad) > 0) {
        totalExpectedPartitionsFound++;
        CdmTraitReference traitRef = (CdmTraitReference)partition.getExhibitsTraits().item(Constants.IncrementalTraitName);
        Assert.assertEquals(traitRef.getArguments().item("type").getValue().toString(), CdmIncrementalPartitionType.Delete.toString());
      }
    }

    Assert.assertEquals(totalExpectedPartitionsFound, 2);

    //////////////////////////////////////////////////////////////////

    // Test with incremental partition added
    partitionEntity.getIncrementalPartitions().clear();
    Assert.assertEquals(partitionEntity.getIncrementalPartitions().size(), 0);

    timeBeforeLoad = OffsetDateTime.now(ZoneOffset.UTC).minusSeconds(1);
    final CdmDataPartitionDefinition upsertIncrementalPartition = corpus.makeObject(CdmObjectType.DataPartitionDef, "2019UpsertPartition1", false);
    upsertIncrementalPartition.setLastFileStatusCheckTime(timeBeforeLoad);
    upsertIncrementalPartition.setLocation("/IncrementalData/Upserts/upsert1.csv");
    upsertIncrementalPartition.getExhibitsTraits().add(Constants.IncrementalTraitName, Collections.singletonList(new ImmutablePair<String, Object>("type", CdmIncrementalPartitionType.Upsert.toString())));

    final CdmDataPartitionDefinition deleteIncrementalPartition = corpus.makeObject(CdmObjectType.DataPartitionDef, "2019DeletePartition1", false);
    deleteIncrementalPartition.setLastFileStatusCheckTime(timeBeforeLoad);
    deleteIncrementalPartition.setLocation("/IncrementalData/Deletes/delete1.csv");
    deleteIncrementalPartition.getExhibitsTraits().add(Constants.IncrementalTraitName, Collections.singletonList(new ImmutablePair<String, Object>("type", CdmIncrementalPartitionType.Delete.toString())));

    partitionEntity.getIncrementalPartitions().add(upsertIncrementalPartition);
    partitionEntity.getIncrementalPartitions().add(deleteIncrementalPartition);
    Assert.assertEquals(partitionEntity.getIncrementalPartitions().size(), 2);
    Assert.assertEquals(partitionEntity.getIncrementalPartitionPatterns().size(), 2);
    totalExpectedPartitionsFound = 0;

    manifest.fileStatusCheckAsync(PartitionFileStatusCheckType.Incremental, CdmIncrementalPartitionType.Delete).join();

    for (CdmDataPartitionDefinition partition : partitionEntity.getIncrementalPartitions()) {
      if (partition.getLastFileStatusCheckTime().compareTo(timeBeforeLoad) > 0) {
        totalExpectedPartitionsFound++;
        final CdmTraitReference traitRef = (CdmTraitReference)partition.getExhibitsTraits().item(Constants.IncrementalTraitName);
        Assert.assertEquals(traitRef.getArguments().item("type").getValue().toString(), CdmIncrementalPartitionType.Delete.toString());
      }
    }

    Assert.assertEquals(totalExpectedPartitionsFound, 3);
  }

  /**
   * Tests refreshing partition pattern with invalid incremental partition trait and invalid arguments.
   */
  @Test
  public void testPatternRefreshesWithInvalidTraitAndArgument() throws InterruptedException {
    // providing invalid enum value of CdmIncrementalPartitionType in string
    // "traitReference": "is.partition.incremental", "arguments": [{"name": "type","value": "typo"}]

    HashSet<CdmLogCode> expectedLogCodes = new HashSet<> (Collections.singletonList(CdmLogCode.ErrEnumConversionFailure));
    CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testPatternRefreshesWithInvalidTraitAndArgument", false, expectedLogCodes);
    CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/pattern.manifest.cdm.json").join();

    CdmLocalEntityDeclarationDefinition partitionEntity = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(0);
    Assert.assertEquals(partitionEntity.getIncrementalPartitionPatterns().size(), 1);
    Assert.assertTrue(partitionEntity.getIncrementalPartitionPatterns().get(0).isIncremental());

    manifest.fileStatusCheckAsync(PartitionFileStatusCheckType.Incremental, CdmIncrementalPartitionType.Delete).join();
    TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrEnumConversionFailure, true);

    //////////////////////////////////////////////////////////////////

    // providing invalid argument value - supply integer
    // "traitReference": "is.partition.incremental", "arguments": [{"name": "type","value": 123}]

    expectedLogCodes = new HashSet<> (Collections.singletonList(CdmLogCode.ErrTraitInvalidArgumentValueType));
    corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testPatternRefreshesWithInvalidTraitAndArgument", false, expectedLogCodes);
    manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/pattern.manifest.cdm.json").join();

    partitionEntity = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(0);
    Assert.assertEquals(partitionEntity.getIncrementalPartitionPatterns().size(), 1);
    Assert.assertTrue(partitionEntity.getIncrementalPartitionPatterns().get(0).isIncremental());
    CdmTraitReference traitRef = (CdmTraitReference)partitionEntity.getIncrementalPartitionPatterns().get(0).getExhibitsTraits().item(Constants.IncrementalTraitName);
    traitRef.getArguments().item("type").setValue(123);

    manifest.fileStatusCheckAsync(PartitionFileStatusCheckType.Incremental, CdmIncrementalPartitionType.Delete).join();
    TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrTraitInvalidArgumentValueType, true);

    //////////////////////////////////////////////////////////////////

    // not providing argument
    // "traitReference": "is.partition.incremental", "arguments": []]
    expectedLogCodes = new HashSet<> (Collections.singletonList(CdmLogCode.ErrTraitArgumentMissing));

    corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testPatternRefreshesWithInvalidTraitAndArgument", false, expectedLogCodes);
    manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/pattern.manifest.cdm.json").join();

    partitionEntity = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(0);
    Assert.assertEquals(partitionEntity.getIncrementalPartitionPatterns().size(), 1);
    Assert.assertTrue(partitionEntity.getIncrementalPartitionPatterns().get(0).isIncremental());
    traitRef = (CdmTraitReference)partitionEntity.getIncrementalPartitionPatterns().get(0).getExhibitsTraits().item(Constants.IncrementalTraitName);
    traitRef.getArguments().clear();

    manifest.fileStatusCheckAsync(PartitionFileStatusCheckType.Incremental, CdmIncrementalPartitionType.Delete).join();
    TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrTraitArgumentMissing, true);

    //////////////////////////////////////////////////////////////////

    // not providing trait
    expectedLogCodes = new HashSet<> (Collections.singletonList(CdmLogCode.ErrMissingIncrementalPartitionTrait));

    corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testPatternRefreshesWithInvalidTraitAndArgument", false, expectedLogCodes);
    manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/pattern.manifest.cdm.json").join();

    partitionEntity = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(0);
    Assert.assertEquals(partitionEntity.getIncrementalPartitionPatterns().size(), 1);
    Assert.assertTrue(partitionEntity.getIncrementalPartitionPatterns().get(0).isIncremental());
    partitionEntity.getIncrementalPartitionPatterns().get(0).getExhibitsTraits().clear();

    manifest.fileStatusCheckAsync(PartitionFileStatusCheckType.Incremental).join();
    TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrMissingIncrementalPartitionTrait, true);

    //////////////////////////////////////////////////////////////////

    // data partition pattern in DataPartitionPatterns collection contains incremental partition trait
    expectedLogCodes = new HashSet<> (Collections.singletonList(CdmLogCode.ErrUnexpectedIncrementalPartitionTrait));

    corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testPatternRefreshesWithInvalidTraitAndArgument", false, expectedLogCodes);
    manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/pattern.manifest.cdm.json").join();

    partitionEntity = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(0);
    Assert.assertEquals(partitionEntity.getIncrementalPartitionPatterns().size(), 1);
    Assert.assertTrue(partitionEntity.getIncrementalPartitionPatterns().get(0).isIncremental());
    final CdmDataPartitionPatternDefinition patternCopy = (CdmDataPartitionPatternDefinition)partitionEntity.getIncrementalPartitionPatterns().get(0).copy();
    partitionEntity.getDataPartitionPatterns().add(patternCopy);

    manifest.fileStatusCheckAsync(PartitionFileStatusCheckType.Full).join();
    TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrUnexpectedIncrementalPartitionTrait, true);
  }

  /**
   * Tests refreshing partition with invalid incremental partition trait and invalid arguments.
   */
  @Test
  public void testPartitionRefreshesWithInvalidTraitAndArgument() throws InterruptedException {
    // providing invalid enum value of CdmIncrementalPartitionType in string
    // "traitReference": "is.partition.incremental", "arguments": [{"name": "type","value": "typo"}]

    HashSet<CdmLogCode> expectedLogCodes = new HashSet<> (Collections.singletonList(CdmLogCode.ErrEnumConversionFailure));
    CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testPartitionRefreshesWithInvalidTraitAndArgument", false, expectedLogCodes);
    CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/partition.manifest.cdm.json").join();

    CdmLocalEntityDeclarationDefinition partitionEntity = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(0);
    Assert.assertEquals(partitionEntity.getIncrementalPartitions().size(), 1);
    Assert.assertTrue(partitionEntity.getIncrementalPartitions().get(0).isIncremental());

    manifest.fileStatusCheckAsync(PartitionFileStatusCheckType.Incremental, CdmIncrementalPartitionType.Delete).join();
    TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrEnumConversionFailure, true);

    //////////////////////////////////////////////////////////////////

    // providing invalid argument value - supply integer
    // "traitReference": "is.partition.incremental", "arguments": [{"name": "type","value": 123}]

    expectedLogCodes = new HashSet<> (Collections.singletonList(CdmLogCode.ErrTraitInvalidArgumentValueType));
    corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testPartitionRefreshesWithInvalidTraitAndArgument", false, expectedLogCodes);
    manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/partition.manifest.cdm.json").join();

    partitionEntity = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(0);
    Assert.assertEquals(partitionEntity.getIncrementalPartitions().size(), 1);
    Assert.assertTrue(partitionEntity.getIncrementalPartitions().get(0).isIncremental());
    CdmTraitReference traitRef = (CdmTraitReference)partitionEntity.getIncrementalPartitions().get(0).getExhibitsTraits().item(Constants.IncrementalTraitName);
    traitRef.getArguments().item("type").setValue(123);

    manifest.fileStatusCheckAsync(PartitionFileStatusCheckType.Incremental, CdmIncrementalPartitionType.Delete).join();
    TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrTraitInvalidArgumentValueType, true);

    //////////////////////////////////////////////////////////////////

    // not providing argument
    // "traitReference": "is.partition.incremental", "arguments": []]
    expectedLogCodes = new HashSet<> (Collections.singletonList(CdmLogCode.ErrTraitArgumentMissing));

    corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testPartitionRefreshesWithInvalidTraitAndArgument", false, expectedLogCodes);
    manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/partition.manifest.cdm.json").join();

    partitionEntity = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(0);
    Assert.assertEquals(partitionEntity.getIncrementalPartitions().size(), 1);
    Assert.assertTrue(partitionEntity.getIncrementalPartitions().get(0).isIncremental());
    traitRef = (CdmTraitReference)partitionEntity.getIncrementalPartitions().get(0).getExhibitsTraits().item(Constants.IncrementalTraitName);
    traitRef.getArguments().clear();

    manifest.fileStatusCheckAsync(PartitionFileStatusCheckType.Incremental, CdmIncrementalPartitionType.Delete).join();
    TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrTraitArgumentMissing, true);

    //////////////////////////////////////////////////////////////////

    // not providing trait
    expectedLogCodes = new HashSet<> (Collections.singletonList(CdmLogCode.ErrMissingIncrementalPartitionTrait));

    corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testPartitionRefreshesWithInvalidTraitAndArgument", false, expectedLogCodes);
    manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/partition.manifest.cdm.json").join();

    partitionEntity = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(0);
    Assert.assertEquals(partitionEntity.getIncrementalPartitions().size(), 1);
    Assert.assertTrue(partitionEntity.getIncrementalPartitions().get(0).isIncremental());
    partitionEntity.getIncrementalPartitions().get(0).getExhibitsTraits().clear();

    manifest.fileStatusCheckAsync(PartitionFileStatusCheckType.Incremental).join();
    TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrMissingIncrementalPartitionTrait, true);

    //////////////////////////////////////////////////////////////////

    // data partition in DataPartitions collection contains incremental partition trait
    expectedLogCodes = new HashSet<> (Collections.singletonList(CdmLogCode.ErrUnexpectedIncrementalPartitionTrait));

    corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testPartitionRefreshesWithInvalidTraitAndArgument", false, expectedLogCodes);
    manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/partition.manifest.cdm.json").join();

    partitionEntity = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(0);
    Assert.assertEquals(partitionEntity.getIncrementalPartitions().size(), 1);
    Assert.assertTrue(partitionEntity.getIncrementalPartitions().get(0).isIncremental());
    final CdmDataPartitionDefinition partitionCopy = (CdmDataPartitionDefinition)partitionEntity.getIncrementalPartitions().get(0).copy();
    partitionEntity.getDataPartitions().add(partitionCopy);

    manifest.fileStatusCheckAsync(PartitionFileStatusCheckType.Full).join();
    TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrUnexpectedIncrementalPartitionTrait, true);
  }

  /**
   * Tests fileStatusCheckAsync(), fileStatusCheckAsync(PartitionFileStatusCheckType.Full), and fileStatusCheckAsync(PartitionFileStatusCheckType.None).
   */
  @Test
  public void testPartitionFileRefreshTypeFullOrNone() throws InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testPartitionFileRefreshTypeFullOrNone");
    final CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("local:/pattern.manifest.cdm.json").join();

    // Test manifest.fileStatusCheckAsync();
    CdmLocalEntityDeclarationDefinition partitionEntity = (CdmLocalEntityDeclarationDefinition) manifest.getEntities().get(0);
    Assert.assertEquals(partitionEntity.getDataPartitions().size(), 0);
    Assert.assertEquals(partitionEntity.getIncrementalPartitions().size(), 0);
    Assert.assertEquals(partitionEntity.getDataPartitionPatterns().size(), 1);
    Assert.assertEquals(partitionEntity.getIncrementalPartitionPatterns().size(), 1);

    manifest.fileStatusCheckAsync().join();

    Assert.assertEquals(partitionEntity.getDataPartitions().size(), 1);
    Assert.assertFalse(partitionEntity.getDataPartitions().get(0).isIncremental());
    Assert.assertEquals(partitionEntity.getIncrementalPartitions().size(), 0);

    //////////////////////////////////////////////////////////////////

    // Test manifest.fileStatusCheckAsync(PartitionFileStatusCheckType.Full);
    partitionEntity.getDataPartitions().clear();
    partitionEntity.getIncrementalPartitions().clear();
    Assert.assertEquals(partitionEntity.getDataPartitions().size(), 0);
    Assert.assertEquals(partitionEntity.getIncrementalPartitions().size(), 0);
    Assert.assertEquals(partitionEntity.getDataPartitionPatterns().size(), 1);
    Assert.assertEquals(partitionEntity.getIncrementalPartitionPatterns().size(), 1);
    manifest.fileStatusCheckAsync(PartitionFileStatusCheckType.Full).join();

    Assert.assertEquals(partitionEntity.getDataPartitions().size(), 1);
    Assert.assertFalse(partitionEntity.getDataPartitions().get(0).isIncremental());
    Assert.assertEquals(partitionEntity.getIncrementalPartitions().size(), 0);

    //////////////////////////////////////////////////////////////////

    // Test manifest.fileStatusCheckAsync(PartitionFileStatusCheckType.None);
    partitionEntity.getDataPartitions().clear();
    partitionEntity.getIncrementalPartitions().clear();
    Assert.assertEquals(partitionEntity.getDataPartitions().size(), 0);
    Assert.assertEquals(partitionEntity.getIncrementalPartitions().size(), 0);
    Assert.assertEquals(partitionEntity.getDataPartitionPatterns().size(), 1);
    Assert.assertEquals(partitionEntity.getIncrementalPartitionPatterns().size(), 1);

    Thread.sleep(100);
    OffsetDateTime timeBeforeLoad = OffsetDateTime.now(ZoneOffset.UTC);
    Assert.assertTrue(manifest.getLastFileStatusCheckTime().compareTo(timeBeforeLoad) < 0);

    manifest.fileStatusCheckAsync(PartitionFileStatusCheckType.None).join();

    Assert.assertEquals(partitionEntity.getDataPartitions().size(), 0);
    Assert.assertEquals(partitionEntity.getIncrementalPartitions().size(), 0);
    Assert.assertTrue(manifest.getLastFileStatusCheckTime().compareTo(timeBeforeLoad) >= 0);
  }

  /**
   * Testing that error is handled when partition pattern contains a folder that does not exist
   */
  @Test
  public void testPatternWithNonExistingFolder() throws IOException, InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testPatternWithNonExistingFolder");
    final String content = TestHelper.getInputFileContent(TESTS_SUBPATH, "testPatternWithNonExistingFolder", "entities.manifest.cdm.json");
    final CdmManifestDefinition cdmManifest = ManifestPersistence.fromObject(new ResolveContext(corpus), "entities", "local", "/", JMapper.MAP.readValue(content, ManifestContent.class));

    AtomicInteger errorLogged = new AtomicInteger();
    corpus.setEventCallback((CdmStatusLevel level, String message) -> {
      if (message.contains("Failed to fetch all files in the folder location 'local:/testLocation' described by a partition pattern. Exception:")) {
        errorLogged.getAndIncrement();
      }
    }, CdmStatusLevel.Warning);

    cdmManifest.fileStatusCheckAsync().join();
    Assert.assertEquals(errorLogged.get(), 1);
    Assert.assertEquals(cdmManifest.getEntities().get(0).getDataPartitions().size(), 0);
    // make sure the last check time is still being set
    AssertJUnit.assertNotNull(cdmManifest.getEntities().get(0).getDataPartitionPatterns().get(0).getLastFileStatusCheckTime());
  }

  /**
   * Testing that partition is correctly found when namespace of pattern differs from namespace of the manifest
   */
  @Test
  public void TestPatternWithDifferentNamespace() throws IOException, InterruptedException {
    final String testName = "TestPatternWithDifferentNamespace";
    final CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, testName);
    LocalAdapter localAdapter = (LocalAdapter)cdmCorpus.getStorage().fetchAdapter("local");
    final String localPath = localAdapter.getFullRoot();
    cdmCorpus.getStorage().mount("other", new LocalAdapter(new File(localPath, "other").toString()));
    final CdmManifestDefinition cdmManifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync("local:/patternManifest.manifest.cdm.json").join();

    cdmManifest.fileStatusCheckAsync().join();

    Assert.assertEquals(1, cdmManifest.getEntities().get(0).getDataPartitions().size());
  }

  /**
   * Testing that patterns behave correctly with variations to rootLocation
   */
  @Test
  public void testVariationsInRootLocation() throws IOException, InterruptedException {
    CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestVariationsInRootLocation");
    CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("pattern.manifest.cdm.json").join();
    manifest.fileStatusCheckAsync().join();

    CdmLocalEntityDeclarationDefinition startsWithSlash = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(0);
    Assert.assertEquals(startsWithSlash.getDataPartitionPatterns().get(0).getRegularExpression(), ".*testfile.csv");
    Assert.assertEquals(startsWithSlash.getDataPartitions().size(), 1);
    Assert.assertEquals(startsWithSlash.getDataPartitions().get(0).getLocation(), "/partitions/testfile.csv");

    CdmLocalEntityDeclarationDefinition endsWithSlash = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(1);
    Assert.assertEquals(endsWithSlash.getDataPartitionPatterns().get(0).getRegularExpression(), ".*testfile.csv");
    Assert.assertEquals(endsWithSlash.getDataPartitions().size(), 1);
    Assert.assertEquals(endsWithSlash.getDataPartitions().get(0).getLocation(), "partitions/testfile.csv");

    CdmLocalEntityDeclarationDefinition noSlash = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(2);
    Assert.assertEquals(noSlash.getDataPartitionPatterns().get(0).getRegularExpression(), ".*testfile.csv");
    Assert.assertEquals(noSlash.getDataPartitions().size(), 1);
    Assert.assertEquals(noSlash.getDataPartitions().get(0).getLocation(), "partitions/testfile.csv");
  }

  /**
   * Testing data partition patterns that use glob patterns
   */
  @Test
  public void testPartitionPatternWithGlob() throws InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testPartitionPatternWithGlob");

    HashMap<String, String> patternWithGlobAndRegex = new HashMap<>();
    corpus.setEventCallback((CdmStatusLevel level, String message) -> {
      if (message.contains("CdmDataPartitionPatternDefinition | The Data Partition Pattern contains both a glob pattern (/testfile.csv) and a regular expression (/subFolder/testSubFile.csv) set, the glob pattern will be used.")) {
        patternWithGlobAndRegex.put("Warning Logged", "true");
      }
    }, CdmStatusLevel.Warning);

    final CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("pattern.manifest.cdm.json").join();
    manifest.fileStatusCheckAsync().join();

    // one pattern object contains both glob and regex
    Assert.assertEquals(patternWithGlobAndRegex.size(), 1);

    int index = 0;
    // make sure '.' in glob is not converted to '.' in regex
    final CdmLocalEntityDeclarationDefinition dotIsEscaped = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(index);
    Assert.assertEquals(dotIsEscaped.getDataPartitionPatterns().get(0).getGlobPattern(), "test.ile.csv");
    Assert.assertEquals(dotIsEscaped.getDataPartitions().size(), 0);
    index++;

    // star pattern should match anything in the root folder
    CdmLocalEntityDeclarationDefinition onlyStar = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(index);
    Assert.assertEquals(onlyStar.getDataPartitionPatterns().get(0).getGlobPattern(), "*");
    Assert.assertEquals(onlyStar.getDataPartitions().size(), 1);
    Assert.assertEquals(onlyStar.getDataPartitions().get(0).getLocation(), "/partitions/testfile.csv");
    index++;

    // star can match nothing
    CdmLocalEntityDeclarationDefinition starNoMatch = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(index);
    Assert.assertEquals(starNoMatch.getDataPartitionPatterns().get(0).getGlobPattern(), "/testfile*.csv");
    Assert.assertEquals(starNoMatch.getDataPartitions().size(), 1);
    Assert.assertEquals(starNoMatch.getDataPartitions().get(0).getLocation(), "/partitions/testfile.csv");
    index++;

    // star at root level
    // this should match any files at root level, none in subfolders
    CdmLocalEntityDeclarationDefinition starAtRoot = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(index);
    Assert.assertEquals(starAtRoot.getDataPartitionPatterns().get(0).getGlobPattern(), "/*.csv");
    Assert.assertEquals(starAtRoot.getDataPartitions().size(), 1);
    Assert.assertEquals(starAtRoot.getDataPartitions().get(0).getLocation(), "/partitions/testfile.csv");
    index++;

    // star at deeper level
    final CdmLocalEntityDeclarationDefinition starAtDeeperLevel = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(index);
    Assert.assertEquals(starAtDeeperLevel.getDataPartitionPatterns().get(0).getGlobPattern(), "/*/*.csv");
    Assert.assertEquals(starAtDeeperLevel.getDataPartitions().size(), 1);
    Assert.assertEquals(starAtDeeperLevel.getDataPartitions().get(0).getLocation(), "/partitions/subFolder/testSubFile.csv");
    index++;

    // pattern that ends with star
    final CdmLocalEntityDeclarationDefinition endsWithStar = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(index);
    Assert.assertEquals(endsWithStar.getDataPartitionPatterns().get(0).getGlobPattern(), "/testfile*");
    Assert.assertEquals(endsWithStar.getDataPartitions().size(), 1);
    Assert.assertEquals(endsWithStar.getDataPartitions().get(0).getLocation(), "/partitions/testfile.csv");
    index++;

    // globstar (**) on its own matches
    final CdmLocalEntityDeclarationDefinition globStar = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(index);
    Assert.assertEquals(globStar.getDataPartitionPatterns().get(0).getGlobPattern(), "**");
    Assert.assertEquals(globStar.getDataPartitions().size(), 2);
    Assert.assertEquals(globStar.getDataPartitions().getAllItems()
      .parallelStream()
        .filter(x ->
        x.getLocation().equals("/partitions/testfile.csv")
      ).collect(Collectors.toList()).size(), 1);
    Assert.assertEquals(globStar.getDataPartitions().getAllItems()
      .parallelStream().filter(x ->
        x.getLocation().equals("/partitions/subFolder/testSubFile.csv")
      ).collect(Collectors.toList()).size(), 1);
    index++;

    // globstar at the beginning of the pattern
    final CdmLocalEntityDeclarationDefinition beginsWithGlobstar = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(index) ;
    Assert.assertEquals(beginsWithGlobstar.getDataPartitionPatterns().get(0).getGlobPattern(), "/**.csv");
    Assert.assertEquals(beginsWithGlobstar.getDataPartitions().size(), 1);
    Assert.assertEquals(beginsWithGlobstar.getDataPartitions().get(0).getLocation(), "/partitions/testfile.csv");
    index++;

    // globstar at the end of the pattern
    final CdmLocalEntityDeclarationDefinition endsWithGlobstar = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(index);
    Assert.assertEquals(endsWithGlobstar.getDataPartitionPatterns().get(0).getGlobPattern(), "/**");
    Assert.assertEquals(endsWithGlobstar.getDataPartitions().size(), 2);
    Assert.assertEquals(endsWithGlobstar.getDataPartitions().getAllItems()
      .parallelStream()
      .filter(x ->
        x.getLocation().equals("/partitions/testfile.csv")
      ).collect(Collectors.toList()).size(), 1);
    Assert.assertEquals(endsWithGlobstar.getDataPartitions().getAllItems()
      .parallelStream()
      .filter(x ->
        x.getLocation().equals("/partitions/subFolder/testSubFile.csv")
      ).collect(Collectors.toList()).size(), 1);
    index++;

    // globstar matches zero or more folders
    final CdmLocalEntityDeclarationDefinition zeroOrMoreFolders = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(index);
    Assert.assertEquals(zeroOrMoreFolders.getDataPartitionPatterns().get(0).getGlobPattern(), "/**/*.csv");
    Assert.assertEquals(zeroOrMoreFolders.getDataPartitions().size(), 2);
    Assert.assertEquals(zeroOrMoreFolders.getDataPartitions().getAllItems()
      .parallelStream()
      .filter(x ->
        x.getLocation().equals("/partitions/testfile.csv")
      ).collect(Collectors.toList()).size(), 1);
    Assert.assertEquals(zeroOrMoreFolders.getDataPartitions().getAllItems()
      .parallelStream()
      .filter(x ->
        x.getLocation().equals("/partitions/subFolder/testSubFile.csv")
      ).collect(Collectors.toList()).size(), 1);
    index++;

    // globstar matches zero or more folders without starting slash
    final CdmLocalEntityDeclarationDefinition zeroOrMoreNoStartingSlash = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(index);
    Assert.assertEquals(zeroOrMoreNoStartingSlash.getDataPartitionPatterns().get(0).getGlobPattern(), "/**/*.csv");
    Assert.assertEquals(zeroOrMoreNoStartingSlash.getDataPartitions().size(), 2);
    Assert.assertEquals(zeroOrMoreNoStartingSlash.getDataPartitions().getAllItems()
      .parallelStream()
      .filter(x ->
        x.getLocation().equals("/partitions/testfile.csv")
      ).collect(Collectors.toList()).size(), 1);
    Assert.assertEquals(zeroOrMoreNoStartingSlash.getDataPartitions().getAllItems()
      .parallelStream()
      .filter(x ->
        x.getLocation().equals("/partitions/subFolder/testSubFile.csv")
      ).collect(Collectors.toList()).size(), 1);
    index++;

    // question mark in the middle of a pattern
    final CdmLocalEntityDeclarationDefinition questionMark = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(index);
    Assert.assertEquals(questionMark.getDataPartitionPatterns().get(0).getGlobPattern(), "/test?ile.csv");
    Assert.assertEquals(questionMark.getDataPartitions().size(), 1);
    Assert.assertEquals(questionMark.getDataPartitions().get(0).getLocation(), "/partitions/testfile.csv");
    index++;

    // question mark at the beginning of a pattern
    final CdmLocalEntityDeclarationDefinition beginsWithQuestionMark = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(index);
    Assert.assertEquals(beginsWithQuestionMark.getDataPartitionPatterns().get(0).getGlobPattern(), "/?estfile.csv");
    Assert.assertEquals(beginsWithQuestionMark.getDataPartitions().size(), 1);
    Assert.assertEquals(beginsWithQuestionMark.getDataPartitions().get(0).getLocation(), "/partitions/testfile.csv");
    index++;

    // question mark at the end of a pattern
    final CdmLocalEntityDeclarationDefinition endsWithQuestionMark = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(index);
    Assert.assertEquals(endsWithQuestionMark.getDataPartitionPatterns().get(0).getGlobPattern(), "/testfile.cs?");
    Assert.assertEquals(endsWithQuestionMark.getDataPartitions().size(), 1);
    Assert.assertEquals(endsWithQuestionMark.getDataPartitions().get(0).getLocation(), "/partitions/testfile.csv");
    index++;

    // backslash in glob can match slash
    final CdmLocalEntityDeclarationDefinition backslashInPattern = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(index);
    Assert.assertEquals(backslashInPattern.getDataPartitionPatterns().get(0).getGlobPattern(), "\\testfile.csv");
    Assert.assertEquals(backslashInPattern.getDataPartitions().size(), 1);
    Assert.assertEquals(backslashInPattern.getDataPartitions().get(0).getLocation(), "/partitions/testfile.csv");
    index++;

    // pattern object includes glob pattern and regular expression
    final CdmLocalEntityDeclarationDefinition globAndRegex = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(index);
    Assert.assertEquals(globAndRegex.getDataPartitionPatterns().get(0).getGlobPattern(), "/testfile.csv");
    Assert.assertEquals(globAndRegex.getDataPartitionPatterns().get(0).getRegularExpression(), "/subFolder/testSubFile.csv");
    Assert.assertEquals(globAndRegex.getDataPartitions().size(), 1);
    Assert.assertEquals(globAndRegex.getDataPartitions().get(0).getLocation(), "/partitions/testfile.csv");
  }

  /**
   * Testing data partition patterns that use glob patterns with variations in path style
   */
  @Test
  public void testGlobPathVariation() throws InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testGlobPathVariation");

    final CdmManifestDefinition manifest = corpus.<CdmManifestDefinition>fetchObjectAsync("pattern.manifest.cdm.json").join();
    manifest.fileStatusCheckAsync().join();

    int index = 0;
    final CdmLocalEntityDeclarationDefinition noSlash = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(index);
    Assert.assertEquals(noSlash.getDataPartitionPatterns().get(0).getRootLocation(), "/partitions");
    Assert.assertEquals(noSlash.getDataPartitionPatterns().get(0).getGlobPattern(), "*.csv");
    Assert.assertEquals(noSlash.getDataPartitions().size(), 1);
    Assert.assertEquals(noSlash.getDataPartitions().get(0).getLocation(), "/partitions/testfile.csv");
    index++;

    final CdmLocalEntityDeclarationDefinition rootLocationSlash = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(index);
    Assert.assertEquals(rootLocationSlash.getDataPartitionPatterns().get(0).getRootLocation(), "/partitions/");
    Assert.assertEquals(rootLocationSlash.getDataPartitionPatterns().get(0).getGlobPattern(), "*.csv");
    Assert.assertEquals(rootLocationSlash.getDataPartitions().size(), 1);
    Assert.assertEquals(rootLocationSlash.getDataPartitions().get(0).getLocation(), "/partitions/testfile.csv");
    index++;

    final CdmLocalEntityDeclarationDefinition globPatternSlash = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(index);
    Assert.assertEquals(globPatternSlash.getDataPartitionPatterns().get(0).getRootLocation(), "/partitions");
    Assert.assertEquals(globPatternSlash.getDataPartitionPatterns().get(0).getGlobPattern(), "/*.csv");
    Assert.assertEquals(globPatternSlash.getDataPartitions().size(), 1);
    Assert.assertEquals(globPatternSlash.getDataPartitions().get(0).getLocation(), "/partitions/testfile.csv");
    index++;

    final CdmLocalEntityDeclarationDefinition bothSlash = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(index);
    Assert.assertEquals(bothSlash.getDataPartitionPatterns().get(0).getRootLocation(), "/partitions/");
    Assert.assertEquals(bothSlash.getDataPartitionPatterns().get(0).getGlobPattern(), "/*.csv");
    Assert.assertEquals(bothSlash.getDataPartitions().size(), 1);
    Assert.assertEquals(bothSlash.getDataPartitions().get(0).getLocation(), "/partitions/testfile.csv");
    index++;

    final CdmLocalEntityDeclarationDefinition noSlashOrStarAtStart = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(index);
    Assert.assertEquals(noSlashOrStarAtStart.getDataPartitionPatterns().get(0).getRootLocation(), "/partitions/");
    Assert.assertEquals(noSlashOrStarAtStart.getDataPartitionPatterns().get(0).getGlobPattern(), "t*.csv");
    Assert.assertEquals(noSlashOrStarAtStart.getDataPartitions().size(), 1);
    Assert.assertEquals(noSlashOrStarAtStart.getDataPartitions().get(0).getLocation(), "/partitions/testfile.csv");
    index++;

    final CdmLocalEntityDeclarationDefinition noSlashOrStarAndRootLocation = (CdmLocalEntityDeclarationDefinition)manifest.getEntities().get(index);
    Assert.assertEquals(noSlashOrStarAndRootLocation.getDataPartitionPatterns().get(0).getRootLocation(), "/partitions");
    Assert.assertEquals(noSlashOrStarAndRootLocation.getDataPartitionPatterns().get(0).getGlobPattern(), "t*.csv");
    Assert.assertEquals(noSlashOrStarAndRootLocation.getDataPartitions().size(), 1);
    Assert.assertEquals(noSlashOrStarAndRootLocation.getDataPartitions().get(0).getLocation(), "/partitions/testfile.csv");
  }

  /**
   * Verifies that performing file status check on manifest with a partition with
   * null location is gracefully handled.
   *
   * @throws InterruptedException
   * @throws ExecutionException
   */
  @Test
  public void testFileStatusCheckOnNullLocation() throws InterruptedException, ExecutionException {
    CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testFileStatusCheckOnNullLocation");
    corpus.setEventCallback((level, message) -> {
      Assert.assertEquals(level, CdmStatusLevel.Error, "Error level message should have been reported");
      Assert.assertTrue(
              message.equals("StorageManager | The object path cannot be null or empty. | createAbsoluteCorpusPath") ||
                      message.equals("CdmCorpusDefinition | The object path cannot be null or empty. | getLastModifiedTimeFromPartitionPathAsync"),
              "Unexpected error message received");
    }, CdmStatusLevel.Warning);

    // Create manifest
    CdmManifestDefinition manifest = corpus.makeObject(CdmObjectType.ManifestDef, "TestModel");
    corpus.getStorage().fetchRootFolder("local").getDocuments().add(manifest);

    // Create entity
    CdmDocumentDefinition entDoc = corpus.getStorage().fetchRootFolder("local").getDocuments().add("MyEntityDoc.cdm.json");

    CdmEntityDefinition entDef = corpus.makeObject(CdmObjectType.EntityDef, "MyEntity");
    entDoc.getDefinitions().add(entDef);

    CdmEntityDeclarationDefinition entDecl = manifest.getEntities().add(entDef);

    // Create partition
    CdmDataPartitionDefinition part = corpus.makeObject(CdmObjectType.DataPartitionDef, "MyPartition");
    entDecl.getDataPartitions().add(part);

    // This should not throw exception
    manifest.fileStatusCheckAsync().join();
  }

  /**
   * Test FetchAllFilesMetadata includes partition size and is added as a trait in FileStatusCheckAsync
   *
   * @throws InterruptedException
   */
  @Test
  public void testFetchAllFilesMetadata() throws InterruptedException {
    final HashSet<CdmLogCode> expectedLogCodes = new HashSet<>(Arrays.asList(CdmLogCode.ErrFetchingFileMetadataNull));
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testFetchAllFilesMetadata", null, false, expectedLogCodes);
    final FileStatusCheckOptions fileStatusCheckOptions = new FileStatusCheckOptions(true);

    // test local adapter
    final CdmManifestDefinition localManifest = corpus.<CdmManifestDefinition>fetchObjectAsync("manifest.manifest.cdm.json").join();
    localManifest.fileStatusCheckAsync(PartitionFileStatusCheckType.Full, CdmIncrementalPartitionType.None, fileStatusCheckOptions).join();

    final CdmCollection<CdmDataPartitionDefinition> localDataPartitionList = localManifest.getEntities().get(0).getDataPartitions();
    Assert.assertEquals(localDataPartitionList.size(), 1);
    final int local_trait_index = localDataPartitionList.get(0).getExhibitsTraits().indexOf("is.partition.size");
    Assert.assertNotEquals(local_trait_index, -1);
    final CdmTraitReference localTrait = (CdmTraitReference) localDataPartitionList.get(0).getExhibitsTraits().get(local_trait_index);
    Assert.assertEquals(localTrait.getNamedReference(), "is.partition.size");
    Assert.assertEquals(localTrait.getArguments().get(0).getValue(), (long)2);

    if (AdlsTestHelper.isADLSEnvironmentEnabled()) {
      // test ADLS adapter
      corpus.getStorage().mount("adls", AdlsTestHelper.createAdapterWithSharedKey());
      final CdmManifestDefinition adlsManifest = corpus.<CdmManifestDefinition>fetchObjectAsync("adlsManifest.manifest.cdm.json").join();
      adlsManifest.fileStatusCheckAsync(PartitionFileStatusCheckType.Full, CdmIncrementalPartitionType.None, fileStatusCheckOptions).join();

      final CdmCollection<CdmDataPartitionDefinition> adlsDataPartitionList = adlsManifest.getEntities().get(0).getDataPartitions();
      Assert.assertEquals(adlsDataPartitionList.size(), 1);
      final int adls_trait_index = localDataPartitionList.get(0).getExhibitsTraits().indexOf("is.partition.size");
      Assert.assertNotEquals(adls_trait_index, -1);
      final CdmTraitReference adlsTrait = (CdmTraitReference) adlsDataPartitionList.get(0).getExhibitsTraits().get(adls_trait_index);
      Assert.assertEquals(adlsTrait.getNamedReference(), "is.partition.size");
      Assert.assertEquals(adlsTrait.getArguments().get(0).getValue(), (long) 1);
    }

    final LocalAdapter testLocalAdapter = (LocalAdapter)corpus.getStorage().getNamespaceAdapters().get(corpus.getStorage().getDefaultNamespace());

    // check that there are no errors when FetchAllFilesAsync is not overridden, uses method from StorageAdapterBase
    corpus.getStorage().mount("noOverride", new NoOverrideAdapter(testLocalAdapter));
    final CdmManifestDefinition noOverrideManifest = corpus.<CdmManifestDefinition>fetchObjectAsync("noOverride:/manifest.manifest.cdm.json").join();
    noOverrideManifest.fileStatusCheckAsync(PartitionFileStatusCheckType.Full, CdmIncrementalPartitionType.None, fileStatusCheckOptions).join();

    final CdmCollection<CdmDataPartitionDefinition> noOverridePartitionList = noOverrideManifest.getEntities().get(0).getDataPartitions();
    Assert.assertEquals(noOverridePartitionList.size(), 0);

    // check that there are no errors when FetchAllFilesMetadataAsync is not overridden
    corpus.getStorage().mount("overrideFetchAll", new OverrideFetchAllFilesAdapter(testLocalAdapter));
    final CdmManifestDefinition overrideFetchAllManifest = corpus.<CdmManifestDefinition>fetchObjectAsync("overrideFetchAll:/manifest.manifest.cdm.json").join();
    overrideFetchAllManifest.fileStatusCheckAsync(PartitionFileStatusCheckType.Full, CdmIncrementalPartitionType.None, fileStatusCheckOptions).join();

    final CdmCollection<CdmDataPartitionDefinition> overrideFetchDataPartitionList = overrideFetchAllManifest.getEntities().get(0).getDataPartitions();
    Assert.assertEquals(overrideFetchDataPartitionList.size(), 1);
    final int overrideFetchTraitIndex = overrideFetchDataPartitionList.get(0).getExhibitsTraits().indexOf("is.partition.size");
    Assert.assertEquals(overrideFetchTraitIndex , -1);
    Assert.assertEquals(overrideFetchDataPartitionList.get(0).getExhibitsTraits().size(), 1);

    // check that error is correctly logged when FetchAllFilesMetadata is misconfigured and returns null
    corpus.getStorage().mount("fetchNull", new FetchAllMetadataNullAdapter(testLocalAdapter));
    final CdmManifestDefinition fetchNullManifest = corpus.<CdmManifestDefinition>fetchObjectAsync("fetchNull:/manifest.manifest.cdm.json").join();
    fetchNullManifest.fileStatusCheckAsync(PartitionFileStatusCheckType.Full, CdmIncrementalPartitionType.None, fileStatusCheckOptions).join();
  }
}