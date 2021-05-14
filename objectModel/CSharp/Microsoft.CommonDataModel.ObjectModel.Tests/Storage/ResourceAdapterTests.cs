// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Storage
{
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using NUnit.Framework.Internal;
    using System.Threading.Tasks;

    [TestClass]
    public class ResourceAdapterTests
    {
        private const string ROOT = "Microsoft.CommonDataModel.ObjectModel.Resources";

        /// <summary>
        /// Tests if the calls to CreateCorpusPath return the expected corpus path.
        /// </summary>
        [TestMethod]
        public void TestCreateCorpusPath()
        {
            var adapter = new ResourceAdapter();

            var path = adapter.CreateCorpusPath($"{ROOT}/extensions/pbi.extension.cdm.json");
            Assert.AreEqual("/extensions/pbi.extension.cdm.json", path);

            path = adapter.CreateCorpusPath($"{ROOT}/primitives.cdm.json");
            Assert.AreEqual("/primitives.cdm.json", path);
        }

        /// <summary>
        /// Tests if the calls to CreateAdapterPath return the expected adapter path.
        /// </summary>
        [TestMethod]
        public void TestCreateAdapterPath()
        {
            var adapter = new ResourceAdapter();

            var path = adapter.CreateAdapterPath("/extensions/pbi.extension.cdm.json");
            Assert.AreEqual($"{ROOT}/extensions/pbi.extension.cdm.json", path);

            path = adapter.CreateAdapterPath("/primitives.cdm.json");
            Assert.AreEqual($"{ROOT}/primitives.cdm.json", path);
        }

        /// <summary>
        /// Tests if the files from the resource adapter can be read correclty.
        /// </summary>
        [TestMethod]
        public async Task TestReadAsync()
        {
            var adapter = new ResourceAdapter();

            Assert.IsNotNull(await adapter.ReadAsync("/extensions/pbi.extension.cdm.json"));
            Assert.IsNotNull(await adapter.ReadAsync("/primitives.cdm.json"));
        }
    }
}
