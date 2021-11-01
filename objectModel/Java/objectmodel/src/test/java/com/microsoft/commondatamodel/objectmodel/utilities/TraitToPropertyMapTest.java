// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmDataFormat;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmPropertyName;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import org.testng.Assert;
import org.testng.annotations.Test;

public class TraitToPropertyMapTest {

  private static String testsSubpath = new File("Utilities", "TraitToPropertyMap").toString();
  
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

  /**
   * Test update and fetch list lookup default value without attributeValue and displayOrder.
   */
  @Test
  public void testUpdateAndFetchListLookup() {
    final CdmCorpusDefinition corpus = new CdmCorpusDefinition();
    final CdmTypeAttributeDefinition cdmAttribute = new CdmTypeAttributeDefinition(corpus.getCtx(), "SomeAttribute");
    final TraitToPropertyMap traitToPropertyMap = new TraitToPropertyMap(cdmAttribute);

    ObjectMapper mapper = new ObjectMapper();
    final ArrayNode constantValues = mapper.createArrayNode();
    ObjectNode value = mapper.createObjectNode();
    value.put("languageTag", "en");
    value.put("displayText", "Fax");
    
    constantValues.add(value);

    traitToPropertyMap.updatePropertyValue(CdmPropertyName.DEFAULT, constantValues);
    List<Map<String, String>> result = (List<Map<String, String>>)traitToPropertyMap.fetchPropertyValue(CdmPropertyName.DEFAULT);

    Assert.assertEquals(1, result.size());
    Assert.assertEquals("en", result.get(0).get("languageTag"));
    Assert.assertEquals("Fax", result.get(0).get("displayText"));
    Assert.assertNull(result.get(0).get("attributeValue"));
    Assert.assertNull(result.get(0).get("displayOrder"));
  }

  /**
   * Test setting and getting of data format
   */
  @Test
  public void TestDataFormat() {
    final CdmCorpusDefinition corpus = new CdmCorpusDefinition();
    final CdmTypeAttributeDefinition att = corpus.<CdmTypeAttributeDefinition>makeObject(CdmObjectType.TypeAttributeDef, "att");

    for (CdmDataFormat format : CdmDataFormat.values()) {
      att.updateDataFormat(format);
      Assert.assertEquals(att.fetchDataFormat(), format);
    }
  }

  /**
   * Test fetch primary key.
   */
  @Test
  public void testFetchPrimaryKey() {
      try {
          CdmCorpusDefinition cdmCorpus = TestHelper.getLocalCorpus(testsSubpath, "TestFetchPrimaryKey");
          CdmDocumentDefinition doc = cdmCorpus
                  .<CdmDocumentDefinition>fetchObjectAsync("Account.cdm.json").join();

          if (doc == null) {
            Assert.fail("Unable to load manifest Account.cdm.json. Please inspect error log for additional details.");
          }

          CdmEntityDefinition entity = (CdmEntityDefinition)doc.getDefinitions().get(0);
          try {
            String pk = entity.getPrimaryKey();
          } catch (Exception e) {
            Assert.fail("Exception occur while reading primary key for entity ."
                + e.getMessage());
          }
      } catch (InterruptedException e) {
          Assert.fail(e.getMessage());
      }
  }
}
