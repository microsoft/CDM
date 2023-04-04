// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json.Linq;

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Utilities
{
    [TestClass]
    public class TestHelperTests
    {
        private readonly static string testSubpath = "Utilities";

        /// <summary>
        /// Tests that our object comparison method correctly allows the Syms 'actual' object
        /// to contain new properties that are not found in the 'expected' Syms object. This is to avoid issues when
        /// Syms adds new properties. This only occurs for Syms comparisons
        /// </summary>
        [TestMethod]
        public void TestObjectEqualityWithSymsPropertyAdditions()
        {
            string testName = "TestObjectEqualityWithSymsPropertyAdditions";
            string expected = TestHelper.GetInputFileContent(testSubpath, testName, "expected.json");
            string actual = TestHelper.GetInputFileContent(testSubpath, testName, "actual.json");

            var actualCanHaveExtraProps = SymsTestHelper.JsonObjectShouldBeEqualAsExpected(expected, actual);
            Assert.IsTrue(actualCanHaveExtraProps);
            var expectedCannotHaveExtraProps = SymsTestHelper.JsonObjectShouldBeEqualAsExpected(actual, expected);
            Assert.IsFalse(expectedCannotHaveExtraProps);

            // the above should only be valid for Syms, not in the general CompareObjectsContent method
            // here, ignoreExtraValuesInActual is false
            JToken expectedObject = JToken.Parse(expected);
            JToken actualObject = JToken.Parse(actual);

            var actualHasExtraProps = TestHelper.CompareObjectsContent(expectedObject, actualObject);
            Assert.IsFalse(actualHasExtraProps);
            var expectedHasExtraProps = TestHelper.CompareObjectsContent(actualObject, expectedObject);
            Assert.IsFalse(expectedHasExtraProps);
        }
    }
}
