// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.localentitydeclaration;

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

public class LocalEntityDeclarationTest {
  /**
   * The path between TestDataPath and TestName.
   */
  private static final String TESTS_SUBPATH =
      new File(new File(
          "persistence",
          "cdmfolder"),
          "localentitydeclaration")
          .toString();

  /**
   * Testing for folder impl instance with local entity declaration.
   * Creates Manifest using empty string as namespace.
   */
  @Test
  public void testLoadNoPartition() throws IOException, InterruptedException {
    final String content = TestHelper.getInputFileContent(
        TESTS_SUBPATH,
        "testLoadNoPartition",
        "entities.manifest.cdm.json");
    final ManifestContent jsonContent = JMapper.MAP.readValue(content, ManifestContent.class);
    final CdmManifestDefinition cdmManifest = ManifestPersistence.fromObject(
        new ResolveContext(new CdmCorpusDefinition()),
        "",
        "",
        "",
        jsonContent);

    Assert.assertEquals(cdmManifest.getEntities().getCount(), 1);
    Assert.assertEquals(cdmManifest.getEntities().get(0).getObjectType(), CdmObjectType.LocalEntityDeclarationDef);
    final CdmEntityDeclarationDefinition entity = cdmManifest.getEntities().get(0);
    Assert.assertEquals(entity.getEntityName(), "Account");
    Assert.assertEquals(entity.getExplanation(), "Account explanation");
    Assert.assertEquals(entity.getEntityPath(), "Account.cdm.json/Account");
    Assert.assertEquals(entity.getExhibitsTraits().getCount(), 1);
    Assert.assertEquals(entity.getDataPartitions().getCount(), 0);
    Assert.assertEquals(entity.getDataPartitionPatterns().getCount(), 0);
  }

  /**
   * Testing for folder impl instance with local entity declaration.
   * This checks the result when manifest was created with a non-null namespace. Entity Path should contain this namespace.
   */
  @Test
  public void testLoadNoPartitionNamespaceSet() throws IOException, InterruptedException {
    final String content = TestHelper.getInputFileContent(
        TESTS_SUBPATH,
        "testLoadNoPartitionNamespaceSet",
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
        CdmObjectType.LocalEntityDeclarationDef);
    final CdmEntityDeclarationDefinition entity = cdmManifest.getEntities().get(0);
    Assert.assertEquals(entity.getEntityName(), "Account");
    Assert.assertEquals(entity.getExplanation(), "Account explanation");
    Assert.assertEquals(entity.getEntityPath(), "Account.cdm.json/Account");
    Assert.assertEquals(entity.getExhibitsTraits().getCount(), 1);
    Assert.assertEquals(entity.getDataPartitions().getCount(), 0);
    Assert.assertEquals(entity.getDataPartitionPatterns().getCount(), 0);
  }

  @Test
  public void testLoadNoPartitionAbsoluteNamespaceSet() throws IOException, InterruptedException {
    String content = TestHelper.getInputFileContent(TESTS_SUBPATH, "testLoadNoPartitionAbsoluteNamespaceSet", "entities.manifest.cdm.json");
    ManifestContent manifestContent = JMapper.MAP.readValue(content, ManifestContent.class);
    CdmManifestDefinition cdmManifest = ManifestPersistence.fromObject(new ResolveContext(new CdmCorpusDefinition()), "testEntity", "testNamespace", "/", manifestContent);
    Assert.assertEquals(cdmManifest.getEntities().getCount(), 1);
    Assert.assertEquals(
        cdmManifest.getEntities().get(0).getObjectType(),
        CdmObjectType.LocalEntityDeclarationDef);
    final CdmEntityDeclarationDefinition entity = cdmManifest.getEntities().get(0);
    Assert.assertEquals(entity.getEntityName(), "Account");
    Assert.assertEquals(entity.getExplanation(), "Account explanation");
    Assert.assertEquals(entity.getEntityPath(), "testNamespace:/Account.cdm.json/Account");
    Assert.assertEquals(entity.getExhibitsTraits().getCount(), 1);
    Assert.assertEquals(entity.getDataPartitions().getCount(), 0);
    Assert.assertEquals(entity.getDataPartitionPatterns().getCount(), 0);

    ManifestContent manifestToData = ManifestPersistence.toData(cdmManifest, null, null);
    Assert.assertEquals(manifestToData.getEntities().get(0).get("entityPath").asText(), "testNamespace:/Account.cdm.json/Account");
  }
}
