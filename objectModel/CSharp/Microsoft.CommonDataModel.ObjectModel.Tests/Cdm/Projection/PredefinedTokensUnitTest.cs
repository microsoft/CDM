// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Collections.Generic;
    using System.IO;

    /// <summary>
    /// Unit test for PredefinedTokens functions
    /// </summary>
    /// <returns></returns>
    [TestClass]
    public class PredefinedTokensUnitTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "Projection", "PredefinedTokensUnitTest");

        [TestMethod]
        public void TestGetPredefinedTokens()
        {
            List<string> tokens = PredefinedTokens.GetPredefinedTokens();

            string expected = "always depth maxDepth noMaxDepth isArray cardinality.minimum cardinality.maximum referenceOnly normalized structured";
            string actual = string.Join(" ", tokens.ToArray());
            Assert.AreEqual(expected, actual);
        }

        [TestMethod]
        public void TestPredefinedConstants()
        {
            List<string> constants = PredefinedTokens.GetPredefinedConstants();

            string expected = "true false";
            string actual = string.Join(" ", constants.ToArray());
            Assert.AreEqual(expected, actual);
        }

        [TestMethod]
        public void TestGetSupportedOperators()
        {
            List<string> ops = PredefinedTokens.GetSupportedOperators();

            // all expect the '!' operator since that is tagged separately
            string expected = "&& || > < == != >= <=";
            string actual = string.Join(" ", ops.ToArray());
            Assert.AreEqual(expected, actual);
        }

        [TestMethod]
        public void TestGetSupportedParenthesis()
        {
            List<string> ops = PredefinedTokens.GetSupportedParenthesis();

            string expected = "( )";
            string actual = string.Join(" ", ops.ToArray());
            Assert.AreEqual(expected, actual);
        }
    }
}
