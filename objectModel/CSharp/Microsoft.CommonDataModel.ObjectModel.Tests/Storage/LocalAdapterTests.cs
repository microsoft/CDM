// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Storage
{
    using System;
    using System.IO;
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
            string rootPath = OperatingSystem.IsWindows() ? "C:\\" : "/";
            string fullPath = Path.Combine(rootPath, "some", "dir");

            var adapter = new LocalAdapter(fullPath);
            string pathWithLeadingSlash = adapter.CreateAdapterPath("/folder");
            string pathWithoutLeadingSlash = adapter.CreateAdapterPath("folder");

            string fullPathWithFolder = Path.Combine(fullPath, "folder");

            Assert.AreEqual(pathWithLeadingSlash, fullPathWithFolder);
            Assert.AreEqual(pathWithLeadingSlash, pathWithoutLeadingSlash);

            // A null corpus path should return a null adapter path
            Assert.IsNull(adapter.CreateAdapterPath(null));
        }
    }
}