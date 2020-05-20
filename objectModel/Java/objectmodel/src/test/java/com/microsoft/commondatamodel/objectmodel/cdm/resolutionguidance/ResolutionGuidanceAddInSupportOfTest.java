// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.resolutionguidance;

import com.microsoft.commondatamodel.objectmodel.utilities.AttributeContextExpectedValue;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeExpectedValue;
import org.testng.annotations.Test;

import java.util.ArrayList;
import java.util.List;

public class ResolutionGuidanceAddInSupportOfTest extends CommonTest {

    /**
     * Resolution Guidance Test - AddInSupportOf
     */
    @Test
    public void testAddInSupportOf() {
        String testName = "testAddInSupportOf";
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
                            attrCtx_LVL2_IND1.setName("StatusCode");
                            attrCtx_LVL2_IND1.setParent("Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Product_Resolved_default/hasAttributes/StatusCode");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("StatusCode_display");
                            attrCtx_LVL2_IND2.setParent("Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display");
                            attrCtx_LVL2_IND2.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND2.getContextStrings().add("Product_Resolved_default/hasAttributes/StatusCode_display");
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
                            attrCtx_LVL2_IND1.setName("StatusCode");
                            attrCtx_LVL2_IND1.setParent("Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Product_Resolved_normalized/hasAttributes/StatusCode");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("StatusCode_display");
                            attrCtx_LVL2_IND2.setParent("Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display");
                            attrCtx_LVL2_IND2.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND2.getContextStrings().add("Product_Resolved_normalized/hasAttributes/StatusCode_display");
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
                            attrCtx_LVL2_IND1.setName("StatusCode");
                            attrCtx_LVL2_IND1.setParent("Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Product_Resolved_referenceOnly/hasAttributes/StatusCode");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("StatusCode_display");
                            attrCtx_LVL2_IND2.setParent("Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display");
                            attrCtx_LVL2_IND2.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND2.getContextStrings().add("Product_Resolved_referenceOnly/hasAttributes/StatusCode_display");
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
                            attrCtx_LVL2_IND1.setName("StatusCode");
                            attrCtx_LVL2_IND1.setParent("Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Product_Resolved_structured/hasAttributes/StatusCode");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("StatusCode_display");
                            attrCtx_LVL2_IND2.setParent("Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display");
                            attrCtx_LVL2_IND2.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND2.getContextStrings().add("Product_Resolved_structured/hasAttributes/StatusCode_display");
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
                            attrCtx_LVL2_IND1.setName("StatusCode");
                            attrCtx_LVL2_IND1.setParent("Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Product_Resolved_normalized_structured/hasAttributes/StatusCode");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("StatusCode_display");
                            attrCtx_LVL2_IND2.setParent("Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display");
                            attrCtx_LVL2_IND2.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND2.getContextStrings().add("Product_Resolved_normalized_structured/hasAttributes/StatusCode_display");
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
                            attrCtx_LVL2_IND1.setName("StatusCode");
                            attrCtx_LVL2_IND1.setParent("Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Product_Resolved_referenceOnly_normalized/hasAttributes/StatusCode");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("StatusCode_display");
                            attrCtx_LVL2_IND2.setParent("Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display");
                            attrCtx_LVL2_IND2.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND2.getContextStrings().add("Product_Resolved_referenceOnly_normalized/hasAttributes/StatusCode_display");
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
                            attrCtx_LVL2_IND1.setName("StatusCode");
                            attrCtx_LVL2_IND1.setParent("Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Product_Resolved_referenceOnly_structured/hasAttributes/StatusCode");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("StatusCode_display");
                            attrCtx_LVL2_IND2.setParent("Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display");
                            attrCtx_LVL2_IND2.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND2.getContextStrings().add("Product_Resolved_referenceOnly_structured/hasAttributes/StatusCode_display");
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
                            attrCtx_LVL2_IND1.setName("StatusCode");
                            attrCtx_LVL2_IND1.setParent("Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("Product_Resolved_referenceOnly_normalized_structured/hasAttributes/StatusCode");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("StatusCode_display");
                            attrCtx_LVL2_IND2.setParent("Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display");
                            attrCtx_LVL2_IND2.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND2.getContextStrings().add("Product_Resolved_referenceOnly_normalized_structured/hasAttributes/StatusCode_display");
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
                    att1.setAttributeContext("Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att1.setDataFormat("Guid");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_default.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode");
                    att2.setDataFormat("Int32");
                    att2.setName("StatusCode");
                    att2.setSourceName("StatusCode");
                }
                expected_default.add(att2);

                AttributeExpectedValue att3 = new AttributeExpectedValue();
                {
                    att3.setAttributeContext("Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display");
                    att3.setDataFormat("String");
                    att3.setName("StatusCode_display");
                }
                expected_default.add(att3);
            }
            List<AttributeExpectedValue> expected_normalized = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att1.setDataFormat("Guid");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_normalized.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode");
                    att2.setDataFormat("Int32");
                    att2.setName("StatusCode");
                    att2.setSourceName("StatusCode");
                }
                expected_normalized.add(att2);

                AttributeExpectedValue att3 = new AttributeExpectedValue();
                {
                    att3.setAttributeContext("Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display");
                    att3.setDataFormat("String");
                    att3.setName("StatusCode_display");
                }
                expected_normalized.add(att3);
            }
            List<AttributeExpectedValue> expected_referenceOnly = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att1.setDataFormat("Guid");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_referenceOnly.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode");
                    att2.setDataFormat("Int32");
                    att2.setName("StatusCode");
                    att2.setSourceName("StatusCode");
                }
                expected_referenceOnly.add(att2);

                AttributeExpectedValue att3 = new AttributeExpectedValue();
                {
                    att3.setAttributeContext("Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display");
                    att3.setDataFormat("String");
                    att3.setName("StatusCode_display");
                }
                expected_referenceOnly.add(att3);
            }
            List<AttributeExpectedValue> expected_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att1.setDataFormat("Guid");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_structured.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode");
                    att2.setDataFormat("Int32");
                    att2.setName("StatusCode");
                    att2.setSourceName("StatusCode");
                }
                expected_structured.add(att2);

                AttributeExpectedValue att3 = new AttributeExpectedValue();
                {
                    att3.setAttributeContext("Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display");
                    att3.setDataFormat("String");
                    att3.setName("StatusCode_display");
                }
                expected_structured.add(att3);
            }
            List<AttributeExpectedValue> expected_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att1.setDataFormat("Guid");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_normalized_structured.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode");
                    att2.setDataFormat("Int32");
                    att2.setName("StatusCode");
                    att2.setSourceName("StatusCode");
                }
                expected_normalized_structured.add(att2);

                AttributeExpectedValue att3 = new AttributeExpectedValue();
                {
                    att3.setAttributeContext("Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display");
                    att3.setDataFormat("String");
                    att3.setName("StatusCode_display");
                }
                expected_normalized_structured.add(att3);
            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att1.setDataFormat("Guid");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_referenceOnly_normalized.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode");
                    att2.setDataFormat("Int32");
                    att2.setName("StatusCode");
                    att2.setSourceName("StatusCode");
                }
                expected_referenceOnly_normalized.add(att2);

                AttributeExpectedValue att3 = new AttributeExpectedValue();
                {
                    att3.setAttributeContext("Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display");
                    att3.setDataFormat("String");
                    att3.setName("StatusCode_display");
                }
                expected_referenceOnly_normalized.add(att3);
            }
            List<AttributeExpectedValue> expected_referenceOnly_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att1.setDataFormat("Guid");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_referenceOnly_structured.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode");
                    att2.setDataFormat("Int32");
                    att2.setName("StatusCode");
                    att2.setSourceName("StatusCode");
                }
                expected_referenceOnly_structured.add(att2);

                AttributeExpectedValue att3 = new AttributeExpectedValue();
                {
                    att3.setAttributeContext("Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display");
                    att3.setDataFormat("String");
                    att3.setName("StatusCode_display");
                }
                expected_referenceOnly_structured.add(att3);
            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID");
                    att1.setDataFormat("Guid");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_referenceOnly_normalized_structured.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode");
                    att2.setDataFormat("Int32");
                    att2.setName("StatusCode");
                    att2.setSourceName("StatusCode");
                }
                expected_referenceOnly_normalized_structured.add(att2);

                AttributeExpectedValue att3 = new AttributeExpectedValue();
                {
                    att3.setAttributeContext("Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display");
                    att3.setDataFormat("String");
                    att3.setName("StatusCode_display");
                }
                expected_referenceOnly_normalized_structured.add(att3);
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
     * Resolution Guidance Test - AddInSupportOf with IsCorrelatedWith
     */
    @Test
    public void testAddInSupportOfWithIsCorrelatedWith() {
        String testName = "testAddInSupportOfWithIsCorrelatedWith";
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
                    attrCtx_LVL0_IND1.setName("ID");
                    attrCtx_LVL0_IND1.setParent("Product_Resolved_default/attributeContext/Product_Resolved_default");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Product/hasAttributes/ID");
                    attrCtx_LVL0_IND1.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND1.getContextStrings().add("Product_Resolved_default/hasAttributes/ID");
                    }
                }
                expectedContext_default.getContexts().add(attrCtx_LVL0_IND1);
                AttributeContextExpectedValue attrCtx_LVL0_IND2 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND2.setType("attributeDefinition");
                    attrCtx_LVL0_IND2.setName("StateCode");
                    attrCtx_LVL0_IND2.setParent("Product_Resolved_default/attributeContext/Product_Resolved_default");
                    attrCtx_LVL0_IND2.setDefinition("resolvedFrom/Product/hasAttributes/StateCode");
                    attrCtx_LVL0_IND2.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND2.getContextStrings().add("Product_Resolved_default/hasAttributes/StateCode");
                    }
                }
                expectedContext_default.getContexts().add(attrCtx_LVL0_IND2);
                AttributeContextExpectedValue attrCtx_LVL0_IND3 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND3.setType("attributeDefinition");
                    attrCtx_LVL0_IND3.setName("StateCode_display");
                    attrCtx_LVL0_IND3.setParent("Product_Resolved_default/attributeContext/Product_Resolved_default");
                    attrCtx_LVL0_IND3.setDefinition("resolvedFrom/Product/hasAttributes/StateCode_display");
                    attrCtx_LVL0_IND3.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND3.getContextStrings().add("Product_Resolved_default/hasAttributes/StateCode_display");
                    }
                }
                expectedContext_default.getContexts().add(attrCtx_LVL0_IND3);
                AttributeContextExpectedValue attrCtx_LVL0_IND4 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND4.setType("attributeDefinition");
                    attrCtx_LVL0_IND4.setName("StatusCode");
                    attrCtx_LVL0_IND4.setParent("Product_Resolved_default/attributeContext/Product_Resolved_default");
                    attrCtx_LVL0_IND4.setDefinition("resolvedFrom/Product/hasAttributes/StatusCode");
                    attrCtx_LVL0_IND4.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND4.getContextStrings().add("Product_Resolved_default/hasAttributes/StatusCode");
                    }
                }
                expectedContext_default.getContexts().add(attrCtx_LVL0_IND4);
                AttributeContextExpectedValue attrCtx_LVL0_IND5 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND5.setType("attributeDefinition");
                    attrCtx_LVL0_IND5.setName("StatusCode_display");
                    attrCtx_LVL0_IND5.setParent("Product_Resolved_default/attributeContext/Product_Resolved_default");
                    attrCtx_LVL0_IND5.setDefinition("resolvedFrom/Product/hasAttributes/StatusCode_display");
                    attrCtx_LVL0_IND5.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND5.getContextStrings().add("Product_Resolved_default/hasAttributes/StatusCode_display");
                    }
                }
                expectedContext_default.getContexts().add(attrCtx_LVL0_IND5);
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
                    attrCtx_LVL0_IND1.setName("ID");
                    attrCtx_LVL0_IND1.setParent("Product_Resolved_normalized/attributeContext/Product_Resolved_normalized");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Product/hasAttributes/ID");
                    attrCtx_LVL0_IND1.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND1.getContextStrings().add("Product_Resolved_normalized/hasAttributes/ID");
                    }
                }
                expectedContext_normalized.getContexts().add(attrCtx_LVL0_IND1);
                AttributeContextExpectedValue attrCtx_LVL0_IND2 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND2.setType("attributeDefinition");
                    attrCtx_LVL0_IND2.setName("StateCode");
                    attrCtx_LVL0_IND2.setParent("Product_Resolved_normalized/attributeContext/Product_Resolved_normalized");
                    attrCtx_LVL0_IND2.setDefinition("resolvedFrom/Product/hasAttributes/StateCode");
                    attrCtx_LVL0_IND2.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND2.getContextStrings().add("Product_Resolved_normalized/hasAttributes/StateCode");
                    }
                }
                expectedContext_normalized.getContexts().add(attrCtx_LVL0_IND2);
                AttributeContextExpectedValue attrCtx_LVL0_IND3 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND3.setType("attributeDefinition");
                    attrCtx_LVL0_IND3.setName("StateCode_display");
                    attrCtx_LVL0_IND3.setParent("Product_Resolved_normalized/attributeContext/Product_Resolved_normalized");
                    attrCtx_LVL0_IND3.setDefinition("resolvedFrom/Product/hasAttributes/StateCode_display");
                    attrCtx_LVL0_IND3.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND3.getContextStrings().add("Product_Resolved_normalized/hasAttributes/StateCode_display");
                    }
                }
                expectedContext_normalized.getContexts().add(attrCtx_LVL0_IND3);
                AttributeContextExpectedValue attrCtx_LVL0_IND4 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND4.setType("attributeDefinition");
                    attrCtx_LVL0_IND4.setName("StatusCode");
                    attrCtx_LVL0_IND4.setParent("Product_Resolved_normalized/attributeContext/Product_Resolved_normalized");
                    attrCtx_LVL0_IND4.setDefinition("resolvedFrom/Product/hasAttributes/StatusCode");
                    attrCtx_LVL0_IND4.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND4.getContextStrings().add("Product_Resolved_normalized/hasAttributes/StatusCode");
                    }
                }
                expectedContext_normalized.getContexts().add(attrCtx_LVL0_IND4);
                AttributeContextExpectedValue attrCtx_LVL0_IND5 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND5.setType("attributeDefinition");
                    attrCtx_LVL0_IND5.setName("StatusCode_display");
                    attrCtx_LVL0_IND5.setParent("Product_Resolved_normalized/attributeContext/Product_Resolved_normalized");
                    attrCtx_LVL0_IND5.setDefinition("resolvedFrom/Product/hasAttributes/StatusCode_display");
                    attrCtx_LVL0_IND5.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND5.getContextStrings().add("Product_Resolved_normalized/hasAttributes/StatusCode_display");
                    }
                }
                expectedContext_normalized.getContexts().add(attrCtx_LVL0_IND5);
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
                    attrCtx_LVL0_IND1.setName("ID");
                    attrCtx_LVL0_IND1.setParent("Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Product/hasAttributes/ID");
                    attrCtx_LVL0_IND1.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND1.getContextStrings().add("Product_Resolved_referenceOnly/hasAttributes/ID");
                    }
                }
                expectedContext_referenceOnly.getContexts().add(attrCtx_LVL0_IND1);
                AttributeContextExpectedValue attrCtx_LVL0_IND2 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND2.setType("attributeDefinition");
                    attrCtx_LVL0_IND2.setName("StateCode");
                    attrCtx_LVL0_IND2.setParent("Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly");
                    attrCtx_LVL0_IND2.setDefinition("resolvedFrom/Product/hasAttributes/StateCode");
                    attrCtx_LVL0_IND2.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND2.getContextStrings().add("Product_Resolved_referenceOnly/hasAttributes/StateCode");
                    }
                }
                expectedContext_referenceOnly.getContexts().add(attrCtx_LVL0_IND2);
                AttributeContextExpectedValue attrCtx_LVL0_IND3 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND3.setType("attributeDefinition");
                    attrCtx_LVL0_IND3.setName("StateCode_display");
                    attrCtx_LVL0_IND3.setParent("Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly");
                    attrCtx_LVL0_IND3.setDefinition("resolvedFrom/Product/hasAttributes/StateCode_display");
                    attrCtx_LVL0_IND3.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND3.getContextStrings().add("Product_Resolved_referenceOnly/hasAttributes/StateCode_display");
                    }
                }
                expectedContext_referenceOnly.getContexts().add(attrCtx_LVL0_IND3);
                AttributeContextExpectedValue attrCtx_LVL0_IND4 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND4.setType("attributeDefinition");
                    attrCtx_LVL0_IND4.setName("StatusCode");
                    attrCtx_LVL0_IND4.setParent("Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly");
                    attrCtx_LVL0_IND4.setDefinition("resolvedFrom/Product/hasAttributes/StatusCode");
                    attrCtx_LVL0_IND4.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND4.getContextStrings().add("Product_Resolved_referenceOnly/hasAttributes/StatusCode");
                    }
                }
                expectedContext_referenceOnly.getContexts().add(attrCtx_LVL0_IND4);
                AttributeContextExpectedValue attrCtx_LVL0_IND5 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND5.setType("attributeDefinition");
                    attrCtx_LVL0_IND5.setName("StatusCode_display");
                    attrCtx_LVL0_IND5.setParent("Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly");
                    attrCtx_LVL0_IND5.setDefinition("resolvedFrom/Product/hasAttributes/StatusCode_display");
                    attrCtx_LVL0_IND5.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND5.getContextStrings().add("Product_Resolved_referenceOnly/hasAttributes/StatusCode_display");
                    }
                }
                expectedContext_referenceOnly.getContexts().add(attrCtx_LVL0_IND5);
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
                    attrCtx_LVL0_IND1.setName("ID");
                    attrCtx_LVL0_IND1.setParent("Product_Resolved_structured/attributeContext/Product_Resolved_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Product/hasAttributes/ID");
                    attrCtx_LVL0_IND1.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND1.getContextStrings().add("Product_Resolved_structured/hasAttributes/ID");
                    }
                }
                expectedContext_structured.getContexts().add(attrCtx_LVL0_IND1);
                AttributeContextExpectedValue attrCtx_LVL0_IND2 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND2.setType("attributeDefinition");
                    attrCtx_LVL0_IND2.setName("StateCode");
                    attrCtx_LVL0_IND2.setParent("Product_Resolved_structured/attributeContext/Product_Resolved_structured");
                    attrCtx_LVL0_IND2.setDefinition("resolvedFrom/Product/hasAttributes/StateCode");
                    attrCtx_LVL0_IND2.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND2.getContextStrings().add("Product_Resolved_structured/hasAttributes/StateCode");
                    }
                }
                expectedContext_structured.getContexts().add(attrCtx_LVL0_IND2);
                AttributeContextExpectedValue attrCtx_LVL0_IND3 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND3.setType("attributeDefinition");
                    attrCtx_LVL0_IND3.setName("StateCode_display");
                    attrCtx_LVL0_IND3.setParent("Product_Resolved_structured/attributeContext/Product_Resolved_structured");
                    attrCtx_LVL0_IND3.setDefinition("resolvedFrom/Product/hasAttributes/StateCode_display");
                    attrCtx_LVL0_IND3.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND3.getContextStrings().add("Product_Resolved_structured/hasAttributes/StateCode_display");
                    }
                }
                expectedContext_structured.getContexts().add(attrCtx_LVL0_IND3);
                AttributeContextExpectedValue attrCtx_LVL0_IND4 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND4.setType("attributeDefinition");
                    attrCtx_LVL0_IND4.setName("StatusCode");
                    attrCtx_LVL0_IND4.setParent("Product_Resolved_structured/attributeContext/Product_Resolved_structured");
                    attrCtx_LVL0_IND4.setDefinition("resolvedFrom/Product/hasAttributes/StatusCode");
                    attrCtx_LVL0_IND4.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND4.getContextStrings().add("Product_Resolved_structured/hasAttributes/StatusCode");
                    }
                }
                expectedContext_structured.getContexts().add(attrCtx_LVL0_IND4);
                AttributeContextExpectedValue attrCtx_LVL0_IND5 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND5.setType("attributeDefinition");
                    attrCtx_LVL0_IND5.setName("StatusCode_display");
                    attrCtx_LVL0_IND5.setParent("Product_Resolved_structured/attributeContext/Product_Resolved_structured");
                    attrCtx_LVL0_IND5.setDefinition("resolvedFrom/Product/hasAttributes/StatusCode_display");
                    attrCtx_LVL0_IND5.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND5.getContextStrings().add("Product_Resolved_structured/hasAttributes/StatusCode_display");
                    }
                }
                expectedContext_structured.getContexts().add(attrCtx_LVL0_IND5);
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
                    attrCtx_LVL0_IND1.setName("ID");
                    attrCtx_LVL0_IND1.setParent("Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Product/hasAttributes/ID");
                    attrCtx_LVL0_IND1.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND1.getContextStrings().add("Product_Resolved_normalized_structured/hasAttributes/ID");
                    }
                }
                expectedContext_normalized_structured.getContexts().add(attrCtx_LVL0_IND1);
                AttributeContextExpectedValue attrCtx_LVL0_IND2 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND2.setType("attributeDefinition");
                    attrCtx_LVL0_IND2.setName("StateCode");
                    attrCtx_LVL0_IND2.setParent("Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured");
                    attrCtx_LVL0_IND2.setDefinition("resolvedFrom/Product/hasAttributes/StateCode");
                    attrCtx_LVL0_IND2.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND2.getContextStrings().add("Product_Resolved_normalized_structured/hasAttributes/StateCode");
                    }
                }
                expectedContext_normalized_structured.getContexts().add(attrCtx_LVL0_IND2);
                AttributeContextExpectedValue attrCtx_LVL0_IND3 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND3.setType("attributeDefinition");
                    attrCtx_LVL0_IND3.setName("StateCode_display");
                    attrCtx_LVL0_IND3.setParent("Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured");
                    attrCtx_LVL0_IND3.setDefinition("resolvedFrom/Product/hasAttributes/StateCode_display");
                    attrCtx_LVL0_IND3.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND3.getContextStrings().add("Product_Resolved_normalized_structured/hasAttributes/StateCode_display");
                    }
                }
                expectedContext_normalized_structured.getContexts().add(attrCtx_LVL0_IND3);
                AttributeContextExpectedValue attrCtx_LVL0_IND4 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND4.setType("attributeDefinition");
                    attrCtx_LVL0_IND4.setName("StatusCode");
                    attrCtx_LVL0_IND4.setParent("Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured");
                    attrCtx_LVL0_IND4.setDefinition("resolvedFrom/Product/hasAttributes/StatusCode");
                    attrCtx_LVL0_IND4.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND4.getContextStrings().add("Product_Resolved_normalized_structured/hasAttributes/StatusCode");
                    }
                }
                expectedContext_normalized_structured.getContexts().add(attrCtx_LVL0_IND4);
                AttributeContextExpectedValue attrCtx_LVL0_IND5 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND5.setType("attributeDefinition");
                    attrCtx_LVL0_IND5.setName("StatusCode_display");
                    attrCtx_LVL0_IND5.setParent("Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured");
                    attrCtx_LVL0_IND5.setDefinition("resolvedFrom/Product/hasAttributes/StatusCode_display");
                    attrCtx_LVL0_IND5.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND5.getContextStrings().add("Product_Resolved_normalized_structured/hasAttributes/StatusCode_display");
                    }
                }
                expectedContext_normalized_structured.getContexts().add(attrCtx_LVL0_IND5);
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
                    attrCtx_LVL0_IND1.setName("ID");
                    attrCtx_LVL0_IND1.setParent("Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Product/hasAttributes/ID");
                    attrCtx_LVL0_IND1.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND1.getContextStrings().add("Product_Resolved_referenceOnly_normalized/hasAttributes/ID");
                    }
                }
                expectedContext_referenceOnly_normalized.getContexts().add(attrCtx_LVL0_IND1);
                AttributeContextExpectedValue attrCtx_LVL0_IND2 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND2.setType("attributeDefinition");
                    attrCtx_LVL0_IND2.setName("StateCode");
                    attrCtx_LVL0_IND2.setParent("Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized");
                    attrCtx_LVL0_IND2.setDefinition("resolvedFrom/Product/hasAttributes/StateCode");
                    attrCtx_LVL0_IND2.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND2.getContextStrings().add("Product_Resolved_referenceOnly_normalized/hasAttributes/StateCode");
                    }
                }
                expectedContext_referenceOnly_normalized.getContexts().add(attrCtx_LVL0_IND2);
                AttributeContextExpectedValue attrCtx_LVL0_IND3 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND3.setType("attributeDefinition");
                    attrCtx_LVL0_IND3.setName("StateCode_display");
                    attrCtx_LVL0_IND3.setParent("Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized");
                    attrCtx_LVL0_IND3.setDefinition("resolvedFrom/Product/hasAttributes/StateCode_display");
                    attrCtx_LVL0_IND3.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND3.getContextStrings().add("Product_Resolved_referenceOnly_normalized/hasAttributes/StateCode_display");
                    }
                }
                expectedContext_referenceOnly_normalized.getContexts().add(attrCtx_LVL0_IND3);
                AttributeContextExpectedValue attrCtx_LVL0_IND4 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND4.setType("attributeDefinition");
                    attrCtx_LVL0_IND4.setName("StatusCode");
                    attrCtx_LVL0_IND4.setParent("Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized");
                    attrCtx_LVL0_IND4.setDefinition("resolvedFrom/Product/hasAttributes/StatusCode");
                    attrCtx_LVL0_IND4.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND4.getContextStrings().add("Product_Resolved_referenceOnly_normalized/hasAttributes/StatusCode");
                    }
                }
                expectedContext_referenceOnly_normalized.getContexts().add(attrCtx_LVL0_IND4);
                AttributeContextExpectedValue attrCtx_LVL0_IND5 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND5.setType("attributeDefinition");
                    attrCtx_LVL0_IND5.setName("StatusCode_display");
                    attrCtx_LVL0_IND5.setParent("Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized");
                    attrCtx_LVL0_IND5.setDefinition("resolvedFrom/Product/hasAttributes/StatusCode_display");
                    attrCtx_LVL0_IND5.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND5.getContextStrings().add("Product_Resolved_referenceOnly_normalized/hasAttributes/StatusCode_display");
                    }
                }
                expectedContext_referenceOnly_normalized.getContexts().add(attrCtx_LVL0_IND5);
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
                    attrCtx_LVL0_IND1.setName("ID");
                    attrCtx_LVL0_IND1.setParent("Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Product/hasAttributes/ID");
                    attrCtx_LVL0_IND1.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND1.getContextStrings().add("Product_Resolved_referenceOnly_structured/hasAttributes/ID");
                    }
                }
                expectedContext_referenceOnly_structured.getContexts().add(attrCtx_LVL0_IND1);
                AttributeContextExpectedValue attrCtx_LVL0_IND2 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND2.setType("attributeDefinition");
                    attrCtx_LVL0_IND2.setName("StateCode");
                    attrCtx_LVL0_IND2.setParent("Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured");
                    attrCtx_LVL0_IND2.setDefinition("resolvedFrom/Product/hasAttributes/StateCode");
                    attrCtx_LVL0_IND2.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND2.getContextStrings().add("Product_Resolved_referenceOnly_structured/hasAttributes/StateCode");
                    }
                }
                expectedContext_referenceOnly_structured.getContexts().add(attrCtx_LVL0_IND2);
                AttributeContextExpectedValue attrCtx_LVL0_IND3 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND3.setType("attributeDefinition");
                    attrCtx_LVL0_IND3.setName("StateCode_display");
                    attrCtx_LVL0_IND3.setParent("Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured");
                    attrCtx_LVL0_IND3.setDefinition("resolvedFrom/Product/hasAttributes/StateCode_display");
                    attrCtx_LVL0_IND3.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND3.getContextStrings().add("Product_Resolved_referenceOnly_structured/hasAttributes/StateCode_display");
                    }
                }
                expectedContext_referenceOnly_structured.getContexts().add(attrCtx_LVL0_IND3);
                AttributeContextExpectedValue attrCtx_LVL0_IND4 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND4.setType("attributeDefinition");
                    attrCtx_LVL0_IND4.setName("StatusCode");
                    attrCtx_LVL0_IND4.setParent("Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured");
                    attrCtx_LVL0_IND4.setDefinition("resolvedFrom/Product/hasAttributes/StatusCode");
                    attrCtx_LVL0_IND4.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND4.getContextStrings().add("Product_Resolved_referenceOnly_structured/hasAttributes/StatusCode");
                    }
                }
                expectedContext_referenceOnly_structured.getContexts().add(attrCtx_LVL0_IND4);
                AttributeContextExpectedValue attrCtx_LVL0_IND5 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND5.setType("attributeDefinition");
                    attrCtx_LVL0_IND5.setName("StatusCode_display");
                    attrCtx_LVL0_IND5.setParent("Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured");
                    attrCtx_LVL0_IND5.setDefinition("resolvedFrom/Product/hasAttributes/StatusCode_display");
                    attrCtx_LVL0_IND5.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND5.getContextStrings().add("Product_Resolved_referenceOnly_structured/hasAttributes/StatusCode_display");
                    }
                }
                expectedContext_referenceOnly_structured.getContexts().add(attrCtx_LVL0_IND5);
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
                    attrCtx_LVL0_IND1.setName("ID");
                    attrCtx_LVL0_IND1.setParent("Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Product/hasAttributes/ID");
                    attrCtx_LVL0_IND1.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND1.getContextStrings().add("Product_Resolved_referenceOnly_normalized_structured/hasAttributes/ID");
                    }
                }
                expectedContext_referenceOnly_normalized_structured.getContexts().add(attrCtx_LVL0_IND1);
                AttributeContextExpectedValue attrCtx_LVL0_IND2 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND2.setType("attributeDefinition");
                    attrCtx_LVL0_IND2.setName("StateCode");
                    attrCtx_LVL0_IND2.setParent("Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured");
                    attrCtx_LVL0_IND2.setDefinition("resolvedFrom/Product/hasAttributes/StateCode");
                    attrCtx_LVL0_IND2.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND2.getContextStrings().add("Product_Resolved_referenceOnly_normalized_structured/hasAttributes/StateCode");
                    }
                }
                expectedContext_referenceOnly_normalized_structured.getContexts().add(attrCtx_LVL0_IND2);
                AttributeContextExpectedValue attrCtx_LVL0_IND3 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND3.setType("attributeDefinition");
                    attrCtx_LVL0_IND3.setName("StateCode_display");
                    attrCtx_LVL0_IND3.setParent("Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured");
                    attrCtx_LVL0_IND3.setDefinition("resolvedFrom/Product/hasAttributes/StateCode_display");
                    attrCtx_LVL0_IND3.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND3.getContextStrings().add("Product_Resolved_referenceOnly_normalized_structured/hasAttributes/StateCode_display");
                    }
                }
                expectedContext_referenceOnly_normalized_structured.getContexts().add(attrCtx_LVL0_IND3);
                AttributeContextExpectedValue attrCtx_LVL0_IND4 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND4.setType("attributeDefinition");
                    attrCtx_LVL0_IND4.setName("StatusCode");
                    attrCtx_LVL0_IND4.setParent("Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured");
                    attrCtx_LVL0_IND4.setDefinition("resolvedFrom/Product/hasAttributes/StatusCode");
                    attrCtx_LVL0_IND4.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND4.getContextStrings().add("Product_Resolved_referenceOnly_normalized_structured/hasAttributes/StatusCode");
                    }
                }
                expectedContext_referenceOnly_normalized_structured.getContexts().add(attrCtx_LVL0_IND4);
                AttributeContextExpectedValue attrCtx_LVL0_IND5 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND5.setType("attributeDefinition");
                    attrCtx_LVL0_IND5.setName("StatusCode_display");
                    attrCtx_LVL0_IND5.setParent("Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured");
                    attrCtx_LVL0_IND5.setDefinition("resolvedFrom/Product/hasAttributes/StatusCode_display");
                    attrCtx_LVL0_IND5.setContextStrings(new ArrayList<String>());
                    {
                        attrCtx_LVL0_IND5.getContextStrings().add("Product_Resolved_referenceOnly_normalized_structured/hasAttributes/StatusCode_display");
                    }
                }
                expectedContext_referenceOnly_normalized_structured.getContexts().add(attrCtx_LVL0_IND5);
            }

            List<AttributeExpectedValue> expected_default = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Product_Resolved_default/attributeContext/Product_Resolved_default/ID");
                    att1.setDataFormat("Guid");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_default.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Product_Resolved_default/attributeContext/Product_Resolved_default/StateCode");
                    att2.setDataFormat("Int32");
                    att2.setName("StateCode");
                    att2.setSourceName("StateCode");
                }
                expected_default.add(att2);

                AttributeExpectedValue att3 = new AttributeExpectedValue();
                {
                    att3.setAttributeContext("Product_Resolved_default/attributeContext/Product_Resolved_default/StateCode_display");
                    att3.setDataFormat("String");
                    att3.setName("StateCode_display");
                }
                expected_default.add(att3);

                AttributeExpectedValue att4 = new AttributeExpectedValue();
                {
                    att4.setAttributeContext("Product_Resolved_default/attributeContext/Product_Resolved_default/StatusCode");
                    att4.setDataFormat("Int32");
                    att4.setName("StatusCode");
                    att4.setSourceName("StatusCode");
                }
                expected_default.add(att4);

                AttributeExpectedValue att5 = new AttributeExpectedValue();
                {
                    att5.setAttributeContext("Product_Resolved_default/attributeContext/Product_Resolved_default/StatusCode_display");
                    att5.setDataFormat("String");
                    att5.setName("StatusCode_display");
                }
                expected_default.add(att5);
            }
            List<AttributeExpectedValue> expected_normalized = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/ID");
                    att1.setDataFormat("Guid");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_normalized.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/StateCode");
                    att2.setDataFormat("Int32");
                    att2.setName("StateCode");
                    att2.setSourceName("StateCode");
                }
                expected_normalized.add(att2);

                AttributeExpectedValue att3 = new AttributeExpectedValue();
                {
                    att3.setAttributeContext("Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/StateCode_display");
                    att3.setDataFormat("String");
                    att3.setName("StateCode_display");
                }
                expected_normalized.add(att3);

                AttributeExpectedValue att4 = new AttributeExpectedValue();
                {
                    att4.setAttributeContext("Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/StatusCode");
                    att4.setDataFormat("Int32");
                    att4.setName("StatusCode");
                    att4.setSourceName("StatusCode");
                }
                expected_normalized.add(att4);

                AttributeExpectedValue att5 = new AttributeExpectedValue();
                {
                    att5.setAttributeContext("Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/StatusCode_display");
                    att5.setDataFormat("String");
                    att5.setName("StatusCode_display");
                }
                expected_normalized.add(att5);
            }
            List<AttributeExpectedValue> expected_referenceOnly = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/ID");
                    att1.setDataFormat("Guid");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_referenceOnly.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/StateCode");
                    att2.setDataFormat("Int32");
                    att2.setName("StateCode");
                    att2.setSourceName("StateCode");
                }
                expected_referenceOnly.add(att2);

                AttributeExpectedValue att3 = new AttributeExpectedValue();
                {
                    att3.setAttributeContext("Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/StateCode_display");
                    att3.setDataFormat("String");
                    att3.setName("StateCode_display");
                }
                expected_referenceOnly.add(att3);

                AttributeExpectedValue att4 = new AttributeExpectedValue();
                {
                    att4.setAttributeContext("Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/StatusCode");
                    att4.setDataFormat("Int32");
                    att4.setName("StatusCode");
                    att4.setSourceName("StatusCode");
                }
                expected_referenceOnly.add(att4);

                AttributeExpectedValue att5 = new AttributeExpectedValue();
                {
                    att5.setAttributeContext("Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/StatusCode_display");
                    att5.setDataFormat("String");
                    att5.setName("StatusCode_display");
                }
                expected_referenceOnly.add(att5);
            }
            List<AttributeExpectedValue> expected_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Product_Resolved_structured/attributeContext/Product_Resolved_structured/ID");
                    att1.setDataFormat("Guid");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_structured.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Product_Resolved_structured/attributeContext/Product_Resolved_structured/StateCode");
                    att2.setDataFormat("Int32");
                    att2.setName("StateCode");
                    att2.setSourceName("StateCode");
                }
                expected_structured.add(att2);

                AttributeExpectedValue att3 = new AttributeExpectedValue();
                {
                    att3.setAttributeContext("Product_Resolved_structured/attributeContext/Product_Resolved_structured/StateCode_display");
                    att3.setDataFormat("String");
                    att3.setName("StateCode_display");
                }
                expected_structured.add(att3);

                AttributeExpectedValue att4 = new AttributeExpectedValue();
                {
                    att4.setAttributeContext("Product_Resolved_structured/attributeContext/Product_Resolved_structured/StatusCode");
                    att4.setDataFormat("Int32");
                    att4.setName("StatusCode");
                    att4.setSourceName("StatusCode");
                }
                expected_structured.add(att4);

                AttributeExpectedValue att5 = new AttributeExpectedValue();
                {
                    att5.setAttributeContext("Product_Resolved_structured/attributeContext/Product_Resolved_structured/StatusCode_display");
                    att5.setDataFormat("String");
                    att5.setName("StatusCode_display");
                }
                expected_structured.add(att5);
            }
            List<AttributeExpectedValue> expected_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/ID");
                    att1.setDataFormat("Guid");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_normalized_structured.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/StateCode");
                    att2.setDataFormat("Int32");
                    att2.setName("StateCode");
                    att2.setSourceName("StateCode");
                }
                expected_normalized_structured.add(att2);

                AttributeExpectedValue att3 = new AttributeExpectedValue();
                {
                    att3.setAttributeContext("Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/StateCode_display");
                    att3.setDataFormat("String");
                    att3.setName("StateCode_display");
                }
                expected_normalized_structured.add(att3);

                AttributeExpectedValue att4 = new AttributeExpectedValue();
                {
                    att4.setAttributeContext("Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/StatusCode");
                    att4.setDataFormat("Int32");
                    att4.setName("StatusCode");
                    att4.setSourceName("StatusCode");
                }
                expected_normalized_structured.add(att4);

                AttributeExpectedValue att5 = new AttributeExpectedValue();
                {
                    att5.setAttributeContext("Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/StatusCode_display");
                    att5.setDataFormat("String");
                    att5.setName("StatusCode_display");
                }
                expected_normalized_structured.add(att5);

            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/ID");
                    att1.setDataFormat("Guid");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_referenceOnly_normalized.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/StateCode");
                    att2.setDataFormat("Int32");
                    att2.setName("StateCode");
                    att2.setSourceName("StateCode");
                }
                expected_referenceOnly_normalized.add(att2);

                AttributeExpectedValue att3 = new AttributeExpectedValue();
                {
                    att3.setAttributeContext("Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/StateCode_display");
                    att3.setDataFormat("String");
                    att3.setName("StateCode_display");
                }
                expected_referenceOnly_normalized.add(att3);

                AttributeExpectedValue att4 = new AttributeExpectedValue();
                {
                    att4.setAttributeContext("Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/StatusCode");
                    att4.setDataFormat("Int32");
                    att4.setName("StatusCode");
                    att4.setSourceName("StatusCode");
                }
                expected_referenceOnly_normalized.add(att4);

                AttributeExpectedValue att5 = new AttributeExpectedValue();
                {
                    att5.setAttributeContext("Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/StatusCode_display");
                    att5.setDataFormat("String");
                    att5.setName("StatusCode_display");
                }
                expected_referenceOnly_normalized.add(att5);
            }
            List<AttributeExpectedValue> expected_referenceOnly_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/ID");
                    att1.setDataFormat("Guid");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_referenceOnly_structured.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/StateCode");
                    att2.setDataFormat("Int32");
                    att2.setName("StateCode");
                    att2.setSourceName("StateCode");
                }
                expected_referenceOnly_structured.add(att2);

                AttributeExpectedValue att3 = new AttributeExpectedValue();
                {
                    att3.setAttributeContext("Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/StateCode_display");
                    att3.setDataFormat("String");
                    att3.setName("StateCode_display");
                }
                expected_referenceOnly_structured.add(att3);

                AttributeExpectedValue att4 = new AttributeExpectedValue();
                {
                    att4.setAttributeContext("Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/StatusCode");
                    att4.setDataFormat("Int32");
                    att4.setName("StatusCode");
                    att4.setSourceName("StatusCode");
                }
                expected_referenceOnly_structured.add(att4);

                AttributeExpectedValue att5 = new AttributeExpectedValue();
                {
                    att5.setAttributeContext("Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/StatusCode_display");
                    att5.setDataFormat("String");
                    att5.setName("StatusCode_display");
                }
                expected_referenceOnly_structured.add(att5);
            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/ID");
                    att1.setDataFormat("Guid");
                    att1.setPrimaryKey(true);
                    att1.setName("ID");
                    att1.setSourceName("ID");
                }
                expected_referenceOnly_normalized_structured.add(att1);

                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/StateCode");
                    att2.setDataFormat("Int32");
                    att2.setName("StateCode");
                    att2.setSourceName("StateCode");
                }
                expected_referenceOnly_normalized_structured.add(att2);

                AttributeExpectedValue att3 = new AttributeExpectedValue();
                {
                    att3.setAttributeContext("Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/StateCode_display");
                    att3.setDataFormat("String");
                    att3.setName("StateCode_display");
                }
                expected_referenceOnly_normalized_structured.add(att3);

                AttributeExpectedValue att4 = new AttributeExpectedValue();
                {
                    att4.setAttributeContext("Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/StatusCode");
                    att4.setDataFormat("Int32");
                    att4.setName("StatusCode");
                    att4.setSourceName("StatusCode");
                }
                expected_referenceOnly_normalized_structured.add(att4);

                AttributeExpectedValue att5 = new AttributeExpectedValue();
                {
                    att5.setAttributeContext("Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/StatusCode_display");
                    att5.setDataFormat("String");
                    att5.setName("StatusCode_display");
                }
                expected_referenceOnly_normalized_structured.add(att5);
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
