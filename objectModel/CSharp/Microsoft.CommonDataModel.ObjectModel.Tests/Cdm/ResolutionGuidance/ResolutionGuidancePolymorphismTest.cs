// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Tests.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    [TestClass]
    public class ResolutionGuidancePolymorphismTest : CommonTest
    {

        /// <summary>
        /// Resolution Guidance Test - Polymorphism
        /// </summary>
        [TestMethod]
        public async Task TestPolymorphism()
        {
            string testName = "TestPolymorphism";
            {
                string entityName = "Customer";

                // Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
                AttributeContextExpectedValue expectedContext_default = null;
                AttributeContextExpectedValue expectedContext_normalized = null;
                AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly.Type = "entity";
                    expectedContext_referenceOnly.Name = "Customer_Resolved_referenceOnly";
                    expectedContext_referenceOnly.Definition = "resolvedFrom/Customer";
                    expectedContext_referenceOnly.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "customer";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customer";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "Customer";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "contactOption";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Contact";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer/contactOption";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Contact";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "accountOption";
                                attrCtx_LVL2_IND1.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption";
                                attrCtx_LVL2_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Account";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer/accountOption";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Account";
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                        AttributeContextExpectedValue attrCtx_LVL1_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND1.Type = "generatedSet";
                            attrCtx_LVL1_IND1.Name = "_generatedAttributeSet";
                            attrCtx_LVL1_IND1.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer";
                            attrCtx_LVL1_IND1.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "generatedRound";
                                attrCtx_LVL2_IND0.Name = "_generatedAttributeRound0";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "addedAttributeIdentity";
                                    attrCtx_LVL3_IND0.Name = "_foreignKey";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0";
                                    attrCtx_LVL3_IND0.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND0.ContextStrings.Add("Customer_Resolved_referenceOnly/hasAttributes/customerCustomerId");
                                    }
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "addedAttributeSelectedType";
                                    attrCtx_LVL3_IND1.Name = "_selectedEntityName";
                                    attrCtx_LVL3_IND1.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0";
                                    attrCtx_LVL3_IND1.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND1.ContextStrings.Add("Customer_Resolved_referenceOnly/hasAttributes/customerCustomerIdType");
                                    }
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND1.Contexts.Add(attrCtx_LVL2_IND0);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND1);
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_structured.Type = "entity";
                    expectedContext_structured.Name = "Customer_Resolved_structured";
                    expectedContext_structured.Definition = "resolvedFrom/Customer";
                    expectedContext_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "customer";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customer";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "Customer";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "contactOption";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Contact";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Contact";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "ContactID";
                                        attrCtx_LVL4_IND1.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Contact/hasAttributes/ContactID";
                                        attrCtx_LVL4_IND1.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND1.ContextStrings.Add("Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/ContactID");
                                        }
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND1);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND2 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND2.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND2.Name = "FullName";
                                        attrCtx_LVL4_IND2.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact";
                                        attrCtx_LVL4_IND2.Definition = "resolvedFrom/Contact/hasAttributes/FullName";
                                        attrCtx_LVL4_IND2.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND2.ContextStrings.Add("Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/FullName");
                                        }
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND2);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND3 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND3.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND3.Name = "Address";
                                        attrCtx_LVL4_IND3.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact";
                                        attrCtx_LVL4_IND3.Definition = "resolvedFrom/Contact/hasAttributes/Address";
                                        attrCtx_LVL4_IND3.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND3.ContextStrings.Add("Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/Address");
                                        }
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND3);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "accountOption";
                                attrCtx_LVL2_IND1.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption";
                                attrCtx_LVL2_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Account";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Account";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "AccountID";
                                        attrCtx_LVL4_IND1.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Account/hasAttributes/AccountID";
                                        attrCtx_LVL4_IND1.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND1.ContextStrings.Add("Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/AccountID");
                                        }
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND1);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND2 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND2.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND2.Name = "CompanyName";
                                        attrCtx_LVL4_IND2.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account";
                                        attrCtx_LVL4_IND2.Definition = "resolvedFrom/Account/hasAttributes/CompanyName";
                                        attrCtx_LVL4_IND2.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND2.ContextStrings.Add("Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/CompanyName");
                                        }
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND2);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND3 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND3.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND3.Name = "Address";
                                        attrCtx_LVL4_IND3.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account";
                                        attrCtx_LVL4_IND3.Definition = "resolvedFrom/Account/hasAttributes/Address";
                                        attrCtx_LVL4_IND3.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND3.ContextStrings.Add("Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/Address");
                                        }
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND3);
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_normalized_structured.Type = "entity";
                    expectedContext_normalized_structured.Name = "Customer_Resolved_normalized_structured";
                    expectedContext_normalized_structured.Definition = "resolvedFrom/Customer";
                    expectedContext_normalized_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "customer";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customer";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "Customer";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "contactOption";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Contact";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Contact";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "ContactID";
                                        attrCtx_LVL4_IND1.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Contact/hasAttributes/ContactID";
                                        attrCtx_LVL4_IND1.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND1.ContextStrings.Add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/ContactID");
                                        }
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND1);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND2 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND2.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND2.Name = "FullName";
                                        attrCtx_LVL4_IND2.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact";
                                        attrCtx_LVL4_IND2.Definition = "resolvedFrom/Contact/hasAttributes/FullName";
                                        attrCtx_LVL4_IND2.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND2.ContextStrings.Add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/FullName");
                                        }
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND2);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND3 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND3.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND3.Name = "Address";
                                        attrCtx_LVL4_IND3.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact";
                                        attrCtx_LVL4_IND3.Definition = "resolvedFrom/Contact/hasAttributes/Address";
                                        attrCtx_LVL4_IND3.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND3.ContextStrings.Add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/Address");
                                        }
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND3);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "accountOption";
                                attrCtx_LVL2_IND1.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption";
                                attrCtx_LVL2_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Account";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Account";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "AccountID";
                                        attrCtx_LVL4_IND1.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Account/hasAttributes/AccountID";
                                        attrCtx_LVL4_IND1.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND1.ContextStrings.Add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/AccountID");
                                        }
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND1);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND2 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND2.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND2.Name = "CompanyName";
                                        attrCtx_LVL4_IND2.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account";
                                        attrCtx_LVL4_IND2.Definition = "resolvedFrom/Account/hasAttributes/CompanyName";
                                        attrCtx_LVL4_IND2.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND2.ContextStrings.Add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/CompanyName");
                                        }
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND2);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND3 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND3.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND3.Name = "Address";
                                        attrCtx_LVL4_IND3.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account";
                                        attrCtx_LVL4_IND3.Definition = "resolvedFrom/Account/hasAttributes/Address";
                                        attrCtx_LVL4_IND3.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND3.ContextStrings.Add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/Address");
                                        }
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND3);
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly_normalized.Type = "entity";
                    expectedContext_referenceOnly_normalized.Name = "Customer_Resolved_referenceOnly_normalized";
                    expectedContext_referenceOnly_normalized.Definition = "resolvedFrom/Customer";
                    expectedContext_referenceOnly_normalized.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "customer";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customer";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "Customer";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "contactOption";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Contact";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer/contactOption";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Contact";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "accountOption";
                                attrCtx_LVL2_IND1.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption";
                                attrCtx_LVL2_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Account";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer/accountOption";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Account";
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                        AttributeContextExpectedValue attrCtx_LVL1_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND1.Type = "generatedSet";
                            attrCtx_LVL1_IND1.Name = "_generatedAttributeSet";
                            attrCtx_LVL1_IND1.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer";
                            attrCtx_LVL1_IND1.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "generatedRound";
                                attrCtx_LVL2_IND0.Name = "_generatedAttributeRound0";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "addedAttributeIdentity";
                                    attrCtx_LVL3_IND0.Name = "_foreignKey";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0";
                                    attrCtx_LVL3_IND0.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND0.ContextStrings.Add("Customer_Resolved_referenceOnly_normalized/hasAttributes/customerCustomerId");
                                    }
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "addedAttributeSelectedType";
                                    attrCtx_LVL3_IND1.Name = "_selectedEntityName";
                                    attrCtx_LVL3_IND1.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0";
                                    attrCtx_LVL3_IND1.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND1.ContextStrings.Add("Customer_Resolved_referenceOnly_normalized/hasAttributes/customerCustomerIdType");
                                    }
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND1.Contexts.Add(attrCtx_LVL2_IND0);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND1);
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly_structured.Type = "entity";
                    expectedContext_referenceOnly_structured.Name = "Customer_Resolved_referenceOnly_structured";
                    expectedContext_referenceOnly_structured.Definition = "resolvedFrom/Customer";
                    expectedContext_referenceOnly_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "customer";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customer";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "Customer";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "contactOption";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Contact";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer/contactOption";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Contact";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "accountOption";
                                attrCtx_LVL2_IND1.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption";
                                attrCtx_LVL2_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Account";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer/accountOption";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Account";
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                        AttributeContextExpectedValue attrCtx_LVL1_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND1.Type = "generatedSet";
                            attrCtx_LVL1_IND1.Name = "_generatedAttributeSet";
                            attrCtx_LVL1_IND1.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer";
                            attrCtx_LVL1_IND1.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "generatedRound";
                                attrCtx_LVL2_IND0.Name = "_generatedAttributeRound0";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/_generatedAttributeSet";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "addedAttributeIdentity";
                                    attrCtx_LVL3_IND0.Name = "_foreignKey";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/_generatedAttributeSet/_generatedAttributeRound0";
                                    attrCtx_LVL3_IND0.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND0.ContextStrings.Add("Customer_Resolved_referenceOnly_structured/hasAttributes/customer/members/customerId");
                                    }
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND1.Contexts.Add(attrCtx_LVL2_IND0);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND1);
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly_normalized_structured.Type = "entity";
                    expectedContext_referenceOnly_normalized_structured.Name = "Customer_Resolved_referenceOnly_normalized_structured";
                    expectedContext_referenceOnly_normalized_structured.Definition = "resolvedFrom/Customer";
                    expectedContext_referenceOnly_normalized_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "customer";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customer";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "Customer";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "contactOption";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Contact";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer/contactOption";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Contact";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "accountOption";
                                attrCtx_LVL2_IND1.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption";
                                attrCtx_LVL2_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Account";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer/accountOption";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Account";
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                        AttributeContextExpectedValue attrCtx_LVL1_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND1.Type = "generatedSet";
                            attrCtx_LVL1_IND1.Name = "_generatedAttributeSet";
                            attrCtx_LVL1_IND1.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer";
                            attrCtx_LVL1_IND1.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "generatedRound";
                                attrCtx_LVL2_IND0.Name = "_generatedAttributeRound0";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/_generatedAttributeSet";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "addedAttributeIdentity";
                                    attrCtx_LVL3_IND0.Name = "_foreignKey";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/_generatedAttributeSet/_generatedAttributeRound0";
                                    attrCtx_LVL3_IND0.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND0.ContextStrings.Add("Customer_Resolved_referenceOnly_normalized_structured/hasAttributes/customer/members/customerId");
                                    }
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND1.Contexts.Add(attrCtx_LVL2_IND0);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND1);
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }

                // Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
                List<AttributeExpectedValue> expected_default = null;
                List<AttributeExpectedValue> expected_normalized = null;
                List<AttributeExpectedValue> expected_referenceOnly = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey",
                        DataFormat = "Guid",
                        DisplayName = "Customer",
                        Name = "customerCustomerId",
                        SourceName = "customerid",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0/_selectedEntityName",
                        DataFormat = "String",
                        DisplayName = "Customer Type",
                        Name = "customerCustomerIdType",
                        SourceName = "customeridtype",
                    });
                }
                List<AttributeExpectedValue> expected_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "customer";
                        AttribGroupRef.AttributeContext = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            DataFormat = "Unknown",
                        });
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            DataFormat = "Unknown",
                        });
                        expected_structured.Add(AttribGroupRef);
                    };
                }
                List<AttributeExpectedValue> expected_normalized_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "customer";
                        AttribGroupRef.AttributeContext = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            DataFormat = "Unknown",
                        });
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            DataFormat = "Unknown",
                        });
                        expected_normalized_structured.Add(AttribGroupRef);
                    };
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey",
                        DataFormat = "Guid",
                        DisplayName = "Customer",
                        Name = "customerCustomerId",
                        SourceName = "customerid",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0/_selectedEntityName",
                        DataFormat = "String",
                        DisplayName = "Customer Type",
                        Name = "customerCustomerIdType",
                        SourceName = "customeridtype",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "customer";
                        AttribGroupRef.AttributeContext = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey",
                            DataFormat = "Guid",
                            DisplayName = "Customer",
                            Name = "customerId",
                            SourceName = "customerid",
                        });
                        expected_referenceOnly_structured.Add(AttribGroupRef);
                    };
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "customer";
                        AttribGroupRef.AttributeContext = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey",
                            DataFormat = "Guid",
                            DisplayName = "Customer",
                            Name = "customerId",
                            SourceName = "customerid",
                        });
                        expected_referenceOnly_normalized_structured.Add(AttribGroupRef);
                    };
                }

                await RunTestWithValues(
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
                );
            }
        }

        /// <summary>
        /// Resolution Guidance Test - Polymorphism With AttributeGroupRef
        /// </summary>
        [TestMethod]
        public async Task TestPolymorphismWithAttributeGroupRef()
        {
            string testName = "TestPolymorphismWithAttributeGroupRef";
            {
                string entityName = "Customer";

                // Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
                AttributeContextExpectedValue expectedContext_default = null;
                AttributeContextExpectedValue expectedContext_normalized = null;
                AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly.Type = "entity";
                    expectedContext_referenceOnly.Name = "Customer_Resolved_referenceOnly";
                    expectedContext_referenceOnly.Definition = "resolvedFrom/Customer";
                    expectedContext_referenceOnly.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "customerIdAttribute";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "customerIdAttribute";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "customer";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Customer";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND0.Name = "contactOption";
                                        attrCtx_LVL4_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/Customer";
                                        attrCtx_LVL4_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/contactOption";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "Contact";
                                            attrCtx_LVL5_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Contact";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "accountOption";
                                        attrCtx_LVL4_IND1.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/Customer";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/accountOption";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "Account";
                                            attrCtx_LVL5_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Account";
                                        }
                                        attrCtx_LVL4_IND1.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND1);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "generatedSet";
                                    attrCtx_LVL3_IND1.Name = "_generatedAttributeSet";
                                    attrCtx_LVL3_IND1.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer";
                                    attrCtx_LVL3_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "generatedRound";
                                        attrCtx_LVL4_IND0.Name = "_generatedAttributeRound0";
                                        attrCtx_LVL4_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "addedAttributeIdentity";
                                            attrCtx_LVL5_IND0.Name = "_foreignKey";
                                            attrCtx_LVL5_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND0.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND0.ContextStrings.Add("Customer_Resolved_referenceOnly/hasAttributes/customerCustomerId");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL5_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND1.Type = "addedAttributeSelectedType";
                                            attrCtx_LVL5_IND1.Name = "_selectedEntityName";
                                            attrCtx_LVL5_IND1.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND1.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND1.ContextStrings.Add("Customer_Resolved_referenceOnly/hasAttributes/customerCustomerIdType");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND1);
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND0);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_structured.Type = "entity";
                    expectedContext_structured.Name = "Customer_Resolved_structured";
                    expectedContext_structured.Definition = "resolvedFrom/Customer";
                    expectedContext_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "customerIdAttribute";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "customerIdAttribute";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "customer";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Customer";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND0.Name = "contactOption";
                                        attrCtx_LVL4_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer";
                                        attrCtx_LVL4_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/contactOption";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "Contact";
                                            attrCtx_LVL5_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Contact";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "entityReferenceExtends";
                                                attrCtx_LVL6_IND0.Name = "extends";
                                                attrCtx_LVL6_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact";
                                                attrCtx_LVL6_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                                AttributeContextExpectedValue attrCtx_LVL7_IND0 = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL7_IND0.Type = "entity";
                                                    attrCtx_LVL7_IND0.Name = "CdmEntity";
                                                    attrCtx_LVL7_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/extends";
                                                    attrCtx_LVL7_IND0.Definition = "resolvedFrom/CdmEntity";
                                                }
                                                attrCtx_LVL6_IND0.Contexts.Add(attrCtx_LVL7_IND0);
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                                AttributeContextExpectedValue attrCtx_LVL7_IND0 = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL7_IND0.Type = "attributeGroup";
                                                    attrCtx_LVL7_IND0.Name = "attributesAddedAtThisScope";
                                                    attrCtx_LVL7_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope";
                                                    attrCtx_LVL7_IND0.Definition = "resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope";
                                                    attrCtx_LVL7_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                                    AttributeContextExpectedValue attrCtx_LVL8_IND0 = new AttributeContextExpectedValue();
                                                    {
                                                        attrCtx_LVL8_IND0.Type = "attributeDefinition";
                                                        attrCtx_LVL8_IND0.Name = "ContactID";
                                                        attrCtx_LVL8_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                        attrCtx_LVL8_IND0.Definition = "resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope/members/ContactID";
                                                        attrCtx_LVL8_IND0.ContextStrings = new List<string>();
                                                        {
                                                            attrCtx_LVL8_IND0.ContextStrings.Add("Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/ContactID");
                                                        }
                                                    }
                                                    attrCtx_LVL7_IND0.Contexts.Add(attrCtx_LVL8_IND0);
                                                    AttributeContextExpectedValue attrCtx_LVL8_IND1 = new AttributeContextExpectedValue();
                                                    {
                                                        attrCtx_LVL8_IND1.Type = "attributeDefinition";
                                                        attrCtx_LVL8_IND1.Name = "FullName";
                                                        attrCtx_LVL8_IND1.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                        attrCtx_LVL8_IND1.Definition = "resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope/members/FullName";
                                                        attrCtx_LVL8_IND1.ContextStrings = new List<string>();
                                                        {
                                                            attrCtx_LVL8_IND1.ContextStrings.Add("Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/FullName");
                                                        }
                                                    }
                                                    attrCtx_LVL7_IND0.Contexts.Add(attrCtx_LVL8_IND1);
                                                    AttributeContextExpectedValue attrCtx_LVL8_IND2 = new AttributeContextExpectedValue();
                                                    {
                                                        attrCtx_LVL8_IND2.Type = "attributeDefinition";
                                                        attrCtx_LVL8_IND2.Name = "Address";
                                                        attrCtx_LVL8_IND2.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                        attrCtx_LVL8_IND2.Definition = "resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope/members/Address";
                                                        attrCtx_LVL8_IND2.ContextStrings = new List<string>();
                                                        {
                                                            attrCtx_LVL8_IND2.ContextStrings.Add("Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/Address");
                                                        }
                                                    }
                                                    attrCtx_LVL7_IND0.Contexts.Add(attrCtx_LVL8_IND2);
                                                }
                                                attrCtx_LVL6_IND1.Contexts.Add(attrCtx_LVL7_IND0);
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND1);
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "accountOption";
                                        attrCtx_LVL4_IND1.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/accountOption";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "Account";
                                            attrCtx_LVL5_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Account";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "entityReferenceExtends";
                                                attrCtx_LVL6_IND0.Name = "extends";
                                                attrCtx_LVL6_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account";
                                                attrCtx_LVL6_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                                AttributeContextExpectedValue attrCtx_LVL7_IND0 = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL7_IND0.Type = "entity";
                                                    attrCtx_LVL7_IND0.Name = "CdmEntity";
                                                    attrCtx_LVL7_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/extends";
                                                    attrCtx_LVL7_IND0.Definition = "resolvedFrom/CdmEntity";
                                                }
                                                attrCtx_LVL6_IND0.Contexts.Add(attrCtx_LVL7_IND0);
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                                AttributeContextExpectedValue attrCtx_LVL7_IND0 = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL7_IND0.Type = "attributeGroup";
                                                    attrCtx_LVL7_IND0.Name = "attributesAddedAtThisScope";
                                                    attrCtx_LVL7_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope";
                                                    attrCtx_LVL7_IND0.Definition = "resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope";
                                                    attrCtx_LVL7_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                                    AttributeContextExpectedValue attrCtx_LVL8_IND0 = new AttributeContextExpectedValue();
                                                    {
                                                        attrCtx_LVL8_IND0.Type = "attributeDefinition";
                                                        attrCtx_LVL8_IND0.Name = "AccountID";
                                                        attrCtx_LVL8_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                        attrCtx_LVL8_IND0.Definition = "resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope/members/AccountID";
                                                        attrCtx_LVL8_IND0.ContextStrings = new List<string>();
                                                        {
                                                            attrCtx_LVL8_IND0.ContextStrings.Add("Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/AccountID");
                                                        }
                                                    }
                                                    attrCtx_LVL7_IND0.Contexts.Add(attrCtx_LVL8_IND0);
                                                    AttributeContextExpectedValue attrCtx_LVL8_IND1 = new AttributeContextExpectedValue();
                                                    {
                                                        attrCtx_LVL8_IND1.Type = "attributeDefinition";
                                                        attrCtx_LVL8_IND1.Name = "CompanyName";
                                                        attrCtx_LVL8_IND1.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                        attrCtx_LVL8_IND1.Definition = "resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope/members/CompanyName";
                                                        attrCtx_LVL8_IND1.ContextStrings = new List<string>();
                                                        {
                                                            attrCtx_LVL8_IND1.ContextStrings.Add("Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/CompanyName");
                                                        }
                                                    }
                                                    attrCtx_LVL7_IND0.Contexts.Add(attrCtx_LVL8_IND1);
                                                    AttributeContextExpectedValue attrCtx_LVL8_IND2 = new AttributeContextExpectedValue();
                                                    {
                                                        attrCtx_LVL8_IND2.Type = "attributeDefinition";
                                                        attrCtx_LVL8_IND2.Name = "Address";
                                                        attrCtx_LVL8_IND2.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                        attrCtx_LVL8_IND2.Definition = "resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope/members/Address";
                                                        attrCtx_LVL8_IND2.ContextStrings = new List<string>();
                                                        {
                                                            attrCtx_LVL8_IND2.ContextStrings.Add("Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/Address");
                                                        }
                                                    }
                                                    attrCtx_LVL7_IND0.Contexts.Add(attrCtx_LVL8_IND2);
                                                }
                                                attrCtx_LVL6_IND1.Contexts.Add(attrCtx_LVL7_IND0);
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND1);
                                        }
                                        attrCtx_LVL4_IND1.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND1);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_normalized_structured.Type = "entity";
                    expectedContext_normalized_structured.Name = "Customer_Resolved_normalized_structured";
                    expectedContext_normalized_structured.Definition = "resolvedFrom/Customer";
                    expectedContext_normalized_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "customerIdAttribute";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "customerIdAttribute";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "customer";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Customer";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND0.Name = "contactOption";
                                        attrCtx_LVL4_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer";
                                        attrCtx_LVL4_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/contactOption";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "Contact";
                                            attrCtx_LVL5_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Contact";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "entityReferenceExtends";
                                                attrCtx_LVL6_IND0.Name = "extends";
                                                attrCtx_LVL6_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact";
                                                attrCtx_LVL6_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                                AttributeContextExpectedValue attrCtx_LVL7_IND0 = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL7_IND0.Type = "entity";
                                                    attrCtx_LVL7_IND0.Name = "CdmEntity";
                                                    attrCtx_LVL7_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/extends";
                                                    attrCtx_LVL7_IND0.Definition = "resolvedFrom/CdmEntity";
                                                }
                                                attrCtx_LVL6_IND0.Contexts.Add(attrCtx_LVL7_IND0);
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                                AttributeContextExpectedValue attrCtx_LVL7_IND0 = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL7_IND0.Type = "attributeGroup";
                                                    attrCtx_LVL7_IND0.Name = "attributesAddedAtThisScope";
                                                    attrCtx_LVL7_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope";
                                                    attrCtx_LVL7_IND0.Definition = "resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope";
                                                    attrCtx_LVL7_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                                    AttributeContextExpectedValue attrCtx_LVL8_IND0 = new AttributeContextExpectedValue();
                                                    {
                                                        attrCtx_LVL8_IND0.Type = "attributeDefinition";
                                                        attrCtx_LVL8_IND0.Name = "ContactID";
                                                        attrCtx_LVL8_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                        attrCtx_LVL8_IND0.Definition = "resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope/members/ContactID";
                                                        attrCtx_LVL8_IND0.ContextStrings = new List<string>();
                                                        {
                                                            attrCtx_LVL8_IND0.ContextStrings.Add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/ContactID");
                                                        }
                                                    }
                                                    attrCtx_LVL7_IND0.Contexts.Add(attrCtx_LVL8_IND0);
                                                    AttributeContextExpectedValue attrCtx_LVL8_IND1 = new AttributeContextExpectedValue();
                                                    {
                                                        attrCtx_LVL8_IND1.Type = "attributeDefinition";
                                                        attrCtx_LVL8_IND1.Name = "FullName";
                                                        attrCtx_LVL8_IND1.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                        attrCtx_LVL8_IND1.Definition = "resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope/members/FullName";
                                                        attrCtx_LVL8_IND1.ContextStrings = new List<string>();
                                                        {
                                                            attrCtx_LVL8_IND1.ContextStrings.Add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/FullName");
                                                        }
                                                    }
                                                    attrCtx_LVL7_IND0.Contexts.Add(attrCtx_LVL8_IND1);
                                                    AttributeContextExpectedValue attrCtx_LVL8_IND2 = new AttributeContextExpectedValue();
                                                    {
                                                        attrCtx_LVL8_IND2.Type = "attributeDefinition";
                                                        attrCtx_LVL8_IND2.Name = "Address";
                                                        attrCtx_LVL8_IND2.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption/Contact/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                        attrCtx_LVL8_IND2.Definition = "resolvedFrom/Contact/hasAttributes/attributesAddedAtThisScope/members/Address";
                                                        attrCtx_LVL8_IND2.ContextStrings = new List<string>();
                                                        {
                                                            attrCtx_LVL8_IND2.ContextStrings.Add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/Address");
                                                        }
                                                    }
                                                    attrCtx_LVL7_IND0.Contexts.Add(attrCtx_LVL8_IND2);
                                                }
                                                attrCtx_LVL6_IND1.Contexts.Add(attrCtx_LVL7_IND0);
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND1);
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "accountOption";
                                        attrCtx_LVL4_IND1.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/accountOption";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "Account";
                                            attrCtx_LVL5_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Account";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "entityReferenceExtends";
                                                attrCtx_LVL6_IND0.Name = "extends";
                                                attrCtx_LVL6_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account";
                                                attrCtx_LVL6_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                                AttributeContextExpectedValue attrCtx_LVL7_IND0 = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL7_IND0.Type = "entity";
                                                    attrCtx_LVL7_IND0.Name = "CdmEntity";
                                                    attrCtx_LVL7_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/extends";
                                                    attrCtx_LVL7_IND0.Definition = "resolvedFrom/CdmEntity";
                                                }
                                                attrCtx_LVL6_IND0.Contexts.Add(attrCtx_LVL7_IND0);
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                                AttributeContextExpectedValue attrCtx_LVL7_IND0 = new AttributeContextExpectedValue();
                                                {
                                                    attrCtx_LVL7_IND0.Type = "attributeGroup";
                                                    attrCtx_LVL7_IND0.Name = "attributesAddedAtThisScope";
                                                    attrCtx_LVL7_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope";
                                                    attrCtx_LVL7_IND0.Definition = "resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope";
                                                    attrCtx_LVL7_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                                    AttributeContextExpectedValue attrCtx_LVL8_IND0 = new AttributeContextExpectedValue();
                                                    {
                                                        attrCtx_LVL8_IND0.Type = "attributeDefinition";
                                                        attrCtx_LVL8_IND0.Name = "AccountID";
                                                        attrCtx_LVL8_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                        attrCtx_LVL8_IND0.Definition = "resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope/members/AccountID";
                                                        attrCtx_LVL8_IND0.ContextStrings = new List<string>();
                                                        {
                                                            attrCtx_LVL8_IND0.ContextStrings.Add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/AccountID");
                                                        }
                                                    }
                                                    attrCtx_LVL7_IND0.Contexts.Add(attrCtx_LVL8_IND0);
                                                    AttributeContextExpectedValue attrCtx_LVL8_IND1 = new AttributeContextExpectedValue();
                                                    {
                                                        attrCtx_LVL8_IND1.Type = "attributeDefinition";
                                                        attrCtx_LVL8_IND1.Name = "CompanyName";
                                                        attrCtx_LVL8_IND1.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                        attrCtx_LVL8_IND1.Definition = "resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope/members/CompanyName";
                                                        attrCtx_LVL8_IND1.ContextStrings = new List<string>();
                                                        {
                                                            attrCtx_LVL8_IND1.ContextStrings.Add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/CompanyName");
                                                        }
                                                    }
                                                    attrCtx_LVL7_IND0.Contexts.Add(attrCtx_LVL8_IND1);
                                                    AttributeContextExpectedValue attrCtx_LVL8_IND2 = new AttributeContextExpectedValue();
                                                    {
                                                        attrCtx_LVL8_IND2.Type = "attributeDefinition";
                                                        attrCtx_LVL8_IND2.Name = "Address";
                                                        attrCtx_LVL8_IND2.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption/Account/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                        attrCtx_LVL8_IND2.Definition = "resolvedFrom/Account/hasAttributes/attributesAddedAtThisScope/members/Address";
                                                        attrCtx_LVL8_IND2.ContextStrings = new List<string>();
                                                        {
                                                            attrCtx_LVL8_IND2.ContextStrings.Add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/Address");
                                                        }
                                                    }
                                                    attrCtx_LVL7_IND0.Contexts.Add(attrCtx_LVL8_IND2);
                                                }
                                                attrCtx_LVL6_IND1.Contexts.Add(attrCtx_LVL7_IND0);
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND1);
                                        }
                                        attrCtx_LVL4_IND1.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND1);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly_normalized.Type = "entity";
                    expectedContext_referenceOnly_normalized.Name = "Customer_Resolved_referenceOnly_normalized";
                    expectedContext_referenceOnly_normalized.Definition = "resolvedFrom/Customer";
                    expectedContext_referenceOnly_normalized.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "customerIdAttribute";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "customerIdAttribute";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "customer";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Customer";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND0.Name = "contactOption";
                                        attrCtx_LVL4_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/Customer";
                                        attrCtx_LVL4_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/contactOption";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "Contact";
                                            attrCtx_LVL5_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Contact";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "accountOption";
                                        attrCtx_LVL4_IND1.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/Customer";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/accountOption";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "Account";
                                            attrCtx_LVL5_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Account";
                                        }
                                        attrCtx_LVL4_IND1.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND1);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "generatedSet";
                                    attrCtx_LVL3_IND1.Name = "_generatedAttributeSet";
                                    attrCtx_LVL3_IND1.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer";
                                    attrCtx_LVL3_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "generatedRound";
                                        attrCtx_LVL4_IND0.Name = "_generatedAttributeRound0";
                                        attrCtx_LVL4_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "addedAttributeIdentity";
                                            attrCtx_LVL5_IND0.Name = "_foreignKey";
                                            attrCtx_LVL5_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND0.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND0.ContextStrings.Add("Customer_Resolved_referenceOnly_normalized/hasAttributes/customerCustomerId");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL5_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND1.Type = "addedAttributeSelectedType";
                                            attrCtx_LVL5_IND1.Name = "_selectedEntityName";
                                            attrCtx_LVL5_IND1.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND1.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND1.ContextStrings.Add("Customer_Resolved_referenceOnly_normalized/hasAttributes/customerCustomerIdType");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND1);
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND0);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly_structured.Type = "entity";
                    expectedContext_referenceOnly_structured.Name = "Customer_Resolved_referenceOnly_structured";
                    expectedContext_referenceOnly_structured.Definition = "resolvedFrom/Customer";
                    expectedContext_referenceOnly_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "customerIdAttribute";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "customerIdAttribute";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "customer";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Customer";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND0.Name = "contactOption";
                                        attrCtx_LVL4_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/Customer";
                                        attrCtx_LVL4_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/contactOption";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "Contact";
                                            attrCtx_LVL5_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Contact";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "accountOption";
                                        attrCtx_LVL4_IND1.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/Customer";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/accountOption";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "Account";
                                            attrCtx_LVL5_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Account";
                                        }
                                        attrCtx_LVL4_IND1.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND1);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "generatedSet";
                                    attrCtx_LVL3_IND1.Name = "_generatedAttributeSet";
                                    attrCtx_LVL3_IND1.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer";
                                    attrCtx_LVL3_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "generatedRound";
                                        attrCtx_LVL4_IND0.Name = "_generatedAttributeRound0";
                                        attrCtx_LVL4_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "addedAttributeIdentity";
                                            attrCtx_LVL5_IND0.Name = "_foreignKey";
                                            attrCtx_LVL5_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND0.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND0.ContextStrings.Add("Customer_Resolved_referenceOnly_structured/hasAttributes/customer/members/customerId");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND0);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly_normalized_structured.Type = "entity";
                    expectedContext_referenceOnly_normalized_structured.Name = "Customer_Resolved_referenceOnly_normalized_structured";
                    expectedContext_referenceOnly_normalized_structured.Definition = "resolvedFrom/Customer";
                    expectedContext_referenceOnly_normalized_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "customerIdAttribute";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "customerIdAttribute";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "customer";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Customer";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND0.Name = "contactOption";
                                        attrCtx_LVL4_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer";
                                        attrCtx_LVL4_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/contactOption";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "Contact";
                                            attrCtx_LVL5_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/contactOption";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Contact";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "accountOption";
                                        attrCtx_LVL4_IND1.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customerIdAttribute/members/customer/entity/Customer/hasAttributes/accountOption";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "Account";
                                            attrCtx_LVL5_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/Customer/accountOption";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Account";
                                        }
                                        attrCtx_LVL4_IND1.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND1);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "generatedSet";
                                    attrCtx_LVL3_IND1.Name = "_generatedAttributeSet";
                                    attrCtx_LVL3_IND1.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer";
                                    attrCtx_LVL3_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "generatedRound";
                                        attrCtx_LVL4_IND0.Name = "_generatedAttributeRound0";
                                        attrCtx_LVL4_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "addedAttributeIdentity";
                                            attrCtx_LVL5_IND0.Name = "_foreignKey";
                                            attrCtx_LVL5_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND0.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND0.ContextStrings.Add("Customer_Resolved_referenceOnly_normalized_structured/hasAttributes/customer/members/customerId");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND0);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }

                // Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
                List<AttributeExpectedValue> expected_default = null;
                List<AttributeExpectedValue> expected_normalized = null;
                List<AttributeExpectedValue> expected_referenceOnly = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey",
                        DataFormat = "Guid",
                        DisplayName = "Customer",
                        Name = "customerCustomerId",
                        SourceName = "customerid",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0/_selectedEntityName",
                        DataFormat = "String",
                        DisplayName = "Customer Type",
                        Name = "customerCustomerIdType",
                        SourceName = "customeridtype",
                    });
                }
                List<AttributeExpectedValue> expected_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "customer";
                        AttribGroupRef.AttributeContext = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customerIdAttribute/customerIdAttribute/customer";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            DataFormat = "Unknown",
                        });
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            DataFormat = "Unknown",
                        });
                        expected_structured.Add(AttribGroupRef);
                    };
                }
                List<AttributeExpectedValue> expected_normalized_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "customer";
                        AttribGroupRef.AttributeContext = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customerIdAttribute/customerIdAttribute/customer";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            DataFormat = "Unknown",
                        });
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            DataFormat = "Unknown",
                        });
                        expected_normalized_structured.Add(AttribGroupRef);
                    };
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey",
                        DataFormat = "Guid",
                        DisplayName = "Customer",
                        Name = "customerCustomerId",
                        SourceName = "customerid",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0/_selectedEntityName",
                        DataFormat = "String",
                        DisplayName = "Customer Type",
                        Name = "customerCustomerIdType",
                        SourceName = "customeridtype",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "customer";
                        AttribGroupRef.AttributeContext = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey",
                            DataFormat = "Guid",
                            DisplayName = "Customer",
                            Name = "customerId",
                            SourceName = "customerid",
                        });
                        expected_referenceOnly_structured.Add(AttribGroupRef);
                    };
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "customer";
                        AttribGroupRef.AttributeContext = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customerIdAttribute/customerIdAttribute/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey",
                            DataFormat = "Guid",
                            DisplayName = "Customer",
                            Name = "customerId",
                            SourceName = "customerid",
                        });
                        expected_referenceOnly_normalized_structured.Add(AttribGroupRef);
                    };
                }

                await RunTestWithValues(
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
                );
            }
        }

        /// <summary>
        /// Resolution Guidance Test - Polymorphism With Rename As Member
        /// </summary>
        [TestMethod]
        public async Task TestPolymorphismWithRenameAsMember()
        {
            string testName = "TestPolymorphismWithRenameAsMember";
            {
                string entityName = "Customer";

                // Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
                AttributeContextExpectedValue expectedContext_default = null;
                AttributeContextExpectedValue expectedContext_normalized = null;
                AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly.Type = "entity";
                    expectedContext_referenceOnly.Name = "Customer_Resolved_referenceOnly";
                    expectedContext_referenceOnly.Definition = "resolvedFrom/Customer";
                    expectedContext_referenceOnly.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "customer";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customer";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "Customer";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "contactOption";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Contact";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer/contactOption";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Contact";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "accountOption";
                                attrCtx_LVL2_IND1.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption";
                                attrCtx_LVL2_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Account";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/Customer/accountOption";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Account";
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                        AttributeContextExpectedValue attrCtx_LVL1_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND1.Type = "generatedSet";
                            attrCtx_LVL1_IND1.Name = "_generatedAttributeSet";
                            attrCtx_LVL1_IND1.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer";
                            attrCtx_LVL1_IND1.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "generatedRound";
                                attrCtx_LVL2_IND0.Name = "_generatedAttributeRound0";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "addedAttributeIdentity";
                                    attrCtx_LVL3_IND0.Name = "_foreignKey";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0";
                                    attrCtx_LVL3_IND0.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND0.ContextStrings.Add("Customer_Resolved_referenceOnly/hasAttributes/customerId");
                                    }
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "addedAttributeSelectedType";
                                    attrCtx_LVL3_IND1.Name = "_selectedEntityName";
                                    attrCtx_LVL3_IND1.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0";
                                    attrCtx_LVL3_IND1.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND1.ContextStrings.Add("Customer_Resolved_referenceOnly/hasAttributes/customerIdType");
                                    }
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND1.Contexts.Add(attrCtx_LVL2_IND0);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND1);
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_structured.Type = "entity";
                    expectedContext_structured.Name = "Customer_Resolved_structured";
                    expectedContext_structured.Definition = "resolvedFrom/Customer";
                    expectedContext_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "customer";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customer";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "Customer";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "contactOption";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Contact";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Contact";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "ContactID";
                                        attrCtx_LVL4_IND1.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Contact/hasAttributes/ContactID";
                                        attrCtx_LVL4_IND1.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND1.ContextStrings.Add("Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/ContactID");
                                        }
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND1);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND2 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND2.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND2.Name = "FullName";
                                        attrCtx_LVL4_IND2.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact";
                                        attrCtx_LVL4_IND2.Definition = "resolvedFrom/Contact/hasAttributes/FullName";
                                        attrCtx_LVL4_IND2.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND2.ContextStrings.Add("Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/FullName");
                                        }
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND2);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND3 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND3.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND3.Name = "Address";
                                        attrCtx_LVL4_IND3.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/contactOption/Contact";
                                        attrCtx_LVL4_IND3.Definition = "resolvedFrom/Contact/hasAttributes/Address";
                                        attrCtx_LVL4_IND3.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND3.ContextStrings.Add("Customer_Resolved_structured/hasAttributes/customer/members/contactOption/members/Address");
                                        }
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND3);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "accountOption";
                                attrCtx_LVL2_IND1.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption";
                                attrCtx_LVL2_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Account";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Account";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "AccountID";
                                        attrCtx_LVL4_IND1.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Account/hasAttributes/AccountID";
                                        attrCtx_LVL4_IND1.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND1.ContextStrings.Add("Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/AccountID");
                                        }
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND1);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND2 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND2.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND2.Name = "CompanyName";
                                        attrCtx_LVL4_IND2.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account";
                                        attrCtx_LVL4_IND2.Definition = "resolvedFrom/Account/hasAttributes/CompanyName";
                                        attrCtx_LVL4_IND2.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND2.ContextStrings.Add("Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/CompanyName");
                                        }
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND2);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND3 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND3.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND3.Name = "Address";
                                        attrCtx_LVL4_IND3.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer/Customer/accountOption/Account";
                                        attrCtx_LVL4_IND3.Definition = "resolvedFrom/Account/hasAttributes/Address";
                                        attrCtx_LVL4_IND3.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND3.ContextStrings.Add("Customer_Resolved_structured/hasAttributes/customer/members/accountOption/members/Address");
                                        }
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND3);
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_normalized_structured.Type = "entity";
                    expectedContext_normalized_structured.Name = "Customer_Resolved_normalized_structured";
                    expectedContext_normalized_structured.Definition = "resolvedFrom/Customer";
                    expectedContext_normalized_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "customer";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customer";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "Customer";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "contactOption";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Contact";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Contact";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "ContactID";
                                        attrCtx_LVL4_IND1.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Contact/hasAttributes/ContactID";
                                        attrCtx_LVL4_IND1.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND1.ContextStrings.Add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/ContactID");
                                        }
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND1);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND2 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND2.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND2.Name = "FullName";
                                        attrCtx_LVL4_IND2.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact";
                                        attrCtx_LVL4_IND2.Definition = "resolvedFrom/Contact/hasAttributes/FullName";
                                        attrCtx_LVL4_IND2.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND2.ContextStrings.Add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/FullName");
                                        }
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND2);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND3 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND3.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND3.Name = "Address";
                                        attrCtx_LVL4_IND3.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/contactOption/Contact";
                                        attrCtx_LVL4_IND3.Definition = "resolvedFrom/Contact/hasAttributes/Address";
                                        attrCtx_LVL4_IND3.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND3.ContextStrings.Add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/contactOption/members/Address");
                                        }
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND3);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "accountOption";
                                attrCtx_LVL2_IND1.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption";
                                attrCtx_LVL2_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Account";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Account";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "AccountID";
                                        attrCtx_LVL4_IND1.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Account/hasAttributes/AccountID";
                                        attrCtx_LVL4_IND1.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND1.ContextStrings.Add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/AccountID");
                                        }
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND1);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND2 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND2.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND2.Name = "CompanyName";
                                        attrCtx_LVL4_IND2.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account";
                                        attrCtx_LVL4_IND2.Definition = "resolvedFrom/Account/hasAttributes/CompanyName";
                                        attrCtx_LVL4_IND2.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND2.ContextStrings.Add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/CompanyName");
                                        }
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND2);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND3 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND3.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND3.Name = "Address";
                                        attrCtx_LVL4_IND3.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer/Customer/accountOption/Account";
                                        attrCtx_LVL4_IND3.Definition = "resolvedFrom/Account/hasAttributes/Address";
                                        attrCtx_LVL4_IND3.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND3.ContextStrings.Add("Customer_Resolved_normalized_structured/hasAttributes/customer/members/accountOption/members/Address");
                                        }
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND3);
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly_normalized.Type = "entity";
                    expectedContext_referenceOnly_normalized.Name = "Customer_Resolved_referenceOnly_normalized";
                    expectedContext_referenceOnly_normalized.Definition = "resolvedFrom/Customer";
                    expectedContext_referenceOnly_normalized.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "customer";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customer";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "Customer";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "contactOption";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Contact";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer/contactOption";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Contact";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "accountOption";
                                attrCtx_LVL2_IND1.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption";
                                attrCtx_LVL2_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Account";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/Customer/accountOption";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Account";
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                        AttributeContextExpectedValue attrCtx_LVL1_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND1.Type = "generatedSet";
                            attrCtx_LVL1_IND1.Name = "_generatedAttributeSet";
                            attrCtx_LVL1_IND1.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer";
                            attrCtx_LVL1_IND1.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "generatedRound";
                                attrCtx_LVL2_IND0.Name = "_generatedAttributeRound0";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "addedAttributeIdentity";
                                    attrCtx_LVL3_IND0.Name = "_foreignKey";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0";
                                    attrCtx_LVL3_IND0.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND0.ContextStrings.Add("Customer_Resolved_referenceOnly_normalized/hasAttributes/customerId");
                                    }
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "addedAttributeSelectedType";
                                    attrCtx_LVL3_IND1.Name = "_selectedEntityName";
                                    attrCtx_LVL3_IND1.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0";
                                    attrCtx_LVL3_IND1.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND1.ContextStrings.Add("Customer_Resolved_referenceOnly_normalized/hasAttributes/customerIdType");
                                    }
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND1.Contexts.Add(attrCtx_LVL2_IND0);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND1);
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly_structured.Type = "entity";
                    expectedContext_referenceOnly_structured.Name = "Customer_Resolved_referenceOnly_structured";
                    expectedContext_referenceOnly_structured.Definition = "resolvedFrom/Customer";
                    expectedContext_referenceOnly_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "customer";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customer";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "Customer";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "contactOption";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Contact";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer/contactOption";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Contact";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "accountOption";
                                attrCtx_LVL2_IND1.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption";
                                attrCtx_LVL2_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Account";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/Customer/accountOption";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Account";
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                        AttributeContextExpectedValue attrCtx_LVL1_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND1.Type = "generatedSet";
                            attrCtx_LVL1_IND1.Name = "_generatedAttributeSet";
                            attrCtx_LVL1_IND1.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer";
                            attrCtx_LVL1_IND1.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "generatedRound";
                                attrCtx_LVL2_IND0.Name = "_generatedAttributeRound0";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/_generatedAttributeSet";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "addedAttributeIdentity";
                                    attrCtx_LVL3_IND0.Name = "_foreignKey";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/_generatedAttributeSet/_generatedAttributeRound0";
                                    attrCtx_LVL3_IND0.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND0.ContextStrings.Add("Customer_Resolved_referenceOnly_structured/hasAttributes/customer/members/customerId");
                                    }
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND1.Contexts.Add(attrCtx_LVL2_IND0);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND1);
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly_normalized_structured.Type = "entity";
                    expectedContext_referenceOnly_normalized_structured.Name = "Customer_Resolved_referenceOnly_normalized_structured";
                    expectedContext_referenceOnly_normalized_structured.Definition = "resolvedFrom/Customer";
                    expectedContext_referenceOnly_normalized_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "customer";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customer";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "Customer";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "contactOption";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/contactOption";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Contact";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer/contactOption";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Contact";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "accountOption";
                                attrCtx_LVL2_IND1.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Customer/hasAttributes/customer/entity/Customer/hasAttributes/accountOption";
                                attrCtx_LVL2_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Account";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/Customer/accountOption";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Account";
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                        AttributeContextExpectedValue attrCtx_LVL1_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND1.Type = "generatedSet";
                            attrCtx_LVL1_IND1.Name = "_generatedAttributeSet";
                            attrCtx_LVL1_IND1.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer";
                            attrCtx_LVL1_IND1.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "generatedRound";
                                attrCtx_LVL2_IND0.Name = "_generatedAttributeRound0";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/_generatedAttributeSet";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "addedAttributeIdentity";
                                    attrCtx_LVL3_IND0.Name = "_foreignKey";
                                    attrCtx_LVL3_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/_generatedAttributeSet/_generatedAttributeRound0";
                                    attrCtx_LVL3_IND0.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND0.ContextStrings.Add("Customer_Resolved_referenceOnly_normalized_structured/hasAttributes/customer/members/customerId");
                                    }
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND1.Contexts.Add(attrCtx_LVL2_IND0);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND1);
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }

                // Refer to bug https://powerbi.visualstudio.com/Power%20Query/_workitems/edit/327155
                List<AttributeExpectedValue> expected_default = null;
                List<AttributeExpectedValue> expected_normalized = null;
                List<AttributeExpectedValue> expected_referenceOnly = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey",
                        DataFormat = "Guid",
                        DisplayName = "Customer",
                        Name = "customerId",
                        SourceName = "customerid",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/customer/_generatedAttributeSet/_generatedAttributeRound0/_selectedEntityName",
                        DataFormat = "String",
                        DisplayName = "Customer Type",
                        Name = "customerIdType",
                        SourceName = "customeridtype",
                    });
                }
                List<AttributeExpectedValue> expected_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "customer";
                        AttribGroupRef.AttributeContext = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/customer";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            DataFormat = "Unknown",
                        });
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            DataFormat = "Unknown",
                        });
                        expected_structured.Add(AttribGroupRef);
                    };
                }
                List<AttributeExpectedValue> expected_normalized_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "customer";
                        AttribGroupRef.AttributeContext = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/customer";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            DataFormat = "Unknown",
                        });
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            DataFormat = "Unknown",
                        });
                        expected_normalized_structured.Add(AttribGroupRef);
                    };
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey",
                        DataFormat = "Guid",
                        DisplayName = "Customer",
                        Name = "customerId",
                        SourceName = "customerid",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/customer/_generatedAttributeSet/_generatedAttributeRound0/_selectedEntityName",
                        DataFormat = "String",
                        DisplayName = "Customer Type",
                        Name = "customerIdType",
                        SourceName = "customeridtype",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "customer";
                        AttribGroupRef.AttributeContext = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey",
                            DataFormat = "Guid",
                            DisplayName = "Customer",
                            Name = "customerId",
                            SourceName = "customerid",
                        });
                        expected_referenceOnly_structured.Add(AttribGroupRef);
                    };
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "customer";
                        AttribGroupRef.AttributeContext = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/customer/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey",
                            DataFormat = "Guid",
                            DisplayName = "Customer",
                            Name = "customerId",
                            SourceName = "customerid",
                        });
                        expected_referenceOnly_normalized_structured.Add(AttribGroupRef);
                    };
                }

                await RunTestWithValues(
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
                );
            }
        }
    }
}
