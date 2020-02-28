// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.referencedentitydeclaration;

import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.ManifestPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ManifestContent;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import java.io.File;
import java.io.IOException;
import org.testng.Assert;
import org.testng.annotations.Test;

public class ReferencedDeclarationTest {
  /**
   * The path between TestDataPath and TestName.
   */
  private static final String TESTS_SUBPATH =
      new File(new File(
          "persistence",
          "cdmfolder"),
          "referencedentitydeclaration")
          .toString();

  /**
   * Testing for folder impl instance with referenced entity declaration.
   */
  @Test
  public void testLoadReferencedEntity() throws IOException, InterruptedException {

    final String content = TestHelper.getInputFileContent(
        TESTS_SUBPATH,
        "testLoadReferencedEntity",
        "entities.manifest.cdm.json");
    final ManifestContent jsonContent = JMapper.MAP.readValue(content, ManifestContent.class);
    final CdmManifestDefinition cdmManifest = ManifestPersistence.fromObject(
        new ResolveContext(
            new CdmCorpusDefinition()),
        "testEntity",
        "testNamespace",
        "/",
        jsonContent);
    Assert.assertEquals(cdmManifest.getEntities().getCount(), 1);
    Assert.assertEquals(
        cdmManifest.getEntities().get(0).getObjectType(),
        CdmObjectType.ReferencedEntityDeclarationDef);
    final CdmEntityDeclarationDefinition entity = cdmManifest.getEntities().get(0);
    Assert.assertEquals(entity.getEntityName(), "testEntity");
    Assert.assertEquals(entity.getExplanation(), "test explanation");
    Assert.assertEquals(entity.getEntityPath(), "testNamespace:/testPath");
    Assert.assertEquals(entity.getExhibitsTraits().getCount(), 1);
  }
}
