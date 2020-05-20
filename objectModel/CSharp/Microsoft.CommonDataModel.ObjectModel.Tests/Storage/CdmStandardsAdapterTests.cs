// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Storage
{
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Threading.Tasks;
    using Assert = VisualStudio.TestTools.UnitTesting.Assert;

    /// <summary>
    /// Tests if the CdmStandardsAdapter functions correctly.
    /// </summary>
    [TestClass]
    public class CdmStandardsAdapterTests
    {
        const string ENDPOINT = "https://cdm-schema.microsoft.com/logical";
        const string TEST_FILE_PATH = "/foundations.cdm.json";

        /// <summary>
        /// Tests if the adapter path is created correctly.
        /// </summary>
        [TestMethod]
        public void TestCreateAdapterPath()
        {
            var adapter = new CdmStandardsAdapter();
            var corpusPath = TEST_FILE_PATH;
            var adapterPath = adapter.CreateAdapterPath(corpusPath);
            Assert.AreEqual($"{ENDPOINT}{corpusPath}", adapterPath);
        }

        /// <summary>
        /// Tests if the corpus path is created correctly.
        /// </summary>
        [TestMethod]
        public void TestCreateCorpusPath()
        {
            var adapter = new CdmStandardsAdapter();
            var adapterPath = $"{ENDPOINT}{TEST_FILE_PATH}";
            var corpusPath = adapter.CreateCorpusPath(adapterPath);
            Assert.AreEqual(TEST_FILE_PATH, corpusPath);
        }

        /// <summary>
        /// Tests if the adapter is able to read correctly.
        /// </summary>
        [TestMethod]
        public async Task TestReadAsync()
        {
            var adapter = new CdmStandardsAdapter();
            var foundations = await adapter.ReadAsync(TEST_FILE_PATH);
            Assert.IsNotNull(foundations);
        }
    }
}
