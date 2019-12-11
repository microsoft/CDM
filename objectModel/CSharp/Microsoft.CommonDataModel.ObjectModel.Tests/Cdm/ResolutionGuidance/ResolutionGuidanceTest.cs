namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
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
        private const string SchemaDocsPath = "../../../../../../CDM.SchemaDocuments";

        /// <summary>
        /// The test's data path.
        /// </summary>
        private static string testsSubpath = Path.Combine("Cdm", "ResolutionGuidance");

        [TestMethod]
        public async Task TestResolutionGuidanceCopy()
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
        /// Resolution Guidance Test 01 - Resolve entity by name
        /// </summary>
        [TestMethod]
        public async Task Test_01_ByEntityName()
        {
            string testName = "Test_01_ByEntityName";
            await RunTest(testName, "Sales");
        }

        /// <summary>
        /// Resolution Guidance Test 02 - Resolve entity by primarykey
        /// </summary>
        [TestMethod]
        public async Task Test_02_ByPrimaryKey()
        {
            string testName = "Test_02_ByPrimaryKey";
            await RunTest(testName, "Sales");
        }

        /// <summary>
        /// Resolution Guidance Test 03 - Empty ResolutionGuidance
        /// </summary>
        [TestMethod]
        public async Task Test_03_EmptyResolutionGuidance()
        {
            string testName = "Test_03_EmptyResolutionGuidance";
            await RunTest(testName, "Sales");
        }

        /// <summary>
        /// Resolution Guidance Test 04 - With RenameFormat property
        /// </summary>
        [TestMethod]
        public async Task Test_04_RenameFormat()
        {
            string testName = "Test_04_RenameFormat";
            await RunTest(testName, "Sales");
        }

        /// <summary>
        /// Resolution Guidance Test 05 - Empty EntityReference property
        /// </summary>
        [TestMethod]
        public async Task Test_05_EmptyEntityReference()
        {
            string testName = "Test_05_EmptyEntityReference";
            await RunTest(testName, "Sales");
        }

        /// <summary>
        /// Resolution Guidance Test 06 - With AllowReferences = true
        /// </summary>
        [TestMethod]
        public async Task Test_06_AllowReferencesTrue()
        {
            string testName = "Test_06_AllowReferencesTrue";
            await RunTest(testName, "Sales");
        }

        /// <summary>
        /// Resolution Guidance Test 07 - With AlwaysIncludeForeignKey = true
        /// </summary>
        [TestMethod]
        public async Task Test_07_AlwaysIncludeForeignKeyTrue()
        {
            string testName = "Test_07_AlwaysIncludeForeignKeyTrue";
            await RunTest(testName, "Sales");
        }

        /// <summary>
        /// Resolution Guidance Test 08 - With ForeignKeyAttribute property
        /// </summary>
        [TestMethod]
        public async Task Test_08_ForeignKeyAttribute()
        {
            string testName = "Test_08_ForeignKeyAttribute";
            await RunTest(testName, "Sales");
        }

        /// <summary>
        /// Resolution Guidance Test 09 - With Cardinality = "one"
        /// </summary>
        [TestMethod]
        public async Task Test_09_CardinalityOne()
        {
            string testName = "Test_09_CardinalityOne";
            await RunTest(testName, "Sales");
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
                string testInputPath = TestHelper.GetInputFolderPath(testsSubpath, testName);
                string testExpectedOutputPath = TestHelper.GetExpectedOutputFolderPath(testsSubpath, testName);
                string testActualOutputPath = TestHelper.GetActualOutputFolderPath(testsSubpath, testName);

                CdmCorpusDefinition corpus = new CdmCorpusDefinition();
                corpus.SetEventCallback(new Utilities.EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);
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

                CdmFolderDefinition actualOutputFolder = await corpus.FetchObjectAsync<CdmFolderDefinition>("localActualOutput:/") as CdmFolderDefinition;
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
