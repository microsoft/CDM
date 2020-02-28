using Microsoft.CommonDataModel.ObjectModel.Storage;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Storage
{
    [TestClass]
    public class AdlsAdapterTests
    {
        /// <summary>
        /// Creates corpus path and adapter path.
        /// </summary>
        [TestMethod]
        public void TestCreateCorpusAndAdapterPathInAdlsAdapter()
        {
            var host1 = "storageaccount.dfs.core.windows.net";
            var root = "/fs";
            var adlsAdapter = new ADLSAdapter(host1, root, string.Empty);

            var adapterPath1 = "https://storageaccount.dfs.core.windows.net/fs/a/1.csv";
            var adapterPath2 = "https://storageaccount.dfs.core.windows.net:443/fs/a/2.csv";
            var adapterPath3 = "https://storageaccount.blob.core.windows.net/fs/a/3.csv";
            var adapterPath4 = "https://storageaccount.blob.core.windows.net:443/fs/a/4.csv";

            var corpusPath1 = adlsAdapter.CreateCorpusPath(adapterPath1);
            var corpusPath2 = adlsAdapter.CreateCorpusPath(adapterPath2);
            var corpusPath3 = adlsAdapter.CreateCorpusPath(adapterPath3);
            var corpusPath4 = adlsAdapter.CreateCorpusPath(adapterPath4);

            Assert.AreEqual("/a/1.csv", corpusPath1);
            Assert.AreEqual("/a/2.csv", corpusPath2);
            Assert.AreEqual("/a/3.csv", corpusPath3);
            Assert.AreEqual("/a/4.csv", corpusPath4);

            Assert.AreEqual(adapterPath1, adlsAdapter.CreateAdapterPath(corpusPath1));
            Assert.AreEqual(adapterPath2, adlsAdapter.CreateAdapterPath(corpusPath2));
            Assert.AreEqual(adapterPath3, adlsAdapter.CreateAdapterPath(corpusPath3));
            Assert.AreEqual(adapterPath4, adlsAdapter.CreateAdapterPath(corpusPath4));

            var host2 = "storageaccount.blob.core.windows.net:8888";
            adlsAdapter = new ADLSAdapter(host2, root, string.Empty);

            var adapterPath5 = "https://storageaccount.blob.core.windows.net:8888/fs/a/5.csv";
            var adapterPath6 = "https://storageaccount.dfs.core.windows.net:8888/fs/a/6.csv";
            var adapterPath7 = "https://storageaccount.blob.core.windows.net/fs/a/7.csv";

            Assert.AreEqual("/a/5.csv", adlsAdapter.CreateCorpusPath(adapterPath5));
            Assert.AreEqual("/a/6.csv", adlsAdapter.CreateCorpusPath(adapterPath6));
            Assert.AreEqual(null, adlsAdapter.CreateCorpusPath(adapterPath7));
        }
    }
}
