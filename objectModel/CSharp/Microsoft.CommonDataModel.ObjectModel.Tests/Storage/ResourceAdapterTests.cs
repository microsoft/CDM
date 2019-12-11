using Microsoft.CommonDataModel.ObjectModel.Cdm;
using Microsoft.CommonDataModel.ObjectModel.Storage;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NUnit.Framework.Internal;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Storage
{
    [TestClass]
    public class ResourceAdapterTests
    {
        [TestMethod]
        public void TestCreateCorpusPath()
        {
            var adapter = new ResourceAdapter();

            var path = adapter.CreateCorpusPath("Microsoft.CommonDataModel.ObjectModel.Resources.ODI_analogs.ODIEntity.cdm.json");
            Assert.AreEqual("/ODI-analogs/ODIEntity.cdm.json", path);

            path = adapter.CreateCorpusPath("Microsoft.CommonDataModel.ObjectModel.Resources.ODI_analogs.customer.ODIEntity.cdm.json");
            Assert.AreEqual("/ODI-analogs/customer/ODIEntity.cdm.json", path);

            path = adapter.CreateCorpusPath("Microsoft.CommonDataModel.ObjectModel.Resources.extensions.pbi.extension.cdm.json");
            Assert.AreEqual("/extensions/pbi.extension.cdm.json", path);

            path = adapter.CreateCorpusPath("Microsoft.CommonDataModel.ObjectModel.Resources.primitives.cdm.json");
            Assert.AreEqual("/primitives.cdm.json", path);

            path = adapter.CreateCorpusPath("Microsoft.CommonDataModel.ObjectModel.Resources.ODI_analogs.customer._allImports.cdm.json");
            Assert.AreEqual("/ODI-analogs/customer/_allImports.cdm.json", path);
        }

        [TestMethod]
        public void TestCreateAdapterPath()
        {
            var adapter = new ResourceAdapter();

            var path = adapter.CreateAdapterPath("/ODI-analogs/ODIEntity.cdm.json");
            Assert.AreEqual("Microsoft.CommonDataModel.ObjectModel.Resources.ODI_analogs.ODIEntity.cdm.json", path);

            path = adapter.CreateAdapterPath("/ODI-analogs/customer/ODIEntity.cdm.json");
            Assert.AreEqual("Microsoft.CommonDataModel.ObjectModel.Resources.ODI_analogs.customer.ODIEntity.cdm.json", path);

            path = adapter.CreateAdapterPath("/extensions/pbi.extension.cdm.json");
            Assert.AreEqual("Microsoft.CommonDataModel.ObjectModel.Resources.extensions.pbi.extension.cdm.json", path);

            path = adapter.CreateAdapterPath("/primitives.cdm.json");
            Assert.AreEqual("Microsoft.CommonDataModel.ObjectModel.Resources.primitives.cdm.json", path);
        }
    }
}
