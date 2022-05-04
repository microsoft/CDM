// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.CdmCollection
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;

    [TestClass]
    public class CdmCollectionTests
    {

        [TestMethod]
        public void TestCdmCollectionAddMethod()
        {
            var cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.Storage.DefaultNamespace = "local";
            cdmCorpus.Storage.Mount("local", new LocalAdapter("CdmCorpus/LocalPath"));

            var ctx = cdmCorpus.Ctx;

            var cdmDocument = new CdmDocumentDefinition(ctx, "NameOfDocument");
            var collection = new CdmCollection<CdmAttributeContext>(ctx, cdmDocument, Enums.CdmObjectType.AttributeContextDef);

            var addedAttributeContext = collection.Add("nameOfNewAttribute");
            Assert.AreEqual(1, collection.Count);
            Assert.AreEqual("nameOfNewAttribute", collection[0].Name);
            Assert.AreEqual(cdmDocument, collection[0].Owner);
            Assert.AreEqual(ctx, collection[0].Ctx);

            Assert.AreEqual(collection[0], addedAttributeContext);

            var attributeContext = new CdmAttributeContext(ctx, "NameOfAttributeContext");
            var addedAttribute = collection.Add(attributeContext);
            Assert.AreEqual(2, collection.Count);
            Assert.AreEqual(attributeContext, addedAttribute);
            Assert.AreEqual(attributeContext, collection[1]);
            Assert.AreEqual(cdmDocument, attributeContext.Owner);
        }

        [TestMethod]
        public void TestCdmCollectionRemoveMethod()
        {
            var cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.Storage.DefaultNamespace = "local";
            cdmCorpus.Storage.Mount("local", new LocalAdapter("CdmCorpus/LocalPath"));

            var ctx = cdmCorpus.Ctx;

            var cdmDocument = new CdmDocumentDefinition(ctx, "NameOfDocument");
            var collection = new CdmCollection<CdmAttributeContext>(ctx, cdmDocument, Enums.CdmObjectType.AttributeContextDef);

            var addedDocument = collection.Add("nameOfNewDocument");

            var addedDocument2 = collection.Add("otherDocument");

            Assert.AreEqual(2, collection.Count);

            bool removed = collection.Remove(addedDocument);
            Assert.IsTrue(removed);

            // try to remove a second time.
            removed = collection.Remove(addedDocument);
            Assert.IsFalse(removed);
            Assert.AreEqual(1, collection.Count);
        }

        [TestMethod]
        public void TestCdmCollectionRemoveAt()
        {
            var cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.Storage.DefaultNamespace = "local";
            cdmCorpus.Storage.Mount("local", new LocalAdapter("CdmCorpus/LocalPath"));

            var ctx = cdmCorpus.Ctx;

            var cdmDocument = new CdmDocumentDefinition(ctx, "NameOfDocument");
            var collection = new CdmCollection<CdmAttributeContext>(ctx, cdmDocument, Enums.CdmObjectType.AttributeContextDef);

            var addedDocument = collection.Add("nameOfNewDocument");

            var addedDocument2 = collection.Add("otherDocument");

            Assert.AreEqual(2, collection.Count);

            collection.RemoveAt(0);
            Assert.AreEqual(1, collection.Count);
            Assert.AreEqual(addedDocument2, collection[0]);
            collection.RemoveAt(1);
            Assert.AreEqual(1, collection.Count);
            Assert.AreEqual(addedDocument2, collection[0]);
            collection.RemoveAt(0);
            Assert.AreEqual(0, collection.Count);
        }

        [TestMethod]
        public void TestCdmCollectionAddingList()
        {
            var cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.Storage.DefaultNamespace = "local";
            cdmCorpus.Storage.Mount("local", new LocalAdapter("CdmCorpus/LocalPath"));

            var ctx = cdmCorpus.Ctx;

            var cdmDocument = new CdmDocumentDefinition(ctx, "NameOfDocument");
            var collection = new CdmCollection<CdmEntityDeclarationDefinition>(ctx, cdmDocument, Enums.CdmObjectType.LocalEntityDeclarationDef);

            var entityList = new List<CdmEntityDeclarationDefinition>();

            for (int i = 0; i < 2; i++)
            {
                var entity = new CdmEntityDefinition(cdmCorpus.Ctx, $"entityName_{i}", null);

                CdmCollectionHelperFunctions.CreateDocumentForEntity(cdmCorpus, entity);

                var entityDeclaration = cdmCorpus.MakeObject<CdmEntityDeclarationDefinition>(Enums.CdmObjectType.LocalEntityDeclarationDef, entity.EntityName, false);
                entityDeclaration.Owner = entity.Owner;
                entityDeclaration.EntityPath = $"{entity.Owner.AtCorpusPath}/{entity.EntityName}";

                entityList.Add(entityDeclaration);
            }
            Assert.AreEqual(0, collection.Count);

            collection.AddRange(entityList);

            Assert.AreEqual(2, collection.Count);

            for (int i = 0; i < 2; i++)
            {
                Assert.AreEqual($"entityName_{i}", collection[i].EntityName);
            }
        }

        [TestMethod]
        public void TestCdmCollectionChangeMakesDocumentDirty()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest();
            var collection = new CdmCollection<CdmEntityReference>(manifest.Ctx, manifest, Enums.CdmObjectType.EntityRef);

            manifest.IsDirty = false;
            collection.Add(new CdmEntityReference(manifest.Ctx, "name", false));
            Assert.IsTrue(manifest.IsDirty);
            manifest.IsDirty = false;
            collection.Add("theName");
            Assert.IsTrue(manifest.IsDirty);
            var entity = new CdmEntityReference(manifest.Ctx, "otherEntity", false);
            var entityList = new List<CdmEntityReference>() { entity };
            manifest.IsDirty = false;
            collection.AddRange(entityList);
            Assert.IsTrue(manifest.IsDirty);
            manifest.IsDirty = false;
            var entity2 = new CdmEntityReference(manifest.Ctx, "otherEntity2", false);
            collection.Insert(0, entity2);
            Assert.IsTrue(manifest.IsDirty);

            manifest.IsDirty = false;
            collection.Remove(entity);
            Assert.IsTrue(manifest.IsDirty);

            manifest.IsDirty = false;
            collection.RemoveAt(0);
            Assert.IsTrue(manifest.IsDirty);

            manifest.IsDirty = false;
            collection.Clear();
            Assert.IsTrue(manifest.IsDirty);
        }
    }
}
