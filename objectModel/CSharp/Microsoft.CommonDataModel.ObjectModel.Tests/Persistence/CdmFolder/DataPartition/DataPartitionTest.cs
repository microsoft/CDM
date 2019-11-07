namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence.CdmFolder
{
    using System.IO;
    using System.Threading.Tasks;

    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    using Newtonsoft.Json;

    [TestClass]
    public class DataPartitionTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Persistence", "CdmFolder", "DataPartition");

        /// <summary>
        /// Testing for folder impl instance with local entity declaration having data partitions.
        /// </summary>
        [TestMethod]
        public void TestLoadLocalEntitiyWithDataPartition()
        {
            var content = TestHelper.GetInputFileContent(testsSubpath, "TestLoadLocalEntityWithDataPartition", "entities.manifest.cdm.json");
            var cdmManifest = ManifestPersistence.FromData(new ResolveContext(new CdmCorpusDefinition(), null), "entities", "testNamespace", "/", JsonConvert.DeserializeObject<ManifestContent>(content));
            Assert.AreEqual(cdmManifest.Entities.Count, 1);
            Assert.AreEqual(cdmManifest.Entities[0].ObjectType, CdmObjectType.LocalEntityDeclarationDef);
            var entity = cdmManifest.Entities[0];
            Assert.AreEqual(entity.DataPartitions.Count, 1);
            var partition = entity.DataPartitions[0];
            Assert.AreEqual(partition.Location, "test/location");
            Assert.AreEqual(TimeUtils.GetFormattedDateString(partition.LastFileModifiedTime), "2008-09-15T23:53:23.000Z");
            Assert.AreEqual(partition.ExhibitsTraits.Count, 1);
            Assert.AreEqual(partition.SpecializedSchema, "teststring");

            var testList = partition.Arguments["test"];
            Assert.AreEqual(testList.Count, 2);
            Assert.AreEqual(testList[0], "something");
            Assert.AreEqual(testList[1], "somethingelse");

            var keyList = partition.Arguments["KEY"];
            Assert.AreEqual(keyList.Count, 1);
            Assert.AreEqual(keyList[0], "VALUE");

            Assert.IsFalse(partition.Arguments.ContainsKey("wrong"));
        }
    }
}