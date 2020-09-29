// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
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

        /// <summary>
        /// Tests the FetchObjectAsync function with the lazy imports load.
        /// </summary>
        [TestMethod]
        public async Task TestLazyLoadImports()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestImportsLoadStrategy");
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (level, message) =>
                {
                    // when the imports are not loaded, there should be no reference validation.
                    // no error should be logged.
                    Assert.Fail(message);
                }
            }, CdmStatusLevel.Warning);

            // load with deferred imports.
            var resOpt = new ResolveOptions()
            {
                ImportsLoadStrategy = ImportsLoadStrategy.LazyLoad
            };
            await corpus.FetchObjectAsync<CdmDocumentDefinition>("local:/doc.cdm.json", null, resOpt);
        }

        /// <summary>
        /// Tests the FetchObjectAsync function with the imports load strategy set to load.
        /// </summary>
        [TestMethod]
        public async Task TestLoadImports()
        {
            int errorCount = 0;
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestImportsLoadStrategy");
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (level, message) =>
                {
                    if (message.Contains("Unable to resolve the reference"))
                    {
                        errorCount++;
                    }
                    else
                    {
                        Assert.Fail(message);
                    }

                }
            }, CdmStatusLevel.Error);

            // load imports.
            var resOpt = new ResolveOptions()
            {
                ImportsLoadStrategy = ImportsLoadStrategy.Load
            };
            await corpus.FetchObjectAsync<CdmDocumentDefinition>("local:/doc.cdm.json", null, resOpt);
            Assert.AreEqual(1, errorCount);

            errorCount = 0;
            corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestImportsLoadStrategy");
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (level, message) =>
                {
                    if (level == CdmStatusLevel.Warning && message.Contains("Unable to resolve the reference"))
                    {
                        errorCount++;
                    }
                    else
                    {
                        Assert.Fail(message);
                    }

                }
            }, CdmStatusLevel.Warning);

            // load imports with shallow validation.
            resOpt = new ResolveOptions()
            {
                ImportsLoadStrategy = ImportsLoadStrategy.Load,
                ShallowValidation = true
            };
            await corpus.FetchObjectAsync<CdmDocumentDefinition>("local:/doc.cdm.json", null, resOpt);
            Assert.AreEqual(1, errorCount);
        }
    }
}
