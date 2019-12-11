
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
        private string testsSubpath = Path.Combine("Persistence", "ModelJson", "DataPartition");

        /// <summary>
        /// Testing whether DataPartition Location is consistently populated when:
        /// 1. Manifest is read directly.
        /// 2. Manifest is obtained by converting a model.json.
        /// </summary>
        [TestMethod]
        public async Task TestModelJsonDataPartitionLocationConsistency()
        {
            var inputPath = TestHelper.GetInputFolderPath(testsSubpath, "TestModelJsonDataPartitionLocationConsistency");
            var cdmCorpus = this.GetLocalCorpus(inputPath);
            var manifestRead = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("default.manifest.cdm.json", cdmCorpus.Storage.FetchRootFolder("local"));
            Assert.AreEqual("EpisodeOfCare/partition-data.csv", manifestRead.Entities[0].DataPartitions[0].Location);

            var convertedToModelJson = await modelJsonPersistence.ManifestPersistence.ToData(manifestRead, null, null);
            string location = (convertedToModelJson.Entities[0]["partitions"][0]["location"] as JValue).Value<string>();
            // Model Json uses absolute adapter path.
            Assert.IsTrue(location.Contains("\\Microsoft.CommonDataModel\\Microsoft.CommonDataModel.ObjectModel.Tests\\TestData\\Persistence\\ModelJson\\DataPartition\\TestModelJsonDataPartitionLocationConsistency\\Input\\EpisodeOfCare\\partition-data.csv"));

            var cdmCorpus2 = this.GetLocalCorpus(inputPath);
            var manifestAfterConvertion = await modelJsonPersistence.ManifestPersistence.FromData(cdmCorpus2.Ctx, convertedToModelJson, cdmCorpus2.Storage.FetchRootFolder("local"));
            Assert.AreEqual("EpisodeOfCare/partition-data.csv", manifestAfterConvertion.Entities[0].DataPartitions[0].Location);

            var cdmCorpus3 = this.GetLocalCorpus(inputPath);
            var readFile = TestHelper.GetInputFileContent(testsSubpath, "TestModelJsonDataPartitionLocationConsistency", "model.json");
            var namespaceFolder = cdmCorpus3.Storage.FetchRootFolder("local");
            var modelJsonAsString = readFile.Replace("C:\\\\cdm\\\\CDM.ObjectModel.CSharp\\\\Microsoft.CommonDataModel\\\\Microsoft.CommonDataModel.ObjectModel.Tests\\\\TestData\\\\Persistence\\\\ModelJson\\\\DataPartition\\\\TestModelJsonDataPartitionLocationConsistency\\\\Input\\\\EpisodeOfCare\\\\partition-data.csv",
                location.Replace("\\", "\\\\"));

            var manifestReadFromModelJson = await modelJsonPersistence.ManifestPersistence.FromData(cdmCorpus3.Ctx, JsonConvert.DeserializeObject<Model>(modelJsonAsString), namespaceFolder);
            Assert.AreEqual("EpisodeOfCare/partition-data.csv", manifestReadFromModelJson.Entities[0].DataPartitions[0].Location);

        }
    }
}
