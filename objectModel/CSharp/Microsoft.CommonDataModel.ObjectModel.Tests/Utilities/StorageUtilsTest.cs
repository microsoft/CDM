// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.CommonDataModel.ObjectModel.Utilities;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Utilities
{
    /// <summary>
    /// Test to validate StorageUtils functions
    /// </summary>
    [TestClass]
    public class StorageUtilsTest
    {
        /// <summary>
        /// Test SplitNamespacePath function on different paths
        /// </summary>
        [TestMethod]
        public void TestSplitNamespacePath()
        {
            Assert.IsNull(StorageUtils.SplitNamespacePath(null));

            var pathTuple1 = StorageUtils.SplitNamespacePath("local:/some/path");
            Assert.IsNotNull(pathTuple1);
            Assert.AreEqual("local", pathTuple1.Item1);
            Assert.AreEqual("/some/path", pathTuple1.Item2);

            var pathTuple2 = StorageUtils.SplitNamespacePath("/some/path");
            Assert.IsNotNull(pathTuple2);
            Assert.AreEqual("", pathTuple2.Item1);
            Assert.AreEqual("/some/path", pathTuple2.Item2);

            var pathTuple3 = StorageUtils.SplitNamespacePath("adls:/some/path:with:colons");
            Assert.IsNotNull(pathTuple3);
            Assert.AreEqual("adls", pathTuple3.Item1);
            Assert.AreEqual("/some/path:with:colons", pathTuple3.Item2);
        }
    }
}
