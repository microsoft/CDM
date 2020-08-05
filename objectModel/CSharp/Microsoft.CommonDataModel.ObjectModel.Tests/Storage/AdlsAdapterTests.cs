// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Storage
{
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json.Linq;

    [TestClass]
    public class AdlsAdapterTests
    {
        /// <summary>
        /// Creates corpus path and adapter path.
        /// </summary>
        [TestMethod]
        public void TestCreateCorpusAndAdapterPathInAdlsAdapter()
        {
            var host1 = "storageaccount.dfs.core.windows.net";
            var root = "/fs";
            var adlsAdapter = new ADLSAdapter(host1, root, string.Empty);

            var adapterPath1 = "https://storageaccount.dfs.core.windows.net/fs/a/1.csv";
            var adapterPath2 = "https://storageaccount.dfs.core.windows.net:443/fs/a/2.csv";
            var adapterPath3 = "https://storageaccount.blob.core.windows.net/fs/a/3.csv";
            var adapterPath4 = "https://storageaccount.blob.core.windows.net:443/fs/a/4.csv";

            var corpusPath1 = adlsAdapter.CreateCorpusPath(adapterPath1);
            var corpusPath2 = adlsAdapter.CreateCorpusPath(adapterPath2);
            var corpusPath3 = adlsAdapter.CreateCorpusPath(adapterPath3);
            var corpusPath4 = adlsAdapter.CreateCorpusPath(adapterPath4);

            Assert.AreEqual("/a/1.csv", corpusPath1);
            Assert.AreEqual("/a/2.csv", corpusPath2);
            Assert.AreEqual("/a/3.csv", corpusPath3);
            Assert.AreEqual("/a/4.csv", corpusPath4);

            Assert.AreEqual(adapterPath1, adlsAdapter.CreateAdapterPath(corpusPath1));
            Assert.AreEqual(adapterPath2, adlsAdapter.CreateAdapterPath(corpusPath2));
            Assert.AreEqual(adapterPath3, adlsAdapter.CreateAdapterPath(corpusPath3));
            Assert.AreEqual(adapterPath4, adlsAdapter.CreateAdapterPath(corpusPath4));

            // Check that an adapter path is correctly created from a corpus path with any namespace
            var corpusPathWithNamespace1 = "adls:/test.json";
            var corpusPathWithNamespace2 = "mylake:/test.json";
            var expectedAdapterPath = "https://storageaccount.dfs.core.windows.net/fs/test.json";

            Assert.AreEqual(expectedAdapterPath, adlsAdapter.CreateAdapterPath(corpusPathWithNamespace1));
            Assert.AreEqual(expectedAdapterPath, adlsAdapter.CreateAdapterPath(corpusPathWithNamespace2));

            // Check that an adapter path is correctly created from a corpus path with colons
            var corpusPathWithColons = "namespace:/a/path:with:colons/some-file.json";
            Assert.AreEqual("https://storageaccount.dfs.core.windows.net/fs/a/path:with:colons/some-file.json", adlsAdapter.CreateAdapterPath(corpusPathWithColons));

            // Check that an adapter path is null if the corpus path provided is null
            Assert.IsNull(adlsAdapter.CreateAdapterPath(null));

            var host2 = "storageaccount.blob.core.windows.net:8888";
            adlsAdapter = new ADLSAdapter(host2, root, string.Empty);

            var adapterPath5 = "https://storageaccount.blob.core.windows.net:8888/fs/a/5.csv";
            var adapterPath6 = "https://storageaccount.dfs.core.windows.net:8888/fs/a/6.csv";
            var adapterPath7 = "https://storageaccount.blob.core.windows.net/fs/a/7.csv";

            Assert.AreEqual("/a/5.csv", adlsAdapter.CreateCorpusPath(adapterPath5));
            Assert.AreEqual("/a/6.csv", adlsAdapter.CreateCorpusPath(adapterPath6));
            Assert.AreEqual(null, adlsAdapter.CreateCorpusPath(adapterPath7));
        }


        /// <summary>
        /// The secret property is not saved to the config.json file for security reasons.
        /// When constructing and ADLS adapter from config, the user should be able to set the authentication details after the adapter is constructed.
        /// </summary>
        [TestMethod]
        public void TestConfigAndUpdateConfigWithoutAuthenticationDetails()
        {
            var adlsAdapter = new ADLSAdapter();

            try
            {
                var config = new JObject
                {
                    { "root", "root" },
                    { "hostname", "hostname" },
                    { "tenant", "tenant" },
                    { "clientId", "clientId" }
                };
                adlsAdapter.UpdateConfig(config.ToString());
                adlsAdapter.Secret = "secret";
                adlsAdapter.SharedKey = "sharedKey";
            }
            catch
            {
                Assert.Fail("AdlsAdapter initialized without secret shouldn't throw exception when updating config.");
            }
        }
    }
}
