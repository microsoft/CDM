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
    public class ReferencedEntityDeclarationTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private readonly string testsSubpath = Path.Combine("Persistence", "CdmFolder", "ReferencedEntityDeclaration");

        /// <summary>
        /// Testing for folder impl instance with referenced entity declaration.
        /// </summary>
        [TestMethod]
        public async Task TestLoadReferencedEntity()
        {
            var content = TestHelper.GetInputFileContent(testsSubpath, "TestLoadReferencedEntity", "entities.manifest.cdm.json");
            var cdmManifest = ManifestPersistence.FromObject(new ResolveContext(new CdmCorpusDefinition(), null), "testEntity", "testNamespace", "/", JsonConvert.DeserializeObject<ManifestContent>(content));
            Assert.AreEqual(cdmManifest.Entities.Count, 1);
            Assert.AreEqual(cdmManifest.Entities[0].ObjectType, CdmObjectType.ReferencedEntityDeclarationDef);
            var entity = cdmManifest.Entities[0];
            Assert.AreEqual(entity.EntityName, "testEntity");
            Assert.AreEqual(entity.Explanation, "test explanation");
            Assert.AreEqual(entity.EntityPath, "testNamespace:/testPath");
            Assert.AreEqual(entity.ExhibitsTraits.Count, 1);
        }
    }
}