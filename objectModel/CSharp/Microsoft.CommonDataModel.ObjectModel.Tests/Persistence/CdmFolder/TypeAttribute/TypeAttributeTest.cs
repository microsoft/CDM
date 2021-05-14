// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence.CdmFolder
{
    using System.IO;

    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    using Newtonsoft.Json.Linq;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder;
    using Microsoft.CommonDataModel.Tools.Processor;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using System.Threading.Tasks;
    using System.Collections.Generic;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence;

    [TestClass]
    public class TypeAttributeTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private readonly string testsSubpath = Path.Combine("Persistence", "CdmFolder", "TypeAttribute");

        /// <summary>
        /// Testing that default value can be converted to a JToken.
        /// </summary>
        [TestMethod]
        public void TestNonNullDefaultValueAttribute()
        {
            JArray jArray = new JArray(
                new JObject(
                    new JProperty("languageTag", "en"),
                    new JProperty("displayText", "Preferred Customer"),
                    new JProperty("attributeValue", "1"),
                    new JProperty("displayOrder", "0")),
                new JObject(
                    new JProperty("languageTag", "en"),
                    new JProperty("displayText", "Standard"),
                    new JProperty("attributeValue", "2"),
                    new JProperty("displayOrder", "1")));

            JObject input = new JObject(new JProperty("defaultValue", jArray));

            CdmTypeAttributeDefinition cdmTypeAttributeDefinition = TypeAttributePersistence.FromData(new ResolveContext(new CdmCorpusDefinition(), null), input);

            TypeAttribute result = PersistenceLayer.ToData<CdmTypeAttributeDefinition, TypeAttribute>(cdmTypeAttributeDefinition, null, null, PersistenceLayer.CdmFolder);

            Assert.IsNotNull(result);
            Assert.IsTrue(JToken.DeepEquals(input["defaultValue"], result.DefaultValue));
        }

        /// <summary>
        /// Testing that "isPrimaryKey" property value is correct when reading from an unresolved and resolved entity schema.
        /// </summary>
        [TestMethod]
        public async Task TestReadingIsPrimaryKey()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestReadingIsPrimaryKey");

            var resOpt = new ResolveOptions()
            {
                ImportsLoadStrategy = ImportsLoadStrategy.Load
            };
            // Read from an unresolved entity schema.
            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/TeamMembership.cdm.json/TeamMembership", null , resOpt);
            CdmAttributeGroupReference attributeGroupRef = (CdmAttributeGroupReference)entity.Attributes[0];
            CdmAttributeGroupDefinition attributeGroup = (CdmAttributeGroupDefinition)attributeGroupRef.ExplicitReference;
            CdmTypeAttributeDefinition typeAttribute = (CdmTypeAttributeDefinition)attributeGroup.Members[0];

            Assert.IsTrue((bool)typeAttribute.IsPrimaryKey);

            // Check that the trait "is.identifiedBy" is created with the correct argument.
            var isIdentifiedBy1 = typeAttribute.AppliedTraits[1];
            Assert.AreEqual("is.identifiedBy", isIdentifiedBy1.NamedReference);
            Assert.AreEqual("TeamMembership/(resolvedAttributes)/teamMembershipId", (isIdentifiedBy1 as CdmTraitReference).Arguments[0].Value);

            // Read from a resolved entity schema.
            CdmEntityDefinition resolvedEntity = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/TeamMembership_Resolved.cdm.json/TeamMembership", null, resOpt);
            CdmTypeAttributeDefinition resolvedTypeAttribute = (CdmTypeAttributeDefinition)resolvedEntity.Attributes[0];

            Assert.IsTrue((bool)resolvedTypeAttribute.IsPrimaryKey);

            // Check that the trait "is.identifiedBy" is created with the correct argument.
            var isIdentifiedBy2 = resolvedTypeAttribute.AppliedTraits[6];
            Assert.AreEqual("is.identifiedBy", isIdentifiedBy2.NamedReference);

            CdmAttributeReference argumentValue = (isIdentifiedBy2 as CdmTraitReference).Arguments[0].Value;
            Assert.AreEqual("TeamMembership/(resolvedAttributes)/teamMembershipId", argumentValue.NamedReference);
        }

        /// <summary>
        /// Testing that "isPrimaryKey" property is set to true when "purpose" = "identifiedBy".
        /// </summary>
        [TestMethod]
        public async Task TestReadingIsPrimaryKeyConstructedFromPurpose()
        {
            var testInputPath = TestHelper.GetInputFolderPath(testsSubpath, "TestReadingIsPrimaryKeyConstructedFromPurpose");
            CdmCorpusDefinition corpus = new CdmCorpusDefinition();
            corpus.SetEventCallback(new EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);
            corpus.Storage.Mount("local", new LocalAdapter(testInputPath));
            corpus.Storage.DefaultNamespace = "local";

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/TeamMembership.cdm.json/TeamMembership");
            CdmAttributeGroupReference attributeGroupRef = (CdmAttributeGroupReference)entity.Attributes[0];
            CdmAttributeGroupDefinition attributeGroup = (CdmAttributeGroupDefinition)attributeGroupRef.ExplicitReference;
            CdmTypeAttributeDefinition typeAttribute = (CdmTypeAttributeDefinition)attributeGroup.Members[0];

            Assert.AreEqual("identifiedBy", typeAttribute.Purpose.NamedReference);
            Assert.IsTrue((bool)typeAttribute.IsPrimaryKey);
        }

        /// <summary>
        /// Testing fromData and toData correctly handles all properties
        /// </summary>
        [TestMethod]
        public async Task TestPropertyPersistence()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestPropertyPersistence", null);
            var callback = new EventCallback();
            var functionWasCalled = false;
            var functionParameter1 = CdmStatusLevel.Info;
            string functionParameter2 = null;
            callback.Invoke = (CdmStatusLevel statusLevel, string message1) =>
            {
                functionWasCalled = true;
                if (statusLevel.Equals(CdmStatusLevel.Error))
                {
                    functionParameter1 = statusLevel;
                    functionParameter2 = message1;
                }
            };
            corpus.SetEventCallback(callback);

            var entity = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/PropertyEntity.cdm.json/PropertyEntity");

            // test loading properties
            var attribute = entity.Attributes[0] as CdmTypeAttributeDefinition;
            Assert.IsTrue((bool)attribute.IsReadOnly);
            Assert.IsTrue((bool)attribute.IsNullable);
            Assert.AreEqual(attribute.SourceName, "propertyAttribute");
            Assert.AreEqual(attribute.Description, "Attribute that has all properties set.");
            Assert.AreEqual(attribute.DisplayName, "Property Attribute");
            Assert.AreEqual(attribute.SourceOrdering, 1);
            Assert.IsTrue((bool)attribute.ValueConstrainedToList);
            Assert.AreEqual(attribute.MaximumLength, 10);
            Assert.AreEqual(attribute.MaximumValue, "20");
            Assert.AreEqual(attribute.MinimumValue, "1");
            Assert.AreEqual(attribute.DataFormat, CdmDataFormat.String);
            Assert.AreEqual(attribute.DefaultValue[0]["displayText"], "Default");

            // test loading negative value properties
            var negativeAttribute = entity.Attributes[1] as CdmTypeAttributeDefinition;
            Assert.IsFalse((bool)negativeAttribute.IsReadOnly);
            Assert.IsFalse((bool)negativeAttribute.IsNullable);
            Assert.IsNull(negativeAttribute.SourceName);
            Assert.IsNull(negativeAttribute.Description);
            Assert.IsNull(negativeAttribute.DisplayName);
            Assert.AreEqual(negativeAttribute.SourceOrdering, 0);
            Assert.IsFalse((bool)negativeAttribute.ValueConstrainedToList);
            Assert.AreEqual(negativeAttribute.MaximumLength, 0);
            Assert.AreEqual(negativeAttribute.MaximumValue, "0");
            Assert.AreEqual(negativeAttribute.MinimumValue, "0");
            Assert.AreEqual(negativeAttribute.DataFormat, CdmDataFormat.Unknown);
            Assert.AreEqual(negativeAttribute.DefaultValue[0]["displayText"], "");

            // test loading values with wrongs types in file
            var wrongTypesAttribute = entity.Attributes[2] as CdmTypeAttributeDefinition;
            Assert.IsTrue((bool)wrongTypesAttribute.IsReadOnly);
            Assert.IsTrue((bool)wrongTypesAttribute.IsNullable);
            Assert.AreEqual(wrongTypesAttribute.SourceOrdering, 1);
            Assert.IsFalse((bool)wrongTypesAttribute.ValueConstrainedToList);
            Assert.AreEqual(wrongTypesAttribute.MaximumLength, 0);
            Assert.AreEqual(wrongTypesAttribute.MaximumValue, "20");
            Assert.AreEqual(wrongTypesAttribute.MinimumValue, "0");

            // test loading values with wrong types that cannot be properly converted
            var invalidValuesAttribute = entity.Attributes[3] as CdmTypeAttributeDefinition;
            Assert.IsFalse((bool)invalidValuesAttribute.IsReadOnly);
            Assert.IsNull(invalidValuesAttribute.MaximumLength);

            // test loading values with empty default value list that should log error
            var emptyDefaultValueAttribute = entity.Attributes[4] as CdmTypeAttributeDefinition;
            // test log error "Default value missing languageTag or displayText."
            Assert.IsTrue(functionWasCalled);
            Assert.AreEqual(CdmStatusLevel.Error, functionParameter1);
            Assert.IsTrue(functionParameter2.Contains("Default value missing languageTag or displayText."));
            Assert.IsNull(emptyDefaultValueAttribute.DefaultValue);
            // set the default value to an empty list for testing that it should be removed from the generated json.
            emptyDefaultValueAttribute.DefaultValue = new List<object>();

            var entityData = EntityPersistence.ToData(entity, null, null);

            // test toData for properties
            var attributeData = entityData.HasAttributes[0].ToObject<TypeAttribute>();
            Assert.IsTrue((bool)attributeData.IsReadOnly);
            Assert.IsTrue((bool)attributeData.IsNullable);
            Assert.AreEqual(attributeData.SourceName, "propertyAttribute");
            Assert.AreEqual(attributeData.Description, "Attribute that has all properties set.");
            Assert.AreEqual(attributeData.DisplayName, "Property Attribute");
            Assert.AreEqual(attributeData.SourceOrdering, 1);
            Assert.IsTrue((bool)attributeData.ValueConstrainedToList);
            Assert.AreEqual(attributeData.MaximumLength, 10);
            Assert.AreEqual(attributeData.MaximumValue, "20");
            Assert.AreEqual(attributeData.MinimumValue, "1");
            Assert.AreEqual(attributeData.DataFormat, "String");
            Assert.AreEqual(attributeData.DefaultValue[0]["displayText"], "Default");

            // test toData for negative value properties
            var negativeAttributeData = entityData.HasAttributes[1].ToObject<TypeAttribute>();
            Assert.IsNull(negativeAttributeData.IsReadOnly);
            Assert.IsNull(negativeAttributeData.IsNullable);
            Assert.IsNull(negativeAttributeData.SourceName);
            Assert.IsNull(negativeAttributeData.Description);
            Assert.IsNull(negativeAttributeData.DisplayName);
            Assert.IsNull(negativeAttributeData.SourceOrdering);
            Assert.IsNull(negativeAttributeData.ValueConstrainedToList);
            Assert.AreEqual(negativeAttributeData.MaximumLength, 0);
            Assert.AreEqual(negativeAttributeData.MaximumValue, "0");
            Assert.AreEqual(negativeAttributeData.MinimumValue, "0");
            Assert.IsNull(negativeAttributeData.DataFormat);
            Assert.AreEqual(negativeAttributeData.DefaultValue[0]["displayText"], "");

            // test toData for values with wrong types in file
            var wrongTypesAttributeData = entityData.HasAttributes[2].ToObject<TypeAttribute>();
            Assert.IsTrue((bool)wrongTypesAttributeData.IsReadOnly);
            Assert.IsTrue((bool)wrongTypesAttributeData.IsNullable);
            Assert.AreEqual(wrongTypesAttributeData.SourceOrdering, 1);
            Assert.IsNull(wrongTypesAttributeData.ValueConstrainedToList);
            Assert.AreEqual(wrongTypesAttributeData.MaximumLength, 0);
            Assert.AreEqual(wrongTypesAttributeData.MaximumValue, "20");
            Assert.AreEqual(wrongTypesAttributeData.MinimumValue, "0");

            // test toData with wrong types that cannot be properly converted
            var invalidValuesAttributeData = entityData.HasAttributes[3].ToObject<TypeAttribute>();
            Assert.IsNull(invalidValuesAttributeData.IsReadOnly);
            Assert.IsNull(invalidValuesAttributeData.MaximumLength);

            // test toData with empty default value list that should be written as null
            var emptyDefaultValueAttributeData = entityData.HasAttributes[4].ToObject<TypeAttribute>();
            Assert.IsNull(emptyDefaultValueAttributeData.DefaultValue);
        }

        /// <summary>
        /// Testing that "is.localized.describedAs" trait with a table of three entries (en, rs and cn) is fully preserved when running CdmFolder TypeAttributePersistence ToData.
        /// </summary>
        [TestMethod]
        public void TestCdmFolderToDataTypeAttribute()
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

            TypeAttribute result = PersistenceLayer.ToData<CdmTypeAttributeDefinition, TypeAttribute>(cdmTypeAttributeDefinition, null, null, PersistenceLayer.CdmFolder);
            Assert.IsNotNull(result.AppliedTraits);

            var argument = result.AppliedTraits[0].ToObject<TraitReferenceDefinition>().Arguments[0].ToObject<Argument>();
            List<List<string>> constantValues = argument.Value.ToObject<EntityReferenceDefinition>().EntityReference.ToObject<ConstantEntity>().ConstantValues;
            
            Assert.AreEqual("en", constantValues[0][0]);
            Assert.AreEqual("Some description in English language", constantValues[0][1]);
            Assert.AreEqual("sr", constantValues[1][0]);
            Assert.AreEqual("Opis na srpskom jeziku", constantValues[1][1]);
            Assert.AreEqual("cn", constantValues[2][0]);
            Assert.AreEqual("一些中文描述", constantValues[2][1]);
        }

        /// <summary>
        /// Testing that DataFormat to trait mappings are correct and that correct traits are added to the type attribute.
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestDataFormatToTraitMappings()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestDataFormatToTraitMappings", null);
            var entity = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/Entity.cdm.json/Entity");

            // Check that the traits we expect for each DataFormat are found in the type attribute's applied traits.

            // DataFormat = Int16
            var attributeA = entity.Attributes[0] as CdmTypeAttributeDefinition;
            HashSet<string> aTraitNamedReferences = FetchTraitNamedReferences(attributeA.AppliedTraits);
            Assert.IsTrue(aTraitNamedReferences.Contains("is.dataFormat.integer"));
            Assert.IsTrue(aTraitNamedReferences.Contains("is.dataFormat.small"));

            // DataFormat = Int32
            var attributeB = entity.Attributes[1] as CdmTypeAttributeDefinition;
            HashSet<string> bTraitNamedReferences = FetchTraitNamedReferences(attributeB.AppliedTraits);
            Assert.IsTrue(bTraitNamedReferences.Contains("is.dataFormat.integer"));

            // DataFormat = Int64
            var attributeC = entity.Attributes[2] as CdmTypeAttributeDefinition;
            HashSet<string> cTraitNamedReferences = FetchTraitNamedReferences(attributeC.AppliedTraits);
            Assert.IsTrue(cTraitNamedReferences.Contains("is.dataFormat.integer"));
            Assert.IsTrue(cTraitNamedReferences.Contains("is.dataFormat.big"));

            // DataFormat = Float
            var attributeD = entity.Attributes[3] as CdmTypeAttributeDefinition;
            HashSet<string> dTraitNamedReferences = FetchTraitNamedReferences(attributeD.AppliedTraits);
            Assert.IsTrue(dTraitNamedReferences.Contains("is.dataFormat.floatingPoint"));

            // DataFormat = Double
            var attributeE = entity.Attributes[4] as CdmTypeAttributeDefinition;
            HashSet<string> eTraitNamedReferences = FetchTraitNamedReferences(attributeE.AppliedTraits);
            Assert.IsTrue(eTraitNamedReferences.Contains("is.dataFormat.floatingPoint"));
            Assert.IsTrue(eTraitNamedReferences.Contains("is.dataFormat.big"));

            // DataFormat = Guid
            var attributeF = entity.Attributes[5] as CdmTypeAttributeDefinition;
            HashSet<string> fTraitNamedReferences = FetchTraitNamedReferences(attributeF.AppliedTraits);
            Assert.IsTrue(fTraitNamedReferences.Contains("is.dataFormat.guid"));
            Assert.IsTrue(fTraitNamedReferences.Contains("is.dataFormat.character"));
            Assert.IsTrue(fTraitNamedReferences.Contains("is.dataFormat.array"));

            // DataFormat = String
            var attributeG = entity.Attributes[6] as CdmTypeAttributeDefinition;
            HashSet<string> gTraitNamedReferences = FetchTraitNamedReferences(attributeG.AppliedTraits);
            Assert.IsTrue(gTraitNamedReferences.Contains("is.dataFormat.character"));
            Assert.IsTrue(gTraitNamedReferences.Contains("is.dataFormat.array"));

            // DataFormat = Char
            var attributeH = entity.Attributes[7] as CdmTypeAttributeDefinition;
            HashSet<string> hTraitNamedReferences = FetchTraitNamedReferences(attributeH.AppliedTraits);
            Assert.IsTrue(hTraitNamedReferences.Contains("is.dataFormat.character"));
            Assert.IsTrue(hTraitNamedReferences.Contains("is.dataFormat.big"));

            // DataFormat = Byte
            var attributeI = entity.Attributes[8] as CdmTypeAttributeDefinition;
            HashSet<string> iTraitNamedReferences = FetchTraitNamedReferences(attributeI.AppliedTraits);
            Assert.IsTrue(iTraitNamedReferences.Contains("is.dataFormat.byte"));

            // DataFormat = Binary
            var attributeJ = entity.Attributes[9] as CdmTypeAttributeDefinition;
            HashSet<string> jTraitNamedReferences = FetchTraitNamedReferences(attributeJ.AppliedTraits);
            Assert.IsTrue(jTraitNamedReferences.Contains("is.dataFormat.byte"));
            Assert.IsTrue(jTraitNamedReferences.Contains("is.dataFormat.array"));

            // DataFormat = Time
            var attributeK = entity.Attributes[10] as CdmTypeAttributeDefinition;
            HashSet<string> kTraitNamedReferences = FetchTraitNamedReferences(attributeK.AppliedTraits);
            Assert.IsTrue(kTraitNamedReferences.Contains("is.dataFormat.time"));

            // DataFormat = Date
            var attributeL = entity.Attributes[11] as CdmTypeAttributeDefinition;
            HashSet<string> lTraitNamedReferences = FetchTraitNamedReferences(attributeL.AppliedTraits);
            Assert.IsTrue(lTraitNamedReferences.Contains("is.dataFormat.date"));

            // DataFormat = DateTime
            var attributeM = entity.Attributes[12] as CdmTypeAttributeDefinition;
            HashSet<string> mTraitNamedReferences = FetchTraitNamedReferences(attributeM.AppliedTraits);
            Assert.IsTrue(mTraitNamedReferences.Contains("is.dataFormat.time"));
            Assert.IsTrue(mTraitNamedReferences.Contains("is.dataFormat.date"));

            // DataFormat = DateTimeOffset
            var attributeN = entity.Attributes[13] as CdmTypeAttributeDefinition;
            HashSet<string> nTraitNamedReferences = FetchTraitNamedReferences(attributeN.AppliedTraits);
            Assert.IsTrue(nTraitNamedReferences.Contains("is.dataFormat.time"));
            Assert.IsTrue(nTraitNamedReferences.Contains("is.dataFormat.date"));
            Assert.IsTrue(nTraitNamedReferences.Contains("is.dataFormat.timeOffset"));

            // DataFormat = Boolean
            var attributeO = entity.Attributes[14] as CdmTypeAttributeDefinition;
            HashSet<string> oTraitNamedReferences = FetchTraitNamedReferences(attributeO.AppliedTraits);
            Assert.IsTrue(oTraitNamedReferences.Contains("is.dataFormat.boolean"));

            // DataFormat = Decimal
            var attributeP = entity.Attributes[15] as CdmTypeAttributeDefinition;
            HashSet<string> pTraitNamedReferences = FetchTraitNamedReferences(attributeP.AppliedTraits);
            Assert.IsTrue(pTraitNamedReferences.Contains("is.dataFormat.numeric.shaped"));

            // DataFormat = Json
            var attributeQ = entity.Attributes[16] as CdmTypeAttributeDefinition;
            HashSet<string> qTraitNamedReferences = FetchTraitNamedReferences(attributeQ.AppliedTraits);
            Assert.IsTrue(qTraitNamedReferences.Contains("is.dataFormat.array"));
            Assert.IsTrue(qTraitNamedReferences.Contains("means.content.text.JSON"));
        }

        private static HashSet<string> FetchTraitNamedReferences(CdmTraitCollection traits)
        {
            HashSet<string> namedReferences = new HashSet<string>();

            traits.AllItems.ForEach(trait => namedReferences.Add(trait.NamedReference));

            return namedReferences;
        }
    }
}
