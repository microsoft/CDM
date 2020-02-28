// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.LocalEntity;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Model;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import java.io.File;
import java.io.IOException;
import java.util.concurrent.ExecutionException;
import org.apache.commons.lang3.StringUtils;
import org.testng.Assert;
import org.testng.annotations.Test;

public class DataPartitionTest extends ModelJsonTestBase {
  /**
   * The path between TestDataPath and TestName.
   */
  private final String TESTS_SUBPATH =
      new File(
          new File("persistence", "modeljson"), "datapartition")
          .toString();

  /**
   * Testing whether DataPartition Location is consistently populated when:
   * 1. Manifest is read directly.
   * 2. Manifest is obtained by converting a model.json.
   */
  @Test
  public void testModelJsonDataPartitionLocationConsistency() throws ExecutionException, InterruptedException, IOException {
    final CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testModelJsonDataPartitionLocationConsistency", null);
    final CdmManifestDefinition manifestRead =
        cdmCorpus.<CdmManifestDefinition>fetchObjectAsync(
            "default.manifest.cdm.json",
            cdmCorpus.getStorage().fetchRootFolder("local")).get();
    Assert.assertEquals(
        "EpisodeOfCare/partition-data.csv",
        manifestRead.getEntities().get(0).getDataPartitions().get(0).getLocation());

    final Model convertedToModelJson = ManifestPersistence.toData(manifestRead, null, null).get();
    final String location =
        ((LocalEntity) convertedToModelJson.getEntities().get(0))
            .getPartitions()
            .get(0)
            .getLocation();
    // Model Json uses absolute adapter path.
    Assert.assertTrue(
        StringUtils.containsIgnoreCase(
            location,
            "\\TestData\\Persistence\\ModelJson\\DataPartition\\TestModelJsonDataPartitionLocationConsistency\\Input\\EpisodeOfCare\\partition-data.csv"));

    final CdmCorpusDefinition cdmCorpus2 = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testModelJsonDataPartitionLocationConsistency", null);
    final CdmManifestDefinition manifestAfterConversion =
        ManifestPersistence.fromObject
            (cdmCorpus2.getCtx(),
                convertedToModelJson,
                cdmCorpus2.getStorage().fetchRootFolder("local"))
            .get();
    Assert.assertEquals(
        "EpisodeOfCare/partition-data.csv",
        manifestAfterConversion.getEntities().get(0).getDataPartitions().get(0).getLocation());

    final CdmCorpusDefinition cdmCorpus3 = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testModelJsonDataPartitionLocationConsistency", null);
    final String readFile =
        TestHelper.getInputFileContent(
            TESTS_SUBPATH,
            "testModelJsonDataPartitionLocationConsistency",
            "model.json");
    final CdmFolderDefinition namespaceFolder = cdmCorpus3.getStorage().fetchRootFolder("local");
    final String modelJsonAsString =
        readFile.replace("C:\\\\cdm\\\\CDM.ObjectModel.CSharp\\\\Microsoft.CommonDataModel\\\\Microsoft.CommonDataModel.ObjectModel.Tests\\\\TestData\\\\Persistence\\\\ModelJson\\\\DataPartition\\\\TestModelJsonDataPartitionLocationConsistency\\\\Input\\\\EpisodeOfCare\\\\partition-data.csv",
            location.replace("\\", "\\\\"));

    final CdmManifestDefinition manifestReadFromModelJson =
        ManifestPersistence.fromObject(
            cdmCorpus3.getCtx(),
            JMapper.MAP.readValue(modelJsonAsString, Model.class),
            namespaceFolder)
            .get();
    Assert.assertEquals(
        "EpisodeOfCare/partition-data.csv",
        manifestReadFromModelJson.getEntities().get(0).getDataPartitions().get(0).getLocation());
  }
}
