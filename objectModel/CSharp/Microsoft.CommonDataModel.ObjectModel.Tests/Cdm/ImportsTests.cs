// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;
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
            var expectedLogCodes = new HashSet<CdmLogCode> { CdmLogCode.ErrPersistFileReadFailure, CdmLogCode.WarnResolveImportFailed, CdmLogCode.WarnDocImportNotLoaded };
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestEntityWithMissingImport), expectedCodes: expectedLogCodes);

            var resOpt = new ResolveOptions()
            {
                ImportsLoadStrategy = ImportsLoadStrategy.Load
            };

            var doc = await cdmCorpus.FetchObjectAsync<CdmDocumentDefinition>("local:/missingImport.cdm.json", null, resOpt);
            Assert.IsNotNull(doc);
            Assert.AreEqual(1, doc.Imports.Count);
            Assert.AreEqual("missing.cdm.json", doc.Imports[0].CorpusPath);
            Assert.IsNull((doc.Imports[0] as CdmImport).Document);
        }

        [TestMethod]
        public async Task TestEntityWithMissingNestedImportsAsync()
        {
            var expectedLogCodes = new HashSet<CdmLogCode> { CdmLogCode.ErrPersistFileReadFailure, CdmLogCode.WarnResolveImportFailed, CdmLogCode.WarnDocImportNotLoaded };
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestEntityWithMissingNestedImportsAsync), expectedCodes: expectedLogCodes);

            var resOpt = new ResolveOptions()
            {
                ImportsLoadStrategy = ImportsLoadStrategy.Load
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
            var expectedLogCodes = new HashSet<CdmLogCode> { CdmLogCode.ErrPersistFileReadFailure, CdmLogCode.WarnResolveImportFailed, CdmLogCode.WarnDocImportNotLoaded };
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestEntityWithSameImportsAsync), expectedCodes: expectedLogCodes);

            var resOpt = new ResolveOptions()
            {
                ImportsLoadStrategy = ImportsLoadStrategy.Load
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
            var expectedLogCodes = new HashSet<CdmLogCode> { CdmLogCode.ErrPersistFileReadFailure };
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestNonExistingAdapterNamespace), expectedCodes: expectedLogCodes);

            // Register it as a 'local' adapter.
            cdmCorpus.Storage.Mount("erp", new LocalAdapter(TestHelper.GetInputFolderPath(testsSubpath, nameof(TestNonExistingAdapterNamespace))));

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
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestLoadingSameImportsAsync));

            var resOpt = new ResolveOptions()
            {
                ImportsLoadStrategy = ImportsLoadStrategy.Load
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
            var expectedLogCodes = new HashSet<CdmLogCode> { CdmLogCode.ErrPersistFileReadFailure, CdmLogCode.WarnResolveImportFailed, CdmLogCode.WarnDocImportNotLoaded };
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestLoadingSameMissingImportsAsync), expectedCodes: expectedLogCodes);

            var resOpt = new ResolveOptions()
            {
                ImportsLoadStrategy = ImportsLoadStrategy.Load
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
            var cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestLoadingAlreadyPresentImportsAsync));

            var resOpt = new ResolveOptions()
            {
                ImportsLoadStrategy = ImportsLoadStrategy.Load
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

        /// <summary>
        /// Testing that import priorites update correctly when imports are changed
        /// </summary>
        [TestMethod]
        public async Task TestPrioritizingImportsAfterEdit()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestPrioritizingImportsAfterEdit));

            var document = await corpus.FetchObjectAsync<CdmDocumentDefinition>("local:/mainDoc.cdm.json");
            await document.RefreshAsync(new ResolveOptions(document));

            Assert.AreEqual(0, document.Imports.Count);
            // the current doc itself is added to the list of priorities
            Assert.AreEqual(1, document.ImportPriorities.ImportPriority.Count);

            document.Imports.Add("importDoc.cdm.json", true);
            await document.RefreshAsync(new ResolveOptions(document));

            Assert.AreEqual(1, document.Imports.Count);
            Assert.AreEqual(2, document.ImportPriorities.ImportPriority.Count);
        }

        /// <summary>
        /// Testing that import for elevated purpose traits for relationships are added.
        /// </summary>
        [TestMethod]
        public async Task TestImportsForRelElevatedPurposeTraits()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestImportsForRelElevatedPurposeTraits));
            var rootManifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/default.manifest.cdm.json");
            var subManifest = await corpus.FetchObjectAsync<CdmManifestDefinition>(rootManifest.SubManifests[0].Definition);

            await corpus.CalculateEntityGraphAsync(rootManifest);
            await rootManifest.PopulateManifestRelationshipsAsync(CdmRelationshipDiscoveryStyle.Exclusive);

            // Assert having relative path
            Assert.AreEqual("specialized/Gold.cdm.json", rootManifest.Imports[0].CorpusPath);
            Assert.AreEqual("/Lead.cdm.json", subManifest.Imports[0].CorpusPath);

            corpus.Storage.FetchRootFolder("output").Documents.Add(rootManifest);
            corpus.Storage.FetchRootFolder("output").Documents.Add(subManifest);

            await rootManifest.SaveAsAsync("output:/default.manifest.cdm.json", false, new CopyOptions() { SaveConfigFile=false });
            await subManifest.SaveAsAsync("output:/default-submanifest.manifest.cdm.json", false, new CopyOptions() { SaveConfigFile = false });


            // Compare the result.
            TestHelper.AssertFolderFilesEquality(
                TestHelper.GetExpectedOutputFolderPath(testsSubpath, nameof(TestImportsForRelElevatedPurposeTraits)),
                TestHelper.GetActualOutputFolderPath(testsSubpath, nameof(TestImportsForRelElevatedPurposeTraits)));
        }
    }
}
