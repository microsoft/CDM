// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmConstantEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.PersistenceLayer;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.TraitReferenceDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.EntityReferenceDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.ConstantEntity;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.Argument;
import com.microsoft.commondatamodel.objectmodel.persistence.modeljson.types.Attribute;
import com.microsoft.commondatamodel.objectmodel.storage.LocalAdapter;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class TypeAttributeTest {
  /**
   * Testing that "is.localized.describedAs" trait with a table of three entries (en, rs and cn) is fully preserved when running ModelJson TypeAttributePersistence ToData
   */
  @Test
  public void TestModelJsonToDataTypeAttribute() throws InterruptedException, ExecutionException, JsonProcessingException {
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

    final Attribute
            result = ((CompletableFuture<Attribute>)PersistenceLayer.toData(
                    cdmTypeAttributeDefinition,
                    null,
                    null,
                    PersistenceLayer.modelJson,
                    CdmTypeAttributeDefinition.class)).join();

    Assert.assertNotNull(result.getTraits());
    final ObjectMapper mapper = new ObjectMapper();
    final TraitReferenceDefinition traitReferenceDefinition = mapper.treeToValue(result.getTraits().get(0), TraitReferenceDefinition.class);
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
}
