// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.DataPartition
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.IO;
    using System.Threading.Tasks;

    [TestClass]
    public class DataPartitionTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "DataPartition");

        /// <summary>
        /// Tests refreshing data partition gets file size
        /// </summary>
        [TestMethod]
        public async Task TestRefreshesDataPartition()
        {
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, "TestRefreshesDataPartition");
            var cdmManifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("local:/partitions.manifest.cdm.json");
            var fileStatusCheckOptions = new FileStatusCheckOptions { IncludeDataPartitionSize = true };

            var partitionEntity = cdmManifest.Entities[0];
            Assert.AreEqual(partitionEntity.DataPartitions.Count, 1);
            var partition = partitionEntity.DataPartitions[0];

            await cdmManifest.FileStatusCheckAsync(fileStatusCheckOptions: fileStatusCheckOptions);
            
            var localTraitIndex = partition.ExhibitsTraits.IndexOf("is.partition.size");
            Assert.AreNotEqual(localTraitIndex, -1);
            var localTrait = partition.ExhibitsTraits[localTraitIndex] as CdmTraitReference;
            Assert.AreEqual(localTrait.NamedReference, "is.partition.size");
            Assert.AreEqual(localTrait.Arguments[0].Value, 2);
        }
    }
}
