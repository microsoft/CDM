// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    [TestClass]
    public class ManifestDefinitionTests
    {
        /// <summary>
        /// Tests if the copy function creates copies of the sub objects
        /// </summary>
        [TestMethod]
        public void TestManifestCopy()
        {
            var corpus = new CdmCorpusDefinition();
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
