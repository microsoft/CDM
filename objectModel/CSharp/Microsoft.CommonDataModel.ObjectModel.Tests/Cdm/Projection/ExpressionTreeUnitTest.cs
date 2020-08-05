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
            InputValues input = new InputValues()
            {
                maxCardinality = 1,
                minCardinality = 0,
                maxDepth = 32,
                nextDepth = 1,
                noMaxDepth = true,
                isArray = true,
                normalized = false,
                referenceOnly = true,
                structured = true
            };

            List<Tuple<string, string>> exprAndExpectedResultList = new List<Tuple<string, string>>();
            {
                exprAndExpectedResultList.Add(new Tuple<string, string>("(cardinality.maximum > 1) && (!referenceOnly)", "False"));
                exprAndExpectedResultList.Add(new Tuple<string, string>("", "False"));
                exprAndExpectedResultList.Add(new Tuple<string, string>("  ", "False"));
                exprAndExpectedResultList.Add(new Tuple<string, string>("always", "True"));
                exprAndExpectedResultList.Add(new Tuple<string, string>("!structured", "False"));
                exprAndExpectedResultList.Add(new Tuple<string, string>("referenceOnly || (depth > 5)", "True"));
                exprAndExpectedResultList.Add(new Tuple<string, string>("!(referenceOnly)", "False"));
                exprAndExpectedResultList.Add(new Tuple<string, string>("!(normalized && cardinality.maximum > 1)", "True"));
                exprAndExpectedResultList.Add(new Tuple<string, string>("true", "True"));
                exprAndExpectedResultList.Add(new Tuple<string, string>("(((true==true)))", "True"));
                exprAndExpectedResultList.Add(new Tuple<string, string>("!(normalized && isArray) || noMaxDepth", "False"));
            }

            foreach (var item in exprAndExpectedResultList)
            {
                ExpressionTree tree = new ExpressionTree();
                Node treeTop = tree.ConstructExpressionTree(item.Item1);
                string expected = item.Item2;
                string actual = ExpressionTree.EvaluateExpressionTree(treeTop, input).ToString();

                Assert.AreEqual(expected, actual);
            }
        }
    }
}
