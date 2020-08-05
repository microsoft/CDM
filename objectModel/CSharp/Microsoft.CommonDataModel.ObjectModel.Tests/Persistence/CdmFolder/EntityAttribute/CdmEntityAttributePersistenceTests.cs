// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json.Linq;

    [TestClass]
    public class CdmEntityAttributePersistenceTests
    {
        /// <summary>
        /// Tests if calling from and to data maintain the properties description and displayName.
        /// </summary>
        [TestMethod]
        public void TestDescriptionAndDisplayName()
        {
            var corpus = new CdmCorpusDefinition();
            var entityName = "TheEntity";
            var description = "entityAttributeDescription";
            var displayName = "whatABeutifulDisplayName";
            var inputData = new JObject() 
            {
                ["name"] = entityName,
                ["displayName"] = displayName,
                ["description"] = description
            };

            var instance = EntityAttributePersistence.FromData(corpus.Ctx, inputData);

            Assert.AreEqual(description, instance.Description);
            Assert.AreEqual(displayName, instance.DisplayName);

            var data = EntityAttributePersistence.ToData(instance, null, null);

            Assert.AreEqual(description, data.Description);
            Assert.AreEqual(displayName, data.DisplayName);

            // Checks if there is no residue of the transformation of the properties into traits.
            Assert.IsNull(data.AppliedTraits);
        }
    }
}
