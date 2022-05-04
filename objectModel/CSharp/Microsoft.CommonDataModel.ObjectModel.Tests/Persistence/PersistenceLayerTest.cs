// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.Tools.Processor;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
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
            corpus.SetEventCallback(new EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);
            corpus.Storage.Mount("local", new LocalAdapter(testInputPath));
            corpus.Storage.DefaultNamespace = "local";

            CdmManifestDefinition invalidManifest = null;
            try
            {
                invalidManifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/invalidManifest.manifest.cdm.json");
            }
            catch (Exception)
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
            ConcurrentDictionary<string, string> allDocs = new ConcurrentDictionary<string, string>();
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
            ConcurrentDictionary<string, string> allDocs = new ConcurrentDictionary<string, string>();
            var testAdapter = new TestStorageAdapter(allDocs);
            corpus.Storage.SetAdapter("local", testAdapter);

            var newManifestFromModelJsonName = "model.json";
            await manifestFromModelJson.SaveAsAsync(newManifestFromModelJsonName, true);
            // Verify that model.json persistence was called by comparing the saved document to the original model.json.
            var serializedManifest = allDocs[$"/sub-folder/{newManifestFromModelJsonName}"];
            var expectedOutputManifest = TestHelper.GetExpectedOutputFileContent(testsSubpath, testName, manifestFromModelJson.Name);
            TestHelper.AssertSameObjectWasSerialized(expectedOutputManifest, serializedManifest);
        }

        /// <summary>
        /// Test setting SaveConfigFile to false and checking if the file is not saved.
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestNotSavingConfigFile()
        {
            var testName = nameof(TestNotSavingConfigFile);
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);

            // Load manifest from input folder.
            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("default.manifest.cdm.json");

            // Move manifest to output folder.
            var outputFolder = corpus.Storage.FetchRootFolder("output");
            foreach (var entityDec in manifest.Entities)
            {
                var entity = await corpus.FetchObjectAsync<CdmEntityDefinition>(entityDec.EntityPath, manifest);
                outputFolder.Documents.Add(entity.InDocument);
            }

            outputFolder.Documents.Add(manifest);

            // Make sure the output folder is empty.
            TestHelper.DeleteFilesFromActualOutput(TestHelper.GetActualOutputFolderPath(testsSubpath, testName));

            // Save manifest to output folder.
            var copyOptions = new CopyOptions()
            {
                SaveConfigFile = false
            };

            await manifest.SaveAsAsync("default.manifest.cdm.json", false, copyOptions);

            // Compare the result.
            TestHelper.AssertFolderFilesEquality(
                TestHelper.GetExpectedOutputFolderPath(testsSubpath, testName),
                TestHelper.GetActualOutputFolderPath(testsSubpath, testName));
        }

        /// <summary>/// 
        /// Test that saving a model.json that isn't named exactly as such fails to save. 
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

            ConcurrentDictionary<string, string> allDocs = new ConcurrentDictionary<string, string>();
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

        /// <summary>
        /// Testing that type attribute properties (ex. IsReadOnly, isPrimaryKey) are persisted in model.json format.
        /// </summary>
        [TestMethod]
        public async Task TestModelJsonTypeAttributePersistence()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestModelJsonTypeAttributePersistence));
            // we need to create a second adapter to the output folder to fool the OM into thinking it's different
            // this is because there is a bug currently that prevents us from saving and then loading a model.json
            corpus.Storage.Mount("alternateOutput", new LocalAdapter(TestHelper.GetActualOutputFolderPath(testsSubpath, "TestModelJsonTypeAttributePersistence")));

            // create manifest
            var entityName = "TestTypeAttributePersistence";
            var localRoot = corpus.Storage.FetchRootFolder("local");
            var outputRoot = corpus.Storage.FetchRootFolder("output");
            var manifest = corpus.MakeObject<CdmManifestDefinition>(CdmObjectType.ManifestDef, "tempAbstract");
            manifest.Imports.Add("cdm:/foundations.cdm.json", null);
            localRoot.Documents.Add(manifest);

            // create entity
            var doc = corpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, $"{entityName}.cdm.json");
            doc.Imports.Add("cdm:/foundations.cdm.json", null);
            localRoot.Documents.Add(doc, doc.Name);
            var entityDef = doc.Definitions.Add(CdmObjectType.EntityDef, entityName) as CdmEntityDefinition;

            // create type attribute
            var cdmTypeAttributeDefinition = corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, entityName, false);
            cdmTypeAttributeDefinition.IsReadOnly = true;
            entityDef.Attributes.Add(cdmTypeAttributeDefinition);

            manifest.Entities.Add(entityDef);

            var manifestResolved = await manifest.CreateResolvedManifestAsync("default", null);
            outputRoot.Documents.Add(manifestResolved);
            manifestResolved.Imports.Add("cdm:/foundations.cdm.json");
            await manifestResolved.SaveAsAsync("model.json", true);
            var newManifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("alternateOutput:/model.json");

            CdmEntityDefinition newEnt = await corpus.FetchObjectAsync<CdmEntityDefinition>(newManifest.Entities[0].EntityPath, manifest);
            CdmTypeAttributeDefinition typeAttribute = newEnt.Attributes[0] as CdmTypeAttributeDefinition;
            Assert.IsTrue((bool)typeAttribute.IsReadOnly);
        }

        /// <summary>
        /// Test that the persistence layer handles the case when the persistence format cannot be found.
        /// </summary>
        [TestMethod]
        public async Task TestMissingPersistenceFormat()
        {
            var expectedLogCodes = new HashSet<CdmLogCode> { CdmLogCode.ErrPersistClassMissing };
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestMissingPersistenceFormat", expectedCodes:expectedLogCodes);

            CdmFolderDefinition folder = corpus.Storage.FetchRootFolder(corpus.Storage.DefaultNamespace);

            CdmManifestDefinition manifest = corpus.MakeObject<CdmManifestDefinition>(CdmObjectType.ManifestDef, "someManifest");
            folder.Documents.Add(manifest);
            // trying to save to an unsupported format should return false and not fail
            bool succeded = await manifest.SaveAsAsync("manifest.unSupportedExtension");
            Assert.IsFalse(succeded);
        }

        /// <summary>
        /// Test that a document is saved using the syms persistence class.
        /// </summary>
        internal async Task TestSymsSaveManifest(CdmManifestDefinition manifest)
        {
            Assert.IsTrue(await manifest.SaveAsAsync($"syms:/{manifest.ManifestName}/{manifest.ManifestName}.manifest.cdm.json"));
        }

        /// <summary>
        /// Test that a manifest document is fetched using the syms persistence class.
        /// </summary>
        internal async Task TestSymsFetchManifest(CdmCorpusDefinition corpus, CdmManifestDefinition manifestExpected, string filename, string threadnumber = "")
        {
            var manifestReadDatabases = await corpus.FetchObjectAsync<CdmManifestDefinition>($"syms:/databases.manifest.cdm.json");
            Assert.IsNotNull(manifestReadDatabases);
            Assert.AreEqual("databases.manifest.cdm.json", manifestReadDatabases.ManifestName);

            if (!manifestReadDatabases.SubManifests.AllItems.Exists(item => item.ManifestName == manifestExpected.ManifestName))
            {
                Assert.Fail($"Database {manifestExpected.ManifestName} does not exist.");
            }

            var manifestActual = await corpus.FetchObjectAsync<CdmManifestDefinition>($"syms:/{manifestExpected.ManifestName}/{manifestExpected.ManifestName}.manifest.cdm.json", manifestReadDatabases, null, true);
            await manifestActual.SaveAsAsync($"localActOutput:/{filename}{threadnumber}");
            await manifestExpected.SaveAsAsync($"localExpOutput:/{filename}{threadnumber}");

            var actualContent = TestHelper.GetActualOutputFileContent(testsSubpath, nameof(TestSymsSavingAndFetchingDocument), filename);
            var expectedContent = TestHelper.GetExpectedOutputFileContent(testsSubpath, nameof(TestSymsSavingAndFetchingDocument), filename);
            TestHelper.AssertSameObjectWasSerialized(actualContent, expectedContent);
        }

        /// <summary>
        /// Test that a document is fetched using the syms persistence class.
        /// </summary>
        internal async Task TestSymsFetchDocument(CdmCorpusDefinition corpus, CdmManifestDefinition manifestExpected)
        {
            foreach (var ent in manifestExpected.Entities)
            {
                var doc = await corpus.FetchObjectAsync<CdmDocumentDefinition>($"syms:/{manifestExpected.ManifestName}/{ent.EntityName}.cdm.json");
                Assert.IsNotNull(doc);
                Assert.IsTrue(string.Equals($"{ent.EntityName}.cdm.json", doc.Name));
                await doc.SaveAsAsync($"localActOutput:/{doc.Name}");

                var docLocal = await corpus.FetchObjectAsync<CdmDocumentDefinition>(doc.Name);
                await docLocal.SaveAsAsync($"localExpOutput:/{doc.Name}");

                var actualContent = TestHelper.GetActualOutputFileContent(testsSubpath, nameof(TestSymsSavingAndFetchingDocument), doc.Name);
                var expectedContent = TestHelper.GetExpectedOutputFileContent(testsSubpath, nameof(TestSymsSavingAndFetchingDocument), doc.Name);
                TestHelper.AssertSameObjectWasSerialized(actualContent, expectedContent);
            }
        }

        /// <summary>
        /// Test automatic mounting of adls adapter in syms if does not exist.
        /// </summary>
        internal async Task TestSymsSmartADLSAdapterMountLogic()
        {
            var symsAdapter = SymsTestHelper.CreateAdapterWithClientId();
            var corpus = new CdmCorpusDefinition();
            corpus.SetEventCallback(new EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);
            corpus.Storage.Mount("syms", symsAdapter);

            var adlsAdapter1 = SymsTestHelper.CreateADLSAdapterWithClientIdWithSharedKey(1);
            var adlsAdapter2 = SymsTestHelper.CreateADLSAdapterWithClientIdWithSharedKey(2);

            int countAdapterCountBefore = corpus.Storage.NamespaceAdapters.Count;
            var manifestReadDatabases = await corpus.FetchObjectAsync<CdmManifestDefinition>($"syms:/databases.manifest.cdm.json");
            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>($"syms:/{manifestReadDatabases.SubManifests[0].ManifestName}/{manifestReadDatabases.SubManifests[0].ManifestName}.manifest.cdm.json", manifestReadDatabases, null, true);
            
            int countAdapterCountAfter = corpus.Storage.NamespaceAdapters.Count;
            
            Assert.AreEqual(countAdapterCountBefore + 2, countAdapterCountAfter);
            Assert.IsNotNull(corpus.Storage.AdapterPathToCorpusPath($"https://{adlsAdapter1.Hostname}{adlsAdapter1.Root}"));
            Assert.IsNotNull(corpus.Storage.AdapterPathToCorpusPath($"https://{adlsAdapter2.Hostname}{adlsAdapter2.Root}"));
        }

        /// <summary>
        /// Test that a document is Saved and fetched using the syms persistence class.
        /// </summary>
        [TestMethod]
        public async Task TestSymsSavingAndFetchingDocument()
        {
            SymsTestHelper.CheckSymsEnvironment();
            var symsAdapter = SymsTestHelper.CreateAdapterWithClientId();
            await SymsTestHelper.CleanDatabase(symsAdapter, SymsTestHelper.DatabaseName);

            var testInputPath = TestHelper.GetInputFolderPath(testsSubpath, nameof(TestSymsSavingAndFetchingDocument));
            var testActOutputPath = TestHelper.GetActualOutputFolderPath(testsSubpath, nameof(TestSymsSavingAndFetchingDocument));
            var testExpOutputPath = TestHelper.GetExpectedOutputFolderPath(testsSubpath, nameof(TestSymsSavingAndFetchingDocument));

            CdmCorpusDefinition corpus = new CdmCorpusDefinition();
            corpus.SetEventCallback(new EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);

            var adlsAdapter1 = SymsTestHelper.CreateADLSAdapterWithClientIdWithSharedKey(1);
            var adlsAdapter2 = SymsTestHelper.CreateADLSAdapterWithClientIdWithSharedKey(2);

            var localInputAdapter = new LocalAdapter(testInputPath);
            var localActOutputAdapter = new LocalAdapter(testActOutputPath);
            var localExpOutputAdapter = new LocalAdapter(testExpOutputPath);

            corpus.Storage.Mount("adls1", adlsAdapter1);
            corpus.Storage.Mount("adls2", adlsAdapter2);
            corpus.Storage.Mount("syms", symsAdapter);
            corpus.Storage.Mount("localInput", localInputAdapter);
            corpus.Storage.Mount("localActOutput", localActOutputAdapter);
            corpus.Storage.Mount("localExpOutput", localExpOutputAdapter);

            corpus.Storage.Unmount("cdm");
            corpus.Storage.DefaultNamespace = "localInput";

            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("default.manifest.cdm.json");
            manifest.ManifestName = SymsTestHelper.DatabaseName;
            await TestSymsSaveManifest(manifest);
            await TestSymsFetchManifest(corpus, manifest, "default.manifest.cdm.json");
            await TestSymsFetchDocument(corpus, manifest);

            var manifestModified = await corpus.FetchObjectAsync<CdmManifestDefinition>("defaultmodified.manifest.cdm.json");
            manifestModified.ManifestName = SymsTestHelper.DatabaseName;
            manifestModified.Entities[0].LastFileModifiedTime = DateTimeOffset.UtcNow;
            await TestSymsSaveManifest(manifestModified);
            await TestSymsFetchManifest(corpus, manifestModified, "defaultmodified.manifest.cdm.json");
            await TestSymsFetchDocument(corpus, manifestModified);

            var tasks = new List<Func<Task>>
            {
                TestSymsSmartADLSAdapterMountLogic,
                TestSymsSmartADLSAdapterMountLogic,
                TestSymsSmartADLSAdapterMountLogic,
                TestSymsSmartADLSAdapterMountLogic
            };
            await Task.WhenAll(tasks.AsParallel().Select(async task => await task()));

            await SymsTestHelper.CleanDatabase(symsAdapter, SymsTestHelper.DatabaseName);
        }

        /// <summary>
        /// Test that the persistence layer handles the case when the document is empty.
        /// </summary>
        [TestMethod]
        public async Task TestLoadingEmptyJsonData()
        {
            HashSet<CdmLogCode> expectedCodes = new HashSet<CdmLogCode>();
            expectedCodes.Add(CdmLogCode.ErrPersistFileReadFailure);

            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestLoadingEmptyJsonData), null, false, expectedCodes, false);

            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("empty.Manifest.cdm.json");
            Assert.IsNull(manifest);
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.ErrPersistFileReadFailure, true);
        }
    }
}