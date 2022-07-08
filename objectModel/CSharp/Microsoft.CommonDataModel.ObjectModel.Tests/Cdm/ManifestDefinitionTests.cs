// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
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
    }
}
