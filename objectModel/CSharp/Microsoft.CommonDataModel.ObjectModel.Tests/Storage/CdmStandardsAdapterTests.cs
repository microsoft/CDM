// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Storage
{
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Threading.Tasks;
    using Assert = VisualStudio.TestTools.UnitTesting.Assert;

    /// <summary>
    /// Tests if the CdmStandardsAdapter functions correctly.
    /// </summary>
    [TestClass]
    public class CdmStandardsAdapterTests
    {
        private const string ROOT = "Microsoft.CommonDataModel.ObjectModel.Adapter.CdmStandards.Resources";

        private const string ExtensionsFile = "/extensions/pbi.extension.cdm.json";

        private const string FoundationsFile = "/cdmfoundation/foundations.cdm.json";

        private const string InvalidFile = "invalidFile";

        /// <summary>
        /// Tests if the calls to CreateCorpusPath return the expected corpus path.
        /// </summary>
        [TestMethod]
        public void TestCreateCorpusPath()
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
        public void TestCreateAdapterPath()
        {
            var adapter = new CdmStandardsAdapter();

            var path = adapter.CreateAdapterPath(ExtensionsFile);
            Assert.AreEqual($"{ROOT}{ExtensionsFile}", path);

            path = adapter.CreateAdapterPath(FoundationsFile);
            Assert.AreEqual($"{ROOT}{FoundationsFile}", path);
        }

        /// <summary>
        /// Tests if the files from the resource adapter can be read correclty.
        /// </summary>
        [TestMethod]
        public async Task TestReadAsync()
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
    }
}

