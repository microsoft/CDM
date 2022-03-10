// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.CdmCollection
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;

    [TestClass]
    public class CdmArgumentCollectionTests
    {
        [TestMethod]
        public void TestCdmArgumentCollectionAdd()
        {
            var trait = GenerateTrait();

            var argumentDefinition = new CdmArgumentDefinition(trait.Ctx, null);

            trait.ResolvedArguments = true;
            Assert.AreEqual(0, trait.Arguments.Count);
            var addedArgument = trait.Arguments.Add(argumentDefinition);
            Assert.AreEqual(argumentDefinition, addedArgument);
            Assert.AreEqual(1, trait.Arguments.Count);
            Assert.AreEqual(argumentDefinition, trait.Arguments[0]);
            Assert.IsFalse(trait.ResolvedArguments);
            Assert.AreEqual(trait, trait.Arguments[0].Owner);

            trait.ResolvedArguments = true;
            trait.Arguments.Add("nameOfTrait", "ValueOfTrait");
            Assert.AreEqual(2, trait.Arguments.Count);
            Assert.AreEqual("nameOfTrait", trait.Arguments[1].Name);
            Assert.AreEqual("ValueOfTrait", trait.Arguments[1].Value);
            Assert.AreEqual(trait, trait.Arguments[1].Owner);
        }

        [TestMethod]
        public void TestCdmArgumentCollectionInsert()
        {
            var trait = GenerateTrait();
            
            var toInsert = new CdmArgumentDefinition(trait.Ctx, null);

            var arg1 = trait.Arguments.Add("arg1");
            var arg2 = trait.Arguments.Add("arg2");

            trait.ResolvedArguments = true;

            trait.Arguments.Insert(1, toInsert);
            Assert.AreEqual(3, trait.Arguments.Count);
            Assert.IsFalse(trait.ResolvedArguments);
            Assert.AreEqual(arg1, trait.Arguments[0]);
            Assert.AreEqual(toInsert, trait.Arguments[1]);
            Assert.AreEqual(arg2, trait.Arguments[2]);
            Assert.AreEqual(trait, trait.Arguments[1].Owner);
        }

        [TestMethod]
        public void TestCdmArgumentCollectionAddRange()
        {
            var trait = GenerateTrait();
            trait.ResolvedArguments = true;
            var argList = new List<CdmArgumentDefinition>();
            var argumentDefinition = new CdmArgumentDefinition(trait.Ctx, null)
            {
                Name = "Arg1",
                Value = 123
            };
            argList.Add(argumentDefinition);
            var valOfArg2 = CdmCollectionHelperFunctions.GenerateManifest("C://Nothing");
            argumentDefinition = new CdmArgumentDefinition(trait.Ctx, null)
            {
                Name = "Arg2",
                Value = valOfArg2
            };
            argList.Add(argumentDefinition);

            trait.Arguments.AddRange(argList);

            Assert.AreEqual(2, trait.Arguments.Count);
            Assert.IsFalse(trait.ResolvedArguments);
            Assert.AreEqual("Arg1", trait.Arguments[0].Name);
            Assert.AreEqual(123, trait.Arguments.Item("Arg1").Value);
            Assert.AreEqual(trait, trait.Arguments[0].Owner);
            Assert.AreEqual("Arg2", trait.Arguments[1].Name);
            Assert.AreEqual(valOfArg2, trait.Arguments.Item("Arg2").Value);
        }

        [TestMethod]
        public void TestCdmArgumentCollectionFetchValueOrOnlyValue()
        {
            var trait = GenerateTrait();

            trait.ResolvedArguments = true;
            trait.Arguments.Add(null, "ValueOfTrait");

            var value = trait.Arguments.FetchValue("NameOfTrait");
            // This is what is needed by current code.
            Assert.AreEqual("ValueOfTrait", value);

            var argumentDefinition = new CdmArgumentDefinition(trait.Ctx, null);

            trait.ResolvedArguments = true;
            trait.Arguments.Add(argumentDefinition);

            trait.ResolvedArguments = true;
            trait.Arguments.Add("TraitName", "Value of a named trait");

            value = trait.Arguments.FetchValue("TraitName");
            Assert.AreEqual("Value of a named trait", value);
        }

        [TestMethod]
        public void TestCdmArgumentCollectionUpdateArgument()
        {
            var trait = GenerateTrait();

            trait.Arguments.Add("nameOfTrait", "ValueOfTrait");
            trait.Arguments.Add("nameOfOtherTrait", "ValueOfOtherTrait");

            trait.Arguments.UpdateArgument("nameOfOtherTrait", "UpdatedValue");
            trait.Arguments.UpdateArgument("ThirdArgumentName", "ThirdArgumentValue");
            
            Assert.AreEqual(3, trait.Arguments.Count);
            Assert.AreEqual("ValueOfTrait", trait.Arguments[0].Value);
            Assert.AreEqual("UpdatedValue", trait.Arguments[1].Value);
            Assert.AreEqual("ThirdArgumentName", trait.Arguments[2].Name);
            Assert.AreEqual("ThirdArgumentValue", trait.Arguments[2].Value);
            Assert.AreEqual(trait, trait.Arguments[2].Owner);
        }

        [TestMethod]
        public void TestCdmCollectionAddPopulatesInDocumentWithVisit()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest("C:\\Nothing");

            var entityReference = new CdmLocalEntityDeclarationDefinition(manifest.Ctx, "entityName");

            var trait = entityReference.ExhibitsTraits.Add("theTrait");

            var argument = (trait as CdmTraitReference).Arguments.Add("GreatArgumentName", "GreatValue");

            manifest.Entities.Add(entityReference);

            Assert.AreEqual(manifest, manifest.InDocument);
            Assert.AreEqual(manifest, entityReference.InDocument);
            Assert.AreEqual(manifest, trait.InDocument);
            Assert.AreEqual(manifest, argument.InDocument);
        }

        private CdmTraitReference GenerateTrait()
        {
            var manifest = CdmCollectionHelperFunctions.GenerateManifest("C:\\Nothing");
            return new CdmTraitReference(manifest.Ctx, "traitName", false, false);
        }
    }
}
