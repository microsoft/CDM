package com.microsoft.commondatamodel.objectmodel.cdm.cdmcollection;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import org.testng.Assert;
import org.testng.annotations.Test;

public class CdmTraitCollectionTest {
  @Test
  public void testCdmTraitCollectionAdd() {
    final CdmManifestDefinition manifest =
        CdmCollectionHelperFunctions.generateManifest("C:/Root/Path");

    final CdmTraitDefinition trait = new CdmTraitDefinition(
        manifest.getCtx(),
        "TraitName",
        null);
    final CdmTraitDefinition otherTrait = new CdmTraitDefinition(
        manifest.getCtx(),
        "Name of other Trait",
        null);

    manifest.setTraitCache(new HashMap<>());

    final CdmTraitReference addedTrait = manifest.getExhibitsTraits().add(trait);
    final CdmTraitReference addedOtherTrait = manifest.getExhibitsTraits().add(otherTrait);

    Assert.assertNull(manifest.getTraitCache());
    Assert.assertEquals(2, manifest.getExhibitsTraits().size());
    Assert.assertEquals(trait, manifest.getExhibitsTraits().get(0).getExplicitReference());
    Assert.assertEquals(otherTrait, manifest.getExhibitsTraits().get(1).getExplicitReference());
    Assert.assertEquals(addedTrait, manifest.getExhibitsTraits().get(0));
    Assert.assertEquals(addedOtherTrait, manifest.getExhibitsTraits().get(1));

    Assert.assertEquals(manifest, manifest.getExhibitsTraits().get(0).getOwner());
  }

  @Test
  public void TestCdmTraitCollectionInsert() {
    final CdmManifestDefinition manifest =
        CdmCollectionHelperFunctions.generateManifest("C:/Root/Path");

    final CdmTraitReference trait =
        new CdmTraitReference(manifest.getCtx(), "TraitName", false, false);
    final CdmTraitReference otherTrait =
        new CdmTraitReference(manifest.getCtx(), "Name of other Trait", false, false);

    manifest.setTraitCache(new HashMap<>());

    manifest.getExhibitsTraits().add(0, trait);
    manifest.getExhibitsTraits().add(0, otherTrait);

    Assert.assertNull(manifest.getTraitCache());
    Assert.assertEquals(2, manifest.getExhibitsTraits().getCount());
    Assert.assertEquals(otherTrait, manifest.getExhibitsTraits().get(0));
    Assert.assertEquals(trait, manifest.getExhibitsTraits().get(1));

    Assert.assertEquals(manifest, manifest.getExhibitsTraits().get(0).getOwner());
  }

  @Test
  public void testCdmTraitCollectionAddAll() {
    final CdmManifestDefinition manifest =
        CdmCollectionHelperFunctions.generateManifest("C:/Root/Path");
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
  public void testCdmTraitCollectionRemove() {
    final CdmManifestDefinition manifest =
        CdmCollectionHelperFunctions.generateManifest("C:/Root/Path");

    final CdmTraitDefinition trait =
        new CdmTraitDefinition(manifest.getCtx(), "TraitName", null);
    final CdmTraitDefinition otherTrait =
        new CdmTraitDefinition(manifest.getCtx(), "Name of other Trait", null);

    manifest.getExhibitsTraits().add(trait);
    manifest.getExhibitsTraits().add(otherTrait);

    Assert.assertEquals(2, manifest.getExhibitsTraits().size());
    manifest.setTraitCache(new HashMap<>());
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
  public void testCdmTraitCollectionRemoveAt() {
    final CdmManifestDefinition manifest = CdmCollectionHelperFunctions.generateManifest("C:\\Root\\Path");

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
  public void testCdmTraitCollectionIndexOf() {
    final CdmManifestDefinition manifest =
        CdmCollectionHelperFunctions.generateManifest("C:/Root/Path");

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
  public void CdmTraitCollectionRemoveOnlyFromProperty() {
    final CdmManifestDefinition manifest =
        CdmCollectionHelperFunctions.generateManifest("C:/Root/Path");

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
  public void CdmTraitCollectionRemovePrioritizeFromProperty() {
    final CdmManifestDefinition manifest =
        CdmCollectionHelperFunctions.generateManifest("C:/Root/Path");

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
  public void testCdmTraitCollectionRemoveTraitDefinitionPrioritizeFromProperty() {
    final CdmManifestDefinition manifest =
        CdmCollectionHelperFunctions.generateManifest("C:/Root/Path");
    final CdmTraitDefinition trait =
        new CdmTraitDefinition(manifest.getCtx(), "TraitName", null);
    final CdmTraitDefinition otherTrait =
        new CdmTraitDefinition(manifest.getCtx(), "Name of other Trait", null);

    manifest.getExhibitsTraits().add(trait);
    manifest.getExhibitsTraits().add(otherTrait);
    manifest.getExhibitsTraits().add(trait);
    manifest.getExhibitsTraits().get(2).setFromProperty(true);
    manifest.getExhibitsTraits().add(otherTrait);
    manifest.getExhibitsTraits().add(trait);
    manifest.getExhibitsTraits().get(4).setFromProperty(true);
    manifest.getExhibitsTraits().add(otherTrait);
    Assert.assertEquals(6, manifest.getExhibitsTraits().size());

    Assert.assertTrue(manifest.getExhibitsTraits().get(2).isFromProperty());

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
  public void testCdmTraitCollectionIndexOfOnlyFromProperty() {
    final CdmManifestDefinition manifest =
        CdmCollectionHelperFunctions.generateManifest("C:/Root/Path");

    final CdmTraitDefinition trait =
        new CdmTraitDefinition(manifest.getCtx(), "TraitName", null);
    final CdmTraitDefinition otherTrait =
        new CdmTraitDefinition(manifest.getCtx(), "Name of other Trait", null);

    manifest.getExhibitsTraits().add(trait);
    manifest.getExhibitsTraits().add(otherTrait);

    Assert.assertFalse(manifest.getExhibitsTraits().get(0).isFromProperty());
    Assert.assertFalse(manifest.getExhibitsTraits().get(1).isFromProperty());

    int index = manifest.getExhibitsTraits().indexOf(trait.getTraitName(), true);
    Assert.assertEquals(-1, index);

    manifest.getExhibitsTraits().add(trait);
    manifest.getExhibitsTraits().add(otherTrait);
    manifest.getExhibitsTraits().add(trait);
    manifest.getExhibitsTraits().add(otherTrait);

    Assert.assertEquals(6, manifest.getExhibitsTraits().size());
    manifest.getExhibitsTraits().get(2).setFromProperty(true);
    index = manifest.getExhibitsTraits().indexOf(trait.getTraitName(), true);
    Assert.assertEquals(index, 2);
    index = manifest.getExhibitsTraits().indexOf(trait.getTraitName());
    Assert.assertEquals(index, 2);
  }

  @Test
  public void cdmTraitCollectionClear() {
    final CdmManifestDefinition manifest = CdmCollectionHelperFunctions.generateManifest("C:/Root/Path");

    final CdmTraitReference trait =
        new CdmTraitReference(manifest.getCtx(), "TraitName", false, false);
    final CdmTraitReference otherTrait =
        new CdmTraitReference(manifest.getCtx(), "Name of other Trait", false, false);

    manifest.getExhibitsTraits().add("trait1");
    manifest.getExhibitsTraits().add("trait2");
    manifest.setTraitCache(new HashMap<>());

    manifest.getExhibitsTraits().clear();
    Assert.assertEquals(0, manifest.getExhibitsTraits().getCount());
    Assert.assertNull(manifest.getTraitCache());
  }
}
