// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using System.IO;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.Resolution;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    /// <summary>
    /// Tests to verify if resolution of trait groups performs as expected.
    /// </summary>
    [TestClass]
    public class EntityResolutionTraitGroupTests
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private readonly string testsSubpath = Path.Combine("Cdm", "Resolution", "EntityResolution");

        /// <summary>
        /// Verify success case and make sure the entities are resolved
        /// </summary>
        [TestMethod]
        public async Task TestResolvedTraitGroupE2E()
        {
            await ResolutionTestUtils.ResolveSaveDebuggingFileAndAssert(testsSubpath, "TestResolvedTraitGroup", "E2EResolution");
        }

        /// <summary>
        /// Verify that the traits are assigned appropriately.
        /// AND no errors or warnings are thrown.
        /// If the optional traitgroups are not ignored, then this will fail.
        /// </summary>
        [TestMethod]
        public async Task TestTraitsFromTraitGroup()
        {
            CdmCorpusDefinition cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, "TestResolvedTraitGroup");

            cdmCorpus.SetEventCallback(new EventCallback { Invoke = (CdmStatusLevel statusLevel, string message) =>
            {
                Assert.Fail($"Received {statusLevel} message: {message}");
            }
            }, CdmStatusLevel.Warning);

            var ent = await cdmCorpus.FetchObjectAsync<CdmEntityDefinition>("local:/E2EResolution/Contact.cdm.json/Contact");
            await ent.CreateResolvedEntityAsync("Contact_");
        }
    }
}
