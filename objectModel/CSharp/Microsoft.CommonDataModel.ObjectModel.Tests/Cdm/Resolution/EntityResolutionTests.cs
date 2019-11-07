namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.Tools.Processor;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// Tests to verify if entity resolution is taking places as expected.
    /// </summary>
    [TestClass]
    public class EntityResolutionTests
    {
        /// <summary>
        /// The path of the SchemaDocs project.
        /// </summary>
        private const string SchemaDocsPath = "../../../../../../CDM.SchemaDocuments";

        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "Resolution", "EntityResolution");

        /// <summary>
        /// Whether debugging files should be written or not.
        /// </summary>
        private const bool doesWriteDebuggingFiles = TestHelper.DoesWriteTestDebuggingFiles;

        /// <summary>
        /// Test whether or not the test corpus can be resolved
        /// The input of this test is a manifest from SchemaDocs, so this test does not need any individual input files.
        /// This test does not check the output. Possibly because the schema docs change often.
        /// </summary>
        [TestMethod]
        public async Task TestResolveTestCorpus()
        {
            Assert.IsTrue(Directory.Exists(Path.GetFullPath(SchemaDocsPath)), "SchemaDocsRoot not found!!!");

            var cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.SetEventCallback(new EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);

            cdmCorpus.Storage.Mount("local", new LocalAdapter(SchemaDocsPath));
            var manifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("local:/standards.manifest.cdm.json") as CdmManifestDefinition;
            var directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "referenceOnly" });
            var allResolved = await ListAllResolved(cdmCorpus, directives, manifest, new StringSpewCatcher());
            Assert.IsTrue(!string.IsNullOrWhiteSpace(allResolved));
        }

        /// <summary>
        /// Test if the composite resolved entities match
        /// </summary>
        [TestMethod]
        public async Task TestResolvedComposites()
        {
            await this.ResolveSaveDebuggingFileAndAssert("TestResolvedComposites", "composites");
        }

        /// <summary>
        /// Test if the composite resolved entities match
        /// </summary>
        [TestMethod]
        public async Task TestResolvedE2E()
        {
            await this.ResolveSaveDebuggingFileAndAssert("TestResolvedE2E", "E2EResolution");
        }

        /// <summary>
        /// Test if the knowledge graph resolved entities match
        /// </summary>
        [TestMethod]
        public async Task TestResolvedKnowledgeGraph()
        {
            await this.ResolveSaveDebuggingFileAndAssert("TestResolvedKnowledgeGraph", "KnowledgeGraph");
        }

        /// <summary>
        /// Test if the mini dyn resolved entities match
        /// </summary>
        [TestMethod]
        public async Task TestResolvedMiniDyn()
        {
            await this.ResolveSaveDebuggingFileAndAssert("TestResolvedMiniDyn", "MiniDyn");
        }

        /// <summary>
        /// Test if the overrides resolved entities match
        /// </summary>
        [TestMethod]
        public async Task TestResolvedOverrides()
        {
            await this.ResolveSaveDebuggingFileAndAssert("TestResolvedOverrides", "overrides");
        }

        /// <summary>
        /// Test if the POVResolution resolved entities match
        /// </summary>
        [TestMethod]
        public async Task TestResolvedPov()
        {
            await this.ResolveSaveDebuggingFileAndAssert("TestResolvedPov", "POVResolution");
        }

        /// <summary>
        /// Test if the WebClicks resolved entities match
        /// </summary>
        [TestMethod]
        public async Task TestResolvedWebClicks()
        {
            await this.ResolveSaveDebuggingFileAndAssert("TestResolvedWebClicks", "webClicks");
        }

        /// <summary>
        /// Creates a storage adapter used to retrieve input files associated with test.
        /// </summary>
        /// <param name="testName">The name of the test we should retrieve input files for.</param>
        /// <returns>The storage adapter to be used by the named test method.</returns>
        private StorageAdapter CreateStorageAdapterConfigForTest(string testName)
        {
            return new LocalAdapter(TestHelper.GetInputFolderPath(this.testsSubpath, testName));
        }

        /// <summary>
        /// Function used to test resolving an environment.
        /// Writes a helper function used for debugging.
        /// Asserts the result matches the expected result stored in a file.
        /// </summary>
        /// <param name="testName">The name of the test. It is used to decide the path of input / output files.</param>
        /// <parameter name="manifestName">The name of the manifest to be used.</parameter>
        /// <returns>Task associated with this function.</returns>
        private async Task ResolveSaveDebuggingFileAndAssert(string testName, string manifestName)
        {
            Assert.IsNotNull(testName);
            var result = (await this.ResolveEnvironment(testName, manifestName));

            if (doesWriteDebuggingFiles)
            {
                TestHelper.WriteActualOutputFileContent(testsSubpath, testName, $"{manifestName}.txt", result);
            }

            var original = TestHelper.GetExpectedOutputFileContent(this.testsSubpath, testName, $"{manifestName}.txt");

            TestHelper.AssertFileContentEquality(original, result);
        }

        /// <summary>
        /// Resolve the entities in the given manifest.
        /// </summary>
        /// <param name="testName">The name of the test. It is used to decide the path of input / output files.</param>
        /// <parameter name="manifestName">The name of the manifest to be used.</parameter>
        /// <returns> The resolved entities. </returns>
        private async Task<string> ResolveEnvironment(string testName, string manifestName)
        {

            var cdmCorpus = new CdmCorpusDefinition();
            cdmCorpus.SetEventCallback(new EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);
            var testLocalAdapter = this.CreateStorageAdapterConfigForTest(testName);
            cdmCorpus.Storage.Mount("local", testLocalAdapter);

            var manifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>($"local:/{manifestName}.manifest.cdm.json");
            var directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "referenceOnly" });
            return await ListAllResolved(cdmCorpus, directives, manifest, new StringSpewCatcher());
        }

        /// <summary>
        /// Get the text version of all the resolved entities.
        /// </summary>
        /// <param name="cdmCorpus"> The CDM corpus. </param>
        /// <param name="directives"> The directives to use while getting the resolved entities. </param>
        /// <param name="manifest"> The manifest to be resolved. </param>
        /// <param name="spew"> The object used to store the text to be returned.</param>
        /// <returns> The text version of the resolved entities. (it's in a form that facilitates debugging) </returns>
        internal static async Task<string> ListAllResolved(CdmCorpusDefinition cdmCorpus, AttributeResolutionDirectiveSet directives, CdmManifestDefinition manifest, StringSpewCatcher spew = null)
        {
            var seen = new HashSet<string>();
            Func<CdmManifestDefinition, Task> seekEntities = null;
            seekEntities = async (CdmManifestDefinition f) =>
            {
                if (f.Entities != null)
                {
                    if (spew != null)
                        spew.SpewLine(f.FolderPath);
                    foreach (CdmEntityDeclarationDefinition entity in f.Entities)
                    {
                        string corpusPath;
                        CdmEntityDeclarationDefinition ent = entity;
                        CdmObject currentFile = f;
                        while (ent is CdmReferencedEntityDeclarationDefinition)
                        {
                            corpusPath = cdmCorpus.Storage.CreateAbsoluteCorpusPath(ent.EntityPath, currentFile);
                            ent = await cdmCorpus.FetchObjectAsync<CdmReferencedEntityDeclarationDefinition>(corpusPath);
                            currentFile = (CdmObject)ent;
                        }
                        corpusPath = cdmCorpus.Storage.CreateAbsoluteCorpusPath(((CdmLocalEntityDeclarationDefinition)ent).EntityPath, currentFile);
                        CdmEntityDefinition newEnt = await cdmCorpus.FetchObjectAsync<CdmEntityDefinition>(corpusPath);
                        ResolveOptions resOpt = new ResolveOptions() { WrtDoc = newEnt.InDocument, Directives = directives };
                        ResolvedEntity resEnt = new ResolvedEntity(resOpt, newEnt);
                        if (spew != null)
                            resEnt.Spew(resOpt, spew, " ", true);
                    }
                }
                if (f.SubManifests != null)
                {
                    // folder.SubManifests.ForEach(async f =>
                    foreach (CdmManifestDeclarationDefinition subManifest in f.SubManifests)
                    {
                        string corpusPath = cdmCorpus.Storage.CreateAbsoluteCorpusPath(subManifest.Definition, f);
                        await seekEntities(await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>(corpusPath));
                    }
                }
            };
            await seekEntities(manifest);
            if (spew != null)
                return spew.GetContent();
            return "";

        }
    }
}
