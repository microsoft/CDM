// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.typeattribute;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.microsoft.commondatamodel.objectmodel.TestHelper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeGroupDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeGroupReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmConstantEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitCollection;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmDataFormat;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.enums.CdmStatusLevel;
import com.microsoft.commondatamodel.objectmodel.enums.ImportsLoadStrategy;
import com.microsoft.commondatamodel.objectmodel.persistence.PersistenceLayer;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.EntityPersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.TypeAttributePersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.Argument;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.Entity;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.TypeAttribute;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.TraitReferenceDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.EntityReferenceDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ConstantEntity;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolveContext;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import com.microsoft.commondatamodel.objectmodel.utilities.EventCallback;
import com.microsoft.commondatamodel.objectmodel.utilities.JMapper;
import com.microsoft.commondatamodel.objectmodel.utilities.ResolveOptions;
import java.io.File;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutionException;

import org.json.JSONException;
import org.skyscreamer.jsonassert.JSONAssert;
import org.skyscreamer.jsonassert.JSONCompareMode;
import org.testng.Assert;
import org.testng.annotations.Test;

public class TypeAttributeTest {
  /**
   * The path between TestDataPath and TestName.
   */
  private static final String TESTS_SUBPATH =
      new File(new File(
          "persistence",
          "cdmfolder"),
          "typeattribute")
          .toString();

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
        PersistenceLayer.cdmFolder,
        CdmTypeAttributeDefinition.class);

    Assert.assertNotNull(result);
    JSONAssert.assertEquals(
        jsonInput.get("defaultValue").asText(),
        result.getDefaultValue().asText(),
        JSONCompareMode.NON_EXTENSIBLE);
  }
  
  /**
   * Testing that "isPrimaryKey" property value is correct when reading from an unresolved and resolved entity schema.
   */
  @Test
  public void testReadingIsPrimaryKey() throws InterruptedException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testReadingIsPrimaryKey", null);

    final ResolveOptions resOpt = new ResolveOptions();
    resOpt.setImportsLoadStrategy(ImportsLoadStrategy.Load);
    // Read from an unresolved entity schema.
    final CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/TeamMembership.cdm.json/TeamMembership", null, resOpt).join();
    final CdmAttributeGroupReference attributeGroupRef = (CdmAttributeGroupReference) entity.getAttributes().get(0);
    final CdmAttributeGroupDefinition attributeGroup = (CdmAttributeGroupDefinition) attributeGroupRef.getExplicitReference();
    final CdmTypeAttributeDefinition typeAttribute = (CdmTypeAttributeDefinition) attributeGroup.getMembers().get(0);

    Assert.assertTrue(typeAttribute.fetchIsPrimaryKey());

    // Check that the trait "is.identifiedBy" is created with the correct argument.
    CdmTraitReference isIdentifiedBy1 = typeAttribute.getAppliedTraits().get(1);
    Assert.assertEquals(isIdentifiedBy1.getNamedReference(), "is.identifiedBy");
    Assert.assertEquals(isIdentifiedBy1.getArguments().get(0).getValue(), "TeamMembership/(resolvedAttributes)/teamMembershipId");

    // Read from a resolved entity schema.
    final CdmEntityDefinition resolvedEntity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/TeamMembership_Resolved.cdm.json/TeamMembership", null, resOpt).join();
    final CdmTypeAttributeDefinition resolvedTypeAttribute = (CdmTypeAttributeDefinition) resolvedEntity.getAttributes().get(0);

    Assert.assertTrue(resolvedTypeAttribute.fetchIsPrimaryKey());

    // Check that the trait "is.identifiedBy" is created with the correct argument.
    CdmTraitReference isIdentifiedBy2 = resolvedTypeAttribute.getAppliedTraits().get(6);
    Assert.assertEquals(isIdentifiedBy2.getNamedReference(), "is.identifiedBy");

    CdmAttributeReference argumentValue = (CdmAttributeReference) isIdentifiedBy2.getArguments().get(0).getValue();
    Assert.assertEquals(argumentValue.getNamedReference(), "TeamMembership/(resolvedAttributes)/teamMembershipId");
  }

  /**
   * Testing that "isPrimaryKey" property is set to true when "purpose" = "identifiedBy".
   */
  @Test
  public void testReadingIsPrimaryKeyConstructedFromPurpose() throws InterruptedException {
    final String testInputPath = TestHelper.getInputFolderPath(TESTS_SUBPATH, "testReadingIsPrimaryKeyConstructedFromPurpose");
    final CdmCorpusDefinition corpus = new CdmCorpusDefinition();
    corpus.getStorage().mount("local", new LocalAdapter(testInputPath));
    corpus.getStorage().setDefaultNamespace("local");

    // Read from an unresolved entity schema.
    final CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/TeamMembership.cdm.json/TeamMembership").join();
    final CdmAttributeGroupReference attributeGroupRef = (CdmAttributeGroupReference) entity.getAttributes().get(0);
    final CdmAttributeGroupDefinition attributeGroup = (CdmAttributeGroupDefinition) attributeGroupRef.getExplicitReference();
    final CdmTypeAttributeDefinition typeAttribute = (CdmTypeAttributeDefinition) attributeGroup.getMembers().get(0);

    Assert.assertEquals(typeAttribute.getPurpose().getNamedReference(), "identifiedBy");
    Assert.assertTrue(typeAttribute.fetchIsPrimaryKey());
  }

  /**
   * Testing fromData and toData correctly handles all properties
   */
  @Test
  public void testPropertyPersistence() throws InterruptedException, ExecutionException, JsonProcessingException {
    final ObjectMapper mapper = new ObjectMapper();
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "TestPropertyPersistence", null);

    HashMap<String, String> functionParameters = new HashMap<>();
    final EventCallback callback = (CdmStatusLevel statusLevel, String message1) -> {
      functionParameters.put("functionWasCalled", "true");
      if(statusLevel.equals(CdmStatusLevel.Error)) {
        functionParameters.put("functionParameter1", statusLevel.toString());
        functionParameters.put("functionParameter2", message1);
      }
    };
    corpus.setEventCallback(callback);

    final CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/PropertyEntity.cdm.json/PropertyEntity").get();

    // test loading properties
    final CdmTypeAttributeDefinition attribute = (CdmTypeAttributeDefinition)entity.getAttributes().get(0);
    Assert.assertTrue(attribute.fetchIsReadOnly());
    Assert.assertTrue(attribute.fetchIsNullable());
    Assert.assertEquals(attribute.fetchSourceName(), "propertyAttribute");
    Assert.assertEquals(attribute.fetchDescription(), "Attribute that has all properties set.");
    Assert.assertEquals(attribute.fetchDisplayName(), "Property Attribute");
    Assert.assertEquals((int)attribute.fetchSourceOrdering(), 1);
    Assert.assertTrue(attribute.fetchValueConstrainedToList());
    Assert.assertEquals((int)attribute.fetchMaximumLength(), 10);
    Assert.assertEquals(attribute.fetchMaximumValue(), "20");
    Assert.assertEquals(attribute.fetchMinimumValue(), "1");
    Assert.assertEquals(attribute.fetchDataFormat(), CdmDataFormat.String);
    Assert.assertEquals(((List<Map<String, String>>)attribute.fetchDefaultValue()).get(0).get("displayText"), "Default");

    // test loading negative value properties
    final CdmTypeAttributeDefinition negativeAttribute = (CdmTypeAttributeDefinition)entity.getAttributes().get(1);
    Assert.assertFalse(negativeAttribute.fetchIsReadOnly());
    Assert.assertFalse(negativeAttribute.fetchIsNullable());
    Assert.assertNull(negativeAttribute.fetchSourceName());
    Assert.assertNull(negativeAttribute.fetchDescription());
    Assert.assertNull(negativeAttribute.fetchDisplayName());
    Assert.assertEquals((int)negativeAttribute.fetchSourceOrdering(), 0);
    Assert.assertFalse(negativeAttribute.fetchValueConstrainedToList());
    Assert.assertEquals((int)negativeAttribute.fetchMaximumLength(), 0);
    Assert.assertEquals(negativeAttribute.fetchMaximumValue(), "0");
    Assert.assertEquals(negativeAttribute.fetchMinimumValue(), "0");
    Assert.assertEquals(negativeAttribute.fetchDataFormat(), CdmDataFormat.Unknown);
    Assert.assertEquals(((List<Map<String, String>>)negativeAttribute.fetchDefaultValue()).get(0).get("displayText"), "");

    // test loading values with wrongs types in file
    final CdmTypeAttributeDefinition wrongTypesAttribute = (CdmTypeAttributeDefinition)entity.getAttributes().get(2);
    Assert.assertTrue(wrongTypesAttribute.fetchIsReadOnly());
    Assert.assertTrue(wrongTypesAttribute.fetchIsNullable());
    Assert.assertEquals((int)wrongTypesAttribute.fetchSourceOrdering(), 1);
    Assert.assertFalse(wrongTypesAttribute.fetchValueConstrainedToList());
    Assert.assertEquals((int)wrongTypesAttribute.fetchMaximumLength(), 0);
    Assert.assertEquals(wrongTypesAttribute.fetchMaximumValue(), "20");
    Assert.assertEquals(wrongTypesAttribute.fetchMinimumValue(), "0");

    // test loading values with wrong types that cannot be properly converted
    final CdmTypeAttributeDefinition invalidValuesAttribute = (CdmTypeAttributeDefinition)entity.getAttributes().get(3);
    Assert.assertFalse(invalidValuesAttribute.fetchIsReadOnly());
    Assert.assertNull(invalidValuesAttribute.fetchMaximumLength());

    // test loading values with empty default value list that should log error
    final CdmTypeAttributeDefinition emptyDefaultValueAttribute = (CdmTypeAttributeDefinition)entity.getAttributes().get(4);
    Assert.assertEquals(functionParameters.get("functionWasCalled"), "true");
    Assert.assertEquals(functionParameters.get("functionParameter1"), CdmStatusLevel.Error.toString());
    Assert.assertTrue(functionParameters.get("functionParameter2").contains("Default value missing languageTag or displayText."));
    Assert.assertNull(emptyDefaultValueAttribute.fetchDefaultValue());
    // set the default value to an empty list for testing that it should be removed from the generated json.
    emptyDefaultValueAttribute.updateDefaultValue(new ArrayList());

    final Entity entityData = EntityPersistence.toData(entity, null, null);

    // test toData for properties
    final TypeAttribute attributeData = mapper.treeToValue(entityData.getAttributes().get(0), TypeAttribute.class);
    Assert.assertTrue(attributeData.getIsReadOnly());
    Assert.assertTrue(attributeData.getIsNullable());
    Assert.assertEquals(attributeData.getSourceName(), "propertyAttribute");
    Assert.assertEquals(attributeData.getDescription(), "Attribute that has all properties set.");
    Assert.assertEquals(attributeData.getDisplayName(), "Property Attribute");
    Assert.assertEquals((int)attributeData.getSourceOrdering(), 1);
    Assert.assertTrue(attributeData.getValueConstrainedToList());
    Assert.assertEquals((int)attributeData.getMaximumLength(), 10);
    Assert.assertEquals(attributeData.getMaximumValue(), "20");
    Assert.assertEquals(attributeData.getMinimumValue(), "1");
    Assert.assertEquals(attributeData.getDataFormat(), "String");
    Assert.assertEquals(((Map<String, String>)mapper.treeToValue(attributeData.getDefaultValue(), ArrayList.class).get(0)).get("displayText"), "Default");

    // test toData for negative value properties
    final TypeAttribute negativeAttributeData = mapper.treeToValue(entityData.getAttributes().get(1), TypeAttribute.class);
    Assert.assertNull(negativeAttributeData.getIsReadOnly());
    Assert.assertNull(negativeAttributeData.getIsNullable());
    Assert.assertNull(negativeAttributeData.getSourceName());
    Assert.assertNull(negativeAttributeData.getDescription());
    Assert.assertNull(negativeAttributeData.getDisplayName());
    Assert.assertNull(negativeAttributeData.getSourceOrdering());
    Assert.assertNull(negativeAttributeData.getValueConstrainedToList());
    Assert.assertEquals((int)negativeAttributeData.getMaximumLength(), 0);
    Assert.assertEquals(negativeAttributeData.getMaximumValue(), "0");
    Assert.assertEquals(negativeAttributeData.getMinimumValue(), "0");
    Assert.assertNull(negativeAttributeData.getDataFormat());
    Assert.assertEquals(((Map<String, String>)mapper.treeToValue(negativeAttributeData.getDefaultValue(), ArrayList.class).get(0)).get("displayText"), "");

    // test toData for values with wrong types in file
    final TypeAttribute wrongTypesAttributeData = mapper.treeToValue(entityData.getAttributes().get(2), TypeAttribute.class);
    Assert.assertTrue(wrongTypesAttributeData.getIsReadOnly());
    Assert.assertTrue(wrongTypesAttributeData.getIsNullable());
    Assert.assertEquals((int)wrongTypesAttributeData.getSourceOrdering(), 1);
    Assert.assertNull(wrongTypesAttributeData.getValueConstrainedToList());
    Assert.assertEquals((int)wrongTypesAttributeData.getMaximumLength(), 0);
    Assert.assertEquals(wrongTypesAttributeData.getMaximumValue(), "20");
    Assert.assertEquals(wrongTypesAttributeData.getMinimumValue(), "0");

    // test toData with wrong types that cannot be properly converted
    final TypeAttribute invalidValuesAttributeData = mapper.treeToValue(entityData.getAttributes().get(3), TypeAttribute.class);
    Assert.assertNull(invalidValuesAttributeData.getIsReadOnly());
    Assert.assertNull(invalidValuesAttributeData.getMaximumLength());

    final TypeAttribute emptyDefaultValueAttributeData = mapper.treeToValue(entityData.getAttributes().get(4), TypeAttribute.class);
    Assert.assertNull(emptyDefaultValueAttributeData.getDefaultValue());
  }

  /**
   * Testing that "is.localized.describedAs" trait with a table of three entries (en, rs and cn) is fully preserved when running CdmFolder TypeAttributePersistence ToData
   */
  @Test
  public void TestCdmFolderToDataTypeAttribute() throws InterruptedException, ExecutionException, JsonProcessingException {
    final CdmCorpusDefinition corpus = new CdmCorpusDefinition();
    corpus.getStorage().mount("local", new LocalAdapter("C:\\Root\\Path)"));
    corpus.getStorage().setDefaultNamespace("local");

    final CdmTypeAttributeDefinition cdmTypeAttributeDefinition = corpus.makeObject(CdmObjectType.TypeAttributeDef, "TestSavingTraitAttribute", false);

    final List<String> englishConstantsList = Arrays.asList("en", "Some description in English language");
    final List<String> serbianConstantsList = Arrays.asList("sr", "Opis na srpskom jeziku");
    final List<String> chineseConstantsList =  Arrays.asList("cn", "一些中文描述");
    final List<List<String>> listOfConstLists = Arrays.asList(englishConstantsList, serbianConstantsList, chineseConstantsList);

    final CdmConstantEntityDefinition constEntDef = corpus.makeObject(CdmObjectType.ConstantEntityDef, "localizedDescriptions", false);
    constEntDef.setConstantValues(listOfConstLists);
    constEntDef.setEntityShape(corpus.makeRef(CdmObjectType.EntityRef, "localizedTable", true));

    final CdmTraitReference traitReference2 = corpus.makeObject(CdmObjectType.TraitRef, "is.localized.describedAs", false);
    traitReference2.getArguments().add("localizedDisplayText", corpus.makeRef(CdmObjectType.EntityRef, constEntDef, true));
    cdmTypeAttributeDefinition.getAppliedTraits().add(traitReference2);

    final com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.TypeAttribute
            result = (TypeAttribute) PersistenceLayer.toData(
            cdmTypeAttributeDefinition,
            null,
            null,
            PersistenceLayer.cdmFolder,
            CdmTypeAttributeDefinition.class);

    Assert.assertNotNull(result.getAppliedTraits());
    final ObjectMapper mapper = new ObjectMapper();
    final TraitReferenceDefinition traitReferenceDefinition = mapper.treeToValue(result.getAppliedTraits().get(0), TraitReferenceDefinition.class);
    final Argument argument = mapper.treeToValue(traitReferenceDefinition.getArguments().get(0), Argument.class);
    final EntityReferenceDefinition entityReferenceDefinition = mapper.treeToValue(argument.getValue(), EntityReferenceDefinition.class);
    final List<List<String>> constantValues = (mapper.convertValue(entityReferenceDefinition.getEntityReference(), ConstantEntity.class).getConstantValues());
    Assert.assertEquals(constantValues.get(0).get(0), "en");
    Assert.assertEquals(constantValues.get(0).get(1), "Some description in English language");
    Assert.assertEquals(constantValues.get(1).get(0), "sr");
    Assert.assertEquals(constantValues.get(1).get(1), "Opis na srpskom jeziku");
    Assert.assertEquals(constantValues.get(2).get(0), "cn");
    Assert.assertEquals(constantValues.get(2).get(1), "一些中文描述");
  }

  /**
   * Testing that DataFormat to trait mappings are correct and that correct traits are added to the type attribute.
   */
  @Test
  public void testDataFormatToTraitMappings() throws InterruptedException, ExecutionException {
    final CdmCorpusDefinition corpus = TestHelper.getLocalCorpus(TESTS_SUBPATH, "testDataFormatToTraitMappings", null);
    final CdmEntityDefinition entity = corpus.<CdmEntityDefinition>fetchObjectAsync("local:/Entity.cdm.json/Entity").get();

    // Check that the traits we expect for each DataFormat are found in the type attribute's applied traits.

    // DataFormat = Int16
    final CdmTypeAttributeDefinition attributeA = (CdmTypeAttributeDefinition) entity.getAttributes().get(0);
    Set<String> aTraitNamedReferences = fetchTraitNamedReferences(attributeA.getAppliedTraits());
    Assert.assertTrue(aTraitNamedReferences.contains("is.dataFormat.integer"));
    Assert.assertTrue(aTraitNamedReferences.contains("is.dataFormat.small"));

    // DataFormat = Int32
    final CdmTypeAttributeDefinition attributeB = (CdmTypeAttributeDefinition) entity.getAttributes().get(1);
    Set<String> bTraitNamedReferences = fetchTraitNamedReferences(attributeB.getAppliedTraits());
    Assert.assertTrue(bTraitNamedReferences.contains("is.dataFormat.integer"));

    // DataFormat = Int64
    final CdmTypeAttributeDefinition attributeC = (CdmTypeAttributeDefinition) entity.getAttributes().get(2);
    Set<String> cTraitNamedReferences = fetchTraitNamedReferences(attributeC.getAppliedTraits());
    Assert.assertTrue(cTraitNamedReferences.contains("is.dataFormat.integer"));
    Assert.assertTrue(cTraitNamedReferences.contains("is.dataFormat.big"));

    // DataFormat = Float
    final CdmTypeAttributeDefinition attributeD = (CdmTypeAttributeDefinition) entity.getAttributes().get(3);
    Set<String> dTraitNamedReferences = fetchTraitNamedReferences(attributeD.getAppliedTraits());
    Assert.assertTrue(dTraitNamedReferences.contains("is.dataFormat.floatingPoint"));

    // DataFormat = Double
    final CdmTypeAttributeDefinition attributeE = (CdmTypeAttributeDefinition) entity.getAttributes().get(4);
    Set<String> eTraitNamedReferences = fetchTraitNamedReferences(attributeE.getAppliedTraits());
    Assert.assertTrue(eTraitNamedReferences.contains("is.dataFormat.floatingPoint"));
    Assert.assertTrue(eTraitNamedReferences.contains("is.dataFormat.big"));

    // DataFormat = Guid
    final CdmTypeAttributeDefinition attributeF = (CdmTypeAttributeDefinition) entity.getAttributes().get(5);
    Set<String> fTraitNamedReferences = fetchTraitNamedReferences(attributeF.getAppliedTraits());
    Assert.assertTrue(fTraitNamedReferences.contains("is.dataFormat.guid"));
    Assert.assertTrue(fTraitNamedReferences.contains("is.dataFormat.character"));
    Assert.assertTrue(fTraitNamedReferences.contains("is.dataFormat.array"));

    // DataFormat = String
    final CdmTypeAttributeDefinition attributeG = (CdmTypeAttributeDefinition) entity.getAttributes().get(6);
    Set<String> gTraitNamedReferences = fetchTraitNamedReferences(attributeG.getAppliedTraits());
    Assert.assertTrue(gTraitNamedReferences.contains("is.dataFormat.character"));
    Assert.assertTrue(gTraitNamedReferences.contains("is.dataFormat.array"));

    // DataFormat = Char
    final CdmTypeAttributeDefinition attributeH = (CdmTypeAttributeDefinition) entity.getAttributes().get(7);
    Set<String> hTraitNamedReferences = fetchTraitNamedReferences(attributeH.getAppliedTraits());
    Assert.assertTrue(hTraitNamedReferences.contains("is.dataFormat.character"));
    Assert.assertTrue(hTraitNamedReferences.contains("is.dataFormat.big"));

    // DataFormat = Byte
    final CdmTypeAttributeDefinition attributeI = (CdmTypeAttributeDefinition) entity.getAttributes().get(8);
    Set<String> iTraitNamedReferences = fetchTraitNamedReferences(attributeI.getAppliedTraits());
    Assert.assertTrue(iTraitNamedReferences.contains("is.dataFormat.byte"));

    // DataFormat = Binary
    final CdmTypeAttributeDefinition attributeJ = (CdmTypeAttributeDefinition) entity.getAttributes().get(9);
    Set<String> jTraitNamedReferences = fetchTraitNamedReferences(attributeJ.getAppliedTraits());
    Assert.assertTrue(jTraitNamedReferences.contains("is.dataFormat.byte"));
    Assert.assertTrue(jTraitNamedReferences.contains("is.dataFormat.array"));

    // DataFormat = Time
    final CdmTypeAttributeDefinition attributeK = (CdmTypeAttributeDefinition) entity.getAttributes().get(10);
    Set<String> kTraitNamedReferences = fetchTraitNamedReferences(attributeK.getAppliedTraits());
    Assert.assertTrue(kTraitNamedReferences.contains("is.dataFormat.time"));

    // DataFormat = Date
    final CdmTypeAttributeDefinition attributeL = (CdmTypeAttributeDefinition) entity.getAttributes().get(11);
    Set<String> lTraitNamedReferences = fetchTraitNamedReferences(attributeL.getAppliedTraits());
    Assert.assertTrue(lTraitNamedReferences.contains("is.dataFormat.date"));

    // DataFormat = DateTime
    final CdmTypeAttributeDefinition attributeM = (CdmTypeAttributeDefinition) entity.getAttributes().get(12);
    Set<String> mTraitNamedReferences = fetchTraitNamedReferences(attributeM.getAppliedTraits());
    Assert.assertTrue(mTraitNamedReferences.contains("is.dataFormat.time"));
    Assert.assertTrue(mTraitNamedReferences.contains("is.dataFormat.date"));

    // DataFormat = DateTimeOffset
    final CdmTypeAttributeDefinition attributeN = (CdmTypeAttributeDefinition) entity.getAttributes().get(13);
    Set<String> nTraitNamedReferences = fetchTraitNamedReferences(attributeN.getAppliedTraits());
    Assert.assertTrue(nTraitNamedReferences.contains("is.dataFormat.time"));
    Assert.assertTrue(nTraitNamedReferences.contains("is.dataFormat.date"));
    Assert.assertTrue(nTraitNamedReferences.contains("is.dataFormat.timeOffset"));

    // DataFormat = Boolean
    final CdmTypeAttributeDefinition attributeO = (CdmTypeAttributeDefinition) entity.getAttributes().get(14);
    Set<String> oTraitNamedReferences = fetchTraitNamedReferences(attributeO.getAppliedTraits());
    Assert.assertTrue(oTraitNamedReferences.contains("is.dataFormat.boolean"));

    // DataFormat = Decimal
    final CdmTypeAttributeDefinition attributeP = (CdmTypeAttributeDefinition) entity.getAttributes().get(15);
    Set<String> pTraitNamedReferences = fetchTraitNamedReferences(attributeP.getAppliedTraits());
    Assert.assertTrue(pTraitNamedReferences.contains("is.dataFormat.numeric.shaped"));

    // DataFormat = Json
    final CdmTypeAttributeDefinition attributeQ = (CdmTypeAttributeDefinition) entity.getAttributes().get(16);
    Set<String> qTraitNamedReferences = fetchTraitNamedReferences(attributeQ.getAppliedTraits());
    Assert.assertTrue(qTraitNamedReferences.contains("is.dataFormat.array"));
    Assert.assertTrue(qTraitNamedReferences.contains("means.content.text.JSON"));
  }

  private Set<String> fetchTraitNamedReferences(CdmTraitCollection traits) {
    Set<String> namedReferences = new HashSet<String>();
    for (CdmTraitReference trait : traits) {
      namedReferences.add(trait.getNamedReference());
    }
    return namedReferences;
  }
}
