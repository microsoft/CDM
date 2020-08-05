// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.entityattribute;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.EntityAttributePersistence;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.EntityAttribute;

import org.testng.Assert;
import org.testng.annotations.Test;

public class CdmEntityAttributePersistenceTest {
  /**
   * Tests if calling from and to data maintain the properties description and displayName.
   */
    @Test
  public void testDescriptionAndDisplayName() {
    CdmCorpusDefinition corpus = new CdmCorpusDefinition();
    String entityName = "TheEntity";
    String description = "entityAttributeDescription";
    String displayName = "whatABeutifulDisplayName";

    ObjectMapper mapper = new ObjectMapper();

    // create new node
    ObjectNode input = mapper.createObjectNode();
    input.put("name", entityName);
    input.put("description", description);
    input.put("displayName", displayName);

    CdmEntityAttributeDefinition instance = EntityAttributePersistence.fromData(corpus.getCtx(), input);

    Assert.assertEquals(instance.fetchDescription(), description);
    Assert.assertEquals(instance.fetchDisplayName(), displayName);

    EntityAttribute data = EntityAttributePersistence.toData(instance, null, null);

    Assert.assertEquals(data.getDescription(), description);
    Assert.assertEquals(data.getDisplayName(), displayName);

    // Checks if there is no residue of the transformation of the properties into traits.
    Assert.assertNull(data.getAppliedTraits());
  }
}
