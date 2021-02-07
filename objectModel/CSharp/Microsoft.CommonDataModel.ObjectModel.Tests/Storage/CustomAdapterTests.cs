// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Storage
{
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    [TestClass]
    public class CustomAdapterTests
    {
        /// <summary>
        /// Creates a custom adapter and tests whether it exists.
        /// </summary>
        [TestMethod]
        public void TestCustomAdlsAdapter()
        {
            var adapter = new MockADLSAdapter();
            Assert.IsNotNull(adapter);
        }
    }
}
