// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Tests.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    [TestClass]
    public class ResolutionGuidanceFilterOutTest : CommonTest
    {
        /// <summary>
        /// Resolution Guidance Test - FilterOut - Some
        /// </summary>
        [TestMethod]
        public async Task TestFilterOutSome()
        {
            bool updateResults = false;
            string testName = "TestFilterOutSome";
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
        /// Resolution Guidance Test - FilterOut - Some With AttributeGroupRef
        /// </summary>
        [TestMethod]
        public async Task TestFilterOutSomeWithAttributeGroupRef()
        {
            bool updateResults = false;
            string testName = "TestFilterOutSomeWithAttributeGroupRef";
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
        /// Resolution Guidance Test - FilterOut - All
        /// </summary>
        [TestMethod]
        public async Task TestFilterOutAll()
        {
            bool updateResults = false;
            string testName = "TestFilterOutAll";
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
        /// Resolution Guidance Test - FilterOut - All With AttributeGroupRef
        /// </summary>
        [TestMethod]
        public async Task TestFilterOutAllWithAttributeGroupRef()
        {
            bool updateResults = false;
            string testName = "TestFilterOutAllWithAttributeGroupRef";
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
