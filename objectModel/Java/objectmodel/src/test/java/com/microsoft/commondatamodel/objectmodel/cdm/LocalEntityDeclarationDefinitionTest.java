// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import org.testng.Assert;
import org.testng.annotations.Test;

public class LocalEntityDeclarationDefinitionTest {
  /**
   * Tests if the copy function creates copies of the sub objects
   */
  @Test
  public void testLocalEntityDeclarationDefinitionCopy() throws InterruptedException {
    CdmCorpusDefinition corpus = TestHelper.getLocalCorpus("", "testLocalEntityDeclarationDefinitionCopy", null, null, null, true);
    CdmLocalEntityDeclarationDefinition manifest = new CdmLocalEntityDeclarationDefinition(corpus.getCtx(), "name");

    final String dataPartitionName = "dataPartitionName";
    final String dataPartitionPatternName = "dataPartitionPatternName";
    final String incrementalPartitionName = "incrementalPartitionName";
    final String incrementalPartitionPatternName = "incrementalPartitionPatternName";

    CdmDataPartitionDefinition dataPartition = manifest.getDataPartitions().add(dataPartitionName);
    CdmDataPartitionPatternDefinition dataPartitionPattern = manifest.getDataPartitionPatterns().add(dataPartitionPatternName);
    CdmDataPartitionDefinition incrementalPartition = manifest.getIncrementalPartitions().add(incrementalPartitionName);
    CdmDataPartitionPatternDefinition incrementalPartitionPattern = manifest.getIncrementalPartitionPatterns().add(incrementalPartitionPatternName);

    CdmLocalEntityDeclarationDefinition copy = (CdmLocalEntityDeclarationDefinition) manifest.copy();
    copy.getDataPartitions().get(0).setName("newDataPartitionName");
    copy.getDataPartitionPatterns().get(0).setName("newDataPartitionPatternName");
    copy.getIncrementalPartitions().get(0).setName("newIncrementalPartitionName");
    copy.getIncrementalPartitionPatterns().get(0).setName("newIncrementalPartitionPatternName");

    Assert.assertEquals(dataPartition.getName(), dataPartitionName);
    Assert.assertEquals(dataPartitionPattern.getName(), dataPartitionPatternName);
    Assert.assertEquals(incrementalPartition.getName(), incrementalPartitionName);
    Assert.assertEquals(incrementalPartitionPattern.getName(), incrementalPartitionPatternName);
  }
}
