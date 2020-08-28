// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;    
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.Tools.Processor;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.IO;
    using System.Threading.Tasks;

    [TestClass]
    public class ImportsTests
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "Imports");

        [TestMethod]
        public async Task TestEntityWithMissingImport()
        {
            var localAdapter = this.CreateStorageAdapterForTest("TestEntityWithMissingImport");
            var cdmCorpus = this.CreateTestCorpus(localAdapter);

            var doc = await cdmCorpus.FetchObjectAsync<CdmDocumentDefinition>("local:/missingImport.cdm.json");
            Assert.IsNotNull(doc);
            Assert.AreEqual(1, doc.Imports.Count);
            Assert.AreEqual("missing.cdm.json", doc.Imports[0].CorpusPath);
            Assert.IsNull((doc.Imports[0] as CdmImport).Document);
        }

        [TestMethod]
        public async Task TestEntityWithMissingNestedImportsAsync()
        {
            var localAdapter = this.CreateStorageAdapterForTest("TestEntityWithMissingNestedImportsAsync");
            var cdmCorpus = this.CreateTestCorpus(localAdapter);

            var resOpt = new ResolveOptions()
            {
                StrictValidation = true
            };
            var doc = await cdmCorpus.FetchObjectAsync<CdmDocumentDefinition>("local:/missingNestedImport.cdm.json", null, resOpt);
            Assert.IsNotNull(doc);
            Assert.AreEqual(1, doc.Imports.Count);
            var firstImport = doc.Imports[0].Document;
            Assert.AreEqual(1, firstImport.Imports.Count);
            Assert.AreEqual("notMissing.cdm.json", firstImport.Name);
            var nestedImport = firstImport.Imports[0].Document;
            Assert.IsNull(nestedImport);
        }

        [TestMethod]
        public async Task TestEntityWithSameImportsAsync()
        {
            var localAdapter = this.CreateStorageAdapterForTest("TestEntityWithSameImportsAsync");
            var cdmCorpus = this.CreateTestCorpus(localAdapter);

            var resOpt = new ResolveOptions()
            {
                StrictValidation = true
            };
            var doc = await cdmCorpus.FetchObjectAsync<CdmDocumentDefinition>("local:/multipleImports.cdm.json", null, resOpt);
            Assert.IsNotNull(doc);
            Assert.AreEqual(2, doc.Imports.Count);
            var firstImport = (doc.Imports[0] as CdmImport).Document;
            Assert.AreEqual("missingImport.cdm.json", firstImport.Name);
            Assert.AreEqual(1, firstImport.Imports.Count);
            var secondImport = (doc.Imports[1] as CdmImport).Document;
            Assert.AreEqual("notMissing.cdm.json", secondImport.Name);
        }

        /// <summary>
        /// Test an import with a non-existing namespace name.
        /// </summary>
        [TestMethod]
        public void TestNonExistingAdapterNamespace()
        {
            var localAdapter = this.CreateStorageAdapterForTest("TestNonExistingAdapterNamespace");
            var cdmCorpus = this.CreateTestCorpus(localAdapter);

            // Register it as a 'local' adapter.
            cdmCorpus.Storage.Mount("erp", localAdapter);

            // Set local as our default.
            cdmCorpus.Storage.DefaultNamespace = "erp";

            // Load a manifest that is trying to import from 'cdm' namespace.
            // The manifest does't exist since the import couldn't get resolved,
            // so the error message will be logged and the null value will be propagated back to a user.
            Assert.IsNull(cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("erp.missingImportManifest.cdm").Result);
        }

        /// <summary>
        /// Testing docs that load the same import
        /// </summary>
        [TestMethod]
        public async Task TestLoadingSameImportsAsync()
        {
            var localAdapter = this.CreateStorageAdapterForTest("TestLoadingSameImportsAsync");
            var cdmCorpus = this.CreateTestCorpus(localAdapter);

            var resOpt = new ResolveOptions()
            {
                StrictValidation = true
            };

            CdmDocumentDefinition mainDoc = await cdmCorpus.FetchObjectAsync<CdmDocumentDefinition>("mainEntity.cdm.json", null, resOpt);
            Assert.IsNotNull(mainDoc);
            Assert.AreEqual(2, mainDoc.Imports.Count);

            CdmDocumentDefinition firstImport = mainDoc.Imports[0].Document;
            CdmDocumentDefinition secondImport = mainDoc.Imports[1].Document;

            // since these two imports are loaded asynchronously, we need to make sure that
            // the import that they share (targetImport) was loaded, and that the
            // targetImport doc is attached to both of these import objects
            Assert.AreEqual(1, firstImport.Imports.Count);
            Assert.IsNotNull(firstImport.Imports[0].Document);
            Assert.AreEqual(1, secondImport.Imports.Count);
            Assert.IsNotNull(secondImport.Imports[0].Document);
        }

        /// <summary>
        /// Testing docs that load the same import
        /// </summary>
        [TestMethod]
        public async Task TestLoadingSameMissingImportsAsync()
        {
            var localAdapter = this.CreateStorageAdapterForTest("TestLoadingSameMissingImportsAsync");
            var cdmCorpus = this.CreateTestCorpus(localAdapter);

            var resOpt = new ResolveOptions()
            {
                StrictValidation = true
            };

            CdmDocumentDefinition mainDoc = await cdmCorpus.FetchObjectAsync<CdmDocumentDefinition>("mainEntity.cdm.json", null, resOpt);
            Assert.IsNotNull(mainDoc);
            Assert.AreEqual(2, mainDoc.Imports.Count);

            // make sure imports loaded correctly, despite them missing imports
            CdmDocumentDefinition firstImport = mainDoc.Imports[0].Document;
            CdmDocumentDefinition secondImport = mainDoc.Imports[1].Document;

            Assert.AreEqual(1, firstImport.Imports.Count);
            Assert.IsNull(firstImport.Imports[0].Document);

            Assert.AreEqual(1, secondImport.Imports.Count);
            Assert.IsNull(firstImport.Imports[0].Document);
        }

        /// <summary>
        /// Testing docs that load the same import
        /// </summary>
        [TestMethod]
        public async Task TestLoadingAlreadyPresentImportsAsync()
        {
            var localAdapter = this.CreateStorageAdapterForTest("TestLoadingAlreadyPresentImportsAsync");
            var cdmCorpus = this.CreateTestCorpus(localAdapter);

            var resOpt = new ResolveOptions()
            {
                StrictValidation = true
            };

            // load the first doc
            CdmDocumentDefinition mainDoc = await cdmCorpus.FetchObjectAsync<CdmDocumentDefinition>("mainEntity.cdm.json", null, resOpt);
            Assert.IsNotNull(mainDoc);
            Assert.AreEqual(1, mainDoc.Imports.Count);

            CdmDocumentDefinition importDoc = mainDoc.Imports[0].Document;
            Assert.IsNotNull(importDoc);

            // now load the second doc, which uses the same import
            // the import should not be loaded again, it should be the same object
            CdmDocumentDefinition secondDoc = await cdmCorpus.FetchObjectAsync<CdmDocumentDefinition>("secondEntity.cdm.json", null, resOpt);
            Assert.IsNotNull(secondDoc);
            Assert.AreEqual(1, secondDoc.Imports.Count);

            CdmDocumentDefinition secondImportDoc = mainDoc.Imports[0].Document;
            Assert.IsNotNull(secondImportDoc);

            Assert.AreSame(importDoc, secondImportDoc);
        }

        private CdmCorpusDefinition CreateTestCorpus(StorageAdapter adapter)
        {
            var cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.SetEventCallback(new EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);
            cdmCorpus.Storage.Mount("local", adapter);
            cdmCorpus.Storage.DefaultNamespace = "local";

            return cdmCorpus;
        }

        /// <summary>
        /// Creates a storage adapter used to retrieve input files associated with test.
        /// </summary>
        /// <param name="testName">The name of the test we should retrieve input files for.</param>
        /// <returns>The storage adapter to be used by the named test method.</returns>
        private StorageAdapter CreateStorageAdapterForTest(string testName)
        {
            return new LocalAdapter(TestHelper.GetInputFolderPath(testsSubpath, testName));
        }
    }
}
