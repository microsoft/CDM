package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.datapartition;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ManifestContent;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
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

  /**
   * Testing for folder impl instance with local entity declaration having data partitions.
   */
  @Test
  public void testLoadLocalEntityWithDataPartition() throws IOException, InterruptedException {
    final String content = TestHelper.getInputFileContent(TESTS_SUBPATH, "testLoadLocalEntityWithDataPartition", "entities.manifest.cdm.json");
    final ManifestContent manifestContent = JMapper.MAP.readValue(content, ManifestContent.class);
    final CdmManifestDefinition cdmManifest = ManifestPersistence.fromData(RESOLVE_CONTEXT, "entities", "testNamespace", "/", manifestContent);

    Assert.assertEquals(cdmManifest.getEntities().getCount(), 1);
    Assert.assertEquals(cdmManifest.getEntities().get(0).getObjectType(), CdmObjectType.LocalEntityDeclarationDef);

    final CdmEntityDeclarationDefinition entity = cdmManifest.getEntities().get(0);
    Assert.assertEquals(entity.getDataPartitions().getCount(), 1);

    final CdmDataPartitionDefinition partition = entity.getDataPartitions().get(0);
    Assert.assertEquals(partition.getLocation(), "test/location");
    Assert.assertEquals(TimeUtils.formatDateStringIfNotNull(partition.getLastFileModifiedTime()), "2008-09-15T23:53:23Z");
    Assert.assertEquals(partition.getExhibitsTraits().getCount(), 1);
    Assert.assertEquals(partition.getSpecializedSchema(), "teststring");

    final List<String> testList = partition.getArguments().get("test");
    Assert.assertEquals(testList.size(), 2);
    Assert.assertEquals(testList.get(0), "something");
    Assert.assertEquals(testList.get(1), "somethingelse");

    final List<String> keyList = partition.getArguments().get("KEY");
    Assert.assertEquals(keyList.size(), 1);
    Assert.assertEquals(keyList.get(0), "VALUE");

    Assert.assertFalse(partition.getArguments().containsKey("wrong"));
  }
}
