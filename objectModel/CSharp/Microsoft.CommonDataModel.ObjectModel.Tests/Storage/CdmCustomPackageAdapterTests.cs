// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.CommonDataModel.ObjectModel.Storage;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Reflection;
using System.Threading.Tasks;

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Storage
{
    /// <summary>
    /// Tests if the CdmCustomPackageAdapter functions correctly.
    /// </summary>
    [TestClass]
    public class CdmCustomPackageAdapterTests
    {
        private const string ROOT = "Microsoft.CommonDataModel.ObjectModel.Adapter.CdmStandards.Resources";

        private const string ExtensionsFile = "/extensions/pbi.extension.cdm.json";

        private const string FoundationsFile = "/cdmfoundation/foundations.cdm.json";

        private const string InvalidFile = "invalidFile";

        /// <summary>
        /// Tests if the adapter handles correctly if the package cannot be found
        /// </summary>
        [TestMethod]
        public void TestPackageNotFound()
        {
            bool errorCalled = false;
            try
            {
                new CdmCustomPackageAdapter("someInvalidPackage");
            }
            catch (Exception e)
            {
                Assert.IsTrue(e.Message.StartsWith("Couldn't find assembly 'someInvalidPackage'"));
                errorCalled = true;
            }

            Assert.IsTrue(errorCalled);
        }
        
        /// <summary>
        /// Tests if the calls to CreateCorpusPath return the expected corpus path.
        /// </summary>
        [TestMethod]
        public void TestCdmStandardsCreateCorpusPath()
        {
            var adapter = new CdmStandardsAdapter();

            var path = adapter.CreateCorpusPath($"{ROOT}{ExtensionsFile}");
            Assert.AreEqual(ExtensionsFile, path);

            path = adapter.CreateCorpusPath($"{ROOT}{FoundationsFile}");
            Assert.AreEqual(FoundationsFile, path);

            // invalid paths
            path = adapter.CreateCorpusPath(InvalidFile);
            Assert.IsNull(path);
        }

        /// <summary>
        /// Tests if the calls to CreateAdapterPath return the expected adapter path.
        /// </summary>
        [TestMethod]
        public void TestCdmStandardsCreateAdapterPath()
        {
            var adapter = new CdmStandardsAdapter();

            var path = adapter.CreateAdapterPath(ExtensionsFile);
            Assert.AreEqual($"{ROOT}{ExtensionsFile}", path);

            path = adapter.CreateAdapterPath(FoundationsFile);
            Assert.AreEqual($"{ROOT}{FoundationsFile}", path);
        }

        /// <summary>
        /// Tests if the files from the resource adapter can be read correctly.
        /// </summary>
        [TestMethod]
        public async Task TestCdmStandardsReadAsync()
        {
            var adapter = new CdmStandardsAdapter();

            Assert.IsNotNull(await adapter.ReadAsync(ExtensionsFile));
            Assert.IsNotNull(await adapter.ReadAsync(FoundationsFile));

            bool errorWasThrown = false;
            try
            {
                await adapter.ReadAsync(InvalidFile);
            }
            catch (Exception e)
            {
                string message = $"There is no resource found for {InvalidFile}.";
                Assert.AreEqual(message, e.Message);
                errorWasThrown = true;
            }

            Assert.IsTrue(errorWasThrown);
        }
        
        /// <summary>
        /// Tests if the CdmCustomPackageAdapter works when assembly is passed in the constructor.
        /// </summary>
        [TestMethod]
        public async Task TestCustomPackageInConstructor()
        {
            var cdmStandardsPackage = Assembly.Load("Microsoft.CommonDataModel.ObjectModel.Adapter.CdmStandards");
            var adapter = new CdmCustomPackageAdapter(cdmStandardsPackage);

            Assert.IsNotNull(await adapter.ReadAsync(FoundationsFile));
        }
    }
}
