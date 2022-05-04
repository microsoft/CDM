// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence.CdmFolder.ArgumentDef
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// Test class for ArgumentPersistence.
    /// </summary>
    [TestClass]
    public class ArgumentTest
    {
        /// <summary>
        /// Test loading an argument with value 0 (number).
        /// </summary>
        [TestMethod]
        public void TestLoadingZeroValue()
        {
            var corpus = new CdmCorpusDefinition();
            var argumentData = new JObject
            {
                { "value", 0 }
            };

            var argument = ArgumentPersistence.FromData(corpus.Ctx, argumentData);
            Assert.AreEqual(0, argument.Value);

            var argumentToData = ArgumentPersistence.ToData(argument, null, null);
            Assert.AreEqual(0, argumentToData);
        }

        /// <summary>
        /// Test loading an argument with blank name & value 0 (number).
        /// </summary>
        [TestMethod]
        public void TestLoadingBlankName()
        {
            var corpus = new CdmCorpusDefinition();

            var argumentData = new JObject()
            {
                ["name"] = " ",
                ["value"] = 0
            };

            var argument = ArgumentPersistence.FromData(corpus.Ctx, argumentData);
            Assert.AreEqual(0, argument.Value);

            var argumentToData = ArgumentPersistence.ToData(argument, null, null);
            Assert.AreEqual(0, argumentToData);
        }
    }
}
