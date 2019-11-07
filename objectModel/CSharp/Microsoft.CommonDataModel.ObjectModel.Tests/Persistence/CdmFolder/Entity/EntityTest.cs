namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.Tools.Processor;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.IO;
    using System.Threading.Tasks;
    [TestClass]
    public class EntityTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private readonly string testsSubpath = Path.Combine("Persistence", "CdmFolder", "Entity");
        /// <summary>
        /// Testing that traits with multiple properties are maintained
        /// even when one of the properties is null
        /// </summary>
        [TestMethod]
        public async Task TestEntityProperties()
        {
            var testInputPath = TestHelper.GetInputFolderPath(testsSubpath, "TestEntityProperties");
            CdmCorpusDefinition corpus = new CdmCorpusDefinition();
            corpus.SetEventCallback(new Utilities.EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);
            corpus.Storage.Mount("local", new LocalAdapter(testInputPath));
            corpus.Storage.DefaultNamespace = "local";

            CdmEntityDefinition obj = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/entA.cdm.json/Entity A");
            CdmTypeAttributeDefinition att = obj.Attributes[0] as CdmTypeAttributeDefinition;
            var result = att.AppliedTraits.AllItems.Find(x => x.NamedReference == "is.constrained");

            Assert.IsNotNull(result);
            Assert.AreEqual(att.MaximumLength, 30);
            Assert.IsNull(att.MaximumValue);
            Assert.IsNull(att.MinimumValue);

            // removing the only argument should remove the trait
            att.MaximumLength = null;
            result = att.AppliedTraits.AllItems.Find(x => x.NamedReference == "is.constrained");
            Assert.IsNull(att.MaximumLength);
            Assert.IsNull(result);
        }
    }
}
