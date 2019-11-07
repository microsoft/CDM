using Microsoft.CommonDataModel.ObjectModel.Cdm;
using Microsoft.CommonDataModel.ObjectModel.Enums;
using Microsoft.CommonDataModel.ObjectModel.Utilities;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    [TestClass]
    public class TraitToPropertyMapTests
    {
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
    }
}
