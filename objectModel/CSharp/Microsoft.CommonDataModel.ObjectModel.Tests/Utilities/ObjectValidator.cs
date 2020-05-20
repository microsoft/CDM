// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Utilities
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Collections.Generic;

    /// <summary>
    /// Helper class that supports validation of the actual object wrt expected  object
    /// </summary>
    public class ObjectValidator
    {
        public static void ValidateAttributeContext(AttributeContextExpectedValue expected, CdmAttributeContext actual)
        {
            if (expected == null || actual == null)
            {
                Assert.IsNull(expected);
                Assert.IsNull(actual);
                return;
            }

            Assert.AreEqual(expected.Type, actual.Type.ToString(), ignoreCase: true);
            Assert.AreEqual(expected.Name, actual.Name);
            if (actual.Parent != null)
            {
                Assert.AreEqual(expected.Parent, actual.Parent.NamedReference);
            }
            if (expected.Definition != null && actual.Definition != null)
            {
                Assert.AreEqual(expected.Definition, actual.Definition.NamedReference);
            }
            int expCount = 0;
            if (expected.Contexts != null && expected.Contexts.Count > 0)
            {
                expCount += expected.Contexts.Count;
            }
            if (expected.ContextStrings != null && expected.ContextStrings.Count > 0)
            {
                expCount += expected.ContextStrings.Count;
            }
            Assert.AreEqual(expCount, actual.Contents.Count);
            for (int i = 0, ac = 0, acs = 0; i < actual.Contents.Count; i++)
            {
                if (actual.Contents.AllItems[i].GetType() == typeof(CdmAttributeContext))
                {
                    ValidateAttributeContext(expected.Contexts[ac++], (CdmAttributeContext)actual.Contents.AllItems[i]);
                }
                else if (actual.Contents.AllItems[i].GetType() == typeof(CdmAttributeReference))
                {
                    string exp = expected.ContextStrings[acs++];
                    CdmAttributeReference act = (CdmAttributeReference)actual.Contents.AllItems[i];
                    Assert.AreEqual(exp, act.NamedReference);
                }
                else
                {
                    throw new NotImplementedException("ValidateAttributeContext: typeof(Unknown)");
                }
            }
        }

        public static void ValidateAttributesCollection(List<AttributeExpectedValue> expected, CdmCollection<CdmAttributeItem> actual)
        {
            Assert.AreEqual(expected.Count, actual.Count);
            for (int i = 0; i < actual.AllItems.Count; i++)
            {
                if (actual.AllItems[i].GetType() == typeof(CdmTypeAttributeDefinition))
                {
                    AttributeExpectedValue exp = (AttributeExpectedValue)expected[i];
                    CdmTypeAttributeDefinition act = (CdmTypeAttributeDefinition)actual.AllItems[i];
                    ValidateTypeAttributeDefinition(exp, act);
                }
                else if (actual.AllItems[i].GetType() == typeof(CdmAttributeGroupReference))
                {
                    AttributeExpectedValue exp = (AttributeExpectedValue)expected[i];
                    CdmAttributeGroupReference act = (CdmAttributeGroupReference)actual.AllItems[i];
                    ValidateAttributeGroupRef(exp, act);
                }
            }
        }

        public static void ValidateTypeAttributeDefinition(AttributeExpectedValue expected, CdmTypeAttributeDefinition actual)
        {
            Assert.AreEqual(expected.DataFormat, actual.DataFormat.ToString());
            Assert.AreEqual(expected.DataType, actual.DataType);
            Assert.AreEqual(expected.Description, actual.Description);
            Assert.AreEqual(expected.DisplayName, actual.DisplayName);
            Assert.AreEqual(expected.Explanation, actual.Explanation);
            Assert.AreEqual(expected.IsNullable, actual.IsNullable);
            Assert.AreEqual(expected.IsPrimaryKey, actual.IsPrimaryKey);
            Assert.AreEqual(expected.IsReadOnly, actual.IsReadOnly);
            Assert.AreEqual(expected.MaximumLength, actual.MaximumLength);
            Assert.AreEqual(expected.MaximumValue, actual.MaximumValue);
            Assert.AreEqual(expected.MinimumValue, actual.MinimumValue);
            Assert.AreEqual(expected.Name, actual.Name);
            Assert.AreEqual(expected.Purpose, actual.Purpose);
            Assert.AreEqual(expected.SourceName, actual.SourceName);
            Assert.AreEqual(expected.SourceOrdering, actual.SourceOrdering);
        }

        public static void ValidateAttributeGroupRef(AttributeExpectedValue expected, CdmAttributeGroupReference actual)
        {
            if (expected.AttributeGroupName != null || expected.Members != null)
            {
                if (actual.ExplicitReference != null)
                {
                    CdmAttributeGroupDefinition actualObj = ((CdmAttributeGroupDefinition)actual.ExplicitReference);

                    if (expected.AttributeGroupName != null)
                    {
                        Assert.AreEqual(expected.AttributeGroupName, actualObj.AttributeGroupName);
                    }
                    if (expected.AttributeContext != null)
                    {
                        Assert.AreEqual(expected.AttributeContext, actualObj.AttributeContext.NamedReference);
                    }
                    if (expected.Members != null)
                    {
                        Assert.AreEqual(expected.Members.Count, actualObj.Members.Count);
                        for (int i = 0; i < actualObj.Members.Count; i++)
                        {
                            if (actualObj.Members[i].GetType() == typeof(CdmTypeAttributeDefinition))
                            {
                                AttributeExpectedValue exp = (AttributeExpectedValue)expected.Members[i];
                                CdmTypeAttributeDefinition act = (CdmTypeAttributeDefinition)actualObj.Members[i];
                                ValidateTypeAttributeDefinition(exp, act);
                            }
                            else if (actualObj.Members[i].GetType() == typeof(CdmAttributeGroupReference))
                            {
                                AttributeExpectedValue exp = (AttributeExpectedValue)expected.Members[i];
                                CdmAttributeGroupReference act = (CdmAttributeGroupReference)actualObj.Members[i];
                                ValidateAttributeGroupRef(exp, act);
                            }
                            else
                            {
                                throw new NotImplementedException("Unknown type!");
                            }
                        }
                    }
                }
            }
        }

    }

    /// <summary>
    /// class to contain AttributeContext's expected values
    /// </summary>
    public class AttributeContextExpectedValue
    {
        public string Type { get; set; }
        public string Name { get; set; }
        public string Parent { get; set; }
        public string Definition { get; set; }
        public List<AttributeContextExpectedValue> Contexts { get; set; }
        public List<string> ContextStrings { get; set; }
    }

    /// <summary>
    /// class to contain Attribute's expected value
    /// </summary>
    public class AttributeExpectedValue
    {
        public string DataFormat { get; set; }
        public string DataType { get; set; }
        public string Description { get; set; }
        public string DisplayName { get; set; }
        public string Explanation { get; set; }
        public bool IsNullable { get; set; }
        public bool IsPrimaryKey { get; set; }
        public bool IsReadOnly { get; set; }
        public string MaximumLength { get; set; }
        public string MaximumValue { get; set; }
        public string MinimumValue { get; set; }
        public string Name { get; set; }
        public string Purpose { get; set; }
        public string SourceName { get; set; }
        public int SourceOrdering { get; set; }
        public string AttributeContext { get; set; }
        public string AttributeGroupName { get; set; }
        public List<AttributeExpectedValue> Members { get; set; }
    }
}
