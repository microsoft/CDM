// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.Projection
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;

    /// <summary>
    /// Tests all the projections will not break the OM even if not implemented.
    /// </summary>
    [TestClass]
    public class ForwardCompatibilityTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private readonly string testsSubpath = Path.Combine("Cdm", "Projection", "ForwardCompatibilityTest");

        /// <summary>
        /// Tests running all the projections (includes projections that are not implemented).
        /// </summary>
        [TestMethod]
        public async Task TestAllOperations()
        {
            string testName = "TestAllOperations";
            string entityName = testName;
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    if (!message.Contains("Projection operation not implemented yet."))
                    {
                        Assert.Fail($"'Some unexpected failure - {message}!");
                    }
                }
            }, CdmStatusLevel.Error);
            string expectedOutputPath = TestHelper.GetExpectedOutputFolderPath(testsSubpath, testName);

            CdmEntityDefinition entTestEntityStringReference = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            Assert.IsNotNull(entTestEntityStringReference);
            CdmEntityDefinition resolvedTestEntityStringReference = await ProjectionTestUtils.GetResolvedEntity(corpus, entTestEntityStringReference, new List<string> { "referenceOnly" });
            Assert.IsNotNull(resolvedTestEntityStringReference);
            await AttributeContextUtil.ValidateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityStringReference);
        }
    }
}
