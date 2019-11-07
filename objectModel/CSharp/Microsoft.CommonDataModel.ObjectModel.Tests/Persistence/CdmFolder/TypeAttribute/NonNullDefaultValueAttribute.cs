namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence.CdmFolder
{
    using System.IO;

    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    using Newtonsoft.Json.Linq;

    [TestClass]
    public class NonNullDefaultValueAttribute
    {
        /// <summary>
        /// Testing that deafualt value can be converted to A JToken
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

            CdmTypeAttributeDefinition cdmTypeAttributeDefinition = ObjectModel.Persistence.PersistenceLayer.FromData<CdmTypeAttributeDefinition, JToken>(new ResolveContext(new CdmCorpusDefinition(), null), input, "CdmFolder");

            TypeAttribute result = ObjectModel.Persistence.PersistenceLayer.ToData<CdmTypeAttributeDefinition, TypeAttribute>(cdmTypeAttributeDefinition, null, null, "CdmFolder");
            
            Assert.IsNotNull(result);
            Assert.IsTrue(JToken.DeepEquals(input["defaultValue"], result.DefaultValue));
        }
    }
}
