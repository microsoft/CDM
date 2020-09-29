// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.Tools.Processor;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    /// <summary>
    /// Tests to verify if entity resolution is taking places as expected.
    /// </summary>
    [TestClass]
    public class EntityResolutionTests
    {
        /// <summary>
        /// The path of the SchemaDocs project.
        /// </summary>
        private const string SchemaDocsPath = TestHelper.SchemaDocumentsPath;

        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "Resolution", "EntityResolution");

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
            var manifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>(TestHelper.CdmStandardSchemaPath) as CdmManifestDefinition;
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
        // [TestMethod]
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
        public async Task TestResolvedPovResolution()
        {
            await this.ResolveSaveDebuggingFileAndAssert("TestResolvedPOVResolution", "POVResolution");
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
        /// Test that monikered references on resolved entities can be resolved correctly, previously
        /// the inclusion of the resolvedFrom moniker stopped the source document from being found
        /// </summary>
        [TestMethod]
        public async Task TestResolveWithExtended()
        {
            CdmCorpusDefinition cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, "TestResolveWithExtended");

            cdmCorpus.SetEventCallback(new EventCallback { Invoke = (CdmStatusLevel statusLevel, string message) =>
            {
                if (message.Contains("unable to resolve the reference"))
                    Assert.Fail();
            }
            }, CdmStatusLevel.Warning);

            CdmEntityDefinition ent = await cdmCorpus.FetchObjectAsync<CdmEntityDefinition>("local:/sub/Account.cdm.json/Account");
            await ent.CreateResolvedEntityAsync("Account_");
        }

        /// <summary>
        /// Test that attributes with the same name are merged on resolve and that
        /// traits are merged and attribute contexts are mapped correctly
        /// </summary>
        [TestMethod]
        public async Task TestAttributesThatAreReplaced()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestAttributesThatAreReplaced");
            corpus.Storage.Mount("cdm", new LocalAdapter(TestHelper.SchemaDocumentsPath));

            CdmEntityDefinition extendedEntity = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/extended.cdm.json/extended");
            CdmEntityDefinition resExtendedEnt = await extendedEntity.CreateResolvedEntityAsync("resExtended");

            // the attribute from the base class should be merged with the attribute
            // from the extended class into a single attribute
            Assert.AreEqual(1, resExtendedEnt.Attributes.Count);

            // check that traits from the base class merged with the traits from the extended class
            CdmAttributeItem attribute = resExtendedEnt.Attributes[0];
            // base trait
            Assert.AreNotEqual(-1, attribute.AppliedTraits.IndexOf("means.identity.brand"));
            // extended trait
            Assert.AreNotEqual(-1, attribute.AppliedTraits.IndexOf("means.identity.company.name"));

            // make sure the attribute context and entity foreign key were maintained correctly
            CdmAttributeContext foreignKeyForBaseAttribute = ((resExtendedEnt.AttributeContext.Contents[1] as CdmAttributeContext).Contents[1] as CdmAttributeContext);
            Assert.AreEqual(foreignKeyForBaseAttribute.Name, "_generatedAttributeSet");

            CdmAttributeReference fkReference = ((foreignKeyForBaseAttribute.Contents[0] as CdmAttributeContext).Contents[0] as CdmAttributeContext).Contents[0] as CdmAttributeReference;
            Assert.AreEqual("resExtended/hasAttributes/regardingObjectId", fkReference.NamedReference);
        }

        /// <summary>
        /// Test that resolved attribute limit is calculated correctly and respected
        /// </summary>
        [TestMethod]
        public async Task TestResolvedAttributeLimit()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestResolvedAttributeLimit");

            CdmEntityDefinition mainEntity = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/mainEntity.cdm.json/mainEntity");
            ResolveOptions resOpt = new ResolveOptions { WrtDoc = mainEntity.InDocument, Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "referenceOnly" }) };

            // if attribute limit is reached, entity should be null
            resOpt.ResolvedAttributeLimit = 4;
            var resEnt = await mainEntity.CreateResolvedEntityAsync($"{mainEntity.EntityName}_zeroAtts", resOpt);
            Assert.IsNull(resEnt);

            // when the attribute limit is set to null, there should not be a limit on the possible number of attributes
            resOpt.ResolvedAttributeLimit = null;
            resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "referenceOnly" });
            var ras = mainEntity.FetchResolvedAttributes(resOpt);
            resEnt = await mainEntity.CreateResolvedEntityAsync($"{mainEntity.EntityName}_normalized_referenceOnly", resOpt);

            // there are 5 total attributes
            Assert.AreEqual(ras.ResolvedAttributeCount, 5);
            Assert.AreEqual(ras.Set.Count, 5);
            Assert.AreEqual(mainEntity.Attributes.Count, 3);
            // there are 2 attributes grouped in an entity attribute
            // and 2 attributes grouped in an attribute group
            Assert.AreEqual(((mainEntity.Attributes[2] as CdmAttributeGroupReference).ExplicitReference as CdmAttributeGroupDefinition).Members.Count, 2);

            // using the default limit number
            resOpt = new ResolveOptions { WrtDoc = mainEntity.InDocument, Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "referenceOnly" }) };
            ras = mainEntity.FetchResolvedAttributes(resOpt);
            resEnt = await mainEntity.CreateResolvedEntityAsync($"{mainEntity.EntityName}_normalized_referenceOnly", resOpt);

            // there are 5 total attributes
            Assert.AreEqual(ras.ResolvedAttributeCount, 5);
            Assert.AreEqual(ras.Set.Count, 5);
            Assert.AreEqual(mainEntity.Attributes.Count, 3);
            // there are 2 attributes grouped in an entity attribute
            // and 2 attributes grouped in an attribute group
            Assert.AreEqual(((mainEntity.Attributes[2] as CdmAttributeGroupReference).ExplicitReference as CdmAttributeGroupDefinition).Members.Count, 2);

            resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "structured" });
            ras = mainEntity.FetchResolvedAttributes(resOpt);
            resEnt = await mainEntity.CreateResolvedEntityAsync($"{mainEntity.EntityName}_normalized_structured", resOpt);

            // there are 5 total attributes
            Assert.AreEqual(ras.ResolvedAttributeCount, 5);
            // the attribute count is different because one attribute is a group that contains two different attributes
            Assert.AreEqual(ras.Set.Count, 4);
            Assert.AreEqual(mainEntity.Attributes.Count, 3);
            // again there are 2 attributes grouped in an entity attribute
            // and 2 attributes grouped in an attribute group
            Assert.AreEqual(((mainEntity.Attributes[2] as CdmAttributeGroupReference).ExplicitReference as CdmAttributeGroupDefinition).Members.Count, 2);
        }

        /// <summary>
        /// Test that "is.linkedEntity.name" and "is.linkedEntity.identifier" traits are set when "selectedTypeAttribute" and "foreignKeyAttribute"
        /// are present in the entity's resolution guidance.
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestSettingTraitsForResolutionGuidanceAttributes()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestSettingTraitsForResolutionGuidanceAttributes");
            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/Customer.cdm.json/Customer");

            // Resolve with default directives to get "is.linkedEntity.name" trait.
            ResolveOptions resOpt = new ResolveOptions { WrtDoc = entity.InDocument, Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "referenceOnly" }) };
            CdmEntityDefinition resolvedEntity = await entity.CreateResolvedEntityAsync("resolved", resOpt);

            Assert.AreEqual("is.linkedEntity.name", resolvedEntity.Attributes[1].AppliedTraits[7].NamedReference);

            // Resolve with referenceOnly directives to get "is.linkedEntity.identifier" trait.
            resOpt = new ResolveOptions { WrtDoc = entity.InDocument, Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "referenceOnly" }) };
            resolvedEntity = await entity.CreateResolvedEntityAsync("resolved2", resOpt);

            Assert.AreEqual("is.linkedEntity.identifier", resolvedEntity.Attributes[0].AppliedTraits[7].NamedReference);
        }

        /// <summary>
        /// Creates a storage adapter used to retrieve input files associated with test.
        /// </summary>
        /// <param name="testName">The name of the test we should retrieve input files for. </param>
        /// <returns>The storage adapter to be used by the named test method. </returns>
        private StorageAdapter CreateStorageAdapterConfigForTest(string testName)
        {
            return new LocalAdapter(TestHelper.GetInputFolderPath(this.testsSubpath, testName));
        }

        /// <summary>
        /// Function used to test resolving an environment.
        /// Writes a helper function used for debugging.
        /// Asserts the result matches the expected result stored in a file.
        /// </summary>
        /// <param name="testName">The name of the test. It is used to decide the path of input / output files. </param>
        /// <parameter name="manifestName">The name of the manifest to be used. </parameter>
        /// <parameter name="doesWriteDebuggingFiles">Whether debugging files should be written or not. </parameter>
        /// <returns>Task associated with this function. </returns>
        private async Task ResolveSaveDebuggingFileAndAssert(string testName, string manifestName, bool doesWriteDebuggingFiles = false)
        {
            Assert.IsNotNull(testName);
            var result = await this.ResolveEnvironment(testName, manifestName);

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
        /// <param name="testName">The name of the test. It is used to decide the path of input / output files. </param>
        /// <parameter name="manifestName">The name of the manifest to be used. </parameter>
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
        /// <param name="spew"> The object used to store the text to be returned. </param>
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
                    {
                        spew.SpewLine(f.FolderPath);
                    }

                    foreach (CdmEntityDeclarationDefinition entity in f.Entities)
                    {
                        string corpusPath;
                        CdmEntityDeclarationDefinition ent = entity;
                        CdmObject currentFile = f;
                        while (ent is CdmReferencedEntityDeclarationDefinition)
                        {
                            corpusPath = cdmCorpus.Storage.CreateAbsoluteCorpusPath(ent.EntityPath, currentFile);
                            ent = await cdmCorpus.FetchObjectAsync<CdmReferencedEntityDeclarationDefinition>(corpusPath);
                            currentFile = ent;
                        }
                        corpusPath = cdmCorpus.Storage.CreateAbsoluteCorpusPath(((CdmLocalEntityDeclarationDefinition)ent).EntityPath, currentFile);
                        ResolveOptions resOpt = new ResolveOptions()
                        {
                            ImportsLoadStrategy = ImportsLoadStrategy.Load
                        };
                        CdmEntityDefinition newEnt = await cdmCorpus.FetchObjectAsync<CdmEntityDefinition>(corpusPath, null, resOpt);
                        resOpt.WrtDoc = newEnt.InDocument;
                        resOpt.Directives = directives;
                        ResolvedEntity resEnt = new ResolvedEntity(resOpt, newEnt);
                        if (spew != null)
                        {
                            resEnt.Spew(resOpt, spew, " ", true);
                        }
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
