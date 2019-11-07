using Microsoft.CommonDataModel.ObjectModel.Cdm;
using Microsoft.CommonDataModel.ObjectModel.Storage;
using Microsoft.CommonDataModel.Tools.Processor;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Threading.Tasks;

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
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

            var cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.Storage.Mount("local", localAdapter);
            cdmCorpus.SetEventCallback(new Utilities.EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);

            var doc = await cdmCorpus.FetchObjectAsync<CdmDocumentDefinition>("local:/missingImport.cdm.json");
            Assert.IsNotNull(doc);
            Assert.AreEqual(doc.Imports.Count, 1);
            Assert.AreEqual(doc.Imports.AllItems[0].CorpusPath, "missing.cdm.json");
            Assert.IsNull((doc.Imports.AllItems[0] as CdmImport).Doc);
        }

        [TestMethod]
        public async Task TestEntityWithMissingNestedImportsAsync()
        {
            var localAdapter = this.CreateStorageAdapterForTest("TestEntityWithMissingNestedImportsAsync");

            var cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.Storage.Mount("local", localAdapter);
            cdmCorpus.SetEventCallback(new Utilities.EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);

            var doc = await cdmCorpus.FetchObjectAsync<CdmDocumentDefinition>("local:/missingNestedImport.cdm.json");
            Assert.IsNotNull(doc);
            Assert.AreEqual(doc.Imports.Count, 1);
            var firstImport = (doc.Imports.AllItems[0] as CdmImport).Doc;
            Assert.AreEqual(firstImport.Imports.Count, 1);
            Assert.AreEqual(firstImport.Name, "notMissing.cdm.json");
            var nestedImport = (firstImport.Imports.AllItems[0] as CdmImport).Doc;
            Assert.IsNull(nestedImport);
        }

        [TestMethod]
        public async Task TestEntityWithSameImportsAsync()
        {
            var localAdapter = this.CreateStorageAdapterForTest("TestEntityWithSameImportsAsync");

            var cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.SetEventCallback(new Utilities.EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);
            cdmCorpus.Storage.Mount("local", localAdapter);

            var doc = await cdmCorpus.FetchObjectAsync<CdmDocumentDefinition>("local:/multipleImports.cdm.json");
            Assert.IsNotNull(doc);
            Assert.AreEqual(doc.Imports.Count, 2);
            var firstImport = (doc.Imports.AllItems[0] as CdmImport).Doc;
            Assert.AreEqual(firstImport.Name, "missingImport.cdm.json");
            Assert.AreEqual(firstImport.Imports.Count, 1);
            var secondImport = (doc.Imports.AllItems[1] as CdmImport).Doc;
            Assert.AreEqual(secondImport.Name, "notMissing.cdm.json");
        }

        /// <summary>
        /// Test an import with a non-existing namespace name.
        /// </summary>
        [TestMethod]
        public void TestNonExistingAdapterNamespace()
        {
            var localAdapter = this.CreateStorageAdapterForTest("TestNonExistingAdapterNamespace");

            var cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.SetEventCallback(new Utilities.EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);

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
