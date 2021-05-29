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
            bool updateResults = false;
            string testName = "TestForeignKeyOneToOneCardinality";
            {
                string entityName = "Person";

                AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();

                List<AttributeExpectedValue> expected_default = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_normalized = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_referenceOnly = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_structured = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_normalized_structured = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_referenceOnly_normalized = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_referenceOnly_structured = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new List<AttributeExpectedValue>();

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
                    expected_referenceOnly_normalized_structured,
                    updateResults
                );
            }
            {
                string entityName = "PersonContact";

                AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();

                List<AttributeExpectedValue> expected_default = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_normalized = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_referenceOnly = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_structured = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_normalized_structured = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_referenceOnly_normalized = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_referenceOnly_structured = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new List<AttributeExpectedValue>();

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
                    expected_referenceOnly_normalized_structured,
                    updateResults
                );
            }
        }

        /// <summary>
        /// Resolution Guidance Test - Many:Many Cardinality
        /// </summary>
        [TestMethod]
        public async Task TestForeignKeyManyToManyCardinality()
        {
            bool updateResults = false;

            string testName = "TestForeignKeyManyToManyCardinality";
            {
                string entityName = "Customer";

                AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();

                List<AttributeExpectedValue> expected_default = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_normalized = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_referenceOnly = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_structured = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_normalized_structured = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_referenceOnly_normalized = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_referenceOnly_structured = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new List<AttributeExpectedValue>();

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
                    expected_referenceOnly_normalized_structured,
                    updateResults
                );
            }
            {
                string entityName = "Product";

                AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();

                List<AttributeExpectedValue> expected_default = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_normalized = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_referenceOnly = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_structured = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_normalized_structured = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_referenceOnly_normalized = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_referenceOnly_structured = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new List<AttributeExpectedValue>();

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
                    expected_referenceOnly_normalized_structured,
                    updateResults
                );
            }
            {
                string entityName = "Sales";

                AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();

                List<AttributeExpectedValue> expected_default = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_normalized = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_referenceOnly = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_structured = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_normalized_structured = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_referenceOnly_normalized = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_referenceOnly_structured = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new List<AttributeExpectedValue>();

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
                    expected_referenceOnly_normalized_structured,
                    updateResults
                );
            }
        }

        /// <summary>
        /// Resolution Guidance Test - One:Many Cardinality
        /// </summary>
        [TestMethod]
        public async Task TestForeignKeyOneToManyCardinality()
        {
            bool updateResults = false;
            string testName = "TestForeignKeyOneToManyCardinality";
            {
                string entityName = "Team";

                AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();

                List<AttributeExpectedValue> expected_default = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_normalized = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_referenceOnly = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_structured = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_normalized_structured = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_referenceOnly_normalized = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_referenceOnly_structured = new List<AttributeExpectedValue>();
                List<AttributeExpectedValue> expected_referenceOnly_normalized_structured = new List<AttributeExpectedValue>();

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
                    expected_referenceOnly_normalized_structured,
                    updateResults
                );
            }
            {
                string entityName = "Employee";

                AttributeContextExpectedValue expectedContext_default = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_normalized = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_structured = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_normalized_structured = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly_structured = new AttributeContextExpectedValue();
                AttributeContextExpectedValue expectedContext_referenceOnly_normalized_structured = new AttributeContextExpectedValue();

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
                    expected_referenceOnly_normalized_structured,
                    updateResults
                );
            }
        }
    }
}
