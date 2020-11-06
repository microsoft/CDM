// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.folderdefinition;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;

import org.testng.Assert;
import org.testng.annotations.Test;

public class FolderDefinitionTest {
  /**
   * Tests the behavior of the fetchChildFolderFromPath function.
   */
  @Test
  public void testFetchChildFolderFromPath() {
    final CdmCorpusDefinition corpus = new CdmCorpusDefinition();
    CdmFolderDefinition rootFolder = new CdmFolderDefinition(corpus.getCtx(), "");

    String folderPath = "/";
    CdmFolderDefinition childFolder = rootFolder.fetchChildFolderFromPath(folderPath, false);
    Assert.assertEquals(folderPath, childFolder.getFolderPath());

    folderPath = "/";
    childFolder = rootFolder.fetchChildFolderFromPath(folderPath, true);
    Assert.assertEquals(folderPath, childFolder.getFolderPath());

    folderPath = "/core";
    childFolder = rootFolder.fetchChildFolderFromPath(folderPath, false);
    Assert.assertEquals("/", childFolder.getFolderPath());

    folderPath = "/core";
    childFolder = rootFolder.fetchChildFolderFromPath(folderPath, true);
    Assert.assertEquals(folderPath + "/", childFolder.getFolderPath());

    folderPath = "/core/";
    childFolder = rootFolder.fetchChildFolderFromPath(folderPath, false);
    Assert.assertEquals(folderPath, childFolder.getFolderPath());

    folderPath = "/core/";
    childFolder = rootFolder.fetchChildFolderFromPath(folderPath, true);
    Assert.assertEquals(folderPath, childFolder.getFolderPath());

    folderPath = "/core/applicationCommon";
    childFolder = rootFolder.fetchChildFolderFromPath(folderPath, false);
    Assert.assertEquals("/core/", childFolder.getFolderPath());

    folderPath = "/core/applicationCommon";
    childFolder = rootFolder.fetchChildFolderFromPath(folderPath, true);
    Assert.assertEquals(folderPath + "/", childFolder.getFolderPath());

    folderPath = "/core/applicationCommon/";
    childFolder = rootFolder.fetchChildFolderFromPath(folderPath, false);
    Assert.assertEquals(folderPath, childFolder.getFolderPath());

    folderPath = "/core/applicationCommon/";
    childFolder = rootFolder.fetchChildFolderFromPath(folderPath, true);
    Assert.assertEquals(folderPath, childFolder.getFolderPath());
  }
}