// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.Projection
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.IO;

    /// <summary>
    /// Unit test for CardinalitySetting functions
    /// </summary>
    /// <returns></returns>
    [TestClass]
    public class CardinalitySettingUnitTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "Projection", "CardinalitySettingUnitTest");

        /// <summary>
        /// Unit test for CardinalitySetting.IsMinimumValid
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public void TestMinimum()
        {
            string testName = "TestMinimum";

            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    if (!message.Contains("CardinalitySettings | Invalid minimum cardinality -1."))
                        Assert.Fail($"Some unexpected failure - {message}!");
                }
            }, CdmStatusLevel.Warning);

            // Create Dummy Type Attribute
            CdmTypeAttributeDefinition attribute = corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, nameOrRef: "dummyAttribute", simpleNameRef: false);
            attribute.Cardinality = new CardinalitySettings(attribute)
            {
                Minimum = "-1"
            };
        }

        /// <summary>
        /// Unit test for CardinalitySetting.IsMaximumValid
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public void TestMaximum()
        {
            string testName = "TestMaximum";

            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    if (!message.Contains("CardinalitySettings | Invalid maximum cardinality Abc."))
                        Assert.Fail($"Some unexpected failure - {message}!");
                }
            }, CdmStatusLevel.Warning);

            // Create Dummy Type Attribute
            CdmTypeAttributeDefinition attribute = corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, nameOrRef: "dummyAttribute", simpleNameRef: false);
            attribute.Cardinality = new CardinalitySettings(attribute)
            {
                Maximum = "Abc"
            };
        }
    }
}
