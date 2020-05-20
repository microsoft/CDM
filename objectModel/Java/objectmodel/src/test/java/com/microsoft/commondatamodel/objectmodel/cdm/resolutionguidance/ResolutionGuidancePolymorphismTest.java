// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm.resolutionguidance;

import com.microsoft.commondatamodel.objectmodel.utilities.AttributeContextExpectedValue;
import com.microsoft.commondatamodel.objectmodel.utilities.AttributeExpectedValue;
import org.testng.annotations.Test;

import java.util.ArrayList;
import java.util.List;

public class ResolutionGuidancePolymorphismTest extends CommonTest {

    /**
     * Resolution Guidance Test - Polymorphism
     */
    @Test
    public void testPolymorphism() {
        String testName = "testPolymorphism";
        {
            String entityName = "Customer";

            // Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
            AttributeContextExpectedValue expectedContext_default = null;
            AttributeContextExpectedValue expectedContext_normalized = null;
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
                    attrCtx_LVL0_IND1.setName("customer");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customer");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("Customer");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("contactOption");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Contact");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer/contactOption");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Contact");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("accountOption");
                            attrCtx_LVL2_IND1.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption");
                            attrCtx_LVL2_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Account");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer/accountOption");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Account");
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                    AttributeContextExpectedValue attrCtx_LVL1_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND1.setType("generatedSet");
                        attrCtx_LVL1_IND1.setName("_generatedAttributeSet");
                        attrCtx_LVL1_IND1.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer");
                        attrCtx_LVL1_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("generatedRound");
                            attrCtx_LVL2_IND0.setName("_generatedAttributeRound0");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("addedAttributeIdentity");
                                attrCtx_LVL3_IND0.setName("_foreignKey");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0");
                                attrCtx_LVL3_IND0.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND0.getContextStrings().add("Customer_Resolved_referenceOnly/hasAttributes/customerCustomerId");
                                }
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("addedAttributeSelectedType");
                                attrCtx_LVL3_IND1.setName("_selectedEntityName");
                                attrCtx_LVL3_IND1.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0");
                                attrCtx_LVL3_IND1.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND1.getContextStrings().add("Customer_Resolved_referenceOnly/hasAttributes/customerCustomerIdType");
                                }
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.getContexts().add(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND1);
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
                    attrCtx_LVL0_IND1.setName("customer");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customer");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("Customer");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("contactOption");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Contact");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Contact");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("entityReferenceExtends");
                                    attrCtx_LVL4_IND0.setName("extends");
                                    attrCtx_LVL4_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("CdmEntity");
                                        attrCtx_LVL5_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact/extends");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/CdmEntity");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("ContactID");
                                    attrCtx_LVL4_IND1.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Contact/hasAttributes/ContactID");
                                    attrCtx_LVL4_IND1.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND1.getContextStrings().add("Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/ContactID");
                                    }
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND1);
                                AttributeContextExpectedValue attrCtx_LVL4_IND2 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND2.setType("attributeDefinition");
                                    attrCtx_LVL4_IND2.setName("FullName");
                                    attrCtx_LVL4_IND2.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact");
                                    attrCtx_LVL4_IND2.setDefinition("resolvedFrom/Contact/hasAttributes/FullName");
                                    attrCtx_LVL4_IND2.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND2.getContextStrings().add("Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/FullName");
                                    }
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND2);
                                AttributeContextExpectedValue attrCtx_LVL4_IND3 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND3.setType("attributeDefinition");
                                    attrCtx_LVL4_IND3.setName("Address");
                                    attrCtx_LVL4_IND3.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact");
                                    attrCtx_LVL4_IND3.setDefinition("resolvedFrom/Contact/hasAttributes/Address");
                                    attrCtx_LVL4_IND3.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND3.getContextStrings().add("Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/Address");
                                    }
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND3);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("accountOption");
                            attrCtx_LVL2_IND1.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption");
                            attrCtx_LVL2_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Account");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Account");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("entityReferenceExtends");
                                    attrCtx_LVL4_IND0.setName("extends");
                                    attrCtx_LVL4_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("CdmEntity");
                                        attrCtx_LVL5_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account/extends");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/CdmEntity");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("AccountID");
                                    attrCtx_LVL4_IND1.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Account/hasAttributes/AccountID");
                                    attrCtx_LVL4_IND1.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND1.getContextStrings().add("Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/AccountID");
                                    }
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND1);
                                AttributeContextExpectedValue attrCtx_LVL4_IND2 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND2.setType("attributeDefinition");
                                    attrCtx_LVL4_IND2.setName("CompanyName");
                                    attrCtx_LVL4_IND2.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account");
                                    attrCtx_LVL4_IND2.setDefinition("resolvedFrom/Account/hasAttributes/CompanyName");
                                    attrCtx_LVL4_IND2.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND2.getContextStrings().add("Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/CompanyName");
                                    }
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND2);
                                AttributeContextExpectedValue attrCtx_LVL4_IND3 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND3.setType("attributeDefinition");
                                    attrCtx_LVL4_IND3.setName("Address");
                                    attrCtx_LVL4_IND3.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account");
                                    attrCtx_LVL4_IND3.setDefinition("resolvedFrom/Account/hasAttributes/Address");
                                    attrCtx_LVL4_IND3.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND3.getContextStrings().add("Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/Address");
                                    }
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND3);
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
                    attrCtx_LVL0_IND1.setName("customer");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customer");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("Customer");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("contactOption");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Contact");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Contact");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("entityReferenceExtends");
                                    attrCtx_LVL4_IND0.setName("extends");
                                    attrCtx_LVL4_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("CdmEntity");
                                        attrCtx_LVL5_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact/extends");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/CdmEntity");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("ContactID");
                                    attrCtx_LVL4_IND1.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Contact/hasAttributes/ContactID");
                                    attrCtx_LVL4_IND1.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND1.getContextStrings().add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/ContactID");
                                    }
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND1);
                                AttributeContextExpectedValue attrCtx_LVL4_IND2 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND2.setType("attributeDefinition");
                                    attrCtx_LVL4_IND2.setName("FullName");
                                    attrCtx_LVL4_IND2.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact");
                                    attrCtx_LVL4_IND2.setDefinition("resolvedFrom/Contact/hasAttributes/FullName");
                                    attrCtx_LVL4_IND2.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND2.getContextStrings().add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/FullName");
                                    }
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND2);
                                AttributeContextExpectedValue attrCtx_LVL4_IND3 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND3.setType("attributeDefinition");
                                    attrCtx_LVL4_IND3.setName("Address");
                                    attrCtx_LVL4_IND3.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact");
                                    attrCtx_LVL4_IND3.setDefinition("resolvedFrom/Contact/hasAttributes/Address");
                                    attrCtx_LVL4_IND3.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND3.getContextStrings().add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/Address");
                                    }
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND3);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("accountOption");
                            attrCtx_LVL2_IND1.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption");
                            attrCtx_LVL2_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Account");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Account");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("entityReferenceExtends");
                                    attrCtx_LVL4_IND0.setName("extends");
                                    attrCtx_LVL4_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("CdmEntity");
                                        attrCtx_LVL5_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account/extends");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/CdmEntity");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("AccountID");
                                    attrCtx_LVL4_IND1.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Account/hasAttributes/AccountID");
                                    attrCtx_LVL4_IND1.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND1.getContextStrings().add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/AccountID");
                                    }
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND1);
                                AttributeContextExpectedValue attrCtx_LVL4_IND2 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND2.setType("attributeDefinition");
                                    attrCtx_LVL4_IND2.setName("CompanyName");
                                    attrCtx_LVL4_IND2.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account");
                                    attrCtx_LVL4_IND2.setDefinition("resolvedFrom/Account/hasAttributes/CompanyName");
                                    attrCtx_LVL4_IND2.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND2.getContextStrings().add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/CompanyName");
                                    }
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND2);
                                AttributeContextExpectedValue attrCtx_LVL4_IND3 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND3.setType("attributeDefinition");
                                    attrCtx_LVL4_IND3.setName("Address");
                                    attrCtx_LVL4_IND3.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account");
                                    attrCtx_LVL4_IND3.setDefinition("resolvedFrom/Account/hasAttributes/Address");
                                    attrCtx_LVL4_IND3.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND3.getContextStrings().add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/Address");
                                    }
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND3);
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
                    attrCtx_LVL0_IND1.setName("customer");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customer");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("Customer");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("contactOption");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Contact");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer/contactOption");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Contact");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("accountOption");
                            attrCtx_LVL2_IND1.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption");
                            attrCtx_LVL2_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Account");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer/accountOption");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Account");
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                    AttributeContextExpectedValue attrCtx_LVL1_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND1.setType("generatedSet");
                        attrCtx_LVL1_IND1.setName("_generatedAttributeSet");
                        attrCtx_LVL1_IND1.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer");
                        attrCtx_LVL1_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("generatedRound");
                            attrCtx_LVL2_IND0.setName("_generatedAttributeRound0");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("addedAttributeIdentity");
                                attrCtx_LVL3_IND0.setName("_foreignKey");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0");
                                attrCtx_LVL3_IND0.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND0.getContextStrings().add("Customer_Resolved_referenceOnly_normalized/hasAttributes/customerCustomerId");
                                }
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("addedAttributeSelectedType");
                                attrCtx_LVL3_IND1.setName("_selectedEntityName");
                                attrCtx_LVL3_IND1.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0");
                                attrCtx_LVL3_IND1.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND1.getContextStrings().add("Customer_Resolved_referenceOnly_normalized/hasAttributes/customerCustomerIdType");
                                }
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.getContexts().add(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND1);
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
                    attrCtx_LVL0_IND1.setName("customer");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customer");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("Customer");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("contactOption");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Contact");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer/contactOption");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Contact");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("accountOption");
                            attrCtx_LVL2_IND1.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption");
                            attrCtx_LVL2_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Account");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer/accountOption");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Account");
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                    AttributeContextExpectedValue attrCtx_LVL1_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND1.setType("generatedSet");
                        attrCtx_LVL1_IND1.setName("_generatedAttributeSet");
                        attrCtx_LVL1_IND1.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer");
                        attrCtx_LVL1_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("generatedRound");
                            attrCtx_LVL2_IND0.setName("_generatedAttributeRound0");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/_generatedAttributeSet");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("addedAttributeIdentity");
                                attrCtx_LVL3_IND0.setName("_foreignKey");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/_generatedAttributeSet/_generatedAttributeRound0");
                                attrCtx_LVL3_IND0.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND0.getContextStrings().add("Customer_Resolved_referenceOnly_structured/hasAttributes/customer/members/customerId");
                                }
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND1.getContexts().add(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND1);
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
                    attrCtx_LVL0_IND1.setName("customer");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customer");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("Customer");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("contactOption");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Contact");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer/contactOption");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Contact");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("accountOption");
                            attrCtx_LVL2_IND1.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption");
                            attrCtx_LVL2_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Account");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer/accountOption");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Account");
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                    AttributeContextExpectedValue attrCtx_LVL1_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND1.setType("generatedSet");
                        attrCtx_LVL1_IND1.setName("_generatedAttributeSet");
                        attrCtx_LVL1_IND1.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer");
                        attrCtx_LVL1_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("generatedRound");
                            attrCtx_LVL2_IND0.setName("_generatedAttributeRound0");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/_generatedAttributeSet");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("addedAttributeIdentity");
                                attrCtx_LVL3_IND0.setName("_foreignKey");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/_generatedAttributeSet/_generatedAttributeRound0");
                                attrCtx_LVL3_IND0.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND0.getContextStrings().add("Customer_Resolved_referenceOnly_normalized_structured/hasAttributes/customer/members/customerId");
                                }
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND1.getContexts().add(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND1);
                }
                expectedContext_referenceOnly_normalized_structured.getContexts().add(attrCtx_LVL0_IND1);
            }

            // Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
            List<AttributeExpectedValue> expected_default = null;
            List<AttributeExpectedValue> expected_normalized = null;
            List<AttributeExpectedValue> expected_referenceOnly = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey");
                    att1.setDataFormat("Guid");
                    att1.setDisplayName("Customer");
                    att1.setName("customerCustomerId");
                    att1.setSourceName("customerid");
                }
                expected_referenceOnly.add(att1);
                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0/_selectedEntityName");
                    att2.setDataFormat("String");
                    att2.setDisplayName("Customer Type");
                    att2.setName("customerCustomerIdType");
                    att2.setSourceName("customeridtype");
                }
                expected_referenceOnly.add(att2);
            }
            List<AttributeExpectedValue> expected_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue attribGroupRef = new AttributeExpectedValue();
                {
                    attribGroupRef.setAttributeGroupName("customer");
                    attribGroupRef.setAttributeContext("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer");
                    attribGroupRef.setMembers(new ArrayList<AttributeExpectedValue>());
                    AttributeExpectedValue attr1 = new AttributeExpectedValue();
                    {
                        attr1.setDataFormat("Unknown");
                    }
                    attribGroupRef.getMembers().add(attr1);
                    AttributeExpectedValue attr2 = new AttributeExpectedValue();
                    {
                        attr2.setDataFormat("Unknown");
                    }
                    attribGroupRef.getMembers().add(attr2);
                    expected_structured.add(attribGroupRef);
                };
            }
            List<AttributeExpectedValue> expected_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue attribGroupRef = new AttributeExpectedValue();
                {
                    attribGroupRef.setAttributeGroupName("customer");
                    attribGroupRef.setAttributeContext("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer");
                    attribGroupRef.setMembers(new ArrayList<AttributeExpectedValue>());
                    AttributeExpectedValue attr1 = new AttributeExpectedValue();
                    {
                        attr1.setDataFormat("Unknown");
                    }
                    attribGroupRef.getMembers().add(attr1);
                    AttributeExpectedValue attr2 = new AttributeExpectedValue();
                    {
                        attr2.setDataFormat("Unknown");
                    }
                    attribGroupRef.getMembers().add(attr2);
                    expected_normalized_structured.add(attribGroupRef);
                };
            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey");
                    att1.setDataFormat("Guid");
                    att1.setDisplayName("Customer");
                    att1.setName("customerCustomerId");
                    att1.setSourceName("customerid");
                }
                expected_referenceOnly_normalized.add(att1);
                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0/_selectedEntityName");
                    att2.setDataFormat("String");
                    att2.setDisplayName("Customer Type");
                    att2.setName("customerCustomerIdType");
                    att2.setSourceName("customeridtype");
                }
                expected_referenceOnly_normalized.add(att2);
            }
            List<AttributeExpectedValue> expected_referenceOnly_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue attribGroupRef = new AttributeExpectedValue();
                {
                    attribGroupRef.setAttributeGroupName("customer");
                    attribGroupRef.setAttributeContext("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer");
                    attribGroupRef.setMembers(new ArrayList<AttributeExpectedValue>());
                    AttributeExpectedValue attr1 = new AttributeExpectedValue();
                    {
                        attr1.setAttributeContext("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey");
                        attr1.setDataFormat("Guid");
                        attr1.setDisplayName("Customer");
                        attr1.setName("customerId");
                        attr1.setSourceName("customerid");
                    }
                    attribGroupRef.getMembers().add(attr1);
                    expected_referenceOnly_structured.add(attribGroupRef);
                };
            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue attribGroupRef = new AttributeExpectedValue();
                {
                    attribGroupRef.setAttributeGroupName("customer");
                    attribGroupRef.setAttributeContext("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer");
                    attribGroupRef.setMembers(new ArrayList<AttributeExpectedValue>());
                    AttributeExpectedValue attr1 = new AttributeExpectedValue();
                    {
                        attr1.setAttributeContext("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey");
                        attr1.setDataFormat("Guid");
                        attr1.setDisplayName("Customer");
                        attr1.setName("customerId");
                        attr1.setSourceName("customerid");
                    }
                    attribGroupRef.getMembers().add(attr1);
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

    /**
     * Resolution Guidance Test - Polymorphism With AttributeGroupRef
     */
    @Test
    public void testPolymorphismWithAttributeGroupRef() {
        String testName = "testPolymorphismWithAttributeGroupRef";
        {
            String entityName = "Customer";

            // Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
            AttributeContextExpectedValue expectedContext_default = null;
            AttributeContextExpectedValue expectedContext_normalized = null;
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
                    attrCtx_LVL0_IND1.setName("customerIdAttribute");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("customerIdAttribute");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("customer");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Customer");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("attributeDefinition");
                                    attrCtx_LVL4_IND0.setName("contactOption");
                                    attrCtx_LVL4_IND0.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/Customer");
                                    attrCtx_LVL4_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/contactOption");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("Contact");
                                        attrCtx_LVL5_IND0.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Contact");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("accountOption");
                                    attrCtx_LVL4_IND1.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/Customer");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/accountOption");
                                    attrCtx_LVL4_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("Account");
                                        attrCtx_LVL5_IND0.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Account");
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
                                attrCtx_LVL3_IND1.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer");
                                attrCtx_LVL3_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("generatedRound");
                                    attrCtx_LVL4_IND0.setName("_generatedAttributeRound0");
                                    attrCtx_LVL4_IND0.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("addedAttributeIdentity");
                                        attrCtx_LVL5_IND0.setName("_foreignKey");
                                        attrCtx_LVL5_IND0.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0");
                                        attrCtx_LVL5_IND0.setContextStrings(new ArrayList<String>());
                                        {
                                            attrCtx_LVL5_IND0.getContextStrings().add("Customer_Resolved_referenceOnly/hasAttributes/customerCustomerId");
                                        }
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL5_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND1.setType("addedAttributeSelectedType");
                                        attrCtx_LVL5_IND1.setName("_selectedEntityName");
                                        attrCtx_LVL5_IND1.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0");
                                        attrCtx_LVL5_IND1.setContextStrings(new ArrayList<String>());
                                        {
                                            attrCtx_LVL5_IND1.getContextStrings().add("Customer_Resolved_referenceOnly/hasAttributes/customerCustomerIdType");
                                        }
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND1);
                                }
                                attrCtx_LVL3_IND1.getContexts().add(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
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
                    attrCtx_LVL0_IND1.setName("customerIdAttribute");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("customerIdAttribute");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("customer");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Customer");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("attributeDefinition");
                                    attrCtx_LVL4_IND0.setName("contactOption");
                                    attrCtx_LVL4_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer");
                                    attrCtx_LVL4_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/contactOption");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("Contact");
                                        attrCtx_LVL5_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Contact");
                                        attrCtx_LVL5_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                        AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.setType("entityReferenceExtends");
                                            attrCtx_LVL6_IND0.setName("extends");
                                            attrCtx_LVL6_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact");
                                            attrCtx_LVL6_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                            AttributeContextExpectedValue attrCtx_LVL7_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL7_IND0.setType("entity");
                                                attrCtx_LVL7_IND0.setName("CdmEntity");
                                                attrCtx_LVL7_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/extends");
                                                attrCtx_LVL7_IND0.setDefinition("resolvedFrom/CdmEntity");
                                            }
                                            attrCtx_LVL6_IND0.getContexts().add(attrCtx_LVL7_IND0);
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.setType("attributeDefinition");
                                            attrCtx_LVL6_IND1.setName("attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND1.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact");
                                            attrCtx_LVL6_IND1.setDefinition("resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                            AttributeContextExpectedValue attrCtx_LVL7_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL7_IND0.setType("attributeGroup");
                                                attrCtx_LVL7_IND0.setName("attributesAddedAtThisScope");
                                                attrCtx_LVL7_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope");
                                                attrCtx_LVL7_IND0.setDefinition("resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope");
                                                attrCtx_LVL7_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                                AttributeContextExpectedValue attrCtx_LVL8_IND0 = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL8_IND0.setType("attributeDefinition");
                                                    attrCtx_LVL8_IND0.setName("ContactID");
                                                    attrCtx_LVL8_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                                    attrCtx_LVL8_IND0.setDefinition("resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope/members/ContactID");
                                                    attrCtx_LVL8_IND0.setContextStrings(new ArrayList<String>());
                                                    {
                                                        attrCtx_LVL8_IND0.getContextStrings().add("Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/ContactID");
                                                    }
                                                }
                                                attrCtx_LVL7_IND0.getContexts().add(attrCtx_LVL8_IND0);
                                                AttributeContextExpectedValue attrCtx_LVL8_IND1 = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL8_IND1.setType("attributeDefinition");
                                                    attrCtx_LVL8_IND1.setName("FullName");
                                                    attrCtx_LVL8_IND1.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                                    attrCtx_LVL8_IND1.setDefinition("resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope/members/FullName");
                                                    attrCtx_LVL8_IND1.setContextStrings(new ArrayList<String>());
                                                    {
                                                        attrCtx_LVL8_IND1.getContextStrings().add("Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/FullName");
                                                    }
                                                }
                                                attrCtx_LVL7_IND0.getContexts().add(attrCtx_LVL8_IND1);
                                                AttributeContextExpectedValue attrCtx_LVL8_IND2 = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL8_IND2.setType("attributeDefinition");
                                                    attrCtx_LVL8_IND2.setName("Address");
                                                    attrCtx_LVL8_IND2.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                                    attrCtx_LVL8_IND2.setDefinition("resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope/members/Address");
                                                    attrCtx_LVL8_IND2.setContextStrings(new ArrayList<String>());
                                                    {
                                                        attrCtx_LVL8_IND2.getContextStrings().add("Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/Address");
                                                    }
                                                }
                                                attrCtx_LVL7_IND0.getContexts().add(attrCtx_LVL8_IND2);
                                            }
                                            attrCtx_LVL6_IND1.getContexts().add(attrCtx_LVL7_IND0);
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND1);
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("accountOption");
                                    attrCtx_LVL4_IND1.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/accountOption");
                                    attrCtx_LVL4_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("Account");
                                        attrCtx_LVL5_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Account");
                                        attrCtx_LVL5_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                        AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.setType("entityReferenceExtends");
                                            attrCtx_LVL6_IND0.setName("extends");
                                            attrCtx_LVL6_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account");
                                            attrCtx_LVL6_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                            AttributeContextExpectedValue attrCtx_LVL7_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL7_IND0.setType("entity");
                                                attrCtx_LVL7_IND0.setName("CdmEntity");
                                                attrCtx_LVL7_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/extends");
                                                attrCtx_LVL7_IND0.setDefinition("resolvedFrom/CdmEntity");
                                            }
                                            attrCtx_LVL6_IND0.getContexts().add(attrCtx_LVL7_IND0);
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.setType("attributeDefinition");
                                            attrCtx_LVL6_IND1.setName("attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND1.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account");
                                            attrCtx_LVL6_IND1.setDefinition("resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                            AttributeContextExpectedValue attrCtx_LVL7_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL7_IND0.setType("attributeGroup");
                                                attrCtx_LVL7_IND0.setName("attributesAddedAtThisScope");
                                                attrCtx_LVL7_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope");
                                                attrCtx_LVL7_IND0.setDefinition("resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope");
                                                attrCtx_LVL7_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                                AttributeContextExpectedValue attrCtx_LVL8_IND0 = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL8_IND0.setType("attributeDefinition");
                                                    attrCtx_LVL8_IND0.setName("AccountID");
                                                    attrCtx_LVL8_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                                    attrCtx_LVL8_IND0.setDefinition("resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope/members/AccountID");
                                                    attrCtx_LVL8_IND0.setContextStrings(new ArrayList<String>());
                                                    {
                                                        attrCtx_LVL8_IND0.getContextStrings().add("Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/AccountID");
                                                    }
                                                }
                                                attrCtx_LVL7_IND0.getContexts().add(attrCtx_LVL8_IND0);
                                                AttributeContextExpectedValue attrCtx_LVL8_IND1 = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL8_IND1.setType("attributeDefinition");
                                                    attrCtx_LVL8_IND1.setName("CompanyName");
                                                    attrCtx_LVL8_IND1.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                                    attrCtx_LVL8_IND1.setDefinition("resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope/members/CompanyName");
                                                    attrCtx_LVL8_IND1.setContextStrings(new ArrayList<String>());
                                                    {
                                                        attrCtx_LVL8_IND1.getContextStrings().add("Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/CompanyName");
                                                    }
                                                }
                                                attrCtx_LVL7_IND0.getContexts().add(attrCtx_LVL8_IND1);
                                                AttributeContextExpectedValue attrCtx_LVL8_IND2 = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL8_IND2.setType("attributeDefinition");
                                                    attrCtx_LVL8_IND2.setName("Address");
                                                    attrCtx_LVL8_IND2.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                                    attrCtx_LVL8_IND2.setDefinition("resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope/members/Address");
                                                    attrCtx_LVL8_IND2.setContextStrings(new ArrayList<String>());
                                                    {
                                                        attrCtx_LVL8_IND2.getContextStrings().add("Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/Address");
                                                    }
                                                }
                                                attrCtx_LVL7_IND0.getContexts().add(attrCtx_LVL8_IND2);
                                            }
                                            attrCtx_LVL6_IND1.getContexts().add(attrCtx_LVL7_IND0);
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
                    attrCtx_LVL0_IND1.setName("customerIdAttribute");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("customerIdAttribute");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("customer");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Customer");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("attributeDefinition");
                                    attrCtx_LVL4_IND0.setName("contactOption");
                                    attrCtx_LVL4_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer");
                                    attrCtx_LVL4_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/contactOption");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("Contact");
                                        attrCtx_LVL5_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Contact");
                                        attrCtx_LVL5_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                        AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.setType("entityReferenceExtends");
                                            attrCtx_LVL6_IND0.setName("extends");
                                            attrCtx_LVL6_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact");
                                            attrCtx_LVL6_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                            AttributeContextExpectedValue attrCtx_LVL7_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL7_IND0.setType("entity");
                                                attrCtx_LVL7_IND0.setName("CdmEntity");
                                                attrCtx_LVL7_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/extends");
                                                attrCtx_LVL7_IND0.setDefinition("resolvedFrom/CdmEntity");
                                            }
                                            attrCtx_LVL6_IND0.getContexts().add(attrCtx_LVL7_IND0);
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.setType("attributeDefinition");
                                            attrCtx_LVL6_IND1.setName("attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND1.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact");
                                            attrCtx_LVL6_IND1.setDefinition("resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                            AttributeContextExpectedValue attrCtx_LVL7_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL7_IND0.setType("attributeGroup");
                                                attrCtx_LVL7_IND0.setName("attributesAddedAtThisScope");
                                                attrCtx_LVL7_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope");
                                                attrCtx_LVL7_IND0.setDefinition("resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope");
                                                attrCtx_LVL7_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                                AttributeContextExpectedValue attrCtx_LVL8_IND0 = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL8_IND0.setType("attributeDefinition");
                                                    attrCtx_LVL8_IND0.setName("ContactID");
                                                    attrCtx_LVL8_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                                    attrCtx_LVL8_IND0.setDefinition("resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope/members/ContactID");
                                                    attrCtx_LVL8_IND0.setContextStrings(new ArrayList<String>());
                                                    {
                                                        attrCtx_LVL8_IND0.getContextStrings().add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/ContactID");
                                                    }
                                                }
                                                attrCtx_LVL7_IND0.getContexts().add(attrCtx_LVL8_IND0);
                                                AttributeContextExpectedValue attrCtx_LVL8_IND1 = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL8_IND1.setType("attributeDefinition");
                                                    attrCtx_LVL8_IND1.setName("FullName");
                                                    attrCtx_LVL8_IND1.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                                    attrCtx_LVL8_IND1.setDefinition("resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope/members/FullName");
                                                    attrCtx_LVL8_IND1.setContextStrings(new ArrayList<String>());
                                                    {
                                                        attrCtx_LVL8_IND1.getContextStrings().add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/FullName");
                                                    }
                                                }
                                                attrCtx_LVL7_IND0.getContexts().add(attrCtx_LVL8_IND1);
                                                AttributeContextExpectedValue attrCtx_LVL8_IND2 = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL8_IND2.setType("attributeDefinition");
                                                    attrCtx_LVL8_IND2.setName("Address");
                                                    attrCtx_LVL8_IND2.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                                    attrCtx_LVL8_IND2.setDefinition("resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope/members/Address");
                                                    attrCtx_LVL8_IND2.setContextStrings(new ArrayList<String>());
                                                    {
                                                        attrCtx_LVL8_IND2.getContextStrings().add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/Address");
                                                    }
                                                }
                                                attrCtx_LVL7_IND0.getContexts().add(attrCtx_LVL8_IND2);
                                            }
                                            attrCtx_LVL6_IND1.getContexts().add(attrCtx_LVL7_IND0);
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND1);
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("accountOption");
                                    attrCtx_LVL4_IND1.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/accountOption");
                                    attrCtx_LVL4_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("Account");
                                        attrCtx_LVL5_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Account");
                                        attrCtx_LVL5_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                        AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND0.setType("entityReferenceExtends");
                                            attrCtx_LVL6_IND0.setName("extends");
                                            attrCtx_LVL6_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account");
                                            attrCtx_LVL6_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                            AttributeContextExpectedValue attrCtx_LVL7_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL7_IND0.setType("entity");
                                                attrCtx_LVL7_IND0.setName("CdmEntity");
                                                attrCtx_LVL7_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/extends");
                                                attrCtx_LVL7_IND0.setDefinition("resolvedFrom/CdmEntity");
                                            }
                                            attrCtx_LVL6_IND0.getContexts().add(attrCtx_LVL7_IND0);
                                        }
                                        attrCtx_LVL5_IND0.getContexts().add(attrCtx_LVL6_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL6_IND1.setType("attributeDefinition");
                                            attrCtx_LVL6_IND1.setName("attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND1.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account");
                                            attrCtx_LVL6_IND1.setDefinition("resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope");
                                            attrCtx_LVL6_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                            AttributeContextExpectedValue attrCtx_LVL7_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL7_IND0.setType("attributeGroup");
                                                attrCtx_LVL7_IND0.setName("attributesAddedAtThisScope");
                                                attrCtx_LVL7_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope");
                                                attrCtx_LVL7_IND0.setDefinition("resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope");
                                                attrCtx_LVL7_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                                AttributeContextExpectedValue attrCtx_LVL8_IND0 = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL8_IND0.setType("attributeDefinition");
                                                    attrCtx_LVL8_IND0.setName("AccountID");
                                                    attrCtx_LVL8_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                                    attrCtx_LVL8_IND0.setDefinition("resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope/members/AccountID");
                                                    attrCtx_LVL8_IND0.setContextStrings(new ArrayList<String>());
                                                    {
                                                        attrCtx_LVL8_IND0.getContextStrings().add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/AccountID");
                                                    }
                                                }
                                                attrCtx_LVL7_IND0.getContexts().add(attrCtx_LVL8_IND0);
                                                AttributeContextExpectedValue attrCtx_LVL8_IND1 = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL8_IND1.setType("attributeDefinition");
                                                    attrCtx_LVL8_IND1.setName("CompanyName");
                                                    attrCtx_LVL8_IND1.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                                    attrCtx_LVL8_IND1.setDefinition("resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope/members/CompanyName");
                                                    attrCtx_LVL8_IND1.setContextStrings(new ArrayList<String>());
                                                    {
                                                        attrCtx_LVL8_IND1.getContextStrings().add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/CompanyName");
                                                    }
                                                }
                                                attrCtx_LVL7_IND0.getContexts().add(attrCtx_LVL8_IND1);
                                                AttributeContextExpectedValue attrCtx_LVL8_IND2 = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL8_IND2.setType("attributeDefinition");
                                                    attrCtx_LVL8_IND2.setName("Address");
                                                    attrCtx_LVL8_IND2.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope/attributesAddedAtThisScope");
                                                    attrCtx_LVL8_IND2.setDefinition("resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope/members/Address");
                                                    attrCtx_LVL8_IND2.setContextStrings(new ArrayList<String>());
                                                    {
                                                        attrCtx_LVL8_IND2.getContextStrings().add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/Address");
                                                    }
                                                }
                                                attrCtx_LVL7_IND0.getContexts().add(attrCtx_LVL8_IND2);
                                            }
                                            attrCtx_LVL6_IND1.getContexts().add(attrCtx_LVL7_IND0);
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
                    attrCtx_LVL0_IND1.setName("customerIdAttribute");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("customerIdAttribute");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("customer");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Customer");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("attributeDefinition");
                                    attrCtx_LVL4_IND0.setName("contactOption");
                                    attrCtx_LVL4_IND0.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/Customer");
                                    attrCtx_LVL4_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/contactOption");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("Contact");
                                        attrCtx_LVL5_IND0.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Contact");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("accountOption");
                                    attrCtx_LVL4_IND1.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/Customer");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/accountOption");
                                    attrCtx_LVL4_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("Account");
                                        attrCtx_LVL5_IND0.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Account");
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
                                attrCtx_LVL3_IND1.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer");
                                attrCtx_LVL3_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("generatedRound");
                                    attrCtx_LVL4_IND0.setName("_generatedAttributeRound0");
                                    attrCtx_LVL4_IND0.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("addedAttributeIdentity");
                                        attrCtx_LVL5_IND0.setName("_foreignKey");
                                        attrCtx_LVL5_IND0.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0");
                                        attrCtx_LVL5_IND0.setContextStrings(new ArrayList<String>());
                                        {
                                            attrCtx_LVL5_IND0.getContextStrings().add("Customer_Resolved_referenceOnly_normalized/hasAttributes/customerCustomerId");
                                        }
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL5_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND1.setType("addedAttributeSelectedType");
                                        attrCtx_LVL5_IND1.setName("_selectedEntityName");
                                        attrCtx_LVL5_IND1.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0");
                                        attrCtx_LVL5_IND1.setContextStrings(new ArrayList<String>());
                                        {
                                            attrCtx_LVL5_IND1.getContextStrings().add("Customer_Resolved_referenceOnly_normalized/hasAttributes/customerCustomerIdType");
                                        }
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND1);
                                }
                                attrCtx_LVL3_IND1.getContexts().add(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
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
                    attrCtx_LVL0_IND1.setName("customerIdAttribute");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("customerIdAttribute");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("customer");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Customer");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("attributeDefinition");
                                    attrCtx_LVL4_IND0.setName("contactOption");
                                    attrCtx_LVL4_IND0.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/Customer");
                                    attrCtx_LVL4_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/contactOption");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("Contact");
                                        attrCtx_LVL5_IND0.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Contact");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("accountOption");
                                    attrCtx_LVL4_IND1.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/Customer");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/accountOption");
                                    attrCtx_LVL4_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("Account");
                                        attrCtx_LVL5_IND0.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Account");
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
                                attrCtx_LVL3_IND1.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer");
                                attrCtx_LVL3_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("generatedRound");
                                    attrCtx_LVL4_IND0.setName("_generatedAttributeRound0");
                                    attrCtx_LVL4_IND0.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("addedAttributeIdentity");
                                        attrCtx_LVL5_IND0.setName("_foreignKey");
                                        attrCtx_LVL5_IND0.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0");
                                        attrCtx_LVL5_IND0.setContextStrings(new ArrayList<String>());
                                        {
                                            attrCtx_LVL5_IND0.getContextStrings().add("Customer_Resolved_referenceOnly_structured/hasAttributes/customer/members/customerId");
                                        }
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND1.getContexts().add(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
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
                    attrCtx_LVL0_IND1.setName("customerIdAttribute");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("attributeGroup");
                        attrCtx_LVL1_IND0.setName("customerIdAttribute");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("customer");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Customer");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("attributeDefinition");
                                    attrCtx_LVL4_IND0.setName("contactOption");
                                    attrCtx_LVL4_IND0.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer");
                                    attrCtx_LVL4_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/contactOption");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("Contact");
                                        attrCtx_LVL5_IND0.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Contact");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("accountOption");
                                    attrCtx_LVL4_IND1.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/accountOption");
                                    attrCtx_LVL4_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("Account");
                                        attrCtx_LVL5_IND0.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/Account");
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
                                attrCtx_LVL3_IND1.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer");
                                attrCtx_LVL3_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("generatedRound");
                                    attrCtx_LVL4_IND0.setName("_generatedAttributeRound0");
                                    attrCtx_LVL4_IND0.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("addedAttributeIdentity");
                                        attrCtx_LVL5_IND0.setName("_foreignKey");
                                        attrCtx_LVL5_IND0.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0");
                                        attrCtx_LVL5_IND0.setContextStrings(new ArrayList<String>());
                                        {
                                            attrCtx_LVL5_IND0.getContextStrings().add("Customer_Resolved_referenceOnly_normalized_structured/hasAttributes/customer/members/customerId");
                                        }
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND1.getContexts().add(attrCtx_LVL4_IND0);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                }
                expectedContext_referenceOnly_normalized_structured.getContexts().add(attrCtx_LVL0_IND1);
            }

            // Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
            List<AttributeExpectedValue> expected_default = null;
            List<AttributeExpectedValue> expected_normalized = null;
            List<AttributeExpectedValue> expected_referenceOnly = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey");
                    att1.setDataFormat("Guid");
                    att1.setDisplayName("Customer");
                    att1.setName("customerCustomerId");
                    att1.setSourceName("customerid");
                }
                expected_referenceOnly.add(att1);
                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0/_selectedEntityName");
                    att2.setDataFormat("String");
                    att2.setDisplayName("Customer Type");
                    att2.setName("customerCustomerIdType");
                    att2.setSourceName("customeridtype");
                }
                expected_referenceOnly.add(att2);
            }
            List<AttributeExpectedValue> expected_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue attribGroupRef = new AttributeExpectedValue();
                {
                    attribGroupRef.setAttributeGroupName("customer");
                    attribGroupRef.setAttributeContext("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer");
                    attribGroupRef.setMembers(new ArrayList<AttributeExpectedValue>());
                    AttributeExpectedValue attr1 = new AttributeExpectedValue();
                    {
                        attr1.setDataFormat("Unknown");
                    }
                    attribGroupRef.getMembers().add(attr1);
                    AttributeExpectedValue attr2 = new AttributeExpectedValue();
                    {
                        attr2.setDataFormat("Unknown");
                    }
                    attribGroupRef.getMembers().add(attr2);
                    expected_structured.add(attribGroupRef);
                };
            }
            List<AttributeExpectedValue> expected_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue attribGroupRef = new AttributeExpectedValue();
                {
                    attribGroupRef.setAttributeGroupName("customer");
                    attribGroupRef.setAttributeContext("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer");
                    attribGroupRef.setMembers(new ArrayList<AttributeExpectedValue>());
                    AttributeExpectedValue attr1 = new AttributeExpectedValue();
                    {
                        attr1.setDataFormat("Unknown");
                    }
                    attribGroupRef.getMembers().add(attr1);
                    AttributeExpectedValue attr2 = new AttributeExpectedValue();
                    {
                        attr2.setDataFormat("Unknown");
                    }
                    attribGroupRef.getMembers().add(attr2);
                    expected_normalized_structured.add(attribGroupRef);
                };
            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey");
                    att1.setDataFormat("Guid");
                    att1.setDisplayName("Customer");
                    att1.setName("customerCustomerId");
                    att1.setSourceName("customerid");
                }
                expected_referenceOnly_normalized.add(att1);
                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0/_selectedEntityName");
                    att2.setDataFormat("String");
                    att2.setDisplayName("Customer Type");
                    att2.setName("customerCustomerIdType");
                    att2.setSourceName("customeridtype");
                }
                expected_referenceOnly_normalized.add(att2);
            }
            List<AttributeExpectedValue> expected_referenceOnly_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue attribGroupRef = new AttributeExpectedValue();
                {
                    attribGroupRef.setAttributeGroupName("customer");
                    attribGroupRef.setAttributeContext("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer");
                    attribGroupRef.setMembers(new ArrayList<AttributeExpectedValue>());
                    AttributeExpectedValue attr1 = new AttributeExpectedValue();
                    {
                        attr1.setAttributeContext("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey");
                        attr1.setDataFormat("Guid");
                        attr1.setDisplayName("Customer");
                        attr1.setName("customerId");
                        attr1.setSourceName("customerid");
                    }
                    attribGroupRef.getMembers().add(attr1);
                    expected_referenceOnly_structured.add(attribGroupRef);
                };
            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue attribGroupRef = new AttributeExpectedValue();
                {
                    attribGroupRef.setAttributeGroupName("customer");
                    attribGroupRef.setAttributeContext("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer");
                    attribGroupRef.setMembers(new ArrayList<AttributeExpectedValue>());
                    AttributeExpectedValue attr1 = new AttributeExpectedValue();
                    {
                        attr1.setAttributeContext("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey");
                        attr1.setDataFormat("Guid");
                        attr1.setDisplayName("Customer");
                        attr1.setName("customerId");
                        attr1.setSourceName("customerid");
                    }
                    attribGroupRef.getMembers().add(attr1);
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

    /**
     * Resolution Guidance Test - Polymorphism With Rename As Member
     */
    @Test
    public void testPolymorphismWithRenameAsMember() {
        String testName = "testPolymorphismWithRenameAsMember";
        {
            String entityName = "Customer";

            // Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
            AttributeContextExpectedValue expectedContext_default = null;
            AttributeContextExpectedValue expectedContext_normalized = null;
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
                    attrCtx_LVL0_IND1.setName("customer");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customer");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("Customer");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("contactOption");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Contact");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer/contactOption");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Contact");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("accountOption");
                            attrCtx_LVL2_IND1.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption");
                            attrCtx_LVL2_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Account");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer/accountOption");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Account");
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                    AttributeContextExpectedValue attrCtx_LVL1_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND1.setType("generatedSet");
                        attrCtx_LVL1_IND1.setName("_generatedAttributeSet");
                        attrCtx_LVL1_IND1.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer");
                        attrCtx_LVL1_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("generatedRound");
                            attrCtx_LVL2_IND0.setName("_generatedAttributeRound0");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("addedAttributeIdentity");
                                attrCtx_LVL3_IND0.setName("_foreignKey");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0");
                                attrCtx_LVL3_IND0.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND0.getContextStrings().add("Customer_Resolved_referenceOnly/hasAttributes/customerId");
                                }
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("addedAttributeSelectedType");
                                attrCtx_LVL3_IND1.setName("_selectedEntityName");
                                attrCtx_LVL3_IND1.setParent("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0");
                                attrCtx_LVL3_IND1.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND1.getContextStrings().add("Customer_Resolved_referenceOnly/hasAttributes/customerIdType");
                                }
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.getContexts().add(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND1);
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
                    attrCtx_LVL0_IND1.setName("customer");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customer");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("Customer");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("contactOption");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Contact");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Contact");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("entityReferenceExtends");
                                    attrCtx_LVL4_IND0.setName("extends");
                                    attrCtx_LVL4_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("CdmEntity");
                                        attrCtx_LVL5_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact/extends");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/CdmEntity");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("ContactID");
                                    attrCtx_LVL4_IND1.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Contact/hasAttributes/ContactID");
                                    attrCtx_LVL4_IND1.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND1.getContextStrings().add("Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/ContactID");
                                    }
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND1);
                                AttributeContextExpectedValue attrCtx_LVL4_IND2 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND2.setType("attributeDefinition");
                                    attrCtx_LVL4_IND2.setName("FullName");
                                    attrCtx_LVL4_IND2.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact");
                                    attrCtx_LVL4_IND2.setDefinition("resolvedFrom/Contact/hasAttributes/FullName");
                                    attrCtx_LVL4_IND2.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND2.getContextStrings().add("Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/FullName");
                                    }
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND2);
                                AttributeContextExpectedValue attrCtx_LVL4_IND3 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND3.setType("attributeDefinition");
                                    attrCtx_LVL4_IND3.setName("Address");
                                    attrCtx_LVL4_IND3.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact");
                                    attrCtx_LVL4_IND3.setDefinition("resolvedFrom/Contact/hasAttributes/Address");
                                    attrCtx_LVL4_IND3.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND3.getContextStrings().add("Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/Address");
                                    }
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND3);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("accountOption");
                            attrCtx_LVL2_IND1.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption");
                            attrCtx_LVL2_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Account");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Account");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("entityReferenceExtends");
                                    attrCtx_LVL4_IND0.setName("extends");
                                    attrCtx_LVL4_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("CdmEntity");
                                        attrCtx_LVL5_IND0.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account/extends");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/CdmEntity");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("AccountID");
                                    attrCtx_LVL4_IND1.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Account/hasAttributes/AccountID");
                                    attrCtx_LVL4_IND1.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND1.getContextStrings().add("Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/AccountID");
                                    }
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND1);
                                AttributeContextExpectedValue attrCtx_LVL4_IND2 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND2.setType("attributeDefinition");
                                    attrCtx_LVL4_IND2.setName("CompanyName");
                                    attrCtx_LVL4_IND2.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account");
                                    attrCtx_LVL4_IND2.setDefinition("resolvedFrom/Account/hasAttributes/CompanyName");
                                    attrCtx_LVL4_IND2.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND2.getContextStrings().add("Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/CompanyName");
                                    }
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND2);
                                AttributeContextExpectedValue attrCtx_LVL4_IND3 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND3.setType("attributeDefinition");
                                    attrCtx_LVL4_IND3.setName("Address");
                                    attrCtx_LVL4_IND3.setParent("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account");
                                    attrCtx_LVL4_IND3.setDefinition("resolvedFrom/Account/hasAttributes/Address");
                                    attrCtx_LVL4_IND3.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND3.getContextStrings().add("Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/Address");
                                    }
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND3);
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
                    attrCtx_LVL0_IND1.setName("customer");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customer");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("Customer");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("contactOption");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Contact");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Contact");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("entityReferenceExtends");
                                    attrCtx_LVL4_IND0.setName("extends");
                                    attrCtx_LVL4_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("CdmEntity");
                                        attrCtx_LVL5_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact/extends");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/CdmEntity");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("ContactID");
                                    attrCtx_LVL4_IND1.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Contact/hasAttributes/ContactID");
                                    attrCtx_LVL4_IND1.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND1.getContextStrings().add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/ContactID");
                                    }
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND1);
                                AttributeContextExpectedValue attrCtx_LVL4_IND2 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND2.setType("attributeDefinition");
                                    attrCtx_LVL4_IND2.setName("FullName");
                                    attrCtx_LVL4_IND2.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact");
                                    attrCtx_LVL4_IND2.setDefinition("resolvedFrom/Contact/hasAttributes/FullName");
                                    attrCtx_LVL4_IND2.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND2.getContextStrings().add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/FullName");
                                    }
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND2);
                                AttributeContextExpectedValue attrCtx_LVL4_IND3 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND3.setType("attributeDefinition");
                                    attrCtx_LVL4_IND3.setName("Address");
                                    attrCtx_LVL4_IND3.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact");
                                    attrCtx_LVL4_IND3.setDefinition("resolvedFrom/Contact/hasAttributes/Address");
                                    attrCtx_LVL4_IND3.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND3.getContextStrings().add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/Address");
                                    }
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND3);
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("accountOption");
                            attrCtx_LVL2_IND1.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption");
                            attrCtx_LVL2_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Account");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Account");
                                attrCtx_LVL3_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND0.setType("entityReferenceExtends");
                                    attrCtx_LVL4_IND0.setName("extends");
                                    attrCtx_LVL4_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account");
                                    attrCtx_LVL4_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                                    AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL5_IND0.setType("entity");
                                        attrCtx_LVL5_IND0.setName("CdmEntity");
                                        attrCtx_LVL5_IND0.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account/extends");
                                        attrCtx_LVL5_IND0.setDefinition("resolvedFrom/CdmEntity");
                                    }
                                    attrCtx_LVL4_IND0.getContexts().add(attrCtx_LVL5_IND0);
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND0);
                                AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND1.setType("attributeDefinition");
                                    attrCtx_LVL4_IND1.setName("AccountID");
                                    attrCtx_LVL4_IND1.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account");
                                    attrCtx_LVL4_IND1.setDefinition("resolvedFrom/Account/hasAttributes/AccountID");
                                    attrCtx_LVL4_IND1.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND1.getContextStrings().add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/AccountID");
                                    }
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND1);
                                AttributeContextExpectedValue attrCtx_LVL4_IND2 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND2.setType("attributeDefinition");
                                    attrCtx_LVL4_IND2.setName("CompanyName");
                                    attrCtx_LVL4_IND2.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account");
                                    attrCtx_LVL4_IND2.setDefinition("resolvedFrom/Account/hasAttributes/CompanyName");
                                    attrCtx_LVL4_IND2.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND2.getContextStrings().add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/CompanyName");
                                    }
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND2);
                                AttributeContextExpectedValue attrCtx_LVL4_IND3 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL4_IND3.setType("attributeDefinition");
                                    attrCtx_LVL4_IND3.setName("Address");
                                    attrCtx_LVL4_IND3.setParent("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account");
                                    attrCtx_LVL4_IND3.setDefinition("resolvedFrom/Account/hasAttributes/Address");
                                    attrCtx_LVL4_IND3.setContextStrings(new ArrayList<String>());
                                    {
                                        attrCtx_LVL4_IND3.getContextStrings().add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/Address");
                                    }
                                }
                                attrCtx_LVL3_IND0.getContexts().add(attrCtx_LVL4_IND3);
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
                    attrCtx_LVL0_IND1.setName("customer");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customer");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("Customer");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("contactOption");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Contact");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer/contactOption");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Contact");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("accountOption");
                            attrCtx_LVL2_IND1.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption");
                            attrCtx_LVL2_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Account");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer/accountOption");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Account");
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                    AttributeContextExpectedValue attrCtx_LVL1_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND1.setType("generatedSet");
                        attrCtx_LVL1_IND1.setName("_generatedAttributeSet");
                        attrCtx_LVL1_IND1.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer");
                        attrCtx_LVL1_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("generatedRound");
                            attrCtx_LVL2_IND0.setName("_generatedAttributeRound0");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("addedAttributeIdentity");
                                attrCtx_LVL3_IND0.setName("_foreignKey");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0");
                                attrCtx_LVL3_IND0.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND0.getContextStrings().add("Customer_Resolved_referenceOnly_normalized/hasAttributes/customerId");
                                }
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                            AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND1.setType("addedAttributeSelectedType");
                                attrCtx_LVL3_IND1.setName("_selectedEntityName");
                                attrCtx_LVL3_IND1.setParent("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0");
                                attrCtx_LVL3_IND1.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND1.getContextStrings().add("Customer_Resolved_referenceOnly_normalized/hasAttributes/customerIdType");
                                }
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND1);
                        }
                        attrCtx_LVL1_IND1.getContexts().add(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND1);
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
                    attrCtx_LVL0_IND1.setName("customer");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customer");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("Customer");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("contactOption");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Contact");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer/contactOption");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Contact");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("accountOption");
                            attrCtx_LVL2_IND1.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption");
                            attrCtx_LVL2_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Account");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer/accountOption");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Account");
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                    AttributeContextExpectedValue attrCtx_LVL1_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND1.setType("generatedSet");
                        attrCtx_LVL1_IND1.setName("_generatedAttributeSet");
                        attrCtx_LVL1_IND1.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer");
                        attrCtx_LVL1_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("generatedRound");
                            attrCtx_LVL2_IND0.setName("_generatedAttributeRound0");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/_generatedAttributeSet");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("addedAttributeIdentity");
                                attrCtx_LVL3_IND0.setName("_foreignKey");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/_generatedAttributeSet/_generatedAttributeRound0");
                                attrCtx_LVL3_IND0.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND0.getContextStrings().add("Customer_Resolved_referenceOnly_structured/hasAttributes/customer/members/customerId");
                                }
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND1.getContexts().add(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND1);
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
                    attrCtx_LVL0_IND1.setName("customer");
                    attrCtx_LVL0_IND1.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured");
                    attrCtx_LVL0_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customer");
                    attrCtx_LVL0_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                    AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND0.setType("entity");
                        attrCtx_LVL1_IND0.setName("Customer");
                        attrCtx_LVL1_IND0.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer");
                        attrCtx_LVL1_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer");
                        attrCtx_LVL1_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("attributeDefinition");
                            attrCtx_LVL2_IND0.setName("contactOption");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer");
                            attrCtx_LVL2_IND0.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Contact");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer/contactOption");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Contact");
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND0);
                        AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND1.setType("attributeDefinition");
                            attrCtx_LVL2_IND1.setName("accountOption");
                            attrCtx_LVL2_IND1.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer");
                            attrCtx_LVL2_IND1.setDefinition("resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption");
                            attrCtx_LVL2_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("entity");
                                attrCtx_LVL3_IND0.setName("Account");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer/accountOption");
                                attrCtx_LVL3_IND0.setDefinition("resolvedFrom/Account");
                            }
                            attrCtx_LVL2_IND1.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND0.getContexts().add(attrCtx_LVL2_IND1);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND0);
                    AttributeContextExpectedValue attrCtx_LVL1_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL1_IND1.setType("generatedSet");
                        attrCtx_LVL1_IND1.setName("_generatedAttributeSet");
                        attrCtx_LVL1_IND1.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer");
                        attrCtx_LVL1_IND1.setContexts(new ArrayList<AttributeContextExpectedValue>());
                        AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL2_IND0.setType("generatedRound");
                            attrCtx_LVL2_IND0.setName("_generatedAttributeRound0");
                            attrCtx_LVL2_IND0.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/_generatedAttributeSet");
                            attrCtx_LVL2_IND0.setContexts(new ArrayList<AttributeContextExpectedValue>());
                            AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL3_IND0.setType("addedAttributeIdentity");
                                attrCtx_LVL3_IND0.setName("_foreignKey");
                                attrCtx_LVL3_IND0.setParent("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/_generatedAttributeSet/_generatedAttributeRound0");
                                attrCtx_LVL3_IND0.setContextStrings(new ArrayList<String>());
                                {
                                    attrCtx_LVL3_IND0.getContextStrings().add("Customer_Resolved_referenceOnly_normalized_structured/hasAttributes/customer/members/customerId");
                                }
                            }
                            attrCtx_LVL2_IND0.getContexts().add(attrCtx_LVL3_IND0);
                        }
                        attrCtx_LVL1_IND1.getContexts().add(attrCtx_LVL2_IND0);
                    }
                    attrCtx_LVL0_IND1.getContexts().add(attrCtx_LVL1_IND1);
                }
                expectedContext_referenceOnly_normalized_structured.getContexts().add(attrCtx_LVL0_IND1);
            }

            // Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
            List<AttributeExpectedValue> expected_default = null;
            List<AttributeExpectedValue> expected_normalized = null;
            List<AttributeExpectedValue> expected_referenceOnly = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey");
                    att1.setDataFormat("Guid");
                    att1.setDisplayName("Customer");
                    att1.setName("customerId");
                    att1.setSourceName("customerid");
                }
                expected_referenceOnly.add(att1);
                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0/_selectedEntityName");
                    att2.setDataFormat("String");
                    att2.setDisplayName("Customer Type");
                    att2.setName("customerIdType");
                    att2.setSourceName("customeridtype");
                }
                expected_referenceOnly.add(att2);
            }
            List<AttributeExpectedValue> expected_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue attribGroupRef = new AttributeExpectedValue();
                {
                    attribGroupRef.setAttributeGroupName("customer");
                    attribGroupRef.setAttributeContext("Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer");
                    attribGroupRef.setMembers(new ArrayList<AttributeExpectedValue>());
                    AttributeExpectedValue attr1 = new AttributeExpectedValue();
                    {
                        attr1.setDataFormat("Unknown");
                    }
                    attribGroupRef.getMembers().add(attr1);
                    AttributeExpectedValue attr2 = new AttributeExpectedValue();
                    {
                        attr2.setDataFormat("Unknown");
                    }
                    attribGroupRef.getMembers().add(attr2);
                    expected_structured.add(attribGroupRef);
                };
            }
            List<AttributeExpectedValue> expected_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue attribGroupRef = new AttributeExpectedValue();
                {
                    attribGroupRef.setAttributeGroupName("customer");
                    attribGroupRef.setAttributeContext("Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer");
                    attribGroupRef.setMembers(new ArrayList<AttributeExpectedValue>());
                    AttributeExpectedValue attr1 = new AttributeExpectedValue();
                    {
                        attr1.setDataFormat("Unknown");
                    }
                    attribGroupRef.getMembers().add(attr1);
                    AttributeExpectedValue attr2 = new AttributeExpectedValue();
                    {
                        attr2.setDataFormat("Unknown");
                    }
                    attribGroupRef.getMembers().add(attr2);
                    expected_normalized_structured.add(attribGroupRef);
                };
            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue att1 = new AttributeExpectedValue();
                {
                    att1.setAttributeContext("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey");
                    att1.setDataFormat("Guid");
                    att1.setDisplayName("Customer");
                    att1.setName("customerId");
                    att1.setSourceName("customerid");
                }
                expected_referenceOnly_normalized.add(att1);
                AttributeExpectedValue att2 = new AttributeExpectedValue();
                {
                    att2.setAttributeContext("Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0/_selectedEntityName");
                    att2.setDataFormat("String");
                    att2.setDisplayName("Customer Type");
                    att2.setName("customerIdType");
                    att2.setSourceName("customeridtype");
                }
                expected_referenceOnly_normalized.add(att2);
            }
            List<AttributeExpectedValue> expected_referenceOnly_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue attribGroupRef = new AttributeExpectedValue();
                {
                    attribGroupRef.setAttributeGroupName("customer");
                    attribGroupRef.setAttributeContext("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer");
                    attribGroupRef.setMembers(new ArrayList<AttributeExpectedValue>());
                    AttributeExpectedValue attr1 = new AttributeExpectedValue();
                    {
                        attr1.setAttributeContext("Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey");
                        attr1.setDataFormat("Guid");
                        attr1.setDisplayName("Customer");
                        attr1.setName("customerId");
                        attr1.setSourceName("customerid");
                    }
                    attribGroupRef.getMembers().add(attr1);
                    expected_referenceOnly_structured.add(attribGroupRef);
                };
            }
            List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new ArrayList<AttributeExpectedValue>();
            {
                AttributeExpectedValue attribGroupRef = new AttributeExpectedValue();
                {
                    attribGroupRef.setAttributeGroupName("customer");
                    attribGroupRef.setAttributeContext("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer");
                    attribGroupRef.setMembers(new ArrayList<AttributeExpectedValue>());
                    AttributeExpectedValue attr1 = new AttributeExpectedValue();
                    {
                        attr1.setAttributeContext("Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey");
                        attr1.setDataFormat("Guid");
                        attr1.setDisplayName("Customer");
                        attr1.setName("customerId");
                        attr1.setSourceName("customerid");
                    }
                    attribGroupRef.getMembers().add(attr1);
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
