// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.Projection;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    /// <summary>
    /// Test to validate CalculateEntityGraphAsync function
    /// </summary>
    [TestClass]
    public class CalculateRelationshipTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "Relationship", "CalculateRelationshipTest");

        /// <summary>
        /// Non projection scenario with the referenced entity having a primary key
        /// </summary>
        [TestMethod]
        public async Task TestSimpleWithId()
        {
            string testName = "TestSimpleWithId";
            string entityName = "Sales";

            await TestRun(testName, entityName, false);
        }

        /// <summary>
        /// Projection scenario with the referenced entity not having any primary key
        /// </summary>
        [TestMethod]
        public async Task TestWithoutIdProj()
        {
            string testName = "TestWithoutIdProj";
            string entityName = "Sales";

            await TestRun(testName, entityName, true);
        }

        /// <summary>
        /// Projection scenario with the referenced entity in a different folder
        /// </summary>
        [TestMethod]
        public async Task TestDiffRefLocation()
        {
            string testName = "TestDiffRefLocation";
            string entityName = "Sales";

            await TestRun(testName, entityName, true);
        }

        /// <summary>
        /// Projection with composite keys
        /// </summary>
        [TestMethod]
        public async Task TestCompositeProj()
        {
            string testName = "TestCompositeProj";
            string entityName = "Sales";

            await TestRun(testName, entityName, true);
        }

        /// <summary>
        /// Projection with nested composite keys
        /// </summary>
        [TestMethod]
        public async Task TestNestedCompositeProj()
        {
            string testName = "TestNestedCompositeProj";
            string entityName = "Sales";

            await TestRun(testName, entityName, true);
        }

        /// <summary>
        /// Non projection scenario with selectsSubAttribute set to one
        /// </summary>
        [TestMethod]
        public async Task TestPolymorphicWithoutProj()
        {
            string testName = "TestPolymorphicWithoutProj";
            string entityName = "CustomPerson";

            await TestRun(testName, entityName, false);
        }

        /// <summary>
        /// Projection with IsPolymorphicSource property set to true
        /// </summary>
        [TestMethod]
        public async Task TestPolymorphicProj()
        {
            string testName = "TestPolymorphicProj";
            string entityName = "Person";

            await TestRun(testName, entityName, true);
        }

        /// <summary>
        /// Test a composite key relationship with a polymorphic entity.
        /// </summary>
        [TestMethod]
        public async Task TestCompositeKeyPolymorphicRelationship()
        {
            string testName = "TestCompositeKeyPolymorphicRelationship";
            string entityName = "Person";

            await TestRun(testName, entityName, true);
        }

        /// <summary>
        /// Test a composite key relationship with multiple entity attribute but not polymorphic.
        /// </summary>
        [TestMethod]
        public async Task TestCompositeKeyNonPolymorphicRelationship()
        {
            string testName = "TestCompositeKeyNonPolymorphicRelationship";
            string entityName = "Person";

            await TestRun(testName, entityName, true);
        }

        /// <summary>
        /// Common test code for these test cases
        /// </summary>
        /// <param name="testName"></param>
        /// <param name="entityName"></param>
        private async Task TestRun(string testName, string entityName, bool isEntitySet)
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);
            string inputFolder = TestHelper.GetInputFolderPath(testsSubpath, testName);
            string expectedOutputFolder = TestHelper.GetExpectedOutputFolderPath(testsSubpath, testName);
            string actualOutputFolder = TestHelper.GetActualOutputFolderPath(testsSubpath, testName);
            if (!Directory.Exists(actualOutputFolder))
            {
                Directory.CreateDirectory(actualOutputFolder);
            }

            CdmManifestDefinition manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>($"local:/default.manifest.cdm.json");
            Assert.IsNotNull(manifest);
            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}", manifest);
            Assert.IsNotNull(entity);
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "referenceOnly" });
            AssertEntityShapeInResolvedEntity(resolvedEntity, isEntitySet);

            await AttributeContextUtil.ValidateAttributeContext(corpus, expectedOutputFolder, entityName, resolvedEntity);

            await corpus.CalculateEntityGraphAsync(manifest);
            await manifest.PopulateManifestRelationshipsAsync();
            string actualRelationshipsString = ListRelationships(corpus, entity, actualOutputFolder, entityName);

            string relationshipsFilename = $"REL_{entityName}.txt";
            File.WriteAllText(Path.Combine(actualOutputFolder, relationshipsFilename), actualRelationshipsString);

            string expectedRelationshipsStringFilePath = Path.GetFullPath(Path.Combine(expectedOutputFolder, relationshipsFilename));
            string expectedRelationshipsString = File.ReadAllText(expectedRelationshipsStringFilePath);

            Assert.AreEqual(expectedRelationshipsString, actualRelationshipsString);

            CdmFolderDefinition outputFolder = corpus.Storage.FetchRootFolder("output");
            outputFolder.Documents.Add(manifest);

            string manifestFileName = $"saved.manifest.cdm.json";
            await manifest.SaveAsAsync(manifestFileName, saveReferenced: true);
            string actualManifestPath = Path.Combine(actualOutputFolder, manifestFileName);
            if (!File.Exists(actualManifestPath))
            {
                Assert.Fail("Unable to save manifest with relationship");
            }
            else
            {
                CdmManifestDefinition savedManifest = await corpus.FetchObjectAsync<CdmManifestDefinition>($"output:/{manifestFileName}");
                string actualSavedManifestRel = GetRelationshipStrings(savedManifest.Relationships);
                string manifestRelationshipsFilename = $"MANIFEST_REL_{entityName}.txt";
                File.WriteAllText(Path.Combine(actualOutputFolder, manifestRelationshipsFilename), actualSavedManifestRel);

                string expectedSavedManifestRel = File.ReadAllText(Path.Combine(expectedOutputFolder, manifestRelationshipsFilename));
                Assert.AreEqual(expectedSavedManifestRel, actualSavedManifestRel);
            }
        }

        /// <summary>
        /// Check if the entity shape is correct in entity reference.
        /// </summary>
        /// <param name="resolvedEntity"></param>
        /// <param name="isEntitySet">Indicate if the entity shape is entitySet or entityGroupSet.</param>
        internal void AssertEntityShapeInResolvedEntity(CdmEntityDefinition resolvedEntity, bool isEntitySet)
        {
            foreach (var att in resolvedEntity.Attributes)
            {
                var traitRef = att?.AppliedTraits?.Where(x => x.NamedReference == "is.linkedEntity.identifier" && (x as CdmTraitReference).Arguments?.Count > 0).FirstOrDefault();
                var entRef = (traitRef as CdmTraitReference)?.Arguments[0].Value;

                if (entRef != null) {
                    var entityShape = (entRef.FetchObjectDefinition<CdmConstantEntityDefinition>() as CdmConstantEntityDefinition).EntityShape.NamedReference;
                    if (isEntitySet)
                    {
                        Assert.AreEqual("entitySet", entityShape);
                    } else
                    {
                        Assert.AreEqual("entityGroupSet", entityShape);
                    }
                    return;
                }
            }

            Assert.Fail("Unable to find entity shape from resolved model.");
        }

        /// <summary>
        /// Get a string version of the relationship collection
        /// </summary>
        /// <param name="relationships"></param>
        /// <returns></returns>
        internal static string GetRelationshipStrings(CdmCollection<CdmE2ERelationship> relationships)
        {
            StringBuilder bldr = new StringBuilder();
            foreach (var rel in relationships)
            {
                bldr.AppendLine($"{rel.Name}|{rel.ToEntity}|{rel.ToEntityAttribute}|{rel.FromEntity}|{rel.FromEntityAttribute}");
            }
            return bldr.ToString();
        }


        /// <summary>
        /// Get a string version of one relationship
        /// </summary>
        /// <param name="relationships"></param>
        /// <returns></returns>
        internal static string GetRelationshipString(CdmE2ERelationship rel)
        {
            string nameAndPipe = string.Empty;
            if (!string.IsNullOrWhiteSpace(rel.Name))
            {
                nameAndPipe = $"{rel.Name}|";
            }
            return $"{nameAndPipe}{rel.ToEntity}|{rel.ToEntityAttribute}|{rel.FromEntity}|{rel.FromEntityAttribute}";
        }

        /// <summary>
        /// List the incoming and outgoing relationships
        /// </summary>
        /// <param name="corpus"></param>
        /// <param name="entity"></param>
        /// <param name="actualOutputFolder"></param>
        /// <param name="entityName"></param>
        /// <returns></returns>
        private static string ListRelationships(CdmCorpusDefinition corpus, CdmEntityDefinition entity, string actualOutputFolder, string entityName)
        {
            StringBuilder bldr = new StringBuilder();
            HashSet<string> relCache = new HashSet<string>();

            bldr.AppendLine($"Incoming Relationships For: {entity.EntityName}:");
            // Loop through all the relationships where other entities point to this entity.
            foreach (CdmE2ERelationship relationship in corpus.FetchIncomingRelationships(entity))
            {
                string cacheKey = GetRelationshipString(relationship);
                if (!relCache.Contains(cacheKey))
                {
                    bldr.AppendLine(PrintRelationship(relationship));
                    relCache.Add(cacheKey);
                }
            }

            Console.WriteLine($"Outgoing Relationships For: {entity.EntityName}:");
            // Now loop through all the relationships where this entity points to other entities.
            foreach (CdmE2ERelationship relationship in corpus.FetchOutgoingRelationships(entity))
            {
                string cacheKey = GetRelationshipString(relationship);
                if (!relCache.Contains(cacheKey))
                {
                    bldr.AppendLine(PrintRelationship(relationship));
                    relCache.Add(cacheKey);
                }
            }

            return bldr.ToString();
        }

        /// <summary>
        /// Print the relationship
        /// </summary>
        /// <param name="relationship"></param>
        /// <returns></returns>
        private static string PrintRelationship(CdmE2ERelationship relationship)
        {
            StringBuilder bldr = new StringBuilder();

            if (!string.IsNullOrWhiteSpace(relationship?.Name))
            {
                bldr.AppendLine($"  Name: {relationship.Name}");
            }
            bldr.AppendLine($"  FromEntity: {relationship.FromEntity}");
            bldr.AppendLine($"  FromEntityAttribute: {relationship.FromEntityAttribute}");
            bldr.AppendLine($"  ToEntity: {relationship.ToEntity}");
            bldr.AppendLine($"  ToEntityAttribute: {relationship.ToEntityAttribute}");

            if (relationship.ExhibitsTraits != null && relationship.ExhibitsTraits.Count != 0)
            {
                bldr.AppendLine($"  ExhibitsTraits:");
                var orderedAppliedTraits = relationship.ExhibitsTraits.AllItems.ToList().OrderBy(x => x.NamedReference);
                foreach (CdmTraitReferenceBase trait in orderedAppliedTraits)
                {
                    bldr.AppendLine($"      {trait.NamedReference}");

                    if (trait is CdmTraitReference)
                    {
                        foreach (CdmArgumentDefinition args in (trait as CdmTraitReference).Arguments)
                        {
                            AttributeContextUtil attrCtxUtil = new AttributeContextUtil();
                            bldr.AppendLine($"          {attrCtxUtil.GetArgumentValuesAsString(args)}");
                        }
                    }
                }
            }


            bldr.AppendLine();
            Console.WriteLine(bldr.ToString());

            return bldr.ToString();
        }
    }
}
