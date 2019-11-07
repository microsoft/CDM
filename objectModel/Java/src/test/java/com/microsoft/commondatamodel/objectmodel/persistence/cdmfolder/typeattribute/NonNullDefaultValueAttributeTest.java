package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.typeattribute;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.PersistenceLayer;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.TypeAttributePersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.TypeAttribute;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import org.json.JSONException;
import org.skyscreamer.jsonassert.JSONAssert;
import org.skyscreamer.jsonassert.JSONCompareMode;
import org.testng.Assert;
import org.testng.annotations.Test;

public class NonNullDefaultValueAttributeTest {
  /**
   * Testing that default value can be converted to a JsonNode
   */
  @Test
  public void testNonNullDefaultValueAttribute() throws JSONException {
    final ArrayNode arrayNode = JsonNodeFactory.instance.arrayNode();
    final ObjectNode preferredCustomerNode = JsonNodeFactory.instance.objectNode();
    preferredCustomerNode.put("languageTag", "en");
    preferredCustomerNode.put("displayText", "Preferred Customer");
    preferredCustomerNode.put("attributeValue", "1");
    preferredCustomerNode.put("displayOrder", "0");

    final ObjectNode standardNode = JsonNodeFactory.instance.objectNode();
    standardNode.put("languageTag", "en");
    standardNode.put("displayText", "Standard");
    standardNode.put("attributeValue", "2");
    standardNode.put("displayOrder", "1");

    arrayNode.add(preferredCustomerNode);
    arrayNode.add(standardNode);

    final ObjectNode arrayNodeBean = JsonNodeFactory.instance.objectNode();
    arrayNodeBean.put("defaultValue", arrayNode);

    final JsonNode jsonInput = JMapper.MAP.convertValue(arrayNodeBean, JsonNode.class);

    // Not using PersistenceLayer directly due to restrictions in getMethod().
    // (CdmTypeAttributeDefinition) PersistenceLayer.fromData(
    //     new ResolveContext(new CdmCorpusDefinition()),
    //     jsonInput,
    //     "CdmFolder",
    //     CdmTypeAttributeDefinition.class);
    final CdmTypeAttributeDefinition cdmTypeAttributeDefinition =
        TypeAttributePersistence.fromData(
            new ResolveContext(new CdmCorpusDefinition()),
            jsonInput);

    final com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.TypeAttribute
        result = (TypeAttribute) PersistenceLayer.toData(
        cdmTypeAttributeDefinition,
        null,
        null,
        "CdmFolder",
        CdmTypeAttributeDefinition.class);

    Assert.assertNotNull(result);
    JSONAssert.assertEquals(
        jsonInput.get("defaultValue").asText(),
        result.getDefaultValue().asText(),
        JSONCompareMode.NON_EXTENSIBLE);
  }
}
