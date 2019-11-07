namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.CdmCollection
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.Tools.Processor;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;

    [TestClass]
    public class CdmEntityCollectionTests
    {
        /// <summary>
        /// Tests whether Manifest.Entities.Add() can be used with <see cref="ICdmEntityDef"/> parameter.
        /// </summary>
        [TestMethod]
        public void TestManifestAddEntityWithLocalizedPaths()
        {
            var manifest = GenerateManifest("C:\\Root\\Path");
            var cdmCorpus = manifest.Ctx.Corpus;
            
            var entity = new CdmEntityDefinition(cdmCorpus.Ctx, "entityName", null);
            entity.Explanation = "The explanation of the entity";

            this.CreateDocumentForEntity(cdmCorpus, entity);

            var cdmEntity = new CdmEntityDefinition(cdmCorpus.Ctx, "cdmEntityName", null);
            this.CreateDocumentForEntity(cdmCorpus, cdmEntity, "cdm");

            var localizedEntityDeclaration = manifest.Entities.Add(entity);
            var cdmEntityDeclaration = manifest.Entities.Add(cdmEntity);

            Assert.AreEqual("The explanation of the entity", localizedEntityDeclaration.Explanation);
            Assert.AreEqual("entityName.cdm.json/entityName", localizedEntityDeclaration.EntityPath);
            Assert.AreEqual("entityName", localizedEntityDeclaration.EntityName);
            Assert.AreEqual("cdm:/cdmEntityName.cdm.json/cdmEntityName", cdmEntityDeclaration.EntityPath);
            Assert.AreEqual("entityName", localizedEntityDeclaration.EntityName);

            Assert.AreEqual(2, manifest.Entities.AllItems.Count);
            Assert.AreEqual(localizedEntityDeclaration, manifest.Entities.AllItems[0]);
            Assert.AreEqual(cdmEntityDeclaration, manifest.Entities.AllItems[1]);
        }

        /// <summary>
        /// Tests whether Manifest.Entities.Add() throws an exception when the associated docutment is not added.
        /// </summary>
        [TestMethod]
        public void TestManifestCannotAddEntityWithoutDoc()
        {
            var manifest = GenerateManifest("C:\\Root\\Path");
            var entity = new CdmEntityDefinition(manifest.Ctx, "entityName", null);

            Assert.ThrowsException<System.ArgumentException>(() => manifest.Entities.Add(entity));
        }

        /// <summary>
        /// Tests whether the EntityDefinition can be passed directly to Manifest.Entities.Add().
        /// </summary>
        [TestMethod]
        public void TestManifestCanAddEntityDefinition()
        {
            var manifest = GenerateManifest("C:\\Root\\Path");
            var entity = new CdmEntityDefinition(manifest.Ctx, "entityName", null);

            this.CreateDocumentForEntity(manifest.Ctx.Corpus, entity);

            var entityDeclaration = manifest.Ctx.Corpus.MakeObject<CdmEntityDeclarationDefinition>(Enums.CdmObjectType.LocalEntityDeclarationDef, entity.EntityName, false);
            entityDeclaration.EntityPath = $"{entity.Owner.AtCorpusPath}/{entity.EntityName}";

            manifest.Entities.Add(entityDeclaration);

            Assert.AreEqual("local:/entityName.cdm.json/entityName", entityDeclaration.EntityPath);
            Assert.AreEqual("entityName", entityDeclaration.EntityName);

            Assert.AreEqual(1, manifest.Entities.AllItems.Count);
            Assert.AreEqual(entityDeclaration, manifest.Entities.AllItems[0]);
        }

        [TestMethod]
        public void TestManifestAddListOfEntityDeclarations()
        {
            var cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.Storage.DefaultNamespace = "local";
            cdmCorpus.Storage.Mount("local", new LocalAdapter("CdmCorpus/LocalPath"));

            var ctx = cdmCorpus.Ctx;

            var cdmDocument = new CdmDocumentDefinition(ctx, "NameOfDocument");
            var collection = new CdmEntityCollection(ctx, cdmDocument);

            var entityList = new List<CdmEntityDefinition>();

            for (int i = 0; i < 2; i++)
            {
                var entity = new CdmEntityDefinition(cdmCorpus.Ctx, $"entityName_{i}", null);
                this.CreateDocumentForEntity(cdmCorpus, entity);
                entityList.Add(entity);
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
        public void TestCdmEntityCollectionRemoveEntityDeclarationDefinition()
        {
            var manifest = GenerateManifest("C:\\Root\\Path");
            var entity = new CdmEntityDefinition(manifest.Ctx, "entityName", null);
            this.CreateDocumentForEntity(manifest.Ctx.Corpus, entity);
            var otherEntity = new CdmEntityDefinition(manifest.Ctx, "otherEntityName", null);
            this.CreateDocumentForEntity(manifest.Ctx.Corpus, otherEntity);

            manifest.Entities.Add(entity);
            manifest.Entities.Add(otherEntity);

            Assert.AreEqual(2, manifest.Entities.AllItems.Count);

            bool removed = manifest.Entities.Remove(entity);

            Assert.AreEqual(true, removed);
            Assert.AreEqual(1, manifest.Entities.AllItems.Count);
            Assert.AreEqual(otherEntity.EntityName, manifest.Entities.AllItems[0].EntityName);

            removed = manifest.Entities.Remove(entity);
            Assert.AreEqual(false, removed);
            Assert.AreEqual(1, manifest.Entities.AllItems.Count);
        }

        /// <summary>
        /// For an entity, it creates a document that will containt the entity.
        /// </summary>
        /// <param name="cdmCorpus">The corpus everything belongs to.</param>
        /// <param name="entity">The entity we want a document for.</param>
        /// <returns>A document containing desired entity.</returns>
        private CdmDocumentDefinition CreateDocumentForEntity(CdmCorpusDefinition cdmCorpus, CdmEntityDefinition entity, string nameSpace = "local")
        {
            var cdmFolderDef = cdmCorpus.Storage.FetchRootFolder(nameSpace);
            var entityDoc = cdmCorpus.MakeObject<CdmDocumentDefinition>(Enums.CdmObjectType.DocumentDef, $"{entity.EntityName}.cdm.json", false);

            cdmFolderDef.Documents.Add(entityDoc);
            entityDoc.Definitions.Add(entity);
            return entityDoc;
        }

        /// <summary>
        /// Creates a Manifest used for the tests.
        /// </summary>
        /// <param name="localRootPath">A string used as root path for "local" namespace.</param>
        /// <returns>Created Manifest.</returns>
        private CdmManifestDefinition GenerateManifest(string localRootPath)
        {
            var cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.Storage.DefaultNamespace = "local";
            cdmCorpus.SetEventCallback(new EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);

            cdmCorpus.Storage.Mount("local", new LocalAdapter(localRootPath));

            // add cdm namespace
            cdmCorpus.Storage.Mount("cdm", new LocalAdapter("C:\\Root\\Path"));

            var manifest = new CdmManifestDefinition(cdmCorpus.Ctx, "manifest");
            manifest.FolderPath = "/";
            manifest.Namespace = "local";

            return manifest;
        }
    }
}
