// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.manifest;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ManifestContent;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.TimeUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.exceptions.CdmReadPartitionFromPatternException;

import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.File;
import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;

public class ManifestImplTest {
  /**
   * The path between TestDataPath and TestName.
   */
  private static final String TESTS_SUBPATH =
      new File(new File(
          "persistence",
          "cdmfolder"),
          "manifest")
          .toString();

  /**
   * Testing for manifest impl instance with no entities and no sub manifests.
   */
  @Test
  public void testLoadFolderWithNoEntityFolders() throws IOException, InterruptedException {
    final String content = TestHelper.getInputFileContent(
            TESTS_SUBPATH,
            "testLoadFolderWithNoEntityFolders",
            "empty.manifest.cdm.json");
    final CdmManifestDefinition cdmManifest = ManifestPersistence.fromObject(
            new ResolveContext(new CdmCorpusDefinition()), "","", "",
                               JMapper.MAP.readValue(content, ManifestContent.class));

    Assert.assertEquals(cdmManifest.getSchema(), "CdmManifestDefinition.cdm.json");
    Assert.assertEquals(cdmManifest.getManifestName(), "cdmTest");
    Assert.assertEquals(cdmManifest.getJsonSchemaSemanticVersion(), "1.0.0");
    Assert.assertEquals(TimeUtils.formatDateStringIfNotNull(cdmManifest.getLastFileModifiedTime()), "2008-09-15T23:53:23Z");
    Assert.assertEquals(cdmManifest.getExplanation(), "test cdm folder for cdm version 1.0+");
    Assert.assertEquals(cdmManifest.getImports().size(), 1);
    Assert.assertEquals(cdmManifest.getImports().get(0).getCorpusPath(), "/primitives.cdm.json");
    Assert.assertEquals(cdmManifest.getEntities().size(), 0);
    Assert.assertEquals(cdmManifest.getExhibitsTraits().size(), 1);
    Assert.assertEquals(cdmManifest.getSubManifests().size(), 0);
  }

  /**
   * Testing for manifest impl instance with everything.
   */
  @Test
  public void testManifestWithEverything() throws IOException, InterruptedException {
    String content = TestHelper.getInputFileContent(
            TESTS_SUBPATH,
            "testManifestWithEverything",
            "complete.manifest.cdm.json");
    CdmManifestDefinition cdmManifest = ManifestPersistence.fromObject(
            new ResolveContext(new CdmCorpusDefinition()), "docName","someNamespace", "/",
            JMapper.MAP.readValue(content, ManifestContent.class));

    Assert.assertEquals(cdmManifest.getSubManifests().size(), 1);
    Assert.assertEquals(cdmManifest.getEntities().size(), 2);
    Assert.assertEquals("cdmTest", cdmManifest.getManifestName());

    content = TestHelper.getInputFileContent(
            TESTS_SUBPATH,
            "testManifestWithEverything",
            "noname.manifest.cdm.json");
    cdmManifest = ManifestPersistence.fromObject(
            new ResolveContext(new CdmCorpusDefinition()),
            "docName.manifest.cdm.json","someNamespace", "/",
            JMapper.MAP.readValue(content, ManifestContent.class));

    Assert.assertEquals(cdmManifest.getSubManifests().size(), 1);
    Assert.assertEquals(cdmManifest.getEntities().size(), 2);
    Assert.assertEquals("docName", cdmManifest.getManifestName());
  }

  /**
   * Testing for back-comp folio loading.
   */
  @Test
  public void testFolioWithEverything() throws IOException, InterruptedException {
    String content = TestHelper.getInputFileContent(
            TESTS_SUBPATH,
            "testFolioWithEverything",
            "complete.folio.cdm.json");
    CdmManifestDefinition cdmManifest = ManifestPersistence.fromObject(
            new ResolveContext(new CdmCorpusDefinition()), "docName","someNamespace", "/",
            JMapper.MAP.readValue(content, ManifestContent.class));

    Assert.assertEquals(cdmManifest.getSubManifests().size(), 1);
    Assert.assertEquals(cdmManifest.getEntities().size(), 2);
    Assert.assertEquals("cdmTest", cdmManifest.getManifestName());

    content = TestHelper.getInputFileContent(
            TESTS_SUBPATH,
            "testFolioWithEverything",
            "noname.folio.cdm.json");
    cdmManifest = ManifestPersistence.fromObject(
            new ResolveContext(new CdmCorpusDefinition()),
            "docName.folio.cdm.json","someNamespace", "/",
            JMapper.MAP.readValue(content, ManifestContent.class));

    Assert.assertEquals(cdmManifest.getSubManifests().size(), 1);
    Assert.assertEquals(cdmManifest.getEntities().size(), 2);
    Assert.assertEquals("docName", cdmManifest.getManifestName());
  }

  /**
   * Test for copy data.
   */
  @Test
  public void testManifestForCopyData() throws IOException, InterruptedException {
    String content = TestHelper.getInputFileContent(
            TESTS_SUBPATH,
            "testManifestForCopyData",
            "complete.manifest.cdm.json");
    CdmManifestDefinition cdmManifest = ManifestPersistence.fromObject(
            new ResolveContext(new CdmCorpusDefinition()), "docName", "someNamespace", "/",
            JMapper.MAP.readValue(content, ManifestContent.class));

    ManifestContent manifestObject = ManifestPersistence.toData(cdmManifest, null, null);
    Assert.assertEquals(manifestObject.getSchema(), "CdmManifestDefinition.cdm.json");
    Assert.assertEquals(manifestObject.getJsonSchemaSemanticVersion(), "1.0.0");
    Assert.assertEquals(manifestObject.getDocumentVersion(), "2.0.0");
    Assert.assertEquals(manifestObject.getManifestName(), "cdmTest");
    Assert.assertEquals(manifestObject.getExplanation(), "test cdm folder for cdm version 1.0+");
    Assert.assertEquals(manifestObject.getImports().size(), 1);
    Assert.assertEquals(manifestObject.getImports().get(0).getCorpusPath(), "/primitives.cdm.json");
    Assert.assertEquals(manifestObject.getExhibitsTraits().size(), 1);
    Assert.assertEquals(manifestObject.getEntities().size(), 2);
    Assert.assertEquals(manifestObject.getEntities().get(0).get("entityName").asText(), "testEntity");
    Assert.assertEquals(manifestObject.getSubManifests().size(), 1);
    Assert.assertEquals(manifestObject.getSubManifests().get(0).getDefinition(), "test definition");
    Assert.assertEquals(manifestObject.getLastFileModifiedTime(), null);
  }

  /**
   * Test modified times for manifest and files beneath it
   */
  @Test
  public void testLoadsAndSetsTimesCorrectly() throws CdmReadPartitionFromPatternException, InterruptedException {
    String inputPath = TestHelper.getInputFolderPath(TESTS_SUBPATH, "testLoadsAndSetsTimesCorrectly");
    final OffsetDateTime timeBeforeLoad = OffsetDateTime.now();

    CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testLoadsAndSetsTimesCorrectly");
    cdmCorpus.setEventCallback((level, message) -> Assert.fail("Unexpected log: " + message), CdmStatusLevel.Warning);
    cdmCorpus.getStorage().mount("someNamespace", new LocalAdapter(inputPath));

    CdmManifestDefinition cdmManifest =
            (CdmManifestDefinition) cdmCorpus.fetchObjectAsync("someNamespace:/default.manifest.cdm.json").join();
    OffsetDateTime statusTimeAtLoad = cdmManifest.getLastFileStatusCheckTime();
    // hard coded because the time comes from inside the file
    Assert.assertEquals(TimeUtils.formatDateStringIfNotNull(statusTimeAtLoad), "2019-02-01T15:36:19.410Z");

    Assert.assertNotNull(cdmManifest.getFileSystemModifiedTime());
    Assert.assertTrue(cdmManifest.getFileSystemModifiedTime().isBefore(timeBeforeLoad));

    Thread.sleep(100);

    cdmManifest.fileStatusCheckAsync().join();

    Assert.assertTrue(cdmManifest.getLastFileStatusCheckTime().isAfter(timeBeforeLoad));
    Assert.assertTrue(cdmManifest.getLastFileStatusCheckTime().isAfter(statusTimeAtLoad));
    Assert.assertEquals(cdmManifest.getSubManifests().size(), 1);
    Assert.assertTrue(cdmManifest.getSubManifests().get(0).getLastFileStatusCheckTime().isAfter(timeBeforeLoad));
    Assert.assertEquals(cdmManifest.getEntities().size(), 1);
    Assert.assertEquals(cdmManifest.getEntities().get(0).getDataPartitions().size(), 1);

    CdmEntityDeclarationDefinition entity = cdmManifest.getEntities().get(0);
    CdmManifestDeclarationDefinition subManifest = cdmManifest.getSubManifests().get(0);
    OffsetDateTime maxTime = TimeUtils.maxTime(entity.getLastFileModifiedTime(), subManifest.getLastFileModifiedTime());
    Assert.assertEquals(TimeUtils.formatDateStringIfNotNull(cdmManifest.getLastChildFileModifiedTime()), TimeUtils.formatDateStringIfNotNull(maxTime));
  }

  /**
   * Checks Absolute corpus path can be created with valid input.
   */
  @Test
  public void testValidRootPath() {
      CdmCorpusDefinition corpus = new CdmCorpusDefinition();
      // checks with null object
      String absolutePath = corpus.getStorage().createAbsoluteCorpusPath("Abc/Def");
      Assert.assertEquals("/Abc/Def", absolutePath);

      absolutePath = corpus.getStorage().createAbsoluteCorpusPath("/Abc/Def");
      Assert.assertEquals("/Abc/Def", absolutePath);

      absolutePath = corpus.getStorage().createAbsoluteCorpusPath("cdm:/Abc/Def");
      Assert.assertEquals("cdm:/Abc/Def", absolutePath);

      CdmManifestDefinition manifest = new CdmManifestDefinition(null, null);
      manifest.setNamespace("");
      manifest.setFolderPath("Mnp/Qrs/");
      absolutePath = corpus.getStorage().createAbsoluteCorpusPath("Abc/Def", manifest);
      Assert.assertEquals("Mnp/Qrs/Abc/Def", absolutePath);

      manifest = new CdmManifestDefinition(null, null);
      manifest.setNamespace("cdm");
      manifest.setFolderPath("Mnp/Qrs/");
      absolutePath = corpus.getStorage().createAbsoluteCorpusPath("/Abc/Def", manifest);
      Assert.assertEquals("cdm:/Abc/Def", absolutePath);

      manifest = new CdmManifestDefinition(null, null);
      manifest.setNamespace("cdm");
      manifest.setFolderPath("Mnp/Qrs/");
      absolutePath = corpus.getStorage().createAbsoluteCorpusPath("Abc/Def", manifest);
      Assert.assertEquals("cdm:Mnp/Qrs/Abc/Def", absolutePath);
    }

  /**
   * FolderPath should always end with a /
   * This checks the behavior if FolderPath does not end with a /
   * ('/' should be appended and a warning be sent through callback function)
   */
  @Test
  public void testPathThatDoesNotEndInSlash() throws InterruptedException {
    final HashSet<CdmLogCode> expectedLogCodes = new HashSet<> (Collections.singletonList(CdmLogCode.WarnStorageExpectedPathPrefix));
    CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testPathThatDoesNotEndInSlash", false, expectedLogCodes, true);

    CdmManifestDefinition manifest = new CdmManifestDefinition(null, null);
    manifest.setNamespace("cdm");
    manifest.setFolderPath("Mnp");
    String absolutePath = corpus.getStorage().createAbsoluteCorpusPath("Abc",manifest);
    Assert.assertEquals("cdm:Mnp/Abc", absolutePath);

    TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.WarnStorageExpectedPathPrefix, true);
  }

  /**
   * Tests absolute paths cannot be created with wrong parameters.
   * Checks behavior if objectPath is invalid.
   */
  @Test
  public void testPathRootInvalidObjectPath() throws InterruptedException {
    final HashSet<CdmLogCode> expectedLogCodes = new HashSet<> (Collections.singletonList(CdmLogCode.ErrStorageInvalidPathFormat));
    CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testPathRootInvalidObjectPath", false, expectedLogCodes, true);

    corpus.getStorage().createAbsoluteCorpusPath("./Abc");
    TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageInvalidPathFormat, true);

    corpus.getStorage().createAbsoluteCorpusPath("/./Abc");
    TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageInvalidPathFormat, true);

    corpus.getStorage().createAbsoluteCorpusPath("../Abc");
    TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageInvalidPathFormat, true);

    corpus.getStorage().createAbsoluteCorpusPath("Abc/./Def");
    TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageInvalidPathFormat, true);

    corpus.getStorage().createAbsoluteCorpusPath("Abc/../Def");
    TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageInvalidPathFormat, true);
  }

  /**
   * Tests absolute paths cannot be created with wrong parameters.
   * Checks behavior if FolderPath is invalid.
   */
  @Test
  public void testPathRootInvalidFolderPath() throws InterruptedException {
    final HashSet<CdmLogCode> expectedLogCodes = new HashSet<> (Collections.singletonList(CdmLogCode.ErrStorageInvalidPathFormat));
    CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testPathRootInvalidFolderPath", false, expectedLogCodes, true);

    CdmManifestDefinition manifest = new CdmManifestDefinition(null, null);
    manifest.setNamespace("cdm");
    manifest.setFolderPath("./Mnp");
    corpus.getStorage().createAbsoluteCorpusPath("Abc", manifest);
    TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageInvalidPathFormat, true);

    manifest = new CdmManifestDefinition(null, null);
    manifest.setNamespace("cdm");
    manifest.setFolderPath("/./Mnp");
    corpus.getStorage().createAbsoluteCorpusPath("Abc", manifest);
    TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageInvalidPathFormat, true);

    manifest = new CdmManifestDefinition(null, null);
    manifest.setNamespace("cdm");
    manifest.setFolderPath("../Mnp");
    corpus.getStorage().createAbsoluteCorpusPath("Abc", manifest);
    TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageInvalidPathFormat, true);

    manifest = new CdmManifestDefinition(null, null);
    manifest.setNamespace("cdm");
    manifest.setFolderPath("Mnp/./Qrs");
    corpus.getStorage().createAbsoluteCorpusPath("Abc", manifest);
    TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageInvalidPathFormat, true);

    manifest = new CdmManifestDefinition(null, null);
    manifest.setNamespace("cdm");
    manifest.setFolderPath("Mnp/../Qrs");
    corpus.getStorage().createAbsoluteCorpusPath("Abc", manifest);
    TestHelper.assertCdmLogCodeEquality(corpus, CdmLogCode.ErrStorageInvalidPathFormat, true);
  }

  /**
   * Test passing blank or empty values for manifest schema, name etc.
   */
  @Test
  public void testManifestWithBlankFields() throws IOException, InterruptedException {
    final String content = TestHelper.getInputFileContent(
            TESTS_SUBPATH,
            "testManifestWithBlankFields",
            "blank.manifest.cdm.json");
    final CdmManifestDefinition cdmManifest = ManifestPersistence.fromObject(
            new ResolveContext(new CdmCorpusDefinition()), "","", "",
                               JMapper.MAP.readValue(content, ManifestContent.class));

    Assert.assertNull(cdmManifest.getSchema());
    Assert.assertNull(cdmManifest.getDocumentVersion());
    Assert.assertEquals(TimeUtils.formatDateStringIfNotNull(cdmManifest.getLastFileModifiedTime()), "2008-09-15T23:53:23Z");
    Assert.assertEquals(cdmManifest.getExplanation(), "test cdm folder for cdm version 1.0+");
    Assert.assertEquals(cdmManifest.getImports().size(), 1);
    Assert.assertEquals(cdmManifest.getImports().get(0).getCorpusPath(), "/primitives.cdm.json");
    Assert.assertEquals(cdmManifest.getEntities().size(), 0);
    Assert.assertEquals(cdmManifest.getExhibitsTraits().size(), 1);
    Assert.assertEquals(cdmManifest.getSubManifests().size(), 0);
  }
}