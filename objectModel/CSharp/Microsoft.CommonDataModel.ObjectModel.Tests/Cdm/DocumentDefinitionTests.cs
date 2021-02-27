// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.IO;
    using System.Threading.Tasks;

    /// <summary>
    /// Tests for the CdmDocumentDefinition class.
    /// </summary>
    [TestClass]
    public class DocumentDefinitionTests
    {
        private readonly string testsSubpath = Path.Combine("Cdm", "Document");

        /// <summary>
        /// Test when A -> M/B -> C -> B.
        /// In this case, although A imports B with a moniker, B should be in the priorityImports because it is imported by C.
        /// </summary>
        [TestMethod]
        public async Task TestCircularImportWithMoniker()
        {
            var corpus = TestHelper.GetLocalCorpus("", "");
            var folder = corpus.Storage.FetchRootFolder("local");

            var docA = new CdmDocumentDefinition(corpus.Ctx, "A.cdm.json");
            folder.Documents.Add(docA);
            docA.Imports.Add("B.cdm.json", "moniker");

            var docB = new CdmDocumentDefinition(corpus.Ctx, "B.cdm.json");
            folder.Documents.Add(docB);
            docB.Imports.Add("C.cdm.json");

            var docC = new CdmDocumentDefinition(corpus.Ctx, "C.cdm.json");
            folder.Documents.Add(docC);
            docC.Imports.Add("B.cdm.json");

            // forces docB to be indexed first.
            await docB.IndexIfNeeded(new ResolveOptions(), true);
            await docA.IndexIfNeeded(new ResolveOptions(), true);

            // should contain A, B and C.
            Assert.AreEqual(3, docA.ImportPriorities.ImportPriority.Count);

            Assert.IsFalse(docA.ImportPriorities.hasCircularImport);

            // docB and docC should have the hasCircularImport set to true.
            Assert.IsTrue(docB.ImportPriorities.hasCircularImport);
            Assert.IsTrue(docC.ImportPriorities.hasCircularImport);
        }

        /// <summary>
        /// Test when A -> B -> C/M -> D -> C.
        /// In this case, although B imports C with a moniker, C should be in the A's priorityImports because it is imported by D.
        /// </summary>
        [TestMethod]
        public async Task TestDeeperCircularImportWithMoniker()
        {
            var corpus = TestHelper.GetLocalCorpus("", "");
            var folder = corpus.Storage.FetchRootFolder("local");

            var docA = new CdmDocumentDefinition(corpus.Ctx, "A.cdm.json");
            folder.Documents.Add(docA);
            docA.Imports.Add("B.cdm.json");

            var docB = new CdmDocumentDefinition(corpus.Ctx, "B.cdm.json");
            folder.Documents.Add(docB);
            docB.Imports.Add("C.cdm.json", "moniker");

            var docC = new CdmDocumentDefinition(corpus.Ctx, "C.cdm.json");
            folder.Documents.Add(docC);
            docC.Imports.Add("D.cdm.json");

            var docD = new CdmDocumentDefinition(corpus.Ctx, "D.cdm.json");
            folder.Documents.Add(docD);
            docD.Imports.Add("C.cdm.json");

            // indexIfNeeded will internally call prioritizeImports on every document.
            await docA.IndexIfNeeded(new ResolveOptions(), true);

            Assert.AreEqual(4, docA.ImportPriorities.ImportPriority.Count);
            AssertImportInfo(docA.ImportPriorities.ImportPriority[docA], 0, false);
            AssertImportInfo(docA.ImportPriorities.ImportPriority[docB], 1, false);
            AssertImportInfo(docA.ImportPriorities.ImportPriority[docD], 2, false);
            AssertImportInfo(docA.ImportPriorities.ImportPriority[docC], 3, false);

            // reset the importsPriorities.
            MarkDocumentsToIndex(folder.Documents);

            // force docC to be indexed first, so the priorityList will be read from the cache this time.
            await docC.IndexIfNeeded(new ResolveOptions(), true);
            await docA.IndexIfNeeded(new ResolveOptions(), true);

            Assert.AreEqual(4, docA.ImportPriorities.ImportPriority.Count);

            // indexes the rest of the documents.
            await docB.IndexIfNeeded(new ResolveOptions(), true);
            await docD.IndexIfNeeded(new ResolveOptions(), true);

            Assert.IsFalse(docA.ImportPriorities.hasCircularImport);
            Assert.IsFalse(docB.ImportPriorities.hasCircularImport);
            Assert.IsTrue(docC.ImportPriorities.hasCircularImport);
            Assert.IsTrue(docD.ImportPriorities.hasCircularImport);
        }

        /// <summary>
        /// Test when A -> B -> C/M -> D.
        /// Index docB first then docA. Make sure that C does not appear in docA priority list.
        /// </summary>
        [TestMethod]
        public async Task TestReadingCachedImportPriority()
        {
            var corpus = TestHelper.GetLocalCorpus("", "");
            var folder = corpus.Storage.FetchRootFolder("local");

            var docA = new CdmDocumentDefinition(corpus.Ctx, "A.cdm.json");
            folder.Documents.Add(docA);
            docA.Imports.Add("B.cdm.json");

            var docB = new CdmDocumentDefinition(corpus.Ctx, "B.cdm.json");
            folder.Documents.Add(docB);
            docB.Imports.Add("C.cdm.json", "moniker");

            var docC = new CdmDocumentDefinition(corpus.Ctx, "C.cdm.json");
            folder.Documents.Add(docC);
            docC.Imports.Add("D.cdm.json");

            var docD = new CdmDocumentDefinition(corpus.Ctx, "D.cdm.json");
            folder.Documents.Add(docD);

            // index docB first and check its import priorities.
            await docB.IndexIfNeeded(new ResolveOptions(), true);

            Assert.AreEqual(3, docB.ImportPriorities.ImportPriority.Count);
            AssertImportInfo(docB.ImportPriorities.ImportPriority[docB], 0, false);
            AssertImportInfo(docB.ImportPriorities.ImportPriority[docD], 1, false);
            AssertImportInfo(docB.ImportPriorities.ImportPriority[docC], 2, true);

            // now index docA, which should read docB's priority list from the cache.
            await docA.IndexIfNeeded(new ResolveOptions(), true);
            Assert.AreEqual(3, docA.ImportPriorities.ImportPriority.Count);
            AssertImportInfo(docA.ImportPriorities.ImportPriority[docA], 0, false);
            AssertImportInfo(docA.ImportPriorities.ImportPriority[docB], 1, false);
            AssertImportInfo(docA.ImportPriorities.ImportPriority[docD], 2, false);
        }

        /// <summary>
        /// Test if monikered imports are added to the end of the priority list.
        /// A -> B/M -> C
        /// </summary>
        [TestMethod]
        public async Task TestMonikeredImportIsAddedToEnd()
        {
            var corpus = TestHelper.GetLocalCorpus("", "");
            var folder = corpus.Storage.FetchRootFolder("local");

            var docA = new CdmDocumentDefinition(corpus.Ctx, "A.cdm.json");
            folder.Documents.Add(docA);
            docA.Imports.Add("B.cdm.json", "moniker");

            var docB = new CdmDocumentDefinition(corpus.Ctx, "B.cdm.json");
            folder.Documents.Add(docB);
            docB.Imports.Add("C.cdm.json");
            
            var docC = new CdmDocumentDefinition(corpus.Ctx, "C.cdm.json");
            folder.Documents.Add(docC);

            // forces docB to be indexed first, so the priorityList will be read from the cache this time.
            await docB.IndexIfNeeded(new ResolveOptions(docB), true);
            await docA.IndexIfNeeded(new ResolveOptions(docA), true);

            // should contain all three documents.
            Assert.AreEqual(3, docA.ImportPriorities.ImportPriority.Count);
            AssertImportInfo(docA.ImportPriorities.ImportPriority[docA], 0, false);
            AssertImportInfo(docA.ImportPriorities.ImportPriority[docC], 1, false);
            // docB is monikered so it should appear at the end of the list.
            AssertImportInfo(docA.ImportPriorities.ImportPriority[docB], 2, true);

            // make sure that the has circular import is set to false.
            Assert.IsFalse(docA.ImportPriorities.hasCircularImport);
            Assert.IsFalse(docB.ImportPriorities.hasCircularImport);
            Assert.IsFalse(docC.ImportPriorities.hasCircularImport);
        }

        /// <summary>
        /// Setting the forceReload flag to true correctly reloads the document
        /// </summary>
        [TestMethod]
        public async Task TestDocumentForceReload()
        {
            string testName = "testDocumentForceReload";
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);

            // load the document and entity the first time
            await corpus.FetchObjectAsync<CdmEntityDefinition>("doc.cdm.json/entity");
            // reload the same doc and make sure it is reloaded correctly
            CdmEntityDefinition reloadedEntity = await corpus.FetchObjectAsync<CdmEntityDefinition>("doc.cdm.json/entity", null, null, true);

            // if the reloaded doc is not indexed correctly, the entity will not be able to be found
            Assert.IsNotNull(reloadedEntity);
        }

        /// <summary>
        /// Tests if the DocumentVersion is set on the resolved document
        /// </summary>
        [TestMethod]
        public async Task TestDocumentVersionSetOnResolution()
        {
            var testName = "TestDocumentVersionSetOnResolution";
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);

            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/default.manifest.cdm.json");
            var document = await corpus.FetchObjectAsync<CdmDocumentDefinition>("local:/Person.cdm.json");

            Assert.AreEqual("2.1.3", manifest.DocumentVersion);
            Assert.AreEqual("1.5", document.DocumentVersion);

            var resManifest = await manifest.CreateResolvedManifestAsync($"res-{manifest.Name}", null);
            var resEntity = await corpus.FetchObjectAsync<CdmEntityDefinition>(resManifest.Entities[0].EntityPath, resManifest);
            var resDocument = resEntity.InDocument;

            Assert.AreEqual("2.1.3", resManifest.DocumentVersion);
            Assert.AreEqual("1.5", resDocument.DocumentVersion);
        }

        /// <summary>
        /// Sets the document's isDirty flag to true and reset the importPriority.
        /// </summary>
        /// <param name="documents"></param>
        private void MarkDocumentsToIndex(CdmDocumentCollection documents)
        {
            foreach (var document in documents)
            {
                document.NeedsIndexing = true;
                document.ImportPriorities = null;
            }
        }

        /// <summary>
        /// Helper function to assert the ImportInfo class.
        /// </summary>
        /// <param name="importInfo"></param>
        /// <param name="expectedPriority"></param>
        /// <param name="expectedIsMoniker"></param>
        private void AssertImportInfo(ImportInfo importInfo, int expectedPriority, bool expectedIsMoniker)
        {
            Assert.AreEqual(expectedPriority, importInfo.Priority);
            Assert.AreEqual(expectedIsMoniker, importInfo.IsMoniker);
        }
    }
}
