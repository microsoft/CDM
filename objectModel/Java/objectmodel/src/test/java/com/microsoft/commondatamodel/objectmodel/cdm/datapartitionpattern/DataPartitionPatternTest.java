// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.datapartitionpattern;

import java.io.File;
import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ManifestContent;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;

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
  public void TestRefreshesDataPartitionPatterns() throws InterruptedException {
    final CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testRefreshDataPartitionPatterns", null);
    final CdmManifestDefinition cdmManifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync("local:/patternManifest.manifest.cdm.json").join();

    final CdmLocalEntityDeclarationDefinition partitionEntity = (CdmLocalEntityDeclarationDefinition)cdmManifest.getEntities().get(0);
    Assert.assertEquals(partitionEntity.getDataPartitions().size(), 1);

    final OffsetDateTime timeBeforeLoad = OffsetDateTime.now();

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
   * Testing that error is handled when partition pattern contains a folder that does not exist
   */
  @Test
  public void testPatternWithNonExistingFolder() throws IOException, InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testPatternWithNonExistingFolder", null);
    final String content = TestHelper.getInputFileContent(TESTS_SUBPATH, "testPatternWithNonExistingFolder", "entities.manifest.cdm.json");
    final CdmManifestDefinition cdmManifest = ManifestPersistence.fromObject(new ResolveContext(corpus), "entities", "local", "/", JMapper.MAP.readValue(content, ManifestContent.class));
    cdmManifest.fileStatusCheckAsync().join();
    Assert.assertEquals(cdmManifest.getEntities().get(0).getDataPartitions().size(), 0);
    // make sure the last check time is still being set
    AssertJUnit.assertNotNull(cdmManifest.getEntities().get(0).getDataPartitionPatterns().get(0).getLastFileStatusCheckTime());
  }

  /**
   * Testing that patterns behave correctly with variations to rootLocation
   */
  @Test
  public void testVariationsInRootLocation() throws IOException, InterruptedException {
    CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestVariationsInRootLocation", null);
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
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testPartitionPatternWithGlob", null);

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
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testGlobPathVariation", null);

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
                      message.equals("CdmCorpusDefinition | The object path cannot be null or empty. | computeLastModifiedTimeFromPartitionPathAsync"),
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
}