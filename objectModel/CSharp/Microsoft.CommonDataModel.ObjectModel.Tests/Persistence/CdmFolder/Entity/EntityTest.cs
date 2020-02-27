// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder;
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
            corpus.SetEventCallback(new EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);
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

        /// <summary>
        /// Testing special case where "this.attributes" attributes do not inherit the InDocument field because these attributes
        /// are created during resolution (no inDocument propagation during resolution). This error appears when running copyData
        /// with stringRefs = true in certain cases
        /// </summary>
        [TestMethod]
        public async Task TestFromAndToDataWithElevatedTraits()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestFromAndToDataWithElevatedTraits", null);
            // need to set schema docs to the cdm namespace instead of using resources
            corpus.Storage.Mount("cdm", new LocalAdapter(TestHelper.SchemaDocumentsPath));
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    if (message.Contains("unable to resolve an entity"))
                        Assert.Fail();
                }
            }, CdmStatusLevel.Warning);
            var entity = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/Account.cdm.json/Account");
            var resEntity = await entity.CreateResolvedEntityAsync($"{entity.EntityName}_");
            EntityPersistence.ToData(resEntity, new ResolveOptions(resEntity.InDocument), new CopyOptions() { StringRefs = true });
        }

        /// <summary>
        /// Testing that loading entities with missing references logs warnings when the resolve option ShallowValidation = true.
        /// </summary>
        [TestMethod]
        public async Task TestLoadingEntityWithShallowValidation()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestLoadingEntityWithShallowValidation", null);
            corpus.Storage.Mount("cdm", new LocalAdapter(TestHelper.SchemaDocumentsPath));
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    // When messages regarding references not being resolved or loaded are logged, check that they are warnings and not errors. 
                    if (message.Contains("Unable to resolve the reference") || message.Contains("Could not read"))
                        Assert.AreEqual(CdmStatusLevel.Warning, statusLevel);
                }
            }, CdmStatusLevel.Warning);

            // Load entity with ShallowValidation = true.
            await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/Entity.cdm.json/Entity", null, true);
            // Load resolved entity with ShallowValidation = true.
            await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/ResolvedEntity.cdm.json/ResolvedEntity", null, true);
        }

        /// <summary>
        /// Testing that loading entities with missing references logs errors when the resolve option ShallowValidation = false.
        /// </summary>
        [TestMethod]
        public async Task TestLoadingEntityWithoutShallowValidation()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestLoadingEntityWithShallowValidation", null);
            corpus.Storage.Mount("cdm", new LocalAdapter(TestHelper.SchemaDocumentsPath));
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    // When messages regarding references not being resolved or loaded are logged, check that they are errors. 
                    if (message.Contains("Unable to resolve the reference") || message.Contains("Could not read"))
                        Assert.AreEqual(CdmStatusLevel.Error, statusLevel);
                }
            }, CdmStatusLevel.Warning);

            // Load entity with ShallowValidation = false.
            await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/Entity.cdm.json/Entity");
            // Load resolved entity with ShallowValidation = false.
            await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/ResolvedEntity.cdm.json/ResolvedEntity");
        }
    }
}
