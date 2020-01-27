namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.CdmCollection
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;

    [TestClass]
    public class CdmDefinitionCollectionTest
    {
        [TestMethod]
        public void TestCdmDefinitionCollectionAdd()
        {
            var document = CdmCollectionHelperFunctions.GenerateManifest("C:\\Nothing");
            document.IsDirty = false;

            var attribute = new CdmAttributeContext(document.Ctx, "the attribute");
            var folder = new CdmFolderDefinition(document.Ctx, "The folder");
            var trait = new CdmTraitDefinition(document.Ctx, "The trait");

            var addedAttribute = document.Definitions.Add(attribute);
            var addedFolder = document.Definitions.Add(folder);
            var addedTrait = document.Definitions.Add(trait);

            Assert.IsTrue(document.IsDirty);
            Assert.AreEqual(3, document.Definitions.Count);
            Assert.AreEqual(attribute, addedAttribute);
            Assert.AreEqual(folder, addedFolder);
            Assert.AreEqual(trait, addedTrait);
            Assert.AreEqual(attribute, document.Definitions[0]);
            Assert.AreEqual(folder, document.Definitions[1]);
            Assert.AreEqual(trait, document.Definitions[2]);
            Assert.AreEqual(document, attribute.InDocument);
            Assert.AreEqual(document, trait.InDocument);
            Assert.AreEqual(document, attribute.Owner);
            Assert.AreEqual(document, folder.Owner);
            Assert.AreEqual(document, trait.Owner);
        }

        [TestMethod]
        public void TestCdmDefinitionCollectionInsert()
        {
            var document = CdmCollectionHelperFunctions.GenerateManifest("C:\\Nothing");

            var ent1 = document.Definitions.Add("ent1");
            var ent2 = document.Definitions.Add("ent2");

            document.IsDirty = false;

            var attribute = new CdmAttributeContext(document.Ctx, "the attribute");

            document.Definitions.Insert(0, attribute);

            Assert.AreEqual(3, document.Definitions.Count);
            Assert.IsTrue(document.IsDirty);
            Assert.AreEqual(attribute, document.Definitions[0]);
            Assert.AreEqual(document, attribute.InDocument);
            Assert.AreEqual(document, attribute.Owner);
            Assert.AreEqual(ent1, document.Definitions[1]);
            Assert.AreEqual(ent2, document.Definitions[2]);
        }

        [TestMethod]
        public void TestCdmDefinitionCollectionAddEntityByProvidingName()
        {
            var document = CdmCollectionHelperFunctions.GenerateManifest("C:\\Nothing");
            document.IsDirty = false;

            var entity = document.Definitions.Add("theNameOfTheEntity");
            Assert.IsTrue(document.IsDirty);
            Assert.AreEqual(entity, document.Definitions[0]);
            Assert.AreEqual(document, entity.InDocument);
            Assert.AreEqual(document, entity.Owner);
            Assert.AreEqual("theNameOfTheEntity", entity.EntityName);
        }

        [TestMethod]
        public void TestCdmDefinitionCollectionAddByProvidingTypeAndName()
        {
            var document = CdmCollectionHelperFunctions.GenerateManifest("C:\\Nothing");
            document.IsDirty = false;

            var attribute = document.Definitions.Add(CdmObjectType.AttributeContextDef, "Name of attribute");
            var trait = document.Definitions.Add(CdmObjectType.TraitDef, "Name of trait");

            Assert.IsTrue(document.IsDirty);
            Assert.AreEqual(attribute, document.Definitions[0]);
            Assert.AreEqual(trait, document.Definitions[1]);
            Assert.AreEqual(document, ((CdmObjectBase)attribute).InDocument);
            Assert.AreEqual(document, attribute.Owner);
            Assert.AreEqual(document, ((CdmObjectBase)trait).InDocument);
            Assert.AreEqual(document, trait.Owner);
        }

        [TestMethod]
        public void TestCdmDefinitionCollectionAddRange()
        {
            var document = CdmCollectionHelperFunctions.GenerateManifest("C:\\Nothing");
            document.IsDirty = false;

            var attribute = new CdmAttributeContext(document.Ctx, "the attribute");
            var folder = new CdmFolderDefinition(document.Ctx, "The folder");
            var trait = new CdmTraitDefinition(document.Ctx, "The trait");

            var definitionsList = new List<CdmObjectDefinition>()
            {
                attribute,
                folder,
                trait
            };
            document.Definitions.AddRange(definitionsList);

            Assert.IsTrue(document.IsDirty);
            Assert.AreEqual(3, document.Definitions.Count);
            Assert.AreEqual(attribute, document.Definitions[0]);
            Assert.AreEqual(folder, document.Definitions[1]);
            Assert.AreEqual(trait, document.Definitions[2]);
            Assert.AreEqual(document, attribute.InDocument);
            Assert.AreEqual(document, trait.InDocument);
            Assert.AreEqual(document, attribute.Owner);
            Assert.AreEqual(document, folder.Owner);
            Assert.AreEqual(document, trait.Owner);
        }
    }
}
