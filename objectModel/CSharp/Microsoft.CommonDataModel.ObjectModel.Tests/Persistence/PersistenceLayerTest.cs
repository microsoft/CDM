namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.Tools.Processor;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Collections.Generic;
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
            var testInputPath = TestHelper.GetInputFolderPath(testsSubpath, nameof(TestInvalidJson));

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

        /// <summary>
        /// Test that a document is fetched and saved using the correct persistence class, regardless of the case sensitivity of the file name/extension.
        /// </summary>
        [TestMethod]
        public async Task TestFetchingAndSavingDocumentsWithCaseInsensitiveCheck()
        {
            var testName = "TestFetchingAndSavingDocumentsWithCaseInsensitiveCheck";
            var testInputPath = TestHelper.GetInputFolderPath(testsSubpath, nameof(TestFetchingAndSavingDocumentsWithCaseInsensitiveCheck));

            CdmCorpusDefinition corpus = new CdmCorpusDefinition();
            corpus.SetEventCallback(new EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);
            var localAdapter = new LocalAdapter(testInputPath);
            corpus.Storage.Mount("local", localAdapter);
            var remoteAdapter = new RemoteAdapter
            {
                Hosts = new Dictionary<string, string>
                    {
                        { "contoso", "http://contoso.com" }
                    }
            };
            corpus.Storage.Mount("remote", remoteAdapter);
            corpus.Storage.DefaultNamespace = "local";
            corpus.Storage.Unmount("cdm");

            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("empty.Manifest.cdm.json");
            var manifestFromModelJson = await corpus.FetchObjectAsync<CdmManifestDefinition>("Model.json");

            // Swap out the adapter for a fake one so that we aren't actually saving files. 
            Dictionary<string, string> allDocs = new Dictionary<string, string>();
            var testAdapter = new TestStorageAdapter(allDocs);
            corpus.Storage.SetAdapter("local", testAdapter);

            var newManifestName = "empty.MANIFEST.CDM.json";
            await manifest.SaveAsAsync(newManifestName, true);
            // Verify that manifest persistence was called by comparing the saved document to the original manifest.
            var serializedManifest = allDocs[$"/{newManifestName}"];
            var expectedOutputManifest = TestHelper.GetExpectedOutputFileContent(testsSubpath, testName, manifest.Name);
            TestHelper.AssertSameObjectWasSerialized(expectedOutputManifest, serializedManifest);

            var newManifestFromModelJsonName = "MODEL.json";
            await manifestFromModelJson.SaveAsAsync(newManifestFromModelJsonName, true);
            // Verify that model.json persistence was called by comparing the saved document to the original model.json.
            serializedManifest = allDocs[$"/{newManifestFromModelJsonName}"];
            expectedOutputManifest = TestHelper.GetExpectedOutputFileContent(testsSubpath, testName, manifestFromModelJson.Name);
            TestHelper.AssertSameObjectWasSerialized(expectedOutputManifest, serializedManifest);
        }

        /// <summary>
        /// Test that a document is fetched and saved when its data partition contains unregistered remote adapter path.
        /// </summary>
        [TestMethod]
        public async Task TestFetchingDocumentUnderneathAPathAndSavingDocuments()
        {
            var testName = nameof(TestFetchingDocumentUnderneathAPathAndSavingDocuments);
            var testInputPath = TestHelper.GetInputFolderPath(testsSubpath, testName);

            CdmCorpusDefinition corpus = new CdmCorpusDefinition();
            corpus.SetEventCallback(new EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);
            LocalAdapter localAdapter = new LocalAdapter(testInputPath);
            corpus.Storage.Mount("local", localAdapter);
            corpus.Storage.DefaultNamespace = "local";
            corpus.Storage.Unmount("cdm");

            var manifestFromModelJson = await corpus.FetchObjectAsync<CdmManifestDefinition>("sub-folder/model.json");

            // Swap out the adapter for a fake one so that we aren't actually saving files. 
            Dictionary<string, string> allDocs = new Dictionary<string, string>();
            var testAdapter = new TestStorageAdapter(allDocs);
            corpus.Storage.SetAdapter("local", testAdapter);

            var newManifestFromModelJsonName = "model.json";
            await manifestFromModelJson.SaveAsAsync(newManifestFromModelJsonName, true);
            // Verify that model.json persistence was called by comparing the saved document to the original model.json.
            var serializedManifest = allDocs[$"/sub-folder/{newManifestFromModelJsonName}"];
            var expectedOutputManifest = TestHelper.GetExpectedOutputFileContent(testsSubpath, testName, manifestFromModelJson.Name);
            TestHelper.AssertSameObjectWasSerialized(expectedOutputManifest, serializedManifest);
        }
        /// <summary>/// 
        /// Test that saving a model.json or odi.json that isn't named exactly as such fails to save. 
        /// </summary>
        [TestMethod]
        public async Task TestSavingInvalidModelJsonName()
        {
            CdmCorpusDefinition corpus = new CdmCorpusDefinition();
            corpus.SetEventCallback(new EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);
            corpus.Storage.Unmount("cdm");
            corpus.Storage.DefaultNamespace = "local";
            var manifest = new CdmManifestDefinition(corpus.Ctx, "manifest");
            corpus.Storage.FetchRootFolder("local").Documents.Add(manifest);


            Dictionary<string, string> allDocs = new Dictionary<string, string>();
            var testAdapter = new TestStorageAdapter(allDocs);
            corpus.Storage.SetAdapter("local", testAdapter);

            var newManifestFromModelJsonName = "my.model.json";
            await manifest.SaveAsAsync(newManifestFromModelJsonName, true);
            // TODO: because we can load documents properly now, SaveAsAsync returns false. Will check the value returned from SaveAsAsync() when the problem is solved
            Assert.IsFalse(allDocs.ContainsKey($"/{newManifestFromModelJsonName}"));
        }

        /// <summary>
        /// Test that loading a model.json that isn't named exactly as such fails to load.  
        /// </summary>
        [TestMethod]
        public async Task TestLoadingInvalidModelJsonName()
        {
            var testName = "TestLoadingInvalidModelJsonName";
            var testInputPath = TestHelper.GetInputFolderPath(testsSubpath, testName);

            CdmCorpusDefinition corpus = new CdmCorpusDefinition();
            corpus.SetEventCallback(new EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);
            corpus.Storage.Mount("local", new LocalAdapter(testInputPath));
            corpus.Storage.DefaultNamespace = "local";

            // We are trying to load a file with an invalid name, so FetchObjectAsync() should just return null.
            var invalidModelJson = await corpus.FetchObjectAsync<CdmManifestDefinition>("test.model.json");
            Assert.IsNull(invalidModelJson);
        }
    }


}
