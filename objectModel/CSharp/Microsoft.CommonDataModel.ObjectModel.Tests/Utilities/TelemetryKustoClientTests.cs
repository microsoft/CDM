// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Utilities
{
    using System;
    using System.Threading.Tasks;
    using FluentAssertions;

    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Network;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    /// <summary>
    /// Tests for logging data into Kusto database
    /// </summary>
    [TestClass]
    public class TelemetryKustoClientTests
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private readonly string testsSubpath = "Utilities";

        /// <summary>
        /// Check if the environment variable for telemetry is set
        /// </summary>
        [TestInitialize]
        public void CheckKustoEnvironment()
        {
            if (Environment.GetEnvironmentVariable("KUSTO_RUNTESTS") != "1")
            {
                // this will cause tests to appear as "Skipped" in the final result
                Assert.Inconclusive("Kusto environment not set up");
            }
        }

        /// <summary>
        /// Test for ingesting logs into default CDM Kusto database
        /// </summary>
        /// <remarks>The ingestion result can only be examined in Kusto.</remarks>
        [TestMethod]
        public async Task TestInitializeClientWithDefaultDatabase()
        {
            var corpus = InitializeClientWithDefaultDatabase();
            corpus.TelemetryClient.Enable();

            await CallResolveManifestWithAnEntity(corpus);

            // wait until all the logs are ingested
            while (!(corpus.TelemetryClient as TelemetryKustoClient).CheckRequestQueueIsEmpty())
            {
                System.Threading.Thread.Sleep((corpus.TelemetryClient as TelemetryKustoClient).TimeoutMilliseconds);
            }
        }

        /// <summary>
        /// Test for ingesting logs into user-defined Kusto database
        /// </summary>
        /// <remarks>The ingestion result can only be examined in Kusto.</remarks>
        [TestMethod]
        public async Task TestInitializeClientWithUserDatabase()
        {
            var corpus = InitializeClientWithUserDatabase();
            corpus.TelemetryClient.Enable();

            await CallResolveManifestWithAnEntity(corpus);

            // wait until all the logs are ingested
            while (!(corpus.TelemetryClient as TelemetryKustoClient).CheckRequestQueueIsEmpty())
            {
                System.Threading.Thread.Sleep((corpus.TelemetryClient as TelemetryKustoClient).TimeoutMilliseconds);
            }
        }

        /// <summary>
        /// Test with invalid AAD App credentials, which should fail the authorization
        /// </summary>
        [TestMethod]
        public void TestAadAppAuthorizationException()
        {
            // initialize with some dummy credentials
            var corpus = new CdmCorpusDefinition();
            TelemetryConfig kustoConfig = new TelemetryConfig("tenant id", "client id", "secret", "cluster name", "database name", EnvironmentType.DEV, removeUserContent: false);
            corpus.TelemetryClient = new TelemetryKustoClient(corpus.Ctx, kustoConfig);

            Func<Task> func = async () =>
            {
                await (corpus.TelemetryClient as TelemetryKustoClient).PostKustoQuery("some random query");
            };
            func.Should().Throw<System.Exception>("Kusto cluster authentication failed.");
        }

        /// <summary>
        /// Test retry policy with max timeout set to be a small value
        /// </summary>
        [TestMethod]
        public void TestMaximumTimeoutAndRetries()
        {
            // initialize credentials
            var corpus = InitializeClientWithDefaultDatabase();

            // default max retries is 10
            // set timeout to 1 millisecond so the function will reach max retries and fail
            (corpus.TelemetryClient as TelemetryKustoClient).MaxTimeoutMilliseconds = TimeSpan.FromMilliseconds(1).Milliseconds;

            Func<Task> func = async () =>
            {
                string query = $".ingest inline into table infoLogs<|\n{DateTime.UtcNow}," +
                $"class name,method name,some message,None,corpus path,correlation id,api correlation id,app id,property";
                await (corpus.TelemetryClient as TelemetryKustoClient).PostKustoQuery(query);
            };
            func.Should().Throw<CdmTimedOutException>("Ingestion failed because exceeded maximum timeout");
        }

        private CdmCorpusDefinition InitializeClientWithDefaultDatabase()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestTelemetryKustoClient");

            string tenantId = Environment.GetEnvironmentVariable("KUSTO_TENANTID");
            string clientId = Environment.GetEnvironmentVariable("KUSTO_CLIENTID");
            string secret = Environment.GetEnvironmentVariable("KUSTO_SECRET");
            string clusterName = Environment.GetEnvironmentVariable("KUSTO_CLUSTER");
            string databaseName = Environment.GetEnvironmentVariable("KUSTO_DATABASE");

            Assert.IsFalse(string.IsNullOrEmpty(tenantId), "KUSTO_TENANTID not set");
            Assert.IsFalse(string.IsNullOrEmpty(clientId), "KUSTO_CLIENTID not set");
            Assert.IsFalse(string.IsNullOrEmpty(secret), "KUSTO_SECRET not set");
            Assert.IsFalse(string.IsNullOrEmpty(clusterName), "KUSTO_CLUSTER not set");
            Assert.IsFalse(string.IsNullOrEmpty(databaseName), "KUSTO_DATABASE not set");

            TelemetryConfig kustoConfig = new TelemetryConfig(tenantId, clientId, secret, clusterName, databaseName, EnvironmentType.DEV, removeUserContent: false);
            corpus.TelemetryClient = new TelemetryKustoClient(corpus.Ctx, kustoConfig);
            corpus.AppId = "CDM Integration Test";

            // set callback to receive error and warning logs.
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (level, message) =>
                {
                    // Do nothing
                }
            }, CdmStatusLevel.Progress);

            return corpus;
        }

        private CdmCorpusDefinition InitializeClientWithUserDatabase()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestTelemetryKustoClient");

            string tenantId = Environment.GetEnvironmentVariable("KUSTO_TENANTID");
            string clientId = Environment.GetEnvironmentVariable("KUSTO_CLIENTID");
            string secret = Environment.GetEnvironmentVariable("KUSTO_SECRET");

            string clusterName = Environment.GetEnvironmentVariable("KUSTO_CLUSTER");
            string databaseName = Environment.GetEnvironmentVariable("KUSTO_DATABASE");
            string infoTable = Environment.GetEnvironmentVariable("KUSTO_INFOTABLE");
            string warningTable = Environment.GetEnvironmentVariable("KUSTO_WARNINGTABLE");
            string errorTable = Environment.GetEnvironmentVariable("KUSTO_ERRORTABLE");

            Assert.IsFalse(string.IsNullOrEmpty(tenantId), "KUSTO_TENANTID not set");
            Assert.IsFalse(string.IsNullOrEmpty(clientId), "KUSTO_CLIENTID not set");
            Assert.IsFalse(string.IsNullOrEmpty(secret), "KUSTO_SECRET not set");

            Assert.IsFalse(string.IsNullOrEmpty(clusterName), "KUSTO_CLUSTER not set");
            Assert.IsFalse(string.IsNullOrEmpty(databaseName), "KUSTO_DATABASE not set");
            Assert.IsFalse(string.IsNullOrEmpty(infoTable), "KUSTO_INFOTABLE not set");
            Assert.IsFalse(string.IsNullOrEmpty(warningTable), "KUSTO_WARNINGTABLE not set");
            Assert.IsFalse(string.IsNullOrEmpty(errorTable), "KUSTO_ERRORTABLE not set");

            TelemetryConfig kustoConfig = new TelemetryConfig(tenantId, clientId, secret,
                clusterName, databaseName, infoTable, warningTable, errorTable, EnvironmentType.DEV, removeUserContent: false);

            corpus.TelemetryClient = new TelemetryKustoClient(corpus.Ctx, kustoConfig);

            corpus.AppId = "CDM Integration Test";

            // set callback to receive error and warning logs.
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (level, message) =>
                {
                    // Do nothing
                }
            }, CdmStatusLevel.Progress);

            return corpus;
        }

        /// <summary>
        /// Call CreateResolvedManifestAsync function to resolve a manifest with one entity,
        /// and get the logs of the function and all other internally called functions
        /// </summary>
        private async Task CallResolveManifestWithAnEntity(CdmCorpusDefinition corpus)
        {
            var manifest = corpus.MakeObject<CdmManifestDefinition>(CdmObjectType.ManifestDef, "dummy");
            corpus.Storage.FetchRootFolder("local").Documents.Add(manifest, "default.manifest.cdm.json");

            var entity1 = corpus.MakeObject<CdmEntityDefinition>(CdmObjectType.EntityDef, "MyEntity");

            var someAttrib1 = corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, "MyAttribute", false);
            someAttrib1.DataType = corpus.MakeRef<CdmDataTypeReference>(CdmObjectType.DataTypeRef, "entityId", true);
            entity1.Attributes.Add(someAttrib1);

            var entity1Doc = corpus.MakeObject<CdmDocumentDefinition>(CdmObjectType.DocumentDef, "MyEntity.cdm.json");
            entity1Doc.Definitions.Add(entity1);
            corpus.Storage.FetchRootFolder("local").Documents.Add(entity1Doc);

            manifest.Entities.Add(entity1);
            await manifest.CreateResolvedManifestAsync("new dummy", null);
        }
    }
}
