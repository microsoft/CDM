// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Storage
{
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    [TestClass]
    public class LocalAdapterTests
    {
        /// <summary>
        /// Test that CreateAdapterPath returns the same result for a path with or without a leading slash.
        /// </summary>
        [TestMethod]
        public void TestCreateAdapterPath()
        {
            var adapter = new LocalAdapter("C:/some/dir");
            string pathWithLeadingSlash = adapter.CreateAdapterPath("/folder");
            string pathWithoutLeadingSlash = adapter.CreateAdapterPath("folder");

            Assert.AreEqual(pathWithLeadingSlash, "C:\\some\\dir\\folder");
            Assert.AreEqual(pathWithLeadingSlash, pathWithoutLeadingSlash);

            // A null corpus path should return a null adapter path
            Assert.IsNull(adapter.CreateAdapterPath(null));
        }
    }
}