// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Persistence;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.IO;
    using System.Threading.Tasks;

    [TestClass]
    public class ManifestDefinitionTests
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "ManifestDefinition");

        /// <summary>
        /// Tests if the imports on the resolved manifest are relative to the resolved manifest location.
        /// </summary>
        [TestMethod]
        public async Task TestResolvedManifestImport()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestResolvedManifestImport));
            // Make sure that we are not picking up the default namespace while testing.
            corpus.Storage.DefaultNamespace = "remote";

            var documentName = "localImport.cdm.json";
            var localFolder = corpus.Storage.FetchRootFolder("local");

            // Create a manifest that imports a document on the same folder.
            var manifest = new CdmManifestDefinition(corpus.Ctx, "default");
            manifest.Imports.Add(documentName);
            localFolder.Documents.Add(manifest);

            var document = new CdmDocumentDefinition(corpus.Ctx, documentName);
            localFolder.Documents.Add(document);

            // Resolve the manifest into a different folder.
            var resolvedManifest = await manifest.CreateResolvedManifestAsync("output:/default.manifest.cdm.json", null);

            // Checks if the import path on the resolved manifest points to the original location.
            Assert.AreEqual(1, resolvedManifest.Imports.Count);
            Assert.AreEqual($"local:/{documentName}", resolvedManifest.Imports[0].CorpusPath);
        }

        /// <summary>
        /// Tests if the copy function creates copies of the sub objects
        /// </summary>
        [TestMethod]
        public void TestManifestCopy()
        {
            var corpus = TestHelper.GetLocalCorpus("", nameof(TestManifestCopy), noInputAndOutputFolder: true);
            var manifest = new CdmManifestDefinition(corpus.Ctx, "name");

            var entityName = "entity";
            var subManifestName = "subManifest";
            var relationshipName = "relName";
            var traitName = "traitName";

            var entityDec = manifest.Entities.Add(entityName);
            var subManifest = manifest.SubManifests.Add(subManifestName);
            var relationship = manifest.Relationships.Add(relationshipName);
            var trait = manifest.ExhibitsTraits.Add(traitName);

            var copy = manifest.Copy() as CdmManifestDefinition;
            copy.Entities[0].EntityName = "newEntity";
            copy.SubManifests[0].ManifestName = "newSubManifest";
            copy.Relationships[0].Name = "newRelName";
            copy.ExhibitsTraits[0].NamedReference = "newTraitName";

            Assert.AreEqual(entityName, entityDec.EntityName);
            Assert.AreEqual(subManifestName, subManifest.ManifestName);
            Assert.AreEqual(relationshipName, relationship.Name);
            Assert.AreEqual(traitName, trait.NamedReference);
        }

        /// <summary>
        /// Tests if FileStatusCheckAsync() works properly for manifest loaded from model.json
        /// </summary>
        [TestMethod]
        public async Task TestModelJsonManifestFileStatusCheckAsync()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestModelJsonManifestFileStatusCheckAsync));
            var modeljsonAdapter = new ModelJsonUnitTestLocalAdapter(((LocalAdapter)corpus.Storage.NamespaceAdapters["local"]).Root);
            corpus.Storage.Mount("modeljson", modeljsonAdapter);
            corpus.Storage.DefaultNamespace = "modeljson";

            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>($"modeljson:/{PersistenceLayer.ModelJsonExtension}");

            Assert.IsTrue(manifest.IsVirtual);
            Assert.IsTrue(manifest.Entities[0] is CdmReferencedEntityDeclarationDefinition);
            Assert.IsTrue((manifest.Entities[0] as CdmReferencedEntityDeclarationDefinition).IsVirtual);
            Assert.IsTrue(manifest.Entities[1] is CdmLocalEntityDeclarationDefinition);
            Assert.IsTrue((manifest.Entities[1] as CdmLocalEntityDeclarationDefinition).IsVirtual);

            var timeBeforeLoad = DateTime.Now;

            var oldManifestLastFileModifiedTime = manifest._fileSystemModifiedTime;
            Assert.IsNull(manifest.LastFileStatusCheckTime);
            Assert.IsNull(manifest.Entities[0].LastFileStatusCheckTime);
            Assert.IsNull(manifest.Entities[1].LastFileStatusCheckTime);
            Assert.IsNull(manifest.LastFileModifiedTime);
            Assert.IsNull(manifest.Entities[0].LastFileModifiedTime);
            Assert.IsNull(manifest.Entities[1].LastFileModifiedTime);

            Assert.IsTrue(oldManifestLastFileModifiedTime < timeBeforeLoad);

            System.Threading.Thread.Sleep(100);

            await manifest.FileStatusCheckAsync();

            var newManifestLastFileStatusCheckTime = manifest.LastFileStatusCheckTime;
            var newRefEntityLastFileStatusCheckTime = manifest.Entities[0].LastFileStatusCheckTime;
            var newLocalEntityLastFileStatusCheckTime = manifest.Entities[1].LastFileStatusCheckTime;

            Assert.IsNotNull(manifest.LastFileModifiedTime);
            Assert.IsNotNull(manifest.Entities[0].LastFileModifiedTime);
            Assert.IsNotNull(manifest.Entities[1].LastFileModifiedTime);

            Assert.IsTrue(newManifestLastFileStatusCheckTime > timeBeforeLoad);
            Assert.IsTrue(newLocalEntityLastFileStatusCheckTime > timeBeforeLoad);
            Assert.IsTrue(newRefEntityLastFileStatusCheckTime > timeBeforeLoad);
        }
    }
}
