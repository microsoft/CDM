// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Tests.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    [TestClass]
    public class ResolutionGuidanceFilterInTest : CommonTest
    {
        /// <summary>
        /// Resolution Guidance Test - FilterIn - Some
        /// </summary>
        [TestMethod]
        public async Task TestFilterInSome()
        {
            bool updateResults = false;
            string testName = "TestFilterInSome";
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
                string entityName = "EmployeeNames";

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
        /// Resolution Guidance Test - FilterIn - Some With AttributeGroupRef
        /// </summary>
        [TestMethod]
        public async Task TestFilterInSomeWithAttributeGroupRef()
        {
            bool updateResults = false;
            string testName = nameof(TestFilterInSomeWithAttributeGroupRef);
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
                string entityName = "EmployeeNames";

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
        /// Resolution Guidance Test - FilterIn - All
        /// </summary>
        [TestMethod]
        public async Task TestFilterInAll()
        {
            bool updateResults = false;
            string testName = nameof(TestFilterInAll);
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
                string entityName = "EmployeeNames";

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
        /// Resolution Guidance Test - FilterIn - All With AttributeGroupRef
        /// </summary>
        [TestMethod]
        public async Task TestFilterInAllWithAttributeGroupRef()
        {
            bool updateResults = false;
            string testName = nameof(TestFilterInAllWithAttributeGroupRef);
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
                string entityName = "EmployeeNames";

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
    }
}
