// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;

    [TestClass]
    public class RelationshipTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "Relationship");

        /// <summary>
        /// Testing calculation of relationships and that those relationships are
        /// properly added to manifest objects
        /// </summary>
        [TestMethod]
        public async Task TestCalculateRelationshipsAndPopulateManifests()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestCalculateRelationshipsAndPopulateManifests");

            var rootManifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/default.manifest.cdm.json");
            var subManifest = await corpus.FetchObjectAsync<CdmManifestDefinition>(rootManifest.SubManifests[0].Definition);

            await corpus.CalculateEntityGraphAsync(rootManifest);
            await rootManifest.PopulateManifestRelationshipsAsync();

            var expectedAllManifestRels = JToken.Parse(TestHelper.GetExpectedOutputFileContent(testsSubpath, "TestCalculateRelationshipsAndPopulateManifests", "expectedAllManifestRels.json")).ToObject<List<E2ERelationship>>();
            var expectedAllSubManifestRels = JToken.Parse(TestHelper.GetExpectedOutputFileContent(testsSubpath, "TestCalculateRelationshipsAndPopulateManifests", "expectedAllSubManifestRels.json")).ToObject<List<E2ERelationship>>();

            // check that each relationship has been created correctly
            VerifyRelationships(rootManifest, expectedAllManifestRels);
            VerifyRelationships(subManifest, expectedAllSubManifestRels);
        }

        /// <summary>
        /// Testing calculation of relationships and that those relationships are
        /// properly added to manifest objects setting the populate flag to Exclusive
        /// </summary>
        [TestMethod]
        public async Task TestCalculateRelationshipsAndPopulateManifestsWithExclusiveFlag()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestCalculateRelationshipsAndPopulateManifests");

            var rootManifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/default.manifest.cdm.json");
            var subManifest = await corpus.FetchObjectAsync<CdmManifestDefinition>(rootManifest.SubManifests[0].Definition);

            await corpus.CalculateEntityGraphAsync(rootManifest);
            // make sure only relationships where to and from entities are in the manifest are found with the "exclusive" option is passed in
            await rootManifest.PopulateManifestRelationshipsAsync(CdmRelationshipDiscoveryStyle.Exclusive);

            var expectedExclusiveManifestRels = JToken.Parse(TestHelper.GetExpectedOutputFileContent(testsSubpath, "TestCalculateRelationshipsAndPopulateManifests", "expectedExclusiveManifestRels.json")).ToObject<List<E2ERelationship>>();
            var expectedExclusiveSubManifestRels = JToken.Parse(TestHelper.GetExpectedOutputFileContent(testsSubpath, "TestCalculateRelationshipsAndPopulateManifests", "expectedExclusiveSubManifestRels.json")).ToObject<List<E2ERelationship>>();

            // check that each relationship has been created correctly
            VerifyRelationships(rootManifest, expectedExclusiveManifestRels);
            VerifyRelationships(subManifest, expectedExclusiveSubManifestRels);
        }

        /// <summary>
        /// Testing calculation of relationships and that those relationships are
        /// properly added to manifest objects setting the populate flag to None
        /// </summary>
        [TestMethod]
        public async Task TestCalculateRelationshipsAndPopulateManifestsWithNoneFlag()
        {
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestCalculateRelationshipsAndPopulateManifests", null);

            var rootManifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/default.manifest.cdm.json");
            var subManifest = await corpus.FetchObjectAsync<CdmManifestDefinition>(rootManifest.SubManifests[0].Definition);

            await corpus.CalculateEntityGraphAsync(rootManifest);
            // make sure no relationships are added when "none" relationship option is passed in
            await rootManifest.PopulateManifestRelationshipsAsync(CdmRelationshipDiscoveryStyle.None);

            Assert.AreEqual(0, rootManifest.Relationships.Count);
            Assert.AreEqual(0, subManifest.Relationships.Count);
        }

        /// <summary>
        /// Testing calculation of relationships and that those relationships are
        /// properly added to manifest objects
        /// </summary>
        [TestMethod]
        public async Task TestCalculateRelationshipsOnResolvedEntities()
        {
            var expectedResolvedManifestRels = JToken.Parse(TestHelper.GetExpectedOutputFileContent(testsSubpath, "TestCalculateRelationshipsOnResolvedEntities", "expectedResolvedManifestRels.json")).ToObject<List<E2ERelationship>>();
            var expectedResolvedSubManifestRels = JToken.Parse(TestHelper.GetExpectedOutputFileContent(testsSubpath, "TestCalculateRelationshipsOnResolvedEntities", "expectedResolvedSubManifestRels.json")).ToObject<List<E2ERelationship>>();
            var expectedResolvedExcManifestRels = JToken.Parse(TestHelper.GetExpectedOutputFileContent(testsSubpath, "TestCalculateRelationshipsOnResolvedEntities", "expectedResolvedExcManifestRels.json")).ToObject<List<E2ERelationship>>();
            var expectedResolvedExcSubManifestRels = JToken.Parse(TestHelper.GetExpectedOutputFileContent(testsSubpath, "TestCalculateRelationshipsOnResolvedEntities", "expectedResolvedExcSubManifestRels.json")).ToObject<List<E2ERelationship>>();

            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestCalculateRelationshipsOnResolvedEntities");

            var rootManifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/default.manifest.cdm.json");

            var resolvedManifest = await LoadAndResolveManifest(corpus, rootManifest, "-resolved");
            string subManifestPath = corpus.Storage.CreateAbsoluteCorpusPath(resolvedManifest.SubManifests[0].Definition);
            CdmManifestDefinition subManifest = await corpus.FetchObjectAsync<CdmManifestDefinition>(subManifestPath) as CdmManifestDefinition;

            // using createResolvedManifest will only populate exclusive relationships
            VerifyRelationships(resolvedManifest, expectedResolvedExcManifestRels);
            VerifyRelationships(subManifest, expectedResolvedExcSubManifestRels);

            // check that each relationship has been created correctly with the all flag
            await resolvedManifest.PopulateManifestRelationshipsAsync();
            await subManifest.PopulateManifestRelationshipsAsync();
            VerifyRelationships(resolvedManifest, expectedResolvedManifestRels);
            VerifyRelationships(subManifest, expectedResolvedSubManifestRels);

            // it is not enough to check if the relationships are correct.
            // We need to check if the incoming and outgoing relationships are
            // correct as well. One being correct can cover up the other being wrong

            // A
            var aEnt = await corpus.FetchObjectAsync<CdmEntityDefinition>(resolvedManifest.Entities[0].EntityPath, resolvedManifest);
            var aInRels = corpus.FetchIncomingRelationships(aEnt);
            var aOutRels = corpus.FetchOutgoingRelationships(aEnt);
            Assert.AreEqual(0, aInRels.Count);
            Assert.AreEqual(1, aOutRels.Count);
            Assert.AreEqual("local:/A-resolved.cdm.json/A", aOutRels[0].FromEntity);
            Assert.AreEqual("local:/B-resolved.cdm.json/B", aOutRels[0].ToEntity);

            // B
            var bEnt = await corpus.FetchObjectAsync<CdmEntityDefinition>(resolvedManifest.Entities[1].EntityPath, resolvedManifest);
            var bInRels = corpus.FetchIncomingRelationships(bEnt);
            var bOutRels = corpus.FetchOutgoingRelationships(bEnt);
            Assert.AreEqual(2, bInRels.Count);
            Assert.AreEqual("local:/A-resolved.cdm.json/A", bInRels[0].FromEntity);
            Assert.AreEqual("local:/B-resolved.cdm.json/B", bInRels[0].ToEntity);
            Assert.AreEqual("local:/sub/C-resolved.cdm.json/C", bInRels[1].FromEntity);
            Assert.AreEqual("local:/B-resolved.cdm.json/B", bInRels[1].ToEntity);
            Assert.AreEqual(0, bOutRels.Count);

            // C
            var cEnt = await corpus.FetchObjectAsync<CdmEntityDefinition>(subManifest.Entities[0].EntityPath, subManifest);
            var cInRels = corpus.FetchIncomingRelationships(cEnt);
            var cOutRels = corpus.FetchOutgoingRelationships(cEnt);
            Assert.AreEqual(0, cInRels.Count);
            Assert.AreEqual(2, cOutRels.Count);
            Assert.AreEqual("local:/sub/C-resolved.cdm.json/C", cOutRels[0].FromEntity);
            Assert.AreEqual("local:/B-resolved.cdm.json/B", cOutRels[0].ToEntity);
            Assert.AreEqual("local:/sub/C-resolved.cdm.json/C", cOutRels[1].FromEntity);
            Assert.AreEqual("local:/sub/D-resolved.cdm.json/D", cOutRels[1].ToEntity);

            // D
            var dEnt = await corpus.FetchObjectAsync<CdmEntityDefinition>(subManifest.Entities[1].EntityPath, subManifest);
            var dInRels = corpus.FetchIncomingRelationships(dEnt);
            var dOutRels = corpus.FetchOutgoingRelationships(dEnt);
            Assert.AreEqual(1, dInRels.Count);
            Assert.AreEqual("local:/sub/C-resolved.cdm.json/C", dInRels[0].FromEntity);
            Assert.AreEqual("local:/sub/D-resolved.cdm.json/D", dInRels[0].ToEntity);
            Assert.AreEqual(0, dOutRels.Count);

            // E
            var eEnt = await corpus.FetchObjectAsync<CdmEntityDefinition>(resolvedManifest.Entities[2].EntityPath, resolvedManifest);
            var eInRels = corpus.FetchIncomingRelationships(eEnt);
            var eOutRels = corpus.FetchOutgoingRelationships(eEnt);
            Assert.AreEqual(1, eInRels.Count);
            Assert.AreEqual(0, eOutRels.Count);
            Assert.AreEqual("local:/sub/F-resolved.cdm.json/F", eInRels[0].FromEntity);
            Assert.AreEqual("local:/E-resolved.cdm.json/E", eInRels[0].ToEntity);

            // F
            var fEnt = await corpus.FetchObjectAsync<CdmEntityDefinition>(subManifest.Entities[2].EntityPath, subManifest);
            var fInRels = corpus.FetchIncomingRelationships(fEnt);
            var fOutRels = corpus.FetchOutgoingRelationships(fEnt);
            Assert.AreEqual(0, fInRels.Count);
            Assert.AreEqual(1, fOutRels.Count);
            Assert.AreEqual("local:/sub/F-resolved.cdm.json/F", fOutRels[0].FromEntity);
            Assert.AreEqual("local:/E-resolved.cdm.json/E", fOutRels[0].ToEntity);
        }

        /// <summary>
        /// Testing calculating relationships for the special kind of attribute that uses the "select one" directive
        /// </summary>
        [TestMethod]
        public async Task TestCalculateRelationshipsForSelectsOneAttribute()
        {
            var expectedRels = JToken.Parse(TestHelper.GetExpectedOutputFileContent(testsSubpath, "TestCalculateRelationshipsForSelectsOneAttribute", "expectedRels.json")).ToObject<List<E2ERelationship>>();
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestCalculateRelationshipsForSelectsOneAttribute");

            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/selectsOne.manifest.cdm.json");

            await corpus.CalculateEntityGraphAsync(manifest);
            await manifest.PopulateManifestRelationshipsAsync();

            // check that each relationship has been created correctly
            VerifyRelationships(manifest, expectedRels);
        }

        /// <summary>
        /// Test the relationship calculation when using a replace as foreign key operation while extending an entity.
        /// </summary>
        [TestMethod]
        public async Task TestExtendsEntityAndReplaceAsForeignKey()
        {
            var testName = "TestExtendsEntityAndReplaceAsForeignKey";
            var expectedLogCodes = new HashSet<CdmLogCode> { CdmLogCode.WarnProjFKWithoutSourceEntity };
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, testName, expectedCodes: expectedLogCodes);

            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/default.manifest.cdm.json");

            await corpus.CalculateEntityGraphAsync(manifest);
            // Check if the warning was logged.
            TestHelper.AssertCdmLogCodeEquality(corpus, CdmLogCode.WarnProjFKWithoutSourceEntity, true);

            await manifest.PopulateManifestRelationshipsAsync();
            Assert.AreEqual(0, manifest.Relationships.Count);
        }

        /// <summary>
        /// Test relationships are generated correctly when the document name and entity name do not match
        /// </summary>
        [TestMethod]
        public async Task TestRelationshipsEntityAndDocumentNameDifferent()
        {
            var expectedRels = JToken.Parse(TestHelper.GetExpectedOutputFileContent(testsSubpath, "TestRelationshipsEntityAndDocumentNameDifferent", "expectedRels.json")).ToObject<List<E2ERelationship>>();
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestRelationshipsEntityAndDocumentNameDifferent");

            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/main.manifest.cdm.json");

            await corpus.CalculateEntityGraphAsync(manifest);
            await manifest.PopulateManifestRelationshipsAsync();

            // check that each relationship has been created correctly
            VerifyRelationships(manifest, expectedRels);
        }

        /// <summary>
        /// Test that multiple relationships are generated when there are references to multiple entities
        /// </summary>
        [TestMethod]
        public async Task TestRelationshipToMultipleEntities()
        {
            var expectedRels = JToken.Parse(TestHelper.GetExpectedOutputFileContent(testsSubpath, "TestRelationshipToMultipleEntities", "expectedRels.json")).ToObject<List<E2ERelationship>>();
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestRelationshipToMultipleEntities");

            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/main.manifest.cdm.json");

            await corpus.CalculateEntityGraphAsync(manifest);
            await manifest.PopulateManifestRelationshipsAsync();

            // check that each relationship has been created correctly
            VerifyRelationships(manifest, expectedRels);
        }

        /// <summary>
        /// Test that relationships between entities in different namespaces are created correctly
        /// </summary>
        [TestMethod]
        public async Task TestRelationshipToDifferentNamespace()
        {
            var expectedRels = JToken.Parse(TestHelper.GetExpectedOutputFileContent(testsSubpath, "TestRelationshipToDifferentNamespace", "expectedRels.json")).ToObject<List<E2ERelationship>>();
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestRelationshipToDifferentNamespace");

            // entity B will be in a different namespace
            corpus.Storage.Mount("differentNamespace", new LocalAdapter($"{TestHelper.GetInputFolderPath(testsSubpath, "TestRelationshipToDifferentNamespace")}\\differentNamespace"));

            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/main.manifest.cdm.json");

            await corpus.CalculateEntityGraphAsync(manifest);
            await manifest.PopulateManifestRelationshipsAsync();

            // check that each relationship has been created correctly
            VerifyRelationships(manifest, expectedRels);
        }

        /// <summary>
        /// Test that relationships pointing from a manifest to an entity in a submanifest create correct paths
        /// </summary>
        [TestMethod]
        public async Task TestRelationshipPointingToSubManifest()
        {
            var expectedRels = JToken.Parse(TestHelper.GetExpectedOutputFileContent(testsSubpath, "TestRelationshipPointingToSubManifest", "expectedRels.json")).ToObject<List<E2ERelationship>>();
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestRelationshipPointingToSubManifest");

            var manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/main.manifest.cdm.json");

            await corpus.CalculateEntityGraphAsync(manifest);
            await manifest.PopulateManifestRelationshipsAsync();

            // check that each relationship has been created correctly
            VerifyRelationships(manifest, expectedRels);
        }

        /// <summary>
        ///  Test that ensures relationships are updated correctly after entities are changed
        /// </summary>
        [TestMethod]
        public async Task TestUpdateRelationships()
        {
            var expectedRels = JToken.Parse(TestHelper.GetExpectedOutputFileContent(testsSubpath, "TestUpdateRelationships", "expectedRels.json")).ToObject<List<E2ERelationship>>();
            string tempFromFilePath = "fromEntTemp.cdm.json";
            string tempFromEntityPath = "local:/fromEntTemp.cdm.json/fromEnt";
            string tempToEntityPath = "local:/toEnt.cdm.json/toEnt";

            // Initialize corpus and entity files
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestUpdateRelationships");
            CdmManifestDefinition manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/main.manifest.cdm.json");
            CdmManifestDefinition manifestNoToEnt = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/mainNoToEnt.manifest.cdm.json");
            CdmEntityDefinition fromEnt = await corpus.FetchObjectAsync<CdmEntityDefinition>("local:/fromEnt.cdm.json/fromEnt");
            await fromEnt.InDocument.SaveAsAsync(tempFromFilePath, options: new CopyOptions() { SaveConfigFile = false });

            async Task reloadFromEntity()
            {
                await fromEnt.InDocument.SaveAsAsync(tempFromFilePath, options: new CopyOptions() { SaveConfigFile = false });
                // fetch again to reset the cache
                await corpus.FetchObjectAsync<CdmEntityDefinition>(tempFromEntityPath, null, false, true);
            }

            try
            {
                // 1. test when entity attribute is removed
                await corpus.CalculateEntityGraphAsync(manifest);
                await manifest.PopulateManifestRelationshipsAsync();

                // check that the relationship has been created correctly
                VerifyRelationships(manifest, expectedRels);

                // now remove the entity attribute, which removes the relationship
                CdmAttributeItem removedAttribute = fromEnt.Attributes[0];
                fromEnt.Attributes.RemoveAt(0);
                await reloadFromEntity();

                await corpus.CalculateEntityGraphAsync(manifest);
                await manifest.PopulateManifestRelationshipsAsync();

                // check that the relationship has been removed
                VerifyRelationships(manifest, new List<E2ERelationship>());

                // 2. test when the to entity is removed
                // restore the entity to the original state
                fromEnt.Attributes.Add(removedAttribute);
                await reloadFromEntity();

                await corpus.CalculateEntityGraphAsync(manifest);
                await manifest.PopulateManifestRelationshipsAsync();

                // check that the relationship has been created correctly
                VerifyRelationships(manifest, expectedRels);

                // remove the to entity
                fromEnt.Attributes.RemoveAt(0);
                await reloadFromEntity();
                // fetch again to reset the cache
                await corpus.FetchObjectAsync<CdmEntityDefinition>(tempToEntityPath, null, false, true);

                await corpus.CalculateEntityGraphAsync(manifestNoToEnt);
                await manifestNoToEnt.PopulateManifestRelationshipsAsync();

                // check that the relationship has been removed
                VerifyRelationships(manifestNoToEnt, new List<E2ERelationship>());
            }
            finally
            {
                // clean up created files created
                string fromPath = corpus.Storage.CorpusPathToAdapterPath($"local:/{tempFromFilePath}");
                File.Delete(fromPath);
            }
        }

        private static void VerifyRelationships(CdmManifestDefinition manifest, List<E2ERelationship> expectedRelationships)
        {
            Assert.AreEqual(manifest.Relationships.Count, expectedRelationships.Count);

            foreach (E2ERelationship expectedRel in expectedRelationships)
            {
                List<CdmE2ERelationship> found = manifest.Relationships.Where(x =>
                x.FromEntity == expectedRel.FromEntity
                && x.FromEntityAttribute == expectedRel.FromEntityAttribute
                && x.ToEntity == expectedRel.ToEntity
                && x.ToEntityAttribute == expectedRel.ToEntityAttribute
                ).ToList();
                Assert.AreEqual(1, found.Count);
            }
        }

        private async static Task<CdmManifestDefinition> LoadAndResolveManifest(CdmCorpusDefinition corpus, CdmManifestDefinition manifest, string renameSuffix)
        {
            Console.WriteLine("Resolving manifest " + manifest.ManifestName + " ...");
            CdmManifestDefinition resolvedManifest = await manifest.CreateResolvedManifestAsync(manifest.ManifestName + renameSuffix, "{n}-resolved.cdm.json");

            foreach (CdmManifestDeclarationDefinition subManifestDecl in manifest.SubManifests)
            {
                CdmManifestDefinition subManifest = await corpus.FetchObjectAsync<CdmManifestDefinition>(subManifestDecl.Definition, manifest);
                CdmManifestDefinition resolvedSubManifest = await LoadAndResolveManifest(corpus, subManifest, renameSuffix);

                CdmManifestDeclarationDefinition resolvedDecl = corpus.MakeObject<CdmManifestDeclarationDefinition>(CdmObjectType.ManifestDeclarationDef, resolvedSubManifest.ManifestName);
                resolvedDecl.Definition = corpus.Storage.CreateRelativeCorpusPath(resolvedSubManifest.AtCorpusPath, resolvedManifest);

                resolvedManifest.SubManifests.Add(resolvedDecl);
            }

            return resolvedManifest;
        }
    }
}
