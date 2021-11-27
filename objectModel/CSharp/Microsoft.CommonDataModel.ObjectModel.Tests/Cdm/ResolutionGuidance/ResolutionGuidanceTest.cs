// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.Tools.Processor;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;

    [TestClass]
    public class ResolutionGuidanceTest
    {
        /// <summary>
        /// The path of the SchemaDocs project.
        /// </summary>
        private const string SchemaDocsPath = TestHelper.SchemaDocumentsPath;

        /// <summary>
        /// The test's data path.
        /// </summary>
        private static readonly string TestsSubpath = Path.Combine("Cdm", "ResolutionGuidance");

        /// <summary>
        /// Tests if a warning is logged if resolution guidance is used
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestResolutionGuidanceDeprecation()
        {
            var corpus = TestHelper.GetLocalCorpus(TestsSubpath, nameof(TestResolutionGuidanceDeprecation));

            // Tests warning log when resolution guidance is used on a data typed attribute.
            var entity = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/TypeAttribute.cdm.json/Entity");
            await entity.CreateResolvedEntityAsync("res-entity");
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.WarnDeprecatedResolutionGuidance, true);

            // Tests warning log when resolution guidance is used on a entity typed attribute.
            entity = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/EntityAttribute.cdm.json/Entity");
            await entity.CreateResolvedEntityAsync("res-entity");
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.WarnDeprecatedResolutionGuidance, true);

            // Tests warning log when resolution guidance is used when extending an entity.
            entity = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/ExtendsEntity.cdm.json/Entity");
            await entity.CreateResolvedEntityAsync("res-entity");
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.WarnDeprecatedResolutionGuidance, true);
        }

        [TestMethod]
        public void TestResolutionGuidanceCopy()
        {
            var corpus = new CdmCorpusDefinition();
            var resolutionGuidance = new CdmAttributeResolutionGuidance(corpus.Ctx)
            {
                expansion = new CdmAttributeResolutionGuidance.Expansion(),
                entityByReference = new CdmAttributeResolutionGuidance.CdmAttributeResolutionGuidance_EntityByReference(),
                selectsSubAttribute = new CdmAttributeResolutionGuidance.CdmAttributeResolutionGuidance_SelectsSubAttribute(),
                imposedDirectives = new List<string>(),
                removedDirectives = new List<string>()
            };

            var resolutionGuidanceCopy = resolutionGuidance.Copy() as CdmAttributeResolutionGuidance;

            Assert.IsFalse(Object.ReferenceEquals(resolutionGuidance.expansion, resolutionGuidanceCopy.expansion));
            Assert.IsFalse(Object.ReferenceEquals(resolutionGuidance.entityByReference, resolutionGuidanceCopy.entityByReference));
            Assert.IsFalse(Object.ReferenceEquals(resolutionGuidance.selectsSubAttribute, resolutionGuidanceCopy.selectsSubAttribute));
            Assert.IsFalse(Object.ReferenceEquals(resolutionGuidance.imposedDirectives, resolutionGuidanceCopy.imposedDirectives));
            Assert.IsFalse(Object.ReferenceEquals(resolutionGuidance.removedDirectives, resolutionGuidanceCopy.removedDirectives));
        }

        /// <summary>
        /// Resolution Guidance Test - Resolve entity by name
        /// </summary>
        [TestMethod]
        public async Task TestByEntityName()
        {
            string testName = "TestByEntityName";
            await RunTest(testName, "Sales");
        }

        /// <summary>
        /// Resolution Guidance Test - Resolve entity by primarykey
        /// </summary>
        [TestMethod]
        public async Task TestByPrimaryKey()
        {
            string testName = "TestByPrimaryKey";
            await RunTest(testName, "Sales");
        }

        /// <summary>
        /// Resolution Guidance Test - Empty ResolutionGuidance
        /// </summary>
        [TestMethod]
        public async Task TestEmptyResolutionGuidance()
        {
            string testName = "TestEmptyResolutionGuidance";
            await RunTest(testName, "Sales");
        }

        /// <summary>
        /// Resolution Guidance Test - With RenameFormat property
        /// </summary>
        [TestMethod]
        public async Task TestRenameFormat()
        {
            string testName = "TestRenameFormat";
            await RunTest(testName, "Sales");
        }

        /// <summary>
        /// Resolution Guidance Test - Empty EntityReference property
        /// </summary>
        [TestMethod]
        public async Task TestEmptyEntityReference()
        {
            string testName = "TestEmptyEntityReference";
            await RunTest(testName, "Sales");
        }

        /// <summary>
        /// Resolution Guidance Test - With AllowReferences = true
        /// </summary>
        [TestMethod]
        public async Task TestAllowReferencesTrue()
        {
            string testName = "TestAllowReferencesTrue";
            await RunTest(testName, "Sales");
        }

        /// <summary>
        /// Resolution Guidance Test - With AlwaysIncludeForeignKey = true
        /// </summary>
        [TestMethod]
        public async Task TestAlwaysIncludeForeignKeyTrue()
        {
            string testName = "TestAlwaysIncludeForeignKeyTrue";
            await RunTest(testName, "Sales");
        }

        /// <summary>
        /// Resolution Guidance Test- With ForeignKeyAttribute property
        /// </summary>
        [TestMethod]
        public async Task TestForeignKeyAttribute()
        {
            string testName = "TestForeignKeyAttribute";
            await RunTest(testName, "Sales");
        }

        /// <summary>
        /// Resolution Guidance Test - With Cardinality = "one"
        /// </summary>
        [TestMethod]
        public async Task TestCardinalityOne()
        {
            string testName = "TestCardinalityOne";
            await RunTest(testName, "Sales");
        }

        /// <summary>
        /// Resolution Guidance Test - With SelectsSubAttribute - Take Names
        /// </summary>
        [TestMethod]
        public async Task TestSelectsSubAttributeTakeNames()
        {
            var corpus = TestHelper.GetLocalCorpus(TestsSubpath, "TestSelectsSubAttributeTakeNames", null);
            var entity = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/Sales.cdm.json/Sales");
            ResolveOptions resOpt = new ResolveOptions { WrtDoc = entity.InDocument, Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "referenceOnly" }) };
            var resolvedEntity = await entity.CreateResolvedEntityAsync("resolved", resOpt);

            var att1 = resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition;
            var att2 = resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition;

            // Check that the attributes in selectsSomeTakeNames were added.
            Assert.AreEqual("SalesProductProductId", att1.Name);
            Assert.AreEqual("SalesProductProductColor", att2.Name);
        }

        /// <summary>
        /// Resolution Guidance Test - With SelectsSubAttribute - Avoid Names
        /// </summary>
        [TestMethod]
        public async Task TestSelectsSubAttributeAvoidNames()
        {
            var corpus = TestHelper.GetLocalCorpus(TestsSubpath, "TestSelectsSubAttributeAvoidNames", null);
            var entity = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/Sales.cdm.json/Sales");
            ResolveOptions resOpt = new ResolveOptions { WrtDoc = entity.InDocument, Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "referenceOnly" }) };
            var resolvedEntity = await entity.CreateResolvedEntityAsync("resolved", resOpt);

            // Check that the attributes in selectsSomeAvoidNames were not added.
            foreach (CdmTypeAttributeDefinition att in resolvedEntity.Attributes)
            {
                Assert.AreNotEqual("SalesProductProductId", att.Name);
                Assert.AreNotEqual("SalesProductProductColor", att.Name);
            }
        }

        /// <summary>
        /// Resolution Guidance Test - With structured/normal imposed directives.
        /// This test directly read imposed directives from json file instead of setting resOpt in code as RunTest().
        /// </summary>
        [TestMethod]
        public async Task TestImposedDirectives()
        {
            const string testName = "TestImposedDirectives";
            string testExpectedOutputPath = TestHelper.GetExpectedOutputFolderPath(TestsSubpath, testName);
            string testActualOutputPath = TestHelper.GetActualOutputFolderPath(TestsSubpath, testName);

            var corpus = TestHelper.GetLocalCorpus(TestsSubpath, testName, null);
            corpus.Storage.Mount("localActualOutput", new LocalAdapter(testActualOutputPath));
            CdmFolderDefinition actualOutputFolder = await corpus.FetchObjectAsync<CdmFolderDefinition>("localActualOutput:/");

            // Test "structured" imposed directive
            var entity = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/Person_Structured.cdm.json/Person");
            var resolvedEntity = await entity.CreateResolvedEntityAsync("Person_Resolved", null, actualOutputFolder);
            await resolvedEntity.InDocument.SaveAsAsync("Person_Structured_Resolved.cdm.json", true, new CopyOptions());
            ValidateOutput("Person_Structured_Resolved.cdm.json", testExpectedOutputPath, testActualOutputPath);

            // Test default imposed directive
            entity = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/Person_Default.cdm.json/Person");
            resolvedEntity = await entity.CreateResolvedEntityAsync("Person_Resolved", null, actualOutputFolder);
            await resolvedEntity.InDocument.SaveAsAsync("Person_Default_Resolved.cdm.json", true, new CopyOptions());
            ValidateOutput("Person_Default_Resolved.cdm.json", testExpectedOutputPath, testActualOutputPath);
        }

        // this is the hook for the OM to report on errors or status 
        internal static Action<CdmStatusLevel, string> ConsoleStatusReport = (level, msg) =>
        {
            if (level == CdmStatusLevel.Error)
                Console.Error.WriteLine($"Err: {msg}");
            else if (level == CdmStatusLevel.Warning)
                Console.WriteLine($"Wrn: {msg} @");
            else if (level == CdmStatusLevel.Progress)
                Console.WriteLine(msg);
            else if (level == CdmStatusLevel.Info)
                Console.WriteLine(msg);
        };

        private static async Task RunTest(string testName, string sourceEntityName)
        {
            try
            {
                string testInputPath = TestHelper.GetInputFolderPath(TestsSubpath, testName);
                string testExpectedOutputPath = TestHelper.GetExpectedOutputFolderPath(TestsSubpath, testName);
                string testActualOutputPath = TestHelper.GetActualOutputFolderPath(TestsSubpath, testName);

                CdmCorpusDefinition corpus = new CdmCorpusDefinition();
                corpus.SetEventCallback(new EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);
                corpus.Storage.Mount("localInput", new LocalAdapter(testInputPath));
                corpus.Storage.Mount("localExpectedOutput", new LocalAdapter(testExpectedOutputPath));
                corpus.Storage.Mount("localActualOutput", new LocalAdapter(testActualOutputPath));
                corpus.Storage.Mount("cdm", new LocalAdapter(SchemaDocsPath));
                corpus.Storage.DefaultNamespace = "localInput";

                CdmEntityDefinition srcEntityDef = await corpus.FetchObjectAsync<CdmEntityDefinition>($"localInput:/{sourceEntityName}.cdm.json/{sourceEntityName}") as CdmEntityDefinition;
                Assert.IsTrue(srcEntityDef != null);

                var resOpt = new ResolveOptions
                {
                    WrtDoc = srcEntityDef.InDocument,
                    Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { })
                };

                CdmFolderDefinition actualOutputFolder = await corpus.FetchObjectAsync<CdmFolderDefinition>("localActualOutput:/");
                CdmEntityDefinition resolvedEntityDef = null;
                string outputEntityFileName = string.Empty;
                string entityFileName = string.Empty;

                entityFileName = "default";
                resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { });
                outputEntityFileName = $"{sourceEntityName}_Resolved_{entityFileName}.cdm.json";
                resolvedEntityDef = await srcEntityDef.CreateResolvedEntityAsync(outputEntityFileName, resOpt, actualOutputFolder);
                if (await resolvedEntityDef.InDocument.SaveAsAsync(outputEntityFileName, true, new CopyOptions()))
                {
                    ValidateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
                }

                entityFileName = "referenceOnly";
                resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "referenceOnly" });
                outputEntityFileName = $"{sourceEntityName}_Resolved_{entityFileName}.cdm.json";
                resolvedEntityDef = await srcEntityDef.CreateResolvedEntityAsync(outputEntityFileName, resOpt, actualOutputFolder);
                if (await resolvedEntityDef.InDocument.SaveAsAsync(outputEntityFileName, true, new CopyOptions()))
                {
                    ValidateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
                }

                entityFileName = "normalized";
                resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized" });
                outputEntityFileName = $"{sourceEntityName}_Resolved_{entityFileName}.cdm.json";
                resolvedEntityDef = await srcEntityDef.CreateResolvedEntityAsync(outputEntityFileName, resOpt, actualOutputFolder);
                if (await resolvedEntityDef.InDocument.SaveAsAsync(outputEntityFileName, true, new CopyOptions()))
                {
                    ValidateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
                }

                entityFileName = "structured";
                resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "structured" });
                outputEntityFileName = $"{sourceEntityName}_Resolved_{entityFileName}.cdm.json";
                resolvedEntityDef = await srcEntityDef.CreateResolvedEntityAsync(outputEntityFileName, resOpt, actualOutputFolder);
                if (await resolvedEntityDef.InDocument.SaveAsAsync(outputEntityFileName, true, new CopyOptions()))
                {
                    ValidateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
                }

                entityFileName = "referenceOnly_normalized";
                resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "referenceOnly", "normalized" });
                outputEntityFileName = $"{sourceEntityName}_Resolved_{entityFileName}.cdm.json";
                resolvedEntityDef = await srcEntityDef.CreateResolvedEntityAsync(outputEntityFileName, resOpt, actualOutputFolder);
                if (await resolvedEntityDef.InDocument.SaveAsAsync(outputEntityFileName, true, new CopyOptions()))
                {
                    ValidateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
                }

                entityFileName = "referenceOnly_structured";
                resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "referenceOnly", "structured" });
                outputEntityFileName = $"{sourceEntityName}_Resolved_{entityFileName}.cdm.json";
                resolvedEntityDef = await srcEntityDef.CreateResolvedEntityAsync(outputEntityFileName, resOpt, actualOutputFolder);
                if (await resolvedEntityDef.InDocument.SaveAsAsync(outputEntityFileName, true, new CopyOptions()))
                {
                    ValidateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
                }

                entityFileName = "normalized_structured";
                resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "structured" });
                outputEntityFileName = $"{sourceEntityName}_Resolved_{entityFileName}.cdm.json";
                resolvedEntityDef = await srcEntityDef.CreateResolvedEntityAsync(outputEntityFileName, resOpt, actualOutputFolder);
                if (await resolvedEntityDef.InDocument.SaveAsAsync(outputEntityFileName, true, new CopyOptions()))
                {
                    ValidateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
                }

                entityFileName = "referenceOnly_normalized_structured";
                resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "referenceOnly", "normalized", "structured" });
                outputEntityFileName = $"{sourceEntityName}_Resolved_{entityFileName}.cdm.json";
                resolvedEntityDef = await srcEntityDef.CreateResolvedEntityAsync(outputEntityFileName, resOpt, actualOutputFolder);
                if (await resolvedEntityDef.InDocument.SaveAsAsync(outputEntityFileName, true, new CopyOptions()))
                {
                    ValidateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
                }
            }
            catch (Exception e)
            {
                Assert.Fail(e.Message);
            }
        }

        private static void ValidateOutput(string outputEntityFileName, string testExpectedOutputPath, string testActualOutputPath)
        {
            Assert.AreEqual(
                File.ReadAllText(Path.Combine(testExpectedOutputPath, outputEntityFileName)),
                File.ReadAllText(Path.Combine(testActualOutputPath, outputEntityFileName))
                );
        }
    }
}
