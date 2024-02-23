// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.datapartition;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.enums.CdmIncrementalPartitionType;
import com.microsoft.commondatamodel.objectmodel.enums.PartitionFileStatusCheckType;
import com.microsoft.commondatamodel.objectmodel.utilities.FileStatusCheckOptions;
import com.microsoft.commondatamodel.objectmodel.utilities.exceptions.CdmReadPartitionFromPatternException;

import org.testng.annotations.Test;

import java.io.File;
import org.testng.Assert;

public class DataPartitionTest {
  private static final String CDM = "cdm";
  private static final String TESTS_SUBPATH = new File(CDM, "dataPartition").toString();

  @Test
  public void testRefreshesDataPartition() throws CdmReadPartitionFromPatternException, InterruptedException {
    final CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testRefreshesDataPartition");
    final CdmManifestDefinition cdmManifest = cdmCorpus.<CdmManifestDefinition>fetchObjectAsync("local:/partitions.manifest.cdm.json").join();
    final FileStatusCheckOptions fileStatusCheckOptions = new FileStatusCheckOptions(true);

    final CdmEntityDeclarationDefinition partitionEntity = cdmManifest.getEntities().get(0);
    Assert.assertEquals(partitionEntity.getDataPartitions().size(), 1);
    final CdmDataPartitionDefinition partition = partitionEntity.getDataPartitions().get(0);

    cdmManifest.fileStatusCheckAsync(PartitionFileStatusCheckType.Full, CdmIncrementalPartitionType.None, fileStatusCheckOptions).join();

    int localTraitIndex = partition.getExhibitsTraits().indexOf("is.partition.size");
    Assert.assertNotEquals(localTraitIndex, -1);
    final CdmTraitReference localTrait = (CdmTraitReference)partition.getExhibitsTraits().get(localTraitIndex);
    Assert.assertEquals(localTrait.getNamedReference(), "is.partition.size");
    Assert.assertEquals(localTrait.getArguments().get(0).getValue(), (long)2);
  }
}
