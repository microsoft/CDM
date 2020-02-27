// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence.ModelJson
{
    using System.IO;

    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using modelJsonPersistence = Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson;

    using Newtonsoft.Json;
    using System.Threading.Tasks;
    using Newtonsoft.Json.Linq;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types;

    [TestClass]
    public class DataPartitionTest : ModelJsonTestsBase
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private readonly string testsSubpath = Path.Combine("Persistence", "ModelJson", "DataPartition");

        /// <summary>
        /// Testing whether DataPartition Location is consistently populated when:
        /// 1. Manifest is read directly.
        /// 2. Manifest is obtained by converting a model.json.
        /// </summary>
        [TestMethod]
        public async Task TestModelJsonDataPartitionLocationConsistency()
        {
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, "TestModelJsonDataPartitionLocationConsistency");
            var manifestRead = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("default.manifest.cdm.json", cdmCorpus.Storage.FetchRootFolder("local"));
            Assert.AreEqual("EpisodeOfCare/partition-data.csv", manifestRead.Entities[0].DataPartitions[0].Location);

            var convertedToModelJson = await modelJsonPersistence.ManifestPersistence.ToData(manifestRead, null, null);
            string location = (convertedToModelJson.Entities[0]["partitions"][0]["location"] as JValue).Value<string>();
            // Model Json uses absolute adapter path.
            Assert.IsTrue(location.Contains("\\Microsoft.CommonDataModel.ObjectModel.Tests\\TestData\\Persistence\\ModelJson\\DataPartition\\TestModelJsonDataPartitionLocationConsistency\\Input\\EpisodeOfCare\\partition-data.csv"));

            var cdmCorpus2 = TestHelper.GetLocalCorpus(testsSubpath, "TestModelJsonDataPartitionLocationConsistency");
            var manifestAfterConvertion = await modelJsonPersistence.ManifestPersistence.FromObject(cdmCorpus2.Ctx, convertedToModelJson, cdmCorpus2.Storage.FetchRootFolder("local"));
            Assert.AreEqual("EpisodeOfCare/partition-data.csv", manifestAfterConvertion.Entities[0].DataPartitions[0].Location);
        }
    }
}
