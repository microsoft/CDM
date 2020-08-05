// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Tests.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    [TestClass]
    public class ResolutionGuidanceExpansionAndRenameTest : CommonTest
    {

        /// <summary>
        /// Resolution Guidance Test - Expansion & Rename - Ordinal With AttributeGroupRef
        /// </summary>
        [TestMethod]
        public async Task TestExpansionAndRenamedOrdinalWithAttributeGroupRef()
        {
            string testName = "TestExpansionAndRenamedOrdinalWithAttributeGroupRef";
            {
                string entityName = "EmployeeAddresses";

                AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
                {
                    expectedContext_default.Type = "entity";
                    expectedContext_default.Name = "EmployeeAddresses_Resolved_default";
                    expectedContext_default.Definition = "resolvedFrom/EmployeeAddresses";
                    expectedContext_default.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_default.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "EmployeeAddress";
                                attrCtx_LVL2_IND0.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope/members/EmployeeAddress";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Address";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Address";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeGroup";
                                            attrCtx_LVL5_IND0.Name = "attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND0.Name = "City";
                                                attrCtx_LVL6_IND0.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND0.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City";
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "State";
                                                attrCtx_LVL6_IND1.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State";
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
                                    attrCtx_LVL3_IND1.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress";
                                    attrCtx_LVL3_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "generatedRound";
                                        attrCtx_LVL4_IND0.Name = "_generatedAttributeRound0";
                                        attrCtx_LVL4_IND0.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeDefinition";
                                            attrCtx_LVL5_IND0.Name = "EmployeeAddress1City";
                                            attrCtx_LVL5_IND0.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City";
                                            attrCtx_LVL5_IND0.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress1City");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL5_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND1.Type = "attributeDefinition";
                                            attrCtx_LVL5_IND1.Name = "EmployeeAddress1State";
                                            attrCtx_LVL5_IND1.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND1.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State";
                                            attrCtx_LVL5_IND1.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress1State");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND1);
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "generatedRound";
                                        attrCtx_LVL4_IND1.Name = "_generatedAttributeRound1";
                                        attrCtx_LVL4_IND1.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeDefinition";
                                            attrCtx_LVL5_IND0.Name = "EmployeeAddress2City";
                                            attrCtx_LVL5_IND0.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City";
                                            attrCtx_LVL5_IND0.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress2City");
                                            }
                                        }
                                        attrCtx_LVL4_IND1.Contexts.Add(attrCtx_LVL5_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL5_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND1.Type = "attributeDefinition";
                                            attrCtx_LVL5_IND1.Name = "EmployeeAddress2State";
                                            attrCtx_LVL5_IND1.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1";
                                            attrCtx_LVL5_IND1.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State";
                                            attrCtx_LVL5_IND1.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress2State");
                                            }
                                        }
                                        attrCtx_LVL4_IND1.Contexts.Add(attrCtx_LVL5_IND1);
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND1);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_default.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
                {
                    expectedContext_normalized.Type = "entity";
                    expectedContext_normalized.Name = "EmployeeAddresses_Resolved_normalized";
                    expectedContext_normalized.Definition = "resolvedFrom/EmployeeAddresses";
                    expectedContext_normalized.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "EmployeeAddress";
                                attrCtx_LVL2_IND0.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope/members/EmployeeAddress";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Address";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Address";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeGroup";
                                            attrCtx_LVL5_IND0.Name = "attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND0.Name = "City";
                                                attrCtx_LVL6_IND0.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND0.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City";
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "State";
                                                attrCtx_LVL6_IND1.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State";
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
                                    attrCtx_LVL3_IND1.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress";
                                    attrCtx_LVL3_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "generatedRound";
                                        attrCtx_LVL4_IND0.Name = "_generatedAttributeRound0";
                                        attrCtx_LVL4_IND0.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeDefinition";
                                            attrCtx_LVL5_IND0.Name = "EmployeeAddress1City";
                                            attrCtx_LVL5_IND0.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City";
                                            attrCtx_LVL5_IND0.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress1City");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL5_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND1.Type = "attributeDefinition";
                                            attrCtx_LVL5_IND1.Name = "EmployeeAddress1State";
                                            attrCtx_LVL5_IND1.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND1.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State";
                                            attrCtx_LVL5_IND1.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress1State");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND1);
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "generatedRound";
                                        attrCtx_LVL4_IND1.Name = "_generatedAttributeRound1";
                                        attrCtx_LVL4_IND1.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeDefinition";
                                            attrCtx_LVL5_IND0.Name = "EmployeeAddress2City";
                                            attrCtx_LVL5_IND0.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City";
                                            attrCtx_LVL5_IND0.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress2City");
                                            }
                                        }
                                        attrCtx_LVL4_IND1.Contexts.Add(attrCtx_LVL5_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL5_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND1.Type = "attributeDefinition";
                                            attrCtx_LVL5_IND1.Name = "EmployeeAddress2State";
                                            attrCtx_LVL5_IND1.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1";
                                            attrCtx_LVL5_IND1.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State";
                                            attrCtx_LVL5_IND1.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress2State");
                                            }
                                        }
                                        attrCtx_LVL4_IND1.Contexts.Add(attrCtx_LVL5_IND1);
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND1);
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly.Type = "entity";
                    expectedContext_referenceOnly.Name = "EmployeeAddresses_Resolved_referenceOnly";
                    expectedContext_referenceOnly.Definition = "resolvedFrom/EmployeeAddresses";
                    expectedContext_referenceOnly.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "EmployeeAddress";
                                attrCtx_LVL2_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope/members/EmployeeAddress";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Address";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Address";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeGroup";
                                            attrCtx_LVL5_IND0.Name = "attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND0.Name = "City";
                                                attrCtx_LVL6_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND0.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City";
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "State";
                                                attrCtx_LVL6_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State";
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
                                    attrCtx_LVL3_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress";
                                    attrCtx_LVL3_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "generatedRound";
                                        attrCtx_LVL4_IND0.Name = "_generatedAttributeRound0";
                                        attrCtx_LVL4_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeDefinition";
                                            attrCtx_LVL5_IND0.Name = "EmployeeAddress1City";
                                            attrCtx_LVL5_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City";
                                            attrCtx_LVL5_IND0.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress1City");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL5_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND1.Type = "attributeDefinition";
                                            attrCtx_LVL5_IND1.Name = "EmployeeAddress1State";
                                            attrCtx_LVL5_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND1.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State";
                                            attrCtx_LVL5_IND1.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress1State");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND1);
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "generatedRound";
                                        attrCtx_LVL4_IND1.Name = "_generatedAttributeRound1";
                                        attrCtx_LVL4_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeDefinition";
                                            attrCtx_LVL5_IND0.Name = "EmployeeAddress2City";
                                            attrCtx_LVL5_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City";
                                            attrCtx_LVL5_IND0.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress2City");
                                            }
                                        }
                                        attrCtx_LVL4_IND1.Contexts.Add(attrCtx_LVL5_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL5_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND1.Type = "attributeDefinition";
                                            attrCtx_LVL5_IND1.Name = "EmployeeAddress2State";
                                            attrCtx_LVL5_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1";
                                            attrCtx_LVL5_IND1.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State";
                                            attrCtx_LVL5_IND1.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress2State");
                                            }
                                        }
                                        attrCtx_LVL4_IND1.Contexts.Add(attrCtx_LVL5_IND1);
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND1);
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
                    expectedContext_structured.Name = "EmployeeAddresses_Resolved_structured";
                    expectedContext_structured.Definition = "resolvedFrom/EmployeeAddresses";
                    expectedContext_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "EmployeeAddress";
                                attrCtx_LVL2_IND0.Parent = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope/members/EmployeeAddress";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Address";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Address";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Parent = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeGroup";
                                            attrCtx_LVL5_IND0.Name = "attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Parent = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND0.Name = "City";
                                                attrCtx_LVL6_IND0.Parent = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND0.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City";
                                                attrCtx_LVL6_IND0.ContextStrings = new List<string>();
                                                {
                                                    attrCtx_LVL6_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_structured/hasAttributes/EmployeeAddress/members/City");
                                                }
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "State";
                                                attrCtx_LVL6_IND1.Parent = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State";
                                                attrCtx_LVL6_IND1.ContextStrings = new List<string>();
                                                {
                                                    attrCtx_LVL6_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_structured/hasAttributes/EmployeeAddress/members/State");
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
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_normalized_structured.Type = "entity";
                    expectedContext_normalized_structured.Name = "EmployeeAddresses_Resolved_normalized_structured";
                    expectedContext_normalized_structured.Definition = "resolvedFrom/EmployeeAddresses";
                    expectedContext_normalized_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "EmployeeAddress";
                                attrCtx_LVL2_IND0.Parent = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope/members/EmployeeAddress";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Address";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Address";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Parent = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeGroup";
                                            attrCtx_LVL5_IND0.Name = "attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Parent = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND0.Name = "City";
                                                attrCtx_LVL6_IND0.Parent = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND0.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City";
                                                attrCtx_LVL6_IND0.ContextStrings = new List<string>();
                                                {
                                                    attrCtx_LVL6_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_normalized_structured/hasAttributes/EmployeeAddress/members/City");
                                                }
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "State";
                                                attrCtx_LVL6_IND1.Parent = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State";
                                                attrCtx_LVL6_IND1.ContextStrings = new List<string>();
                                                {
                                                    attrCtx_LVL6_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_normalized_structured/hasAttributes/EmployeeAddress/members/State");
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
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly_normalized.Type = "entity";
                    expectedContext_referenceOnly_normalized.Name = "EmployeeAddresses_Resolved_referenceOnly_normalized";
                    expectedContext_referenceOnly_normalized.Definition = "resolvedFrom/EmployeeAddresses";
                    expectedContext_referenceOnly_normalized.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "EmployeeAddress";
                                attrCtx_LVL2_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope/members/EmployeeAddress";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Address";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Address";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeGroup";
                                            attrCtx_LVL5_IND0.Name = "attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND0.Name = "City";
                                                attrCtx_LVL6_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND0.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City";
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "State";
                                                attrCtx_LVL6_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State";
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
                                    attrCtx_LVL3_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress";
                                    attrCtx_LVL3_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "generatedRound";
                                        attrCtx_LVL4_IND0.Name = "_generatedAttributeRound0";
                                        attrCtx_LVL4_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeDefinition";
                                            attrCtx_LVL5_IND0.Name = "EmployeeAddress1City";
                                            attrCtx_LVL5_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City";
                                            attrCtx_LVL5_IND0.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress1City");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL5_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND1.Type = "attributeDefinition";
                                            attrCtx_LVL5_IND1.Name = "EmployeeAddress1State";
                                            attrCtx_LVL5_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0";
                                            attrCtx_LVL5_IND1.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State";
                                            attrCtx_LVL5_IND1.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress1State");
                                            }
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND1);
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "generatedRound";
                                        attrCtx_LVL4_IND1.Name = "_generatedAttributeRound1";
                                        attrCtx_LVL4_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeDefinition";
                                            attrCtx_LVL5_IND0.Name = "EmployeeAddress2City";
                                            attrCtx_LVL5_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City";
                                            attrCtx_LVL5_IND0.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress2City");
                                            }
                                        }
                                        attrCtx_LVL4_IND1.Contexts.Add(attrCtx_LVL5_IND0);
                                        AttributeContextExpectedValue attrCtx_LVL5_IND1 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND1.Type = "attributeDefinition";
                                            attrCtx_LVL5_IND1.Name = "EmployeeAddress2State";
                                            attrCtx_LVL5_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1";
                                            attrCtx_LVL5_IND1.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State";
                                            attrCtx_LVL5_IND1.ContextStrings = new List<string>();
                                            {
                                                attrCtx_LVL5_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress2State");
                                            }
                                        }
                                        attrCtx_LVL4_IND1.Contexts.Add(attrCtx_LVL5_IND1);
                                    }
                                    attrCtx_LVL3_IND1.Contexts.Add(attrCtx_LVL4_IND1);
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
                    expectedContext_referenceOnly_structured.Name = "EmployeeAddresses_Resolved_referenceOnly_structured";
                    expectedContext_referenceOnly_structured.Definition = "resolvedFrom/EmployeeAddresses";
                    expectedContext_referenceOnly_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "EmployeeAddress";
                                attrCtx_LVL2_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope/members/EmployeeAddress";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Address";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Address";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeGroup";
                                            attrCtx_LVL5_IND0.Name = "attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND0.Name = "City";
                                                attrCtx_LVL6_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND0.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City";
                                                attrCtx_LVL6_IND0.ContextStrings = new List<string>();
                                                {
                                                    attrCtx_LVL6_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly_structured/hasAttributes/EmployeeAddress/members/City");
                                                }
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "State";
                                                attrCtx_LVL6_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State";
                                                attrCtx_LVL6_IND1.ContextStrings = new List<string>();
                                                {
                                                    attrCtx_LVL6_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly_structured/hasAttributes/EmployeeAddress/members/State");
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
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly_normalized_structured.Type = "entity";
                    expectedContext_referenceOnly_normalized_structured.Name = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured";
                    expectedContext_referenceOnly_normalized_structured.Definition = "resolvedFrom/EmployeeAddresses";
                    expectedContext_referenceOnly_normalized_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "attributeGroup";
                            attrCtx_LVL1_IND0.Name = "attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "attributeDefinition";
                                attrCtx_LVL2_IND0.Name = "EmployeeAddress";
                                attrCtx_LVL2_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/attributesAddedAtThisScope/members/EmployeeAddress";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "Address";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Address";
                                    attrCtx_LVL3_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                    AttributeContextExpectedValue attrCtx_LVL4_IND0 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND0.Type = "entityReferenceExtends";
                                        attrCtx_LVL4_IND0.Name = "extends";
                                        attrCtx_LVL4_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address";
                                        attrCtx_LVL4_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "entity";
                                            attrCtx_LVL5_IND0.Name = "CdmEntity";
                                            attrCtx_LVL5_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/extends";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/CdmEntity";
                                        }
                                        attrCtx_LVL4_IND0.Contexts.Add(attrCtx_LVL5_IND0);
                                    }
                                    attrCtx_LVL3_IND0.Contexts.Add(attrCtx_LVL4_IND0);
                                    AttributeContextExpectedValue attrCtx_LVL4_IND1 = new AttributeContextExpectedValue();
                                    {
                                        attrCtx_LVL4_IND1.Type = "attributeDefinition";
                                        attrCtx_LVL4_IND1.Name = "attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address";
                                        attrCtx_LVL4_IND1.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope";
                                        attrCtx_LVL4_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                        AttributeContextExpectedValue attrCtx_LVL5_IND0 = new AttributeContextExpectedValue();
                                        {
                                            attrCtx_LVL5_IND0.Type = "attributeGroup";
                                            attrCtx_LVL5_IND0.Name = "attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope";
                                            attrCtx_LVL5_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                            AttributeContextExpectedValue attrCtx_LVL6_IND0 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND0.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND0.Name = "City";
                                                attrCtx_LVL6_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND0.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/City";
                                                attrCtx_LVL6_IND0.ContextStrings = new List<string>();
                                                {
                                                    attrCtx_LVL6_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeAddress/members/City");
                                                }
                                            }
                                            attrCtx_LVL5_IND0.Contexts.Add(attrCtx_LVL6_IND0);
                                            AttributeContextExpectedValue attrCtx_LVL6_IND1 = new AttributeContextExpectedValue();
                                            {
                                                attrCtx_LVL6_IND1.Type = "attributeDefinition";
                                                attrCtx_LVL6_IND1.Name = "State";
                                                attrCtx_LVL6_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope";
                                                attrCtx_LVL6_IND1.Definition = "resolvedFrom/Address/hasAttributes/attributesAddedAtThisScope/members/State";
                                                attrCtx_LVL6_IND1.ContextStrings = new List<string>();
                                                {
                                                    attrCtx_LVL6_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeAddress/members/State");
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
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND1);
                }

                List<AttributeExpectedValue> expected_default = new List<AttributeExpectedValue>();
                {
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress1City",
                        DataFormat = "String",
                        DisplayName = "City",
                        Name = "EmployeeAddress1City",
                        SourceName = "City",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress1State",
                        DataFormat = "String",
                        DisplayName = "State",
                        Name = "EmployeeAddress1State",
                        SourceName = "State",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress2City",
                        DataFormat = "String",
                        DisplayName = "City",
                        Name = "EmployeeAddress2City",
                        SourceName = "City",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress2State",
                        DataFormat = "String",
                        DisplayName = "State",
                        Name = "EmployeeAddress2State",
                        SourceName = "State",
                    });
                }
                List<AttributeExpectedValue> expected_normalized = new List<AttributeExpectedValue>();
                {
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress1City",
                        DataFormat = "String",
                        DisplayName = "City",
                        Name = "EmployeeAddress1City",
                        SourceName = "City",
                    });
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress1State",
                        DataFormat = "String",
                        DisplayName = "State",
                        Name = "EmployeeAddress1State",
                        SourceName = "State",
                    });
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress2City",
                        DataFormat = "String",
                        DisplayName = "City",
                        Name = "EmployeeAddress2City",
                        SourceName = "City",
                    });
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress2State",
                        DataFormat = "String",
                        DisplayName = "State",
                        Name = "EmployeeAddress2State",
                        SourceName = "State",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress1City",
                        DataFormat = "String",
                        DisplayName = "City",
                        Name = "EmployeeAddress1City",
                        SourceName = "City",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress1State",
                        DataFormat = "String",
                        DisplayName = "State",
                        Name = "EmployeeAddress1State",
                        SourceName = "State",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress2City",
                        DataFormat = "String",
                        DisplayName = "City",
                        Name = "EmployeeAddress2City",
                        SourceName = "City",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress2State",
                        DataFormat = "String",
                        DisplayName = "State",
                        Name = "EmployeeAddress2State",
                        SourceName = "State",
                    });
                }
                List<AttributeExpectedValue> expected_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "EmployeeAddress";
                        AttribGroupRef.AttributeContext = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope/City",
                            DataFormat = "String",
                            Name = "City",
                        });
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope/State",
                            DataFormat = "String",
                            Name = "State",
                        });
                        expected_structured.Add(AttribGroupRef);
                    };
                }
                List<AttributeExpectedValue> expected_normalized_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "EmployeeAddress";
                        AttribGroupRef.AttributeContext = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope/City",
                            DataFormat = "String",
                            Name = "City",
                        });
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope/State",
                            DataFormat = "String",
                            Name = "State",
                        });
                        expected_normalized_structured.Add(AttribGroupRef);
                    };
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress1City",
                        DataFormat = "String",
                        DisplayName = "City",
                        Name = "EmployeeAddress1City",
                        SourceName = "City",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress1State",
                        DataFormat = "String",
                        DisplayName = "State",
                        Name = "EmployeeAddress1State",
                        SourceName = "State",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress2City",
                        DataFormat = "String",
                        DisplayName = "City",
                        Name = "EmployeeAddress2City",
                        SourceName = "City",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress2State",
                        DataFormat = "String",
                        DisplayName = "State",
                        Name = "EmployeeAddress2State",
                        SourceName = "State",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "EmployeeAddress";
                        AttribGroupRef.AttributeContext = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope/City",
                            DataFormat = "String",
                            Name = "City",
                        });
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope/State",
                            DataFormat = "String",
                            Name = "State",
                        });
                        expected_referenceOnly_structured.Add(AttribGroupRef);
                    };
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "EmployeeAddress";
                        AttribGroupRef.AttributeContext = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope/City",
                            DataFormat = "String",
                            Name = "City",
                        });
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributesAddedAtThisScope/attributesAddedAtThisScope/EmployeeAddress/Address/attributesAddedAtThisScope/attributesAddedAtThisScope/State",
                            DataFormat = "String",
                            Name = "State",
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
        /// Resolution Guidance Test - Expansion & Rename - Ordinal 2 to 3 and AddCount
        /// </summary>
        [TestMethod]
        public async Task TestExpansionAndRenamedOrdinal23AndAddCount()
        {
            string testName = "TestExpansionAndRenamedOrdinal23AndAddCount";
            {
                string entityName = "EmployeeAddresses";

                AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
                {
                    expectedContext_default.Type = "entity";
                    expectedContext_default.Name = "EmployeeAddresses_Resolved_default";
                    expectedContext_default.Definition = "resolvedFrom/EmployeeAddresses";
                    expectedContext_default.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_default.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "EmployeeAddress";
                        attrCtx_LVL0_IND1.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "Address";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Address";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "entityReferenceExtends";
                                attrCtx_LVL2_IND0.Name = "extends";
                                attrCtx_LVL2_IND0.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/Address";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "CdmEntity";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/Address/extends";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/CdmEntity";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "City";
                                attrCtx_LVL2_IND1.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/Address";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Address/hasAttributes/City";
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "State";
                                attrCtx_LVL2_IND2.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/Address";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/Address/hasAttributes/State";
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND2);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                        AttributeContextExpectedValue attrCtx_LVL1_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND1.Type = "generatedSet";
                            attrCtx_LVL1_IND1.Name = "_generatedAttributeSet";
                            attrCtx_LVL1_IND1.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress";
                            attrCtx_LVL1_IND1.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "addedAttributeExpansionTotal";
                                attrCtx_LVL2_IND0.Name = "EmployeeAddress__AddressCount";
                                attrCtx_LVL2_IND0.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress/resolutionGuidance/countAttribute/AddressCount";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress__AddressCount");
                                }
                            }
                            attrCtx_LVL1_IND1.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "generatedRound";
                                attrCtx_LVL2_IND1.Name = "_generatedAttributeRound0";
                                attrCtx_LVL2_IND1.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet";
                                attrCtx_LVL2_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "attributeDefinition";
                                    attrCtx_LVL3_IND0.Name = "EmployeeAddress_2_City";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Address/hasAttributes/City";
                                    attrCtx_LVL3_IND0.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress_2_City");
                                    }
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "attributeDefinition";
                                    attrCtx_LVL3_IND1.Name = "EmployeeAddress_2_State";
                                    attrCtx_LVL3_IND1.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0";
                                    attrCtx_LVL3_IND1.Definition = "resolvedFrom/Address/hasAttributes/State";
                                    attrCtx_LVL3_IND1.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress_2_State");
                                    }
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND1.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "generatedRound";
                                attrCtx_LVL2_IND2.Name = "_generatedAttributeRound1";
                                attrCtx_LVL2_IND2.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet";
                                attrCtx_LVL2_IND2.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "attributeDefinition";
                                    attrCtx_LVL3_IND0.Name = "EmployeeAddress_3_City";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Address/hasAttributes/City";
                                    attrCtx_LVL3_IND0.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress_3_City");
                                    }
                                }
                                attrCtx_LVL2_IND2.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "attributeDefinition";
                                    attrCtx_LVL3_IND1.Name = "EmployeeAddress_3_State";
                                    attrCtx_LVL3_IND1.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1";
                                    attrCtx_LVL3_IND1.Definition = "resolvedFrom/Address/hasAttributes/State";
                                    attrCtx_LVL3_IND1.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress_3_State");
                                    }
                                }
                                attrCtx_LVL2_IND2.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND1.Contexts.Add(attrCtx_LVL2_IND2);
                            AttributeContextExpectedValue attrCtx_LVL2_IND3 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND3.Type = "generatedRound";
                                attrCtx_LVL2_IND3.Name = "_generatedAttributeRound2";
                                attrCtx_LVL2_IND3.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet";
                                attrCtx_LVL2_IND3.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "attributeDefinition";
                                    attrCtx_LVL3_IND0.Name = "EmployeeAddress_4_City";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Address/hasAttributes/City";
                                    attrCtx_LVL3_IND0.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress_4_City");
                                    }
                                }
                                attrCtx_LVL2_IND3.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "attributeDefinition";
                                    attrCtx_LVL3_IND1.Name = "EmployeeAddress_4_State";
                                    attrCtx_LVL3_IND1.Parent = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2";
                                    attrCtx_LVL3_IND1.Definition = "resolvedFrom/Address/hasAttributes/State";
                                    attrCtx_LVL3_IND1.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_default/hasAttributes/EmployeeAddress_4_State");
                                    }
                                }
                                attrCtx_LVL2_IND3.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND1.Contexts.Add(attrCtx_LVL2_IND3);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND1);
                    }
                    expectedContext_default.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
                {
                    expectedContext_normalized.Type = "entity";
                    expectedContext_normalized.Name = "EmployeeAddresses_Resolved_normalized";
                    expectedContext_normalized.Definition = "resolvedFrom/EmployeeAddresses";
                    expectedContext_normalized.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "EmployeeAddress";
                        attrCtx_LVL0_IND1.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "Address";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Address";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "entityReferenceExtends";
                                attrCtx_LVL2_IND0.Name = "extends";
                                attrCtx_LVL2_IND0.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/Address";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "CdmEntity";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/Address/extends";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/CdmEntity";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "City";
                                attrCtx_LVL2_IND1.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/Address";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Address/hasAttributes/City";
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "State";
                                attrCtx_LVL2_IND2.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/Address";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/Address/hasAttributes/State";
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND2);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                        AttributeContextExpectedValue attrCtx_LVL1_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND1.Type = "generatedSet";
                            attrCtx_LVL1_IND1.Name = "_generatedAttributeSet";
                            attrCtx_LVL1_IND1.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress";
                            attrCtx_LVL1_IND1.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "addedAttributeExpansionTotal";
                                attrCtx_LVL2_IND0.Name = "EmployeeAddress__AddressCount";
                                attrCtx_LVL2_IND0.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress/resolutionGuidance/countAttribute/AddressCount";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress__AddressCount");
                                }
                            }
                            attrCtx_LVL1_IND1.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "generatedRound";
                                attrCtx_LVL2_IND1.Name = "_generatedAttributeRound0";
                                attrCtx_LVL2_IND1.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet";
                                attrCtx_LVL2_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "attributeDefinition";
                                    attrCtx_LVL3_IND0.Name = "EmployeeAddress_2_City";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Address/hasAttributes/City";
                                    attrCtx_LVL3_IND0.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress_2_City");
                                    }
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "attributeDefinition";
                                    attrCtx_LVL3_IND1.Name = "EmployeeAddress_2_State";
                                    attrCtx_LVL3_IND1.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0";
                                    attrCtx_LVL3_IND1.Definition = "resolvedFrom/Address/hasAttributes/State";
                                    attrCtx_LVL3_IND1.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress_2_State");
                                    }
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND1.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "generatedRound";
                                attrCtx_LVL2_IND2.Name = "_generatedAttributeRound1";
                                attrCtx_LVL2_IND2.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet";
                                attrCtx_LVL2_IND2.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "attributeDefinition";
                                    attrCtx_LVL3_IND0.Name = "EmployeeAddress_3_City";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Address/hasAttributes/City";
                                    attrCtx_LVL3_IND0.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress_3_City");
                                    }
                                }
                                attrCtx_LVL2_IND2.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "attributeDefinition";
                                    attrCtx_LVL3_IND1.Name = "EmployeeAddress_3_State";
                                    attrCtx_LVL3_IND1.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1";
                                    attrCtx_LVL3_IND1.Definition = "resolvedFrom/Address/hasAttributes/State";
                                    attrCtx_LVL3_IND1.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress_3_State");
                                    }
                                }
                                attrCtx_LVL2_IND2.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND1.Contexts.Add(attrCtx_LVL2_IND2);
                            AttributeContextExpectedValue attrCtx_LVL2_IND3 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND3.Type = "generatedRound";
                                attrCtx_LVL2_IND3.Name = "_generatedAttributeRound2";
                                attrCtx_LVL2_IND3.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet";
                                attrCtx_LVL2_IND3.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "attributeDefinition";
                                    attrCtx_LVL3_IND0.Name = "EmployeeAddress_4_City";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Address/hasAttributes/City";
                                    attrCtx_LVL3_IND0.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress_4_City");
                                    }
                                }
                                attrCtx_LVL2_IND3.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "attributeDefinition";
                                    attrCtx_LVL3_IND1.Name = "EmployeeAddress_4_State";
                                    attrCtx_LVL3_IND1.Parent = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2";
                                    attrCtx_LVL3_IND1.Definition = "resolvedFrom/Address/hasAttributes/State";
                                    attrCtx_LVL3_IND1.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_normalized/hasAttributes/EmployeeAddress_4_State");
                                    }
                                }
                                attrCtx_LVL2_IND3.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND1.Contexts.Add(attrCtx_LVL2_IND3);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND1);
                    }
                    expectedContext_normalized.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly.Type = "entity";
                    expectedContext_referenceOnly.Name = "EmployeeAddresses_Resolved_referenceOnly";
                    expectedContext_referenceOnly.Definition = "resolvedFrom/EmployeeAddresses";
                    expectedContext_referenceOnly.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "EmployeeAddress";
                        attrCtx_LVL0_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "Address";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Address";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "entityReferenceExtends";
                                attrCtx_LVL2_IND0.Name = "extends";
                                attrCtx_LVL2_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/Address";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "CdmEntity";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/Address/extends";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/CdmEntity";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "City";
                                attrCtx_LVL2_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/Address";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Address/hasAttributes/City";
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "State";
                                attrCtx_LVL2_IND2.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/Address";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/Address/hasAttributes/State";
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND2);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                        AttributeContextExpectedValue attrCtx_LVL1_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND1.Type = "generatedSet";
                            attrCtx_LVL1_IND1.Name = "_generatedAttributeSet";
                            attrCtx_LVL1_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress";
                            attrCtx_LVL1_IND1.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "addedAttributeExpansionTotal";
                                attrCtx_LVL2_IND0.Name = "EmployeeAddress__AddressCount";
                                attrCtx_LVL2_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress/resolutionGuidance/countAttribute/AddressCount";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress__AddressCount");
                                }
                            }
                            attrCtx_LVL1_IND1.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "generatedRound";
                                attrCtx_LVL2_IND1.Name = "_generatedAttributeRound0";
                                attrCtx_LVL2_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet";
                                attrCtx_LVL2_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "attributeDefinition";
                                    attrCtx_LVL3_IND0.Name = "EmployeeAddress_2_City";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Address/hasAttributes/City";
                                    attrCtx_LVL3_IND0.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress_2_City");
                                    }
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "attributeDefinition";
                                    attrCtx_LVL3_IND1.Name = "EmployeeAddress_2_State";
                                    attrCtx_LVL3_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0";
                                    attrCtx_LVL3_IND1.Definition = "resolvedFrom/Address/hasAttributes/State";
                                    attrCtx_LVL3_IND1.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress_2_State");
                                    }
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND1.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "generatedRound";
                                attrCtx_LVL2_IND2.Name = "_generatedAttributeRound1";
                                attrCtx_LVL2_IND2.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet";
                                attrCtx_LVL2_IND2.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "attributeDefinition";
                                    attrCtx_LVL3_IND0.Name = "EmployeeAddress_3_City";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Address/hasAttributes/City";
                                    attrCtx_LVL3_IND0.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress_3_City");
                                    }
                                }
                                attrCtx_LVL2_IND2.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "attributeDefinition";
                                    attrCtx_LVL3_IND1.Name = "EmployeeAddress_3_State";
                                    attrCtx_LVL3_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1";
                                    attrCtx_LVL3_IND1.Definition = "resolvedFrom/Address/hasAttributes/State";
                                    attrCtx_LVL3_IND1.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress_3_State");
                                    }
                                }
                                attrCtx_LVL2_IND2.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND1.Contexts.Add(attrCtx_LVL2_IND2);
                            AttributeContextExpectedValue attrCtx_LVL2_IND3 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND3.Type = "generatedRound";
                                attrCtx_LVL2_IND3.Name = "_generatedAttributeRound2";
                                attrCtx_LVL2_IND3.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet";
                                attrCtx_LVL2_IND3.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "attributeDefinition";
                                    attrCtx_LVL3_IND0.Name = "EmployeeAddress_4_City";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Address/hasAttributes/City";
                                    attrCtx_LVL3_IND0.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress_4_City");
                                    }
                                }
                                attrCtx_LVL2_IND3.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "attributeDefinition";
                                    attrCtx_LVL3_IND1.Name = "EmployeeAddress_4_State";
                                    attrCtx_LVL3_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2";
                                    attrCtx_LVL3_IND1.Definition = "resolvedFrom/Address/hasAttributes/State";
                                    attrCtx_LVL3_IND1.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly/hasAttributes/EmployeeAddress_4_State");
                                    }
                                }
                                attrCtx_LVL2_IND3.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND1.Contexts.Add(attrCtx_LVL2_IND3);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND1);
                    }
                    expectedContext_referenceOnly.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_structured.Type = "entity";
                    expectedContext_structured.Name = "EmployeeAddresses_Resolved_structured";
                    expectedContext_structured.Definition = "resolvedFrom/EmployeeAddresses";
                    expectedContext_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "EmployeeAddress";
                        attrCtx_LVL0_IND1.Parent = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "Address";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Address";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "entityReferenceExtends";
                                attrCtx_LVL2_IND0.Name = "extends";
                                attrCtx_LVL2_IND0.Parent = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress/Address";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "CdmEntity";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress/Address/extends";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/CdmEntity";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "City";
                                attrCtx_LVL2_IND1.Parent = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress/Address";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Address/hasAttributes/City";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_structured/hasAttributes/EmployeeAddress/members/City");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "State";
                                attrCtx_LVL2_IND2.Parent = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress/Address";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/Address/hasAttributes/State";
                                attrCtx_LVL2_IND2.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND2.ContextStrings.Add("EmployeeAddresses_Resolved_structured/hasAttributes/EmployeeAddress/members/State");
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
                    expectedContext_normalized_structured.Name = "EmployeeAddresses_Resolved_normalized_structured";
                    expectedContext_normalized_structured.Definition = "resolvedFrom/EmployeeAddresses";
                    expectedContext_normalized_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_normalized_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "EmployeeAddress";
                        attrCtx_LVL0_IND1.Parent = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "Address";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Address";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "entityReferenceExtends";
                                attrCtx_LVL2_IND0.Name = "extends";
                                attrCtx_LVL2_IND0.Parent = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress/Address";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "CdmEntity";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress/Address/extends";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/CdmEntity";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "City";
                                attrCtx_LVL2_IND1.Parent = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress/Address";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Address/hasAttributes/City";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_normalized_structured/hasAttributes/EmployeeAddress/members/City");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "State";
                                attrCtx_LVL2_IND2.Parent = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress/Address";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/Address/hasAttributes/State";
                                attrCtx_LVL2_IND2.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND2.ContextStrings.Add("EmployeeAddresses_Resolved_normalized_structured/hasAttributes/EmployeeAddress/members/State");
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
                    expectedContext_referenceOnly_normalized.Name = "EmployeeAddresses_Resolved_referenceOnly_normalized";
                    expectedContext_referenceOnly_normalized.Definition = "resolvedFrom/EmployeeAddresses";
                    expectedContext_referenceOnly_normalized.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "EmployeeAddress";
                        attrCtx_LVL0_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "Address";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Address";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "entityReferenceExtends";
                                attrCtx_LVL2_IND0.Name = "extends";
                                attrCtx_LVL2_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/Address";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "CdmEntity";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/Address/extends";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/CdmEntity";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "City";
                                attrCtx_LVL2_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/Address";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Address/hasAttributes/City";
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "State";
                                attrCtx_LVL2_IND2.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/Address";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/Address/hasAttributes/State";
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND2);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND0);
                        AttributeContextExpectedValue attrCtx_LVL1_IND1 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND1.Type = "generatedSet";
                            attrCtx_LVL1_IND1.Name = "_generatedAttributeSet";
                            attrCtx_LVL1_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress";
                            attrCtx_LVL1_IND1.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "addedAttributeExpansionTotal";
                                attrCtx_LVL2_IND0.Name = "EmployeeAddress__AddressCount";
                                attrCtx_LVL2_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet";
                                attrCtx_LVL2_IND0.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress/resolutionGuidance/countAttribute/AddressCount";
                                attrCtx_LVL2_IND0.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress__AddressCount");
                                }
                            }
                            attrCtx_LVL1_IND1.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "generatedRound";
                                attrCtx_LVL2_IND1.Name = "_generatedAttributeRound0";
                                attrCtx_LVL2_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet";
                                attrCtx_LVL2_IND1.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "attributeDefinition";
                                    attrCtx_LVL3_IND0.Name = "EmployeeAddress_2_City";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Address/hasAttributes/City";
                                    attrCtx_LVL3_IND0.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress_2_City");
                                    }
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "attributeDefinition";
                                    attrCtx_LVL3_IND1.Name = "EmployeeAddress_2_State";
                                    attrCtx_LVL3_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0";
                                    attrCtx_LVL3_IND1.Definition = "resolvedFrom/Address/hasAttributes/State";
                                    attrCtx_LVL3_IND1.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress_2_State");
                                    }
                                }
                                attrCtx_LVL2_IND1.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND1.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "generatedRound";
                                attrCtx_LVL2_IND2.Name = "_generatedAttributeRound1";
                                attrCtx_LVL2_IND2.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet";
                                attrCtx_LVL2_IND2.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "attributeDefinition";
                                    attrCtx_LVL3_IND0.Name = "EmployeeAddress_3_City";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Address/hasAttributes/City";
                                    attrCtx_LVL3_IND0.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress_3_City");
                                    }
                                }
                                attrCtx_LVL2_IND2.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "attributeDefinition";
                                    attrCtx_LVL3_IND1.Name = "EmployeeAddress_3_State";
                                    attrCtx_LVL3_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1";
                                    attrCtx_LVL3_IND1.Definition = "resolvedFrom/Address/hasAttributes/State";
                                    attrCtx_LVL3_IND1.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress_3_State");
                                    }
                                }
                                attrCtx_LVL2_IND2.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND1.Contexts.Add(attrCtx_LVL2_IND2);
                            AttributeContextExpectedValue attrCtx_LVL2_IND3 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND3.Type = "generatedRound";
                                attrCtx_LVL2_IND3.Name = "_generatedAttributeRound2";
                                attrCtx_LVL2_IND3.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet";
                                attrCtx_LVL2_IND3.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "attributeDefinition";
                                    attrCtx_LVL3_IND0.Name = "EmployeeAddress_4_City";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/Address/hasAttributes/City";
                                    attrCtx_LVL3_IND0.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND0.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress_4_City");
                                    }
                                }
                                attrCtx_LVL2_IND3.Contexts.Add(attrCtx_LVL3_IND0);
                                AttributeContextExpectedValue attrCtx_LVL3_IND1 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND1.Type = "attributeDefinition";
                                    attrCtx_LVL3_IND1.Name = "EmployeeAddress_4_State";
                                    attrCtx_LVL3_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2";
                                    attrCtx_LVL3_IND1.Definition = "resolvedFrom/Address/hasAttributes/State";
                                    attrCtx_LVL3_IND1.ContextStrings = new List<string>();
                                    {
                                        attrCtx_LVL3_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly_normalized/hasAttributes/EmployeeAddress_4_State");
                                    }
                                }
                                attrCtx_LVL2_IND3.Contexts.Add(attrCtx_LVL3_IND1);
                            }
                            attrCtx_LVL1_IND1.Contexts.Add(attrCtx_LVL2_IND3);
                        }
                        attrCtx_LVL0_IND1.Contexts.Add(attrCtx_LVL1_IND1);
                    }
                    expectedContext_referenceOnly_normalized.Contexts.Add(attrCtx_LVL0_IND1);
                }
                AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
                {
                    expectedContext_referenceOnly_structured.Type = "entity";
                    expectedContext_referenceOnly_structured.Name = "EmployeeAddresses_Resolved_referenceOnly_structured";
                    expectedContext_referenceOnly_structured.Definition = "resolvedFrom/EmployeeAddresses";
                    expectedContext_referenceOnly_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "EmployeeAddress";
                        attrCtx_LVL0_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "Address";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Address";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "entityReferenceExtends";
                                attrCtx_LVL2_IND0.Name = "extends";
                                attrCtx_LVL2_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress/Address";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "CdmEntity";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress/Address/extends";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/CdmEntity";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "City";
                                attrCtx_LVL2_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress/Address";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Address/hasAttributes/City";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly_structured/hasAttributes/EmployeeAddress/members/City");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "State";
                                attrCtx_LVL2_IND2.Parent = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress/Address";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/Address/hasAttributes/State";
                                attrCtx_LVL2_IND2.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND2.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly_structured/hasAttributes/EmployeeAddress/members/State");
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
                    expectedContext_referenceOnly_normalized_structured.Name = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured";
                    expectedContext_referenceOnly_normalized_structured.Definition = "resolvedFrom/EmployeeAddresses";
                    expectedContext_referenceOnly_normalized_structured.Contexts = new List<AttributeContextExpectedValue>();
                    AttributeContextExpectedValue attrCtx_LVL0_IND0 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND0.Type = "entityReferenceExtends";
                        attrCtx_LVL0_IND0.Name = "extends";
                        attrCtx_LVL0_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND0.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "CdmEntity";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/extends";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/CdmEntity";
                        }
                        attrCtx_LVL0_IND0.Contexts.Add(attrCtx_LVL1_IND0);
                    }
                    expectedContext_referenceOnly_normalized_structured.Contexts.Add(attrCtx_LVL0_IND0);
                    AttributeContextExpectedValue attrCtx_LVL0_IND1 = new AttributeContextExpectedValue();
                    {
                        attrCtx_LVL0_IND1.Type = "attributeDefinition";
                        attrCtx_LVL0_IND1.Name = "EmployeeAddress";
                        attrCtx_LVL0_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured";
                        attrCtx_LVL0_IND1.Definition = "resolvedFrom/EmployeeAddresses/hasAttributes/EmployeeAddress";
                        attrCtx_LVL0_IND1.Contexts = new List<AttributeContextExpectedValue>();
                        AttributeContextExpectedValue attrCtx_LVL1_IND0 = new AttributeContextExpectedValue();
                        {
                            attrCtx_LVL1_IND0.Type = "entity";
                            attrCtx_LVL1_IND0.Name = "Address";
                            attrCtx_LVL1_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress";
                            attrCtx_LVL1_IND0.Definition = "resolvedFrom/Address";
                            attrCtx_LVL1_IND0.Contexts = new List<AttributeContextExpectedValue>();
                            AttributeContextExpectedValue attrCtx_LVL2_IND0 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND0.Type = "entityReferenceExtends";
                                attrCtx_LVL2_IND0.Name = "extends";
                                attrCtx_LVL2_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress/Address";
                                attrCtx_LVL2_IND0.Contexts = new List<AttributeContextExpectedValue>();
                                AttributeContextExpectedValue attrCtx_LVL3_IND0 = new AttributeContextExpectedValue();
                                {
                                    attrCtx_LVL3_IND0.Type = "entity";
                                    attrCtx_LVL3_IND0.Name = "CdmEntity";
                                    attrCtx_LVL3_IND0.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress/Address/extends";
                                    attrCtx_LVL3_IND0.Definition = "resolvedFrom/CdmEntity";
                                }
                                attrCtx_LVL2_IND0.Contexts.Add(attrCtx_LVL3_IND0);
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND0);
                            AttributeContextExpectedValue attrCtx_LVL2_IND1 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND1.Type = "attributeDefinition";
                                attrCtx_LVL2_IND1.Name = "City";
                                attrCtx_LVL2_IND1.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress/Address";
                                attrCtx_LVL2_IND1.Definition = "resolvedFrom/Address/hasAttributes/City";
                                attrCtx_LVL2_IND1.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND1.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeAddress/members/City");
                                }
                            }
                            attrCtx_LVL1_IND0.Contexts.Add(attrCtx_LVL2_IND1);
                            AttributeContextExpectedValue attrCtx_LVL2_IND2 = new AttributeContextExpectedValue();
                            {
                                attrCtx_LVL2_IND2.Type = "attributeDefinition";
                                attrCtx_LVL2_IND2.Name = "State";
                                attrCtx_LVL2_IND2.Parent = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress/Address";
                                attrCtx_LVL2_IND2.Definition = "resolvedFrom/Address/hasAttributes/State";
                                attrCtx_LVL2_IND2.ContextStrings = new List<string>();
                                {
                                    attrCtx_LVL2_IND2.ContextStrings.Add("EmployeeAddresses_Resolved_referenceOnly_normalized_structured/hasAttributes/EmployeeAddress/members/State");
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
                        AttributeContext = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/EmployeeAddress__AddressCount",
                        DataFormat = "Int32",
                        Name = "EmployeeAddress__AddressCount",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_City",
                        DataFormat = "String",
                        Name = "EmployeeAddress_2_City",
                        SourceName = "City",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_State",
                        DataFormat = "String",
                        Name = "EmployeeAddress_2_State",
                        SourceName = "State",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_City",
                        DataFormat = "String",
                        Name = "EmployeeAddress_3_City",
                        SourceName = "City",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_State",
                        DataFormat = "String",
                        Name = "EmployeeAddress_3_State",
                        SourceName = "State",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_City",
                        DataFormat = "String",
                        Name = "EmployeeAddress_4_City",
                        SourceName = "City",
                    });
                    expected_default.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_default/attributeContext/EmployeeAddresses_Resolved_default/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_State",
                        DataFormat = "String",
                        Name = "EmployeeAddress_4_State",
                        SourceName = "State",
                    });
                }
                List<AttributeExpectedValue> expected_normalized = new List<AttributeExpectedValue>();
                {
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/EmployeeAddress__AddressCount",
                        DataFormat = "Int32",
                        Name = "EmployeeAddress__AddressCount",
                    });
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_City",
                        DataFormat = "String",
                        Name = "EmployeeAddress_2_City",
                        SourceName = "City",
                    });
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_State",
                        DataFormat = "String",
                        Name = "EmployeeAddress_2_State",
                        SourceName = "State",
                    });
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_City",
                        DataFormat = "String",
                        Name = "EmployeeAddress_3_City",
                        SourceName = "City",
                    });
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_State",
                        DataFormat = "String",
                        Name = "EmployeeAddress_3_State",
                        SourceName = "State",
                    });
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_City",
                        DataFormat = "String",
                        Name = "EmployeeAddress_4_City",
                        SourceName = "City",
                    });
                    expected_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_normalized/attributeContext/EmployeeAddresses_Resolved_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_State",
                        DataFormat = "String",
                        Name = "EmployeeAddress_4_State",
                        SourceName = "State",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/EmployeeAddress__AddressCount",
                        DataFormat = "Int32",
                        Name = "EmployeeAddress__AddressCount",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_City",
                        DataFormat = "String",
                        Name = "EmployeeAddress_2_City",
                        SourceName = "City",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_State",
                        DataFormat = "String",
                        Name = "EmployeeAddress_2_State",
                        SourceName = "State",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_City",
                        DataFormat = "String",
                        Name = "EmployeeAddress_3_City",
                        SourceName = "City",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_State",
                        DataFormat = "String",
                        Name = "EmployeeAddress_3_State",
                        SourceName = "State",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_City",
                        DataFormat = "String",
                        Name = "EmployeeAddress_4_City",
                        SourceName = "City",
                    });
                    expected_referenceOnly.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_referenceOnly/attributeContext/EmployeeAddresses_Resolved_referenceOnly/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_State",
                        DataFormat = "String",
                        Name = "EmployeeAddress_4_State",
                        SourceName = "State",
                    });
                }
                List<AttributeExpectedValue> expected_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "EmployeeAddress";
                        AttribGroupRef.AttributeContext = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress/Address/City",
                            DataFormat = "String",
                            Name = "City",
                        });
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "EmployeeAddresses_Resolved_structured/attributeContext/EmployeeAddresses_Resolved_structured/EmployeeAddress/Address/State",
                            DataFormat = "String",
                            Name = "State",
                        });
                        expected_structured.Add(AttribGroupRef);
                    };
                }
                List<AttributeExpectedValue> expected_normalized_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "EmployeeAddress";
                        AttribGroupRef.AttributeContext = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress/Address/City",
                            DataFormat = "String",
                            Name = "City",
                        });
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "EmployeeAddresses_Resolved_normalized_structured/attributeContext/EmployeeAddresses_Resolved_normalized_structured/EmployeeAddress/Address/State",
                            DataFormat = "String",
                            Name = "State",
                        });
                        expected_normalized_structured.Add(AttribGroupRef);
                    };
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized = new List<AttributeExpectedValue>();
                {
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/EmployeeAddress__AddressCount",
                        DataFormat = "Int32",
                        Name = "EmployeeAddress__AddressCount",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_City",
                        DataFormat = "String",
                        Name = "EmployeeAddress_2_City",
                        SourceName = "City",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound0/EmployeeAddress_2_State",
                        DataFormat = "String",
                        Name = "EmployeeAddress_2_State",
                        SourceName = "State",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_City",
                        DataFormat = "String",
                        Name = "EmployeeAddress_3_City",
                        SourceName = "City",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound1/EmployeeAddress_3_State",
                        DataFormat = "String",
                        Name = "EmployeeAddress_3_State",
                        SourceName = "State",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_City",
                        DataFormat = "String",
                        Name = "EmployeeAddress_4_City",
                        SourceName = "City",
                    });
                    expected_referenceOnly_normalized.Add(new AttributeExpectedValue()
                    {
                        AttributeContext = "EmployeeAddresses_Resolved_referenceOnly_normalized/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized/EmployeeAddress/_generatedAttributeSet/_generatedAttributeRound2/EmployeeAddress_4_State",
                        DataFormat = "String",
                        Name = "EmployeeAddress_4_State",
                        SourceName = "State",
                    });
                }
                List<AttributeExpectedValue> expected_referenceOnly_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "EmployeeAddress";
                        AttribGroupRef.AttributeContext = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress/Address/City",
                            DataFormat = "String",
                            Name = "City",
                        });
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "EmployeeAddresses_Resolved_referenceOnly_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_structured/EmployeeAddress/Address/State",
                            DataFormat = "String",
                            Name = "State",
                        });
                        expected_referenceOnly_structured.Add(AttribGroupRef);
                    };
                }
                List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new List<AttributeExpectedValue>();
                {
                    AttributeExpectedValue AttribGroupRef = new AttributeExpectedValue();
                    {
                        AttribGroupRef.AttributeGroupName = "EmployeeAddress";
                        AttribGroupRef.AttributeContext = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress";
                        AttribGroupRef.Members = new List<AttributeExpectedValue>();
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress/Address/City",
                            DataFormat = "String",
                            Name = "City",
                        });
                        AttribGroupRef.Members.Add(new AttributeExpectedValue()
                        {
                            AttributeContext = "EmployeeAddresses_Resolved_referenceOnly_normalized_structured/attributeContext/EmployeeAddresses_Resolved_referenceOnly_normalized_structured/EmployeeAddress/Address/State",
                            DataFormat = "String",
                            Name = "State",
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
