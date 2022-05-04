// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.cdmcollection;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.utilities.Constants;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;

import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.testng.Assert;
import org.testng.annotations.Test;

public class CdmTraitCollectionTest {
  @Test
   public void testCdmTraitCollectionAdd() throws InterruptedException {
    final CdmManifestDefinition manifest = CdmCollectionHelperFunctions.generateManifest();

    final CdmTraitDefinition trait = new CdmTraitDefinition(
        manifest.getCtx(),
        "TraitName",
        null);
    final CdmTraitDefinition otherTrait = new CdmTraitDefinition(
        manifest.getCtx(),
        "Name of other Trait",
        null);

    manifest.setTraitCache(new LinkedHashMap<>());

    final CdmTraitReference addedTrait = manifest.getExhibitsTraits().add(trait);
    final CdmTraitReference addedOtherTrait = manifest.getExhibitsTraits().add(otherTrait);
    final List<Pair<String, Object>> listOfArgs = Arrays.asList(new ImmutablePair<>(Constants.IncrementalPatternParameterName, "test"), new ImmutablePair<>("fullDataPartitionPatternName", "name"));
    final CdmTraitReference addedIncrementalTrait = (CdmTraitReference) manifest.getExhibitsTraits().add(Constants.IncrementalTraitName, listOfArgs);

    Assert.assertNull(manifest.getTraitCache());
    Assert.assertEquals(manifest.getExhibitsTraits().size(), 3);
    Assert.assertEquals(manifest.getExhibitsTraits().get(0).getExplicitReference(), trait);
    Assert.assertEquals(manifest.getExhibitsTraits().get(1).getExplicitReference(), otherTrait);
    Assert.assertEquals(manifest.getExhibitsTraits().get(0), addedTrait);
    Assert.assertEquals(manifest.getExhibitsTraits().get(1), addedOtherTrait);
    Assert.assertEquals(manifest.getExhibitsTraits().get(2), addedIncrementalTrait);
    Assert.assertEquals(((CdmTraitReference)manifest.getExhibitsTraits().get(2)).getArguments().size(), 2);
    Assert.assertEquals(((CdmTraitReference)manifest.getExhibitsTraits().get(2)).getArguments().fetchValue(Constants.IncrementalPatternParameterName), "test");
    Assert.assertEquals(((CdmTraitReference)manifest.getExhibitsTraits().get(2)).getArguments().fetchValue("fullDataPartitionPatternName"), "name");

    Assert.assertEquals(manifest, manifest.getExhibitsTraits().get(0).getOwner());
  }

  @Test
  public void TestCdmTraitCollectionInsert() throws InterruptedException {
    final CdmManifestDefinition manifest = CdmCollectionHelperFunctions.generateManifest();

    final CdmTraitReference trait =
        new CdmTraitReference(manifest.getCtx(), "TraitName", false, false);
    final CdmTraitReference otherTrait =
        new CdmTraitReference(manifest.getCtx(), "Name of other Trait", false, false);

    manifest.setTraitCache(new LinkedHashMap<>());

    manifest.getExhibitsTraits().add(0, trait);
    manifest.getExhibitsTraits().add(0, otherTrait);

    Assert.assertNull(manifest.getTraitCache());
    Assert.assertEquals(2, manifest.getExhibitsTraits().getCount());
    Assert.assertEquals(otherTrait, manifest.getExhibitsTraits().get(0));
    Assert.assertEquals(trait, manifest.getExhibitsTraits().get(1));

    Assert.assertEquals(manifest, manifest.getExhibitsTraits().get(0).getOwner());
  }

  @Test
  public void testCdmTraitCollectionAddAll() throws InterruptedException {
    final CdmManifestDefinition manifest = CdmCollectionHelperFunctions.generateManifest();
    final CdmTraitDefinition trait =
        new CdmTraitDefinition(manifest.getCtx(), "TraitName", null);
    final CdmTraitDefinition otherTrait =
        new CdmTraitDefinition(manifest.getCtx(), "Name of other Trait", null);

    final List<CdmTraitDefinition> traitList = Arrays.asList(trait, otherTrait);

    manifest.getExhibitsTraits().addAll(traitList);

    Assert.assertEquals(2, manifest.getExhibitsTraits().size());
    Assert.assertEquals(trait, manifest.getExhibitsTraits().get(0).getExplicitReference());
    Assert.assertEquals(otherTrait, manifest.getExhibitsTraits().get(1).getExplicitReference());

    Assert.assertEquals(manifest, manifest.getExhibitsTraits().get(0).getOwner());
  }

  @Test
  public void testCdmTraitCollectionRemove() throws InterruptedException {
    final CdmManifestDefinition manifest = CdmCollectionHelperFunctions.generateManifest();

    final CdmTraitDefinition trait =
        new CdmTraitDefinition(manifest.getCtx(), "TraitName", null);
    final CdmTraitDefinition otherTrait =
        new CdmTraitDefinition(manifest.getCtx(), "Name of other Trait", null);

    manifest.getExhibitsTraits().add(trait);
    manifest.getExhibitsTraits().add(otherTrait);

    Assert.assertEquals(2, manifest.getExhibitsTraits().size());
    manifest.setTraitCache(new LinkedHashMap<>());
    boolean removed = manifest.getExhibitsTraits().remove(trait);
    Assert.assertTrue(removed);
    Assert.assertEquals(1, manifest.getExhibitsTraits().size());
    Assert.assertNull(manifest.getTraitCache());

    // try to remove a second time.
    removed = manifest.getExhibitsTraits().remove(trait);
    Assert.assertFalse(removed);
    Assert.assertEquals(1, manifest.getExhibitsTraits().size());
    Assert.assertEquals(otherTrait, manifest.getExhibitsTraits().get(0).getExplicitReference());

    removed = manifest.getExhibitsTraits().remove("Name of other Trait");
    Assert.assertTrue(removed);
    Assert.assertEquals(0, manifest.getExhibitsTraits().size());

    manifest.getExhibitsTraits().add(trait);
    Assert.assertEquals(1, manifest.getExhibitsTraits().size());

    removed = manifest.getExhibitsTraits().remove(manifest.getExhibitsTraits().get(0));
    Assert.assertTrue(removed);
    Assert.assertEquals(0, manifest.getExhibitsTraits().size());
  }

  @Test
  public void testCdmTraitCollectionRemoveAt() throws InterruptedException {
    final CdmManifestDefinition manifest = CdmCollectionHelperFunctions.generateManifest();

    final CdmTraitDefinition trait = new CdmTraitDefinition(manifest.getCtx(), "TraitName", null);
    final CdmTraitDefinition otherTrait = new CdmTraitDefinition(manifest.getCtx(), "Name of other Trait", null);

    manifest.getExhibitsTraits().add(trait);
    manifest.getExhibitsTraits().add(otherTrait);

    manifest.getExhibitsTraits().remove(trait);
    Assert.assertNull(manifest.getTraitCache());

    manifest.getExhibitsTraits().add(trait);
    manifest.getExhibitsTraits().removeAt(1);
//    Assert.assertNull(manifest.TraitCache);
    Assert.assertEquals(1, manifest.getExhibitsTraits().size());
    Assert.assertEquals(otherTrait, manifest.getExhibitsTraits().get(0).getExplicitReference());
  }

  @Test
  public void testCdmTraitCollectionIndexOf() throws InterruptedException {
    final CdmManifestDefinition manifest = CdmCollectionHelperFunctions.generateManifest();

    final CdmTraitDefinition trait =
        new CdmTraitDefinition(manifest.getCtx(), "TraitName", null);
    final CdmTraitDefinition otherTrait =
        new CdmTraitDefinition(manifest.getCtx(), "Name of other Trait", null);

    manifest.getExhibitsTraits().add(trait);
    manifest.getExhibitsTraits().add(otherTrait);

    int index = manifest.getExhibitsTraits().indexOf(trait);
    Assert.assertEquals(0, index);
    index = manifest.getExhibitsTraits().indexOf(otherTrait);
    Assert.assertEquals(1, index);

    index = manifest.getExhibitsTraits().indexOf(manifest.getExhibitsTraits().get(0));
    Assert.assertEquals(0, index);
    index = manifest.getExhibitsTraits().indexOf(manifest.getExhibitsTraits().get(1));
    Assert.assertEquals(1, index);

    index = manifest.getExhibitsTraits().indexOf("TraitName");
    Assert.assertEquals(0, index);
    index = manifest.getExhibitsTraits().indexOf("Name of other Trait");
    Assert.assertEquals(1, index);
  }

  @Test
  public void CdmTraitCollectionRemoveOnlyFromProperty() throws InterruptedException {
    final CdmManifestDefinition manifest = CdmCollectionHelperFunctions.generateManifest();

    final CdmTraitReference trait =
        new CdmTraitReference(manifest.getCtx(), "TraitName", false, false);
    final CdmTraitReference otherTrait =
        new CdmTraitReference(manifest.getCtx(), "Name of other Trait", false, false);

    manifest.getExhibitsTraits().add(trait);
    manifest.getExhibitsTraits().add(otherTrait);

    Assert.assertFalse(trait.isFromProperty());
    Assert.assertFalse(otherTrait.isFromProperty());

    Assert.assertEquals(2, manifest.getExhibitsTraits().size());
    boolean removed = manifest.getExhibitsTraits().remove(trait, true);
    Assert.assertFalse(removed);
    Assert.assertEquals(2, manifest.getExhibitsTraits().size());

    otherTrait.setFromProperty(true);

    removed = manifest.getExhibitsTraits().remove(otherTrait, true);
    Assert.assertTrue(removed);
    Assert.assertEquals(1, manifest.getExhibitsTraits().size());
    Assert.assertEquals(trait, manifest.getExhibitsTraits().get(0));
  }

  @Test
  public void CdmTraitCollectionRemovePrioritizeFromProperty() throws InterruptedException {
    final CdmManifestDefinition manifest = CdmCollectionHelperFunctions.generateManifest();

    final CdmTraitReference trait =
        new CdmTraitReference(manifest.getCtx(), "TraitName", false, false);
    final CdmTraitReference otherTrait =
        new CdmTraitReference(manifest.getCtx(), "Name of other Trait", false, false);

    manifest.getExhibitsTraits().add(trait);
    manifest.getExhibitsTraits().add(otherTrait);

    final CdmTraitReference traitCopyFromProperty =
        new CdmTraitReference(manifest.getCtx(), "TraitName", false, false);
    traitCopyFromProperty.setFromProperty(true);
    manifest.getExhibitsTraits().add(traitCopyFromProperty);

    Assert.assertFalse(trait.isFromProperty());
    Assert.assertFalse(otherTrait.isFromProperty());
    Assert.assertTrue(traitCopyFromProperty.isFromProperty());

    Assert.assertEquals(3, manifest.getExhibitsTraits().size());
    final boolean removed = manifest.getExhibitsTraits().remove("TraitName");
    Assert.assertTrue(removed);
    Assert.assertEquals(2, manifest.getExhibitsTraits().size());
    Assert.assertEquals(trait, manifest.getExhibitsTraits().get(0));
    Assert.assertEquals(otherTrait, manifest.getExhibitsTraits().get(1));
  }

  @Test
  public void testCdmTraitCollectionRemoveTraitDefinitionPrioritizeFromProperty() throws InterruptedException {
    final CdmManifestDefinition manifest = CdmCollectionHelperFunctions.generateManifest();
    final CdmTraitDefinition trait =
        new CdmTraitDefinition(manifest.getCtx(), "TraitName", null);
    final CdmTraitDefinition otherTrait =
        new CdmTraitDefinition(manifest.getCtx(), "Name of other Trait", null);

    manifest.getExhibitsTraits().add(trait);
    manifest.getExhibitsTraits().add(otherTrait);
    manifest.getExhibitsTraits().add(trait);
    ((CdmTraitReference) manifest.getExhibitsTraits().get(2)).setFromProperty(true);
    manifest.getExhibitsTraits().add(otherTrait);
    manifest.getExhibitsTraits().add(trait);
    ((CdmTraitReference) manifest.getExhibitsTraits().get(4)).setFromProperty(true);
    manifest.getExhibitsTraits().add(otherTrait);
    Assert.assertEquals(6, manifest.getExhibitsTraits().size());

    Assert.assertTrue(((CdmTraitReference) manifest.getExhibitsTraits().get(2)).isFromProperty());

    final boolean removed = manifest.getExhibitsTraits().remove(trait);
    Assert.assertEquals(
        "TraitName",
        (((CdmTraitDefinition) manifest.getExhibitsTraits().get(0).getExplicitReference()))
            .getTraitName());
    Assert.assertEquals(
        "Name of other Trait",
        (((CdmTraitDefinition) manifest.getExhibitsTraits().get(2).getExplicitReference()))
            .getTraitName());
    Assert.assertEquals(
        "TraitName",
        (((CdmTraitDefinition) manifest.getExhibitsTraits().get(3).getExplicitReference()))
            .getTraitName());
  }

  @Test
  public void testCdmTraitCollectionIndexOfOnlyFromProperty() throws InterruptedException {
    final CdmManifestDefinition manifest = CdmCollectionHelperFunctions.generateManifest();

    final CdmTraitDefinition trait =
        new CdmTraitDefinition(manifest.getCtx(), "TraitName", null);
    final CdmTraitDefinition otherTrait =
        new CdmTraitDefinition(manifest.getCtx(), "Name of other Trait", null);

    manifest.getExhibitsTraits().add(trait);
    manifest.getExhibitsTraits().add(otherTrait);

    Assert.assertFalse(((CdmTraitReference) manifest.getExhibitsTraits().get(0)).isFromProperty());
    Assert.assertFalse(((CdmTraitReference) manifest.getExhibitsTraits().get(1)).isFromProperty());

    int index = manifest.getExhibitsTraits().indexOf(trait.getTraitName(), true);
    Assert.assertEquals(-1, index);

    manifest.getExhibitsTraits().add(trait);
    manifest.getExhibitsTraits().add(otherTrait);
    manifest.getExhibitsTraits().add(trait);
    manifest.getExhibitsTraits().add(otherTrait);

    Assert.assertEquals(6, manifest.getExhibitsTraits().size());
    ((CdmTraitReference) manifest.getExhibitsTraits().get(2)).setFromProperty(true);
    index = manifest.getExhibitsTraits().indexOf(trait.getTraitName(), true);
    Assert.assertEquals(2, index);
    index = manifest.getExhibitsTraits().indexOf(trait.getTraitName());
    Assert.assertEquals(2, index);
  }

  @Test
  public void cdmTraitCollectionClear() throws InterruptedException {
    final CdmManifestDefinition manifest = CdmCollectionHelperFunctions.generateManifest();

    new CdmTraitReference(manifest.getCtx(), "TraitName", false, false);
    new CdmTraitReference(manifest.getCtx(), "Name of other Trait", false, false);

    manifest.getExhibitsTraits().add("trait1");
    manifest.getExhibitsTraits().add("trait2");
    manifest.setTraitCache(new LinkedHashMap<>());

    manifest.getExhibitsTraits().clear();
    Assert.assertEquals(0, manifest.getExhibitsTraits().getCount());
    Assert.assertNull(manifest.getTraitCache());
  }
}
