// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Storage
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Network;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json.Linq;

    using Assert = AssertExtension;

    [TestClass]
    public class SymsAdapterTests
    {
        private static string ApiVersion = "api-version=2021-04-01";
        private static string DatabasesManifest = "databases.manifest.cdm.json";

        private class FakeTokenProvider : TokenProvider
        {
            public string GetToken()
            {
                return "TOKEN";
            }
        }

        private readonly static string testSubpath = "Storage";
        private readonly static string testName = "TestSymsAdapter";
        private readonly static string databaseName = "SymsTestDatabase";

        private static async Task TestCreateDatabase(SymsAdapter adapter, string request, string expectedResponse)
        {
            await adapter.WriteAsync($"{databaseName}/{databaseName}.manifest.cdm.json", request);
            string actualResponse = await adapter.ReadAsync($"{databaseName}/{databaseName}.manifest.cdm.json");
            Assert.IsTrue(SymsTestHelper.JsonObjectShouldBeEqualAsExpected(expectedResponse, actualResponse));
        }

        private static async Task TestCreateorUpdateTable(SymsAdapter adapter, string tableName, string request, string expectedResponse)
        {
            // Create Table Test case
            await adapter.WriteAsync($"{databaseName}/{tableName}.cdm.json", request);
            string actualResponse = await adapter.ReadAsync($"{databaseName}/{tableName}.cdm.json");
            Assert.IsTrue(SymsTestHelper.JsonObjectShouldBeEqualAsExpected(expectedResponse, actualResponse));
        }

        private static async Task TestRemoveTable(SymsAdapter adapter, string tableName)
        {
            await adapter.WriteAsync($"{databaseName}/{tableName}.cdm.json", null);
            try
            {
                await adapter.ReadAsync($"{databaseName}/{tableName}.cdm.json");
                Assert.Fail();
            }
            catch (Exception e)
            {
                if (!e.Message.Contains("Not Found"))
                {
                    throw;
                }
            }
        }

        private static async Task TestCreateorUpdateRelationshipTable(SymsAdapter adapter, string relationshipName, string request, string expectedResponse)
        {
            await adapter.WriteAsync($"{databaseName}/{databaseName}.manifest.cdm.json/relationships/{relationshipName}", request);
            string actualResponse = await adapter.ReadAsync($"{databaseName}/{databaseName}.manifest.cdm.json/relationships/{relationshipName}");
            Assert.IsTrue(SymsTestHelper.JsonObjectShouldBeEqualAsExpected(expectedResponse, actualResponse));
        }

        private static async Task TestRemoveRelationship(SymsAdapter adapter, string relationshipName)
        {
            await adapter.WriteAsync($"{databaseName}/{databaseName}.manifest.cdm.json/relationships/{relationshipName}", null);
            try
            {
                await adapter.ReadAsync($"{databaseName}/{databaseName}.manifest.cdm.json/relationships/{relationshipName}");
                Assert.Fail();
            }
            catch (Exception e)
            {
                if (!e.Message.Contains("Not Found"))
                {
                    throw;
                }
            }
        }

        private static async Task RunWriteReadTest(SymsAdapter adapter)
        {
            await SymsTestHelper.CleanDatabase(adapter, SymsTestHelper.DatabaseName);

            string createDatabaseRequest = TestHelper.GetInputFileContent(testSubpath, testName, "createDatabase.json");
            string getDatabaseExpectedResponse = TestHelper.GetExpectedOutputFileContent(testSubpath, testName, "expectedDatabaseResponse.json");
            await TestCreateDatabase(adapter, createDatabaseRequest, getDatabaseExpectedResponse);

            string tableName = "symsTestTable";
            string createTableRequest = TestHelper.GetInputFileContent(testSubpath, testName, "createTableRequest.json");
            string getTableExpectedResponse = TestHelper.GetExpectedOutputFileContent(testSubpath, testName, "expectedTableResponse.json");
            await TestCreateorUpdateTable(adapter, tableName, createTableRequest, getTableExpectedResponse);

            string updatedTableRequest = TestHelper.GetInputFileContent(testSubpath, testName, "updatedTableRequest.json");
            string updatedTableExpectedResponse = TestHelper.GetExpectedOutputFileContent(testSubpath, testName, "expectedUpdatedTableResponse.json");
            await TestCreateorUpdateTable(adapter, tableName, updatedTableRequest, updatedTableExpectedResponse);

            await TestRemoveTable(adapter, tableName);

            string relationshipTableName = "E1_E2_relationship";
            string createRelationshipTableRequest = TestHelper.GetInputFileContent(testSubpath, testName, "createRelationship.json");
            string getRelationshipTableExpectedResponse = TestHelper.GetExpectedOutputFileContent(testSubpath, testName, "expectedRelationshipResponse.json");
            await TestCreateorUpdateRelationshipTable(adapter, relationshipTableName, createRelationshipTableRequest, getRelationshipTableExpectedResponse);

            string updatedRelationshipTableRequest = TestHelper.GetInputFileContent(testSubpath, testName, "updateRelationship.json");
            string updatedRelationshipTableExpectedResponse = TestHelper.GetExpectedOutputFileContent(testSubpath, testName, "expectedUpdatedRelationshipResponse.json");
            await TestCreateorUpdateRelationshipTable(adapter, relationshipTableName, updatedRelationshipTableRequest, updatedRelationshipTableExpectedResponse);

            await TestRemoveRelationship(adapter, relationshipTableName);

            await SymsTestHelper.CleanDatabase(adapter, databaseName);
        }

        private static void RunSymsCreateAdapterPathTest(SymsAdapter adapter)
        {
            string databaseName = "testDB";

            string corpusPathDatabases1 = "/";
            string corpusPathDatabases2 = DatabasesManifest;
            string corpusPathDatabases3 = $"/{DatabasesManifest}";
            string adapterPathDatabases = $"https://{adapter.Endpoint}/databases?{ApiVersion}";
            Assert.IsTrue(string.Equals(adapterPathDatabases, adapter.CreateAdapterPath(corpusPathDatabases1)));
            Assert.IsTrue(string.Equals(adapterPathDatabases, adapter.CreateAdapterPath(corpusPathDatabases2)));
            Assert.IsTrue(string.Equals(adapterPathDatabases, adapter.CreateAdapterPath(corpusPathDatabases3)));

            string entityName = "testEntityName";
            string corpusPathEntity = $"{databaseName}/{entityName}.cdm.json";
            string adapterPathEntity = $"https://{adapter.Endpoint}/databases/{databaseName}/tables/{entityName}?{ApiVersion}";
            Assert.IsTrue(string.Equals(adapterPathEntity, adapter.CreateAdapterPath(corpusPathEntity)));

            string corpusPathEntities = $"{databaseName}/{databaseName}.manifest.cdm.json/entitydefinition";
            string adapterPathEntities = $"https://{adapter.Endpoint}/databases/{databaseName}/tables?{ApiVersion}";
            Assert.IsTrue(string.Equals(adapterPathEntities, adapter.CreateAdapterPath(corpusPathEntities)));

            string relationshipName = "testRelationshipName";
            string corpusPathRelationship = $"{databaseName}/{databaseName}.manifest.cdm.json/relationships/{relationshipName}";
            string adapterPathRelationship = $"https://{adapter.Endpoint}/databases/{databaseName}/relationships/{relationshipName}?{ApiVersion}";
            Assert.IsTrue(string.Equals(adapterPathRelationship, adapter.CreateAdapterPath(corpusPathRelationship)));

            string corpusPathRelationships = $"{databaseName}/{databaseName}.manifest.cdm.json/relationships";
            string adapterPathRelationships = $"https://{adapter.Endpoint}/databases/{databaseName}/relationships?{ApiVersion}";
            Assert.IsTrue(string.Equals(adapterPathRelationships, adapter.CreateAdapterPath(corpusPathRelationships)));
        }

        private static async Task RunFetchAllFilesAsyncTest(SymsAdapter adapter)
        {
            await SymsTestHelper.CleanDatabase(adapter, databaseName);

            string createDatabaseRequest = TestHelper.GetInputFileContent(testSubpath, testName, "createDatabase.json");
            await adapter.WriteAsync($"{databaseName}/{databaseName}.manifest.cdm.json", createDatabaseRequest);

            string tableName1 = "symsTestTable1";
            string createTableRequest1 = TestHelper.GetInputFileContent(testSubpath, testName, "createTable1Request.json");
            await adapter.WriteAsync($"{databaseName}/{tableName1}.cdm.json", createTableRequest1);

            string tableName2 = "symsTestTable2";
            string createTableRequest2 = TestHelper.GetInputFileContent(testSubpath, testName, "createTable2Request.json");
            await adapter.WriteAsync($"{databaseName}/{tableName2}.cdm.json", createTableRequest2);

            IList<string> databases = await adapter.FetchAllFilesAsync("/");
            Assert.IsTrue(string.Equals(DatabasesManifest, databases[0]));

            IList<string> entities = await adapter.FetchAllFilesAsync($"{databaseName}/");
            Assert.IsTrue(entities.Count == 2);
            Assert.IsTrue(string.Equals($"{tableName1}.cdm.json", entities[0]));
            Assert.IsTrue(string.Equals($"{tableName2}.cdm.json", entities[1]));

            await SymsTestHelper.CleanDatabase(adapter, databaseName);
        }

        [TestMethod]
        public async Task TestWriteReadClientId()
        {
            SymsTestHelper.CheckSymsEnvironment();
            await RunWriteReadTest(SymsTestHelper.CreateAdapterWithClientId());
        }

        [TestMethod]
        public void TestCreateAdapterPathClientId()
        {
            SymsTestHelper.CheckSymsEnvironment();
            RunSymsCreateAdapterPathTest(SymsTestHelper.CreateAdapterWithClientId());
        }

        [TestMethod]
        public async Task TestRunFetchAllFilesAsyncTestClientId()
        {
            SymsTestHelper.CheckSymsEnvironment();
            await RunFetchAllFilesAsyncTest(SymsTestHelper.CreateAdapterWithClientId());
        }

        /// <summary>
        /// The secret property is not saved to the config.json file for security reasons.
        /// When constructing and Syms adapter from config, the user should be able to set the authentication details after the adapter is constructed.
        /// </summary>
        [TestMethod]
        public void TestConfigAndUpdateConfigWithoutAuthenticationDetails()
        {
            var config = new JObject
                {
                    { "root", "root" },
                    { "endpoint", "endpoint" },
                    { "tenant", "tenant" },
                    { "clientId", "clientId" }
                };

            try
            {
                var SymsAdapter1 = new SymsAdapter();
                SymsAdapter1.UpdateConfig(config.ToString());
                SymsAdapter1.ClientId = "clientId";
                SymsAdapter1.Secret = "secret";
                SymsAdapter1.TokenProvider = new FakeTokenProvider();
            }
            catch
            {
                Assert.Fail("SymsAdapter initialized without secret shouldn't throw exception when updating config.");
            }

            try
            {
                var SymsAdapter2 = new SymsAdapter();
                SymsAdapter2.ClientId = "clientId";
                SymsAdapter2.Secret = "secret";
                SymsAdapter2.TokenProvider = new FakeTokenProvider();
                SymsAdapter2.UpdateConfig(config.ToString());
            }
            catch
            {
                Assert.Fail("SymsAdapter initialized without secret shouldn't throw exception when updating config.");
            }
        }
    }
}
