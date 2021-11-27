// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.storage;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmFolderDefinition;
import org.testng.Assert;
import org.testng.annotations.Test;

public class StorageManagerTest {
  /**
   * Tests if CreateAbsoluteCorpusPath works correctly when provided with a path that contains a colon character.
   */
  @Test
  public void testCreateAbsoluteCorpusPathWithColon() {
    CdmCorpusDefinition corpus = new CdmCorpusDefinition();
    CdmFolderDefinition folder = corpus.getStorage().fetchRootFolder("local");

    String absoluteNamespace = "namespace:/";
    String fileName = "dataPartition.csv@snapshot=2020-05-10T02:47:46.0039374Z";
    String subFolderPath = "some/sub/folder:with::colon/";

    // Cases where the path provided is relative.
    Assert.assertEquals("local:/" + fileName, corpus.getStorage().createAbsoluteCorpusPath(fileName, folder));
    Assert.assertEquals("local:/" + subFolderPath + fileName, corpus.getStorage().createAbsoluteCorpusPath(subFolderPath + fileName, folder));

    // Cases where the path provided is absolute.
    Assert.assertEquals(absoluteNamespace + fileName, corpus.getStorage().createAbsoluteCorpusPath(absoluteNamespace + fileName, folder));
    Assert.assertEquals(absoluteNamespace + subFolderPath + fileName, corpus.getStorage().createAbsoluteCorpusPath(absoluteNamespace + subFolderPath + fileName, folder));
  }
}
