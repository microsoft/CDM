// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.resolutionguidance;

import com.microsoft.commondatamodel.objectmodel.utilities.AttributeContextExpectedValue;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeExpectedValue;
import org.testng.annotations.Test;

import java.util.ArrayList;
import java.util.List;

public class ResolutionGuidanceExpansionAndRenameTest extends CommonTest {

    /**
     * Resolution Guidance Test - Expansion & Rename - Ordinal With AttributeGroupRef
     */
    @Test
    public void testExpansionAndRenamedOrdinalWithAttributeGroupRef() {
        String testName = "testExpansionAndRenamedOrdinalWithAttributeGroupRef";
        {
            String entityName = "EmployeeAddresses";

            AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
            AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();

            List<AttributeExpectedValue> expected_default = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_normalized = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_normalized_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_normalized = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_structured = new ArrayList<AttributeExpectedValue>();
            List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new ArrayList<AttributeExpectedValue>();

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
     * Resolution Guidance Test - Expansion & Rename - Ordinal 2 to 3 and AddCount
     */
    @Test
    public void testExpansionAndRenamedOrdinal23AndAddCount() {
        String testName = "testExpansionAndRenamedOrdinal23AndAddCount";
        {
            String entityName = "EmployeeAddresses";

            AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
            {
                expectedContext_default.setType("entity");
                expectedContext_default.setName("EmployeeAddresses_Resolved_default");
                expectedContext_default.setDefinition("resolvedFrom/EmployeeAddresses");
                expectedContext_default.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_default.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("EmployeeAddress");
                    attrCtx_LVL0_IND1.setParent("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("Address");
                        attrCtx_LVL1_IND0.setParent("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Address");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("entityReferenceExtends");
                            attrCtx_LVL2_IND0.setName("extends");
                            attrCtx_LVL2_IND0.setParent("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/Address");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("CdmEntity");
                                attrCtx_LVL3_IND0.setParent("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/Address/extends");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/CdmEntity");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("City");
                            attrCtx_LVL2_IND1.setParent("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/Address");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Address/hasAttributes/City");
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("State");
                            attrCtx_LVL2_IND2.setParent("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/Address");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/Address/hasAttributes/State");
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                    AttributeContextExpectedValue attrCtx_LVL1_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND1.setType("generatedSet");
                        attrCtx_LVL1_IND1.setName("_generatedAttributeSet");
                        attrCtx_LVL1_IND1.setParent("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress");
                        attrCtx_LVL1_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("addedAttributeExpansionTotal");
                            attrCtx_LVL2_IND0.setName("EmployeeAddress__AddressCount");
                            attrCtx_LVL2_IND0.setParent("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress/resolutionGuidance/countAttribute/AddressCount");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress__AddressCount");
                            }
                        }
                        attrCtx_LVL1_IND1.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("generatedRound");
                            attrCtx_LVL2_IND1.setName("_generatedAttributeRound0");
                            attrCtx_LVL2_IND1.setParent("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet");
                            attrCtx_LVL2_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("attributeDefinition");
                                attrCtx_LVL3_IND0.setName("EmployeeAddress_2_City");
                                attrCtx_LVL3_IND0.setParent("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Address/hasAttributes/City");
                                attrCtx_LVL3_IND0.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND0.getContextStrings().add("EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress_2_City");
                                }
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("attributeDefinition");
                                attrCtx_LVL3_IND1.setName("EmployeeAddress_2_State");
                                attrCtx_LVL3_IND1.setParent("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0");
                                attrCtx_LVL3_IND1.setDefinition("resolvedFrom/Address/hasAttributes/State");
                                attrCtx_LVL3_IND1.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND1.getContextStrings().add("EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress_2_State");
                                }
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("generatedRound");
                            attrCtx_LVL2_IND2.setName("_generatedAttributeRound1");
                            attrCtx_LVL2_IND2.setParent("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet");
                            attrCtx_LVL2_IND2.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("attributeDefinition");
                                attrCtx_LVL3_IND0.setName("EmployeeAddress_3_City");
                                attrCtx_LVL3_IND0.setParent("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Address/hasAttributes/City");
                                attrCtx_LVL3_IND0.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND0.getContextStrings().add("EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress_3_City");
                                }
                            }
                            attrCtx_LVL2_IND2.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("attributeDefinition");
                                attrCtx_LVL3_IND1.setName("EmployeeAddress_3_State");
                                attrCtx_LVL3_IND1.setParent("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1");
                                attrCtx_LVL3_IND1.setDefinition("resolvedFrom/Address/hasAttributes/State");
                                attrCtx_LVL3_IND1.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND1.getContextStrings().add("EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress_3_State");
                                }
                            }
                            attrCtx_LVL2_IND2.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.getContexts().add(attrCtx_LVL2_IND2);
                        AttributeContextExpectedValue attrCtx_LVL2_IND3 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND3.setType("generatedRound");
                            attrCtx_LVL2_IND3.setName("_generatedAttributeRound2");
                            attrCtx_LVL2_IND3.setParent("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet");
                            attrCtx_LVL2_IND3.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("attributeDefinition");
                                attrCtx_LVL3_IND0.setName("EmployeeAddress_4_City");
                                attrCtx_LVL3_IND0.setParent("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Address/hasAttributes/City");
                                attrCtx_LVL3_IND0.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND0.getContextStrings().add("EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress_4_City");
                                }
                            }
                            attrCtx_LVL2_IND3.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("attributeDefinition");
                                attrCtx_LVL3_IND1.setName("EmployeeAddress_4_State");
                                attrCtx_LVL3_IND1.setParent("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2");
                                attrCtx_LVL3_IND1.setDefinition("resolvedFrom/Address/hasAttributes/State");
                                attrCtx_LVL3_IND1.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND1.getContextStrings().add("EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress_4_State");
                                }
                            }
                            attrCtx_LVL2_IND3.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.getContexts().add(attrCtx_LVL2_IND3);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND1);
                }
                expectedContext_default.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
            {
                expectedContext_normalized.setType("entity");
                expectedContext_normalized.setName("EmployeeAddresses_Resolved_normalized");
                expectedContext_normalized.setDefinition("resolvedFrom/EmployeeAddresses");
                expectedContext_normalized.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("EmployeeAddress");
                    attrCtx_LVL0_IND1.setParent("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("Address");
                        attrCtx_LVL1_IND0.setParent("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Address");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("entityReferenceExtends");
                            attrCtx_LVL2_IND0.setName("extends");
                            attrCtx_LVL2_IND0.setParent("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/Address");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("CdmEntity");
                                attrCtx_LVL3_IND0.setParent("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/Address/extends");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/CdmEntity");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("City");
                            attrCtx_LVL2_IND1.setParent("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/Address");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Address/hasAttributes/City");
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("State");
                            attrCtx_LVL2_IND2.setParent("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/Address");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/Address/hasAttributes/State");
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                    AttributeContextExpectedValue attrCtx_LVL1_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND1.setType("generatedSet");
                        attrCtx_LVL1_IND1.setName("_generatedAttributeSet");
                        attrCtx_LVL1_IND1.setParent("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress");
                        attrCtx_LVL1_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("addedAttributeExpansionTotal");
                            attrCtx_LVL2_IND0.setName("EmployeeAddress__AddressCount");
                            attrCtx_LVL2_IND0.setParent("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress/resolutionGuidance/countAttribute/AddressCount");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress__AddressCount");
                            }
                        }
                        attrCtx_LVL1_IND1.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("generatedRound");
                            attrCtx_LVL2_IND1.setName("_generatedAttributeRound0");
                            attrCtx_LVL2_IND1.setParent("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet");
                            attrCtx_LVL2_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("attributeDefinition");
                                attrCtx_LVL3_IND0.setName("EmployeeAddress_2_City");
                                attrCtx_LVL3_IND0.setParent("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Address/hasAttributes/City");
                                attrCtx_LVL3_IND0.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND0.getContextStrings().add("EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress_2_City");
                                }
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("attributeDefinition");
                                attrCtx_LVL3_IND1.setName("EmployeeAddress_2_State");
                                attrCtx_LVL3_IND1.setParent("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0");
                                attrCtx_LVL3_IND1.setDefinition("resolvedFrom/Address/hasAttributes/State");
                                attrCtx_LVL3_IND1.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND1.getContextStrings().add("EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress_2_State");
                                }
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("generatedRound");
                            attrCtx_LVL2_IND2.setName("_generatedAttributeRound1");
                            attrCtx_LVL2_IND2.setParent("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet");
                            attrCtx_LVL2_IND2.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("attributeDefinition");
                                attrCtx_LVL3_IND0.setName("EmployeeAddress_3_City");
                                attrCtx_LVL3_IND0.setParent("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Address/hasAttributes/City");
                                attrCtx_LVL3_IND0.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND0.getContextStrings().add("EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress_3_City");
                                }
                            }
                            attrCtx_LVL2_IND2.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("attributeDefinition");
                                attrCtx_LVL3_IND1.setName("EmployeeAddress_3_State");
                                attrCtx_LVL3_IND1.setParent("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1");
                                attrCtx_LVL3_IND1.setDefinition("resolvedFrom/Address/hasAttributes/State");
                                attrCtx_LVL3_IND1.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND1.getContextStrings().add("EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress_3_State");
                                }
                            }
                            attrCtx_LVL2_IND2.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.getContexts().add(attrCtx_LVL2_IND2);
                        AttributeContextExpectedValue attrCtx_LVL2_IND3 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND3.setType("generatedRound");
                            attrCtx_LVL2_IND3.setName("_generatedAttributeRound2");
                            attrCtx_LVL2_IND3.setParent("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet");
                            attrCtx_LVL2_IND3.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("attributeDefinition");
                                attrCtx_LVL3_IND0.setName("EmployeeAddress_4_City");
                                attrCtx_LVL3_IND0.setParent("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Address/hasAttributes/City");
                                attrCtx_LVL3_IND0.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND0.getContextStrings().add("EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress_4_City");
                                }
                            }
                            attrCtx_LVL2_IND3.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("attributeDefinition");
                                attrCtx_LVL3_IND1.setName("EmployeeAddress_4_State");
                                attrCtx_LVL3_IND1.setParent("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2");
                                attrCtx_LVL3_IND1.setDefinition("resolvedFrom/Address/hasAttributes/State");
                                attrCtx_LVL3_IND1.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND1.getContextStrings().add("EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress_4_State");
                                }
                            }
                            attrCtx_LVL2_IND3.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.getContexts().add(attrCtx_LVL2_IND3);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND1);
                }
                expectedContext_normalized.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly.setType("entity");
                expectedContext_referenceOnly.setName("EmployeeAddresses_Resolved_referenceOnly");
                expectedContext_referenceOnly.setDefinition("resolvedFrom/EmployeeAddresses");
                expectedContext_referenceOnly.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("EmployeeAddress");
                    attrCtx_LVL0_IND1.setParent("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("Address");
                        attrCtx_LVL1_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Address");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("entityReferenceExtends");
                            attrCtx_LVL2_IND0.setName("extends");
                            attrCtx_LVL2_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/Address");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("CdmEntity");
                                attrCtx_LVL3_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/Address/extends");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/CdmEntity");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("City");
                            attrCtx_LVL2_IND1.setParent("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/Address");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Address/hasAttributes/City");
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("State");
                            attrCtx_LVL2_IND2.setParent("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/Address");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/Address/hasAttributes/State");
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                    AttributeContextExpectedValue attrCtx_LVL1_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND1.setType("generatedSet");
                        attrCtx_LVL1_IND1.setName("_generatedAttributeSet");
                        attrCtx_LVL1_IND1.setParent("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress");
                        attrCtx_LVL1_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("addedAttributeExpansionTotal");
                            attrCtx_LVL2_IND0.setName("EmployeeAddress__AddressCount");
                            attrCtx_LVL2_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress/resolutionGuidance/countAttribute/AddressCount");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress__AddressCount");
                            }
                        }
                        attrCtx_LVL1_IND1.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("generatedRound");
                            attrCtx_LVL2_IND1.setName("_generatedAttributeRound0");
                            attrCtx_LVL2_IND1.setParent("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet");
                            attrCtx_LVL2_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("attributeDefinition");
                                attrCtx_LVL3_IND0.setName("EmployeeAddress_2_City");
                                attrCtx_LVL3_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Address/hasAttributes/City");
                                attrCtx_LVL3_IND0.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND0.getContextStrings().add("EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress_2_City");
                                }
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("attributeDefinition");
                                attrCtx_LVL3_IND1.setName("EmployeeAddress_2_State");
                                attrCtx_LVL3_IND1.setParent("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0");
                                attrCtx_LVL3_IND1.setDefinition("resolvedFrom/Address/hasAttributes/State");
                                attrCtx_LVL3_IND1.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND1.getContextStrings().add("EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress_2_State");
                                }
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("generatedRound");
                            attrCtx_LVL2_IND2.setName("_generatedAttributeRound1");
                            attrCtx_LVL2_IND2.setParent("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet");
                            attrCtx_LVL2_IND2.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("attributeDefinition");
                                attrCtx_LVL3_IND0.setName("EmployeeAddress_3_City");
                                attrCtx_LVL3_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Address/hasAttributes/City");
                                attrCtx_LVL3_IND0.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND0.getContextStrings().add("EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress_3_City");
                                }
                            }
                            attrCtx_LVL2_IND2.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("attributeDefinition");
                                attrCtx_LVL3_IND1.setName("EmployeeAddress_3_State");
                                attrCtx_LVL3_IND1.setParent("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1");
                                attrCtx_LVL3_IND1.setDefinition("resolvedFrom/Address/hasAttributes/State");
                                attrCtx_LVL3_IND1.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND1.getContextStrings().add("EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress_3_State");
                                }
                            }
                            attrCtx_LVL2_IND2.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.getContexts().add(attrCtx_LVL2_IND2);
                        AttributeContextExpectedValue attrCtx_LVL2_IND3 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND3.setType("generatedRound");
                            attrCtx_LVL2_IND3.setName("_generatedAttributeRound2");
                            attrCtx_LVL2_IND3.setParent("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet");
                            attrCtx_LVL2_IND3.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("attributeDefinition");
                                attrCtx_LVL3_IND0.setName("EmployeeAddress_4_City");
                                attrCtx_LVL3_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Address/hasAttributes/City");
                                attrCtx_LVL3_IND0.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND0.getContextStrings().add("EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress_4_City");
                                }
                            }
                            attrCtx_LVL2_IND3.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("attributeDefinition");
                                attrCtx_LVL3_IND1.setName("EmployeeAddress_4_State");
                                attrCtx_LVL3_IND1.setParent("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2");
                                attrCtx_LVL3_IND1.setDefinition("resolvedFrom/Address/hasAttributes/State");
                                attrCtx_LVL3_IND1.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND1.getContextStrings().add("EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress_4_State");
                                }
                            }
                            attrCtx_LVL2_IND3.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.getContexts().add(attrCtx_LVL2_IND3);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND1);
                }
                expectedContext_referenceOnly.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
            {
                expectedContext_structured.setType("entity");
                expectedContext_structured.setName("EmployeeAddresses_Resolved_structured");
                expectedContext_structured.setDefinition("resolvedFrom/EmployeeAddresses");
                expectedContext_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("EmployeeAddress");
                    attrCtx_LVL0_IND1.setParent("EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("Address");
                        attrCtx_LVL1_IND0.setParent("EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Address");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("entityReferenceExtends");
                            attrCtx_LVL2_IND0.setName("extends");
                            attrCtx_LVL2_IND0.setParent("EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress/Address");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("CdmEntity");
                                attrCtx_LVL3_IND0.setParent("EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress/Address/extends");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/CdmEntity");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("City");
                            attrCtx_LVL2_IND1.setParent("EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress/Address");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Address/hasAttributes/City");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("EmployeeAddresses_Resolved_structured/hasAttributes/EmployeeAddress/members/City");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("State");
                            attrCtx_LVL2_IND2.setParent("EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress/Address");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/Address/hasAttributes/State");
                            attrCtx_LVL2_IND2.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND2.getContextStrings().add("EmployeeAddresses_Resolved_structured/hasAttributes/EmployeeAddress/members/State");
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
                expectedContext_normalized_structured.setName("EmployeeAddresses_Resolved_normalized_structured");
                expectedContext_normalized_structured.setDefinition("resolvedFrom/EmployeeAddresses");
                expectedContext_normalized_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_normalized_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("EmployeeAddress");
                    attrCtx_LVL0_IND1.setParent("EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("Address");
                        attrCtx_LVL1_IND0.setParent("EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Address");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("entityReferenceExtends");
                            attrCtx_LVL2_IND0.setName("extends");
                            attrCtx_LVL2_IND0.setParent("EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress/Address");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("CdmEntity");
                                attrCtx_LVL3_IND0.setParent("EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress/Address/extends");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/CdmEntity");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("City");
                            attrCtx_LVL2_IND1.setParent("EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress/Address");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Address/hasAttributes/City");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("EmployeeAddresses_Resolved_normalized_structured/hasAttributes/EmployeeAddress/members/City");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("State");
                            attrCtx_LVL2_IND2.setParent("EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress/Address");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/Address/hasAttributes/State");
                            attrCtx_LVL2_IND2.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND2.getContextStrings().add("EmployeeAddresses_Resolved_normalized_structured/hasAttributes/EmployeeAddress/members/State");
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
                expectedContext_referenceOnly_normalized.setName("EmployeeAddresses_Resolved_referenceOnly_normalized");
                expectedContext_referenceOnly_normalized.setDefinition("resolvedFrom/EmployeeAddresses");
                expectedContext_referenceOnly_normalized.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("EmployeeAddress");
                    attrCtx_LVL0_IND1.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("Address");
                        attrCtx_LVL1_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Address");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("entityReferenceExtends");
                            attrCtx_LVL2_IND0.setName("extends");
                            attrCtx_LVL2_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/Address");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("CdmEntity");
                                attrCtx_LVL3_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/Address/extends");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/CdmEntity");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("City");
                            attrCtx_LVL2_IND1.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/Address");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Address/hasAttributes/City");
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("State");
                            attrCtx_LVL2_IND2.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/Address");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/Address/hasAttributes/State");
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND2);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                    AttributeContextExpectedValue attrCtx_LVL1_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND1.setType("generatedSet");
                        attrCtx_LVL1_IND1.setName("_generatedAttributeSet");
                        attrCtx_LVL1_IND1.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress");
                        attrCtx_LVL1_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("addedAttributeExpansionTotal");
                            attrCtx_LVL2_IND0.setName("EmployeeAddress__AddressCount");
                            attrCtx_LVL2_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress/resolutionGuidance/countAttribute/AddressCount");
                            attrCtx_LVL2_IND0.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND0.getContextStrings().add("EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress__AddressCount");
                            }
                        }
                        attrCtx_LVL1_IND1.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("generatedRound");
                            attrCtx_LVL2_IND1.setName("_generatedAttributeRound0");
                            attrCtx_LVL2_IND1.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet");
                            attrCtx_LVL2_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("attributeDefinition");
                                attrCtx_LVL3_IND0.setName("EmployeeAddress_2_City");
                                attrCtx_LVL3_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Address/hasAttributes/City");
                                attrCtx_LVL3_IND0.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND0.getContextStrings().add("EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress_2_City");
                                }
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("attributeDefinition");
                                attrCtx_LVL3_IND1.setName("EmployeeAddress_2_State");
                                attrCtx_LVL3_IND1.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0");
                                attrCtx_LVL3_IND1.setDefinition("resolvedFrom/Address/hasAttributes/State");
                                attrCtx_LVL3_IND1.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND1.getContextStrings().add("EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress_2_State");
                                }
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("generatedRound");
                            attrCtx_LVL2_IND2.setName("_generatedAttributeRound1");
                            attrCtx_LVL2_IND2.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet");
                            attrCtx_LVL2_IND2.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("attributeDefinition");
                                attrCtx_LVL3_IND0.setName("EmployeeAddress_3_City");
                                attrCtx_LVL3_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Address/hasAttributes/City");
                                attrCtx_LVL3_IND0.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND0.getContextStrings().add("EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress_3_City");
                                }
                            }
                            attrCtx_LVL2_IND2.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("attributeDefinition");
                                attrCtx_LVL3_IND1.setName("EmployeeAddress_3_State");
                                attrCtx_LVL3_IND1.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1");
                                attrCtx_LVL3_IND1.setDefinition("resolvedFrom/Address/hasAttributes/State");
                                attrCtx_LVL3_IND1.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND1.getContextStrings().add("EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress_3_State");
                                }
                            }
                            attrCtx_LVL2_IND2.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.getContexts().add(attrCtx_LVL2_IND2);
                        AttributeContextExpectedValue attrCtx_LVL2_IND3 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND3.setType("generatedRound");
                            attrCtx_LVL2_IND3.setName("_generatedAttributeRound2");
                            attrCtx_LVL2_IND3.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet");
                            attrCtx_LVL2_IND3.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("attributeDefinition");
                                attrCtx_LVL3_IND0.setName("EmployeeAddress_4_City");
                                attrCtx_LVL3_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Address/hasAttributes/City");
                                attrCtx_LVL3_IND0.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND0.getContextStrings().add("EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress_4_City");
                                }
                            }
                            attrCtx_LVL2_IND3.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("attributeDefinition");
                                attrCtx_LVL3_IND1.setName("EmployeeAddress_4_State");
                                attrCtx_LVL3_IND1.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2");
                                attrCtx_LVL3_IND1.setDefinition("resolvedFrom/Address/hasAttributes/State");
                                attrCtx_LVL3_IND1.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND1.getContextStrings().add("EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress_4_State");
                                }
                            }
                            attrCtx_LVL2_IND3.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.getContexts().add(attrCtx_LVL2_IND3);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND1);
                }
                expectedContext_referenceOnly_normalized.getContexts().add(attrCtx_LVL0_IND1);
            }
            AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
            {
                expectedContext_referenceOnly_structured.setType("entity");
                expectedContext_referenceOnly_structured.setName("EmployeeAddresses_Resolved_referenceOnly_structured");
                expectedContext_referenceOnly_structured.setDefinition("resolvedFrom/EmployeeAddresses");
                expectedContext_referenceOnly_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("EmployeeAddress");
                    attrCtx_LVL0_IND1.setParent("EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("Address");
                        attrCtx_LVL1_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Address");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("entityReferenceExtends");
                            attrCtx_LVL2_IND0.setName("extends");
                            attrCtx_LVL2_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress/Address");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("CdmEntity");
                                attrCtx_LVL3_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress/Address/extends");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/CdmEntity");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("City");
                            attrCtx_LVL2_IND1.setParent("EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress/Address");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Address/hasAttributes/City");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("EmployeeAddresses_Resolved_referenceOnly_structured/hasAttributes/EmployeeAddress/members/City");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("State");
                            attrCtx_LVL2_IND2.setParent("EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress/Address");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/Address/hasAttributes/State");
                            attrCtx_LVL2_IND2.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND2.getContextStrings().add("EmployeeAddresses_Resolved_referenceOnly_structured/hasAttributes/EmployeeAddress/members/State");
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
                expectedContext_referenceOnly_normalized_structured.setName("EmployeeAddresses_Resolved_referenceOnly_normalized_structured");
                expectedContext_referenceOnly_normalized_structured.setDefinition("resolvedFrom/EmployeeAddresses");
                expectedContext_referenceOnly_normalized_structured.setContexts(new ArrayList<AttributeContextExpectedValue>());
                AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND0.setType("entityReferenceExtends");
                    attrCtx_LVL0_IND0.setName("extends");
                    attrCtx_LVL0_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured");
                    attrCtx_LVL0_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("CdmEntity");
                        attrCtx_LVL1_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/extends");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/CdmEntity");
                    }
                    attrCtx_LVL0_IND0.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.getContexts().add(attrCtx_LVL0_IND0);
                AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                {
                    attrCtx_LVL0_IND1.setType("attributeDefinition");
                    attrCtx_LVL0_IND1.setName("EmployeeAddress");
                    attrCtx_LVL0_IND1.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("Address");
                        attrCtx_LVL1_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Address");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("entityReferenceExtends");
                            attrCtx_LVL2_IND0.setName("extends");
                            attrCtx_LVL2_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress/Address");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("CdmEntity");
                                attrCtx_LVL3_IND0.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress/Address/extends");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/CdmEntity");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("City");
                            attrCtx_LVL2_IND1.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress/Address");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Address/hasAttributes/City");
                            attrCtx_LVL2_IND1.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND1.getContextStrings().add("EmployeeAddresses_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeAddress/members/City");
                            }
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                        AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND2.setType("attributeDefinition");
                            attrCtx_LVL2_IND2.setName("State");
                            attrCtx_LVL2_IND2.setParent("EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress/Address");
                            attrCtx_LVL2_IND2.setDefinition("resolvedFrom/Address/hasAttributes/State");
                            attrCtx_LVL2_IND2.setContextStrings(new ArrayList<String>());
                            {
                                attrCtx_LVL2_IND2.getContextStrings().add("EmployeeAddresses_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeAddress/members/State");
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
                    att1.setAttributeContext("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/EmployeeAddress__AddressCount");
                    att1.setDataFormat("Int32");
                    att1.setName("EmployeeAddress__AddressCount");
                }
                expected_default.add(att1);
                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_City");
                    att2.setDataFormat("String");
                    att2.setName("EmployeeAddress_2_City");
                    att2.setSourceName("City");
                }
                expected_default.add(att2);
                AttributeExpectedValue att3 = new AttributeExpectedValue();
                {
                    att3.setAttributeContext("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_State");
                    att3.setDataFormat("String");
                    att3.setName("EmployeeAddress_2_State");
                    att3.setSourceName("State");
                }
                expected_default.add(att3);
                AttributeExpectedValue att4 = new AttributeExpectedValue();
                {
                    att4.setAttributeContext("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_City");
                    att4.setDataFormat("String");
                    att4.setName("EmployeeAddress_3_City");
                    att4.setSourceName("City");
                }
                expected_default.add(att4);
                AttributeExpectedValue att5 = new AttributeExpectedValue();
                {
                    att5.setAttributeContext("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_State");
                    att5.setDataFormat("String");
                    att5.setName("EmployeeAddress_3_State");
                    att5.setSourceName("State");
                }
                expected_default.add(att5);
                AttributeExpectedValue att6 = new AttributeExpectedValue();
                {
                    att6.setAttributeContext("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_City");
                    att6.setDataFormat("String");
                    att6.setName("EmployeeAddress_4_City");
                    att6.setSourceName("City");
                }
                expected_default.add(att6);
                AttributeExpectedValue att7 = new AttributeExpectedValue();
                {
                    att7.setAttributeContext("EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_State");
                    att7.setDataFormat("String");
                    att7.setName("EmployeeAddress_4_State");
                    att7.setSourceName("State");
                }
                expected_default.add(att7);
            }
            List<AttributeExpectedValue> expected_normalized = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/EmployeeAddress__AddressCount");
                    att1.setDataFormat("Int32");
                    att1.setName("EmployeeAddress__AddressCount");
                }
                expected_normalized.add(att1);
                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_City");
                    att2.setDataFormat("String");
                    att2.setName("EmployeeAddress_2_City");
                    att2.setSourceName("City");
                }
                expected_normalized.add(att2);
                AttributeExpectedValue att3 = new AttributeExpectedValue();
                {
                    att3.setAttributeContext("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_State");
                    att3.setDataFormat("String");
                    att3.setName("EmployeeAddress_2_State");
                    att3.setSourceName("State");
                }
                expected_normalized.add(att3);
                AttributeExpectedValue att4 = new AttributeExpectedValue();
                {
                    att4.setAttributeContext("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_City");
                    att4.setDataFormat("String");
                    att4.setName("EmployeeAddress_3_City");
                    att4.setSourceName("City");
                }
                expected_normalized.add(att4);
                AttributeExpectedValue att5 = new AttributeExpectedValue();
                {
                    att5.setAttributeContext("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_State");
                    att5.setDataFormat("String");
                    att5.setName("EmployeeAddress_3_State");
                    att5.setSourceName("State");
                }
                expected_normalized.add(att5);
                AttributeExpectedValue att6 = new AttributeExpectedValue();
                {
                    att6.setAttributeContext("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_City");
                    att6.setDataFormat("String");
                    att6.setName("EmployeeAddress_4_City");
                    att6.setSourceName("City");
                }
                expected_normalized.add(att6);
                AttributeExpectedValue att7 = new AttributeExpectedValue();
                {
                    att7.setAttributeContext("EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_State");
                    att7.setDataFormat("String");
                    att7.setName("EmployeeAddress_4_State");
                    att7.setSourceName("State");
                }
                expected_normalized.add(att7);
            }
            List<AttributeExpectedValue> expected_referenceOnly = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/EmployeeAddress__AddressCount");
                    att1.setDataFormat("Int32");
                    att1.setName("EmployeeAddress__AddressCount");
                }
                expected_referenceOnly.add(att1);
                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_City");
                    att2.setDataFormat("String");
                    att2.setName("EmployeeAddress_2_City");
                    att2.setSourceName("City");
                }
                expected_referenceOnly.add(att2);
                AttributeExpectedValue att3 = new AttributeExpectedValue();
                {
                    att3.setAttributeContext("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_State");
                    att3.setDataFormat("String");
                    att3.setName("EmployeeAddress_2_State");
                    att3.setSourceName("State");
                }
                expected_referenceOnly.add(att3);
                AttributeExpectedValue att4 = new AttributeExpectedValue();
                {
                    att4.setAttributeContext("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_City");
                    att4.setDataFormat("String");
                    att4.setName("EmployeeAddress_3_City");
                    att4.setSourceName("City");
                }
                expected_referenceOnly.add(att4);
                AttributeExpectedValue att5 = new AttributeExpectedValue();
                {
                    att5.setAttributeContext("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_State");
                    att5.setDataFormat("String");
                    att5.setName("EmployeeAddress_3_State");
                    att5.setSourceName("State");
                }
                expected_referenceOnly.add(att5);
                AttributeExpectedValue att6 = new AttributeExpectedValue();
                {
                    att6.setAttributeContext("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_City");
                    att6.setDataFormat("String");
                    att6.setName("EmployeeAddress_4_City");
                    att6.setSourceName("City");
                }
                expected_referenceOnly.add(att6);
                AttributeExpectedValue att7 = new AttributeExpectedValue();
                {
                    att7.setAttributeContext("EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_State");
                    att7.setDataFormat("String");
                    att7.setName("EmployeeAddress_4_State");
                    att7.setSourceName("State");
                }
                expected_referenceOnly.add(att7);
            }
            List<AttributeExpectedValue> expected_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue attribGroupRef = new AttributeExpectedValue();
                {
                    attribGroupRef.setAttributeGroupName("EmployeeAddress");
                    attribGroupRef.setAttributeContext("EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress");
                    attribGroupRef.setMembers(new ArrayList<AttributeExpectedValue>());
                    AttributeExpectedValue attr1 = new AttributeExpectedValue();
                    {
                        attr1.setAttributeContext("EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress/Address/City");
                        attr1.setDataFormat("String");
                        attr1.setName("City");
                    }
                    attribGroupRef.getMembers().add(attr1);
                    AttributeExpectedValue attr2 = new AttributeExpectedValue();
                    {
                        attr2.setAttributeContext("EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress/Address/State");
                        attr2.setDataFormat("String");
                        attr2.setName("State");
                    }
                    attribGroupRef.getMembers().add(attr2);
                    expected_structured.add(attribGroupRef);
                };
            }
            List<AttributeExpectedValue> expected_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue attribGroupRef = new AttributeExpectedValue();
                {
                    attribGroupRef.setAttributeGroupName("EmployeeAddress");
                    attribGroupRef.setAttributeContext("EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress");
                    attribGroupRef.setMembers(new ArrayList<AttributeExpectedValue>());
                    AttributeExpectedValue attr1 = new AttributeExpectedValue();
                    {
                        attr1.setAttributeContext("EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress/Address/City");
                        attr1.setDataFormat("String");
                        attr1.setName("City");
                    }
                    attribGroupRef.getMembers().add(attr1);
                    AttributeExpectedValue attr2 = new AttributeExpectedValue();
                    {
                        attr2.setAttributeContext("EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress/Address/State");
                        attr2.setDataFormat("String");
                        attr2.setName("State");
                    }
                    attribGroupRef.getMembers().add(attr2);
                    expected_normalized_structured.add(attribGroupRef);
                };
            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/EmployeeAddress__AddressCount");
                    att1.setDataFormat("Int32");
                    att1.setName("EmployeeAddress__AddressCount");
                }
                expected_referenceOnly_normalized.add(att1);
                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_City");
                    att2.setDataFormat("String");
                    att2.setName("EmployeeAddress_2_City");
                    att2.setSourceName("City");
                }
                expected_referenceOnly_normalized.add(att2);
                AttributeExpectedValue att3 = new AttributeExpectedValue();
                {
                    att3.setAttributeContext("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_State");
                    att3.setDataFormat("String");
                    att3.setName("EmployeeAddress_2_State");
                    att3.setSourceName("State");
                }
                expected_referenceOnly_normalized.add(att3);
                AttributeExpectedValue att4 = new AttributeExpectedValue();
                {
                    att4.setAttributeContext("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_City");
                    att4.setDataFormat("String");
                    att4.setName("EmployeeAddress_3_City");
                    att4.setSourceName("City");
                }
                expected_referenceOnly_normalized.add(att4);
                AttributeExpectedValue att5 = new AttributeExpectedValue();
                {
                    att5.setAttributeContext("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_State");
                    att5.setDataFormat("String");
                    att5.setName("EmployeeAddress_3_State");
                    att5.setSourceName("State");
                }
                expected_referenceOnly_normalized.add(att5);
                AttributeExpectedValue att6 = new AttributeExpectedValue();
                {
                    att6.setAttributeContext("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_City");
                    att6.setDataFormat("String");
                    att6.setName("EmployeeAddress_4_City");
                    att6.setSourceName("City");
                }
                expected_referenceOnly_normalized.add(att6);
                AttributeExpectedValue att7 = new AttributeExpectedValue();
                {
                    att7.setAttributeContext("EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_State");
                    att7.setDataFormat("String");
                    att7.setName("EmployeeAddress_4_State");
                    att7.setSourceName("State");
                }
                expected_referenceOnly_normalized.add(att7);
            }
            List<AttributeExpectedValue> expected_referenceOnly_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue attribGroupRef = new AttributeExpectedValue();
                {
                    attribGroupRef.setAttributeGroupName("EmployeeAddress");
                    attribGroupRef.setAttributeContext("EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress");
                    attribGroupRef.setMembers(new ArrayList<AttributeExpectedValue>());
                    AttributeExpectedValue attr1 = new AttributeExpectedValue();
                    {
                        attr1.setAttributeContext("EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress/Address/City");
                        attr1.setDataFormat("String");
                        attr1.setName("City");
                    }
                    attribGroupRef.getMembers().add(attr1);
                    AttributeExpectedValue attr2 = new AttributeExpectedValue();
                    {
                        attr2.setAttributeContext("EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress/Address/State");
                        attr2.setDataFormat("String");
                        attr2.setName("State");
                    }
                    attribGroupRef.getMembers().add(attr2);
                    expected_referenceOnly_structured.add(attribGroupRef);
                };
            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue attribGroupRef = new AttributeExpectedValue();
                {
                    attribGroupRef.setAttributeGroupName("EmployeeAddress");
                    attribGroupRef.setAttributeContext("EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress");
                    attribGroupRef.setMembers(new ArrayList<AttributeExpectedValue>());
                    AttributeExpectedValue attr1 = new AttributeExpectedValue();
                    {
                        attr1.setAttributeContext("EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress/Address/City");
                        attr1.setDataFormat("String");
                        attr1.setName("City");
                    }
                    attribGroupRef.getMembers().add(attr1);
                    AttributeExpectedValue attr2 = new AttributeExpectedValue();
                    {
                        attr2.setAttributeContext("EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress/Address/State");
                        attr2.setDataFormat("String");
                        attr2.setName("State");
                    }
                    attribGroupRef.getMembers().add(attr2);
                    expected_referenceOnly_normalized_structured.add(attribGroupRef);
                };
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
