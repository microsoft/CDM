// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import java.io.File;

import com.microsoft.commondatamodel.objectmodel.TestHelper;

import org.testng.Assert;
import org.testng.annotations.Test;

public class ManifestDefinitionTest {
  /**
   * The path between TestDataPath and TestName.
   */
  private static final String TESTS_SUBPATH = new File("Cdm", "ManifestDefinition").toString();

  /**
   * Tests if the imports on the resolved manifest are relative to the resolved manifest location.
   */
  @Test
  public void testResolvedManifestImport() throws InterruptedException {
    CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testResolvedManifestImport");
    // Make sure that we are not picking up the default namespace while testing.
    corpus.getStorage().setDefaultNamespace("remote");

    String documentName = "localImport.cdm.json";
    CdmFolderDefinition localFolder = corpus.getStorage().fetchRootFolder("local");

    // Create a manifest that imports a document on the same folder.
    CdmManifestDefinition manifest = new CdmManifestDefinition(corpus.getCtx(), "default");
    manifest.getImports().add(documentName);
    localFolder.getDocuments().add(manifest);

    CdmDocumentDefinition document = new CdmDocumentDefinition(corpus.getCtx(), documentName);
    localFolder.getDocuments().add(document);

    // Resolve the manifest into a different folder.
    CdmManifestDefinition resolvedManifest = manifest.createResolvedManifestAsync("output:/default.manifest.cdm.json", null).join();

    // Checks if the import path on the resolved manifest points to the original location.
    Assert.assertEquals(resolvedManifest.getImports().getCount(), 1);
    Assert.assertEquals(resolvedManifest.getImports().get(0).getCorpusPath(), "local:/" + documentName);
  }

  /**
   * Tests if the copy function creates copies of the sub objects
   */
  @Test
  public void testManifestCopy() throws InterruptedException {
    CdmCorpusDefinition corpus = TestHelper.getLocalCorpus("", "testManifestCopy", null, null, null, true);
    CdmManifestDefinition manifest = new CdmManifestDefinition(corpus.getCtx(), "name");

    String entityName = "entity";
    String subManifestName = "subManifest";
    String relationshipName = "relName";
    String traitName = "traitName";

    CdmEntityDeclarationDefinition entityDec = manifest.getEntities().add(entityName);
    CdmManifestDeclarationDefinition subManifest = manifest.getSubManifests().add(subManifestName);
    CdmE2ERelationship relationship = manifest.getRelationships().add(relationshipName);
    CdmTraitReferenceBase trait = manifest.getExhibitsTraits().add(traitName);

    CdmManifestDefinition copy = (CdmManifestDefinition) manifest.copy();
    copy.getEntities().get(0).setEntityName("newEntity");
    copy.getSubManifests().get(0).setManifestName("newSubManifest");
    copy.getRelationships().get(0).setName("newRelName");
    copy.getExhibitsTraits().get(0).setNamedReference("newTraitName");

    Assert.assertEquals(entityDec.getEntityName(), entityName);
    Assert.assertEquals(subManifest.getManifestName(), subManifestName);
    Assert.assertEquals(relationship.getName(), relationshipName);
    Assert.assertEquals(trait.getNamedReference(), traitName);
  }
}
