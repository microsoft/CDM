// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.CdmCollection
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Collections.Generic;

    [TestClass]
    public class CdmDocumentCollectionTests
    {
        [TestMethod]
        public void TestDocumentCollectionAdd()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest();
            var folder = new CdmFolderDefinition(manifest.Ctx, "Folder");
            folder.Corpus = manifest.Ctx.Corpus;
            folder.FolderPath = "FolderPath/";
            folder.Namespace = "Namespace";
            var document = new CdmDocumentDefinition(manifest.Ctx, "DocumentName");

            Assert.AreEqual(0, folder.Documents.Count);
            var addedDocument = folder.Documents.Add(document);
            Assert.AreEqual(1, folder.Documents.Count);
            Assert.AreEqual(document, folder.Documents[0]);
            Assert.AreEqual(document, addedDocument);
            Assert.AreEqual("FolderPath/", document.FolderPath);
            Assert.AreEqual(folder, document.Owner);
            Assert.AreEqual("Namespace", document.Namespace);
            Assert.IsTrue(document.NeedsIndexing);

            var doc = folder.Documents.Add(document);
            Assert.IsNull(doc);
        }

        [TestMethod]
        public void TestDocumentCollectionInsert()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest();
            var folder = new CdmFolderDefinition(manifest.Ctx, "Folder");
            folder.InDocument = manifest;
            folder.Corpus = manifest.Ctx.Corpus;
            folder.FolderPath = "FolderPath/";
            folder.Namespace = "Namespace";
            var document = new CdmDocumentDefinition(manifest.Ctx, "DocumentName");

            var doc1 = folder.Documents.Add("doc1");
            var doc2 = folder.Documents.Add("doc2");

            manifest.IsDirty = false;

            folder.Documents.Insert(2, document);
            Assert.IsTrue(manifest.IsDirty);
            Assert.AreEqual(3, folder.Documents.Count);
            Assert.AreEqual(doc1, folder.Documents[0]);
            Assert.AreEqual(doc2, folder.Documents[1]);
            Assert.AreEqual(document, folder.Documents[2]);
            
            Assert.AreEqual("FolderPath/", document.FolderPath);
            Assert.AreEqual(folder, document.Owner);
            Assert.AreEqual("Namespace", document.Namespace);
            Assert.IsTrue(document.NeedsIndexing);
            Assert.AreEqual(folder, document.Owner);
            Assert.IsTrue(folder.DocumentLookup.ContainsKey(document.Name));
            Assert.IsTrue(manifest.Ctx.Corpus.documentLibrary.Contains(Tuple.Create(folder, document)));

            // reinsert same name doc
            folder.Documents.Insert(2, document);
            Assert.AreEqual(3, folder.Documents.Count);
        }

        [TestMethod]
        public void TestDocumentCollectionAddWithDocumentName()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest();
            var folder = new CdmFolderDefinition(manifest.Ctx, "Folder");
            folder.Corpus = manifest.Ctx.Corpus;
            folder.FolderPath = "FolderPath/";
            folder.Namespace = "Namespace";

            Assert.AreEqual(0, folder.Documents.Count);
            var document = folder.Documents.Add("DocumentName");
            Assert.AreEqual(1, folder.Documents.Count);

            Assert.AreEqual("DocumentName", document.Name);
            Assert.AreEqual(document, folder.Documents[0]);
            Assert.AreEqual("FolderPath/", document.FolderPath);
            Assert.AreEqual(folder, document.Owner);
            Assert.AreEqual("Namespace", document.Namespace);
            Assert.IsTrue(document.NeedsIndexing);
        }

        [TestMethod]
        public void TestDocumentCollectionAddRange()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest();
            var folder = new CdmFolderDefinition(manifest.Ctx, "Folder");
            folder.Corpus = manifest.Ctx.Corpus;
            folder.FolderPath = "FolderPath/";
            folder.Namespace = "Namespace";

            Assert.AreEqual(0, folder.Documents.Count);

            var document = new CdmDocumentDefinition(manifest.Ctx, "DocumentName");
            var document2 = new CdmDocumentDefinition(manifest.Ctx, "DocumentName2");

            var documentList = new List<CdmDocumentDefinition> { document, document2 };
            folder.Documents.AddRange(documentList);
            Assert.AreEqual(2, folder.Documents.Count);
            Assert.AreEqual(document, folder.Documents[0]);
            Assert.AreEqual(document2, folder.Documents[1]);

            Assert.AreEqual("DocumentName", document.Name);
            Assert.AreEqual("FolderPath/", document.FolderPath);
            Assert.AreEqual(folder, document.Owner);
            Assert.AreEqual("Namespace", document.Namespace);
            Assert.IsTrue(document.NeedsIndexing);

            Assert.AreEqual("DocumentName2", document2.Name);
            Assert.AreEqual("FolderPath/", document2.FolderPath);
            Assert.AreEqual(folder, document2.Owner);
            Assert.AreEqual("Namespace", document2.Namespace);
            Assert.IsTrue(document2.NeedsIndexing);
        }

        [TestMethod]
        public void TestDocumentCollectionRemove()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest();
            var folder = new CdmFolderDefinition(manifest.Ctx, "Folder");
            folder.Corpus = manifest.Ctx.Corpus;
            folder.FolderPath = "FolderPath/";
            folder.Namespace = "Namespace";

            Assert.AreEqual(0, folder.Documents.Count);

            var document = new CdmDocumentDefinition(manifest.Ctx, "DocumentName");
            var document2 = new CdmDocumentDefinition(manifest.Ctx, "DocumentName2");

            var documentList = new List<CdmDocumentDefinition> { document, document2 };
            folder.Documents.AddRange(documentList);
            Assert.AreEqual(2, folder.Documents.Count);
            Assert.AreEqual(document, folder.Documents[0]);
            Assert.AreEqual(document2, folder.Documents[1]);
            Assert.AreEqual(folder, document.Owner);

            var removed = folder.Documents.Remove(document);
            Assert.IsTrue(removed);
            Assert.AreEqual(1, folder.Documents.Count);
            Assert.AreEqual(document2, folder.Documents[0]);
            Assert.IsNull(document.Owner);

            removed = folder.Documents.Remove(document);
            Assert.IsFalse(removed);
            Assert.AreEqual(1, folder.Documents.Count);
            Assert.AreEqual(document2, folder.Documents[0]);

            folder.Documents.Add(document);
            Assert.AreEqual(2, folder.Documents.Count);
            Assert.AreEqual(folder, document.Owner);
            removed = folder.Documents.Remove(document.Name);
            Assert.AreEqual(1, folder.Documents.Count);
            Assert.AreEqual(document2, folder.Documents[0]);
            Assert.IsNull(document.Owner);
        }

        [TestMethod]
        public void TestDocumentCollectionRemoveAt()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest();
            var folder = new CdmFolderDefinition(manifest.Ctx, "Folder");
            folder.Corpus = manifest.Ctx.Corpus;
            folder.FolderPath = "FolderPath/";
            folder.Namespace = "Namespace";

            var document = folder.Documents.Add("DocumentName");
            var document2 = folder.Documents.Add("DocumentName2");
            var document3 = folder.Documents.Add("DocumentName3");

            Assert.AreEqual(manifest.Ctx.Corpus.documentLibrary.ListAllDocuments().Count, 3);
            Assert.IsTrue(manifest.Ctx.Corpus.documentLibrary.Contains(Tuple.Create(folder, document)));
            Assert.IsTrue(manifest.Ctx.Corpus.documentLibrary.Contains(Tuple.Create(folder, document2)));
            Assert.IsTrue(manifest.Ctx.Corpus.documentLibrary.Contains(Tuple.Create(folder, document3)));

            Assert.AreEqual(folder.DocumentLookup.Count, 3);
            Assert.IsTrue(folder.DocumentLookup.ContainsKey(document.Name));
            Assert.IsTrue(folder.DocumentLookup.ContainsKey(document2.Name));
            Assert.IsTrue(folder.DocumentLookup.ContainsKey(document3.Name));

            folder.Documents.RemoveAt(1);
            folder.Documents.Remove("DocumentName");
            folder.Documents.Remove(document3);

            Assert.AreEqual(manifest.Ctx.Corpus.documentLibrary.ListAllDocuments().Count, 0);
            Assert.IsFalse(manifest.Ctx.Corpus.documentLibrary.Contains(Tuple.Create(folder, document)));
            Assert.IsFalse(manifest.Ctx.Corpus.documentLibrary.Contains(Tuple.Create(folder, document2)));
            Assert.IsFalse(manifest.Ctx.Corpus.documentLibrary.Contains(Tuple.Create(folder, document3)));

            Assert.AreEqual(folder.DocumentLookup.Count, 0);
            Assert.IsFalse(folder.DocumentLookup.ContainsKey(document.Name));
            Assert.IsFalse(folder.DocumentLookup.ContainsKey(document2.Name));
            Assert.IsFalse(folder.DocumentLookup.ContainsKey(document3.Name));
        }

        [TestMethod]
        public void TestDocumentCollectionClear()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest();
            var folder = new CdmFolderDefinition(manifest.Ctx, "Folder");
            folder.Corpus = manifest.Ctx.Corpus;
            folder.FolderPath = "FolderPath/";
            folder.Namespace = "Namespace";

            var document = folder.Documents.Add("DocumentName");
            var document2 = folder.Documents.Add("DocumentName2");
            var document3 = folder.Documents.Add("DocumentName3");

            folder.Documents.Clear();

            Assert.AreEqual(0, folder.DocumentLookup.Count);
            Assert.AreEqual(0, manifest.Ctx.Corpus.documentLibrary.ListAllDocuments().Count);
            Assert.AreEqual(0, folder.Documents.Count);
        }
    }
}
