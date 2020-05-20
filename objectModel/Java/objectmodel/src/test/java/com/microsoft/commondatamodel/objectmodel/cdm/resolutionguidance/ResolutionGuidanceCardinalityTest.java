// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.resolutionguidance;

import com.microsoft.commondatamodel.objectmodel.utilities.AttributeContextExpectedValue;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeExpectedValue;
import org.testng.annotations.Test;

import java.util.ArrayList;
import java.util.List;

public class ResolutionGuidanceCardinalityTest extends CommonTest {

    /**
     * Resolution Guidance Test - One:One Cardinality
     */
    @Test
    public void testForeignKeyOneToOneCardinality() {
        String testName = "testForeignKeyOneToOneCardinality";
        {
            String entityName = "Person";

            AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
            {
                expectedContext_default.setType("entity");
                expectedContext_default.setName("Person_Resolved_default");
                expectedContext_default.setDefinition("resolvedFrom/Person");
                expectedContext_default.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Person_Resolved_default/attributeContext/Person_Resolved_default");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Person_Resolved_default/attributeContext/Person_Resolved_default/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_default.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Person_Resolved_default/attributeContext/Person_Resolved_default");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Person_Resolved_default/attributeContext/Person_Resolved_default/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Person_Resolved_default/attributeContext/Person_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Person_Resolved_default/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("FullName");
                            attrCtx_LVL2_IND1.setParent("Person_Resolved_default/attributeContext/Person_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Person_Resolved_default/hasAttributes/FullName");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_default.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
            {
                expectedContext_normalized.setType("entity");
                expectedContext_normalized.setName("Person_Resolved_normalized");
                expectedContext_normalized.setDefinition("resolvedFrom/Person");
                expectedContext_normalized.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Person_Resolved_normalized/attributeContext/Person_Resolved_normalized");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Person_Resolved_normalized/attributeContext/Person_Resolved_normalized/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Person_Resolved_normalized/attributeContext/Person_Resolved_normalized");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Person_Resolved_normalized/attributeContext/Person_Resolved_normalized/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Person_Resolved_normalized/attributeContext/Person_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Person_Resolved_normalized/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("FullName");
                            attrCtx_LVL2_IND1.setParent("Person_Resolved_normalized/attributeContext/Person_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Person_Resolved_normalized/hasAttributes/FullName");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly.setType("entity");
                expectedContext_referenceOnly.setName("Person_Resolved_referenceOnly");
                expectedContext_referenceOnly.setDefinition("resolvedFrom/Person");
                expectedContext_referenceOnly.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Person_Resolved_referenceOnly/attributeContext/Person_Resolved_referenceOnly");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Person_Resolved_referenceOnly/attributeContext/Person_Resolved_referenceOnly/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Person_Resolved_referenceOnly/attributeContext/Person_Resolved_referenceOnly");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Person_Resolved_referenceOnly/attributeContext/Person_Resolved_referenceOnly/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Person_Resolved_referenceOnly/attributeContext/Person_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Person_Resolved_referenceOnly/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("FullName");
                            attrCtx_LVL2_IND1.setParent("Person_Resolved_referenceOnly/attributeContext/Person_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Person_Resolved_referenceOnly/hasAttributes/FullName");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
            {
                expectedContext_structured.setType("entity");
                expectedContext_structured.setName("Person_Resolved_structured");
                expectedContext_structured.setDefinition("resolvedFrom/Person");
                expectedContext_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Person_Resolved_structured/attributeContext/Person_Resolved_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Person_Resolved_structured/attributeContext/Person_Resolved_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Person_Resolved_structured/attributeContext/Person_Resolved_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Person_Resolved_structured/attributeContext/Person_Resolved_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Person_Resolved_structured/attributeContext/Person_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Person_Resolved_structured/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("FullName");
                            attrCtx_LVL2_IND1.setParent("Person_Resolved_structured/attributeContext/Person_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Person_Resolved_structured/hasAttributes/FullName");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
            {
                expectedContext_normalized_structured.setType("entity");
                expectedContext_normalized_structured.setName("Person_Resolved_normalized_structured");
                expectedContext_normalized_structured.setDefinition("resolvedFrom/Person");
                expectedContext_normalized_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Person_Resolved_normalized_structured/attributeContext/Person_Resolved_normalized_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Person_Resolved_normalized_structured/attributeContext/Person_Resolved_normalized_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Person_Resolved_normalized_structured/attributeContext/Person_Resolved_normalized_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Person_Resolved_normalized_structured/attributeContext/Person_Resolved_normalized_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Person_Resolved_normalized_structured/attributeContext/Person_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Person_Resolved_normalized_structured/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("FullName");
                            attrCtx_LVL2_IND1.setParent("Person_Resolved_normalized_structured/attributeContext/Person_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Person_Resolved_normalized_structured/hasAttributes/FullName");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized.setType("entity");
                expectedContext_referenceOnly_normalized.setName("Person_Resolved_referenceOnly_normalized");
                expectedContext_referenceOnly_normalized.setDefinition("resolvedFrom/Person");
                expectedContext_referenceOnly_normalized.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Person_Resolved_referenceOnly_normalized/attributeContext/Person_Resolved_referenceOnly_normalized");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Person_Resolved_referenceOnly_normalized/attributeContext/Person_Resolved_referenceOnly_normalized/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Person_Resolved_referenceOnly_normalized/attributeContext/Person_Resolved_referenceOnly_normalized");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Person_Resolved_referenceOnly_normalized/attributeContext/Person_Resolved_referenceOnly_normalized/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Person_Resolved_referenceOnly_normalized/attributeContext/Person_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Person_Resolved_referenceOnly_normalized/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("FullName");
                            attrCtx_LVL2_IND1.setParent("Person_Resolved_referenceOnly_normalized/attributeContext/Person_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Person_Resolved_referenceOnly_normalized/hasAttributes/FullName");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_structured.setType("entity");
                expectedContext_referenceOnly_structured.setName("Person_Resolved_referenceOnly_structured");
                expectedContext_referenceOnly_structured.setDefinition("resolvedFrom/Person");
                expectedContext_referenceOnly_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Person_Resolved_referenceOnly_structured/attributeContext/Person_Resolved_referenceOnly_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Person_Resolved_referenceOnly_structured/attributeContext/Person_Resolved_referenceOnly_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Person_Resolved_referenceOnly_structured/attributeContext/Person_Resolved_referenceOnly_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Person_Resolved_referenceOnly_structured/attributeContext/Person_Resolved_referenceOnly_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Person_Resolved_referenceOnly_structured/attributeContext/Person_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Person_Resolved_referenceOnly_structured/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("FullName");
                            attrCtx_LVL2_IND1.setParent("Person_Resolved_referenceOnly_structured/attributeContext/Person_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Person_Resolved_referenceOnly_structured/hasAttributes/FullName");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized_structured.setType("entity");
                expectedContext_referenceOnly_normalized_structured.setName("Person_Resolved_referenceOnly_normalized_structured");
                expectedContext_referenceOnly_normalized_structured.setDefinition("resolvedFrom/Person");
                expectedContext_referenceOnly_normalized_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Person_Resolved_referenceOnly_normalized_structured/attributeContext/Person_Resolved_referenceOnly_normalized_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Person_Resolved_referenceOnly_normalized_structured/attributeContext/Person_Resolved_referenceOnly_normalized_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Person_Resolved_referenceOnly_normalized_structured/attributeContext/Person_Resolved_referenceOnly_normalized_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Person_Resolved_referenceOnly_normalized_structured/attributeContext/Person_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Person_Resolved_referenceOnly_normalized_structured/attributeContext/Person_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Person_Resolved_referenceOnly_normalized_structured/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("FullName");
                            attrCtx_LVL2_IND1.setParent("Person_Resolved_referenceOnly_normalized_structured/attributeContext/Person_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Person_Resolved_referenceOnly_normalized_structured/hasAttributes/FullName");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.getContexts().add(attrCtx_LVL0_IND1);
            }

            List<AttributeExpectedValue> expected_default = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Person_Resolved_default/attributeContext/Person_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att1.setDataFormat("Guid");
                    att1.setDisplayName("ID");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_default.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Person_Resolved_default/attributeContext/Person_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName");
                    att2.setDataFormat("String");
                    att2.setDisplayName("FullName");
                    att2.setName("FullName");
                    att2.setSourceName("FullName");
                }
                expected_default.add(att2);

            }
            List<AttributeExpectedValue> expected_normalized = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Person_Resolved_normalized/attributeContext/Person_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att1.setDataFormat("Guid");
                    att1.setDisplayName("ID");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_normalized.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Person_Resolved_normalized/attributeContext/Person_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName");
                    att2.setDataFormat("String");
                    att2.setDisplayName("FullName");
                    att2.setName("FullName");
                    att2.setSourceName("FullName");
                }
                expected_normalized.add(att2);
            }
            List<AttributeExpectedValue> expected_referenceOnly = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Person_Resolved_referenceOnly/attributeContext/Person_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att1.setDataFormat("Guid");
                    att1.setDisplayName("ID");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_referenceOnly.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Person_Resolved_referenceOnly/attributeContext/Person_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName");
                    att2.setDataFormat("String");
                    att2.setDisplayName("FullName");
                    att2.setName("FullName");
                    att2.setSourceName("FullName");
                }
                expected_referenceOnly.add(att2);
            }
            List<AttributeExpectedValue> expected_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Person_Resolved_structured/attributeContext/Person_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att1.setDataFormat("Guid");
                    att1.setDisplayName("ID");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_structured.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Person_Resolved_structured/attributeContext/Person_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName");
                    att2.setDataFormat("String");
                    att2.setDisplayName("FullName");
                    att2.setName("FullName");
                    att2.setSourceName("FullName");
                }
                expected_structured.add(att2);
            }
            List<AttributeExpectedValue> expected_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Person_Resolved_normalized_structured/attributeContext/Person_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att1.setDataFormat("Guid");
                    att1.setDisplayName("ID");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_normalized_structured.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Person_Resolved_normalized_structured/attributeContext/Person_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName");
                    att2.setDataFormat("String");
                    att2.setDisplayName("FullName");
                    att2.setName("FullName");
                    att2.setSourceName("FullName");
                }
                expected_normalized_structured.add(att2);
            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Person_Resolved_referenceOnly_normalized/attributeContext/Person_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att1.setDataFormat("Guid");
                    att1.setDisplayName("ID");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_referenceOnly_normalized.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Person_Resolved_referenceOnly_normalized/attributeContext/Person_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName");
                    att2.setDataFormat("String");
                    att2.setDisplayName("FullName");
                    att2.setName("FullName");
                    att2.setSourceName("FullName");
                }
                expected_referenceOnly_normalized.add(att2);
            }
            List<AttributeExpectedValue> expected_referenceOnly_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Person_Resolved_referenceOnly_structured/attributeContext/Person_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att1.setDataFormat("Guid");
                    att1.setDisplayName("ID");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_referenceOnly_structured.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Person_Resolved_referenceOnly_structured/attributeContext/Person_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName");
                    att2.setDataFormat("String");
                    att2.setDisplayName("FullName");
                    att2.setName("FullName");
                    att2.setSourceName("FullName");
                }
                expected_referenceOnly_structured.add(att2);
            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Person_Resolved_referenceOnly_normalized_structured/attributeContext/Person_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att1.setDataFormat("Guid");
                    att1.setDisplayName("ID");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_referenceOnly_normalized_structured.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Person_Resolved_referenceOnly_normalized_structured/attributeContext/Person_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName");
                    att2.setDataFormat("String");
                    att2.setDisplayName("FullName");
                    att2.setName("FullName");
                    att2.setSourceName("FullName");
                }
                expected_referenceOnly_normalized_structured.add(att2);
            }

            runTestWithValues(
                    testName,
                    entityName,

                    expectedContext_default,
                    expectedContext_normalized,
                    expectedContext_referenceOnly,
                    expectedContext_structured,
                    expectedContext_normalized_structured,
                    expectedContext_referenceOnly_normalized,
                    expectedContext_referenceOnly_structured,
                    expectedContext_referenceOnly_normalized_structured,

                    expected_default,
                    expected_normalized,
                    expected_referenceOnly,
                    expected_structured,
                    expected_normalized_structured,
                    expected_referenceOnly_normalized,
                    expected_referenceOnly_structured,
                    expected_referenceOnly_normalized_structured
            ).join();
        }
        {
            String entityName = "PersonContact";

            AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
            {
                expectedContext_default.setType("entity");
                expectedContext_default.setName("PersonContact_Resolved_default");
                expectedContext_default.setDefinition("resolvedFrom/PersonContact");
                expectedContext_default.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_default.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("PersonID");
                            attrCtx_LVL2_IND0.setParent("PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PersonID");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Person");
                                attrCtx_LVL3_IND0.setParent("PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Person");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("entityReferenceExtends");
                                    attrCtx_LVL4_IND0.setName("extends");
                                    attrCtx_LVL4_IND0.setParent("PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("CdmEntity");
                                        attrCtx_LVL5_IND0.setParent("PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/extends");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/CdmEntity");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setParent("PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("attributeGroup");
                                        attrCtx_LVL5_IND0.setName("attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setParent("PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                        AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.setType("attributeDefinition");
                                            attrCtx_LVL6_IND0.setName("ID");
                                            attrCtx_LVL6_IND0.setParent("PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID");
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.setType("attributeDefinition");
                                            attrCtx_LVL6_IND1.setName("FullName");
                                            attrCtx_LVL6_IND1.setParent("PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName");
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND1);
                                    }
                                    attrCtx_LVL4_IND1.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("generatedSet");
                                attrCtx_LVL3_IND1.setName("_generatedAttributeSet");
                                attrCtx_LVL3_IND1.setParent("PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID");
                                attrCtx_LVL3_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("generatedRound");
                                    attrCtx_LVL4_IND0.setName("_generatedAttributeRound0");
                                    attrCtx_LVL4_IND0.setParent("PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("attributeDefinition");
                                        attrCtx_LVL5_IND0.setName("ID");
                                        attrCtx_LVL5_IND0.setParent("PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID");
                                        attrCtx_LVL5_IND0.setContextStrings(new ArrayList<String>());
                                        {
                                            attrCtx_LVL5_IND0.getContextStrings().add("PersonContact_Resolved_default/hasAttributes/ID");
                                        }
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL5_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND1.setType("attributeDefinition");
                                        attrCtx_LVL5_IND1.setName("FullName");
                                        attrCtx_LVL5_IND1.setParent("PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0");
                                        attrCtx_LVL5_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName");
                                        attrCtx_LVL5_IND1.setContextStrings(new ArrayList<String>());
                                        {
                                            attrCtx_LVL5_IND1.getContextStrings().add("PersonContact_Resolved_default/hasAttributes/FullName");
                                        }
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND1);
                                }
                                attrCtx_LVL3_IND1.getContexts().add(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("EmailAddress");
                            attrCtx_LVL2_IND1.setParent("PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/EmailAddress");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("PersonContact_Resolved_default/hasAttributes/EmailAddress");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("PhoneNumber");
                            attrCtx_LVL2_IND2.setParent("PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PhoneNumber");
                            attrCtx_LVL2_IND2.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND2.getContextStrings().add("PersonContact_Resolved_default/hasAttributes/PhoneNumber");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_default.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
            {
                expectedContext_normalized.setType("entity");
                expectedContext_normalized.setName("PersonContact_Resolved_normalized");
                expectedContext_normalized.setDefinition("resolvedFrom/PersonContact");
                expectedContext_normalized.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("PersonID");
                            attrCtx_LVL2_IND0.setParent("PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PersonID");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Person");
                                attrCtx_LVL3_IND0.setParent("PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Person");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("entityReferenceExtends");
                                    attrCtx_LVL4_IND0.setName("extends");
                                    attrCtx_LVL4_IND0.setParent("PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("CdmEntity");
                                        attrCtx_LVL5_IND0.setParent("PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/extends");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/CdmEntity");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setParent("PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("attributeGroup");
                                        attrCtx_LVL5_IND0.setName("attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setParent("PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                        AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.setType("attributeDefinition");
                                            attrCtx_LVL6_IND0.setName("ID");
                                            attrCtx_LVL6_IND0.setParent("PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID");
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.setType("attributeDefinition");
                                            attrCtx_LVL6_IND1.setName("FullName");
                                            attrCtx_LVL6_IND1.setParent("PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName");
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND1);
                                    }
                                    attrCtx_LVL4_IND1.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("generatedSet");
                                attrCtx_LVL3_IND1.setName("_generatedAttributeSet");
                                attrCtx_LVL3_IND1.setParent("PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID");
                                attrCtx_LVL3_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("generatedRound");
                                    attrCtx_LVL4_IND0.setName("_generatedAttributeRound0");
                                    attrCtx_LVL4_IND0.setParent("PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("attributeDefinition");
                                        attrCtx_LVL5_IND0.setName("ID");
                                        attrCtx_LVL5_IND0.setParent("PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID");
                                        attrCtx_LVL5_IND0.setContextStrings(new ArrayList<String>());
                                        {
                                            attrCtx_LVL5_IND0.getContextStrings().add("PersonContact_Resolved_normalized/hasAttributes/ID");
                                        }
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL5_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND1.setType("attributeDefinition");
                                        attrCtx_LVL5_IND1.setName("FullName");
                                        attrCtx_LVL5_IND1.setParent("PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0");
                                        attrCtx_LVL5_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName");
                                        attrCtx_LVL5_IND1.setContextStrings(new ArrayList<String>());
                                        {
                                            attrCtx_LVL5_IND1.getContextStrings().add("PersonContact_Resolved_normalized/hasAttributes/FullName");
                                        }
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND1);
                                }
                                attrCtx_LVL3_IND1.getContexts().add(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("EmailAddress");
                            attrCtx_LVL2_IND1.setParent("PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/EmailAddress");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("PersonContact_Resolved_normalized/hasAttributes/EmailAddress");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("PhoneNumber");
                            attrCtx_LVL2_IND2.setParent("PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PhoneNumber");
                            attrCtx_LVL2_IND2.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND2.getContextStrings().add("PersonContact_Resolved_normalized/hasAttributes/PhoneNumber");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly.setType("entity");
                expectedContext_referenceOnly.setName("PersonContact_Resolved_referenceOnly");
                expectedContext_referenceOnly.setDefinition("resolvedFrom/PersonContact");
                expectedContext_referenceOnly.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("PersonID");
                            attrCtx_LVL2_IND0.setParent("PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PersonID");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Person");
                                attrCtx_LVL3_IND0.setParent("PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Person");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("generatedSet");
                                attrCtx_LVL3_IND1.setName("_generatedAttributeSet");
                                attrCtx_LVL3_IND1.setParent("PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID");
                                attrCtx_LVL3_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("generatedRound");
                                    attrCtx_LVL4_IND0.setName("_generatedAttributeRound0");
                                    attrCtx_LVL4_IND0.setParent("PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("addedAttributeIdentity");
                                        attrCtx_LVL5_IND0.setName("_foreignKey");
                                        attrCtx_LVL5_IND0.setParent("PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0");
                                        attrCtx_LVL5_IND0.setContextStrings(new ArrayList<String>());
                                        {
                                            attrCtx_LVL5_IND0.getContextStrings().add("PersonContact_Resolved_referenceOnly/hasAttributes/PersonID");
                                        }
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND1.getContexts().add(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("EmailAddress");
                            attrCtx_LVL2_IND1.setParent("PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/EmailAddress");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("PersonContact_Resolved_referenceOnly/hasAttributes/EmailAddress");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("PhoneNumber");
                            attrCtx_LVL2_IND2.setParent("PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PhoneNumber");
                            attrCtx_LVL2_IND2.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND2.getContextStrings().add("PersonContact_Resolved_referenceOnly/hasAttributes/PhoneNumber");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
            {
                expectedContext_structured.setType("entity");
                expectedContext_structured.setName("PersonContact_Resolved_structured");
                expectedContext_structured.setDefinition("resolvedFrom/PersonContact");
                expectedContext_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("PersonID");
                            attrCtx_LVL2_IND0.setParent("PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PersonID");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Person");
                                attrCtx_LVL3_IND0.setParent("PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Person");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("entityReferenceExtends");
                                    attrCtx_LVL4_IND0.setName("extends");
                                    attrCtx_LVL4_IND0.setParent("PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("CdmEntity");
                                        attrCtx_LVL5_IND0.setParent("PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/extends");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/CdmEntity");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setParent("PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("attributeGroup");
                                        attrCtx_LVL5_IND0.setName("attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setParent("PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                        AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.setType("attributeDefinition");
                                            attrCtx_LVL6_IND0.setName("ID");
                                            attrCtx_LVL6_IND0.setParent("PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID");
                                            attrCtx_LVL6_IND0.setContextStrings(new ArrayList<String>());
                                            {
                                                attrCtx_LVL6_IND0.getContextStrings().add("PersonContact_Resolved_structured/hasAttributes/PersonID/members/ID");
                                            }
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.setType("attributeDefinition");
                                            attrCtx_LVL6_IND1.setName("FullName");
                                            attrCtx_LVL6_IND1.setParent("PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName");
                                            attrCtx_LVL6_IND1.setContextStrings(new ArrayList<String>());
                                            {
                                                attrCtx_LVL6_IND1.getContextStrings().add("PersonContact_Resolved_structured/hasAttributes/PersonID/members/FullName");
                                            }
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND1);
                                    }
                                    attrCtx_LVL4_IND1.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("EmailAddress");
                            attrCtx_LVL2_IND1.setParent("PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/EmailAddress");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("PersonContact_Resolved_structured/hasAttributes/EmailAddress");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("PhoneNumber");
                            attrCtx_LVL2_IND2.setParent("PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PhoneNumber");
                            attrCtx_LVL2_IND2.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND2.getContextStrings().add("PersonContact_Resolved_structured/hasAttributes/PhoneNumber");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
            {
                expectedContext_normalized_structured.setType("entity");
                expectedContext_normalized_structured.setName("PersonContact_Resolved_normalized_structured");
                expectedContext_normalized_structured.setDefinition("resolvedFrom/PersonContact");
                expectedContext_normalized_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("PersonID");
                            attrCtx_LVL2_IND0.setParent("PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PersonID");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Person");
                                attrCtx_LVL3_IND0.setParent("PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Person");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("entityReferenceExtends");
                                    attrCtx_LVL4_IND0.setName("extends");
                                    attrCtx_LVL4_IND0.setParent("PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("CdmEntity");
                                        attrCtx_LVL5_IND0.setParent("PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/extends");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/CdmEntity");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setParent("PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("attributeGroup");
                                        attrCtx_LVL5_IND0.setName("attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setParent("PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                        AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.setType("attributeDefinition");
                                            attrCtx_LVL6_IND0.setName("ID");
                                            attrCtx_LVL6_IND0.setParent("PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND0.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID");
                                            attrCtx_LVL6_IND0.setContextStrings(new ArrayList<String>());
                                            {
                                                attrCtx_LVL6_IND0.getContextStrings().add("PersonContact_Resolved_normalized_structured/hasAttributes/PersonID/members/ID");
                                            }
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.setType("attributeDefinition");
                                            attrCtx_LVL6_IND1.setName("FullName");
                                            attrCtx_LVL6_IND1.setParent("PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND1.setDefinition("resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName");
                                            attrCtx_LVL6_IND1.setContextStrings(new ArrayList<String>());
                                            {
                                                attrCtx_LVL6_IND1.getContextStrings().add("PersonContact_Resolved_normalized_structured/hasAttributes/PersonID/members/FullName");
                                            }
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND1);
                                    }
                                    attrCtx_LVL4_IND1.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("EmailAddress");
                            attrCtx_LVL2_IND1.setParent("PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/EmailAddress");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("PersonContact_Resolved_normalized_structured/hasAttributes/EmailAddress");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("PhoneNumber");
                            attrCtx_LVL2_IND2.setParent("PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PhoneNumber");
                            attrCtx_LVL2_IND2.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND2.getContextStrings().add("PersonContact_Resolved_normalized_structured/hasAttributes/PhoneNumber");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized.setType("entity");
                expectedContext_referenceOnly_normalized.setName("PersonContact_Resolved_referenceOnly_normalized");
                expectedContext_referenceOnly_normalized.setDefinition("resolvedFrom/PersonContact");
                expectedContext_referenceOnly_normalized.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("PersonID");
                            attrCtx_LVL2_IND0.setParent("PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PersonID");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Person");
                                attrCtx_LVL3_IND0.setParent("PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Person");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("generatedSet");
                                attrCtx_LVL3_IND1.setName("_generatedAttributeSet");
                                attrCtx_LVL3_IND1.setParent("PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID");
                                attrCtx_LVL3_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("generatedRound");
                                    attrCtx_LVL4_IND0.setName("_generatedAttributeRound0");
                                    attrCtx_LVL4_IND0.setParent("PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("addedAttributeIdentity");
                                        attrCtx_LVL5_IND0.setName("_foreignKey");
                                        attrCtx_LVL5_IND0.setParent("PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0");
                                        attrCtx_LVL5_IND0.setContextStrings(new ArrayList<String>());
                                        {
                                            attrCtx_LVL5_IND0.getContextStrings().add("PersonContact_Resolved_referenceOnly_normalized/hasAttributes/PersonID");
                                        }
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND1.getContexts().add(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("EmailAddress");
                            attrCtx_LVL2_IND1.setParent("PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/EmailAddress");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("PersonContact_Resolved_referenceOnly_normalized/hasAttributes/EmailAddress");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("PhoneNumber");
                            attrCtx_LVL2_IND2.setParent("PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PhoneNumber");
                            attrCtx_LVL2_IND2.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND2.getContextStrings().add("PersonContact_Resolved_referenceOnly_normalized/hasAttributes/PhoneNumber");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_structured.setType("entity");
                expectedContext_referenceOnly_structured.setName("PersonContact_Resolved_referenceOnly_structured");
                expectedContext_referenceOnly_structured.setDefinition("resolvedFrom/PersonContact");
                expectedContext_referenceOnly_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("PersonID");
                            attrCtx_LVL2_IND0.setParent("PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PersonID");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Person");
                                attrCtx_LVL3_IND0.setParent("PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Person");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("generatedSet");
                                attrCtx_LVL3_IND1.setName("_generatedAttributeSet");
                                attrCtx_LVL3_IND1.setParent("PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID");
                                attrCtx_LVL3_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("generatedRound");
                                    attrCtx_LVL4_IND0.setName("_generatedAttributeRound0");
                                    attrCtx_LVL4_IND0.setParent("PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("addedAttributeIdentity");
                                        attrCtx_LVL5_IND0.setName("_foreignKey");
                                        attrCtx_LVL5_IND0.setParent("PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0");
                                        attrCtx_LVL5_IND0.setContextStrings(new ArrayList<String>());
                                        {
                                            attrCtx_LVL5_IND0.getContextStrings().add("PersonContact_Resolved_referenceOnly_structured/hasAttributes/PersonID/members/PersonID");
                                        }
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND1.getContexts().add(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("EmailAddress");
                            attrCtx_LVL2_IND1.setParent("PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/EmailAddress");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("PersonContact_Resolved_referenceOnly_structured/hasAttributes/EmailAddress");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("PhoneNumber");
                            attrCtx_LVL2_IND2.setParent("PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PhoneNumber");
                            attrCtx_LVL2_IND2.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND2.getContextStrings().add("PersonContact_Resolved_referenceOnly_structured/hasAttributes/PhoneNumber");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized_structured.setType("entity");
                expectedContext_referenceOnly_normalized_structured.setName("PersonContact_Resolved_referenceOnly_normalized_structured");
                expectedContext_referenceOnly_normalized_structured.setDefinition("resolvedFrom/PersonContact");
                expectedContext_referenceOnly_normalized_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("PersonID");
                            attrCtx_LVL2_IND0.setParent("PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PersonID");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Person");
                                attrCtx_LVL3_IND0.setParent("PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Person");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("generatedSet");
                                attrCtx_LVL3_IND1.setName("_generatedAttributeSet");
                                attrCtx_LVL3_IND1.setParent("PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID");
                                attrCtx_LVL3_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("generatedRound");
                                    attrCtx_LVL4_IND0.setName("_generatedAttributeRound0");
                                    attrCtx_LVL4_IND0.setParent("PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("addedAttributeIdentity");
                                        attrCtx_LVL5_IND0.setName("_foreignKey");
                                        attrCtx_LVL5_IND0.setParent("PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0");
                                        attrCtx_LVL5_IND0.setContextStrings(new ArrayList<String>());
                                        {
                                            attrCtx_LVL5_IND0.getContextStrings().add("PersonContact_Resolved_referenceOnly_normalized_structured/hasAttributes/PersonID/members/PersonID");
                                        }
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND1.getContexts().add(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("EmailAddress");
                            attrCtx_LVL2_IND1.setParent("PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/EmailAddress");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("PersonContact_Resolved_referenceOnly_normalized_structured/hasAttributes/EmailAddress");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("PhoneNumber");
                            attrCtx_LVL2_IND2.setParent("PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PhoneNumber");
                            attrCtx_LVL2_IND2.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND2.getContextStrings().add("PersonContact_Resolved_referenceOnly_normalized_structured/hasAttributes/PhoneNumber");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.getContexts().add(attrCtx_LVL0_IND1);
            }

            List<AttributeExpectedValue> expected_default = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0/ID");
                    att1.setDataFormat("Guid");
                    att1.setDisplayName("ID");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_default.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0/FullName");
                    att2.setDataFormat("String");
                    att2.setDisplayName("FullName");
                    att2.setName("FullName");
                    att2.setSourceName("FullName");
                }
                expected_default.add(att2);

                AttributeExpectedValue att3 = new AttributeExpectedValue();
                {
                    att3.setAttributeContext("PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmailAddress");
                    att3.setDataFormat("String");
                    att3.setDisplayName("EmailAddress");
                    att3.setName("EmailAddress");
                    att3.setSourceName("EmailAddress");
                }
                expected_default.add(att3);

                AttributeExpectedValue att4 = new AttributeExpectedValue();
                {
                    att4.setAttributeContext("PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PhoneNumber");
                    att4.setDataFormat("String");
                    att4.setDisplayName("PhoneNumber");
                    att4.setName("PhoneNumber");
                    att4.setSourceName("PhoneNumber");
                }
                expected_default.add(att4);
            }
            List<AttributeExpectedValue> expected_normalized = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0/ID");
                    att1.setDataFormat("Guid");
                    att1.setDisplayName("ID");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_normalized.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0/FullName");
                    att2.setDataFormat("String");
                    att2.setDisplayName("FullName");
                    att2.setName("FullName");
                    att2.setSourceName("FullName");
                }
                expected_normalized.add(att2);

                AttributeExpectedValue att3 = new AttributeExpectedValue();
                {
                    att3.setAttributeContext("PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmailAddress");
                    att3.setDataFormat("String");
                    att3.setDisplayName("EmailAddress");
                    att3.setName("EmailAddress");
                    att3.setSourceName("EmailAddress");
                }
                expected_normalized.add(att3);

                AttributeExpectedValue att4 = new AttributeExpectedValue();
                {
                    att4.setAttributeContext("PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PhoneNumber");
                    att4.setDataFormat("String");
                    att4.setDisplayName("PhoneNumber");
                    att4.setName("PhoneNumber");
                    att4.setSourceName("PhoneNumber");
                }
                expected_normalized.add(att4);
            }
            List<AttributeExpectedValue> expected_referenceOnly = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey");
                    att1.setDataFormat("Guid");
                    att1.setDescription("");
                    att1.setDisplayName("PersonID");
                    att1.setName("PersonID");
                    att1.setSourceName("PersonID");
                }
                expected_referenceOnly.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmailAddress");
                    att2.setDataFormat("String");
                    att2.setDisplayName("EmailAddress");
                    att2.setName("EmailAddress");
                    att2.setSourceName("EmailAddress");
                }
                expected_referenceOnly.add(att2);

                AttributeExpectedValue att3 = new AttributeExpectedValue();
                {
                    att3.setAttributeContext("PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/PhoneNumber");
                    att3.setDataFormat("String");
                    att3.setDisplayName("PhoneNumber");
                    att3.setName("PhoneNumber");
                    att3.setSourceName("PhoneNumber");
                }
                expected_referenceOnly.add(att3);
            }
            List<AttributeExpectedValue> expected_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue attribGroupRef = new AttributeExpectedValue();
                {
                    attribGroupRef.setAttributeGroupName("PersonID");
                    attribGroupRef.setAttributeContext("PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID");
                    attribGroupRef.setMembers(new ArrayList<AttributeExpectedValue>());
                    AttributeExpectedValue att1 = new AttributeExpectedValue();
                    {
                        att1.setAttributeContext("PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                        att1.setDataFormat("Guid");
                        att1.setName("ID");
                    }
                    attribGroupRef.getMembers().add(att1);
                    AttributeExpectedValue att2 = new AttributeExpectedValue();
                    {
                        att2.setAttributeContext("PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName");
                        att2.setDataFormat("String");
                        att2.setName("FullName");
                    }
                    attribGroupRef.getMembers().add(att2);
                    expected_structured.add(attribGroupRef);
                }
                ;
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmailAddress");
                    att1.setDataFormat("String");
                    att1.setDisplayName("EmailAddress");
                    att1.setName("EmailAddress");
                    att1.setSourceName("EmailAddress");
                }
                expected_structured.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PhoneNumber");
                    att2.setDataFormat("String");
                    att2.setDisplayName("PhoneNumber");
                    att2.setName("PhoneNumber");
                    att2.setSourceName("PhoneNumber");
                }
                expected_structured.add(att2);
            }
            List<AttributeExpectedValue> expected_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue attribGroupRef = new AttributeExpectedValue();
                {
                    attribGroupRef.setAttributeGroupName("PersonID");
                    attribGroupRef.setAttributeContext("PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID");
                    attribGroupRef.setMembers(new ArrayList<AttributeExpectedValue>());
                    AttributeExpectedValue att1 = new AttributeExpectedValue();
                    {
                        att1.setAttributeContext("PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                        att1.setDataFormat("Guid");
                        att1.setName("ID");
                    }
                    attribGroupRef.getMembers().add(att1);

                    AttributeExpectedValue att2 = new AttributeExpectedValue();
                    {
                        att2.setAttributeContext("PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName");
                        att2.setDataFormat("String");
                        att2.setName("FullName");
                    }
                    attribGroupRef.getMembers().add(att2);

                    expected_normalized_structured.add(attribGroupRef);
                }
                ;
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmailAddress");
                    att1.setDataFormat("String");
                    att1.setDisplayName("EmailAddress");
                    att1.setName("EmailAddress");
                    att1.setSourceName("EmailAddress");
                }
                expected_normalized_structured.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PhoneNumber");
                    att2.setDataFormat("String");
                    att2.setDisplayName("PhoneNumber");
                    att2.setName("PhoneNumber");
                    att2.setSourceName("PhoneNumber");
                }
                expected_normalized_structured.add(att2);

            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey");
                    att1.setDataFormat("Guid");
                    att1.setDescription("");
                    att1.setDisplayName("PersonID");
                    att1.setName("PersonID");
                    att1.setSourceName("PersonID");
                }
                expected_referenceOnly_normalized.add(att1);
                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmailAddress");
                    att2.setDataFormat("String");
                    att2.setDisplayName("EmailAddress");
                    att2.setName("EmailAddress");
                    att2.setSourceName("EmailAddress");
                }
                expected_referenceOnly_normalized.add(att2);
                AttributeExpectedValue att3 = new AttributeExpectedValue();
                {
                    att3.setAttributeContext("PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PhoneNumber");
                    att3.setDataFormat("String");
                    att3.setDisplayName("PhoneNumber");
                    att3.setName("PhoneNumber");
                    att3.setSourceName("PhoneNumber");
                }
                expected_referenceOnly_normalized.add(att3);
            }
            List<AttributeExpectedValue> expected_referenceOnly_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue attribGroupRef = new AttributeExpectedValue();
                {
                    attribGroupRef.setAttributeGroupName("PersonID");
                    attribGroupRef.setAttributeContext("PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID");
                    attribGroupRef.setMembers(new ArrayList<AttributeExpectedValue>());
                    AttributeExpectedValue att = new AttributeExpectedValue();
                    {
                        att.setAttributeContext("PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey");
                        att.setDataFormat("Guid");
                        att.setDescription("");
                        att.setDisplayName("PersonID");
                        att.setName("PersonID");
                        att.setSourceName("PersonID");
                    }
                    attribGroupRef.getMembers().add(att);

                    expected_referenceOnly_structured.add(attribGroupRef);
                }
                ;
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmailAddress");
                    att1.setDataFormat("String");
                    att1.setDisplayName("EmailAddress");
                    att1.setName("EmailAddress");
                    att1.setSourceName("EmailAddress");
                }
                expected_referenceOnly_structured.add(att1);
                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PhoneNumber");
                    att2.setDataFormat("String");
                    att2.setDisplayName("PhoneNumber");
                    att2.setName("PhoneNumber");
                    att2.setSourceName("PhoneNumber");
                }
                expected_referenceOnly_structured.add(att2);
            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue attribGroupRef = new AttributeExpectedValue();
                {
                    attribGroupRef.setAttributeGroupName("PersonID");
                    attribGroupRef.setAttributeContext("PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID");
                    attribGroupRef.setMembers(new ArrayList<AttributeExpectedValue>());
                    AttributeExpectedValue att = new AttributeExpectedValue();
                    {
                        att.setAttributeContext("PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey");
                        att.setDataFormat("Guid");
                        att.setDescription("");
                        att.setDisplayName("PersonID");
                        att.setName("PersonID");
                        att.setSourceName("PersonID");
                    }
                    attribGroupRef.getMembers().add(att);

                    expected_referenceOnly_normalized_structured.add(attribGroupRef);
                }
                ;
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmailAddress");
                    att1.setDataFormat("String");
                    att1.setDisplayName("EmailAddress");
                    att1.setName("EmailAddress");
                    att1.setSourceName("EmailAddress");
                }
                expected_referenceOnly_normalized_structured.add(att1);
                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PhoneNumber");
                    att2.setDataFormat("String");
                    att2.setDisplayName("PhoneNumber");
                    att2.setName("PhoneNumber");
                    att2.setSourceName("PhoneNumber");
                }
                expected_referenceOnly_normalized_structured.add(att2);
            }

            runTestWithValues(
                    testName,
                    entityName,

                    expectedContext_default,
                    expectedContext_normalized,
                    expectedContext_referenceOnly,
                    expectedContext_structured,
                    expectedContext_normalized_structured,
                    expectedContext_referenceOnly_normalized,
                    expectedContext_referenceOnly_structured,
                    expectedContext_referenceOnly_normalized_structured,

                    expected_default,
                    expected_normalized,
                    expected_referenceOnly,
                    expected_structured,
                    expected_normalized_structured,
                    expected_referenceOnly_normalized,
                    expected_referenceOnly_structured,
                    expected_referenceOnly_normalized_structured
            ).join();
        }
    }

    /**
     * Resolution Guidance Test - Many:Many Cardinality
     */
    @Test
    public void testForeignKeyManyToManyCardinality() {
        String testName = "testForeignKeyManyToManyCardinality";
        {
            String entityName = "Customer";

            AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
            {
                expectedContext_default.setType("entity");
                expectedContext_default.setName("Customer_Resolved_default");
                expectedContext_default.setDefinition("resolvedFrom/Customer");
                expectedContext_default.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Customer_Resolved_default/attributeContext/Customer_Resolved_default");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_default/attributeContext/Customer_Resolved_default/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_default.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_default/attributeContext/Customer_Resolved_default");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_default/attributeContext/Customer_Resolved_default/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_default/attributeContext/Customer_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Customer_Resolved_default/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("Name");
                            attrCtx_LVL2_IND1.setParent("Customer_Resolved_default/attributeContext/Customer_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/Name");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Customer_Resolved_default/hasAttributes/Name");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_default.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
            {
                expectedContext_normalized.setType("entity");
                expectedContext_normalized.setName("Customer_Resolved_normalized");
                expectedContext_normalized.setDefinition("resolvedFrom/Customer");
                expectedContext_normalized.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Customer_Resolved_normalized/attributeContext/Customer_Resolved_normalized");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_normalized/attributeContext/Customer_Resolved_normalized/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_normalized/attributeContext/Customer_Resolved_normalized");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_normalized/attributeContext/Customer_Resolved_normalized/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_normalized/attributeContext/Customer_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Customer_Resolved_normalized/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("Name");
                            attrCtx_LVL2_IND1.setParent("Customer_Resolved_normalized/attributeContext/Customer_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/Name");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Customer_Resolved_normalized/hasAttributes/Name");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly.setType("entity");
                expectedContext_referenceOnly.setName("Customer_Resolved_referenceOnly");
                expectedContext_referenceOnly.setDefinition("resolvedFrom/Customer");
                expectedContext_referenceOnly.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Customer_Resolved_referenceOnly/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("Name");
                            attrCtx_LVL2_IND1.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/Name");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Customer_Resolved_referenceOnly/hasAttributes/Name");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
            {
                expectedContext_structured.setType("entity");
                expectedContext_structured.setName("Customer_Resolved_structured");
                expectedContext_structured.setDefinition("resolvedFrom/Customer");
                expectedContext_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Customer_Resolved_structured/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("Name");
                            attrCtx_LVL2_IND1.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/Name");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Customer_Resolved_structured/hasAttributes/Name");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
            {
                expectedContext_normalized_structured.setType("entity");
                expectedContext_normalized_structured.setName("Customer_Resolved_normalized_structured");
                expectedContext_normalized_structured.setDefinition("resolvedFrom/Customer");
                expectedContext_normalized_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Customer_Resolved_normalized_structured/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("Name");
                            attrCtx_LVL2_IND1.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/Name");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Customer_Resolved_normalized_structured/hasAttributes/Name");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized.setType("entity");
                expectedContext_referenceOnly_normalized.setName("Customer_Resolved_referenceOnly_normalized");
                expectedContext_referenceOnly_normalized.setDefinition("resolvedFrom/Customer");
                expectedContext_referenceOnly_normalized.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Customer_Resolved_referenceOnly_normalized/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("Name");
                            attrCtx_LVL2_IND1.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/Name");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Customer_Resolved_referenceOnly_normalized/hasAttributes/Name");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_structured.setType("entity");
                expectedContext_referenceOnly_structured.setName("Customer_Resolved_referenceOnly_structured");
                expectedContext_referenceOnly_structured.setDefinition("resolvedFrom/Customer");
                expectedContext_referenceOnly_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Customer_Resolved_referenceOnly_structured/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("Name");
                            attrCtx_LVL2_IND1.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/Name");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Customer_Resolved_referenceOnly_structured/hasAttributes/Name");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized_structured.setType("entity");
                expectedContext_referenceOnly_normalized_structured.setName("Customer_Resolved_referenceOnly_normalized_structured");
                expectedContext_referenceOnly_normalized_structured.setDefinition("resolvedFrom/Customer");
                expectedContext_referenceOnly_normalized_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Customer_Resolved_referenceOnly_normalized_structured/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("Name");
                            attrCtx_LVL2_IND1.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/Name");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Customer_Resolved_referenceOnly_normalized_structured/hasAttributes/Name");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.getContexts().add(attrCtx_LVL0_IND1);
            }

            List<AttributeExpectedValue> expected_default = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Customer_Resolved_default/attributeContext/Customer_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_default.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Customer_Resolved_default/attributeContext/Customer_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                    att.setDataFormat("String");
                    att.setDisplayName("Name");
                    att.setName("Name");
                    att.setSourceName("Name");
                }
                expected_default.add(att);
            }
            List<AttributeExpectedValue> expected_normalized = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Customer_Resolved_normalized/attributeContext/Customer_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_normalized.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Customer_Resolved_normalized/attributeContext/Customer_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                    att.setDataFormat("String");
                    att.setDisplayName("Name");
                    att.setName("Name");
                    att.setSourceName("Name");
                }
                expected_normalized.add(att);
            }
            List<AttributeExpectedValue> expected_referenceOnly = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_referenceOnly.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                    att.setDataFormat("String");
                    att.setDisplayName("Name");
                    att.setName("Name");
                    att.setSourceName("Name");
                }
                expected_referenceOnly.add(att);
            }
            List<AttributeExpectedValue> expected_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_structured.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                    att.setDataFormat("String");
                    att.setDisplayName("Name");
                    att.setName("Name");
                    att.setSourceName("Name");
                }
                expected_structured.add(att);
            }
            List<AttributeExpectedValue> expected_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_normalized_structured.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                    att.setDataFormat("String");
                    att.setDisplayName("Name");
                    att.setName("Name");
                    att.setSourceName("Name");
                }
                expected_normalized_structured.add(att);
            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_referenceOnly_normalized.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                    att.setDataFormat("String");
                    att.setDisplayName("Name");
                    att.setName("Name");
                    att.setSourceName("Name");
                }
                expected_referenceOnly_normalized.add(att);
            }
            List<AttributeExpectedValue> expected_referenceOnly_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_referenceOnly_structured.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                    att.setDataFormat("String");
                    att.setDisplayName("Name");
                    att.setName("Name");
                    att.setSourceName("Name");
                }
                expected_referenceOnly_structured.add(att);
            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_referenceOnly_normalized_structured.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                    att.setDataFormat("String");
                    att.setDisplayName("Name");
                    att.setName("Name");
                    att.setSourceName("Name");
                }
                expected_referenceOnly_normalized_structured.add(att);
            }

            runTestWithValues(
                    testName,
                    entityName,

                    expectedContext_default,
                    expectedContext_normalized,
                    expectedContext_referenceOnly,
                    expectedContext_structured,
                    expectedContext_normalized_structured,
                    expectedContext_referenceOnly_normalized,
                    expectedContext_referenceOnly_structured,
                    expectedContext_referenceOnly_normalized_structured,

                    expected_default,
                    expected_normalized,
                    expected_referenceOnly,
                    expected_structured,
                    expected_normalized_structured,
                    expected_referenceOnly_normalized,
                    expected_referenceOnly_structured,
                    expected_referenceOnly_normalized_structured
            ).join();
        }
        {
            String entityName = "Product";

            AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
            {
                expectedContext_default.setType("entity");
                expectedContext_default.setName("Product_Resolved_default");
                expectedContext_default.setDefinition("resolvedFrom/Product");
                expectedContext_default.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Product_Resolved_default/attributeContext/Product_Resolved_default");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Product_Resolved_default/attributeContext/Product_Resolved_default/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_default.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Product_Resolved_default/attributeContext/Product_Resolved_default");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Product_Resolved_default/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("Name");
                            attrCtx_LVL2_IND1.setParent("Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/Name");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Product_Resolved_default/hasAttributes/Name");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_default.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
            {
                expectedContext_normalized.setType("entity");
                expectedContext_normalized.setName("Product_Resolved_normalized");
                expectedContext_normalized.setDefinition("resolvedFrom/Product");
                expectedContext_normalized.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Product_Resolved_normalized/attributeContext/Product_Resolved_normalized");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Product_Resolved_normalized/attributeContext/Product_Resolved_normalized");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Product_Resolved_normalized/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("Name");
                            attrCtx_LVL2_IND1.setParent("Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/Name");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Product_Resolved_normalized/hasAttributes/Name");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly.setType("entity");
                expectedContext_referenceOnly.setName("Product_Resolved_referenceOnly");
                expectedContext_referenceOnly.setDefinition("resolvedFrom/Product");
                expectedContext_referenceOnly.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Product_Resolved_referenceOnly/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("Name");
                            attrCtx_LVL2_IND1.setParent("Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/Name");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Product_Resolved_referenceOnly/hasAttributes/Name");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
            {
                expectedContext_structured.setType("entity");
                expectedContext_structured.setName("Product_Resolved_structured");
                expectedContext_structured.setDefinition("resolvedFrom/Product");
                expectedContext_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Product_Resolved_structured/attributeContext/Product_Resolved_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Product_Resolved_structured/attributeContext/Product_Resolved_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Product_Resolved_structured/attributeContext/Product_Resolved_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Product_Resolved_structured/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("Name");
                            attrCtx_LVL2_IND1.setParent("Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/Name");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Product_Resolved_structured/hasAttributes/Name");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
            {
                expectedContext_normalized_structured.setType("entity");
                expectedContext_normalized_structured.setName("Product_Resolved_normalized_structured");
                expectedContext_normalized_structured.setDefinition("resolvedFrom/Product");
                expectedContext_normalized_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Product_Resolved_normalized_structured/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("Name");
                            attrCtx_LVL2_IND1.setParent("Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/Name");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Product_Resolved_normalized_structured/hasAttributes/Name");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized.setType("entity");
                expectedContext_referenceOnly_normalized.setName("Product_Resolved_referenceOnly_normalized");
                expectedContext_referenceOnly_normalized.setDefinition("resolvedFrom/Product");
                expectedContext_referenceOnly_normalized.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Product_Resolved_referenceOnly_normalized/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("Name");
                            attrCtx_LVL2_IND1.setParent("Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/Name");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Product_Resolved_referenceOnly_normalized/hasAttributes/Name");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_structured.setType("entity");
                expectedContext_referenceOnly_structured.setName("Product_Resolved_referenceOnly_structured");
                expectedContext_referenceOnly_structured.setDefinition("resolvedFrom/Product");
                expectedContext_referenceOnly_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Product_Resolved_referenceOnly_structured/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("Name");
                            attrCtx_LVL2_IND1.setParent("Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/Name");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Product_Resolved_referenceOnly_structured/hasAttributes/Name");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized_structured.setType("entity");
                expectedContext_referenceOnly_normalized_structured.setName("Product_Resolved_referenceOnly_normalized_structured");
                expectedContext_referenceOnly_normalized_structured.setDefinition("resolvedFrom/Product");
                expectedContext_referenceOnly_normalized_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Product_Resolved_referenceOnly_normalized_structured/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("Name");
                            attrCtx_LVL2_IND1.setParent("Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/Name");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Product_Resolved_referenceOnly_normalized_structured/hasAttributes/Name");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.getContexts().add(attrCtx_LVL0_IND1);
            }

            List<AttributeExpectedValue> expected_default = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_default.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                    att.setDataFormat("String");
                    att.setDisplayName("Name");
                    att.setName("Name");
                    att.setSourceName("Name");
                }
                expected_default.add(att);
            }
            List<AttributeExpectedValue> expected_normalized = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_normalized.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                    att.setDataFormat("String");
                    att.setDisplayName("Name");
                    att.setName("Name");
                    att.setSourceName("Name");
                }
                expected_normalized.add(att);
            }
            List<AttributeExpectedValue> expected_referenceOnly = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_referenceOnly.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                    att.setDataFormat("String");
                    att.setDisplayName("Name");
                    att.setName("Name");
                    att.setSourceName("Name");
                }
                expected_referenceOnly.add(att);
            }
            List<AttributeExpectedValue> expected_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_structured.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                    att.setDataFormat("String");
                    att.setDisplayName("Name");
                    att.setName("Name");
                    att.setSourceName("Name");
                }
                expected_structured.add(att);
            }
            List<AttributeExpectedValue> expected_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_normalized_structured.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                    att.setDataFormat("String");
                    att.setDisplayName("Name");
                    att.setName("Name");
                    att.setSourceName("Name");
                }
                expected_normalized_structured.add(att);
            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_referenceOnly_normalized.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                    att.setDataFormat("String");
                    att.setDisplayName("Name");
                    att.setName("Name");
                    att.setSourceName("Name");
                }
                expected_referenceOnly_normalized.add(att);
            }
            List<AttributeExpectedValue> expected_referenceOnly_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_referenceOnly_structured.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                    att.setDataFormat("String");
                    att.setDisplayName("Name");
                    att.setName("Name");
                    att.setSourceName("Name");
                }
                expected_referenceOnly_structured.add(att);
            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_referenceOnly_normalized_structured.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                    att.setDataFormat("String");
                    att.setDisplayName("Name");
                    att.setName("Name");
                    att.setSourceName("Name");
                }
                expected_referenceOnly_normalized_structured.add(att);
            }

            runTestWithValues(
                    testName,
                    entityName,

                    expectedContext_default,
                    expectedContext_normalized,
                    expectedContext_referenceOnly,
                    expectedContext_structured,
                    expectedContext_normalized_structured,
                    expectedContext_referenceOnly_normalized,
                    expectedContext_referenceOnly_structured,
                    expectedContext_referenceOnly_normalized_structured,

                    expected_default,
                    expected_normalized,
                    expected_referenceOnly,
                    expected_structured,
                    expected_normalized_structured,
                    expected_referenceOnly_normalized,
                    expected_referenceOnly_structured,
                    expected_referenceOnly_normalized_structured
            ).join();
        }
        {
            String entityName = "Sales";

            AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
            {
                expectedContext_default.setType("entity");
                expectedContext_default.setName("Sales_Resolved_default");
                expectedContext_default.setDefinition("resolvedFrom/Sales");
                expectedContext_default.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Sales_Resolved_default/attributeContext/Sales_Resolved_default");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Sales_Resolved_default/attributeContext/Sales_Resolved_default/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_default.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Sales_Resolved_default/attributeContext/Sales_Resolved_default");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("CustomerID");
                            attrCtx_LVL2_IND0.setParent("Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/CustomerID");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Customer");
                                attrCtx_LVL3_IND0.setParent("Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Customer");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("entityReferenceExtends");
                                    attrCtx_LVL4_IND0.setName("extends");
                                    attrCtx_LVL4_IND0.setParent("Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("CdmEntity");
                                        attrCtx_LVL5_IND0.setParent("Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/extends");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/CdmEntity");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setParent("Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("attributeGroup");
                                        attrCtx_LVL5_IND0.setName("attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setParent("Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                        AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.setType("attributeDefinition");
                                            attrCtx_LVL6_IND0.setName("ID");
                                            attrCtx_LVL6_IND0.setParent("Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/ID");
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.setType("attributeDefinition");
                                            attrCtx_LVL6_IND1.setName("Name");
                                            attrCtx_LVL6_IND1.setParent("Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/Name");
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND1);
                                    }
                                    attrCtx_LVL4_IND1.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("generatedSet");
                                attrCtx_LVL3_IND1.setName("_generatedAttributeSet");
                                attrCtx_LVL3_IND1.setParent("Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID");
                                attrCtx_LVL3_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("addedAttributeExpansionTotal");
                                    attrCtx_LVL4_IND0.setName("CustomerCount");
                                    attrCtx_LVL4_IND0.setParent("Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/_generatedAttributeSet");
                                    attrCtx_LVL4_IND0.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/CustomerID/resolutionGuidance/countAttribute/CustomerCount");
                                    attrCtx_LVL4_IND0.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND0.getContextStrings().add("Sales_Resolved_default/hasAttributes/CustomerCount");
                                    }
                                }
                                attrCtx_LVL3_IND1.getContexts().add(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("ProductID");
                            attrCtx_LVL2_IND1.setParent("Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/ProductID");
                            attrCtx_LVL2_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Product");
                                attrCtx_LVL3_IND0.setParent("Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Product");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("entityReferenceExtends");
                                    attrCtx_LVL4_IND0.setName("extends");
                                    attrCtx_LVL4_IND0.setParent("Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("CdmEntity");
                                        attrCtx_LVL5_IND0.setParent("Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/extends");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/CdmEntity");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setParent("Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("attributeGroup");
                                        attrCtx_LVL5_IND0.setName("attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setParent("Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                        AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.setType("attributeDefinition");
                                            attrCtx_LVL6_IND0.setName("ID");
                                            attrCtx_LVL6_IND0.setParent("Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND0.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID");
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.setType("attributeDefinition");
                                            attrCtx_LVL6_IND1.setName("Name");
                                            attrCtx_LVL6_IND1.setParent("Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/Name");
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND1);
                                    }
                                    attrCtx_LVL4_IND1.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("generatedSet");
                                attrCtx_LVL3_IND1.setName("_generatedAttributeSet");
                                attrCtx_LVL3_IND1.setParent("Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID");
                                attrCtx_LVL3_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("addedAttributeExpansionTotal");
                                    attrCtx_LVL4_IND0.setName("ProductCount");
                                    attrCtx_LVL4_IND0.setParent("Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/_generatedAttributeSet");
                                    attrCtx_LVL4_IND0.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/ProductID/resolutionGuidance/countAttribute/ProductCount");
                                    attrCtx_LVL4_IND0.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND0.getContextStrings().add("Sales_Resolved_default/hasAttributes/ProductCount");
                                    }
                                }
                                attrCtx_LVL3_IND1.getContexts().add(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_default.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
            {
                expectedContext_normalized.setType("entity");
                expectedContext_normalized.setName("Sales_Resolved_normalized");
                expectedContext_normalized.setDefinition("resolvedFrom/Sales");
                expectedContext_normalized.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("CustomerID");
                            attrCtx_LVL2_IND0.setParent("Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/CustomerID");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Customer");
                                attrCtx_LVL3_IND0.setParent("Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Customer");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("entityReferenceExtends");
                                    attrCtx_LVL4_IND0.setName("extends");
                                    attrCtx_LVL4_IND0.setParent("Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("CdmEntity");
                                        attrCtx_LVL5_IND0.setParent("Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/extends");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/CdmEntity");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setParent("Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("attributeGroup");
                                        attrCtx_LVL5_IND0.setName("attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setParent("Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                        AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.setType("attributeDefinition");
                                            attrCtx_LVL6_IND0.setName("ID");
                                            attrCtx_LVL6_IND0.setParent("Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/ID");
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.setType("attributeDefinition");
                                            attrCtx_LVL6_IND1.setName("Name");
                                            attrCtx_LVL6_IND1.setParent("Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/Name");
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND1);
                                    }
                                    attrCtx_LVL4_IND1.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("ProductID");
                            attrCtx_LVL2_IND1.setParent("Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/ProductID");
                            attrCtx_LVL2_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Product");
                                attrCtx_LVL3_IND0.setParent("Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Product");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("entityReferenceExtends");
                                    attrCtx_LVL4_IND0.setName("extends");
                                    attrCtx_LVL4_IND0.setParent("Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("CdmEntity");
                                        attrCtx_LVL5_IND0.setParent("Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/extends");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/CdmEntity");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setParent("Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("attributeGroup");
                                        attrCtx_LVL5_IND0.setName("attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setParent("Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                        AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.setType("attributeDefinition");
                                            attrCtx_LVL6_IND0.setName("ID");
                                            attrCtx_LVL6_IND0.setParent("Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND0.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID");
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.setType("attributeDefinition");
                                            attrCtx_LVL6_IND1.setName("Name");
                                            attrCtx_LVL6_IND1.setParent("Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/Name");
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND1);
                                    }
                                    attrCtx_LVL4_IND1.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly.setType("entity");
                expectedContext_referenceOnly.setName("Sales_Resolved_referenceOnly");
                expectedContext_referenceOnly.setDefinition("resolvedFrom/Sales");
                expectedContext_referenceOnly.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("CustomerID");
                            attrCtx_LVL2_IND0.setParent("Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/CustomerID");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Customer");
                                attrCtx_LVL3_IND0.setParent("Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Customer");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("generatedSet");
                                attrCtx_LVL3_IND1.setName("_generatedAttributeSet");
                                attrCtx_LVL3_IND1.setParent("Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID");
                                attrCtx_LVL3_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("addedAttributeExpansionTotal");
                                    attrCtx_LVL4_IND0.setName("CustomerCount");
                                    attrCtx_LVL4_IND0.setParent("Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/_generatedAttributeSet");
                                    attrCtx_LVL4_IND0.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/CustomerID/resolutionGuidance/countAttribute/CustomerCount");
                                    attrCtx_LVL4_IND0.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND0.getContextStrings().add("Sales_Resolved_referenceOnly/hasAttributes/CustomerCount");
                                    }
                                }
                                attrCtx_LVL3_IND1.getContexts().add(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("ProductID");
                            attrCtx_LVL2_IND1.setParent("Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/ProductID");
                            attrCtx_LVL2_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Product");
                                attrCtx_LVL3_IND0.setParent("Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Product");
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("generatedSet");
                                attrCtx_LVL3_IND1.setName("_generatedAttributeSet");
                                attrCtx_LVL3_IND1.setParent("Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID");
                                attrCtx_LVL3_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("addedAttributeExpansionTotal");
                                    attrCtx_LVL4_IND0.setName("ProductCount");
                                    attrCtx_LVL4_IND0.setParent("Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/_generatedAttributeSet");
                                    attrCtx_LVL4_IND0.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/ProductID/resolutionGuidance/countAttribute/ProductCount");
                                    attrCtx_LVL4_IND0.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND0.getContextStrings().add("Sales_Resolved_referenceOnly/hasAttributes/ProductCount");
                                    }
                                }
                                attrCtx_LVL3_IND1.getContexts().add(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
            {
                expectedContext_structured.setType("entity");
                expectedContext_structured.setName("Sales_Resolved_structured");
                expectedContext_structured.setDefinition("resolvedFrom/Sales");
                expectedContext_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("CustomerID");
                            attrCtx_LVL2_IND0.setParent("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/CustomerID");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Customer");
                                attrCtx_LVL3_IND0.setParent("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Customer");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("entityReferenceExtends");
                                    attrCtx_LVL4_IND0.setName("extends");
                                    attrCtx_LVL4_IND0.setParent("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("CdmEntity");
                                        attrCtx_LVL5_IND0.setParent("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/extends");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/CdmEntity");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setParent("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("attributeGroup");
                                        attrCtx_LVL5_IND0.setName("attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setParent("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                        AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.setType("attributeDefinition");
                                            attrCtx_LVL6_IND0.setName("ID");
                                            attrCtx_LVL6_IND0.setParent("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/ID");
                                            attrCtx_LVL6_IND0.setContextStrings(new ArrayList<String>());
                                            {
                                                attrCtx_LVL6_IND0.getContextStrings().add("Sales_Resolved_structured/hasAttributes/CustomerID/members/ID");
                                            }
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.setType("attributeDefinition");
                                            attrCtx_LVL6_IND1.setName("Name");
                                            attrCtx_LVL6_IND1.setParent("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/Name");
                                            attrCtx_LVL6_IND1.setContextStrings(new ArrayList<String>());
                                            {
                                                attrCtx_LVL6_IND1.getContextStrings().add("Sales_Resolved_structured/hasAttributes/CustomerID/members/Name");
                                            }
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND1);
                                    }
                                    attrCtx_LVL4_IND1.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("ProductID");
                            attrCtx_LVL2_IND1.setParent("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/ProductID");
                            attrCtx_LVL2_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Product");
                                attrCtx_LVL3_IND0.setParent("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Product");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("entityReferenceExtends");
                                    attrCtx_LVL4_IND0.setName("extends");
                                    attrCtx_LVL4_IND0.setParent("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("CdmEntity");
                                        attrCtx_LVL5_IND0.setParent("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/extends");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/CdmEntity");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setParent("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("attributeGroup");
                                        attrCtx_LVL5_IND0.setName("attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setParent("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                        AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.setType("attributeDefinition");
                                            attrCtx_LVL6_IND0.setName("ID");
                                            attrCtx_LVL6_IND0.setParent("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND0.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID");
                                            attrCtx_LVL6_IND0.setContextStrings(new ArrayList<String>());
                                            {
                                                attrCtx_LVL6_IND0.getContextStrings().add("Sales_Resolved_structured/hasAttributes/ProductID/members/ID");
                                            }
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.setType("attributeDefinition");
                                            attrCtx_LVL6_IND1.setName("Name");
                                            attrCtx_LVL6_IND1.setParent("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/Name");
                                            attrCtx_LVL6_IND1.setContextStrings(new ArrayList<String>());
                                            {
                                                attrCtx_LVL6_IND1.getContextStrings().add("Sales_Resolved_structured/hasAttributes/ProductID/members/Name");
                                            }
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND1);
                                    }
                                    attrCtx_LVL4_IND1.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
            {
                expectedContext_normalized_structured.setType("entity");
                expectedContext_normalized_structured.setName("Sales_Resolved_normalized_structured");
                expectedContext_normalized_structured.setDefinition("resolvedFrom/Sales");
                expectedContext_normalized_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("CustomerID");
                            attrCtx_LVL2_IND0.setParent("Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/CustomerID");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Customer");
                                attrCtx_LVL3_IND0.setParent("Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Customer");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("entityReferenceExtends");
                                    attrCtx_LVL4_IND0.setName("extends");
                                    attrCtx_LVL4_IND0.setParent("Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("CdmEntity");
                                        attrCtx_LVL5_IND0.setParent("Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/extends");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/CdmEntity");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setParent("Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("attributeGroup");
                                        attrCtx_LVL5_IND0.setName("attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setParent("Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                        AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.setType("attributeDefinition");
                                            attrCtx_LVL6_IND0.setName("ID");
                                            attrCtx_LVL6_IND0.setParent("Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/ID");
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.setType("attributeDefinition");
                                            attrCtx_LVL6_IND1.setName("Name");
                                            attrCtx_LVL6_IND1.setParent("Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/Name");
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND1);
                                    }
                                    attrCtx_LVL4_IND1.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("ProductID");
                            attrCtx_LVL2_IND1.setParent("Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/ProductID");
                            attrCtx_LVL2_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Product");
                                attrCtx_LVL3_IND0.setParent("Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Product");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("entityReferenceExtends");
                                    attrCtx_LVL4_IND0.setName("extends");
                                    attrCtx_LVL4_IND0.setParent("Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("CdmEntity");
                                        attrCtx_LVL5_IND0.setParent("Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/extends");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/CdmEntity");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setParent("Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("attributeGroup");
                                        attrCtx_LVL5_IND0.setName("attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setParent("Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                        AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.setType("attributeDefinition");
                                            attrCtx_LVL6_IND0.setName("ID");
                                            attrCtx_LVL6_IND0.setParent("Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND0.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID");
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.setType("attributeDefinition");
                                            attrCtx_LVL6_IND1.setName("Name");
                                            attrCtx_LVL6_IND1.setParent("Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/Name");
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND1);
                                    }
                                    attrCtx_LVL4_IND1.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized.setType("entity");
                expectedContext_referenceOnly_normalized.setName("Sales_Resolved_referenceOnly_normalized");
                expectedContext_referenceOnly_normalized.setDefinition("resolvedFrom/Sales");
                expectedContext_referenceOnly_normalized.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Sales_Resolved_referenceOnly_normalized/attributeContext/Sales_Resolved_referenceOnly_normalized");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Sales_Resolved_referenceOnly_normalized/attributeContext/Sales_Resolved_referenceOnly_normalized/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Sales_Resolved_referenceOnly_normalized/attributeContext/Sales_Resolved_referenceOnly_normalized");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Sales_Resolved_referenceOnly_normalized/attributeContext/Sales_Resolved_referenceOnly_normalized/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("CustomerID");
                            attrCtx_LVL2_IND0.setParent("Sales_Resolved_referenceOnly_normalized/attributeContext/Sales_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/CustomerID");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Customer");
                                attrCtx_LVL3_IND0.setParent("Sales_Resolved_referenceOnly_normalized/attributeContext/Sales_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Customer");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("ProductID");
                            attrCtx_LVL2_IND1.setParent("Sales_Resolved_referenceOnly_normalized/attributeContext/Sales_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/ProductID");
                            attrCtx_LVL2_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Product");
                                attrCtx_LVL3_IND0.setParent("Sales_Resolved_referenceOnly_normalized/attributeContext/Sales_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Product");
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_structured.setType("entity");
                expectedContext_referenceOnly_structured.setName("Sales_Resolved_referenceOnly_structured");
                expectedContext_referenceOnly_structured.setDefinition("resolvedFrom/Sales");
                expectedContext_referenceOnly_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("CustomerID");
                            attrCtx_LVL2_IND0.setParent("Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/CustomerID");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Customer");
                                attrCtx_LVL3_IND0.setParent("Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Customer");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("generatedSet");
                                attrCtx_LVL3_IND1.setName("_generatedAttributeSet");
                                attrCtx_LVL3_IND1.setParent("Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID");
                                attrCtx_LVL3_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("generatedRound");
                                    attrCtx_LVL4_IND0.setName("_generatedAttributeRound0");
                                    attrCtx_LVL4_IND0.setParent("Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/_generatedAttributeSet");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("addedAttributeIdentity");
                                        attrCtx_LVL5_IND0.setName("_foreignKey");
                                        attrCtx_LVL5_IND0.setParent("Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/_generatedAttributeSet/_generatedAttributeRound0");
                                        attrCtx_LVL5_IND0.setContextStrings(new ArrayList<String>());
                                        {
                                            attrCtx_LVL5_IND0.getContextStrings().add("Sales_Resolved_referenceOnly_structured/hasAttributes/CustomerID/members/CustomerID");
                                        }
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND1.getContexts().add(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("ProductID");
                            attrCtx_LVL2_IND1.setParent("Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/ProductID");
                            attrCtx_LVL2_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Product");
                                attrCtx_LVL3_IND0.setParent("Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Product");
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("generatedSet");
                                attrCtx_LVL3_IND1.setName("_generatedAttributeSet");
                                attrCtx_LVL3_IND1.setParent("Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID");
                                attrCtx_LVL3_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("generatedRound");
                                    attrCtx_LVL4_IND0.setName("_generatedAttributeRound0");
                                    attrCtx_LVL4_IND0.setParent("Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/_generatedAttributeSet");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("addedAttributeIdentity");
                                        attrCtx_LVL5_IND0.setName("_foreignKey");
                                        attrCtx_LVL5_IND0.setParent("Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/_generatedAttributeSet/_generatedAttributeRound0");
                                        attrCtx_LVL5_IND0.setContextStrings(new ArrayList<String>());
                                        {
                                            attrCtx_LVL5_IND0.getContextStrings().add("Sales_Resolved_referenceOnly_structured/hasAttributes/ProductID/members/ProductID");
                                        }
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND1.getContexts().add(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized_structured.setType("entity");
                expectedContext_referenceOnly_normalized_structured.setName("Sales_Resolved_referenceOnly_normalized_structured");
                expectedContext_referenceOnly_normalized_structured.setDefinition("resolvedFrom/Sales");
                expectedContext_referenceOnly_normalized_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Sales_Resolved_referenceOnly_normalized_structured/attributeContext/Sales_Resolved_referenceOnly_normalized_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Sales_Resolved_referenceOnly_normalized_structured/attributeContext/Sales_Resolved_referenceOnly_normalized_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Sales_Resolved_referenceOnly_normalized_structured/attributeContext/Sales_Resolved_referenceOnly_normalized_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Sales_Resolved_referenceOnly_normalized_structured/attributeContext/Sales_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("CustomerID");
                            attrCtx_LVL2_IND0.setParent("Sales_Resolved_referenceOnly_normalized_structured/attributeContext/Sales_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/CustomerID");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Customer");
                                attrCtx_LVL3_IND0.setParent("Sales_Resolved_referenceOnly_normalized_structured/attributeContext/Sales_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Customer");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("ProductID");
                            attrCtx_LVL2_IND1.setParent("Sales_Resolved_referenceOnly_normalized_structured/attributeContext/Sales_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/ProductID");
                            attrCtx_LVL2_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Product");
                                attrCtx_LVL3_IND0.setParent("Sales_Resolved_referenceOnly_normalized_structured/attributeContext/Sales_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Product");
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.getContexts().add(attrCtx_LVL0_IND1);
            }

            List<AttributeExpectedValue> expected_default = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/_generatedAttributeSet/CustomerCount");
                    att.setDataFormat("Int32");
                    att.setName("CustomerCount");
                }
                expected_default.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/_generatedAttributeSet/ProductCount");
                    att.setDataFormat("Int32");
                    att.setName("ProductCount");
                }
                expected_default.add(att);
            }
            List<AttributeExpectedValue> expected_normalized = new ArrayList<AttributeExpectedValue>();
            {
            }
            List<AttributeExpectedValue> expected_referenceOnly = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/_generatedAttributeSet/CustomerCount");
                    att.setDataFormat("Int32");
                    att.setName("CustomerCount");
                }
                expected_referenceOnly.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/_generatedAttributeSet/ProductCount");
                    att.setDataFormat("Int32");
                    att.setName("ProductCount");
                }
                expected_referenceOnly.add(att);
            }
            List<AttributeExpectedValue> expected_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue attribGroupRef1 = new AttributeExpectedValue();
                {
                    attribGroupRef1.setAttributeGroupName("CustomerID");
                    attribGroupRef1.setAttributeContext("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID");
                    attribGroupRef1.setMembers(new ArrayList<AttributeExpectedValue>());
                    AttributeExpectedValue att = new AttributeExpectedValue();
                    {
                        att.setAttributeContext("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                        att.setDataFormat("Guid");
                        att.setName("ID");
                    }
                    attribGroupRef1.getMembers().add(att);
                    att = new AttributeExpectedValue();
                    {
                        att.setAttributeContext("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                        att.setDataFormat("String");
                        att.setName("Name");
                    }
                    attribGroupRef1.getMembers().add(att);
                    expected_structured.add(attribGroupRef1);
                };
                AttributeExpectedValue attribGroupRef2 = new AttributeExpectedValue();
                {
                    attribGroupRef2.setAttributeGroupName("ProductID");
                    attribGroupRef2.setAttributeContext("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID");
                    attribGroupRef2.setMembers(new ArrayList<AttributeExpectedValue>());
                    AttributeExpectedValue att = new AttributeExpectedValue();
                    {
                        att.setAttributeContext("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                        att.setDataFormat("Guid");
                        att.setName("ID");
                    }
                    attribGroupRef2.getMembers().add(att);
                    att = new AttributeExpectedValue();
                    {
                        att.setAttributeContext("Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                        att.setDataFormat("String");
                        att.setName("Name");
                    }
                    attribGroupRef2.getMembers().add(att);
                    expected_structured.add(attribGroupRef2);
                };
            }
            List<AttributeExpectedValue> expected_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized = new ArrayList<AttributeExpectedValue>();
            {
            }
            List<AttributeExpectedValue> expected_referenceOnly_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue attribGroupRef1 = new AttributeExpectedValue();
                {
                    attribGroupRef1.setAttributeGroupName("CustomerID");
                    attribGroupRef1.setAttributeContext("Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID");
                    attribGroupRef1.setMembers(new ArrayList<AttributeExpectedValue>());
                    AttributeExpectedValue att = new AttributeExpectedValue();
                    {
                        att.setAttributeContext("Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey");
                        att.setDataFormat("Guid");
                        att.setDescription("");
                        att.setDisplayName("CustomerID");
                        att.setName("CustomerID");
                        att.setSourceName("CustomerID");
                    }
                    attribGroupRef1.getMembers().add(att);
                    expected_referenceOnly_structured.add(attribGroupRef1);
                };
                AttributeExpectedValue attribGroupRef2 = new AttributeExpectedValue();
                {
                    attribGroupRef2.setAttributeGroupName("ProductID");
                    attribGroupRef2.setAttributeContext("Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID");
                    attribGroupRef2.setMembers(new ArrayList<AttributeExpectedValue>());
                    AttributeExpectedValue att = new AttributeExpectedValue();
                    {
                        att.setAttributeContext("Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey");
                        att.setDataFormat("Guid");
                        att.setDescription("");
                        att.setDisplayName("ProductID");
                        att.setName("ProductID");
                        att.setSourceName("ProductID");
                    }
                    attribGroupRef2.getMembers().add(att);
                    expected_referenceOnly_structured.add(attribGroupRef2);
                };
            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
            }

            runTestWithValues(
                    testName,
                    entityName,

                    expectedContext_default,
                    expectedContext_normalized,
                    expectedContext_referenceOnly,
                    expectedContext_structured,
                    expectedContext_normalized_structured,
                    expectedContext_referenceOnly_normalized,
                    expectedContext_referenceOnly_structured,
                    expectedContext_referenceOnly_normalized_structured,

                    expected_default,
                    expected_normalized,
                    expected_referenceOnly,
                    expected_structured,
                    expected_normalized_structured,
                    expected_referenceOnly_normalized,
                    expected_referenceOnly_structured,
                    expected_referenceOnly_normalized_structured
            ).join();
        }
    }

    /**
     * Resolution Guidance Test - One:Many Cardinality
     */
    @Test
    public void testForeignKeyOneToManyCardinality() {
        String testName = "testForeignKeyOneToManyCardinality";
        {
            String entityName = "Team";

            AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
            {
                expectedContext_default.setType("entity");
                expectedContext_default.setName("Team_Resolved_default");
                expectedContext_default.setDefinition("resolvedFrom/Team");
                expectedContext_default.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Team_Resolved_default/attributeContext/Team_Resolved_default");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Team_Resolved_default/attributeContext/Team_Resolved_default/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_default.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Team_Resolved_default/attributeContext/Team_Resolved_default");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Team_Resolved_default/attributeContext/Team_Resolved_default/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Team_Resolved_default/attributeContext/Team_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Team_Resolved_default/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("Name");
                            attrCtx_LVL2_IND1.setParent("Team_Resolved_default/attributeContext/Team_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Team_Resolved_default/hasAttributes/Name");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_default.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
            {
                expectedContext_normalized.setType("entity");
                expectedContext_normalized.setName("Team_Resolved_normalized");
                expectedContext_normalized.setDefinition("resolvedFrom/Team");
                expectedContext_normalized.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Team_Resolved_normalized/attributeContext/Team_Resolved_normalized");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Team_Resolved_normalized/attributeContext/Team_Resolved_normalized/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Team_Resolved_normalized/attributeContext/Team_Resolved_normalized");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Team_Resolved_normalized/attributeContext/Team_Resolved_normalized/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Team_Resolved_normalized/attributeContext/Team_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Team_Resolved_normalized/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("Name");
                            attrCtx_LVL2_IND1.setParent("Team_Resolved_normalized/attributeContext/Team_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Team_Resolved_normalized/hasAttributes/Name");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly.setType("entity");
                expectedContext_referenceOnly.setName("Team_Resolved_referenceOnly");
                expectedContext_referenceOnly.setDefinition("resolvedFrom/Team");
                expectedContext_referenceOnly.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Team_Resolved_referenceOnly/attributeContext/Team_Resolved_referenceOnly");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Team_Resolved_referenceOnly/attributeContext/Team_Resolved_referenceOnly/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Team_Resolved_referenceOnly/attributeContext/Team_Resolved_referenceOnly");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Team_Resolved_referenceOnly/attributeContext/Team_Resolved_referenceOnly/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Team_Resolved_referenceOnly/attributeContext/Team_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Team_Resolved_referenceOnly/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("Name");
                            attrCtx_LVL2_IND1.setParent("Team_Resolved_referenceOnly/attributeContext/Team_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Team_Resolved_referenceOnly/hasAttributes/Name");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
            {
                expectedContext_structured.setType("entity");
                expectedContext_structured.setName("Team_Resolved_structured");
                expectedContext_structured.setDefinition("resolvedFrom/Team");
                expectedContext_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Team_Resolved_structured/attributeContext/Team_Resolved_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Team_Resolved_structured/attributeContext/Team_Resolved_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Team_Resolved_structured/attributeContext/Team_Resolved_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Team_Resolved_structured/attributeContext/Team_Resolved_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Team_Resolved_structured/attributeContext/Team_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Team_Resolved_structured/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("Name");
                            attrCtx_LVL2_IND1.setParent("Team_Resolved_structured/attributeContext/Team_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Team_Resolved_structured/hasAttributes/Name");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
            {
                expectedContext_normalized_structured.setType("entity");
                expectedContext_normalized_structured.setName("Team_Resolved_normalized_structured");
                expectedContext_normalized_structured.setDefinition("resolvedFrom/Team");
                expectedContext_normalized_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Team_Resolved_normalized_structured/attributeContext/Team_Resolved_normalized_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Team_Resolved_normalized_structured/attributeContext/Team_Resolved_normalized_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Team_Resolved_normalized_structured/attributeContext/Team_Resolved_normalized_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Team_Resolved_normalized_structured/attributeContext/Team_Resolved_normalized_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Team_Resolved_normalized_structured/attributeContext/Team_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Team_Resolved_normalized_structured/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("Name");
                            attrCtx_LVL2_IND1.setParent("Team_Resolved_normalized_structured/attributeContext/Team_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Team_Resolved_normalized_structured/hasAttributes/Name");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized.setType("entity");
                expectedContext_referenceOnly_normalized.setName("Team_Resolved_referenceOnly_normalized");
                expectedContext_referenceOnly_normalized.setDefinition("resolvedFrom/Team");
                expectedContext_referenceOnly_normalized.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Team_Resolved_referenceOnly_normalized/attributeContext/Team_Resolved_referenceOnly_normalized");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Team_Resolved_referenceOnly_normalized/attributeContext/Team_Resolved_referenceOnly_normalized/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Team_Resolved_referenceOnly_normalized/attributeContext/Team_Resolved_referenceOnly_normalized");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Team_Resolved_referenceOnly_normalized/attributeContext/Team_Resolved_referenceOnly_normalized/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Team_Resolved_referenceOnly_normalized/attributeContext/Team_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Team_Resolved_referenceOnly_normalized/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("Name");
                            attrCtx_LVL2_IND1.setParent("Team_Resolved_referenceOnly_normalized/attributeContext/Team_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Team_Resolved_referenceOnly_normalized/hasAttributes/Name");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_structured.setType("entity");
                expectedContext_referenceOnly_structured.setName("Team_Resolved_referenceOnly_structured");
                expectedContext_referenceOnly_structured.setDefinition("resolvedFrom/Team");
                expectedContext_referenceOnly_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Team_Resolved_referenceOnly_structured/attributeContext/Team_Resolved_referenceOnly_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Team_Resolved_referenceOnly_structured/attributeContext/Team_Resolved_referenceOnly_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Team_Resolved_referenceOnly_structured/attributeContext/Team_Resolved_referenceOnly_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Team_Resolved_referenceOnly_structured/attributeContext/Team_Resolved_referenceOnly_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Team_Resolved_referenceOnly_structured/attributeContext/Team_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Team_Resolved_referenceOnly_structured/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("Name");
                            attrCtx_LVL2_IND1.setParent("Team_Resolved_referenceOnly_structured/attributeContext/Team_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Team_Resolved_referenceOnly_structured/hasAttributes/Name");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized_structured.setType("entity");
                expectedContext_referenceOnly_normalized_structured.setName("Team_Resolved_referenceOnly_normalized_structured");
                expectedContext_referenceOnly_normalized_structured.setDefinition("resolvedFrom/Team");
                expectedContext_referenceOnly_normalized_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Team_Resolved_referenceOnly_normalized_structured/attributeContext/Team_Resolved_referenceOnly_normalized_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Team_Resolved_referenceOnly_normalized_structured/attributeContext/Team_Resolved_referenceOnly_normalized_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Team_Resolved_referenceOnly_normalized_structured/attributeContext/Team_Resolved_referenceOnly_normalized_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Team_Resolved_referenceOnly_normalized_structured/attributeContext/Team_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Team_Resolved_referenceOnly_normalized_structured/attributeContext/Team_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Team_Resolved_referenceOnly_normalized_structured/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("Name");
                            attrCtx_LVL2_IND1.setParent("Team_Resolved_referenceOnly_normalized_structured/attributeContext/Team_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Team_Resolved_referenceOnly_normalized_structured/hasAttributes/Name");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.getContexts().add(attrCtx_LVL0_IND1);
            }

            List<AttributeExpectedValue> expected_default = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Team_Resolved_default/attributeContext/Team_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_default.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Team_Resolved_default/attributeContext/Team_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                    att.setDataFormat("String");
                    att.setDisplayName("Name");
                    att.setName("Name");
                    att.setSourceName("Name");
                }
                expected_default.add(att);
            }
            List<AttributeExpectedValue> expected_normalized = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Team_Resolved_normalized/attributeContext/Team_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_normalized.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Team_Resolved_normalized/attributeContext/Team_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                    att.setDataFormat("String");
                    att.setDisplayName("Name");
                    att.setName("Name");
                    att.setSourceName("Name");
                }
                expected_normalized.add(att);
            }
            List<AttributeExpectedValue> expected_referenceOnly = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Team_Resolved_referenceOnly/attributeContext/Team_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_referenceOnly.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Team_Resolved_referenceOnly/attributeContext/Team_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                    att.setDataFormat("String");
                    att.setDisplayName("Name");
                    att.setName("Name");
                    att.setSourceName("Name");
                }
                expected_referenceOnly.add(att);
            }
            List<AttributeExpectedValue> expected_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Team_Resolved_structured/attributeContext/Team_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_structured.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Team_Resolved_structured/attributeContext/Team_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                    att.setDataFormat("String");
                    att.setDisplayName("Name");
                    att.setName("Name");
                    att.setSourceName("Name");
                }
                expected_structured.add(att);
            }
            List<AttributeExpectedValue> expected_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Team_Resolved_normalized_structured/attributeContext/Team_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_normalized_structured.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Team_Resolved_normalized_structured/attributeContext/Team_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                    att.setDataFormat("String");
                    att.setDisplayName("Name");
                    att.setName("Name");
                    att.setSourceName("Name");
                }
                expected_normalized_structured.add(att);
            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Team_Resolved_referenceOnly_normalized/attributeContext/Team_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_referenceOnly_normalized.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Team_Resolved_referenceOnly_normalized/attributeContext/Team_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                    att.setDataFormat("String");
                    att.setDisplayName("Name");
                    att.setName("Name");
                    att.setSourceName("Name");
                }
                expected_referenceOnly_normalized.add(att);
            }
            List<AttributeExpectedValue> expected_referenceOnly_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Team_Resolved_referenceOnly_structured/attributeContext/Team_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_referenceOnly_structured.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Team_Resolved_referenceOnly_structured/attributeContext/Team_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                    att.setDataFormat("String");
                    att.setDisplayName("Name");
                    att.setName("Name");
                    att.setSourceName("Name");
                }
                expected_referenceOnly_structured.add(att);
            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Team_Resolved_referenceOnly_normalized_structured/attributeContext/Team_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_referenceOnly_normalized_structured.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Team_Resolved_referenceOnly_normalized_structured/attributeContext/Team_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                    att.setDataFormat("String");
                    att.setDisplayName("Name");
                    att.setName("Name");
                    att.setSourceName("Name");
                }
                expected_referenceOnly_normalized_structured.add(att);
            }

            runTestWithValues(
                    testName,
                    entityName,

                    expectedContext_default,
                    expectedContext_normalized,
                    expectedContext_referenceOnly,
                    expectedContext_structured,
                    expectedContext_normalized_structured,
                    expectedContext_referenceOnly_normalized,
                    expectedContext_referenceOnly_structured,
                    expectedContext_referenceOnly_normalized_structured,

                    expected_default,
                    expected_normalized,
                    expected_referenceOnly,
                    expected_structured,
                    expected_normalized_structured,
                    expected_referenceOnly_normalized,
                    expected_referenceOnly_structured,
                    expected_referenceOnly_normalized_structured
            ).join();
        }
        {
            String entityName = "Employee";

            AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
            {
                expectedContext_default.setType("entity");
                expectedContext_default.setName("Employee_Resolved_default");
                expectedContext_default.setDefinition("resolvedFrom/Employee");
                expectedContext_default.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Employee_Resolved_default/attributeContext/Employee_Resolved_default");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Employee_Resolved_default/attributeContext/Employee_Resolved_default/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_default.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Employee_Resolved_default/attributeContext/Employee_Resolved_default");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Employee_Resolved_default/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("FullName");
                            attrCtx_LVL2_IND1.setParent("Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Employee_Resolved_default/hasAttributes/FullName");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("TeamID");
                            attrCtx_LVL2_IND2.setParent("Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID");
                            attrCtx_LVL2_IND2.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Team");
                                attrCtx_LVL3_IND0.setParent("Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Team");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("entityReferenceExtends");
                                    attrCtx_LVL4_IND0.setName("extends");
                                    attrCtx_LVL4_IND0.setParent("Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("CdmEntity");
                                        attrCtx_LVL5_IND0.setParent("Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/extends");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/CdmEntity");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setParent("Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("attributeGroup");
                                        attrCtx_LVL5_IND0.setName("attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setParent("Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                        AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.setType("attributeDefinition");
                                            attrCtx_LVL6_IND0.setName("ID");
                                            attrCtx_LVL6_IND0.setParent("Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND0.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID");
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.setType("attributeDefinition");
                                            attrCtx_LVL6_IND1.setName("Name");
                                            attrCtx_LVL6_IND1.setParent("Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND1.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name");
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND1);
                                    }
                                    attrCtx_LVL4_IND1.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND2.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("generatedSet");
                                attrCtx_LVL3_IND1.setName("_generatedAttributeSet");
                                attrCtx_LVL3_IND1.setParent("Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID");
                                attrCtx_LVL3_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("addedAttributeExpansionTotal");
                                    attrCtx_LVL4_IND0.setName("TeamIDTeamCount");
                                    attrCtx_LVL4_IND0.setParent("Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet");
                                    attrCtx_LVL4_IND0.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID/resolutionGuidance/countAttribute/TeamCount");
                                    attrCtx_LVL4_IND0.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND0.getContextStrings().add("Employee_Resolved_default/hasAttributes/TeamIDTeamCount");
                                    }
                                }
                                attrCtx_LVL3_IND1.getContexts().add(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND2.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_default.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
            {
                expectedContext_normalized.setType("entity");
                expectedContext_normalized.setName("Employee_Resolved_normalized");
                expectedContext_normalized.setDefinition("resolvedFrom/Employee");
                expectedContext_normalized.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("TeamID");
                            attrCtx_LVL2_IND0.setParent("Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Team");
                                attrCtx_LVL3_IND0.setParent("Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Team");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("entityReferenceExtends");
                                    attrCtx_LVL4_IND0.setName("extends");
                                    attrCtx_LVL4_IND0.setParent("Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("CdmEntity");
                                        attrCtx_LVL5_IND0.setParent("Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/extends");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/CdmEntity");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setParent("Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("attributeGroup");
                                        attrCtx_LVL5_IND0.setName("attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setParent("Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                        AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.setType("attributeDefinition");
                                            attrCtx_LVL6_IND0.setName("ID");
                                            attrCtx_LVL6_IND0.setParent("Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND0.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID");
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.setType("attributeDefinition");
                                            attrCtx_LVL6_IND1.setName("Name");
                                            attrCtx_LVL6_IND1.setParent("Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND1.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name");
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND1);
                                    }
                                    attrCtx_LVL4_IND1.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("ID");
                            attrCtx_LVL2_IND1.setParent("Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Employee_Resolved_normalized/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("FullName");
                            attrCtx_LVL2_IND2.setParent("Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName");
                            attrCtx_LVL2_IND2.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND2.getContextStrings().add("Employee_Resolved_normalized/hasAttributes/FullName");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly.setType("entity");
                expectedContext_referenceOnly.setName("Employee_Resolved_referenceOnly");
                expectedContext_referenceOnly.setDefinition("resolvedFrom/Employee");
                expectedContext_referenceOnly.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Employee_Resolved_referenceOnly/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("FullName");
                            attrCtx_LVL2_IND1.setParent("Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Employee_Resolved_referenceOnly/hasAttributes/FullName");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("TeamID");
                            attrCtx_LVL2_IND2.setParent("Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID");
                            attrCtx_LVL2_IND2.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Team");
                                attrCtx_LVL3_IND0.setParent("Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Team");
                            }
                            attrCtx_LVL2_IND2.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("generatedSet");
                                attrCtx_LVL3_IND1.setName("_generatedAttributeSet");
                                attrCtx_LVL3_IND1.setParent("Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID");
                                attrCtx_LVL3_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("addedAttributeExpansionTotal");
                                    attrCtx_LVL4_IND0.setName("TeamIDTeamCount");
                                    attrCtx_LVL4_IND0.setParent("Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet");
                                    attrCtx_LVL4_IND0.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID/resolutionGuidance/countAttribute/TeamCount");
                                    attrCtx_LVL4_IND0.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND0.getContextStrings().add("Employee_Resolved_referenceOnly/hasAttributes/TeamIDTeamCount");
                                    }
                                }
                                attrCtx_LVL3_IND1.getContexts().add(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND2.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
            {
                expectedContext_structured.setType("entity");
                expectedContext_structured.setName("Employee_Resolved_structured");
                expectedContext_structured.setDefinition("resolvedFrom/Employee");
                expectedContext_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Employee_Resolved_structured/attributeContext/Employee_Resolved_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Employee_Resolved_structured/attributeContext/Employee_Resolved_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Employee_Resolved_structured/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("FullName");
                            attrCtx_LVL2_IND1.setParent("Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Employee_Resolved_structured/hasAttributes/FullName");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("TeamID");
                            attrCtx_LVL2_IND2.setParent("Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID");
                            attrCtx_LVL2_IND2.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Team");
                                attrCtx_LVL3_IND0.setParent("Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Team");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("entityReferenceExtends");
                                    attrCtx_LVL4_IND0.setName("extends");
                                    attrCtx_LVL4_IND0.setParent("Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("CdmEntity");
                                        attrCtx_LVL5_IND0.setParent("Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/extends");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/CdmEntity");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setParent("Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("attributeGroup");
                                        attrCtx_LVL5_IND0.setName("attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setParent("Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                        AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.setType("attributeDefinition");
                                            attrCtx_LVL6_IND0.setName("ID");
                                            attrCtx_LVL6_IND0.setParent("Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND0.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID");
                                            attrCtx_LVL6_IND0.setContextStrings(new ArrayList<String>());
                                            {
                                                attrCtx_LVL6_IND0.getContextStrings().add("Employee_Resolved_structured/hasAttributes/TeamID/members/ID");
                                            }
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.setType("attributeDefinition");
                                            attrCtx_LVL6_IND1.setName("Name");
                                            attrCtx_LVL6_IND1.setParent("Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND1.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name");
                                            attrCtx_LVL6_IND1.setContextStrings(new ArrayList<String>());
                                            {
                                                attrCtx_LVL6_IND1.getContextStrings().add("Employee_Resolved_structured/hasAttributes/TeamID/members/Name");
                                            }
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND1);
                                    }
                                    attrCtx_LVL4_IND1.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND2.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
            {
                expectedContext_normalized_structured.setType("entity");
                expectedContext_normalized_structured.setName("Employee_Resolved_normalized_structured");
                expectedContext_normalized_structured.setDefinition("resolvedFrom/Employee");
                expectedContext_normalized_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("TeamID");
                            attrCtx_LVL2_IND0.setParent("Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Team");
                                attrCtx_LVL3_IND0.setParent("Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Team");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("entityReferenceExtends");
                                    attrCtx_LVL4_IND0.setName("extends");
                                    attrCtx_LVL4_IND0.setParent("Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("CdmEntity");
                                        attrCtx_LVL5_IND0.setParent("Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/extends");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/CdmEntity");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setParent("Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope");
                                    attrCtx_LVL4_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("attributeGroup");
                                        attrCtx_LVL5_IND0.setName("attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setParent("Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope");
                                        attrCtx_LVL5_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                        AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.setType("attributeDefinition");
                                            attrCtx_LVL6_IND0.setName("ID");
                                            attrCtx_LVL6_IND0.setParent("Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND0.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID");
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.setType("attributeDefinition");
                                            attrCtx_LVL6_IND1.setName("Name");
                                            attrCtx_LVL6_IND1.setParent("Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND1.setDefinition("resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name");
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND1);
                                    }
                                    attrCtx_LVL4_IND1.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND1);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("ID");
                            attrCtx_LVL2_IND1.setParent("Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Employee_Resolved_normalized_structured/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("FullName");
                            attrCtx_LVL2_IND2.setParent("Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName");
                            attrCtx_LVL2_IND2.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND2.getContextStrings().add("Employee_Resolved_normalized_structured/hasAttributes/FullName");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized.setType("entity");
                expectedContext_referenceOnly_normalized.setName("Employee_Resolved_referenceOnly_normalized");
                expectedContext_referenceOnly_normalized.setDefinition("resolvedFrom/Employee");
                expectedContext_referenceOnly_normalized.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("TeamID");
                            attrCtx_LVL2_IND0.setParent("Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Team");
                                attrCtx_LVL3_IND0.setParent("Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Team");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("ID");
                            attrCtx_LVL2_IND1.setParent("Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Employee_Resolved_referenceOnly_normalized/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("FullName");
                            attrCtx_LVL2_IND2.setParent("Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName");
                            attrCtx_LVL2_IND2.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND2.getContextStrings().add("Employee_Resolved_referenceOnly_normalized/hasAttributes/FullName");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_structured.setType("entity");
                expectedContext_referenceOnly_structured.setName("Employee_Resolved_referenceOnly_structured");
                expectedContext_referenceOnly_structured.setDefinition("resolvedFrom/Employee");
                expectedContext_referenceOnly_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("ID");
                            attrCtx_LVL2_IND0.setParent("Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("Employee_Resolved_referenceOnly_structured/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("FullName");
                            attrCtx_LVL2_IND1.setParent("Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Employee_Resolved_referenceOnly_structured/hasAttributes/FullName");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("TeamID");
                            attrCtx_LVL2_IND2.setParent("Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID");
                            attrCtx_LVL2_IND2.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Team");
                                attrCtx_LVL3_IND0.setParent("Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Team");
                            }
                            attrCtx_LVL2_IND2.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("generatedSet");
                                attrCtx_LVL3_IND1.setName("_generatedAttributeSet");
                                attrCtx_LVL3_IND1.setParent("Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID");
                                attrCtx_LVL3_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("generatedRound");
                                    attrCtx_LVL4_IND0.setName("_generatedAttributeRound0");
                                    attrCtx_LVL4_IND0.setParent("Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("addedAttributeIdentity");
                                        attrCtx_LVL5_IND0.setName("_foreignKey");
                                        attrCtx_LVL5_IND0.setParent("Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet/_generatedAttributeRound0");
                                        attrCtx_LVL5_IND0.setContextStrings(new ArrayList<String>());
                                        {
                                            attrCtx_LVL5_IND0.getContextStrings().add("Employee_Resolved_referenceOnly_structured/hasAttributes/TeamID/members/TeamID");
                                        }
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND1.getContexts().add(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND2.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_normalized_structured.setType("entity");
                expectedContext_referenceOnly_normalized_structured.setName("Employee_Resolved_referenceOnly_normalized_structured");
                expectedContext_referenceOnly_normalized_structured.setDefinition("resolvedFrom/Employee");
                expectedContext_referenceOnly_normalized_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setParent("Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setParent("Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("TeamID");
                            attrCtx_LVL2_IND0.setParent("Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Team");
                                attrCtx_LVL3_IND0.setParent("Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Team");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("ID");
                            attrCtx_LVL2_IND1.setParent("Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/ID");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("FullName");
                            attrCtx_LVL2_IND2.setParent("Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName");
                            attrCtx_LVL2_IND2.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND2.getContextStrings().add("Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/FullName");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.getContexts().add(attrCtx_LVL0_IND1);
            }

            List<AttributeExpectedValue> expected_default = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_default.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName");
                    att.setDataFormat("String");
                    att.setDisplayName("FullName");
                    att.setName("FullName");
                    att.setSourceName("FullName");
                }
                expected_default.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet/TeamIDTeamCount");
                    att.setDataFormat("Int32");
                    att.setName("TeamIDTeamCount");
                }
                expected_default.add(att);
            }
            List<AttributeExpectedValue> expected_normalized = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_normalized.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName");
                    att.setDataFormat("String");
                    att.setDisplayName("FullName");
                    att.setName("FullName");
                    att.setSourceName("FullName");
                }
                expected_normalized.add(att);
            }
            List<AttributeExpectedValue> expected_referenceOnly = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_referenceOnly.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName");
                    att.setDataFormat("String");
                    att.setDisplayName("FullName");
                    att.setName("FullName");
                    att.setSourceName("FullName");
                }
                expected_referenceOnly.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet/TeamIDTeamCount");
                    att.setDataFormat("Int32");
                    att.setName("TeamIDTeamCount");
                }
                expected_referenceOnly.add(att);
            }
            List<AttributeExpectedValue> expected_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_structured.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName");
                    att.setDataFormat("String");
                    att.setDisplayName("FullName");
                    att.setName("FullName");
                    att.setSourceName("FullName");
                }
                expected_structured.add(att);
                AttributeExpectedValue attribGroupRef = new AttributeExpectedValue();
                {
                    attribGroupRef.setAttributeGroupName("TeamID");
                    attribGroupRef.setAttributeContext("Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID");
                    attribGroupRef.setMembers(new ArrayList<AttributeExpectedValue>());
                    att = new AttributeExpectedValue();
                    {
                        att.setAttributeContext("Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                        att.setDataFormat("Guid");
                        att.setName("ID");
                    }
                    attribGroupRef.getMembers().add(att);
                    att = new AttributeExpectedValue();
                    {
                        att.setAttributeContext("Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope/Name");
                        att.setDataFormat("String");
                        att.setName("Name");
                    }
                    attribGroupRef.getMembers().add(att);
                    expected_structured.add(attribGroupRef);
                };
            }
            List<AttributeExpectedValue> expected_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_normalized_structured.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName");
                    att.setDataFormat("String");
                    att.setDisplayName("FullName");
                    att.setName("FullName");
                    att.setSourceName("FullName");
                }
                expected_normalized_structured.add(att);
            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_referenceOnly_normalized.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName");
                    att.setDataFormat("String");
                    att.setDisplayName("FullName");
                    att.setName("FullName");
                    att.setSourceName("FullName");
                }
                expected_referenceOnly_normalized.add(att);
            }
            List<AttributeExpectedValue> expected_referenceOnly_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_referenceOnly_structured.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName");
                    att.setDataFormat("String");
                    att.setDisplayName("FullName");
                    att.setName("FullName");
                    att.setSourceName("FullName");
                }
                expected_referenceOnly_structured.add(att);
                AttributeExpectedValue attribGroupRef = new AttributeExpectedValue();
                {
                    attribGroupRef.setAttributeGroupName("TeamID");
                    attribGroupRef.setAttributeContext("Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID");
                    attribGroupRef.setMembers(new ArrayList<AttributeExpectedValue>());
                    att = new AttributeExpectedValue();
                    {
                        att.setAttributeContext("Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey");
                        att.setDataFormat("Guid");
                        att.setDescription("");
                        att.setDisplayName("TeamID");
                        att.setName("TeamID");
                        att.setSourceName("TeamID");
                    }
                    attribGroupRef.getMembers().add(att);
                    expected_referenceOnly_structured.add(attribGroupRef);
                };
            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att.setDataFormat("Guid");
                    att.setDisplayName("ID");
                    att.setPrimaryKey(true);
                    att.setName("ID");
                    att.setSourceName("ID");
                }
                expected_referenceOnly_normalized_structured.add(att);
                att = new AttributeExpectedValue();
                {
                    att.setAttributeContext("Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName");
                    att.setDataFormat("String");
                    att.setDisplayName("FullName");
                    att.setName("FullName");
                    att.setSourceName("FullName");
                }
                expected_referenceOnly_normalized_structured.add(att);
            }

            runTestWithValues(
                    testName,
                    entityName,

                    expectedContext_default,
                    expectedContext_normalized,
                    expectedContext_referenceOnly,
                    expectedContext_structured,
                    expectedContext_normalized_structured,
                    expectedContext_referenceOnly_normalized,
                    expectedContext_referenceOnly_structured,
                    expectedContext_referenceOnly_normalized_structured,

                    expected_default,
                    expected_normalized,
                    expected_referenceOnly,
                    expected_structured,
                    expected_normalized_structured,
                    expected_referenceOnly_normalized,
                    expected_referenceOnly_structured,
                    expected_referenceOnly_normalized_structured
            ).join();
        }
    }
}
