// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.Projection
{
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Collections.Generic;
    using System.IO;

    /// <summary>
    /// Unit test for ExpressionTree functions
    /// </summary>
    /// <returns></returns>
    [TestClass]
    public class ExpressionTreeUnitTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "Projection", "ExpressionTreeUnitTest");

        /// <summary>
        /// Test EvaluateExpression function
        /// </summary>
        [TestMethod]
        public void TestEvaluateExpression()
        {
            InputValues inputValues = new InputValues()
            {
                MaxCardinality = 1,
                MinCardinality = 0,
                MaxDepth = 32,
                NextDepth = 1,
                NoMaxDepth = true,
                IsArray = true,
                Normalized = false,
                ReferenceOnly = true,
                Structured = true
            };

            List<Tuple<string, bool>> exprAndExpectedResultList = new List<Tuple<string, bool>>();
            {
                exprAndExpectedResultList.Add(new Tuple<string, bool>("(cardinality.maximum > 1) && (!referenceOnly)", false));
                exprAndExpectedResultList.Add(new Tuple<string, bool>("", true));
                exprAndExpectedResultList.Add(new Tuple<string, bool>("  ", true));
                exprAndExpectedResultList.Add(new Tuple<string, bool>("always", true));
                exprAndExpectedResultList.Add(new Tuple<string, bool>("!structured", false));
                exprAndExpectedResultList.Add(new Tuple<string, bool>("referenceOnly || (depth > 5)", true));
                exprAndExpectedResultList.Add(new Tuple<string, bool>("!(referenceOnly)", false));
                exprAndExpectedResultList.Add(new Tuple<string, bool>("!(normalized && cardinality.maximum > 1)", true));
                exprAndExpectedResultList.Add(new Tuple<string, bool>("true", true));
                exprAndExpectedResultList.Add(new Tuple<string, bool>("(((true==true)))", true));
                exprAndExpectedResultList.Add(new Tuple<string, bool>("!(normalized && isArray) || noMaxDepth", false));
            }

            foreach (var item in exprAndExpectedResultList)
            {
                bool actual = ExpressionTree.EvaluateCondition(item.Item1, inputValues);
                bool expected = item.Item2;

                Assert.AreEqual(expected, actual);
            }
        }
    }
}
