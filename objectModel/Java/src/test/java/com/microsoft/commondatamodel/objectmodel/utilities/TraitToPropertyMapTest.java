package com.microsoft.commondatamodel.objectmodel.utilities;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmDataFormat;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import org.testng.Assert;
import org.testng.annotations.Test;

public class TraitToPropertyMapTest {
  /**
   * Test trait to data format when unknown data format trait is in an attribute.
   */
  @Test
  public void testTraitToUnknownDataFormat() {
    final CdmTypeAttributeDefinition cdmAttribute =
        new CdmTypeAttributeDefinition(
            new ResolveContext(new CdmCorpusDefinition()),
            "SomeAttribute");
    cdmAttribute.getAppliedTraits().add("is.dataFormat.someRandomDataFormat");
    final TraitToPropertyMap traitToPropertyMap = new TraitToPropertyMap(cdmAttribute);

    final String dataFormat = traitToPropertyMap.traitsToDataFormat(false);

    Assert.assertEquals(CdmDataFormat.Unknown.toString(), dataFormat);
  }

  /**
   * Test trait to data format when calculated data format should be JSON.
   */
  @Test
  public void testTraitToJsonDataFormat() {
    final CdmTypeAttributeDefinition cdmAttribute =
        new CdmTypeAttributeDefinition(
            new ResolveContext(new CdmCorpusDefinition()),
            "SomeAttribute");
    cdmAttribute.getAppliedTraits().add("is.dataFormat.array");
    cdmAttribute.getAppliedTraits().add("means.content.text.JSON");
    final TraitToPropertyMap traitToPropertyMap = new TraitToPropertyMap(cdmAttribute);

    final String dataFormat = traitToPropertyMap.traitsToDataFormat(false);

    Assert.assertEquals(CdmDataFormat.Json.toString(), dataFormat);
  }
}
