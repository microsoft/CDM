// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.CommonDataModel.ObjectModel.Storage;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Microsoft.CommonDataModel.ObjectModel.Tests
{
    /// <summary>
    /// Class to initialize SYMS tests adapters.
    /// </summary>
    public static class SymsTestHelper
    {
        public readonly static string DatabaseName = "SymsTestDatabase";

        public static void CheckSymsEnvironment()
        {
            if (Environment.GetEnvironmentVariable("SYMS_RUNTESTS") != "1")
            {
                // this will cause tests to appear as "Skipped" in the final result
                Assert.Inconclusive("Syms environment not set up");
            }
        }

        public static SymsAdapter CreateAdapterWithClientId()
        {
            string endpoint = Environment.GetEnvironmentVariable("SYMS_ENDPOINT");
            string tenant = Environment.GetEnvironmentVariable("SYMS_TENANT");
            string clientId = Environment.GetEnvironmentVariable("SYMS_CLIENTID");
            string clientSecret = Environment.GetEnvironmentVariable("SYMS_CLIENTSECRET");

            Assert.IsFalse(string.IsNullOrEmpty(endpoint), "SYMS_ENDPOINT not set");
            Assert.IsFalse(string.IsNullOrEmpty(tenant), "SYMS_TENANT not set");
            Assert.IsFalse(string.IsNullOrEmpty(clientId), "SYMS_CLIENTID not set");
            Assert.IsFalse(string.IsNullOrEmpty(clientSecret), "SYMS_CLIENTSECRET not set");

            SymsAdapter adapter = new SymsAdapter(endpoint, tenant, clientId, clientSecret);

            return adapter;
        }

        public static ADLSAdapter CreateADLSAdapterWithClientIdWithSharedKey(int adapterNum, string rootRelativePath = null)
        {
            string hostname = Environment.GetEnvironmentVariable($"SYMS_TEST_ADLS{adapterNum}_HOSTNAME");
            string rootPath = Environment.GetEnvironmentVariable($"SYMS_TEST_ADLS{adapterNum}_ROOTPATH");
            string sharedkey = Environment.GetEnvironmentVariable($"SYMS_TEST_ADLS{adapterNum}_SHAREDKEY");

            Assert.IsFalse(string.IsNullOrEmpty(hostname), $"SYMS_TEST_ADLS{adapterNum}_ENDPOINT not set");
            Assert.IsFalse(string.IsNullOrEmpty(rootPath), $"SYMS_TEST_ADLS{adapterNum}_ROOTPATH not set");
            Assert.IsFalse(string.IsNullOrEmpty(sharedkey), $"SYMS_TEST_ADLS{adapterNum}_SHAREDKEY not set");

            ADLSAdapter adapter = new ADLSAdapter(hostname, rootPath, sharedkey);

            return adapter;
        }
        public static async Task CleanDatabase(SymsAdapter adapter, string dbName)
        {
            try
            {
                await adapter.WriteAsync($"{dbName}/{dbName}.manifest.cdm.json", null);
            }
            catch (Exception e)
            {
                if (!e.Message.Contains("NotFound"))
                {
                    throw;
                }
            }
        }

        public static bool JsonObjectShouldBeEqualAsExpected(string expected, string actual)
        {
            JToken expectedObj = JToken.Parse(expected);
            JToken actualObj = IgnoreProperties(JToken.Parse(actual));

            return TestHelper.CompareObjectsContent(expectedObj, actualObj, ignoreNullValues: true);
        }

        private static JToken IgnoreProperties(JToken obj)
        {
            List<string> ignorePaths = new List<string>(new string[] { "properties.ObjectId", "properties.StorageDescriptor.ColumnSetEntityName" });

            // remove id
            ((JObject)obj).Property("id")?.Remove();

            foreach (var path in ignorePaths)
            {
                if (obj.SelectToken(path) != null)
                {
                    obj.SelectToken(path).Replace("");
                }
            }

            IList<JToken> deleteAttr = new List<JToken>();
            if (obj.SelectToken("properties.Properties") != null)
            {
                foreach (var x in obj.SelectToken("properties.Properties"))
                {
                    var name = ((JProperty)x).Name;
                    if (!name.StartsWith("cdm:"))
                    {
                        deleteAttr.Add(x);
                    }
                }
            }

            foreach (var rem in deleteAttr)
            {
                rem.Remove();
            }

            return obj;
        }
    }
}
