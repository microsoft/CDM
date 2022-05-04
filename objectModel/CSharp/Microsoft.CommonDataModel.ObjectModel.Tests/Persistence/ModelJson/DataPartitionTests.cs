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
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson;

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
            Assert.IsTrue(location.Contains("\\TestData\\Persistence\\ModelJson\\DataPartition\\TestModelJsonDataPartitionLocationConsistency\\Input\\EpisodeOfCare\\partition-data.csv"));

            var cdmCorpus2 = TestHelper.GetLocalCorpus(testsSubpath, "TestModelJsonDataPartitionLocationConsistency");
            var manifestAfterConvertion = await modelJsonPersistence.ManifestPersistence.FromObject(cdmCorpus2.Ctx, convertedToModelJson, cdmCorpus2.Storage.FetchRootFolder("local"));
            Assert.AreEqual("EpisodeOfCare/partition-data.csv", manifestAfterConvertion.Entities[0].DataPartitions[0].Location);
        }

        /// <summary>
        /// Tests that the trait is.partition.format.CSV is merged with the fileFormatSettings property during load.
        /// </summary>
        [TestMethod]
        public async Task TestLoadingCsvPartitionTraits()
        {
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestLoadingCsvPartitionTraits));
            var manifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("model.json");

            var dataPartition = manifest.Entities[0].DataPartitions[0];

            // Ensure that the fileFormatSettings and the is.partition.format.CSV trait got merged into one trait.
            Assert.AreEqual(1, dataPartition.ExhibitsTraits.Count);

            var csvTrait = dataPartition.ExhibitsTraits[0] as CdmTraitReference;

            Assert.AreEqual("true", csvTrait.Arguments[0].Value);
            Assert.AreEqual("CsvStyle.QuoteAlways", csvTrait.Arguments[1].Value);
            Assert.AreEqual(",", csvTrait.Arguments[2].Value);
            Assert.AreEqual("QuoteStyle.Csv", csvTrait.Arguments[3].Value);
            Assert.AreEqual("UTF-8", csvTrait.Arguments[4].Value);
            Assert.AreEqual("\n", csvTrait.Arguments[5].Value);
        }

        /// <summary>
        /// Tests that the trait is.partition.format.CSV is merged with the fileFormatSettings property during load.
        /// Given that the trait is does not have arguments present on fileFormatSettings.
        /// </summary>
        [TestMethod]
        public async Task TestLoadingCsvPartitionTraitsFromFileFormatSettings()
        {
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestLoadingCsvPartitionTraitsFromFileFormatSettings));
            var manifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("model.json");

            var dataPartition = manifest.Entities[0].DataPartitions[0];

            // Ensure that the fileFormatSettings and the is.partition.format.CSV trait got merged into one trait.
            Assert.AreEqual(1, dataPartition.ExhibitsTraits.Count);

            var csvTrait = dataPartition.ExhibitsTraits[0] as CdmTraitReference;

            Assert.AreEqual("\n", csvTrait.Arguments[0].Value);
            Assert.AreEqual("false", csvTrait.Arguments[1].Value);
            Assert.AreEqual("CsvStyle.QuoteAfterDelimiter", csvTrait.Arguments[2].Value);
            Assert.AreEqual(";", csvTrait.Arguments[3].Value);
            Assert.AreEqual("QuoteStyle.None", csvTrait.Arguments[4].Value);
            Assert.AreEqual("ASCII", csvTrait.Arguments[5].Value);
        }

        /// <summary>
        /// Tests that the trait is.partition.format.CSV is saved when contains arguments not supported by fileFormatSettings.
        /// </summary>
        [TestMethod]
        public async Task TestLoadingAndSavingCsvPartitionTraits()
        {
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestLoadingCsvPartitionTraitsFromFileFormatSettings));
            var manifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("model.json");

            // If the data partition trait is.partition.format.CSV being saved has arguments that are not supported by fileFormatSettings
            // the trait should also be persisted.
            var manifestData = await ManifestPersistence.ToData(manifest, new ResolveOptions(manifest.InDocument), new CopyOptions());
            var localEntity = manifestData.Entities[0].ToObject<LocalEntity>();
            Assert.AreEqual(1, localEntity.Partitions[0].Traits.Count);

            // Remove the argument that is not supported by fileFormatSettings and check if the trait is removed after that.
            var csvTrait = manifest.Entities[0].DataPartitions[0].ExhibitsTraits[0] as CdmTraitReference;
            csvTrait.Arguments.Remove(csvTrait.Arguments.Item("newline"));

            manifestData = await ManifestPersistence.ToData(manifest, new ResolveOptions(manifest.InDocument), new CopyOptions());
            localEntity = manifestData.Entities[0].ToObject<LocalEntity>();
            Assert.IsNull(localEntity.Partitions[0].Traits);
        }
    }
}
