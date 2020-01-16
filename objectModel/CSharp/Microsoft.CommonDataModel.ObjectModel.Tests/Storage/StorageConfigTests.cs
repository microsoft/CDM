namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.Storage
{
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using System.IO;

    [TestClass]
    public class StorageConfigTests
    {
        /// <summary>
        /// The Storage path.
        /// </summary>
        private string testsSubpath = "Storage";

        /// <summary>
        /// Gets local corpus.
        /// </summary>
        /// <returns>The <see cref="CdmCorpusDef"/>. </returns>
        private CdmCorpusDefinition GetLocalCorpus(string testFilesInputRoot, string testFilesOutputRoot = null)
        {
            var cdmCorpus = new CdmCorpusDefinition();

            cdmCorpus.Storage.DefaultNamespace = "local";

            cdmCorpus.Storage.Mount("local", new LocalAdapter(testFilesInputRoot));

            if (testFilesOutputRoot != null)
            {
                cdmCorpus.Storage.Mount("target", new LocalAdapter(testFilesOutputRoot));
            }

            return cdmCorpus;
        }

        /// <summary>
        /// Testing loading and saving config.
        /// </summary>
        [TestMethod]
        public async Task TestLoadingAndSavingConfig()
        {
            var testInputPath = TestHelper.GetInputFolderPath(testsSubpath, "TestLoadingAndSavingConfig");

            var testOutputPath = TestHelper.GetExpectedOutputFolderPath(testsSubpath, "TestLoadingAndSavingConfig");

            // Create a corpus to load the config.
            var cdmCorpus = this.GetLocalCorpus(testInputPath, testOutputPath);

            var config = await cdmCorpus.Storage.FetchAdapter("local").ReadAsync("/config.json");

            var differentCorpus = new CdmCorpusDefinition();

            differentCorpus.Storage.MountFromConfig(config);

            var resultConfig = differentCorpus.Storage.FetchConfig();

            var outputConfig = await cdmCorpus.Storage.FetchAdapter("target").ReadAsync("/config.json");

            Assert.AreEqual(outputConfig, resultConfig);
        }

        /// <summary>
        /// Testing loading config and fetching a manifest with the defined adapters.
        /// </summary>
        [TestMethod]
        public async Task TestLoadingConfigAndTryingToFetchManifest()
        {
            var testInputPath = TestHelper.GetInputFolderPath(testsSubpath, "TestLoadingConfigAndTryingToFetchManifest");

            // Create a corpus to load the config.
            var cdmCorpus = this.GetLocalCorpus(testInputPath);

            var config = await cdmCorpus.Storage.FetchAdapter("local").ReadAsync("/config.json");

            var differentCorpus = new CdmCorpusDefinition();

            var unrecognizedAdapters = differentCorpus.Storage.MountFromConfig(config, true);

            var cdmManifest = await differentCorpus.FetchObjectAsync<CdmManifestDefinition>("model.json", cdmCorpus.Storage.FetchRootFolder("local"));

            Assert.IsNotNull(cdmManifest);
            Assert.AreEqual(1, unrecognizedAdapters.Count);
        }

        /// <summary>
        /// Testing loading and saving resource and system defined adapters.
        /// </summary>
        [TestMethod]
        public async Task TestSystemAndResourceAdapters()
        {
            var path = TestHelper.GetExpectedOutputFolderPath(testsSubpath, "TestSystemAndResourceAdapters");

            // Create a corpus to load the config.
            var cdmCorpus = this.GetLocalCorpus(path);

            var differentCorpus = new CdmCorpusDefinition();

            differentCorpus.Storage.Unmount("cdm");

            differentCorpus.Storage.DefaultNamespace = "local";

            var resultConfig = differentCorpus.Storage.FetchConfig();

            var outputConfig = await cdmCorpus.Storage.NamespaceAdapters["local"].ReadAsync("/config.json");

            Assert.AreEqual(outputConfig, resultConfig);
        }
    }
}
