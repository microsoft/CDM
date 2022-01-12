// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.CommonDataModel.ObjectModel.Cdm;
using Microsoft.CommonDataModel.ObjectModel.Enums;
using Microsoft.CommonDataModel.ObjectModel.Utilities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Utilities
{
    [TestClass]
    public class TraitToPropertyMapTests
    {
        private readonly string testsSubpath = Path.Combine("Utilities", "TraitToPropertyMap");

        /// <summary>
        /// Test trait to data format when unknown data format trait is in an attribute.
        /// </summary>
        [TestMethod]
        public void TestTraitToUnknownDataFormat()
        {
            var cdmAttribute = new CdmTypeAttributeDefinition(new ResolveContext(new CdmCorpusDefinition(), null), "SomeAttribute");
            cdmAttribute.AppliedTraits.Add("is.dataFormat.someRandomDataFormat");
            var traitToPropertyMap = new TraitToPropertyMap(cdmAttribute);

            var dataFormat = traitToPropertyMap.TraitsToDataFormat(false);

            Assert.AreEqual(CdmDataFormat.Unknown, dataFormat);
        }

        /// <summary>
        /// Test trait to data format when calculated data format should be JSON.
        /// </summary>
        [TestMethod]
        public void TestTraitToJsonDataFormat()
        {
            var cdmAttribute = new CdmTypeAttributeDefinition(new ResolveContext(new CdmCorpusDefinition(), null), "SomeAttribute");
            cdmAttribute.AppliedTraits.Add("is.dataFormat.array");
            cdmAttribute.AppliedTraits.Add("means.content.text.JSON");
            var traitToPropertyMap = new TraitToPropertyMap(cdmAttribute);

            var dataFormat = traitToPropertyMap.TraitsToDataFormat(false);

            Assert.AreEqual(CdmDataFormat.Json, dataFormat);
        }

        /// <summary>
        /// Test update and fetch list lookup default value without attributeValue and displayOrder.
        /// </summary>
        [TestMethod]
        public void TestUpdateAndFetchListLookup()
        {
            var corpus = new CdmCorpusDefinition();
            var cdmAttribute = new CdmTypeAttributeDefinition(corpus.Ctx, "SomeAttribute");
            var traitToPropertyMap = new TraitToPropertyMap(cdmAttribute);

            var constantValues = new JArray(
                new JObject(
                    new JProperty("languageTag", "en"),
                    new JProperty("displayText", "Fax")));

            traitToPropertyMap.UpdatePropertyValue("defaultValue", constantValues);
            List<dynamic> result = traitToPropertyMap.FetchPropertyValue("defaultValue");

            Assert.AreEqual(1, result.Count);

            var property = result[0] as Dictionary<string, string>;
            Assert.AreEqual("en", property["languageTag"]);
            Assert.AreEqual("Fax", property["displayText"]);
            Assert.IsNull(property["attributeValue"]);
            Assert.IsNull(property["displayOrder"]);
        }

        /// <summary>
        /// Test fetching primary key.
        /// </summary>
        [TestMethod]
        public async Task TestFetchPrimaryKey()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, nameof(TestFetchPrimaryKey));
            var doc = await corpus.FetchObjectAsync<CdmDocumentDefinition>("Account.cdm.json");

            if (doc == null)
            {
                Assert.Fail($"Unable to load acccount.cdm.json. Please inspect error log for additional details.");
            }

            var entity = (CdmEntityDefinition)doc.Definitions[0];
            try
            {
                var pk = entity.PrimaryKey;
            }
            catch (Exception e)
            {
                Assert.Fail($"Exception occur while reading primary key for entity account. {e.Message}");
            }
        }

        /// <summary>
        /// Test setting and getting of data format
        /// </summary>
        [TestMethod]
        public void TestDataFormat()
        {
            var corpus = new CdmCorpusDefinition();
            var att = corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, "att");

            var arr = Enum.GetValues(typeof(CdmDataFormat)).Cast<CdmDataFormat>();
            foreach (var format in arr)
            {
                att.DataFormat = format;
                Assert.AreEqual(att.DataFormat, format);
            }
        }
    }
}
