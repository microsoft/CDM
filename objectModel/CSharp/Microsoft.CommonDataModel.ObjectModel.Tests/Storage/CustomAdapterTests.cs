using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.Storage
{
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
