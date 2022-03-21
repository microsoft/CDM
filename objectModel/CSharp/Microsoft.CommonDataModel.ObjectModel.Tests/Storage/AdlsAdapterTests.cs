// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Storage
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Network;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json.Linq;

    using Assert = AssertExtension;

    [TestClass]
    public class AdlsAdapterTests
    {
        private class FakeTokenProvider : TokenProvider
        {
            public string GetToken()
            {
                return "TOKEN";
            }
        }
        
        private readonly string testSubpath = "Storage";

        private static async Task RunWriteReadTest(ADLSAdapter adapter)
        {
            string filename = $"WriteReadTest/{Environment.GetEnvironmentVariable("USERNAME")}_{Environment.GetEnvironmentVariable("COMPUTERNAME")}_CSharp.txt";
            string writeContents = $"{DateTimeOffset.Now}\n{filename}";
            await adapter.WriteAsync(filename, writeContents);
            string readContents = await adapter.ReadAsync(filename);
            Assert.IsTrue(string.Equals(writeContents, readContents));
        }
        
        private static async Task RunCheckFileTimeTest(ADLSAdapter adapter)
        {
            DateTimeOffset? offset1 = await adapter.ComputeLastModifiedTimeAsync("/FileTimeTest/CheckFileTime.txt");
            DateTimeOffset? offset2 = await adapter.ComputeLastModifiedTimeAsync("FileTimeTest/CheckFileTime.txt");

            Assert.IsTrue(offset1.HasValue);
            Assert.IsTrue(offset2.HasValue);
            Assert.IsTrue(offset1.Value == offset2.Value);
            Assert.IsTrue(offset1.Value < DateTimeOffset.Now);
        }

        private static async Task RunFileEnumTest(ADLSAdapter adapter)
        {
            using (adapter.CreateFileQueryCacheContext())
            {
                List<string> files1 = await adapter.FetchAllFilesAsync("/FileEnumTest/");
                List<string> files2 = await adapter.FetchAllFilesAsync("/FileEnumTest");
                List<string> files3 = await adapter.FetchAllFilesAsync("FileEnumTest/");
                List<string> files4 = await adapter.FetchAllFilesAsync("FileEnumTest");

                // expect 100 files to be enumerated
                Assert.IsTrue(files1.Count == 100 && files2.Count == 100 && files3.Count == 100 && files4.Count == 100);

                // these calls should be fast due to cache                
                var watch = Stopwatch.StartNew();
                for (int i = 0; i < files1.Count; i++)
                {
                    Assert.IsTrue(files1[i] == files2[i] && files1[i] == files3[i] && files1[i] == files4[i]);
                    await adapter.ComputeLastModifiedTimeAsync(files1[i]);
                }
                watch.Stop();

                Assert.Performance(10, watch.ElapsedMilliseconds, "Cached file modified times");
            }
        }

        private static async Task RunSpecialCharactersTest(ADLSAdapter adapter)
        {
            var corpus = new CdmCorpusDefinition();
            corpus.Storage.Mount("adls", adapter);
            corpus.Storage.DefaultNamespace = "adls";
            try
            {
                var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("default.manifest.cdm.json");
                await manifest.FileStatusCheckAsync();

                Assert.AreEqual(1, manifest.Entities.Count);
                Assert.AreEqual(2, manifest.Entities[0].DataPartitions.Count);
                Assert.AreEqual(
                    "TestEntity-With=Special Characters/year=2020/TestEntity-partition-With=Special Characters-0.csv",
                    manifest.Entities[0].DataPartitions[0].Location);

                Assert.AreEqual(
                    "TestEntity-With=Special Characters/year=2020/TestEntity-partition-With=Special Characters-1.csv",
                    manifest.Entities[0].DataPartitions[1].Location);
            }
            catch (Exception e)
            {
                Assert.Fail(e.Message);
            }
        }

        [TestMethod]
        public async Task ADLSWriteReadSharedKey()
        {
            AdlsTestHelper.CheckADLSEnvironment();
            await RunWriteReadTest(AdlsTestHelper.CreateAdapterWithSharedKey());
        }

        [TestMethod]
        public async Task ADLSWriteReadClientId()
        {
            AdlsTestHelper.CheckADLSEnvironment();
            await RunWriteReadTest(AdlsTestHelper.CreateAdapterWithClientId());
        }

        [TestMethod]
        public async Task ADLSWriteReadClientIdWithEndpoint()
        {
            AdlsTestHelper.CheckADLSEnvironment();
            await RunWriteReadTest(AdlsTestHelper.CreateAdapterWithClientId(specifyEndpoint: true));
        }

        [TestMethod]
        public async Task ADLSWriteReadWithBlobHostName()
        {
            AdlsTestHelper.CheckADLSEnvironment();
            await RunWriteReadTest(AdlsTestHelper.CreateAdapterWithSharedKey(testBlobHostName: true));
            await RunWriteReadTest(AdlsTestHelper.CreateAdapterWithClientId(testBlobHostName: true));
        }

        [TestMethod]
        public async Task ADLSCheckFileTimeSharedKey()
        {
            AdlsTestHelper.CheckADLSEnvironment();
            await RunCheckFileTimeTest(AdlsTestHelper.CreateAdapterWithSharedKey());
        }

        [TestMethod]
        public async Task ADLSCheckFileTimeClientId()
        {
            AdlsTestHelper.CheckADLSEnvironment();
            await RunCheckFileTimeTest(AdlsTestHelper.CreateAdapterWithClientId());
        }

        [TestMethod]
        public async Task ADLSFileEnumSharedKey()
        {
            AdlsTestHelper.CheckADLSEnvironment();
            await RunFileEnumTest(AdlsTestHelper.CreateAdapterWithSharedKey());
        }

        [TestMethod]
        public async Task ADLSFileEnumClientId()
        {
            AdlsTestHelper.CheckADLSEnvironment();
            await RunFileEnumTest(AdlsTestHelper.CreateAdapterWithClientId());
        }

        [TestMethod]
        public async Task ADLSSpecialCharactersTest()
        {
            AdlsTestHelper.CheckADLSEnvironment();
            await RunSpecialCharactersTest(AdlsTestHelper.CreateAdapterWithClientId("PathWithSpecialCharactersAndUnescapedStringTest/Root-With=Special Characters:"));
        }


        /// <summary>
        /// Tests if the adapter won't retry if a HttpStatusCode response with a code in AvoidRetryCodes is received.
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestAvoidRetryCodes()
        {
            AdlsTestHelper.CheckADLSEnvironment();
            var adlsAdapter = AdlsTestHelper.CreateAdapterWithSharedKey();
            adlsAdapter.NumberOfRetries = 3;

            var corpus = new CdmCorpusDefinition();
            corpus.Storage.Mount("adls", adlsAdapter);
            var count = 0;
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (status, message) =>
                {
                    if (message.Contains("Response for request "))
                    {
                        count++;
                    }
                }
            }, CdmStatusLevel.Progress);

            await corpus.FetchObjectAsync<CdmDocumentDefinition>("adls:/inexistentFile.cdm.json");

            Assert.AreEqual(1, count);
        }

        /// <summary>
        /// Tests if the adapter handles requests correctly when the adls hostname contains https
        /// </summary>
        [TestMethod]
        public async Task TestHttpsHostname()
        {
            AdlsTestHelper.CheckADLSEnvironment();
            string filename = $"HTTPSWriteTest/{Environment.GetEnvironmentVariable("USERNAME")}_{Environment.GetEnvironmentVariable("COMPUTERNAME")}_CSharp.txt";
            var adlsAdapter = AdlsTestHelper.CreateAdapterWithSharedKey(null, false, true);
            try
            {
                await adlsAdapter.ReadAsync(filename);
                await adlsAdapter.ComputeLastModifiedTimeAsync(filename);
            }
            catch (UriFormatException ex)
            {
                Assert.Fail();
            }
            catch (Exception)
            {
            }
        }

        /// <summary>
        /// Checks if the endpoint of the adls adapter is set to default if not present in the config parameters.
        /// This is necessary to support old config files that do not include an "endpoint".
        /// </summary>
        [TestMethod]
        public void TestEndpointMissingOnConfig()
        {
            var config = new JObject
                {
                    { "hostname", "hostname.dfs.core.windows.net" },
                    { "root", "root" },
                    { "tenant", "tenant" },
                    { "clientId", "clientId" }
                };
            var adlsAdapter = new ADLSAdapter();
            adlsAdapter.UpdateConfig(config.ToString());
            Assert.AreEqual(AzureCloudEndpoint.AzurePublic, adlsAdapter.Endpoint);
        }

        /// <summary>
        /// Test if formattedHostname is properly set when loading from config.
        /// </summary>
        [TestMethod]
        public void TestFormattedHostname()
        {
            var config = new JObject
                {
                    { "hostname", "hostname.dfs.core.windows.net" },
                    { "root", "root" },
                    { "tenant", "tenant" },
                    { "clientId", "clientId" }
                };
            var adlsAdapter = new ADLSAdapter();
            adlsAdapter.UpdateConfig(config.ToString());

            var corpusPath = adlsAdapter.CreateCorpusPath("https://hostname.dfs.core.windows.net/root/partitions/data.csv");
            Assert.AreEqual("/partitions/data.csv", corpusPath);
        }

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
            Assert.AreEqual("https://storageaccount.dfs.core.windows.net/fs/a/path%3Awith%3Acolons/some-file.json", adlsAdapter.CreateAdapterPath(corpusPathWithColons));
            Assert.AreEqual("/a/path:with:colons/some-file.json", adlsAdapter.CreateCorpusPath("https://storageaccount.dfs.core.windows.net/fs/a/path%3Awith%3Acolons/some-file.json"));
            Assert.AreEqual("/a/path:with:colons/some-file.json", adlsAdapter.CreateCorpusPath("https://storageaccount.dfs.core.windows.net/fs/a/path%3awith%3acolons/some-file.json"));

            // Check other special characters
            Assert.AreEqual("https://storageaccount.dfs.core.windows.net/fs/a/path%20with%3Dspecial%3Dcharacters/some-file.json", adlsAdapter.CreateAdapterPath("namespace:/a/path with=special=characters/some-file.json"));
            Assert.AreEqual("/a/path with=special=characters/some-file.json", adlsAdapter.CreateCorpusPath("https://storageaccount.dfs.core.windows.net/fs/a/path%20with%3dspecial%3dcharacters/some-file.json"));
            Assert.AreEqual("/a/path with=special=characters/some-file.json", adlsAdapter.CreateCorpusPath("https://storageaccount.dfs.core.windows.net/fs/a/path%20with%3dspecial%3Dcharacters/some-file.json"));

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
        /// Initialize Hostname and Root.
        /// </summary>
        [TestMethod]
        public void TestInitializeHostnameAndRoot()
        {
            var host1 = "storageaccount.dfs.core.windows.net";
            var adlsAdapter1 = new ADLSAdapter(host1, "root-without-slash", string.Empty);
            Assert.AreEqual("storageaccount.dfs.core.windows.net", adlsAdapter1.Hostname);
            Assert.AreEqual("/root-without-slash", adlsAdapter1.Root);

            var adapterPath1 = "https://storageaccount.dfs.core.windows.net/root-without-slash/a/1.csv";
            var corpusPath1 = adlsAdapter1.CreateCorpusPath(adapterPath1);
            Assert.AreEqual("/a/1.csv", corpusPath1);
            Assert.AreEqual(adapterPath1, adlsAdapter1.CreateAdapterPath(corpusPath1));

            var adlsAdapter1WithFolders = new ADLSAdapter(host1, "root-without-slash/folder1/folder2", string.Empty);
            Assert.AreEqual("/root-without-slash/folder1/folder2", adlsAdapter1WithFolders.Root);
            
            var adapterPath2 = "https://storageaccount.dfs.core.windows.net/root-without-slash/folder1/folder2/a/1.csv";
            var corpusPath2 = adlsAdapter1WithFolders.CreateCorpusPath(adapterPath2);
            Assert.AreEqual("/a/1.csv", corpusPath2);
            Assert.AreEqual(adapterPath2, adlsAdapter1WithFolders.CreateAdapterPath(corpusPath2));

            var adlsAdapter2 = new ADLSAdapter(host1, "/root-starts-with-slash", string.Empty);
            Assert.AreEqual("/root-starts-with-slash", adlsAdapter2.Root);
            var adlsAdapter2WithFolders = new ADLSAdapter(host1, "/root-starts-with-slash/folder1/folder2", string.Empty);
            Assert.AreEqual("/root-starts-with-slash/folder1/folder2", adlsAdapter2WithFolders.Root);

            var adlsAdapter3 = new ADLSAdapter(host1, "root-ends-with-slash/", string.Empty);
            Assert.AreEqual("/root-ends-with-slash", adlsAdapter3.Root);
            var adlsAdapter3WithFolders = new ADLSAdapter(host1, "root-ends-with-slash/folder1/folder2/", string.Empty);
            Assert.AreEqual("/root-ends-with-slash/folder1/folder2", adlsAdapter3WithFolders.Root);

            var adlsAdapter4 = new ADLSAdapter(host1, "/root-with-slashes/", string.Empty);
            Assert.AreEqual("/root-with-slashes", adlsAdapter4.Root);
            var adlsAdapter4WithFolders = new ADLSAdapter(host1, "/root-with-slashes/folder1/folder2/", string.Empty);
            Assert.AreEqual("/root-with-slashes/folder1/folder2", adlsAdapter4WithFolders.Root);

            // Mount from config
            var config = TestHelper.GetInputFileContent(testSubpath, nameof(TestInitializeHostnameAndRoot), "config.json");
            var corpus = new CdmCorpusDefinition();
            corpus.Storage.MountFromConfig(config);
            Assert.AreEqual("/root-without-slash", ((ADLSAdapter)corpus.Storage.FetchAdapter("adlsadapter1")).Root);
            Assert.AreEqual("/root-without-slash/folder1/folder2", ((ADLSAdapter)corpus.Storage.FetchAdapter("adlsadapter2")).Root);
            Assert.AreEqual("/root-starts-with-slash/folder1/folder2", ((ADLSAdapter)corpus.Storage.FetchAdapter("adlsadapter3")).Root);
            Assert.AreEqual("/root-ends-with-slash/folder1/folder2", ((ADLSAdapter)corpus.Storage.FetchAdapter("adlsadapter4")).Root);
            Assert.AreEqual("/root-with-slashes/folder1/folder2", ((ADLSAdapter)corpus.Storage.FetchAdapter("adlsadapter5")).Root);
        }

        /// <summary>
        /// Test hostname with leading protocol.
        /// </summary>
        [TestMethod]
        public void TestHostnameWithLeadingProtocol()
        {
            var host1 = "https://storageaccount.dfs.core.windows.net";
            var adlsAdapter1 = new ADLSAdapter(host1, "root-without-slash", string.Empty);
            var adapterPath = "https://storageaccount.dfs.core.windows.net/root-without-slash/a/1.csv";
            var corpusPath1 = adlsAdapter1.CreateCorpusPath(adapterPath);
            Assert.AreEqual("https://storageaccount.dfs.core.windows.net", adlsAdapter1.Hostname);
            Assert.AreEqual("/a/1.csv", corpusPath1);
            Assert.AreEqual(adapterPath, adlsAdapter1.CreateAdapterPath(corpusPath1));

            var host2 = "HttPs://storageaccount.dfs.core.windows.net";
            var adlsAdapter2 = new ADLSAdapter(host2, "root-without-slash", string.Empty);
            var corpusPath2 = adlsAdapter2.CreateCorpusPath(adapterPath);
            Assert.AreEqual("HttPs://storageaccount.dfs.core.windows.net", adlsAdapter2.Hostname);
            Assert.AreEqual("/a/1.csv", corpusPath2);
            Assert.AreEqual(adapterPath, adlsAdapter2.CreateAdapterPath(corpusPath2));

            try
            {
                var host3 = "http://storageaccount.dfs.core.windows.net";
                var adlsAdapter3 = new ADLSAdapter(host3, "root-without-slash", string.Empty);
                Assert.Fail("Expected Exception for using a http:// hostname.");
            }
            catch (Exception ex)
            {
                Assert.IsTrue(ex is ArgumentException);
            }

            try
            {
                var host4 = "https://bar:baz::]/foo/";
                var adlsAdapter4 = new ADLSAdapter(host4, "root-without-slash", string.Empty);
                Assert.Fail("Expected Exception for using and invalid hostname.");
            }
            catch (Exception ex)
            {
                Assert.IsTrue(ex is ArgumentException);
            }
        }

        /// <summary>
        /// Test azure cloud endpoint in config.
        /// </summary>
        [TestMethod]
        public void TestLoadingAndSavingEndpointInConfig()
        {
            // Mount from config
            var config = TestHelper.GetInputFileContent(testSubpath, nameof(TestLoadingAndSavingEndpointInConfig), "config.json");
            var corpus = new CdmCorpusDefinition();
            corpus.Storage.MountFromConfig(config);
            Assert.Null(((ADLSAdapter)corpus.Storage.FetchAdapter("adlsadapter1")).Endpoint);
            Assert.AreEqual(AzureCloudEndpoint.AzurePublic, ((ADLSAdapter)corpus.Storage.FetchAdapter("adlsadapter2")).Endpoint);
            Assert.AreEqual(AzureCloudEndpoint.AzureChina, ((ADLSAdapter)corpus.Storage.FetchAdapter("adlsadapter3")).Endpoint);
            Assert.AreEqual(AzureCloudEndpoint.AzureGermany, ((ADLSAdapter)corpus.Storage.FetchAdapter("adlsadapter4")).Endpoint);
            Assert.AreEqual(AzureCloudEndpoint.AzureUsGovernment, ((ADLSAdapter)corpus.Storage.FetchAdapter("adlsadapter5")).Endpoint);
            try
            {
                var configSnakeCase = TestHelper.GetInputFileContent(testSubpath, nameof(TestLoadingAndSavingEndpointInConfig), "config-SnakeCase.json");
                var corpusSnakeCase = new CdmCorpusDefinition();
                corpusSnakeCase.Storage.MountFromConfig(configSnakeCase);
                Assert.Fail("Expected RuntimeException for config.json using endpoint value in snake case.");
            } 
            catch (Exception ex)
            {
                String message = "Endpoint value should be a string of an enumeration value from the class AzureCloudEndpoint in Pascal case.";
                Assert.AreEqual(message, ex.Message);
            }
        }

        /// <summary>
        /// The secret property is not saved to the config.json file for security reasons.
        /// When constructing and ADLS adapter from config, the user should be able to set the authentication details after the adapter is constructed.
        /// </summary>
        [TestMethod]
        public void TestConfigAndUpdateConfigWithoutAuthenticationDetails()
        {
            var config = new JObject
                {
                    { "root", "root" },
                    { "hostname", "hostname" },
                    { "tenant", "tenant" },
                    { "clientId", "clientId" }
                };

            try
            {
                var adlsAdapter1 = new ADLSAdapter();
                adlsAdapter1.UpdateConfig(config.ToString());
                adlsAdapter1.ClientId = "clientId";
                adlsAdapter1.Secret = "secret";
                adlsAdapter1.SharedKey = "sharedKey";
                adlsAdapter1.TokenProvider = new FakeTokenProvider();
            }
            catch
            {
                Assert.Fail("AdlsAdapter initialized without secret shouldn't throw exception when updating config.");
            }

            try
            {
                var adlsAdapter2 = new ADLSAdapter();
                adlsAdapter2.ClientId = "clientId";
                adlsAdapter2.Secret = "secret";
                adlsAdapter2.SharedKey = "sharedKey";
                adlsAdapter2.TokenProvider = new FakeTokenProvider();
                adlsAdapter2.UpdateConfig(config.ToString());
            }
            catch
            {
                Assert.Fail("AdlsAdapter initialized without secret shouldn't throw exception when updating config.");
            }
        }
    }
}
