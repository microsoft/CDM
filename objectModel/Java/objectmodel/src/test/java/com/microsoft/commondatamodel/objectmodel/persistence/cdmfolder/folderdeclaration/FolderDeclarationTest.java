// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.folderdeclaration;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ManifestContent;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import java.io.File;
import java.io.IOException;
import org.testng.Assert;
import org.testng.annotations.Test;

public class FolderDeclarationTest {
  /**
   * The path between TestDataPath and TestName.
   */
  private final String TESTS_SUBPATH = new File(
      new File(
          "persistence",
          "cdmfolder"),
      "folderdeclaration").toString();

  /**
   * Testing for folder impl instance with subfolders.
   */
  @Test
  public void testLoadFolderWithSubFolders() throws IOException, InterruptedException {
    final String content = TestHelper.getInputFileContent(
        TESTS_SUBPATH,
        "testLoadFolderWithSubFolders",
        "subManifest.manifest.cdm.json");
    final ManifestContent jsonContent = JMapper.MAP.readValue(content, ManifestContent.class);
    final CdmManifestDefinition cdmManifest = ManifestPersistence.fromObject(
        new ResolveContext(new CdmCorpusDefinition()),
        "testEntity",
        "testNamespace",
        "/",
        jsonContent);

    Assert.assertEquals(cdmManifest.getSubManifests().size(), 1);
    final CdmManifestDeclarationDefinition subManifest = cdmManifest.getSubManifests().get(0);
    Assert.assertEquals(subManifest.getName(), "sub folder declaration");
    Assert.assertEquals(subManifest.getExplanation(), "test sub explanation");
    Assert.assertEquals(subManifest.getDefinition(), "test definition");
  }
}
