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
    public class DataPartitionPatternTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private readonly string testsSubpath = Path.Combine("Persistence", "CdmFolder", "DataPartitionPattern");

        /// <summary>
        /// Testing for folder with local entity declaration with data partition patterns.
        /// </summary>
        [TestMethod]
        public void TestLoadLocalEntitiyWithDataPartitionPattern()
        {
            var content = TestHelper.GetInputFileContent(testsSubpath, "TestLoadLocalEntityWithDataPartitionPattern", "entities.manifest.cdm.json");

            var cdmManifest = ManifestPersistence.FromData(new ResolveContext(new CdmCorpusDefinition(), null), "entities", "testNamespace", "/", JsonConvert.DeserializeObject<ManifestContent>(content));
            Assert.AreEqual(cdmManifest.Entities.Count, 1);
            Assert.AreEqual(cdmManifest.Entities[0].ObjectType, CdmObjectType.LocalEntityDeclarationDef);
            var entity = cdmManifest.Entities[0];
            Assert.AreEqual(entity.DataPartitionPatterns.Count, 1);
            var pattern = entity.DataPartitionPatterns[0];
            Assert.AreEqual(pattern.Name, "testPattern");
            Assert.AreEqual(pattern.Explanation, "test explanation");
            Assert.AreEqual(pattern.RootLocation, "test location");
            Assert.AreEqual(pattern.RegularExpression.ToString(), "\\s*");
            Assert.AreEqual(pattern.Parameters.Count, 2);
            Assert.AreEqual(pattern.Parameters[0], "testParam1");
            Assert.AreEqual(pattern.Parameters[1], "testParam2");
            Assert.AreEqual(pattern.SpecializedSchema, "test special schema");
            Assert.AreEqual(pattern.ExhibitsTraits.Count, 1);
        }
    }
}