// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.CdmCollection
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
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
            var manifest = CdmCollectionHelperFunctions.GenerateManifest("C:\\Root\\Path");
            var cdmCorpus = manifest.Ctx.Corpus;
            
            var entity = new CdmEntityDefinition(cdmCorpus.Ctx, "entityName", null);
            entity.Explanation = "The explanation of the entity";

            CdmCollectionHelperFunctions.CreateDocumentForEntity(cdmCorpus, entity);

            var cdmEntity = new CdmEntityDefinition(cdmCorpus.Ctx, "cdmEntityName", null);
            CdmCollectionHelperFunctions.CreateDocumentForEntity(cdmCorpus, cdmEntity, "cdm");


            var localizedEntityDeclaration = manifest.Entities.Add(entity);
            var cdmEntityDeclaration = manifest.Entities.Add(cdmEntity);

            Assert.AreEqual("The explanation of the entity", localizedEntityDeclaration.Explanation);
            Assert.AreEqual("entityName.cdm.json/entityName", localizedEntityDeclaration.EntityPath);
            Assert.AreEqual("entityName", localizedEntityDeclaration.EntityName);
            Assert.AreEqual("cdm:/cdmEntityName.cdm.json/cdmEntityName", cdmEntityDeclaration.EntityPath);
            Assert.AreEqual("entityName", localizedEntityDeclaration.EntityName);

            Assert.AreEqual(2, manifest.Entities.Count);
            Assert.AreEqual(localizedEntityDeclaration, manifest.Entities[0]);
            Assert.AreEqual(cdmEntityDeclaration, manifest.Entities[1]);
        }

        /// <summary>
        /// Tests whether the CdmEntityDeclarationDefinition can be passed directly to Manifest.Entities.Add() .
        /// </summary>
        [TestMethod]
        public void TestManifestCanAddEntityDeclaration()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest("C:\\Root\\Path");
            var entity = new CdmEntityDefinition(manifest.Ctx, "entityName", null);

            CdmCollectionHelperFunctions.CreateDocumentForEntity(manifest.Ctx.Corpus, entity);

            var entityDeclaration = manifest.Ctx.Corpus.MakeObject<CdmEntityDeclarationDefinition>(Enums.CdmObjectType.LocalEntityDeclarationDef, entity.EntityName, false);
            entityDeclaration.EntityPath = $"{entity.Owner.AtCorpusPath}/{entity.EntityName}";

            manifest.Entities.Add(entityDeclaration);

            Assert.AreEqual("local:/entityName.cdm.json/entityName", entityDeclaration.EntityPath);
            Assert.AreEqual("entityName", entityDeclaration.EntityName);

            Assert.AreEqual(1, manifest.Entities.Count);
            Assert.AreEqual(entityDeclaration, manifest.Entities[0]);
        }

        /// <summary>
        /// Tests whether the EntityDefinition can be passed directly to Manifest.Entities.Add().
        /// </summary>
        [TestMethod]
        public void TestManifestCanAddEntityDefinition()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest("C:\\Root\\Path");
            var entity = new CdmEntityDefinition(manifest.Ctx, "entityName", null);

            CdmCollectionHelperFunctions.CreateDocumentForEntity(manifest.Ctx.Corpus, entity);

            manifest.Entities.Add(entity);

            Assert.AreEqual(1, manifest.Entities.Count);
            Assert.AreEqual("entityName", entity.EntityName);
        }

        /// <summary>
        /// Tests whether the EntityDefinition can be passed directly to Manifest.Entities.Add().
        /// </summary>
        [TestMethod]
        public void TestManifestCannotAddEntityDefinitionWithoutCreatingDocument()
        {
            var cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.Storage.DefaultNamespace = "local";

            var callback = new EventCallback();
            var functionWasCalled = false;
            var functionParameter1 = CdmStatusLevel.Info;
            string functionParameter2 = null;
            callback.Invoke = (CdmStatusLevel statusLevel, string message1) =>
            {
                functionWasCalled = true;
                functionParameter1 = statusLevel;
                functionParameter2 = message1;
            };
            cdmCorpus.SetEventCallback(callback);

            cdmCorpus.Storage.Mount("local", new LocalAdapter("C:\\Root\\Path"));

            var manifest = new CdmManifestDefinition(cdmCorpus.Ctx, "manifest");
            manifest.FolderPath = "/";
            manifest.Namespace = "local";

            var entity = new CdmEntityDefinition(manifest.Ctx, "entityName", null);

            var corpus = new CdmCorpusDefinition();
            manifest.Entities.Add(entity);

            Assert.IsTrue(functionWasCalled);
            Assert.AreEqual(CdmStatusLevel.Error, functionParameter1);
            Assert.IsTrue(functionParameter2.Contains("Expected entity to have an \"Owner\" document set. Cannot create entity declaration to add to manifest. "));


            Assert.AreEqual(0, manifest.Entities.Count);
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
                CdmCollectionHelperFunctions.CreateDocumentForEntity(cdmCorpus, entity);
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
            var manifest = CdmCollectionHelperFunctions.GenerateManifest("C:\\Root\\Path");
            var entity = new CdmEntityDefinition(manifest.Ctx, "entityName", null);
            CdmCollectionHelperFunctions.CreateDocumentForEntity(manifest.Ctx.Corpus, entity);
            var otherEntity = new CdmEntityDefinition(manifest.Ctx, "otherEntityName", null);
            CdmCollectionHelperFunctions.CreateDocumentForEntity(manifest.Ctx.Corpus, otherEntity);

            manifest.Entities.Add(entity);
            manifest.Entities.Add(otherEntity);

            Assert.AreEqual(2, manifest.Entities.Count);

            bool removed = manifest.Entities.Remove(entity);

            Assert.IsTrue(removed);
            Assert.AreEqual(1, manifest.Entities.Count);
            Assert.AreEqual(otherEntity.EntityName, manifest.Entities[0].EntityName);

            removed = manifest.Entities.Remove(entity);
            Assert.IsFalse(removed);
            Assert.AreEqual(1, manifest.Entities.Count);
        }
    }
}
