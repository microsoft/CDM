// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence.ModelJson
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    using Microsoft.CommonDataModel.Tools.Processor;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using System.Threading.Tasks;
    using System.Collections.Generic;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types;
    using Microsoft.CommonDataModel.ObjectModel.Persistence;

    [TestClass]
    public class TypeAttributeTest
    {
        /// <summary>
        /// Testing that "is.localized.describedAs" trait with a table of three entries (en, rs and cn) is fully preserved when running ModelJson TypeAttributePersistence ToData.
        /// </summary>
        [TestMethod]
        public void TestModelJsonToDataTypeAttribute()
        {
            CdmCorpusDefinition corpus = new CdmCorpusDefinition();
            corpus.SetEventCallback(new EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);
            corpus.Storage.Mount("local", new LocalAdapter("C:\\Root\\Path"));
            corpus.Storage.DefaultNamespace = "local";

            var cdmTypeAttributeDefinition = corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, "TestSavingTraitAttribute", false);
            
            List<string> englishConstantsList = new List<string>() { "en", "Some description in English language" };
            List<string> serbianConstantsList = new List<string>() { "sr", "Opis na srpskom jeziku" };
            List<string> chineseConstantsList = new List<string>() { "cn", "一些中文描述" };
            List<List<string>> listOfConstLists = new List<List<string>> { englishConstantsList, serbianConstantsList, chineseConstantsList };

            var constEntDef = corpus.MakeObject<CdmConstantEntityDefinition>(CdmObjectType.ConstantEntityDef, "localizedDescriptions", false);
            constEntDef.ConstantValues = listOfConstLists;
            constEntDef.EntityShape = corpus.MakeRef<CdmEntityReference>(CdmObjectType.EntityRef, "localizedTable", true);
            var traitReference2 = corpus.MakeObject<CdmTraitReference>(CdmObjectType.TraitRef, "is.localized.describedAs", false);
            traitReference2.Arguments.Add("localizedDisplayText", corpus.MakeRef<CdmEntityReference>(CdmObjectType.EntityRef, constEntDef, true));
            cdmTypeAttributeDefinition.AppliedTraits.Add(traitReference2);

            var result = PersistenceLayer.ToData<CdmTypeAttributeDefinition, Task<Attribute>>(cdmTypeAttributeDefinition, null, null, PersistenceLayer.ModelJson).Result;
            Assert.IsNotNull(result.Traits);

            var argument = result.Traits[0].ToObject<TraitReferenceDefinition>().Arguments[0].ToObject<Argument>();
            List<List<string>> constantValues = argument.Value.ToObject<EntityReferenceDefinition>().EntityReference.ToObject<ConstantEntity>().ConstantValues;

            Assert.AreEqual("en", constantValues[0][0]);
            Assert.AreEqual("Some description in English language", constantValues[0][1]);
            Assert.AreEqual("sr", constantValues[1][0]);
            Assert.AreEqual("Opis na srpskom jeziku", constantValues[1][1]);
            Assert.AreEqual("cn", constantValues[2][0]);
            Assert.AreEqual("一些中文描述", constantValues[2][1]);
        }
    }
}
