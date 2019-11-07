namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.CdmCollection
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.Tools.Processor;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;

    [TestClass]
    public class CdmTraitCollectionTests
    {
        [TestMethod]
        public void TestCdmTraitCollectionAdd()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest("C:\\Root\\Path");

            var trait = new CdmTraitDefinition(manifest.Ctx, "TraitName", null);
            var otherTrait = new CdmTraitDefinition(manifest.Ctx, "Name of other Trait", null);
            manifest.TraitCache = new Dictionary<string, ResolvedTraitSetBuilder>();

            var addedTrait = manifest.ExhibitsTraits.Add(trait);
            var addedOtherTrait = manifest.ExhibitsTraits.Add(otherTrait);

            Assert.IsNull(manifest.TraitCache);
            Assert.AreEqual(2, manifest.ExhibitsTraits.Count);
            Assert.AreEqual(trait, manifest.ExhibitsTraits[0].ExplicitReference);
            Assert.AreEqual(otherTrait, manifest.ExhibitsTraits[1].ExplicitReference);
            Assert.AreEqual(addedTrait, manifest.ExhibitsTraits[0]);
            Assert.AreEqual(addedOtherTrait, manifest.ExhibitsTraits[1]);

            Assert.AreEqual(manifest, manifest.ExhibitsTraits[0].Owner);
        }

        [TestMethod]
        public void TestCdmTraitCollectionInsert()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest("C:\\Root\\Path");

            var trait = new CdmTraitReference(manifest.Ctx, "TraitName", false, false);
            var otherTrait = new CdmTraitReference(manifest.Ctx, "Name of other Trait", false, false);

            manifest.TraitCache = new Dictionary<string, ResolvedTraitSetBuilder>();

            manifest.ExhibitsTraits.Insert(0, trait);
            manifest.ExhibitsTraits.Insert(0, otherTrait);

            Assert.IsNull(manifest.TraitCache);
            Assert.AreEqual(2, manifest.ExhibitsTraits.Count);
            Assert.AreEqual(otherTrait, manifest.ExhibitsTraits[0]);
            Assert.AreEqual(trait, manifest.ExhibitsTraits[1]);

            Assert.AreEqual(manifest, manifest.ExhibitsTraits[0].Owner);
        }

        [TestMethod]
        public void CdmTraitCollectionAddRange()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest("C:\\Root\\Path");

            var trait = new CdmTraitDefinition(manifest.Ctx, "TraitName", null);
            var otherTrait = new CdmTraitDefinition(manifest.Ctx, "Name of other Trait", null);

            var traitList = new List<CdmTraitDefinition> { trait, otherTrait };

            manifest.ExhibitsTraits.AddRange(traitList);

            Assert.AreEqual(2, manifest.ExhibitsTraits.Count);
            Assert.AreEqual(trait, manifest.ExhibitsTraits[0].ExplicitReference);
            Assert.AreEqual(otherTrait, manifest.ExhibitsTraits[1].ExplicitReference);

            Assert.AreEqual(manifest, manifest.ExhibitsTraits[0].Owner);
        }

        [TestMethod]
        public void CdmTraitCollectionRemove()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest("C:\\Root\\Path");

            var trait = new CdmTraitDefinition(manifest.Ctx, "TraitName", null);
            var otherTrait = new CdmTraitDefinition(manifest.Ctx, "Name of other Trait", null);

            manifest.ExhibitsTraits.Add(trait);
            manifest.ExhibitsTraits.Add(otherTrait);

            Assert.AreEqual(2, manifest.ExhibitsTraits.Count);
            manifest.TraitCache = new Dictionary<string, ResolvedTraitSetBuilder>();
            var removed = manifest.ExhibitsTraits.Remove(trait);
            Assert.IsTrue(removed);
            Assert.AreEqual(1, manifest.ExhibitsTraits.Count);
            Assert.IsNull(manifest.TraitCache);

            // try to remove a second time.
            removed = manifest.ExhibitsTraits.Remove(trait);
            Assert.IsFalse(removed);
            Assert.AreEqual(1, manifest.ExhibitsTraits.Count);
            Assert.AreEqual(otherTrait, manifest.ExhibitsTraits[0].ExplicitReference);

            removed = manifest.ExhibitsTraits.Remove("Name of other Trait");
            Assert.IsTrue(removed);
            Assert.AreEqual(0, manifest.ExhibitsTraits.Count);

            manifest.ExhibitsTraits.Add(trait);
            Assert.AreEqual(1, manifest.ExhibitsTraits.Count);

            removed = manifest.ExhibitsTraits.Remove(manifest.ExhibitsTraits[0]);
            Assert.IsTrue(removed);
            Assert.AreEqual(0, manifest.ExhibitsTraits.Count);
        }

        [TestMethod]
        public void CdmTraitCollectionRemoveAt()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest("C:\\Root\\Path");

            var trait = new CdmTraitDefinition(manifest.Ctx, "TraitName", null);
            var otherTrait = new CdmTraitDefinition(manifest.Ctx, "Name of other Trait", null);

            manifest.ExhibitsTraits.Add(trait);
            manifest.ExhibitsTraits.Add(otherTrait);

            manifest.ExhibitsTraits.Remove(trait);
            Assert.IsNull(manifest.TraitCache);

            manifest.ExhibitsTraits.Add(trait);
            manifest.ExhibitsTraits.RemoveAt(1);
            Assert.IsNull(manifest.TraitCache);
            Assert.AreEqual(1, manifest.ExhibitsTraits.Count);
            Assert.AreEqual(otherTrait, manifest.ExhibitsTraits[0].ExplicitReference);
        }

        [TestMethod]
        public void CdmTraitCollectionIndexOf()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest("C:\\Root\\Path");

            var trait = new CdmTraitDefinition(manifest.Ctx, "TraitName", null);
            var otherTrait = new CdmTraitDefinition(manifest.Ctx, "Name of other Trait", null);

            manifest.ExhibitsTraits.Add(trait);
            manifest.ExhibitsTraits.Add(otherTrait);

            int index = manifest.ExhibitsTraits.IndexOf(trait);
            Assert.AreEqual(0, index);
            index = manifest.ExhibitsTraits.IndexOf(otherTrait);
            Assert.AreEqual(1, index);

            index = manifest.ExhibitsTraits.IndexOf(manifest.ExhibitsTraits[0]);
            Assert.AreEqual(0, index);
            index = manifest.ExhibitsTraits.IndexOf(manifest.ExhibitsTraits[1]);
            Assert.AreEqual(1, index);

            index = manifest.ExhibitsTraits.IndexOf("TraitName");
            Assert.AreEqual(0, index);
            index = manifest.ExhibitsTraits.IndexOf("Name of other Trait");
            Assert.AreEqual(1, index);
        }

        [TestMethod]
        public void CdmTraitCollectionRemoveOnlyFromProperty()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest("C:\\Root\\Path");

            var trait = new CdmTraitReference(manifest.Ctx, "TraitName", false, false);
            var otherTrait = new CdmTraitReference(manifest.Ctx, "Name of other Trait", false, false);

            manifest.ExhibitsTraits.Add(trait);
            manifest.ExhibitsTraits.Add(otherTrait);

            Assert.AreEqual(false, trait.IsFromProperty);
            Assert.AreEqual(false, otherTrait.IsFromProperty);

            Assert.AreEqual(2, manifest.ExhibitsTraits.Count);
            var removed = manifest.ExhibitsTraits.Remove(trait, true);
            Assert.IsFalse(removed);
            Assert.AreEqual(2, manifest.ExhibitsTraits.Count);

            otherTrait.IsFromProperty = true;

            removed = manifest.ExhibitsTraits.Remove(otherTrait, true);
            Assert.IsTrue(removed);
            Assert.AreEqual(1, manifest.ExhibitsTraits.Count);
            Assert.AreEqual(trait, manifest.ExhibitsTraits[0]);
        }

        [TestMethod]
        public void CdmTraitCollectionRemovePrioritizeFromProperty()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest("C:\\Root\\Path");

            var trait = new CdmTraitReference(manifest.Ctx, "TraitName", false, false);
            var otherTrait = new CdmTraitReference(manifest.Ctx, "Name of other Trait", false, false);

            manifest.ExhibitsTraits.Add(trait);
            manifest.ExhibitsTraits.Add(otherTrait);

            var traitCopyFromProperty = new CdmTraitReference(manifest.Ctx, "TraitName", false, false);
            traitCopyFromProperty.IsFromProperty = true;
            manifest.ExhibitsTraits.Add(traitCopyFromProperty);

            Assert.AreEqual(false, trait.IsFromProperty);
            Assert.AreEqual(false, otherTrait.IsFromProperty);
            Assert.AreEqual(true, traitCopyFromProperty.IsFromProperty);

            Assert.AreEqual(3, manifest.ExhibitsTraits.Count);
            var removed = manifest.ExhibitsTraits.Remove("TraitName");
            Assert.IsTrue(removed);
            Assert.AreEqual(2, manifest.ExhibitsTraits.Count);
            Assert.AreEqual(trait, manifest.ExhibitsTraits[0]);
            Assert.AreEqual(otherTrait, manifest.ExhibitsTraits[1]);
        }

        [TestMethod]
        public void CdmTraitCollectionRemoveTraitDefinitionPrioritizeFromProperty()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest("C:\\Root\\Path");

            var trait = new CdmTraitDefinition(manifest.Ctx, "TraitName", null);
            var otherTrait = new CdmTraitDefinition(manifest.Ctx, "Name of other Trait", null);

            manifest.ExhibitsTraits.Add(trait);
            manifest.ExhibitsTraits.Add(otherTrait);
            manifest.ExhibitsTraits.Add(trait);
            manifest.ExhibitsTraits[2].IsFromProperty = true;
            manifest.ExhibitsTraits.Add(otherTrait);
            manifest.ExhibitsTraits.Add(trait);
            manifest.ExhibitsTraits[4].IsFromProperty = true;
            manifest.ExhibitsTraits.Add(otherTrait);
            Assert.AreEqual(6, manifest.ExhibitsTraits.Count);

            Assert.AreEqual(true, manifest.ExhibitsTraits[2].IsFromProperty);

            var removed = manifest.ExhibitsTraits.Remove(trait);
            Assert.AreEqual("TraitName", (manifest.ExhibitsTraits[0].ExplicitReference as CdmTraitDefinition).TraitName);
            Assert.AreEqual("Name of other Trait", (manifest.ExhibitsTraits[2].ExplicitReference as CdmTraitDefinition).TraitName);
            Assert.AreEqual("TraitName", (manifest.ExhibitsTraits[3].ExplicitReference as CdmTraitDefinition).TraitName);            
        }

        [TestMethod]
        public void CdmTraitCollectionIndexOfOnlyFromProperty()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest("C:\\Root\\Path");

            var trait = new CdmTraitDefinition(manifest.Ctx, "TraitName", null);
            var otherTrait = new CdmTraitDefinition(manifest.Ctx, "Name of other Trait", null);

            manifest.ExhibitsTraits.Add(trait);
            manifest.ExhibitsTraits.Add(otherTrait);

            Assert.AreEqual(false, manifest.ExhibitsTraits[0].IsFromProperty);
            Assert.AreEqual(false, manifest.ExhibitsTraits[1].IsFromProperty);

            var index = manifest.ExhibitsTraits.IndexOf(trait.TraitName, true);
            Assert.AreEqual(-1, index);

            manifest.ExhibitsTraits.Add(trait);
            manifest.ExhibitsTraits.Add(otherTrait);
            manifest.ExhibitsTraits.Add(trait);
            manifest.ExhibitsTraits.Add(otherTrait);

            Assert.AreEqual(6, manifest.ExhibitsTraits.Count);
            manifest.ExhibitsTraits[2].IsFromProperty = true;
            index = manifest.ExhibitsTraits.IndexOf(trait.TraitName, true);
            Assert.AreEqual(index, 2);
            index = manifest.ExhibitsTraits.IndexOf(trait.TraitName);
            Assert.AreEqual(index, 2);
        }

        [TestMethod]
        public void CdmTraitCollectionClear()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest("C:\\Root\\Path");

            var trait = new CdmTraitReference(manifest.Ctx, "TraitName", false, false);
            var otherTrait = new CdmTraitReference(manifest.Ctx, "Name of other Trait", false, false);

            manifest.ExhibitsTraits.Add("trait1");
            manifest.ExhibitsTraits.Add("trait2");
            manifest.TraitCache = new Dictionary<string, ResolvedTraitSetBuilder>();

            manifest.ExhibitsTraits.Clear();
            Assert.AreEqual(0, manifest.ExhibitsTraits.Count);
            Assert.IsNull(manifest.TraitCache);
        }
    }
}
