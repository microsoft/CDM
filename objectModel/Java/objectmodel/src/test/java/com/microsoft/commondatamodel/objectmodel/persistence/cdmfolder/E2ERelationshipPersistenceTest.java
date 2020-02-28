// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmE2ERelationship;
import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.E2ERelationship;
import org.testng.AssertJUnit;
import org.testng.annotations.Test;

public class E2ERelationshipPersistenceTest {
  @Test
  public void toDataTest() {
    CdmCorpusDefinition corpus = new CdmCorpusDefinition();
    CdmE2ERelationship instance = corpus.makeObject(CdmObjectType.E2ERelationshipDef);
    instance.setToEntity("TO_ENTITY");
    instance.setToEntityAttribute("TO_ENTITY_ATTRIBUTE");
    instance.setFromEntity("FROM_ENTITY");
    instance.setFromEntityAttribute("FROM_ENTITY_ATTRIBUTE");

    E2ERelationship result = E2ERelationshipPersistence.toData(instance);
    AssertJUnit.assertEquals(result.getToEntity(), "TO_ENTITY");
    AssertJUnit.assertEquals(result.getToEntityAttribute(), "TO_ENTITY_ATTRIBUTE");
    AssertJUnit.assertEquals(result.getFromEntity(), "FROM_ENTITY");
    AssertJUnit.assertEquals(result.getFromEntityAttribute(), "FROM_ENTITY_ATTRIBUTE");
  }

  @Test
  public void fromDataTest() {
    E2ERelationship dataObj = new E2ERelationship();
    dataObj.setToEntity("TO_ENTITY");
    dataObj.setToEntityAttribute("TO_ENTITY_ATTRIBUTE");
    dataObj.setFromEntity("FROM_ENTITY");
    dataObj.setFromEntityAttribute("FROM_ENTITY_ATTRIBUTE");

    CdmE2ERelationship result = E2ERelationshipPersistence.fromData(new CdmCorpusDefinition().getCtx(), dataObj);
    AssertJUnit.assertEquals(result.getToEntity(), "TO_ENTITY");
    AssertJUnit.assertEquals(result.getToEntityAttribute(), "TO_ENTITY_ATTRIBUTE");
    AssertJUnit.assertEquals(result.getFromEntity(), "FROM_ENTITY");
    AssertJUnit.assertEquals(result.getFromEntityAttribute(), "FROM_ENTITY_ATTRIBUTE");
  }
}
