// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Tests.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    [TestClass]
    public class ResolutionGuidanceAddInSupportOfTest : CommonTest
    {

        /// <summary>
        /// Resolution Guidance Test - AddInSupportOf
        /// </summary>
        [TestMethod]
        public async Task TestAddInSupportOf()
        {
            string testName = "TestAddInSupportOf";
            {
                string entityName = "Product";

                AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
                {
                    expectedContext_default.Type = "entity";
                    expectedContext_default.Name = "Product_Resolved_default";
                    expectedContext_default.Definition = "resolvedFrom/Product";
                    expectedContext_default.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Product_Resolved_default/attributeContext/Product_Resolved_default";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Product_Resolved_default/attributeContext/Product_Resolved_default/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_default.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Product_Resolved_default/attributeContext/Product_Resolved_default";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Product_Resolved_default/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "StatusCode";
                                attrCtx_LVL2_IND1.Parent = "Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Product_Resolved_default/hasAttributes/StatusCode");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "StatusCode_display";
                                attrCtx_LVL2_IND2.Parent = "Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display";
                                attrCtx_LVL2_IND2.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND2.ContextStrings.Add("Product_Resolved_default/hasAttributes/StatusCode_display");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND2);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_default.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
                {
                    expectedContext_normalized.Type = "entity";
                    expectedContext_normalized.Name = "Product_Resolved_normalized";
                    expectedContext_normalized.Definition = "resolvedFrom/Product";
                    expectedContext_normalized.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Product_Resolved_normalized/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "StatusCode";
                                attrCtx_LVL2_IND1.Parent = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Product_Resolved_normalized/hasAttributes/StatusCode");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "StatusCode_display";
                                attrCtx_LVL2_IND2.Parent = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display";
                                attrCtx_LVL2_IND2.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND2.ContextStrings.Add("Product_Resolved_normalized/hasAttributes/StatusCode_display");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND2);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly.Type = "entity";
                    expectedContext_referenceOnly.Name = "Product_Resolved_referenceOnly";
                    expectedContext_referenceOnly.Definition = "resolvedFrom/Product";
                    expectedContext_referenceOnly.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Product_Resolved_referenceOnly/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "StatusCode";
                                attrCtx_LVL2_IND1.Parent = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Product_Resolved_referenceOnly/hasAttributes/StatusCode");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "StatusCode_display";
                                attrCtx_LVL2_IND2.Parent = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display";
                                attrCtx_LVL2_IND2.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND2.ContextStrings.Add("Product_Resolved_referenceOnly/hasAttributes/StatusCode_display");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND2);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_structured.Type = "entity";
                    expectedContext_structured.Name = "Product_Resolved_structured";
                    expectedContext_structured.Definition = "resolvedFrom/Product";
                    expectedContext_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Product_Resolved_structured/attributeContext/Product_Resolved_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Product_Resolved_structured/attributeContext/Product_Resolved_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Product_Resolved_structured/attributeContext/Product_Resolved_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Product_Resolved_structured/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "StatusCode";
                                attrCtx_LVL2_IND1.Parent = "Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Product_Resolved_structured/hasAttributes/StatusCode");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "StatusCode_display";
                                attrCtx_LVL2_IND2.Parent = "Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display";
                                attrCtx_LVL2_IND2.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND2.ContextStrings.Add("Product_Resolved_structured/hasAttributes/StatusCode_display");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND2);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_normalized_structured.Type = "entity";
                    expectedContext_normalized_structured.Name = "Product_Resolved_normalized_structured";
                    expectedContext_normalized_structured.Definition = "resolvedFrom/Product";
                    expectedContext_normalized_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Product_Resolved_normalized_structured/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "StatusCode";
                                attrCtx_LVL2_IND1.Parent = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Product_Resolved_normalized_structured/hasAttributes/StatusCode");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "StatusCode_display";
                                attrCtx_LVL2_IND2.Parent = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display";
                                attrCtx_LVL2_IND2.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND2.ContextStrings.Add("Product_Resolved_normalized_structured/hasAttributes/StatusCode_display");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND2);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly_normalized.Type = "entity";
                    expectedContext_referenceOnly_normalized.Name = "Product_Resolved_referenceOnly_normalized";
                    expectedContext_referenceOnly_normalized.Definition = "resolvedFrom/Product";
                    expectedContext_referenceOnly_normalized.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Product_Resolved_referenceOnly_normalized/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "StatusCode";
                                attrCtx_LVL2_IND1.Parent = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Product_Resolved_referenceOnly_normalized/hasAttributes/StatusCode");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "StatusCode_display";
                                attrCtx_LVL2_IND2.Parent = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display";
                                attrCtx_LVL2_IND2.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND2.ContextStrings.Add("Product_Resolved_referenceOnly_normalized/hasAttributes/StatusCode_display");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND2);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly_structured.Type = "entity";
                    expectedContext_referenceOnly_structured.Name = "Product_Resolved_referenceOnly_structured";
                    expectedContext_referenceOnly_structured.Definition = "resolvedFrom/Product";
                    expectedContext_referenceOnly_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Product_Resolved_referenceOnly_structured/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "StatusCode";
                                attrCtx_LVL2_IND1.Parent = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Product_Resolved_referenceOnly_structured/hasAttributes/StatusCode");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "StatusCode_display";
                                attrCtx_LVL2_IND2.Parent = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display";
                                attrCtx_LVL2_IND2.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND2.ContextStrings.Add("Product_Resolved_referenceOnly_structured/hasAttributes/StatusCode_display");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND2);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly_normalized_structured.Type = "entity";
                    expectedContext_referenceOnly_normalized_structured.Name = "Product_Resolved_referenceOnly_normalized_structured";
                    expectedContext_referenceOnly_normalized_structured.Definition = "resolvedFrom/Product";
                    expectedContext_referenceOnly_normalized_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Product_Resolved_referenceOnly_normalized_structured/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "StatusCode";
                                attrCtx_LVL2_IND1.Parent = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Product_Resolved_referenceOnly_normalized_structured/hasAttributes/StatusCode");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "StatusCode_display";
                                attrCtx_LVL2_IND2.Parent = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/StatusCode_display";
                                attrCtx_LVL2_IND2.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND2.ContextStrings.Add("Product_Resolved_referenceOnly_normalized_structured/hasAttributes/StatusCode_display");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND2);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }

                List<AttributeExpectedValue> expected_default = new List<AttributeExpectedValue>();
                {
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode",
                        DataFormat = "Int32",
                        Name = "StatusCode",
                        SourceName = "StatusCode",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display",
                        DataFormat = "String",
                        Name = "StatusCode_display",
                    });
                }
                List<AttributeExpectedValue> expected_normalized = new List<AttributeExpectedValue>();
                {
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode",
                        DataFormat = "Int32",
                        Name = "StatusCode",
                        SourceName = "StatusCode",
                    });
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display",
                        DataFormat = "String",
                        Name = "StatusCode_display",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode",
                        DataFormat = "Int32",
                        Name = "StatusCode",
                        SourceName = "StatusCode",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display",
                        DataFormat = "String",
                        Name = "StatusCode_display",
                    });
                }
                List<AttributeExpectedValue> expected_structured = new List<AttributeExpectedValue>();
                {
                    expected_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode",
                        DataFormat = "Int32",
                        Name = "StatusCode",
                        SourceName = "StatusCode",
                    });
                    expected_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display",
                        DataFormat = "String",
                        Name = "StatusCode_display",
                    });
                }
                List<AttributeExpectedValue> expected_normalized_structured = new List<AttributeExpectedValue>();
                {
                    expected_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode",
                        DataFormat = "Int32",
                        Name = "StatusCode",
                        SourceName = "StatusCode",
                    });
                    expected_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display",
                        DataFormat = "String",
                        Name = "StatusCode_display",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode",
                        DataFormat = "Int32",
                        Name = "StatusCode",
                        SourceName = "StatusCode",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display",
                        DataFormat = "String",
                        Name = "StatusCode_display",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_structured = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode",
                        DataFormat = "Int32",
                        Name = "StatusCode",
                        SourceName = "StatusCode",
                    });
                    expected_referenceOnly_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display",
                        DataFormat = "String",
                        Name = "StatusCode_display",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode",
                        DataFormat = "Int32",
                        Name = "StatusCode",
                        SourceName = "StatusCode",
                    });
                    expected_referenceOnly_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/StatusCode_display",
                        DataFormat = "String",
                        Name = "StatusCode_display",
                    });
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
        /// Resolution Guidance Test - AddInSupportOf wITH IsCorrelatedWith
        /// </summary>
        [TestMethod]
        public async Task TestAddInSupportOfWithIsCorrelatedWith()
        {
            string testName = "TestAddInSupportOfWithIsCorrelatedWith";
            {
                string entityName = "Product";

                AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
                {
                    expectedContext_default.Type = "entity";
                    expectedContext_default.Name = "Product_Resolved_default";
                    expectedContext_default.Definition = "resolvedFrom/Product";
                    expectedContext_default.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Product_Resolved_default/attributeContext/Product_Resolved_default";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Product_Resolved_default/attributeContext/Product_Resolved_default/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_default.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "ID";
                        attrCtx_LVL0_IND1.Parent = "Product_Resolved_default/attributeContext/Product_Resolved_default";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Product/hasAttributes/ID";
                        attrCtx_LVL0_IND1.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND1.ContextStrings.Add("Product_Resolved_default/hasAttributes/ID");
                        }
                    }
                    expectedContext_default.Contexts.Add(attrCtx_LVL0_IND1);
                    AttributeContextExpectedValue attrCtx_LVL0_IND2 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND2.Type = "attributeDefinition";
                        attrCtx_LVL0_IND2.Name = "StateCode";
                        attrCtx_LVL0_IND2.Parent = "Product_Resolved_default/attributeContext/Product_Resolved_default";
                        attrCtx_LVL0_IND2.Definition = "resolvedFrom/Product/hasAttributes/StateCode";
                        attrCtx_LVL0_IND2.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND2.ContextStrings.Add("Product_Resolved_default/hasAttributes/StateCode");
                        }
                    }
                    expectedContext_default.Contexts.Add(attrCtx_LVL0_IND2);
                    AttributeContextExpectedValue attrCtx_LVL0_IND3 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND3.Type = "attributeDefinition";
                        attrCtx_LVL0_IND3.Name = "StateCode_display";
                        attrCtx_LVL0_IND3.Parent = "Product_Resolved_default/attributeContext/Product_Resolved_default";
                        attrCtx_LVL0_IND3.Definition = "resolvedFrom/Product/hasAttributes/StateCode_display";
                        attrCtx_LVL0_IND3.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND3.ContextStrings.Add("Product_Resolved_default/hasAttributes/StateCode_display");
                        }
                    }
                    expectedContext_default.Contexts.Add(attrCtx_LVL0_IND3);
                    AttributeContextExpectedValue attrCtx_LVL0_IND4 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND4.Type = "attributeDefinition";
                        attrCtx_LVL0_IND4.Name = "StatusCode";
                        attrCtx_LVL0_IND4.Parent = "Product_Resolved_default/attributeContext/Product_Resolved_default";
                        attrCtx_LVL0_IND4.Definition = "resolvedFrom/Product/hasAttributes/StatusCode";
                        attrCtx_LVL0_IND4.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND4.ContextStrings.Add("Product_Resolved_default/hasAttributes/StatusCode");
                        }
                    }
                    expectedContext_default.Contexts.Add(attrCtx_LVL0_IND4);
                    AttributeContextExpectedValue attrCtx_LVL0_IND5 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND5.Type = "attributeDefinition";
                        attrCtx_LVL0_IND5.Name = "StatusCode_display";
                        attrCtx_LVL0_IND5.Parent = "Product_Resolved_default/attributeContext/Product_Resolved_default";
                        attrCtx_LVL0_IND5.Definition = "resolvedFrom/Product/hasAttributes/StatusCode_display";
                        attrCtx_LVL0_IND5.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND5.ContextStrings.Add("Product_Resolved_default/hasAttributes/StatusCode_display");
                        }
                    }
                    expectedContext_default.Contexts.Add(attrCtx_LVL0_IND5);
                }
                AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
                {
                    expectedContext_normalized.Type = "entity";
                    expectedContext_normalized.Name = "Product_Resolved_normalized";
                    expectedContext_normalized.Definition = "resolvedFrom/Product";
                    expectedContext_normalized.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "ID";
                        attrCtx_LVL0_IND1.Parent = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Product/hasAttributes/ID";
                        attrCtx_LVL0_IND1.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND1.ContextStrings.Add("Product_Resolved_normalized/hasAttributes/ID");
                        }
                    }
                    expectedContext_normalized.Contexts.Add(attrCtx_LVL0_IND1);
                    AttributeContextExpectedValue attrCtx_LVL0_IND2 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND2.Type = "attributeDefinition";
                        attrCtx_LVL0_IND2.Name = "StateCode";
                        attrCtx_LVL0_IND2.Parent = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized";
                        attrCtx_LVL0_IND2.Definition = "resolvedFrom/Product/hasAttributes/StateCode";
                        attrCtx_LVL0_IND2.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND2.ContextStrings.Add("Product_Resolved_normalized/hasAttributes/StateCode");
                        }
                    }
                    expectedContext_normalized.Contexts.Add(attrCtx_LVL0_IND2);
                    AttributeContextExpectedValue attrCtx_LVL0_IND3 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND3.Type = "attributeDefinition";
                        attrCtx_LVL0_IND3.Name = "StateCode_display";
                        attrCtx_LVL0_IND3.Parent = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized";
                        attrCtx_LVL0_IND3.Definition = "resolvedFrom/Product/hasAttributes/StateCode_display";
                        attrCtx_LVL0_IND3.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND3.ContextStrings.Add("Product_Resolved_normalized/hasAttributes/StateCode_display");
                        }
                    }
                    expectedContext_normalized.Contexts.Add(attrCtx_LVL0_IND3);
                    AttributeContextExpectedValue attrCtx_LVL0_IND4 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND4.Type = "attributeDefinition";
                        attrCtx_LVL0_IND4.Name = "StatusCode";
                        attrCtx_LVL0_IND4.Parent = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized";
                        attrCtx_LVL0_IND4.Definition = "resolvedFrom/Product/hasAttributes/StatusCode";
                        attrCtx_LVL0_IND4.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND4.ContextStrings.Add("Product_Resolved_normalized/hasAttributes/StatusCode");
                        }
                    }
                    expectedContext_normalized.Contexts.Add(attrCtx_LVL0_IND4);
                    AttributeContextExpectedValue attrCtx_LVL0_IND5 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND5.Type = "attributeDefinition";
                        attrCtx_LVL0_IND5.Name = "StatusCode_display";
                        attrCtx_LVL0_IND5.Parent = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized";
                        attrCtx_LVL0_IND5.Definition = "resolvedFrom/Product/hasAttributes/StatusCode_display";
                        attrCtx_LVL0_IND5.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND5.ContextStrings.Add("Product_Resolved_normalized/hasAttributes/StatusCode_display");
                        }
                    }
                    expectedContext_normalized.Contexts.Add(attrCtx_LVL0_IND5);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly.Type = "entity";
                    expectedContext_referenceOnly.Name = "Product_Resolved_referenceOnly";
                    expectedContext_referenceOnly.Definition = "resolvedFrom/Product";
                    expectedContext_referenceOnly.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "ID";
                        attrCtx_LVL0_IND1.Parent = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Product/hasAttributes/ID";
                        attrCtx_LVL0_IND1.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND1.ContextStrings.Add("Product_Resolved_referenceOnly/hasAttributes/ID");
                        }
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND1);
                    AttributeContextExpectedValue attrCtx_LVL0_IND2 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND2.Type = "attributeDefinition";
                        attrCtx_LVL0_IND2.Name = "StateCode";
                        attrCtx_LVL0_IND2.Parent = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly";
                        attrCtx_LVL0_IND2.Definition = "resolvedFrom/Product/hasAttributes/StateCode";
                        attrCtx_LVL0_IND2.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND2.ContextStrings.Add("Product_Resolved_referenceOnly/hasAttributes/StateCode");
                        }
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND2);
                    AttributeContextExpectedValue attrCtx_LVL0_IND3 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND3.Type = "attributeDefinition";
                        attrCtx_LVL0_IND3.Name = "StateCode_display";
                        attrCtx_LVL0_IND3.Parent = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly";
                        attrCtx_LVL0_IND3.Definition = "resolvedFrom/Product/hasAttributes/StateCode_display";
                        attrCtx_LVL0_IND3.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND3.ContextStrings.Add("Product_Resolved_referenceOnly/hasAttributes/StateCode_display");
                        }
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND3);
                    AttributeContextExpectedValue attrCtx_LVL0_IND4 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND4.Type = "attributeDefinition";
                        attrCtx_LVL0_IND4.Name = "StatusCode";
                        attrCtx_LVL0_IND4.Parent = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly";
                        attrCtx_LVL0_IND4.Definition = "resolvedFrom/Product/hasAttributes/StatusCode";
                        attrCtx_LVL0_IND4.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND4.ContextStrings.Add("Product_Resolved_referenceOnly/hasAttributes/StatusCode");
                        }
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND4);
                    AttributeContextExpectedValue attrCtx_LVL0_IND5 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND5.Type = "attributeDefinition";
                        attrCtx_LVL0_IND5.Name = "StatusCode_display";
                        attrCtx_LVL0_IND5.Parent = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly";
                        attrCtx_LVL0_IND5.Definition = "resolvedFrom/Product/hasAttributes/StatusCode_display";
                        attrCtx_LVL0_IND5.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND5.ContextStrings.Add("Product_Resolved_referenceOnly/hasAttributes/StatusCode_display");
                        }
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND5);
                }
                AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_structured.Type = "entity";
                    expectedContext_structured.Name = "Product_Resolved_structured";
                    expectedContext_structured.Definition = "resolvedFrom/Product";
                    expectedContext_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Product_Resolved_structured/attributeContext/Product_Resolved_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Product_Resolved_structured/attributeContext/Product_Resolved_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "ID";
                        attrCtx_LVL0_IND1.Parent = "Product_Resolved_structured/attributeContext/Product_Resolved_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Product/hasAttributes/ID";
                        attrCtx_LVL0_IND1.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND1.ContextStrings.Add("Product_Resolved_structured/hasAttributes/ID");
                        }
                    }
                    expectedContext_structured.Contexts.Add(attrCtx_LVL0_IND1);
                    AttributeContextExpectedValue attrCtx_LVL0_IND2 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND2.Type = "attributeDefinition";
                        attrCtx_LVL0_IND2.Name = "StateCode";
                        attrCtx_LVL0_IND2.Parent = "Product_Resolved_structured/attributeContext/Product_Resolved_structured";
                        attrCtx_LVL0_IND2.Definition = "resolvedFrom/Product/hasAttributes/StateCode";
                        attrCtx_LVL0_IND2.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND2.ContextStrings.Add("Product_Resolved_structured/hasAttributes/StateCode");
                        }
                    }
                    expectedContext_structured.Contexts.Add(attrCtx_LVL0_IND2);
                    AttributeContextExpectedValue attrCtx_LVL0_IND3 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND3.Type = "attributeDefinition";
                        attrCtx_LVL0_IND3.Name = "StateCode_display";
                        attrCtx_LVL0_IND3.Parent = "Product_Resolved_structured/attributeContext/Product_Resolved_structured";
                        attrCtx_LVL0_IND3.Definition = "resolvedFrom/Product/hasAttributes/StateCode_display";
                        attrCtx_LVL0_IND3.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND3.ContextStrings.Add("Product_Resolved_structured/hasAttributes/StateCode_display");
                        }
                    }
                    expectedContext_structured.Contexts.Add(attrCtx_LVL0_IND3);
                    AttributeContextExpectedValue attrCtx_LVL0_IND4 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND4.Type = "attributeDefinition";
                        attrCtx_LVL0_IND4.Name = "StatusCode";
                        attrCtx_LVL0_IND4.Parent = "Product_Resolved_structured/attributeContext/Product_Resolved_structured";
                        attrCtx_LVL0_IND4.Definition = "resolvedFrom/Product/hasAttributes/StatusCode";
                        attrCtx_LVL0_IND4.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND4.ContextStrings.Add("Product_Resolved_structured/hasAttributes/StatusCode");
                        }
                    }
                    expectedContext_structured.Contexts.Add(attrCtx_LVL0_IND4);
                    AttributeContextExpectedValue attrCtx_LVL0_IND5 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND5.Type = "attributeDefinition";
                        attrCtx_LVL0_IND5.Name = "StatusCode_display";
                        attrCtx_LVL0_IND5.Parent = "Product_Resolved_structured/attributeContext/Product_Resolved_structured";
                        attrCtx_LVL0_IND5.Definition = "resolvedFrom/Product/hasAttributes/StatusCode_display";
                        attrCtx_LVL0_IND5.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND5.ContextStrings.Add("Product_Resolved_structured/hasAttributes/StatusCode_display");
                        }
                    }
                    expectedContext_structured.Contexts.Add(attrCtx_LVL0_IND5);
                }
                AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_normalized_structured.Type = "entity";
                    expectedContext_normalized_structured.Name = "Product_Resolved_normalized_structured";
                    expectedContext_normalized_structured.Definition = "resolvedFrom/Product";
                    expectedContext_normalized_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "ID";
                        attrCtx_LVL0_IND1.Parent = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Product/hasAttributes/ID";
                        attrCtx_LVL0_IND1.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND1.ContextStrings.Add("Product_Resolved_normalized_structured/hasAttributes/ID");
                        }
                    }
                    expectedContext_normalized_structured.Contexts.Add(attrCtx_LVL0_IND1);
                    AttributeContextExpectedValue attrCtx_LVL0_IND2 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND2.Type = "attributeDefinition";
                        attrCtx_LVL0_IND2.Name = "StateCode";
                        attrCtx_LVL0_IND2.Parent = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured";
                        attrCtx_LVL0_IND2.Definition = "resolvedFrom/Product/hasAttributes/StateCode";
                        attrCtx_LVL0_IND2.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND2.ContextStrings.Add("Product_Resolved_normalized_structured/hasAttributes/StateCode");
                        }
                    }
                    expectedContext_normalized_structured.Contexts.Add(attrCtx_LVL0_IND2);
                    AttributeContextExpectedValue attrCtx_LVL0_IND3 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND3.Type = "attributeDefinition";
                        attrCtx_LVL0_IND3.Name = "StateCode_display";
                        attrCtx_LVL0_IND3.Parent = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured";
                        attrCtx_LVL0_IND3.Definition = "resolvedFrom/Product/hasAttributes/StateCode_display";
                        attrCtx_LVL0_IND3.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND3.ContextStrings.Add("Product_Resolved_normalized_structured/hasAttributes/StateCode_display");
                        }
                    }
                    expectedContext_normalized_structured.Contexts.Add(attrCtx_LVL0_IND3);
                    AttributeContextExpectedValue attrCtx_LVL0_IND4 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND4.Type = "attributeDefinition";
                        attrCtx_LVL0_IND4.Name = "StatusCode";
                        attrCtx_LVL0_IND4.Parent = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured";
                        attrCtx_LVL0_IND4.Definition = "resolvedFrom/Product/hasAttributes/StatusCode";
                        attrCtx_LVL0_IND4.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND4.ContextStrings.Add("Product_Resolved_normalized_structured/hasAttributes/StatusCode");
                        }
                    }
                    expectedContext_normalized_structured.Contexts.Add(attrCtx_LVL0_IND4);
                    AttributeContextExpectedValue attrCtx_LVL0_IND5 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND5.Type = "attributeDefinition";
                        attrCtx_LVL0_IND5.Name = "StatusCode_display";
                        attrCtx_LVL0_IND5.Parent = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured";
                        attrCtx_LVL0_IND5.Definition = "resolvedFrom/Product/hasAttributes/StatusCode_display";
                        attrCtx_LVL0_IND5.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND5.ContextStrings.Add("Product_Resolved_normalized_structured/hasAttributes/StatusCode_display");
                        }
                    }
                    expectedContext_normalized_structured.Contexts.Add(attrCtx_LVL0_IND5);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly_normalized.Type = "entity";
                    expectedContext_referenceOnly_normalized.Name = "Product_Resolved_referenceOnly_normalized";
                    expectedContext_referenceOnly_normalized.Definition = "resolvedFrom/Product";
                    expectedContext_referenceOnly_normalized.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "ID";
                        attrCtx_LVL0_IND1.Parent = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Product/hasAttributes/ID";
                        attrCtx_LVL0_IND1.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND1.ContextStrings.Add("Product_Resolved_referenceOnly_normalized/hasAttributes/ID");
                        }
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND1);
                    AttributeContextExpectedValue attrCtx_LVL0_IND2 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND2.Type = "attributeDefinition";
                        attrCtx_LVL0_IND2.Name = "StateCode";
                        attrCtx_LVL0_IND2.Parent = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND2.Definition = "resolvedFrom/Product/hasAttributes/StateCode";
                        attrCtx_LVL0_IND2.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND2.ContextStrings.Add("Product_Resolved_referenceOnly_normalized/hasAttributes/StateCode");
                        }
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND2);
                    AttributeContextExpectedValue attrCtx_LVL0_IND3 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND3.Type = "attributeDefinition";
                        attrCtx_LVL0_IND3.Name = "StateCode_display";
                        attrCtx_LVL0_IND3.Parent = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND3.Definition = "resolvedFrom/Product/hasAttributes/StateCode_display";
                        attrCtx_LVL0_IND3.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND3.ContextStrings.Add("Product_Resolved_referenceOnly_normalized/hasAttributes/StateCode_display");
                        }
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND3);
                    AttributeContextExpectedValue attrCtx_LVL0_IND4 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND4.Type = "attributeDefinition";
                        attrCtx_LVL0_IND4.Name = "StatusCode";
                        attrCtx_LVL0_IND4.Parent = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND4.Definition = "resolvedFrom/Product/hasAttributes/StatusCode";
                        attrCtx_LVL0_IND4.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND4.ContextStrings.Add("Product_Resolved_referenceOnly_normalized/hasAttributes/StatusCode");
                        }
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND4);
                    AttributeContextExpectedValue attrCtx_LVL0_IND5 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND5.Type = "attributeDefinition";
                        attrCtx_LVL0_IND5.Name = "StatusCode_display";
                        attrCtx_LVL0_IND5.Parent = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND5.Definition = "resolvedFrom/Product/hasAttributes/StatusCode_display";
                        attrCtx_LVL0_IND5.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND5.ContextStrings.Add("Product_Resolved_referenceOnly_normalized/hasAttributes/StatusCode_display");
                        }
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND5);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly_structured.Type = "entity";
                    expectedContext_referenceOnly_structured.Name = "Product_Resolved_referenceOnly_structured";
                    expectedContext_referenceOnly_structured.Definition = "resolvedFrom/Product";
                    expectedContext_referenceOnly_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "ID";
                        attrCtx_LVL0_IND1.Parent = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Product/hasAttributes/ID";
                        attrCtx_LVL0_IND1.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND1.ContextStrings.Add("Product_Resolved_referenceOnly_structured/hasAttributes/ID");
                        }
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND1);
                    AttributeContextExpectedValue attrCtx_LVL0_IND2 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND2.Type = "attributeDefinition";
                        attrCtx_LVL0_IND2.Name = "StateCode";
                        attrCtx_LVL0_IND2.Parent = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND2.Definition = "resolvedFrom/Product/hasAttributes/StateCode";
                        attrCtx_LVL0_IND2.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND2.ContextStrings.Add("Product_Resolved_referenceOnly_structured/hasAttributes/StateCode");
                        }
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND2);
                    AttributeContextExpectedValue attrCtx_LVL0_IND3 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND3.Type = "attributeDefinition";
                        attrCtx_LVL0_IND3.Name = "StateCode_display";
                        attrCtx_LVL0_IND3.Parent = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND3.Definition = "resolvedFrom/Product/hasAttributes/StateCode_display";
                        attrCtx_LVL0_IND3.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND3.ContextStrings.Add("Product_Resolved_referenceOnly_structured/hasAttributes/StateCode_display");
                        }
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND3);
                    AttributeContextExpectedValue attrCtx_LVL0_IND4 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND4.Type = "attributeDefinition";
                        attrCtx_LVL0_IND4.Name = "StatusCode";
                        attrCtx_LVL0_IND4.Parent = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND4.Definition = "resolvedFrom/Product/hasAttributes/StatusCode";
                        attrCtx_LVL0_IND4.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND4.ContextStrings.Add("Product_Resolved_referenceOnly_structured/hasAttributes/StatusCode");
                        }
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND4);
                    AttributeContextExpectedValue attrCtx_LVL0_IND5 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND5.Type = "attributeDefinition";
                        attrCtx_LVL0_IND5.Name = "StatusCode_display";
                        attrCtx_LVL0_IND5.Parent = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND5.Definition = "resolvedFrom/Product/hasAttributes/StatusCode_display";
                        attrCtx_LVL0_IND5.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND5.ContextStrings.Add("Product_Resolved_referenceOnly_structured/hasAttributes/StatusCode_display");
                        }
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND5);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly_normalized_structured.Type = "entity";
                    expectedContext_referenceOnly_normalized_structured.Name = "Product_Resolved_referenceOnly_normalized_structured";
                    expectedContext_referenceOnly_normalized_structured.Definition = "resolvedFrom/Product";
                    expectedContext_referenceOnly_normalized_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "ID";
                        attrCtx_LVL0_IND1.Parent = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Product/hasAttributes/ID";
                        attrCtx_LVL0_IND1.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND1.ContextStrings.Add("Product_Resolved_referenceOnly_normalized_structured/hasAttributes/ID");
                        }
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND1);
                    AttributeContextExpectedValue attrCtx_LVL0_IND2 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND2.Type = "attributeDefinition";
                        attrCtx_LVL0_IND2.Name = "StateCode";
                        attrCtx_LVL0_IND2.Parent = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND2.Definition = "resolvedFrom/Product/hasAttributes/StateCode";
                        attrCtx_LVL0_IND2.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND2.ContextStrings.Add("Product_Resolved_referenceOnly_normalized_structured/hasAttributes/StateCode");
                        }
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND2);
                    AttributeContextExpectedValue attrCtx_LVL0_IND3 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND3.Type = "attributeDefinition";
                        attrCtx_LVL0_IND3.Name = "StateCode_display";
                        attrCtx_LVL0_IND3.Parent = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND3.Definition = "resolvedFrom/Product/hasAttributes/StateCode_display";
                        attrCtx_LVL0_IND3.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND3.ContextStrings.Add("Product_Resolved_referenceOnly_normalized_structured/hasAttributes/StateCode_display");
                        }
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND3);
                    AttributeContextExpectedValue attrCtx_LVL0_IND4 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND4.Type = "attributeDefinition";
                        attrCtx_LVL0_IND4.Name = "StatusCode";
                        attrCtx_LVL0_IND4.Parent = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND4.Definition = "resolvedFrom/Product/hasAttributes/StatusCode";
                        attrCtx_LVL0_IND4.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND4.ContextStrings.Add("Product_Resolved_referenceOnly_normalized_structured/hasAttributes/StatusCode");
                        }
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND4);
                    AttributeContextExpectedValue attrCtx_LVL0_IND5 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND5.Type = "attributeDefinition";
                        attrCtx_LVL0_IND5.Name = "StatusCode_display";
                        attrCtx_LVL0_IND5.Parent = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND5.Definition = "resolvedFrom/Product/hasAttributes/StatusCode_display";
                        attrCtx_LVL0_IND5.ContextStrings = new List<string>();
                        {
                            attrCtx_LVL0_IND5.ContextStrings.Add("Product_Resolved_referenceOnly_normalized_structured/hasAttributes/StatusCode_display");
                        }
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND5);
                }

                List<AttributeExpectedValue> expected_default = new List<AttributeExpectedValue>();
                {
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_default/attributeContext/Product_Resolved_default/ID",
                        DataFormat = "Guid",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_default/attributeContext/Product_Resolved_default/StateCode",
                        DataFormat = "Int32",
                        Name = "StateCode",
                        SourceName = "StateCode",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_default/attributeContext/Product_Resolved_default/StateCode_display",
                        DataFormat = "String",
                        Name = "StateCode_display",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_default/attributeContext/Product_Resolved_default/StatusCode",
                        DataFormat = "Int32",
                        Name = "StatusCode",
                        SourceName = "StatusCode",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_default/attributeContext/Product_Resolved_default/StatusCode_display",
                        DataFormat = "String",
                        Name = "StatusCode_display",
                    });
                }
                List<AttributeExpectedValue> expected_normalized = new List<AttributeExpectedValue>();
                {
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/ID",
                        DataFormat = "Guid",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/StateCode",
                        DataFormat = "Int32",
                        Name = "StateCode",
                        SourceName = "StateCode",
                    });
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/StateCode_display",
                        DataFormat = "String",
                        Name = "StateCode_display",
                    });
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/StatusCode",
                        DataFormat = "Int32",
                        Name = "StatusCode",
                        SourceName = "StatusCode",
                    });
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/StatusCode_display",
                        DataFormat = "String",
                        Name = "StatusCode_display",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/ID",
                        DataFormat = "Guid",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/StateCode",
                        DataFormat = "Int32",
                        Name = "StateCode",
                        SourceName = "StateCode",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/StateCode_display",
                        DataFormat = "String",
                        Name = "StateCode_display",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/StatusCode",
                        DataFormat = "Int32",
                        Name = "StatusCode",
                        SourceName = "StatusCode",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/StatusCode_display",
                        DataFormat = "String",
                        Name = "StatusCode_display",
                    });
                }
                List<AttributeExpectedValue> expected_structured = new List<AttributeExpectedValue>();
                {
                    expected_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_structured/attributeContext/Product_Resolved_structured/ID",
                        DataFormat = "Guid",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_structured/attributeContext/Product_Resolved_structured/StateCode",
                        DataFormat = "Int32",
                        Name = "StateCode",
                        SourceName = "StateCode",
                    });
                    expected_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_structured/attributeContext/Product_Resolved_structured/StateCode_display",
                        DataFormat = "String",
                        Name = "StateCode_display",
                    });
                    expected_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_structured/attributeContext/Product_Resolved_structured/StatusCode",
                        DataFormat = "Int32",
                        Name = "StatusCode",
                        SourceName = "StatusCode",
                    });
                    expected_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_structured/attributeContext/Product_Resolved_structured/StatusCode_display",
                        DataFormat = "String",
                        Name = "StatusCode_display",
                    });
                }
                List<AttributeExpectedValue> expected_normalized_structured = new List<AttributeExpectedValue>();
                {
                    expected_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/ID",
                        DataFormat = "Guid",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/StateCode",
                        DataFormat = "Int32",
                        Name = "StateCode",
                        SourceName = "StateCode",
                    });
                    expected_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/StateCode_display",
                        DataFormat = "String",
                        Name = "StateCode_display",
                    });
                    expected_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/StatusCode",
                        DataFormat = "Int32",
                        Name = "StatusCode",
                        SourceName = "StatusCode",
                    });
                    expected_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/StatusCode_display",
                        DataFormat = "String",
                        Name = "StatusCode_display",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/ID",
                        DataFormat = "Guid",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/StateCode",
                        DataFormat = "Int32",
                        Name = "StateCode",
                        SourceName = "StateCode",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/StateCode_display",
                        DataFormat = "String",
                        Name = "StateCode_display",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/StatusCode",
                        DataFormat = "Int32",
                        Name = "StatusCode",
                        SourceName = "StatusCode",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/StatusCode_display",
                        DataFormat = "String",
                        Name = "StatusCode_display",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_structured = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/ID",
                        DataFormat = "Guid",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/StateCode",
                        DataFormat = "Int32",
                        Name = "StateCode",
                        SourceName = "StateCode",
                    });
                    expected_referenceOnly_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/StateCode_display",
                        DataFormat = "String",
                        Name = "StateCode_display",
                    });
                    expected_referenceOnly_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/StatusCode",
                        DataFormat = "Int32",
                        Name = "StatusCode",
                        SourceName = "StatusCode",
                    });
                    expected_referenceOnly_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/StatusCode_display",
                        DataFormat = "String",
                        Name = "StatusCode_display",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/ID",
                        DataFormat = "Guid",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/StateCode",
                        DataFormat = "Int32",
                        Name = "StateCode",
                        SourceName = "StateCode",
                    });
                    expected_referenceOnly_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/StateCode_display",
                        DataFormat = "String",
                        Name = "StateCode_display",
                    });
                    expected_referenceOnly_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/StatusCode",
                        DataFormat = "Int32",
                        Name = "StatusCode",
                        SourceName = "StatusCode",
                    });
                    expected_referenceOnly_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/StatusCode_display",
                        DataFormat = "String",
                        Name = "StatusCode_display",
                    });
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

