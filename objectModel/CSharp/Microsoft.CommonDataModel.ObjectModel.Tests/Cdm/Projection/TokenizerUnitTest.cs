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
    /// Unit test for Tokenizer functions
    /// </summary>
    /// <returns></returns>
    [TestClass]
    public class TokenizerUnitTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "Projection", "TokenizerUnitTest");

        [TestMethod]
        public void TestGetExpressionAsTokenList()
        {
            List<Tuple<string, string>> exprAndExpectedList = new List<Tuple<string, string>>();
            {
                exprAndExpectedList.Add(new Tuple<string, string>("(cardinality.maximum > 1) && (!referenceOnly)", "( cardinality.maximum > 1 ) && ( ! referenceOnly )"));
                exprAndExpectedList.Add(new Tuple<string, string>("", ""));
                exprAndExpectedList.Add(new Tuple<string, string>("  ", ""));
                exprAndExpectedList.Add(new Tuple<string, string>("always", "always"));
                exprAndExpectedList.Add(new Tuple<string, string>("!structured", "! structured"));
                exprAndExpectedList.Add(new Tuple<string, string>("referenceOnly || (depth > 5)", "referenceOnly || ( depth > 5 )"));
                exprAndExpectedList.Add(new Tuple<string, string>("!(referenceOnly)", "! ( referenceOnly )"));
                exprAndExpectedList.Add(new Tuple<string, string>("!(normalized && cardinality.maximum > 1)", "! ( normalized && cardinality.maximum > 1 )"));
                exprAndExpectedList.Add(new Tuple<string, string>("true", "true"));
                exprAndExpectedList.Add(new Tuple<string, string>("(((true==true)))", "( ( ( true == true ) ) )"));
                exprAndExpectedList.Add(new Tuple<string, string>("!normalized || (cardinality.maximum <= 1)", "! normalized || ( cardinality.maximum <= 1 )"));
                exprAndExpectedList.Add(new Tuple<string, string>("!(normalized && cardinality.maximum > 1) && !(structured)", "! ( normalized && cardinality.maximum > 1 ) && ! ( structured )"));
                exprAndExpectedList.Add(new Tuple<string, string>("!(unknownToken != 1 && cardinality.maximum >                                       1) && !anotherUnknownToken", "! ( unknownToken != 1 && cardinality.maximum > 1 ) && ! anotherUnknownToken"));
                exprAndExpectedList.Add(new Tuple<string, string>("!(normalized && isArray) || noMaxDepth", "! ( normalized && isArray ) || noMaxDepth"));
            }

            foreach (var item in exprAndExpectedList)
            {
                string expected = item.Item2;
                List<Tuple<dynamic, PredefinedType>> expTupleList = Tokenizer.GetExpressionAsTokenList(item.Item1);
                List<string> expList = new List<string>();
                foreach (Tuple<dynamic, PredefinedType> t in expTupleList)
                {
                    expList.Add(t.Item1.ToString());
                }
                string actual = string.Join(" ", expList.ToArray());
                Assert.AreEqual(expected, actual);
            }
        }
    }
}
