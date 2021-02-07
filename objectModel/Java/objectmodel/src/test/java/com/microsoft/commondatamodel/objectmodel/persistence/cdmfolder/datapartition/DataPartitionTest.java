// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.datapartition;

import com.fasterxml.jackson.databind.JsonNode;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.KeyValuePair;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ManifestContent;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.CopyOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.TimeUtils;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

import org.skyscreamer.jsonassert.JSONAssert;
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
   * Testing programmatically creating manifest with partitions and persisting.
   */
  @Test
  public void testProgrammaticallyCreatePartitions() throws IOException, InterruptedException {
    final CdmCorpusDefinition corpus = new CdmCorpusDefinition();
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
}
