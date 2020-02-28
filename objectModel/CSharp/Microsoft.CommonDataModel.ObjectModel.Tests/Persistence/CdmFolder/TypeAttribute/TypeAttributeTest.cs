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
            var testInputPath = TestHelper.GetInputFolderPath(testsSubpath, "TestReadingIsPrimaryKey");
            CdmCorpusDefinition corpus = new CdmCorpusDefinition();
            corpus.SetEventCallback(new EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);
            corpus.Storage.Mount("local", new LocalAdapter(testInputPath));
            corpus.Storage.DefaultNamespace = "local";

            // Read from an unresolved entity schema.
            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/TeamMembership.cdm.json/TeamMembership");
            CdmAttributeGroupReference attributeGroupRef = (CdmAttributeGroupReference)entity.Attributes[0];
            CdmAttributeGroupDefinition attributeGroup = (CdmAttributeGroupDefinition)attributeGroupRef.ExplicitReference;
            CdmTypeAttributeDefinition typeAttribute = (CdmTypeAttributeDefinition)attributeGroup.Members[0];

            Assert.IsTrue((bool)typeAttribute.IsPrimaryKey);

            // Check that the trait "is.identifiedBy" is created with the correct argument.
            CdmTraitReference isIdentifiedBy1 = typeAttribute.AppliedTraits[1];
            Assert.AreEqual("is.identifiedBy", isIdentifiedBy1.NamedReference);
            Assert.AreEqual("TeamMembership/(resolvedAttributes)/teamMembershipId", isIdentifiedBy1.Arguments[0].Value);

            // Read from a resolved entity schema.
            CdmEntityDefinition resolvedEntity = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/TeamMembership_Resolved.cdm.json/TeamMembership");
            CdmTypeAttributeDefinition resolvedTypeAttribute = (CdmTypeAttributeDefinition)resolvedEntity.Attributes[0];

            Assert.IsTrue((bool)resolvedTypeAttribute.IsPrimaryKey);

            // Check that the trait "is.identifiedBy" is created with the correct argument.
            CdmTraitReference isIdentifiedBy2 = resolvedTypeAttribute.AppliedTraits[6];
            Assert.AreEqual("is.identifiedBy", isIdentifiedBy2.NamedReference);

            CdmAttributeReference argumentValue = isIdentifiedBy2.Arguments[0].Value;
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
    }
}
