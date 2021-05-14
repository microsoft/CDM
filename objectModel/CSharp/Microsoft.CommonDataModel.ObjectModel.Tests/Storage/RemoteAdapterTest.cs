// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.CommonDataModel.ObjectModel.Cdm;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Storage
{
    class RemoteAdapterTest
    {
        /// <summary>
        /// The Storage path.
        /// </summary>
        private string testsSubpath = "Storage";
        
        /// <summary>
        /// Test that with a remote adapter configured, the partition paths get properly turned to their mapped keys.
        /// </summary>
        [TestMethod]
        public async void TestModelJsonRemoteAdapterConfig()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestModelJsonRemoteAdapterConfig");

            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("model.json");

            // Confirm that the partition URL has been mapped to 'contoso' by RemoteAdapter

            Assert.IsNotNull(manifest, "Manifest loaded from model.json should not be null");
            Assert.AreEqual(manifest.Entities.Count, 1,
                    "There should be only one entity loaded from model.json");
            Assert.AreEqual(manifest.Entities[0].DataPartitions.Count, 1,
                    "There should be only one partition attached to the entity loaded from model.json");
            Assert.AreEqual(manifest.Entities[0].DataPartitions[0].Location, "remote:/contoso/some/path/partition-data.csv",
                    "The partition location loaded from model.json did not match");
        }
    }
}
