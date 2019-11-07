namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.Tools.Processor;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.IO;
    using System.Threading.Tasks;

    [TestClass]
    public class PersistenceLayerTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Persistence", "PersistenceLayer");

        [TestMethod]
        public async Task TestInvalidJson()
        {
            var testInputPath = TestHelper.GetInputFolderPath(testsSubpath, "TestInvalidJson");

            CdmCorpusDefinition corpus = new CdmCorpusDefinition();
            corpus.SetEventCallback(new EventCallback{ Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);
            corpus.Storage.Mount("local", new LocalAdapter(testInputPath));
            corpus.Storage.DefaultNamespace = "local";

            CdmManifestDefinition invalidManifest = null;
            try
            {
                invalidManifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/invalidManifest.manifest.cdm.json");
            }
            catch (Exception e)
            {
                Assert.Fail("Error should not be thrown when input json is invalid.");
            }
            Assert.IsNull(invalidManifest);
        }
    }
}
