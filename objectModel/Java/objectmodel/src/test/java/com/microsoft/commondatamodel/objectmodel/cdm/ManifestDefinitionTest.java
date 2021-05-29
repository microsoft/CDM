// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import org.testng.Assert;
import org.testng.annotations.Test;

public class ManifestDefinitionTest {
  /**
   * Tests if the copy function creates copies of the sub objects
   */
  @Test
  public void TestManifestCopy() {
    CdmCorpusDefinition corpus = new CdmCorpusDefinition();
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
