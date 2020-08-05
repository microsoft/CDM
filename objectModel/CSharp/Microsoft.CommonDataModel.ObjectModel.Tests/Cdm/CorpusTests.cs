// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.IO;
    using System.Threading.Tasks;

    /// <summary>
    /// Test methods for the CdmCorpusDefinition class.
    /// </summary>
    [TestClass]
    public class CorpusTests
    {
        private readonly string testsSubpath = Path.Combine("Cdm", "Corpus");

        /// <summary>
        /// Tests if a symbol imported with a moniker can be found as the last resource.
        /// When resolving symbolEntity with respect to wrtEntity, the symbol fromEntity should be found correctly.
        /// </summary>
        [TestMethod]
        public async Task TestResolveSymbolReference()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestResolveSymbolReference");
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    Assert.Fail(message);
                }
            }, CdmStatusLevel.Warning);

            var wrtEntity = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/wrtEntity.cdm.json/wrtEntity");
            var resOpt = new ResolveOptions(wrtEntity, new AttributeResolutionDirectiveSet());
            await wrtEntity.CreateResolvedEntityAsync("NewEntity", resOpt);
        }

        /// <summary>
        /// Tests if ComputeLastModifiedTimeAsync doesn't log errors related to reference validation.
        /// </summary>
        [TestMethod]
        public async Task TestComputeLastModifiedTimeAsync()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestComputeLastModifiedTimeAsync");
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (level, message) =>
                {
                    Assert.Fail(message);
                }
            }, CdmStatusLevel.Error);

            await corpus.ComputeLastModifiedTimeAsync("local:/default.manifest.cdm.json");
        }
    }
}
