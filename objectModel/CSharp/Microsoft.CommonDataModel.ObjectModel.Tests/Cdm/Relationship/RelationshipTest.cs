namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.Tools.Processor;
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
            var testInputPath = TestHelper.GetInputFolderPath(testsSubpath, "TestCalculateRelationshipsAndPopulateManifests");

            var expectedAllManifestRels = JToken.Parse(TestHelper.GetExpectedOutputFileContent(testsSubpath, "TestCalculateRelationshipsAndPopulateManifests", "expectedAllManifestRels.json")).ToObject<List<E2ERelationship>>();
            var expectedAllSubManifestRels = JToken.Parse(TestHelper.GetExpectedOutputFileContent(testsSubpath, "TestCalculateRelationshipsAndPopulateManifests", "expectedAllSubManifestRels.json")).ToObject<List<E2ERelationship>>();

            var expectedExclusiveManifestRels = JToken.Parse(TestHelper.GetExpectedOutputFileContent(testsSubpath, "TestCalculateRelationshipsAndPopulateManifests", "expectedExclusiveManifestRels.json")).ToObject<List<E2ERelationship>>();
            var expectedExclusiveSubManifestRels = JToken.Parse(TestHelper.GetExpectedOutputFileContent(testsSubpath, "TestCalculateRelationshipsAndPopulateManifests", "expectedExclusiveSubManifestRels.json")).ToObject<List<E2ERelationship>>();

            CdmCorpusDefinition corpus = new CdmCorpusDefinition();
            corpus.SetEventCallback(new Utilities.EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);
            corpus.Storage.Mount("local", new LocalAdapter(testInputPath));

            corpus.Storage.DefaultNamespace = "local";

            CdmManifestDefinition rootManifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/default.manifest.cdm.json");
            string subManifestPath = corpus.Storage.CreateAbsoluteCorpusPath(rootManifest.SubManifests[0].Definition);
            CdmManifestDefinition subManifest = await corpus.FetchObjectAsync<CdmManifestDefinition>(subManifestPath) as CdmManifestDefinition;

            await corpus.CalculateEntityGraphAsync(rootManifest);
            await rootManifest.PopulateManifestRelationshipsAsync();

            Assert.AreEqual(rootManifest.Relationships.Count, 5);
            Assert.AreEqual(subManifest.Relationships.Count, 7);

            // check that each relationship has been created correctly
            foreach (E2ERelationship expectedRel in expectedAllManifestRels)
            {
                List<CdmE2ERelationship> found = rootManifest.Relationships.Where(x =>
                x.FromEntity == expectedRel.FromEntity
                && x.FromEntityAttribute == expectedRel.FromEntityAttribute
                && x.ToEntity == expectedRel.ToEntity
                && x.ToEntityAttribute == expectedRel.ToEntityAttribute
                ).ToList();
                Assert.AreEqual(found.Count, 1);
            }

            foreach (E2ERelationship expectedSubRel in expectedAllSubManifestRels)
            {
                List<CdmE2ERelationship> found = subManifest.Relationships.Where(x =>
                x.FromEntity == expectedSubRel.FromEntity
                && x.FromEntityAttribute == expectedSubRel.FromEntityAttribute
                && x.ToEntity == expectedSubRel.ToEntity
                && x.ToEntityAttribute == expectedSubRel.ToEntityAttribute
                ).ToList();
                Assert.AreEqual(found.Count, 1);
            }

            // make sure only relationships where to and from entities are in the manifest are found with the "exclusive" option is passed in
            await rootManifest.PopulateManifestRelationshipsAsync(CdmRelationshipDiscoveryStyle.Exclusive);

            Assert.AreEqual(rootManifest.Relationships.Count, 3);
            Assert.AreEqual(subManifest.Relationships.Count, 3);

            // check that each relationship has been created correctly
            foreach (E2ERelationship expectedRel in expectedExclusiveManifestRels)
            {
                List<CdmE2ERelationship> found = rootManifest.Relationships.Where(x =>
                x.FromEntity == expectedRel.FromEntity
                && x.FromEntityAttribute == expectedRel.FromEntityAttribute
                && x.ToEntity == expectedRel.ToEntity
                && x.ToEntityAttribute == expectedRel.ToEntityAttribute
                ).ToList();
                Assert.AreEqual(found.Count, 1);
            }

            foreach (E2ERelationship expectedSubRel in expectedExclusiveSubManifestRels)
            {
                List<CdmE2ERelationship> found = subManifest.Relationships.Where(x =>
                x.FromEntity == expectedSubRel.FromEntity
                && x.FromEntityAttribute == expectedSubRel.FromEntityAttribute
                && x.ToEntity == expectedSubRel.ToEntity
                && x.ToEntityAttribute == expectedSubRel.ToEntityAttribute
                ).ToList();
                Assert.AreEqual(found.Count, 1);
            }

            // make sure no relationships are added when "none" relationship option is passed in
            await rootManifest.PopulateManifestRelationshipsAsync(CdmRelationshipDiscoveryStyle.None);

            Assert.AreEqual(rootManifest.Relationships.Count, 0);
            Assert.AreEqual(subManifest.Relationships.Count, 0);
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

            var testInputPath = TestHelper.GetInputFolderPath(testsSubpath, "TestCalculateRelationshipsOnResolvedEntities");
            CdmCorpusDefinition corpus = new CdmCorpusDefinition();
            corpus.SetEventCallback(new Utilities.EventCallback { Invoke = CommonDataModelLoader.ConsoleStatusReport }, CdmStatusLevel.Warning);
            corpus.Storage.Mount("local", new LocalAdapter(testInputPath));
            corpus.Storage.DefaultNamespace = "local";

            var rootManifest = await corpus.FetchObjectAsync<CdmManifestDefinition>("local:/default.manifest.cdm.json");

            var resolvedManifest = await LoadAndResolveManifest(corpus, rootManifest, "-resolved");
            string subManifestPath = corpus.Storage.CreateAbsoluteCorpusPath(resolvedManifest.SubManifests[0].Definition);
            CdmManifestDefinition subManifest = await corpus.FetchObjectAsync<CdmManifestDefinition>(subManifestPath) as CdmManifestDefinition;

            // using createResolvedManifest will only populate exclusive relationships
            Assert.AreEqual(resolvedManifest.Relationships.Count, expectedResolvedManifestRels.Count);
            Assert.AreEqual(subManifest.Relationships.Count, expectedResolvedSubManifestRels.Count);

            // check that each relationship has been created correctly
            foreach (E2ERelationship expectedRel in expectedResolvedManifestRels)
            {
                List<CdmE2ERelationship> found = resolvedManifest.Relationships.Where(x =>
                x.FromEntity == expectedRel.FromEntity
                && x.FromEntityAttribute == expectedRel.FromEntityAttribute
                && x.ToEntity == expectedRel.ToEntity
                && x.ToEntityAttribute == expectedRel.ToEntityAttribute
                ).ToList();
                Assert.AreEqual(found.Count, 1);
            }

            foreach (E2ERelationship expectedSubRel in expectedResolvedSubManifestRels)
            {
                List<CdmE2ERelationship> found = subManifest.Relationships.Where(x =>
                x.FromEntity == expectedSubRel.FromEntity
                && x.FromEntityAttribute == expectedSubRel.FromEntityAttribute
                && x.ToEntity == expectedSubRel.ToEntity
                && x.ToEntityAttribute == expectedSubRel.ToEntityAttribute
                ).ToList();
                Assert.AreEqual(found.Count, 1);
            }

            // it is not enough to check if the relationships are correct.
            // We need to check if the incoming and outgoing relationships are
            // correct as well. One being correct can cover up the other being wrong

            // A
            var aEnt = await corpus.FetchObjectAsync<CdmEntityDefinition>(resolvedManifest.Entities[0].EntityPath, resolvedManifest);
            var aInRels = corpus.FetchIncomingRelationships(aEnt);
            var aOutRels = corpus.FetchOutgoingRelationships(aEnt);
            Assert.AreEqual(aInRels.Count, 0);
            Assert.AreEqual(aOutRels.Count, 1);
            Assert.AreEqual(aOutRels[0].FromEntity, "local:/A-resolved.cdm.json/A");
            Assert.AreEqual(aOutRels[0].ToEntity, "local:/B-resolved.cdm.json/B");

            // B
            var bEnt = await corpus.FetchObjectAsync<CdmEntityDefinition>(resolvedManifest.Entities[1].EntityPath, resolvedManifest);
            var bInRels = corpus.FetchIncomingRelationships(bEnt);
            var bOutRels = corpus.FetchOutgoingRelationships(bEnt);
            Assert.AreEqual(bInRels.Count, 1);
            Assert.AreEqual(bInRels[0].FromEntity, "local:/A-resolved.cdm.json/A");
            Assert.AreEqual(bInRels[0].ToEntity, "local:/B-resolved.cdm.json/B");
            Assert.AreEqual(bOutRels.Count, 0);

            // C
            var cEnt = await corpus.FetchObjectAsync<CdmEntityDefinition>(subManifest.Entities[0].EntityPath, subManifest);
            var cInRels = corpus.FetchIncomingRelationships(cEnt);
            var cOutRels = corpus.FetchOutgoingRelationships(cEnt);
            Assert.AreEqual(cInRels.Count, 0);
            Assert.AreEqual(cOutRels.Count, 2);
            Assert.AreEqual(cOutRels[0].FromEntity, "local:/sub/C-resolved.cdm.json/C");
            // TODO: this should point to the resolved entity, currently an open bug
            Assert.AreEqual(cOutRels[0].ToEntity, "local:/B.cdm.json/B");
            Assert.AreEqual(cOutRels[1].FromEntity, "local:/sub/C-resolved.cdm.json/C");
            Assert.AreEqual(cOutRels[1].ToEntity, "local:/sub/D-resolved.cdm.json/D");

            // D
            var dEnt = await corpus.FetchObjectAsync<CdmEntityDefinition>(subManifest.Entities[1].EntityPath, subManifest);
            var dInRels = corpus.FetchIncomingRelationships(dEnt);
            var dOutRels = corpus.FetchOutgoingRelationships(dEnt);
            Assert.AreEqual(dInRels.Count, 1);
            Assert.AreEqual(dInRels[0].FromEntity, "local:/sub/C-resolved.cdm.json/C");
            Assert.AreEqual(dInRels[0].ToEntity, "local:/sub/D-resolved.cdm.json/D");
            Assert.AreEqual(dOutRels.Count, 0);
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
