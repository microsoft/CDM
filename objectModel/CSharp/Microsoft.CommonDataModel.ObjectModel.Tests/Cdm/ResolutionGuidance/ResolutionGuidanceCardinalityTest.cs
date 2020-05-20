// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Tests.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    [TestClass]
    public class ResolutionGuidanceCardinalityTest : CommonTest
    {

        /// <summary>
        /// Resolution Guidance Test - One:One Cardinality
        /// </summary>
        [TestMethod]
        public async Task TestForeignKeyOneToOneCardinality()
        {
            string testName = "TestForeignKeyOneToOneCardinality";
            {
                string entityName = "Person";

                AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
                {
                    expectedContext_default.Type = "entity";
                    expectedContext_default.Name = "Person_Resolved_default";
                    expectedContext_default.Definition = "resolvedFrom/Person";
                    expectedContext_default.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Person_Resolved_default/attributeContext/Person_Resolved_default";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Person_Resolved_default/attributeContext/Person_Resolved_default/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_default.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Person_Resolved_default/attributeContext/Person_Resolved_default";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Person_Resolved_default/attributeContext/Person_Resolved_default/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Person_Resolved_default/attributeContext/Person_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Person_Resolved_default/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "FullName";
                                attrCtx_LVL2_IND1.Parent = "Person_Resolved_default/attributeContext/Person_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Person_Resolved_default/hasAttributes/FullName");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_default.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
                {
                    expectedContext_normalized.Type = "entity";
                    expectedContext_normalized.Name = "Person_Resolved_normalized";
                    expectedContext_normalized.Definition = "resolvedFrom/Person";
                    expectedContext_normalized.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Person_Resolved_normalized/attributeContext/Person_Resolved_normalized";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Person_Resolved_normalized/attributeContext/Person_Resolved_normalized/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Person_Resolved_normalized/attributeContext/Person_Resolved_normalized";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Person_Resolved_normalized/attributeContext/Person_Resolved_normalized/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Person_Resolved_normalized/attributeContext/Person_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Person_Resolved_normalized/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "FullName";
                                attrCtx_LVL2_IND1.Parent = "Person_Resolved_normalized/attributeContext/Person_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Person_Resolved_normalized/hasAttributes/FullName");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly.Type = "entity";
                    expectedContext_referenceOnly.Name = "Person_Resolved_referenceOnly";
                    expectedContext_referenceOnly.Definition = "resolvedFrom/Person";
                    expectedContext_referenceOnly.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Person_Resolved_referenceOnly/attributeContext/Person_Resolved_referenceOnly";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Person_Resolved_referenceOnly/attributeContext/Person_Resolved_referenceOnly/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Person_Resolved_referenceOnly/attributeContext/Person_Resolved_referenceOnly";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Person_Resolved_referenceOnly/attributeContext/Person_Resolved_referenceOnly/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Person_Resolved_referenceOnly/attributeContext/Person_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Person_Resolved_referenceOnly/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "FullName";
                                attrCtx_LVL2_IND1.Parent = "Person_Resolved_referenceOnly/attributeContext/Person_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Person_Resolved_referenceOnly/hasAttributes/FullName");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_structured.Type = "entity";
                    expectedContext_structured.Name = "Person_Resolved_structured";
                    expectedContext_structured.Definition = "resolvedFrom/Person";
                    expectedContext_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Person_Resolved_structured/attributeContext/Person_Resolved_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Person_Resolved_structured/attributeContext/Person_Resolved_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Person_Resolved_structured/attributeContext/Person_Resolved_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Person_Resolved_structured/attributeContext/Person_Resolved_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Person_Resolved_structured/attributeContext/Person_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Person_Resolved_structured/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "FullName";
                                attrCtx_LVL2_IND1.Parent = "Person_Resolved_structured/attributeContext/Person_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Person_Resolved_structured/hasAttributes/FullName");
                                }
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
                    expectedContext_normalized_structured.Name = "Person_Resolved_normalized_structured";
                    expectedContext_normalized_structured.Definition = "resolvedFrom/Person";
                    expectedContext_normalized_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Person_Resolved_normalized_structured/attributeContext/Person_Resolved_normalized_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Person_Resolved_normalized_structured/attributeContext/Person_Resolved_normalized_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Person_Resolved_normalized_structured/attributeContext/Person_Resolved_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Person_Resolved_normalized_structured/attributeContext/Person_Resolved_normalized_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Person_Resolved_normalized_structured/attributeContext/Person_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Person_Resolved_normalized_structured/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "FullName";
                                attrCtx_LVL2_IND1.Parent = "Person_Resolved_normalized_structured/attributeContext/Person_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Person_Resolved_normalized_structured/hasAttributes/FullName");
                                }
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
                    expectedContext_referenceOnly_normalized.Name = "Person_Resolved_referenceOnly_normalized";
                    expectedContext_referenceOnly_normalized.Definition = "resolvedFrom/Person";
                    expectedContext_referenceOnly_normalized.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Person_Resolved_referenceOnly_normalized/attributeContext/Person_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Person_Resolved_referenceOnly_normalized/attributeContext/Person_Resolved_referenceOnly_normalized/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Person_Resolved_referenceOnly_normalized/attributeContext/Person_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Person_Resolved_referenceOnly_normalized/attributeContext/Person_Resolved_referenceOnly_normalized/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Person_Resolved_referenceOnly_normalized/attributeContext/Person_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Person_Resolved_referenceOnly_normalized/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "FullName";
                                attrCtx_LVL2_IND1.Parent = "Person_Resolved_referenceOnly_normalized/attributeContext/Person_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Person_Resolved_referenceOnly_normalized/hasAttributes/FullName");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly_structured.Type = "entity";
                    expectedContext_referenceOnly_structured.Name = "Person_Resolved_referenceOnly_structured";
                    expectedContext_referenceOnly_structured.Definition = "resolvedFrom/Person";
                    expectedContext_referenceOnly_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Person_Resolved_referenceOnly_structured/attributeContext/Person_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Person_Resolved_referenceOnly_structured/attributeContext/Person_Resolved_referenceOnly_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Person_Resolved_referenceOnly_structured/attributeContext/Person_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Person_Resolved_referenceOnly_structured/attributeContext/Person_Resolved_referenceOnly_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Person_Resolved_referenceOnly_structured/attributeContext/Person_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Person_Resolved_referenceOnly_structured/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "FullName";
                                attrCtx_LVL2_IND1.Parent = "Person_Resolved_referenceOnly_structured/attributeContext/Person_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Person_Resolved_referenceOnly_structured/hasAttributes/FullName");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly_normalized_structured.Type = "entity";
                    expectedContext_referenceOnly_normalized_structured.Name = "Person_Resolved_referenceOnly_normalized_structured";
                    expectedContext_referenceOnly_normalized_structured.Definition = "resolvedFrom/Person";
                    expectedContext_referenceOnly_normalized_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Person_Resolved_referenceOnly_normalized_structured/attributeContext/Person_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Person_Resolved_referenceOnly_normalized_structured/attributeContext/Person_Resolved_referenceOnly_normalized_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Person_Resolved_referenceOnly_normalized_structured/attributeContext/Person_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Person_Resolved_referenceOnly_normalized_structured/attributeContext/Person_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Person_Resolved_referenceOnly_normalized_structured/attributeContext/Person_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Person_Resolved_referenceOnly_normalized_structured/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "FullName";
                                attrCtx_LVL2_IND1.Parent = "Person_Resolved_referenceOnly_normalized_structured/attributeContext/Person_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Person_Resolved_referenceOnly_normalized_structured/hasAttributes/FullName");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }

                List<AttributeExpectedValue> expected_default = new List<AttributeExpectedValue>();
                {
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Person_Resolved_default/attributeContext/Person_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Person_Resolved_default/attributeContext/Person_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName",
                        DataFormat = "String",
                        DisplayName = "FullName",
                        Name = "FullName",
                        SourceName = "FullName",
                    });
                }
                List<AttributeExpectedValue> expected_normalized = new List<AttributeExpectedValue>();
                {
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Person_Resolved_normalized/attributeContext/Person_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Person_Resolved_normalized/attributeContext/Person_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName",
                        DataFormat = "String",
                        DisplayName = "FullName",
                        Name = "FullName",
                        SourceName = "FullName",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Person_Resolved_referenceOnly/attributeContext/Person_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Person_Resolved_referenceOnly/attributeContext/Person_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName",
                        DataFormat = "String",
                        DisplayName = "FullName",
                        Name = "FullName",
                        SourceName = "FullName",
                    });
                }
                List<AttributeExpectedValue> expected_structured = new List<AttributeExpectedValue>();
                {
                    expected_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Person_Resolved_structured/attributeContext/Person_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Person_Resolved_structured/attributeContext/Person_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName",
                        DataFormat = "String",
                        DisplayName = "FullName",
                        Name = "FullName",
                        SourceName = "FullName",
                    });
                }
                List<AttributeExpectedValue> expected_normalized_structured = new List<AttributeExpectedValue>();
                {
                    expected_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Person_Resolved_normalized_structured/attributeContext/Person_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Person_Resolved_normalized_structured/attributeContext/Person_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName",
                        DataFormat = "String",
                        DisplayName = "FullName",
                        Name = "FullName",
                        SourceName = "FullName",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Person_Resolved_referenceOnly_normalized/attributeContext/Person_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Person_Resolved_referenceOnly_normalized/attributeContext/Person_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName",
                        DataFormat = "String",
                        DisplayName = "FullName",
                        Name = "FullName",
                        SourceName = "FullName",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_structured = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Person_Resolved_referenceOnly_structured/attributeContext/Person_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Person_Resolved_referenceOnly_structured/attributeContext/Person_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName",
                        DataFormat = "String",
                        DisplayName = "FullName",
                        Name = "FullName",
                        SourceName = "FullName",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Person_Resolved_referenceOnly_normalized_structured/attributeContext/Person_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Person_Resolved_referenceOnly_normalized_structured/attributeContext/Person_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName",
                        DataFormat = "String",
                        DisplayName = "FullName",
                        Name = "FullName",
                        SourceName = "FullName",
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
            {
                string entityName = "PersonContact";

                AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
                {
                    expectedContext_default.Type = "entity";
                    expectedContext_default.Name = "PersonContact_Resolved_default";
                    expectedContext_default.Definition = "resolvedFrom/PersonContact";
                    expectedContext_default.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_default.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "PersonID";
                                attrCtx_LVL2_IND0.Parent = "PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PersonID";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Person";
                                    attrCtx_LVL3_IND0.Parent = "PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Person";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Parent = "PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeGroup";
                                            attrCtx_LVL5_IND0.Name = "attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Parent = "PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND0.Name = "ID";
                                                attrCtx_LVL6_IND0.Parent = "PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID";
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "FullName";
                                                attrCtx_LVL6_IND1.Parent = "PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName";
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND1);
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
                                    attrCtx_LVL3_IND1.Parent = "PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID";
                                    attrCtx_LVL3_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "generatedRound";
                                        attrCtx_LVL4_IND0.Name = "_generatedAttributeRound0";
                                        attrCtx_LVL4_IND0.Parent = "PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeDefinition";
                                            attrCtx_LVL5_IND0.Name = "ID";
                                            attrCtx_LVL5_IND0.Parent = "PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID";
                                            attrCtx_LVL5_IND0.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND0.ContextStrings.Add("PersonContact_Resolved_default/hasAttributes/ID");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL5_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND1.Type = "attributeDefinition";
                                            attrCtx_LVL5_IND1.Name = "FullName";
                                            attrCtx_LVL5_IND1.Parent = "PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName";
                                            attrCtx_LVL5_IND1.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND1.ContextStrings.Add("PersonContact_Resolved_default/hasAttributes/FullName");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND1);
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND0);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "EmailAddress";
                                attrCtx_LVL2_IND1.Parent = "PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/EmailAddress";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("PersonContact_Resolved_default/hasAttributes/EmailAddress");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "PhoneNumber";
                                attrCtx_LVL2_IND2.Parent = "PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PhoneNumber";
                                attrCtx_LVL2_IND2.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND2.ContextStrings.Add("PersonContact_Resolved_default/hasAttributes/PhoneNumber");
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
                    expectedContext_normalized.Name = "PersonContact_Resolved_normalized";
                    expectedContext_normalized.Definition = "resolvedFrom/PersonContact";
                    expectedContext_normalized.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "PersonID";
                                attrCtx_LVL2_IND0.Parent = "PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PersonID";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Person";
                                    attrCtx_LVL3_IND0.Parent = "PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Person";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Parent = "PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeGroup";
                                            attrCtx_LVL5_IND0.Name = "attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Parent = "PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND0.Name = "ID";
                                                attrCtx_LVL6_IND0.Parent = "PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID";
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "FullName";
                                                attrCtx_LVL6_IND1.Parent = "PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName";
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND1);
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
                                    attrCtx_LVL3_IND1.Parent = "PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID";
                                    attrCtx_LVL3_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "generatedRound";
                                        attrCtx_LVL4_IND0.Name = "_generatedAttributeRound0";
                                        attrCtx_LVL4_IND0.Parent = "PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeDefinition";
                                            attrCtx_LVL5_IND0.Name = "ID";
                                            attrCtx_LVL5_IND0.Parent = "PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID";
                                            attrCtx_LVL5_IND0.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND0.ContextStrings.Add("PersonContact_Resolved_normalized/hasAttributes/ID");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL5_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND1.Type = "attributeDefinition";
                                            attrCtx_LVL5_IND1.Name = "FullName";
                                            attrCtx_LVL5_IND1.Parent = "PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName";
                                            attrCtx_LVL5_IND1.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND1.ContextStrings.Add("PersonContact_Resolved_normalized/hasAttributes/FullName");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND1);
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND0);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "EmailAddress";
                                attrCtx_LVL2_IND1.Parent = "PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/EmailAddress";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("PersonContact_Resolved_normalized/hasAttributes/EmailAddress");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "PhoneNumber";
                                attrCtx_LVL2_IND2.Parent = "PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PhoneNumber";
                                attrCtx_LVL2_IND2.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND2.ContextStrings.Add("PersonContact_Resolved_normalized/hasAttributes/PhoneNumber");
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
                    expectedContext_referenceOnly.Name = "PersonContact_Resolved_referenceOnly";
                    expectedContext_referenceOnly.Definition = "resolvedFrom/PersonContact";
                    expectedContext_referenceOnly.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "PersonID";
                                attrCtx_LVL2_IND0.Parent = "PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PersonID";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Person";
                                    attrCtx_LVL3_IND0.Parent = "PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Person";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "generatedSet";
                                    attrCtx_LVL3_IND1.Name = "_generatedAttributeSet";
                                    attrCtx_LVL3_IND1.Parent = "PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID";
                                    attrCtx_LVL3_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "generatedRound";
                                        attrCtx_LVL4_IND0.Name = "_generatedAttributeRound0";
                                        attrCtx_LVL4_IND0.Parent = "PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "addedAttributeIdentity";
                                            attrCtx_LVL5_IND0.Name = "_foreignKey";
                                            attrCtx_LVL5_IND0.Parent = "PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND0.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND0.ContextStrings.Add("PersonContact_Resolved_referenceOnly/hasAttributes/PersonID");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND0);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "EmailAddress";
                                attrCtx_LVL2_IND1.Parent = "PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/EmailAddress";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("PersonContact_Resolved_referenceOnly/hasAttributes/EmailAddress");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "PhoneNumber";
                                attrCtx_LVL2_IND2.Parent = "PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PhoneNumber";
                                attrCtx_LVL2_IND2.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND2.ContextStrings.Add("PersonContact_Resolved_referenceOnly/hasAttributes/PhoneNumber");
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
                    expectedContext_structured.Name = "PersonContact_Resolved_structured";
                    expectedContext_structured.Definition = "resolvedFrom/PersonContact";
                    expectedContext_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "PersonID";
                                attrCtx_LVL2_IND0.Parent = "PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PersonID";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Person";
                                    attrCtx_LVL3_IND0.Parent = "PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Person";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Parent = "PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeGroup";
                                            attrCtx_LVL5_IND0.Name = "attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Parent = "PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND0.Name = "ID";
                                                attrCtx_LVL6_IND0.Parent = "PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID";
                                                attrCtx_LVL6_IND0.ContextStrings = new List<string>();
                                                {
                                                    attrCtx_LVL6_IND0.ContextStrings.Add("PersonContact_Resolved_structured/hasAttributes/PersonID/members/ID");
                                                }
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "FullName";
                                                attrCtx_LVL6_IND1.Parent = "PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName";
                                                attrCtx_LVL6_IND1.ContextStrings = new List<string>();
                                                {
                                                    attrCtx_LVL6_IND1.ContextStrings.Add("PersonContact_Resolved_structured/hasAttributes/PersonID/members/FullName");
                                                }
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
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "EmailAddress";
                                attrCtx_LVL2_IND1.Parent = "PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/EmailAddress";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("PersonContact_Resolved_structured/hasAttributes/EmailAddress");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "PhoneNumber";
                                attrCtx_LVL2_IND2.Parent = "PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PhoneNumber";
                                attrCtx_LVL2_IND2.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND2.ContextStrings.Add("PersonContact_Resolved_structured/hasAttributes/PhoneNumber");
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
                    expectedContext_normalized_structured.Name = "PersonContact_Resolved_normalized_structured";
                    expectedContext_normalized_structured.Definition = "resolvedFrom/PersonContact";
                    expectedContext_normalized_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "PersonID";
                                attrCtx_LVL2_IND0.Parent = "PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PersonID";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Person";
                                    attrCtx_LVL3_IND0.Parent = "PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Person";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Parent = "PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeGroup";
                                            attrCtx_LVL5_IND0.Name = "attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Parent = "PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND0.Name = "ID";
                                                attrCtx_LVL6_IND0.Parent = "PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND0.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/ID";
                                                attrCtx_LVL6_IND0.ContextStrings = new List<string>();
                                                {
                                                    attrCtx_LVL6_IND0.ContextStrings.Add("PersonContact_Resolved_normalized_structured/hasAttributes/PersonID/members/ID");
                                                }
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "FullName";
                                                attrCtx_LVL6_IND1.Parent = "PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Person/hasAttributes/attributesAddedAtThisScope/members/FullName";
                                                attrCtx_LVL6_IND1.ContextStrings = new List<string>();
                                                {
                                                    attrCtx_LVL6_IND1.ContextStrings.Add("PersonContact_Resolved_normalized_structured/hasAttributes/PersonID/members/FullName");
                                                }
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
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "EmailAddress";
                                attrCtx_LVL2_IND1.Parent = "PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/EmailAddress";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("PersonContact_Resolved_normalized_structured/hasAttributes/EmailAddress");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "PhoneNumber";
                                attrCtx_LVL2_IND2.Parent = "PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PhoneNumber";
                                attrCtx_LVL2_IND2.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND2.ContextStrings.Add("PersonContact_Resolved_normalized_structured/hasAttributes/PhoneNumber");
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
                    expectedContext_referenceOnly_normalized.Name = "PersonContact_Resolved_referenceOnly_normalized";
                    expectedContext_referenceOnly_normalized.Definition = "resolvedFrom/PersonContact";
                    expectedContext_referenceOnly_normalized.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "PersonID";
                                attrCtx_LVL2_IND0.Parent = "PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PersonID";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Person";
                                    attrCtx_LVL3_IND0.Parent = "PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Person";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "generatedSet";
                                    attrCtx_LVL3_IND1.Name = "_generatedAttributeSet";
                                    attrCtx_LVL3_IND1.Parent = "PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID";
                                    attrCtx_LVL3_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "generatedRound";
                                        attrCtx_LVL4_IND0.Name = "_generatedAttributeRound0";
                                        attrCtx_LVL4_IND0.Parent = "PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "addedAttributeIdentity";
                                            attrCtx_LVL5_IND0.Name = "_foreignKey";
                                            attrCtx_LVL5_IND0.Parent = "PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND0.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND0.ContextStrings.Add("PersonContact_Resolved_referenceOnly_normalized/hasAttributes/PersonID");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND0);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "EmailAddress";
                                attrCtx_LVL2_IND1.Parent = "PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/EmailAddress";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("PersonContact_Resolved_referenceOnly_normalized/hasAttributes/EmailAddress");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "PhoneNumber";
                                attrCtx_LVL2_IND2.Parent = "PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PhoneNumber";
                                attrCtx_LVL2_IND2.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND2.ContextStrings.Add("PersonContact_Resolved_referenceOnly_normalized/hasAttributes/PhoneNumber");
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
                    expectedContext_referenceOnly_structured.Name = "PersonContact_Resolved_referenceOnly_structured";
                    expectedContext_referenceOnly_structured.Definition = "resolvedFrom/PersonContact";
                    expectedContext_referenceOnly_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "PersonID";
                                attrCtx_LVL2_IND0.Parent = "PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PersonID";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Person";
                                    attrCtx_LVL3_IND0.Parent = "PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Person";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "generatedSet";
                                    attrCtx_LVL3_IND1.Name = "_generatedAttributeSet";
                                    attrCtx_LVL3_IND1.Parent = "PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID";
                                    attrCtx_LVL3_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "generatedRound";
                                        attrCtx_LVL4_IND0.Name = "_generatedAttributeRound0";
                                        attrCtx_LVL4_IND0.Parent = "PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "addedAttributeIdentity";
                                            attrCtx_LVL5_IND0.Name = "_foreignKey";
                                            attrCtx_LVL5_IND0.Parent = "PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND0.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND0.ContextStrings.Add("PersonContact_Resolved_referenceOnly_structured/hasAttributes/PersonID/members/PersonID");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND0);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "EmailAddress";
                                attrCtx_LVL2_IND1.Parent = "PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/EmailAddress";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("PersonContact_Resolved_referenceOnly_structured/hasAttributes/EmailAddress");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "PhoneNumber";
                                attrCtx_LVL2_IND2.Parent = "PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PhoneNumber";
                                attrCtx_LVL2_IND2.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND2.ContextStrings.Add("PersonContact_Resolved_referenceOnly_structured/hasAttributes/PhoneNumber");
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
                    expectedContext_referenceOnly_normalized_structured.Name = "PersonContact_Resolved_referenceOnly_normalized_structured";
                    expectedContext_referenceOnly_normalized_structured.Definition = "resolvedFrom/PersonContact";
                    expectedContext_referenceOnly_normalized_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "PersonID";
                                attrCtx_LVL2_IND0.Parent = "PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PersonID";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Person";
                                    attrCtx_LVL3_IND0.Parent = "PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Person";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "generatedSet";
                                    attrCtx_LVL3_IND1.Name = "_generatedAttributeSet";
                                    attrCtx_LVL3_IND1.Parent = "PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID";
                                    attrCtx_LVL3_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "generatedRound";
                                        attrCtx_LVL4_IND0.Name = "_generatedAttributeRound0";
                                        attrCtx_LVL4_IND0.Parent = "PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "addedAttributeIdentity";
                                            attrCtx_LVL5_IND0.Name = "_foreignKey";
                                            attrCtx_LVL5_IND0.Parent = "PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND0.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND0.ContextStrings.Add("PersonContact_Resolved_referenceOnly_normalized_structured/hasAttributes/PersonID/members/PersonID");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND0);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "EmailAddress";
                                attrCtx_LVL2_IND1.Parent = "PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/EmailAddress";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("PersonContact_Resolved_referenceOnly_normalized_structured/hasAttributes/EmailAddress");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "PhoneNumber";
                                attrCtx_LVL2_IND2.Parent = "PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/PersonContact/hasAttributes/attributesAddedAtThisScope/members/PhoneNumber";
                                attrCtx_LVL2_IND2.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND2.ContextStrings.Add("PersonContact_Resolved_referenceOnly_normalized_structured/hasAttributes/PhoneNumber");
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
                        AttributeContext = "PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0/FullName",
                        DataFormat = "String",
                        DisplayName = "FullName",
                        Name = "FullName",
                        SourceName = "FullName",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmailAddress",
                        DataFormat = "String",
                        DisplayName = "EmailAddress",
                        Name = "EmailAddress",
                        SourceName = "EmailAddress",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "PersonContact_Resolved_default/attributeContext/PersonContact_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/PhoneNumber",
                        DataFormat = "String",
                        DisplayName = "PhoneNumber",
                        Name = "PhoneNumber",
                        SourceName = "PhoneNumber",
                    });
                }
                List<AttributeExpectedValue> expected_normalized = new List<AttributeExpectedValue>();
                {
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0/FullName",
                        DataFormat = "String",
                        DisplayName = "FullName",
                        Name = "FullName",
                        SourceName = "FullName",
                    });
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmailAddress",
                        DataFormat = "String",
                        DisplayName = "EmailAddress",
                        Name = "EmailAddress",
                        SourceName = "EmailAddress",
                    });
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "PersonContact_Resolved_normalized/attributeContext/PersonContact_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PhoneNumber",
                        DataFormat = "String",
                        DisplayName = "PhoneNumber",
                        Name = "PhoneNumber",
                        SourceName = "PhoneNumber",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey",
                        DataFormat = "Guid",
                        Description = "",
                        DisplayName = "PersonID",
                        Name = "PersonID",
                        SourceName = "PersonID",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmailAddress",
                        DataFormat = "String",
                        DisplayName = "EmailAddress",
                        Name = "EmailAddress",
                        SourceName = "EmailAddress",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "PersonContact_Resolved_referenceOnly/attributeContext/PersonContact_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/PhoneNumber",
                        DataFormat = "String",
                        DisplayName = "PhoneNumber",
                        Name = "PhoneNumber",
                        SourceName = "PhoneNumber",
                    });
                }
                List<AttributeExpectedValue> expected_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "PersonID";
                        AttribGroupRef.AttributeContext = "PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                            DataFormat = "Guid",
                            Name = "ID",
                        });
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName",
                            DataFormat = "String",
                            Name = "FullName",
                        });
                        expected_structured.Add(AttribGroupRef);
                    };
                    expected_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmailAddress",
                        DataFormat = "String",
                        DisplayName = "EmailAddress",
                        Name = "EmailAddress",
                        SourceName = "EmailAddress",
                    });
                    expected_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "PersonContact_Resolved_structured/attributeContext/PersonContact_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PhoneNumber",
                        DataFormat = "String",
                        DisplayName = "PhoneNumber",
                        Name = "PhoneNumber",
                        SourceName = "PhoneNumber",
                    });
                }
                List<AttributeExpectedValue> expected_normalized_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "PersonID";
                        AttribGroupRef.AttributeContext = "PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                            DataFormat = "Guid",
                            Name = "ID",
                        });
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/Person/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName",
                            DataFormat = "String",
                            Name = "FullName",
                        });
                        expected_normalized_structured.Add(AttribGroupRef);
                    };
                    expected_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmailAddress",
                        DataFormat = "String",
                        DisplayName = "EmailAddress",
                        Name = "EmailAddress",
                        SourceName = "EmailAddress",
                    });
                    expected_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "PersonContact_Resolved_normalized_structured/attributeContext/PersonContact_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PhoneNumber",
                        DataFormat = "String",
                        DisplayName = "PhoneNumber",
                        Name = "PhoneNumber",
                        SourceName = "PhoneNumber",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey",
                        DataFormat = "Guid",
                        Description = "",
                        DisplayName = "PersonID",
                        Name = "PersonID",
                        SourceName = "PersonID",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmailAddress",
                        DataFormat = "String",
                        DisplayName = "EmailAddress",
                        Name = "EmailAddress",
                        SourceName = "EmailAddress",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "PersonContact_Resolved_referenceOnly_normalized/attributeContext/PersonContact_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/PhoneNumber",
                        DataFormat = "String",
                        DisplayName = "PhoneNumber",
                        Name = "PhoneNumber",
                        SourceName = "PhoneNumber",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "PersonID";
                        AttribGroupRef.AttributeContext = "PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey",
                            DataFormat = "Guid",
                            Description = "",
                            DisplayName = "PersonID",
                            Name = "PersonID",
                            SourceName = "PersonID",
                        });
                        expected_referenceOnly_structured.Add(AttribGroupRef);
                    };
                    expected_referenceOnly_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmailAddress",
                        DataFormat = "String",
                        DisplayName = "EmailAddress",
                        Name = "EmailAddress",
                        SourceName = "EmailAddress",
                    });
                    expected_referenceOnly_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "PersonContact_Resolved_referenceOnly_structured/attributeContext/PersonContact_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PhoneNumber",
                        DataFormat = "String",
                        DisplayName = "PhoneNumber",
                        Name = "PhoneNumber",
                        SourceName = "PhoneNumber",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "PersonID";
                        AttribGroupRef.AttributeContext = "PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PersonID/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey",
                            DataFormat = "Guid",
                            Description = "",
                            DisplayName = "PersonID",
                            Name = "PersonID",
                            SourceName = "PersonID",
                        });
                        expected_referenceOnly_normalized_structured.Add(AttribGroupRef);
                    };
                    expected_referenceOnly_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmailAddress",
                        DataFormat = "String",
                        DisplayName = "EmailAddress",
                        Name = "EmailAddress",
                        SourceName = "EmailAddress",
                    });
                    expected_referenceOnly_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "PersonContact_Resolved_referenceOnly_normalized_structured/attributeContext/PersonContact_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/PhoneNumber",
                        DataFormat = "String",
                        DisplayName = "PhoneNumber",
                        Name = "PhoneNumber",
                        SourceName = "PhoneNumber",
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
        /// Resolution Guidance Test - Many:Many Cardinality
        /// </summary>
        [TestMethod]
        public async Task TestForeignKeyManyToManyCardinality()
        {
            string testName = "TestForeignKeyManyToManyCardinality";
            {
                string entityName = "Customer";

                AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
                {
                    expectedContext_default.Type = "entity";
                    expectedContext_default.Name = "Customer_Resolved_default";
                    expectedContext_default.Definition = "resolvedFrom/Customer";
                    expectedContext_default.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Customer_Resolved_default/attributeContext/Customer_Resolved_default";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_default/attributeContext/Customer_Resolved_default/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_default.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_default/attributeContext/Customer_Resolved_default";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_default/attributeContext/Customer_Resolved_default/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_default/attributeContext/Customer_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Customer_Resolved_default/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "Name";
                                attrCtx_LVL2_IND1.Parent = "Customer_Resolved_default/attributeContext/Customer_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/Name";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Customer_Resolved_default/hasAttributes/Name");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_default.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
                {
                    expectedContext_normalized.Type = "entity";
                    expectedContext_normalized.Name = "Customer_Resolved_normalized";
                    expectedContext_normalized.Definition = "resolvedFrom/Customer";
                    expectedContext_normalized.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Customer_Resolved_normalized/attributeContext/Customer_Resolved_normalized";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_normalized/attributeContext/Customer_Resolved_normalized/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_normalized/attributeContext/Customer_Resolved_normalized";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_normalized/attributeContext/Customer_Resolved_normalized/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_normalized/attributeContext/Customer_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Customer_Resolved_normalized/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "Name";
                                attrCtx_LVL2_IND1.Parent = "Customer_Resolved_normalized/attributeContext/Customer_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/Name";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Customer_Resolved_normalized/hasAttributes/Name");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized.Contexts.Add(attrCtx_LVL0_IND1);
                }
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
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Customer_Resolved_referenceOnly/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "Name";
                                attrCtx_LVL2_IND1.Parent = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/Name";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Customer_Resolved_referenceOnly/hasAttributes/Name");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
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
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Customer_Resolved_structured/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "Name";
                                attrCtx_LVL2_IND1.Parent = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/Name";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Customer_Resolved_structured/hasAttributes/Name");
                                }
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
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Customer_Resolved_normalized_structured/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "Name";
                                attrCtx_LVL2_IND1.Parent = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/Name";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Customer_Resolved_normalized_structured/hasAttributes/Name");
                                }
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
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Customer_Resolved_referenceOnly_normalized/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "Name";
                                attrCtx_LVL2_IND1.Parent = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/Name";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Customer_Resolved_referenceOnly_normalized/hasAttributes/Name");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
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
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Customer_Resolved_referenceOnly_structured/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "Name";
                                attrCtx_LVL2_IND1.Parent = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/Name";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Customer_Resolved_referenceOnly_structured/hasAttributes/Name");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
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
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Customer_Resolved_referenceOnly_normalized_structured/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "Name";
                                attrCtx_LVL2_IND1.Parent = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/Name";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Customer_Resolved_referenceOnly_normalized_structured/hasAttributes/Name");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }

                List<AttributeExpectedValue> expected_default = new List<AttributeExpectedValue>();
                {
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_default/attributeContext/Customer_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_default/attributeContext/Customer_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                        DataFormat = "String",
                        DisplayName = "Name",
                        Name = "Name",
                        SourceName = "Name",
                    });
                }
                List<AttributeExpectedValue> expected_normalized = new List<AttributeExpectedValue>();
                {
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_normalized/attributeContext/Customer_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_normalized/attributeContext/Customer_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                        DataFormat = "String",
                        DisplayName = "Name",
                        Name = "Name",
                        SourceName = "Name",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_referenceOnly/attributeContext/Customer_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                        DataFormat = "String",
                        DisplayName = "Name",
                        Name = "Name",
                        SourceName = "Name",
                    });
                }
                List<AttributeExpectedValue> expected_structured = new List<AttributeExpectedValue>();
                {
                    expected_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_structured/attributeContext/Customer_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                        DataFormat = "String",
                        DisplayName = "Name",
                        Name = "Name",
                        SourceName = "Name",
                    });
                }
                List<AttributeExpectedValue> expected_normalized_structured = new List<AttributeExpectedValue>();
                {
                    expected_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_normalized_structured/attributeContext/Customer_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                        DataFormat = "String",
                        DisplayName = "Name",
                        Name = "Name",
                        SourceName = "Name",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_referenceOnly_normalized/attributeContext/Customer_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                        DataFormat = "String",
                        DisplayName = "Name",
                        Name = "Name",
                        SourceName = "Name",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_structured = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_referenceOnly_structured/attributeContext/Customer_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                        DataFormat = "String",
                        DisplayName = "Name",
                        Name = "Name",
                        SourceName = "Name",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Customer_Resolved_referenceOnly_normalized_structured/attributeContext/Customer_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                        DataFormat = "String",
                        DisplayName = "Name",
                        Name = "Name",
                        SourceName = "Name",
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
                                attrCtx_LVL2_IND1.Name = "Name";
                                attrCtx_LVL2_IND1.Parent = "Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/Name";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Product_Resolved_default/hasAttributes/Name");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
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
                                attrCtx_LVL2_IND1.Name = "Name";
                                attrCtx_LVL2_IND1.Parent = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/Name";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Product_Resolved_normalized/hasAttributes/Name");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
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
                                attrCtx_LVL2_IND1.Name = "Name";
                                attrCtx_LVL2_IND1.Parent = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/Name";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Product_Resolved_referenceOnly/hasAttributes/Name");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
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
                                attrCtx_LVL2_IND1.Name = "Name";
                                attrCtx_LVL2_IND1.Parent = "Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/Name";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Product_Resolved_structured/hasAttributes/Name");
                                }
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
                                attrCtx_LVL2_IND1.Name = "Name";
                                attrCtx_LVL2_IND1.Parent = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/Name";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Product_Resolved_normalized_structured/hasAttributes/Name");
                                }
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
                                attrCtx_LVL2_IND1.Name = "Name";
                                attrCtx_LVL2_IND1.Parent = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/Name";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Product_Resolved_referenceOnly_normalized/hasAttributes/Name");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
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
                                attrCtx_LVL2_IND1.Name = "Name";
                                attrCtx_LVL2_IND1.Parent = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/Name";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Product_Resolved_referenceOnly_structured/hasAttributes/Name");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
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
                                attrCtx_LVL2_IND1.Name = "Name";
                                attrCtx_LVL2_IND1.Parent = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/Name";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Product_Resolved_referenceOnly_normalized_structured/hasAttributes/Name");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
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
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_default/attributeContext/Product_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                        DataFormat = "String",
                        DisplayName = "Name",
                        Name = "Name",
                        SourceName = "Name",
                    });
                }
                List<AttributeExpectedValue> expected_normalized = new List<AttributeExpectedValue>();
                {
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_normalized/attributeContext/Product_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                        DataFormat = "String",
                        DisplayName = "Name",
                        Name = "Name",
                        SourceName = "Name",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly/attributeContext/Product_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                        DataFormat = "String",
                        DisplayName = "Name",
                        Name = "Name",
                        SourceName = "Name",
                    });
                }
                List<AttributeExpectedValue> expected_structured = new List<AttributeExpectedValue>();
                {
                    expected_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_structured/attributeContext/Product_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                        DataFormat = "String",
                        DisplayName = "Name",
                        Name = "Name",
                        SourceName = "Name",
                    });
                }
                List<AttributeExpectedValue> expected_normalized_structured = new List<AttributeExpectedValue>();
                {
                    expected_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_normalized_structured/attributeContext/Product_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                        DataFormat = "String",
                        DisplayName = "Name",
                        Name = "Name",
                        SourceName = "Name",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_normalized/attributeContext/Product_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                        DataFormat = "String",
                        DisplayName = "Name",
                        Name = "Name",
                        SourceName = "Name",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_structured = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_structured/attributeContext/Product_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                        DataFormat = "String",
                        DisplayName = "Name",
                        Name = "Name",
                        SourceName = "Name",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Product_Resolved_referenceOnly_normalized_structured/attributeContext/Product_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                        DataFormat = "String",
                        DisplayName = "Name",
                        Name = "Name",
                        SourceName = "Name",
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
            {
                string entityName = "Sales";

                AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
                {
                    expectedContext_default.Type = "entity";
                    expectedContext_default.Name = "Sales_Resolved_default";
                    expectedContext_default.Definition = "resolvedFrom/Sales";
                    expectedContext_default.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Sales_Resolved_default/attributeContext/Sales_Resolved_default";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Sales_Resolved_default/attributeContext/Sales_Resolved_default/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_default.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Sales_Resolved_default/attributeContext/Sales_Resolved_default";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "CustomerID";
                                attrCtx_LVL2_IND0.Parent = "Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/CustomerID";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Customer";
                                    attrCtx_LVL3_IND0.Parent = "Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Customer";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Parent = "Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeGroup";
                                            attrCtx_LVL5_IND0.Name = "attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Parent = "Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND0.Name = "ID";
                                                attrCtx_LVL6_IND0.Parent = "Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND0.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/ID";
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "Name";
                                                attrCtx_LVL6_IND1.Parent = "Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/Name";
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND1);
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
                                    attrCtx_LVL3_IND1.Parent = "Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID";
                                    attrCtx_LVL3_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "addedAttributeExpansionTotal";
                                        attrCtx_LVL4_IND0.Name = "CustomerCount";
                                        attrCtx_LVL4_IND0.Parent = "Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/_generatedAttributeSet";
                                        attrCtx_LVL4_IND0.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/CustomerID/resolutionGuidance/countAttribute/CustomerCount";
                                        attrCtx_LVL4_IND0.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND0.ContextStrings.Add("Sales_Resolved_default/hasAttributes/CustomerCount");
                                        }
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND0);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "ProductID";
                                attrCtx_LVL2_IND1.Parent = "Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/ProductID";
                                attrCtx_LVL2_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Product";
                                    attrCtx_LVL3_IND0.Parent = "Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Product";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Parent = "Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeGroup";
                                            attrCtx_LVL5_IND0.Name = "attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Parent = "Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND0.Name = "ID";
                                                attrCtx_LVL6_IND0.Parent = "Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND0.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID";
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "Name";
                                                attrCtx_LVL6_IND1.Parent = "Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/Name";
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND1);
                                        }
                                        attrCtx_LVL4_IND1.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND1);
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "generatedSet";
                                    attrCtx_LVL3_IND1.Name = "_generatedAttributeSet";
                                    attrCtx_LVL3_IND1.Parent = "Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID";
                                    attrCtx_LVL3_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "addedAttributeExpansionTotal";
                                        attrCtx_LVL4_IND0.Name = "ProductCount";
                                        attrCtx_LVL4_IND0.Parent = "Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/_generatedAttributeSet";
                                        attrCtx_LVL4_IND0.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/ProductID/resolutionGuidance/countAttribute/ProductCount";
                                        attrCtx_LVL4_IND0.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND0.ContextStrings.Add("Sales_Resolved_default/hasAttributes/ProductCount");
                                        }
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND0);
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_default.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
                {
                    expectedContext_normalized.Type = "entity";
                    expectedContext_normalized.Name = "Sales_Resolved_normalized";
                    expectedContext_normalized.Definition = "resolvedFrom/Sales";
                    expectedContext_normalized.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "CustomerID";
                                attrCtx_LVL2_IND0.Parent = "Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/CustomerID";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Customer";
                                    attrCtx_LVL3_IND0.Parent = "Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Customer";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Parent = "Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeGroup";
                                            attrCtx_LVL5_IND0.Name = "attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Parent = "Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND0.Name = "ID";
                                                attrCtx_LVL6_IND0.Parent = "Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND0.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/ID";
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "Name";
                                                attrCtx_LVL6_IND1.Parent = "Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/Name";
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
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "ProductID";
                                attrCtx_LVL2_IND1.Parent = "Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/ProductID";
                                attrCtx_LVL2_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Product";
                                    attrCtx_LVL3_IND0.Parent = "Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Product";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Parent = "Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeGroup";
                                            attrCtx_LVL5_IND0.Name = "attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Parent = "Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND0.Name = "ID";
                                                attrCtx_LVL6_IND0.Parent = "Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND0.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID";
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "Name";
                                                attrCtx_LVL6_IND1.Parent = "Sales_Resolved_normalized/attributeContext/Sales_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/Name";
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND1);
                                        }
                                        attrCtx_LVL4_IND1.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND1);
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly.Type = "entity";
                    expectedContext_referenceOnly.Name = "Sales_Resolved_referenceOnly";
                    expectedContext_referenceOnly.Definition = "resolvedFrom/Sales";
                    expectedContext_referenceOnly.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "CustomerID";
                                attrCtx_LVL2_IND0.Parent = "Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/CustomerID";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Customer";
                                    attrCtx_LVL3_IND0.Parent = "Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Customer";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "generatedSet";
                                    attrCtx_LVL3_IND1.Name = "_generatedAttributeSet";
                                    attrCtx_LVL3_IND1.Parent = "Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID";
                                    attrCtx_LVL3_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "addedAttributeExpansionTotal";
                                        attrCtx_LVL4_IND0.Name = "CustomerCount";
                                        attrCtx_LVL4_IND0.Parent = "Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/_generatedAttributeSet";
                                        attrCtx_LVL4_IND0.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/CustomerID/resolutionGuidance/countAttribute/CustomerCount";
                                        attrCtx_LVL4_IND0.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND0.ContextStrings.Add("Sales_Resolved_referenceOnly/hasAttributes/CustomerCount");
                                        }
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND0);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "ProductID";
                                attrCtx_LVL2_IND1.Parent = "Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/ProductID";
                                attrCtx_LVL2_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Product";
                                    attrCtx_LVL3_IND0.Parent = "Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Product";
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "generatedSet";
                                    attrCtx_LVL3_IND1.Name = "_generatedAttributeSet";
                                    attrCtx_LVL3_IND1.Parent = "Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID";
                                    attrCtx_LVL3_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "addedAttributeExpansionTotal";
                                        attrCtx_LVL4_IND0.Name = "ProductCount";
                                        attrCtx_LVL4_IND0.Parent = "Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/_generatedAttributeSet";
                                        attrCtx_LVL4_IND0.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/ProductID/resolutionGuidance/countAttribute/ProductCount";
                                        attrCtx_LVL4_IND0.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND0.ContextStrings.Add("Sales_Resolved_referenceOnly/hasAttributes/ProductCount");
                                        }
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND0);
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_structured.Type = "entity";
                    expectedContext_structured.Name = "Sales_Resolved_structured";
                    expectedContext_structured.Definition = "resolvedFrom/Sales";
                    expectedContext_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "CustomerID";
                                attrCtx_LVL2_IND0.Parent = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/CustomerID";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Customer";
                                    attrCtx_LVL3_IND0.Parent = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Customer";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Parent = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeGroup";
                                            attrCtx_LVL5_IND0.Name = "attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Parent = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND0.Name = "ID";
                                                attrCtx_LVL6_IND0.Parent = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND0.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/ID";
                                                attrCtx_LVL6_IND0.ContextStrings = new List<string>();
                                                {
                                                    attrCtx_LVL6_IND0.ContextStrings.Add("Sales_Resolved_structured/hasAttributes/CustomerID/members/ID");
                                                }
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "Name";
                                                attrCtx_LVL6_IND1.Parent = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/Name";
                                                attrCtx_LVL6_IND1.ContextStrings = new List<string>();
                                                {
                                                    attrCtx_LVL6_IND1.ContextStrings.Add("Sales_Resolved_structured/hasAttributes/CustomerID/members/Name");
                                                }
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
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "ProductID";
                                attrCtx_LVL2_IND1.Parent = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/ProductID";
                                attrCtx_LVL2_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Product";
                                    attrCtx_LVL3_IND0.Parent = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Product";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Parent = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeGroup";
                                            attrCtx_LVL5_IND0.Name = "attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Parent = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND0.Name = "ID";
                                                attrCtx_LVL6_IND0.Parent = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND0.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID";
                                                attrCtx_LVL6_IND0.ContextStrings = new List<string>();
                                                {
                                                    attrCtx_LVL6_IND0.ContextStrings.Add("Sales_Resolved_structured/hasAttributes/ProductID/members/ID");
                                                }
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "Name";
                                                attrCtx_LVL6_IND1.Parent = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/Name";
                                                attrCtx_LVL6_IND1.ContextStrings = new List<string>();
                                                {
                                                    attrCtx_LVL6_IND1.ContextStrings.Add("Sales_Resolved_structured/hasAttributes/ProductID/members/Name");
                                                }
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND1);
                                        }
                                        attrCtx_LVL4_IND1.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND1);
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
                    expectedContext_normalized_structured.Name = "Sales_Resolved_normalized_structured";
                    expectedContext_normalized_structured.Definition = "resolvedFrom/Sales";
                    expectedContext_normalized_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "CustomerID";
                                attrCtx_LVL2_IND0.Parent = "Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/CustomerID";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Customer";
                                    attrCtx_LVL3_IND0.Parent = "Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Customer";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Parent = "Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeGroup";
                                            attrCtx_LVL5_IND0.Name = "attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Parent = "Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND0.Name = "ID";
                                                attrCtx_LVL6_IND0.Parent = "Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND0.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/ID";
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "Name";
                                                attrCtx_LVL6_IND1.Parent = "Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Customer/hasAttributes/attributesAddedAtThisScope/members/Name";
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
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "ProductID";
                                attrCtx_LVL2_IND1.Parent = "Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/ProductID";
                                attrCtx_LVL2_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Product";
                                    attrCtx_LVL3_IND0.Parent = "Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Product";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Parent = "Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeGroup";
                                            attrCtx_LVL5_IND0.Name = "attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Parent = "Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND0.Name = "ID";
                                                attrCtx_LVL6_IND0.Parent = "Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND0.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/ID";
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "Name";
                                                attrCtx_LVL6_IND1.Parent = "Sales_Resolved_normalized_structured/attributeContext/Sales_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Product/hasAttributes/attributesAddedAtThisScope/members/Name";
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND1);
                                        }
                                        attrCtx_LVL4_IND1.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND1);
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
                    expectedContext_referenceOnly_normalized.Name = "Sales_Resolved_referenceOnly_normalized";
                    expectedContext_referenceOnly_normalized.Definition = "resolvedFrom/Sales";
                    expectedContext_referenceOnly_normalized.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Sales_Resolved_referenceOnly_normalized/attributeContext/Sales_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Sales_Resolved_referenceOnly_normalized/attributeContext/Sales_Resolved_referenceOnly_normalized/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Sales_Resolved_referenceOnly_normalized/attributeContext/Sales_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Sales_Resolved_referenceOnly_normalized/attributeContext/Sales_Resolved_referenceOnly_normalized/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "CustomerID";
                                attrCtx_LVL2_IND0.Parent = "Sales_Resolved_referenceOnly_normalized/attributeContext/Sales_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/CustomerID";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Customer";
                                    attrCtx_LVL3_IND0.Parent = "Sales_Resolved_referenceOnly_normalized/attributeContext/Sales_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Customer";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "ProductID";
                                attrCtx_LVL2_IND1.Parent = "Sales_Resolved_referenceOnly_normalized/attributeContext/Sales_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/ProductID";
                                attrCtx_LVL2_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Product";
                                    attrCtx_LVL3_IND0.Parent = "Sales_Resolved_referenceOnly_normalized/attributeContext/Sales_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Product";
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly_structured.Type = "entity";
                    expectedContext_referenceOnly_structured.Name = "Sales_Resolved_referenceOnly_structured";
                    expectedContext_referenceOnly_structured.Definition = "resolvedFrom/Sales";
                    expectedContext_referenceOnly_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "CustomerID";
                                attrCtx_LVL2_IND0.Parent = "Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/CustomerID";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Customer";
                                    attrCtx_LVL3_IND0.Parent = "Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Customer";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "generatedSet";
                                    attrCtx_LVL3_IND1.Name = "_generatedAttributeSet";
                                    attrCtx_LVL3_IND1.Parent = "Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID";
                                    attrCtx_LVL3_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "generatedRound";
                                        attrCtx_LVL4_IND0.Name = "_generatedAttributeRound0";
                                        attrCtx_LVL4_IND0.Parent = "Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/_generatedAttributeSet";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "addedAttributeIdentity";
                                            attrCtx_LVL5_IND0.Name = "_foreignKey";
                                            attrCtx_LVL5_IND0.Parent = "Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND0.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND0.ContextStrings.Add("Sales_Resolved_referenceOnly_structured/hasAttributes/CustomerID/members/CustomerID");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND0);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "ProductID";
                                attrCtx_LVL2_IND1.Parent = "Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/ProductID";
                                attrCtx_LVL2_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Product";
                                    attrCtx_LVL3_IND0.Parent = "Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Product";
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "generatedSet";
                                    attrCtx_LVL3_IND1.Name = "_generatedAttributeSet";
                                    attrCtx_LVL3_IND1.Parent = "Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID";
                                    attrCtx_LVL3_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "generatedRound";
                                        attrCtx_LVL4_IND0.Name = "_generatedAttributeRound0";
                                        attrCtx_LVL4_IND0.Parent = "Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/_generatedAttributeSet";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "addedAttributeIdentity";
                                            attrCtx_LVL5_IND0.Name = "_foreignKey";
                                            attrCtx_LVL5_IND0.Parent = "Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND0.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND0.ContextStrings.Add("Sales_Resolved_referenceOnly_structured/hasAttributes/ProductID/members/ProductID");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND0);
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly_normalized_structured.Type = "entity";
                    expectedContext_referenceOnly_normalized_structured.Name = "Sales_Resolved_referenceOnly_normalized_structured";
                    expectedContext_referenceOnly_normalized_structured.Definition = "resolvedFrom/Sales";
                    expectedContext_referenceOnly_normalized_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Sales_Resolved_referenceOnly_normalized_structured/attributeContext/Sales_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Sales_Resolved_referenceOnly_normalized_structured/attributeContext/Sales_Resolved_referenceOnly_normalized_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Sales_Resolved_referenceOnly_normalized_structured/attributeContext/Sales_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Sales_Resolved_referenceOnly_normalized_structured/attributeContext/Sales_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "CustomerID";
                                attrCtx_LVL2_IND0.Parent = "Sales_Resolved_referenceOnly_normalized_structured/attributeContext/Sales_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/CustomerID";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Customer";
                                    attrCtx_LVL3_IND0.Parent = "Sales_Resolved_referenceOnly_normalized_structured/attributeContext/Sales_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Customer";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "ProductID";
                                attrCtx_LVL2_IND1.Parent = "Sales_Resolved_referenceOnly_normalized_structured/attributeContext/Sales_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Sales/hasAttributes/attributesAddedAtThisScope/members/ProductID";
                                attrCtx_LVL2_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Product";
                                    attrCtx_LVL3_IND0.Parent = "Sales_Resolved_referenceOnly_normalized_structured/attributeContext/Sales_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Product";
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }

                List<AttributeExpectedValue> expected_default = new List<AttributeExpectedValue>();
                {
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/_generatedAttributeSet/CustomerCount",
                        DataFormat = "Int32",
                        Name = "CustomerCount",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Sales_Resolved_default/attributeContext/Sales_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/_generatedAttributeSet/ProductCount",
                        DataFormat = "Int32",
                        Name = "ProductCount",
                    });
                }
                List<AttributeExpectedValue> expected_normalized = new List<AttributeExpectedValue>();
                {
                }
                List<AttributeExpectedValue> expected_referenceOnly = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/_generatedAttributeSet/CustomerCount",
                        DataFormat = "Int32",
                        Name = "CustomerCount",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Sales_Resolved_referenceOnly/attributeContext/Sales_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/_generatedAttributeSet/ProductCount",
                        DataFormat = "Int32",
                        Name = "ProductCount",
                    });
                }
                List<AttributeExpectedValue> expected_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef1 = new AttributeExpectedValue();
                    {
                        AttribGroupRef1.AttributeGroupName = "CustomerID";
                        AttribGroupRef1.AttributeContext = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID";
                        AttribGroupRef1.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef1.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                            DataFormat = "Guid",
                            Name = "ID",
                        });
                        AttribGroupRef1.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/Customer/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                            DataFormat = "String",
                            Name = "Name",
                        });
                        expected_structured.Add(AttribGroupRef1);
                    };
                    AttributeExpectedValue AttribGroupRef2 = new AttributeExpectedValue();
                    {
                        AttribGroupRef2.AttributeGroupName = "ProductID";
                        AttribGroupRef2.AttributeContext = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID";
                        AttribGroupRef2.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef2.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                            DataFormat = "Guid",
                            Name = "ID",
                        });
                        AttribGroupRef2.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "Sales_Resolved_structured/attributeContext/Sales_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/Product/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                            DataFormat = "String",
                            Name = "Name",
                        });
                        expected_structured.Add(AttribGroupRef2);
                    };
                }
                List<AttributeExpectedValue> expected_normalized_structured = new List<AttributeExpectedValue>();
                {
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized = new List<AttributeExpectedValue>();
                {
                }
                List<AttributeExpectedValue> expected_referenceOnly_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef1 = new AttributeExpectedValue();
                    {
                        AttribGroupRef1.AttributeGroupName = "CustomerID";
                        AttribGroupRef1.AttributeContext = "Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID";
                        AttribGroupRef1.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef1.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/CustomerID/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey",
                            DataFormat = "Guid",
                            Description = "",
                            DisplayName = "CustomerID",
                            Name = "CustomerID",
                            SourceName = "CustomerID",
                        });
                        expected_referenceOnly_structured.Add(AttribGroupRef1);
                    };
                    AttributeExpectedValue AttribGroupRef2 = new AttributeExpectedValue();
                    {
                        AttribGroupRef2.AttributeGroupName = "ProductID";
                        AttribGroupRef2.AttributeContext = "Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID";
                        AttribGroupRef2.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef2.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "Sales_Resolved_referenceOnly_structured/attributeContext/Sales_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ProductID/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey",
                            DataFormat = "Guid",
                            Description = "",
                            DisplayName = "ProductID",
                            Name = "ProductID",
                            SourceName = "ProductID",
                        });
                        expected_referenceOnly_structured.Add(AttribGroupRef2);
                    };
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new List<AttributeExpectedValue>();
                {
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
        /// Resolution Guidance Test - One:Many Cardinality
        /// </summary>
        [TestMethod]
        public async Task TestForeignKeyOneToManyCardinality()
        {
            string testName = "TestForeignKeyOneToManyCardinality";
            {
                string entityName = "Team";

                AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
                {
                    expectedContext_default.Type = "entity";
                    expectedContext_default.Name = "Team_Resolved_default";
                    expectedContext_default.Definition = "resolvedFrom/Team";
                    expectedContext_default.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Team_Resolved_default/attributeContext/Team_Resolved_default";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Team_Resolved_default/attributeContext/Team_Resolved_default/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_default.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Team_Resolved_default/attributeContext/Team_Resolved_default";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Team_Resolved_default/attributeContext/Team_Resolved_default/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Team_Resolved_default/attributeContext/Team_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Team_Resolved_default/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "Name";
                                attrCtx_LVL2_IND1.Parent = "Team_Resolved_default/attributeContext/Team_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Team_Resolved_default/hasAttributes/Name");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_default.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
                {
                    expectedContext_normalized.Type = "entity";
                    expectedContext_normalized.Name = "Team_Resolved_normalized";
                    expectedContext_normalized.Definition = "resolvedFrom/Team";
                    expectedContext_normalized.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Team_Resolved_normalized/attributeContext/Team_Resolved_normalized";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Team_Resolved_normalized/attributeContext/Team_Resolved_normalized/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Team_Resolved_normalized/attributeContext/Team_Resolved_normalized";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Team_Resolved_normalized/attributeContext/Team_Resolved_normalized/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Team_Resolved_normalized/attributeContext/Team_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Team_Resolved_normalized/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "Name";
                                attrCtx_LVL2_IND1.Parent = "Team_Resolved_normalized/attributeContext/Team_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Team_Resolved_normalized/hasAttributes/Name");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly.Type = "entity";
                    expectedContext_referenceOnly.Name = "Team_Resolved_referenceOnly";
                    expectedContext_referenceOnly.Definition = "resolvedFrom/Team";
                    expectedContext_referenceOnly.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Team_Resolved_referenceOnly/attributeContext/Team_Resolved_referenceOnly";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Team_Resolved_referenceOnly/attributeContext/Team_Resolved_referenceOnly/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Team_Resolved_referenceOnly/attributeContext/Team_Resolved_referenceOnly";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Team_Resolved_referenceOnly/attributeContext/Team_Resolved_referenceOnly/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Team_Resolved_referenceOnly/attributeContext/Team_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Team_Resolved_referenceOnly/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "Name";
                                attrCtx_LVL2_IND1.Parent = "Team_Resolved_referenceOnly/attributeContext/Team_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Team_Resolved_referenceOnly/hasAttributes/Name");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_structured.Type = "entity";
                    expectedContext_structured.Name = "Team_Resolved_structured";
                    expectedContext_structured.Definition = "resolvedFrom/Team";
                    expectedContext_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Team_Resolved_structured/attributeContext/Team_Resolved_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Team_Resolved_structured/attributeContext/Team_Resolved_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Team_Resolved_structured/attributeContext/Team_Resolved_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Team_Resolved_structured/attributeContext/Team_Resolved_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Team_Resolved_structured/attributeContext/Team_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Team_Resolved_structured/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "Name";
                                attrCtx_LVL2_IND1.Parent = "Team_Resolved_structured/attributeContext/Team_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Team_Resolved_structured/hasAttributes/Name");
                                }
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
                    expectedContext_normalized_structured.Name = "Team_Resolved_normalized_structured";
                    expectedContext_normalized_structured.Definition = "resolvedFrom/Team";
                    expectedContext_normalized_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Team_Resolved_normalized_structured/attributeContext/Team_Resolved_normalized_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Team_Resolved_normalized_structured/attributeContext/Team_Resolved_normalized_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Team_Resolved_normalized_structured/attributeContext/Team_Resolved_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Team_Resolved_normalized_structured/attributeContext/Team_Resolved_normalized_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Team_Resolved_normalized_structured/attributeContext/Team_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Team_Resolved_normalized_structured/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "Name";
                                attrCtx_LVL2_IND1.Parent = "Team_Resolved_normalized_structured/attributeContext/Team_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Team_Resolved_normalized_structured/hasAttributes/Name");
                                }
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
                    expectedContext_referenceOnly_normalized.Name = "Team_Resolved_referenceOnly_normalized";
                    expectedContext_referenceOnly_normalized.Definition = "resolvedFrom/Team";
                    expectedContext_referenceOnly_normalized.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Team_Resolved_referenceOnly_normalized/attributeContext/Team_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Team_Resolved_referenceOnly_normalized/attributeContext/Team_Resolved_referenceOnly_normalized/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Team_Resolved_referenceOnly_normalized/attributeContext/Team_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Team_Resolved_referenceOnly_normalized/attributeContext/Team_Resolved_referenceOnly_normalized/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Team_Resolved_referenceOnly_normalized/attributeContext/Team_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Team_Resolved_referenceOnly_normalized/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "Name";
                                attrCtx_LVL2_IND1.Parent = "Team_Resolved_referenceOnly_normalized/attributeContext/Team_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Team_Resolved_referenceOnly_normalized/hasAttributes/Name");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly_structured.Type = "entity";
                    expectedContext_referenceOnly_structured.Name = "Team_Resolved_referenceOnly_structured";
                    expectedContext_referenceOnly_structured.Definition = "resolvedFrom/Team";
                    expectedContext_referenceOnly_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Team_Resolved_referenceOnly_structured/attributeContext/Team_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Team_Resolved_referenceOnly_structured/attributeContext/Team_Resolved_referenceOnly_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Team_Resolved_referenceOnly_structured/attributeContext/Team_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Team_Resolved_referenceOnly_structured/attributeContext/Team_Resolved_referenceOnly_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Team_Resolved_referenceOnly_structured/attributeContext/Team_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Team_Resolved_referenceOnly_structured/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "Name";
                                attrCtx_LVL2_IND1.Parent = "Team_Resolved_referenceOnly_structured/attributeContext/Team_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Team_Resolved_referenceOnly_structured/hasAttributes/Name");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly_normalized_structured.Type = "entity";
                    expectedContext_referenceOnly_normalized_structured.Name = "Team_Resolved_referenceOnly_normalized_structured";
                    expectedContext_referenceOnly_normalized_structured.Definition = "resolvedFrom/Team";
                    expectedContext_referenceOnly_normalized_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Team_Resolved_referenceOnly_normalized_structured/attributeContext/Team_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Team_Resolved_referenceOnly_normalized_structured/attributeContext/Team_Resolved_referenceOnly_normalized_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Team_Resolved_referenceOnly_normalized_structured/attributeContext/Team_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Team_Resolved_referenceOnly_normalized_structured/attributeContext/Team_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Team_Resolved_referenceOnly_normalized_structured/attributeContext/Team_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Team_Resolved_referenceOnly_normalized_structured/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "Name";
                                attrCtx_LVL2_IND1.Parent = "Team_Resolved_referenceOnly_normalized_structured/attributeContext/Team_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Team_Resolved_referenceOnly_normalized_structured/hasAttributes/Name");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }

                List<AttributeExpectedValue> expected_default = new List<AttributeExpectedValue>();
                {
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Team_Resolved_default/attributeContext/Team_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Team_Resolved_default/attributeContext/Team_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                        DataFormat = "String",
                        DisplayName = "Name",
                        Name = "Name",
                        SourceName = "Name",
                    });
                }
                List<AttributeExpectedValue> expected_normalized = new List<AttributeExpectedValue>();
                {
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Team_Resolved_normalized/attributeContext/Team_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Team_Resolved_normalized/attributeContext/Team_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                        DataFormat = "String",
                        DisplayName = "Name",
                        Name = "Name",
                        SourceName = "Name",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Team_Resolved_referenceOnly/attributeContext/Team_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Team_Resolved_referenceOnly/attributeContext/Team_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                        DataFormat = "String",
                        DisplayName = "Name",
                        Name = "Name",
                        SourceName = "Name",
                    });
                }
                List<AttributeExpectedValue> expected_structured = new List<AttributeExpectedValue>();
                {
                    expected_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Team_Resolved_structured/attributeContext/Team_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Team_Resolved_structured/attributeContext/Team_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                        DataFormat = "String",
                        DisplayName = "Name",
                        Name = "Name",
                        SourceName = "Name",
                    });
                }
                List<AttributeExpectedValue> expected_normalized_structured = new List<AttributeExpectedValue>();
                {
                    expected_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Team_Resolved_normalized_structured/attributeContext/Team_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Team_Resolved_normalized_structured/attributeContext/Team_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                        DataFormat = "String",
                        DisplayName = "Name",
                        Name = "Name",
                        SourceName = "Name",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Team_Resolved_referenceOnly_normalized/attributeContext/Team_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Team_Resolved_referenceOnly_normalized/attributeContext/Team_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                        DataFormat = "String",
                        DisplayName = "Name",
                        Name = "Name",
                        SourceName = "Name",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_structured = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Team_Resolved_referenceOnly_structured/attributeContext/Team_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Team_Resolved_referenceOnly_structured/attributeContext/Team_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                        DataFormat = "String",
                        DisplayName = "Name",
                        Name = "Name",
                        SourceName = "Name",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Team_Resolved_referenceOnly_normalized_structured/attributeContext/Team_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Team_Resolved_referenceOnly_normalized_structured/attributeContext/Team_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                        DataFormat = "String",
                        DisplayName = "Name",
                        Name = "Name",
                        SourceName = "Name",
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
            {
                string entityName = "Employee";

                AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
                {
                    expectedContext_default.Type = "entity";
                    expectedContext_default.Name = "Employee_Resolved_default";
                    expectedContext_default.Definition = "resolvedFrom/Employee";
                    expectedContext_default.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Employee_Resolved_default/attributeContext/Employee_Resolved_default";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Employee_Resolved_default/attributeContext/Employee_Resolved_default/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_default.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Employee_Resolved_default/attributeContext/Employee_Resolved_default";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Employee_Resolved_default/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "FullName";
                                attrCtx_LVL2_IND1.Parent = "Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Employee_Resolved_default/hasAttributes/FullName");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "TeamID";
                                attrCtx_LVL2_IND2.Parent = "Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID";
                                attrCtx_LVL2_IND2.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Team";
                                    attrCtx_LVL3_IND0.Parent = "Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Team";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Parent = "Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeGroup";
                                            attrCtx_LVL5_IND0.Name = "attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Parent = "Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND0.Name = "ID";
                                                attrCtx_LVL6_IND0.Parent = "Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND0.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID";
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "Name";
                                                attrCtx_LVL6_IND1.Parent = "Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name";
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND1);
                                        }
                                        attrCtx_LVL4_IND1.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND1);
                                }
                                attrCtx_LVL2_IND2.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "generatedSet";
                                    attrCtx_LVL3_IND1.Name = "_generatedAttributeSet";
                                    attrCtx_LVL3_IND1.Parent = "Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID";
                                    attrCtx_LVL3_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "addedAttributeExpansionTotal";
                                        attrCtx_LVL4_IND0.Name = "TeamIDTeamCount";
                                        attrCtx_LVL4_IND0.Parent = "Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet";
                                        attrCtx_LVL4_IND0.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID/resolutionGuidance/countAttribute/TeamCount";
                                        attrCtx_LVL4_IND0.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND0.ContextStrings.Add("Employee_Resolved_default/hasAttributes/TeamIDTeamCount");
                                        }
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND0);
                                }
                                attrCtx_LVL2_IND2.Contexts.Add(attrCtx_LVL3_IND1);
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
                    expectedContext_normalized.Name = "Employee_Resolved_normalized";
                    expectedContext_normalized.Definition = "resolvedFrom/Employee";
                    expectedContext_normalized.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "TeamID";
                                attrCtx_LVL2_IND0.Parent = "Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Team";
                                    attrCtx_LVL3_IND0.Parent = "Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Team";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Parent = "Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeGroup";
                                            attrCtx_LVL5_IND0.Name = "attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Parent = "Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND0.Name = "ID";
                                                attrCtx_LVL6_IND0.Parent = "Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND0.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID";
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "Name";
                                                attrCtx_LVL6_IND1.Parent = "Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name";
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
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "ID";
                                attrCtx_LVL2_IND1.Parent = "Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Employee_Resolved_normalized/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "FullName";
                                attrCtx_LVL2_IND2.Parent = "Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName";
                                attrCtx_LVL2_IND2.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND2.ContextStrings.Add("Employee_Resolved_normalized/hasAttributes/FullName");
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
                    expectedContext_referenceOnly.Name = "Employee_Resolved_referenceOnly";
                    expectedContext_referenceOnly.Definition = "resolvedFrom/Employee";
                    expectedContext_referenceOnly.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Employee_Resolved_referenceOnly/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "FullName";
                                attrCtx_LVL2_IND1.Parent = "Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Employee_Resolved_referenceOnly/hasAttributes/FullName");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "TeamID";
                                attrCtx_LVL2_IND2.Parent = "Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID";
                                attrCtx_LVL2_IND2.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Team";
                                    attrCtx_LVL3_IND0.Parent = "Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Team";
                                }
                                attrCtx_LVL2_IND2.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "generatedSet";
                                    attrCtx_LVL3_IND1.Name = "_generatedAttributeSet";
                                    attrCtx_LVL3_IND1.Parent = "Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID";
                                    attrCtx_LVL3_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "addedAttributeExpansionTotal";
                                        attrCtx_LVL4_IND0.Name = "TeamIDTeamCount";
                                        attrCtx_LVL4_IND0.Parent = "Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet";
                                        attrCtx_LVL4_IND0.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID/resolutionGuidance/countAttribute/TeamCount";
                                        attrCtx_LVL4_IND0.ContextStrings = new List<string>();
                                        {
                                            attrCtx_LVL4_IND0.ContextStrings.Add("Employee_Resolved_referenceOnly/hasAttributes/TeamIDTeamCount");
                                        }
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND0);
                                }
                                attrCtx_LVL2_IND2.Contexts.Add(attrCtx_LVL3_IND1);
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
                    expectedContext_structured.Name = "Employee_Resolved_structured";
                    expectedContext_structured.Definition = "resolvedFrom/Employee";
                    expectedContext_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Employee_Resolved_structured/attributeContext/Employee_Resolved_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Employee_Resolved_structured/attributeContext/Employee_Resolved_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Employee_Resolved_structured/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "FullName";
                                attrCtx_LVL2_IND1.Parent = "Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Employee_Resolved_structured/hasAttributes/FullName");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "TeamID";
                                attrCtx_LVL2_IND2.Parent = "Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID";
                                attrCtx_LVL2_IND2.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Team";
                                    attrCtx_LVL3_IND0.Parent = "Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Team";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Parent = "Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeGroup";
                                            attrCtx_LVL5_IND0.Name = "attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Parent = "Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND0.Name = "ID";
                                                attrCtx_LVL6_IND0.Parent = "Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND0.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID";
                                                attrCtx_LVL6_IND0.ContextStrings = new List<string>();
                                                {
                                                    attrCtx_LVL6_IND0.ContextStrings.Add("Employee_Resolved_structured/hasAttributes/TeamID/members/ID");
                                                }
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "Name";
                                                attrCtx_LVL6_IND1.Parent = "Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name";
                                                attrCtx_LVL6_IND1.ContextStrings = new List<string>();
                                                {
                                                    attrCtx_LVL6_IND1.ContextStrings.Add("Employee_Resolved_structured/hasAttributes/TeamID/members/Name");
                                                }
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND1);
                                        }
                                        attrCtx_LVL4_IND1.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND1);
                                }
                                attrCtx_LVL2_IND2.Contexts.Add(attrCtx_LVL3_IND0);
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
                    expectedContext_normalized_structured.Name = "Employee_Resolved_normalized_structured";
                    expectedContext_normalized_structured.Definition = "resolvedFrom/Employee";
                    expectedContext_normalized_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "TeamID";
                                attrCtx_LVL2_IND0.Parent = "Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Team";
                                    attrCtx_LVL3_IND0.Parent = "Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Team";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Parent = "Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeGroup";
                                            attrCtx_LVL5_IND0.Name = "attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Parent = "Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND0.Name = "ID";
                                                attrCtx_LVL6_IND0.Parent = "Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND0.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/ID";
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "Name";
                                                attrCtx_LVL6_IND1.Parent = "Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Team/hasAttributes/attributesAddedAtThisScope/members/Name";
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
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "ID";
                                attrCtx_LVL2_IND1.Parent = "Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Employee_Resolved_normalized_structured/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "FullName";
                                attrCtx_LVL2_IND2.Parent = "Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName";
                                attrCtx_LVL2_IND2.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND2.ContextStrings.Add("Employee_Resolved_normalized_structured/hasAttributes/FullName");
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
                    expectedContext_referenceOnly_normalized.Name = "Employee_Resolved_referenceOnly_normalized";
                    expectedContext_referenceOnly_normalized.Definition = "resolvedFrom/Employee";
                    expectedContext_referenceOnly_normalized.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "TeamID";
                                attrCtx_LVL2_IND0.Parent = "Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Team";
                                    attrCtx_LVL3_IND0.Parent = "Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Team";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "ID";
                                attrCtx_LVL2_IND1.Parent = "Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Employee_Resolved_referenceOnly_normalized/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "FullName";
                                attrCtx_LVL2_IND2.Parent = "Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName";
                                attrCtx_LVL2_IND2.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND2.ContextStrings.Add("Employee_Resolved_referenceOnly_normalized/hasAttributes/FullName");
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
                    expectedContext_referenceOnly_structured.Name = "Employee_Resolved_referenceOnly_structured";
                    expectedContext_referenceOnly_structured.Definition = "resolvedFrom/Employee";
                    expectedContext_referenceOnly_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "ID";
                                attrCtx_LVL2_IND0.Parent = "Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("Employee_Resolved_referenceOnly_structured/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "FullName";
                                attrCtx_LVL2_IND1.Parent = "Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Employee_Resolved_referenceOnly_structured/hasAttributes/FullName");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "TeamID";
                                attrCtx_LVL2_IND2.Parent = "Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID";
                                attrCtx_LVL2_IND2.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Team";
                                    attrCtx_LVL3_IND0.Parent = "Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Team";
                                }
                                attrCtx_LVL2_IND2.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "generatedSet";
                                    attrCtx_LVL3_IND1.Name = "_generatedAttributeSet";
                                    attrCtx_LVL3_IND1.Parent = "Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID";
                                    attrCtx_LVL3_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "generatedRound";
                                        attrCtx_LVL4_IND0.Name = "_generatedAttributeRound0";
                                        attrCtx_LVL4_IND0.Parent = "Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "addedAttributeIdentity";
                                            attrCtx_LVL5_IND0.Name = "_foreignKey";
                                            attrCtx_LVL5_IND0.Parent = "Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND0.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND0.ContextStrings.Add("Employee_Resolved_referenceOnly_structured/hasAttributes/TeamID/members/TeamID");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND0);
                                }
                                attrCtx_LVL2_IND2.Contexts.Add(attrCtx_LVL3_IND1);
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
                    expectedContext_referenceOnly_normalized_structured.Name = "Employee_Resolved_referenceOnly_normalized_structured";
                    expectedContext_referenceOnly_normalized_structured.Definition = "resolvedFrom/Employee";
                    expectedContext_referenceOnly_normalized_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "TeamID";
                                attrCtx_LVL2_IND0.Parent = "Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/TeamID";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Team";
                                    attrCtx_LVL3_IND0.Parent = "Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Team";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "ID";
                                attrCtx_LVL2_IND1.Parent = "Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/ID";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/ID");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "FullName";
                                attrCtx_LVL2_IND2.Parent = "Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/Employee/hasAttributes/attributesAddedAtThisScope/members/FullName";
                                attrCtx_LVL2_IND2.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND2.ContextStrings.Add("Employee_Resolved_referenceOnly_normalized_structured/hasAttributes/FullName");
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
                        AttributeContext = "Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName",
                        DataFormat = "String",
                        DisplayName = "FullName",
                        Name = "FullName",
                        SourceName = "FullName",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Employee_Resolved_default/attributeContext/Employee_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet/TeamIDTeamCount",
                        DataFormat = "Int32",
                        Name = "TeamIDTeamCount",
                    });
                }
                List<AttributeExpectedValue> expected_normalized = new List<AttributeExpectedValue>();
                {
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Employee_Resolved_normalized/attributeContext/Employee_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName",
                        DataFormat = "String",
                        DisplayName = "FullName",
                        Name = "FullName",
                        SourceName = "FullName",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName",
                        DataFormat = "String",
                        DisplayName = "FullName",
                        Name = "FullName",
                        SourceName = "FullName",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Employee_Resolved_referenceOnly/attributeContext/Employee_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet/TeamIDTeamCount",
                        DataFormat = "Int32",
                        Name = "TeamIDTeamCount",
                    });
                }
                List<AttributeExpectedValue> expected_structured = new List<AttributeExpectedValue>();
                {
                    expected_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName",
                        DataFormat = "String",
                        DisplayName = "FullName",
                        Name = "FullName",
                        SourceName = "FullName",
                    });
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "TeamID";
                        AttribGroupRef.AttributeContext = "Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                            DataFormat = "Guid",
                            Name = "ID",
                        });
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "Employee_Resolved_structured/attributeContext/Employee_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/Team/attributesAddedAtThisScope/attributesAddedAtThisScope/Name",
                            DataFormat = "String",
                            Name = "Name",
                        });
                        expected_structured.Add(AttribGroupRef);
                    };
                }
                List<AttributeExpectedValue> expected_normalized_structured = new List<AttributeExpectedValue>();
                {
                    expected_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Employee_Resolved_normalized_structured/attributeContext/Employee_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName",
                        DataFormat = "String",
                        DisplayName = "FullName",
                        Name = "FullName",
                        SourceName = "FullName",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Employee_Resolved_referenceOnly_normalized/attributeContext/Employee_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName",
                        DataFormat = "String",
                        DisplayName = "FullName",
                        Name = "FullName",
                        SourceName = "FullName",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_structured = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName",
                        DataFormat = "String",
                        DisplayName = "FullName",
                        Name = "FullName",
                        SourceName = "FullName",
                    });
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "TeamID";
                        AttribGroupRef.AttributeContext = "Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "Employee_Resolved_referenceOnly_structured/attributeContext/Employee_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/TeamID/_generatedAttributeSet/_generatedAttributeRound0/_foreignKey",
                            DataFormat = "Guid",
                            Description = "",
                            DisplayName = "TeamID",
                            Name = "TeamID",
                            SourceName = "TeamID",
                        });
                        expected_referenceOnly_structured.Add(AttribGroupRef);
                    };
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/ID",
                        DataFormat = "Guid",
                        DisplayName = "ID",
                        IsPrimaryKey = true,
                        Name = "ID",
                        SourceName = "ID",
                    });
                    expected_referenceOnly_normalized_structured.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "Employee_Resolved_referenceOnly_normalized_structured/attributeContext/Employee_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/FullName",
                        DataFormat = "String",
                        DisplayName = "FullName",
                        Name = "FullName",
                        SourceName = "FullName",
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

