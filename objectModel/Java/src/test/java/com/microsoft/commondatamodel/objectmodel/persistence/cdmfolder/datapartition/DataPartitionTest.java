package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.datapartition;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ManifestContent;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.TimeUtils;
import java.io.File;
import java.io.IOException;
import java.util.List;
import org.testng.Assert;
import org.testng.annotations.Test;

public class DataPartitionTest {

  /**
   * The path between TestDataPath and TestName.
   */
  private static final String TESTS_SUBPATH = new File(new File("persistence", "cdmfolder"), "datapartition").toString();
  private static final ResolveContext RESOLVE_CONTEXT = new ResolveContext(new CdmCorpusDefinition());

  /*
   * Testing for manifest with local entity declaration having data partitions.
   */
  @Test
  public void testLoadLocalEntityWithDataPartition() throws IOException, InterruptedException {
    final String content = TestHelper.getInputFileContent(TESTS_SUBPATH, "testLoadLocalEntityWithDataPartition", "entities.manifest.cdm.json");
    final ManifestContent manifestContent = JMapper.MAP.readValue(content, ManifestContent.class);
    final CdmManifestDefinition cdmManifest = ManifestPersistence.fromData(RESOLVE_CONTEXT, "entities", "testNamespace", "/", manifestContent);

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
   * Testing programmatically creating manifest with partitions and persisting.
   */
  @Test
  public void testProgrammaticallyCreatePartitions() {
    final CdmCorpusDefinition corpus = new CdmCorpusDefinition();
    corpus.getStorage().mount("local", new LocalAdapter());
    final CdmManifestDefinition manifest =
        corpus.makeObject(CdmObjectType.ManifestDef, "manifest");
    final CdmEntityDeclarationDefinition entity = manifest.getEntities().add("entity");

    final CdmDataPartitionDefinition relativePartition =
        corpus.makeObject(CdmObjectType.DataPartitionDef, "relative partition");
    relativePartition.setLocation("relative/path");
    final CdmDataPartitionDefinition absolutePartition =
        corpus.makeObject(CdmObjectType.DataPartitionDef, "absolute partition");
    absolutePartition.setLocation("local:/absolute/path");

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
    Assert.assertEquals(
        absolutePartition.getLocation(),
        absolutePartitionData.get("location").asText());
  }
}
