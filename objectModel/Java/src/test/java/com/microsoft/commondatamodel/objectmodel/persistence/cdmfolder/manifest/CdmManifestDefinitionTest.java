package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.manifest;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertNull;
import static org.testng.Assert.assertTrue;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmObjectBase;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ManifestContent;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.TimeUtils;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import org.testng.Assert;
import org.testng.annotations.Test;

public class CdmManifestDefinitionTest {
  /**
   * The path between TestDataPath and TestName.
   */
  private static final String TESTS_SUBPATH = new File(new File("persistence", "cdmfolder"), "manifest").toString();
  private static final String CDM_NAMESPACE = "cdm";
  private static final String PATH = "Abc/Def";
  private static final String OBJECT_PATH = "Ghi";
  private static final String FOLDER_PATH = "Mnp/Qrs/";
  private static final String EMPTY_STRING = "";
  private static final String LOCAL = "local";

  /**
   * Testing for manifest impl instance with no entities and no sub manifests.
   */
  @Test
  public void testLoadFolderWithNoEntityFolders() throws IOException, InterruptedException {
    final String content = TestHelper.getInputFileContent(TESTS_SUBPATH, "testLoadFolderWithNoEntityFolders", "empty.manifest.cdm.json");
    final ManifestContent cdmContent = JMapper.MAP.readValue(content, ManifestContent.class);
    final CdmManifestDefinition cdmManifest = ManifestPersistence.fromData(new ResolveContext(new CdmCorpusDefinition()), "cdmTest", "someNamespace", "/", cdmContent);

    assertEquals(cdmManifest.getSchema(), "CdmManifest.cdm.json");
    assertEquals(cdmManifest.getManifestName(), "cdmTest");
    assertEquals(cdmManifest.getJsonSchemaSemanticVersion(), "0.9.0");
    assertEquals(TimeUtils.formatDateStringIfNotNull(cdmManifest.getLastFileModifiedTime()), "2008-09-15T23:53:23Z");
    assertEquals(cdmManifest.getExplanation(), "test cdm folder for cdm version 0.9+");
    assertEquals(cdmManifest.getImports().getCount(), 1);
    assertEquals(cdmManifest.getImports().get(0).getCorpusPath(), "./primitives.cdm.json");
    assertEquals(cdmManifest.getEntities().getCount(), 0);
    assertEquals(cdmManifest.getExhibitsTraits().getCount(), 1);
    assertEquals(cdmManifest.getSubManifests().getCount(), 0);
  }

  /**
   * Testing for manifest impl instance with everything.
   */
  @Test
  public void testManifestWithEverything() throws IOException, InterruptedException {
    final String content = TestHelper.getInputFileContent(TESTS_SUBPATH, "testManifestWithEverything", "complete.manifest.cdm.json");
    final ManifestContent cdmContent = JMapper.MAP.readValue(content, ManifestContent.class);
    final CdmManifestDefinition cdmManifest = ManifestPersistence.fromData(new ResolveContext(new CdmCorpusDefinition()), "docName", "someNamespace", "/", cdmContent);
    assertEquals(cdmManifest.getSubManifests().getCount(), 1);
    assertEquals(cdmManifest.getEntities().getCount(), 2);
  }

  /**
   * Testing for back-comp folio loading.
   */
  @Test
  public void testFolioWithEverything() throws IOException, InterruptedException {
    final String content = TestHelper.getInputFileContent(TESTS_SUBPATH, "testFolioWithEverything", "complete.folio.cdm.json");
    final CdmManifestDefinition cdmManifest = ManifestPersistence.fromData(new ResolveContext(new CdmCorpusDefinition()),
        "docName",
        "someNamespace", "/",
        JMapper.MAP.readValue(content, ManifestContent.class));
    Assert.assertEquals(1, cdmManifest.getSubManifests().getCount());
    Assert.assertEquals(2, cdmManifest.getEntities().getCount());
  }

  /**
   * Test for copy data.
   */
  @Test
  public void testManifestForCopyData() throws IOException, InterruptedException {
    final String content = TestHelper.getInputFileContent(TESTS_SUBPATH, "testManifestForCopyData", "complete.manifest.cdm.json");
    final ManifestContent cdmContent = JMapper.MAP.readValue(content, ManifestContent.class);
    final CdmManifestDefinition cdmManifest = ManifestPersistence.fromData(new ResolveContext(new CdmCorpusDefinition()), "docName", "someNamespace", "/", cdmContent);
    final ManifestContent manifestObject = (ManifestContent) CdmObjectBase.copyData(cdmManifest, null, null, CdmManifestDefinition.class);

    assertEquals(manifestObject.getSchema(), "CdmManifest.cdm.json");
    assertEquals(manifestObject.getJsonSchemaSemanticVersion(), "0.9.0");
    assertEquals(manifestObject.getManifestName(), "cdmTest");
    assertEquals(manifestObject.getExplanation(), "test cdm folder for cdm version 0.9+");
    assertEquals(manifestObject.getImports().size(), 1);
    assertEquals(manifestObject.getImports().get(0).getCorpusPath(), "./primitives.cdm.json");
    assertEquals(manifestObject.getExhibitsTraits().size(), 1);
    assertEquals(manifestObject.getEntities().size(), 2);
    assertEquals(manifestObject.getEntities().get(0).get("entityName").asText(), "testEntity");
    assertEquals(manifestObject.getSubManifests().size(), 1);
    assertEquals(manifestObject.getSubManifests().get(0).getDefinition(), "test definition");
    assertNull(manifestObject.getLastFileModifiedTime());
  }

  /**
   * Test modified times for manifest and files beneath it
   */
  @Test
  public void testLoadsAndSetsTimesCorrectly() throws InterruptedException, ExecutionException {

    final String inputPath = TestHelper.getInputFolderPath(TESTS_SUBPATH, "testLoadsAndSetsTimesCorrectly");

    final OffsetDateTime timeBeforeLoad = OffsetDateTime.now(ZoneOffset.UTC);

    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
    cdmCorpus.getStorage().mount("someNamespace", new LocalAdapter(inputPath));
    cdmCorpus.getStorage().mount(LOCAL, new LocalAdapter(inputPath));
    cdmCorpus.getStorage().unmount(CDM_NAMESPACE);
    cdmCorpus.getStorage().setDefaultNamespace(LOCAL);

    final CdmManifestDefinition cdmManifest = (CdmManifestDefinition) cdmCorpus.fetchObjectAsync("someNamespace:/default.manifest.cdm.json").get();
    final OffsetDateTime statusTimeAtLoad = cdmManifest.getLastFileStatusCheckTime();

    // hard coded because the time comes from inside the file
    assertEquals(TimeUtils.formatDateStringIfNotNull(statusTimeAtLoad), "2019-02-01T15:36:19.410Z");

    Thread.sleep(100);

    cdmManifest.fileStatusCheckAsync().join();

    assertTrue(cdmManifest.getLastFileStatusCheckTime().isAfter(timeBeforeLoad));
    assertTrue(cdmManifest.getLastFileStatusCheckTime().isAfter(statusTimeAtLoad));
    assertEquals(cdmManifest.getSubManifests().getCount(), 1);
    assertTrue(cdmManifest.getSubManifests().get(0).getLastFileStatusCheckTime().isAfter(timeBeforeLoad));
    assertEquals(cdmManifest.getEntities().getCount(), 1);

    final CdmEntityDeclarationDefinition entity = cdmManifest.getEntities().get(0);
    assertEquals(entity.getDataPartitions().getCount(), 1);

    final CdmManifestDeclarationDefinition subManifest = cdmManifest.getSubManifests().get(0);
    final OffsetDateTime maxTime = TimeUtils.maxTime(entity.getLastFileModifiedTime(), subManifest.getLastFileModifiedTime());
    assertEquals(TimeUtils.formatDateStringIfNotNull(cdmManifest.getLastChildFileModifiedTime()), TimeUtils.formatDateStringIfNotNull(maxTime));
  }

  /**
   * Tests refreshing files that match the regular expression
   */
  @Test
  public void testRefreshesDataPartitionPatterns() throws IOException, InterruptedException, ExecutionException {
    final String inputPath = TestHelper.getInputFolderPath(TESTS_SUBPATH, "testRefreshDataPartitionPatterns");

    final OffsetDateTime actualLastModTime = OffsetDateTime.ofInstant(
        Files.getLastModifiedTime(Paths.get(inputPath)).toInstant(),
        ZoneOffset.UTC);

    final CdmCorpusDefinition cdmCorpus = new CdmCorpusDefinition();
    cdmCorpus.getStorage().mount(LOCAL, new LocalAdapter(inputPath));
    cdmCorpus.getStorage().setDefaultNamespace(LOCAL);
    final CdmManifestDefinition cdmManifest = (CdmManifestDefinition) cdmCorpus.fetchObjectAsync("local:/patternManifest.manifest.cdm.json").get();

    final CdmEntityDeclarationDefinition partitionEntity = cdmManifest.getEntities().getAllItems().get(0);
    assertEquals(partitionEntity.getDataPartitions().getCount(), 1);

    final OffsetDateTime timeBeforeLoad = OffsetDateTime.now(ZoneOffset.UTC);
    cdmManifest.fileStatusCheckAsync().join();

    // file status check should check patterns and add two more partitions that match the pattern
    // should not re-add already existing partitions

    // Mac and Windows behave differently when listing file content, so we don't want to be strict about partition file order
    int totalExpectedPartitionsFound = 0;
    for (final CdmDataPartitionDefinition partition : partitionEntity.getDataPartitions().getAllItems()) {
      switch (partition.getLocation()) {
        case "partitions/existingPartition.csv":
          totalExpectedPartitionsFound++;
          break;

        case "partitions/someSubFolder/someSubPartition.csv":
          totalExpectedPartitionsFound++;
          assertEquals(partition.getSpecializedSchema(), "test special schema");
          assertTrue(partition.getLastFileStatusCheckTime().isAfter(timeBeforeLoad));

          // inherits the exhibited traits from pattern
          assertEquals(partition.getExhibitsTraits().getCount(), 1);
          assertEquals(partition.getExhibitsTraits().get(0).getNamedReference(), "is");

          assertEquals(partition.getArguments().size(), 1);
          assertTrue(partition.getArguments().containsKey("testParam1"));
          final List<String> argArray = partition.getArguments().get("testParam1");
          assertEquals(argArray.size(), 1);
          assertEquals(argArray.get(0), "/someSubFolder/someSub");
          break;
        case "partitions/newPartition.csv":
          totalExpectedPartitionsFound++;
          assertEquals(partition.getArguments().size(), 1);
          break;
        case "partitions/2018/folderCapture.csv":
          totalExpectedPartitionsFound++;
          assertEquals(partition.getArguments().size(), 1);
          assertTrue(partition.getArguments().containsKey("year"));
          assertEquals(partition.getArguments().get("year").get(0), "2018");
          break;
        case "partitions/2018/8/15/folderCapture.csv":
          totalExpectedPartitionsFound++;
          assertEquals(partition.getArguments().size(), 3);
          assertTrue(partition.getArguments().containsKey("year"));
          assertEquals(partition.getArguments().get("year").get(0), "2018");
          assertTrue(partition.getArguments().containsKey("month"));
          assertEquals(partition.getArguments().get("month").get(0), "8");
          assertTrue(partition.getArguments().containsKey("day"));
          assertEquals(partition.getArguments().get("day").get(0), "15");
          break;
        case "partitions/2018/8/15/folderCaptureRepeatedGroup.csv":
          totalExpectedPartitionsFound++;
          assertEquals(partition.getArguments().size(), 1);
          assertTrue(partition.getArguments().containsKey("day"));
          assertEquals(partition.getArguments().get("day").get(0), "15");
          break;
        case "partitions/testTooFew.csv":
        case "partitions/testTooMany.csv":
          totalExpectedPartitionsFound++;
          assertEquals(partition.getArguments().size(), 0);
          break;
      }
    }

    assertEquals(totalExpectedPartitionsFound, 8);
  }

  /**
   * Checks Absolute corpus path can be created with valid input.
   */
  @Test
  public void testValidRootPath() {
    final List<String> objectPaths = new ArrayList<>();
    objectPaths.add(PATH);
    objectPaths.add("/" + PATH);
    objectPaths.add(CDM_NAMESPACE + ":/" + PATH);

    final CdmCorpusDefinition corpus = new CdmCorpusDefinition();

    // checks with null object
    String absolutePath = corpus.getStorage().createAbsoluteCorpusPath(objectPaths.get(0));
    assertEquals(absolutePath, objectPaths.get(1));

    absolutePath = corpus.getStorage().createAbsoluteCorpusPath(objectPaths.get(1));
    assertEquals(absolutePath, objectPaths.get(1));

    absolutePath = corpus.getStorage().createAbsoluteCorpusPath(objectPaths.get(2));
    assertEquals(absolutePath, objectPaths.get(2));

    final CdmManifestDefinition obj = new CdmManifestDefinition(null, null);
    obj.setNamespace(EMPTY_STRING);
    obj.setFolderPath(FOLDER_PATH);

    absolutePath = corpus.getStorage().createAbsoluteCorpusPath(objectPaths.get(0), obj);
    assertEquals(absolutePath, FOLDER_PATH + objectPaths.get(0));

    obj.setNamespace(CDM_NAMESPACE);
    absolutePath = corpus.getStorage().createAbsoluteCorpusPath(objectPaths.get(1), obj);
    assertEquals(absolutePath, CDM_NAMESPACE + ":/" + objectPaths.get(0));

    absolutePath = corpus.getStorage().createAbsoluteCorpusPath(objectPaths.get(0), obj);
    assertEquals(absolutePath, CDM_NAMESPACE + ":" + FOLDER_PATH + objectPaths.get(0));
  }

  /**
   * FolderPath should always end with a '/'
   * This checks the behavior if FolderPath does not end with a '/'
   * ('/' should be appended and a warning be sent through callback function)
   */
  @Test
  public void testPathThatDoesNotEndInSlash() {
    final CdmCorpusDefinition corpus = new CdmCorpusDefinition();

    final CdmManifestDefinition obj = new CdmManifestDefinition(null, null);
    obj.setFolderPath(PATH);
    obj.setNamespace(CDM_NAMESPACE);

    final ResolveContext cdmCorpusContext = new ResolveContext(corpus);
    corpus.setCtx(cdmCorpusContext);

    final String absolutePath = corpus.getStorage().createAbsoluteCorpusPath(OBJECT_PATH, obj);
    assertEquals(absolutePath, CDM_NAMESPACE + ":" + PATH + "/" + OBJECT_PATH);
  }

  /**
   * Tests absolute paths cannot be created with wrong parameters.
   * Checks behavior if objectPath is invalid.
   */
  @Test
  public void makeAbsoluteCorpusPath_whenObjectPathIsInValid_expectNull() {
    final String[] invalidObjectPaths = new String[] {
        "./" + OBJECT_PATH,
        "/./" + OBJECT_PATH,
        "../" + OBJECT_PATH,
        OBJECT_PATH + "/./" + OBJECT_PATH,
        OBJECT_PATH + "/../" + OBJECT_PATH
    };
    final CdmCorpusDefinition corpus = new CdmCorpusDefinition();

    for (final String invalidObjectPath : invalidObjectPaths) {
      assertNull(corpus.getStorage().createAbsoluteCorpusPath(invalidObjectPath));
    }
  }

  /**
   * Tests absolute paths cannot be created with wrong parameters.
   * Checks behavior if FolderPath is invalid.
   */
  @Test
  public void makeAbsoluteCorpusPath_whenFolderPathIsSetToInvalid_expectNull() {
    final String[] invalidFolderPaths = new String[] {
        "./" + OBJECT_PATH,
        "/./" + OBJECT_PATH,
        "../" + OBJECT_PATH,
        OBJECT_PATH + "/./" + OBJECT_PATH,
        OBJECT_PATH + "/../" + OBJECT_PATH
    };

    for (final String invalidFolderPath : invalidFolderPaths) {
      final CdmCorpusDefinition corpus = new CdmCorpusDefinition();

      final ResolveContext cdmCorpusContext = new ResolveContext(corpus);
      corpus.setCtx(cdmCorpusContext);

      final CdmManifestDefinition manifest = new CdmManifestDefinition(null, null);
      manifest.setNamespace(CDM_NAMESPACE);
      manifest.setFolderPath(invalidFolderPath);
      assertNull(corpus.getStorage().createAbsoluteCorpusPath(OBJECT_PATH, manifest));
    }
  }
}
