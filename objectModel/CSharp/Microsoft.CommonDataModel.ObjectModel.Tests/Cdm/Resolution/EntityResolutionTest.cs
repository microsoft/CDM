// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.Projection;
    using Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.Resolution;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.Tools.Processor;
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    /// <summary>
    /// Tests to verify if entity resolution performs as expected.
    /// </summary>
    [TestClass]
    public class EntityResolutionTest
    {
        /// <summary>
        /// The path of the SchemaDocs project.
        /// </summary>
        private const string SchemaDocsPath = TestHelper.SchemaDocumentsPath;

        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "Resolution", "EntityResolutionTest");

        /// <summary>
        /// Tests if the owner of the entity is not changed when calling CreatedResolvedEntityAsync
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestOwnerNotChanged()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestOwnerNotChanged");

            var entity = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/Entity.cdm.json/Entity");
            var document = await corpus.FetchObjectAsync<CdmDocumentDefinition>("local:/Entity.cdm.json");

            Assert.AreEqual(document, entity.Owner);

            await entity.CreateResolvedEntityAsync("res-Entity");

            Assert.AreEqual(document, entity.Owner);
            Assert.AreEqual(entity, entity.Attributes[0].Owner, "Entity's attribute's owner should have remained unchanged (same as the owning entity)");
        }

        /// <summary>
        /// Test that entity references that do not point to valid entities are reported as an error instead of triggering an exception
        /// </summary>
        [TestMethod]
        public async Task TestEntRefNonexistent()
        {
            var expectedCodes = new HashSet<CdmLogCode> { CdmLogCode.WarnResolveObjectFailed, CdmLogCode.ErrResolveReferenceFailure };
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestEntRefNonexistent", expectedCodes: expectedCodes);
            var folder = corpus.Storage.NamespaceFolders["local"];
            var doc = new CdmDocumentDefinition(corpus.Ctx, "someDoc.cdm.json");
            folder.Documents.Add(doc);
            var entity = new CdmEntityDefinition(corpus.Ctx, "someEntity");
            var entAtt = new CdmEntityAttributeDefinition(corpus.Ctx, "entityAtt");
            entAtt.Entity = new CdmEntityReference(corpus.Ctx, "nonExistingEntity", true);
            entity.Attributes.Add(entAtt);
            doc.Definitions.Add(entity);

            var resolvedEnt = await entity.CreateResolvedEntityAsync("resolvedSomeEntity");
            Assert.IsNotNull(resolvedEnt);
        }

        /// <summary>
        /// Tests that resolution runs correctly when resolving a resolved entity
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestResolvingResolvedEntity()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestResolvingResolvedEntity");
            var entity = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/Entity.cdm.json/Entity");

            var resEntity = await entity.CreateResolvedEntityAsync("resEntity");
            var resResEntity = await resEntity.CreateResolvedEntityAsync("resResEntity");
            Assert.IsNotNull(resResEntity);
            Assert.AreEqual(1, resResEntity.ExhibitsTraits.Count);
            Assert.AreEqual("has.entitySchemaAbstractionLevel", resResEntity.ExhibitsTraits[0].NamedReference);
            Assert.AreEqual(1, ((CdmTraitReference)resResEntity.ExhibitsTraits[0]).Arguments.Count);
            Assert.AreEqual("resolved", ((CdmTraitReference)resResEntity.ExhibitsTraits[0]).Arguments[0].Value);
        }

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
            var allResolved = await ResolutionTestUtils.ListAllResolved(cdmCorpus, directives, manifest, new StringSpewCatcher());
            Assert.IsTrue(!string.IsNullOrWhiteSpace(allResolved));
        }

        /// <summary>
        /// Test if the composite resolved entities match
        /// </summary>
        [TestMethod]
        public async Task TestResolvedComposites()
        {
            await ResolutionTestUtils.ResolveSaveDebuggingFileAndAssert(testsSubpath, "TestResolvedComposites", "composites");
        }

        /// <summary>
        /// Test if the composite resolved entities match
        /// </summary>
        [TestMethod]
        public async Task TestResolvedE2E()
        {
            await ResolutionTestUtils.ResolveSaveDebuggingFileAndAssert(testsSubpath, "TestResolvedE2E", "E2EResolution");
        }

        /// <summary>
        /// Test if the knowledge graph resolved entities match
        /// </summary>
        [TestMethod]
        public async Task TestResolvedKnowledgeGraph()
        {
            await ResolutionTestUtils.ResolveSaveDebuggingFileAndAssert(testsSubpath, "TestResolvedKnowledgeGraph", "KnowledgeGraph");
        }

        /// <summary>
        /// Test if the mini dyn resolved entities match
        /// </summary>
        // [TestMethod]
        public async Task TestResolvedMiniDyn()
        {
            await ResolutionTestUtils.ResolveSaveDebuggingFileAndAssert(testsSubpath, "TestResolvedMiniDyn", "MiniDyn");
        }

        /// <summary>
        /// Test if the overrides resolved entities match
        /// </summary>
        [TestMethod]
        public async Task TestResolvedOverrides()
        {
            await ResolutionTestUtils.ResolveSaveDebuggingFileAndAssert(testsSubpath, "TestResolvedOverrides", "overrides");
        }

        /// <summary>
        /// Test if the POVResolution resolved entities match
        /// </summary>
        [TestMethod]
        public async Task TestResolvedPovResolution()
        {
            await ResolutionTestUtils.ResolveSaveDebuggingFileAndAssert(testsSubpath, "TestResolvedPOVResolution", "POVResolution");
        }

        /// <summary>
        /// Test if the WebClicks resolved entities match
        /// </summary>
        [TestMethod]
        public async Task TestResolvedWebClicks()
        {
            await ResolutionTestUtils.ResolveSaveDebuggingFileAndAssert(testsSubpath, "TestResolvedWebClicks", "webClicks");
        }

        /// <summary>
        /// Test that monikered references on resolved entities can be resolved correctly, previously
        /// the inclusion of the resolvedFrom moniker stopped the source document from being found
        /// </summary>
        [TestMethod]
        public async Task TestResolveWithExtended()
        {
            CdmCorpusDefinition cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, "TestResolveWithExtended");

            cdmCorpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
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
            var expectedLogCodes = new HashSet<CdmLogCode> { CdmLogCode.ErrRelMaxResolvedAttrReached };
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestResolvedAttributeLimit", expectedCodes: expectedLogCodes);

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

            Assert.IsNotNull(resolvedEntity.Attributes[1].AppliedTraits.Item("is.linkedEntity.name"));

            // Resolve with referenceOnly directives to get "is.linkedEntity.identifier" trait.
            resOpt = new ResolveOptions { WrtDoc = entity.InDocument, Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "referenceOnly" }) };
            resolvedEntity = await entity.CreateResolvedEntityAsync("resolved2", resOpt);

            Assert.IsNotNull(resolvedEntity.Attributes[0].AppliedTraits.Item("is.linkedEntity.identifier"));
        }

        /// <summary>
        /// Test that traits(including the ones inside of dataTypeRefence and PurposeReference) are applied to an entity attribute and type attribute.
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestAppliedTraitsInAttributes()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestAppliedTraitsInAttributes");
            string expectedOutputFolder = TestHelper.GetExpectedOutputFolderPath(testsSubpath, "TestAppliedTraitsInAttributes");
            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/Sales.cdm.json/Sales");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "referenceOnly" });

            await AttributeContextUtil.ValidateAttributeContext(expectedOutputFolder, "Sales", resolvedEntity);
        }
    }
}
