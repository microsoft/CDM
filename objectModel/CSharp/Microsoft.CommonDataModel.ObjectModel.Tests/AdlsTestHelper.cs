// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.CommonDataModel.ObjectModel.Storage;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;

namespace Microsoft.CommonDataModel.ObjectModel.Tests
{
    /// <summary>
    /// Class to initialize adls tests adapters.
    /// </summary>
    public static class AdlsTestHelper
    {
        public static void CheckADLSEnvironment()
        {
            if (String.IsNullOrEmpty(Environment.GetEnvironmentVariable("ADLS_RUNTESTS")))
            {
                // this will cause tests to appear as "Skipped" in the final result
                Assert.Inconclusive("ADLS environment not set up");
            }
        }

        public static ADLSAdapter CreateAdapterWithSharedKey(string rootRelativePath = null, bool testBlobHostName = false)
        {
            string hostname = Environment.GetEnvironmentVariable("ADLS_HOSTNAME");
            string rootPath = Environment.GetEnvironmentVariable("ADLS_ROOTPATH");
            string sharedKey = Environment.GetEnvironmentVariable("ADLS_SHAREDKEY");

            Assert.IsFalse(String.IsNullOrEmpty(hostname), "ADLS_ENDPOINT not set");
            Assert.IsFalse(String.IsNullOrEmpty(rootPath), "ADLS_ROOTPATH not set");
            Assert.IsFalse(String.IsNullOrEmpty(sharedKey), "ADLS_SHAREDKEY not set");

            if (testBlobHostName)
            {
                hostname = hostname.Replace("dfs", "blob");
            }

            return new ADLSAdapter(hostname, GetFullRootPath(rootPath, rootRelativePath), sharedKey);
        }

        public static ADLSAdapter CreateAdapterWithClientId(string rootRelativePath = null, bool specifyEndpoint = false, bool testBlobHostName = false)
        {
            string hostname = Environment.GetEnvironmentVariable("ADLS_HOSTNAME");
            string rootPath = Environment.GetEnvironmentVariable("ADLS_ROOTPATH");
            string tenant = Environment.GetEnvironmentVariable("ADLS_TENANT");
            string clientId = Environment.GetEnvironmentVariable("ADLS_CLIENTID");
            string clientSecret = Environment.GetEnvironmentVariable("ADLS_CLIENTSECRET");

            Assert.IsFalse(String.IsNullOrEmpty(hostname), "ADLS_ENDPOINT not set");
            Assert.IsFalse(String.IsNullOrEmpty(rootPath), "ADLS_ROOTPATH not set");
            Assert.IsFalse(String.IsNullOrEmpty(tenant), "ADLS_TENANT not set");
            Assert.IsFalse(String.IsNullOrEmpty(clientId), "ADLS_CLIENTID not set");
            Assert.IsFalse(String.IsNullOrEmpty(clientSecret), "ADLS_CLIENTSECRET not set");

            if (testBlobHostName)
            {
                hostname = hostname.Replace("dfs", "blob");
            }

            if (specifyEndpoint)
            {
                return new ADLSAdapter(hostname, GetFullRootPath(rootPath, rootRelativePath), tenant, clientId, clientSecret, Enums.AzureCloudEndpoint.AzurePublic);
            }

            return new ADLSAdapter(hostname, GetFullRootPath(rootPath, rootRelativePath), tenant, clientId, clientSecret);
        }

        public static string GetFullRootPath(string rootPath, string rootRelativePath)
        {
            if (rootRelativePath == null)
            {
                return rootPath;
            }

            if (rootPath.EndsWith("/"))
            {
                rootPath = rootPath.Substring(0, rootPath.Length - 1);
            }

            if (rootRelativePath.StartsWith("/"))
            {
                rootRelativePath = rootRelativePath.Substring(1);
            }

            return $"{rootPath}/{rootRelativePath}";
        }
    }
}
