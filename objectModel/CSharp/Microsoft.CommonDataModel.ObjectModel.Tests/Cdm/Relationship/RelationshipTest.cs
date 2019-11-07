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
            corpus.Storage.Mount("cdm", new GithubAdapter()
            {
                Timeout = TimeSpan.FromSeconds(3),
                MaximumTimeout = TimeSpan.FromSeconds(6),
                NumberOfRetries = 1
            });

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
                List<CdmE2ERelationship> found = rootManifest.Relationships.AllItems.Where(x =>
                x.FromEntity == expectedRel.FromEntity
                && x.FromEntityAttribute == expectedRel.FromEntityAttribute
                && x.ToEntity == expectedRel.ToEntity
                && x.ToEntityAttribute == expectedRel.ToEntityAttribute
                ).ToList();
                Assert.AreEqual(found.Count, 1);
            }

            foreach (E2ERelationship expectedSubRel in expectedAllSubManifestRels)
            {
                List<CdmE2ERelationship> found = subManifest.Relationships.AllItems.Where(x =>
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
                List<CdmE2ERelationship> found = rootManifest.Relationships.AllItems.Where(x =>
                x.FromEntity == expectedRel.FromEntity
                && x.FromEntityAttribute == expectedRel.FromEntityAttribute
                && x.ToEntity == expectedRel.ToEntity
                && x.ToEntityAttribute == expectedRel.ToEntityAttribute
                ).ToList();
                Assert.AreEqual(found.Count, 1);
            }

            foreach (E2ERelationship expectedSubRel in expectedExclusiveSubManifestRels)
            {
                List<CdmE2ERelationship> found = subManifest.Relationships.AllItems.Where(x =>
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
    }
}
