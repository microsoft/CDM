package com.microsoft.commondatamodel.objectmodel.cdm.cdmcollection;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmArgumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import java.util.ArrayList;
import java.util.List;
import org.testng.Assert;
import org.testng.annotations.Test;

public class CdmArgumentCollectionTest {
  @Test
  public void testCdmArgumentCollectionAdd() {
    final CdmTraitReference trait = generateTrait();

    final CdmArgumentDefinition argumentDefinition = new CdmArgumentDefinition(null, null);

    trait.setResolvedArguments(true);
    Assert.assertEquals(0, trait.getArguments().size());
    final CdmArgumentDefinition addedArgument = trait.getArguments().add(argumentDefinition);
    Assert.assertEquals(argumentDefinition, addedArgument);
    Assert.assertEquals(1, trait.getArguments().size());
    Assert.assertEquals(argumentDefinition, trait.getArguments().get(0));
    Assert.assertFalse(trait.isResolvedArguments());
    Assert.assertEquals(trait, trait.getArguments().get(0).getOwner());

    trait.setResolvedArguments(true);
    trait.getArguments().add("nameOfTrait", "ValueOfTrait");
    Assert.assertEquals(2, trait.getArguments().size());
    Assert.assertEquals("nameOfTrait", trait.getArguments().get(1).getName());
    Assert.assertEquals("ValueOfTrait", trait.getArguments().get(1).getValue());
    Assert.assertEquals(trait, trait.getArguments().get(1).getOwner());
  }

  @Test
  public void testCdmArgumentCollectionInsert() {
    final CdmTraitReference trait = generateTrait();

    final CdmArgumentDefinition toInsert = new CdmArgumentDefinition(null, null);

    final CdmArgumentDefinition arg1 = trait.getArguments().add("arg1");
    final CdmArgumentDefinition arg2 = trait.getArguments().add("arg2");

    trait.setResolvedArguments(true);

    trait.getArguments().add(1, toInsert);
    Assert.assertEquals(3, trait.getArguments().getCount());
    Assert.assertFalse(trait.isResolvedArguments());
    Assert.assertEquals(arg1, trait.getArguments().get(0));
    Assert.assertEquals(toInsert, trait.getArguments().get(1));
    Assert.assertEquals(arg2, trait.getArguments().get(2));
    Assert.assertEquals(trait, trait.getArguments().get(1).getOwner());
  }

  @Test
  public void testCdmArgumentCollectionAddAll() {
    final CdmTraitReference trait = generateTrait();
    trait.setResolvedArguments(true);
    final List<CdmArgumentDefinition> argList = new ArrayList<>();
    CdmArgumentDefinition argumentDefinition = new CdmArgumentDefinition(null, null);
    argumentDefinition.setName("Arg1");
    argumentDefinition.setValue(123);

    argList.add(argumentDefinition);
    final CdmManifestDefinition valOfArg2 =
        CdmCollectionHelperFunctions.generateManifest("C:/Nothing");
    argumentDefinition = new CdmArgumentDefinition(null, null);
    argumentDefinition.setName("Arg2");
    argumentDefinition.setValue(valOfArg2);

    argList.add(argumentDefinition);

    trait.getArguments().addAll(argList);

    Assert.assertEquals(2, trait.getArguments().size());
    Assert.assertFalse(trait.isResolvedArguments());
    Assert.assertEquals("Arg1", trait.getArguments().get(0).getName());
    Assert.assertEquals(123, trait.getArguments().get(0).getValue());
    Assert.assertEquals(trait, trait.getArguments().get(0).getOwner());
    Assert.assertEquals("Arg2", trait.getArguments().get(1).getName());
    Assert.assertEquals(valOfArg2, trait.getArguments().get(1).getValue());
  }

  @Test
  public void testCdmArgumentCollectionFetchValueOrOnlyValue() {
    final CdmTraitReference trait = generateTrait();

    trait.setResolvedArguments(true);
    trait.getArguments().add(null, "ValueOfTrait");

    Object value = trait.getArguments().fetchValue("NameOfTrait");
    // This is what is needed by current code.
    Assert.assertEquals("ValueOfTrait", value);

    final CdmArgumentDefinition argumentDefinition = new CdmArgumentDefinition(null, null);

    trait.setResolvedArguments(true);
    trait.getArguments().add(argumentDefinition);

    trait.setResolvedArguments(true);
    trait.getArguments().add("TraitName", "Value of a named trait");

    value = trait.getArguments().fetchValue("TraitName");
    Assert.assertEquals("Value of a named trait", value);
  }

  @Test
  public void testCdmArgumentCollectionUpdateArgument() {
    final CdmTraitReference trait = generateTrait();

    trait.getArguments().add("nameOfTrait", "ValueOfTrait");
    trait.getArguments().add("nameOfOtherTrait", "ValueOfOtherTrait");

    trait.getArguments().updateArgument("nameOfOtherTrait", "UpdatedValue");
    trait.getArguments().updateArgument("ThirdArgumentName", "ThirdArgumentValue");

    Assert.assertEquals(3, trait.getArguments().size());
    Assert.assertEquals("ValueOfTrait", trait.getArguments().get(0).getValue());
    Assert.assertEquals("UpdatedValue", trait.getArguments().get(1).getValue());
    Assert.assertEquals("ThirdArgumentName", trait.getArguments().get(2).getName());
    Assert.assertEquals("ThirdArgumentValue", trait.getArguments().get(2).getValue());
    Assert.assertEquals(trait, trait.getArguments().get(2).getOwner());
  }

  private CdmTraitReference generateTrait() {
    final CdmManifestDefinition manifest = CdmCollectionHelperFunctions.generateManifest("C:\\Nothing");
    return new CdmTraitReference(manifest.getCtx(), "traitName", false, false);
  }
}
