// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.Projection
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;

    /// <summary>
    /// A test class for testing the array type with a set of foundational operations in a projection
    /// </summary>
    [TestClass]
    public class ProjectionArrayTest
    {
        /// <summary>
        /// All possible combinations of the different resolution directives
        /// </summary>
        private static List<List<string>> resOptsCombinations = new List<List<string>>() {
            new List<string> { },
            new List<string> { "referenceOnly" },
            new List<string> { "normalized" },
            new List<string> { "structured" },
            new List<string> { "referenceOnly", "normalized" },
            new List<string> { "referenceOnly", "structured" },
            new List<string> { "normalized", "structured" },
            new List<string> { "referenceOnly", "normalized", "structured" },
        };

        /// <summary>
        /// The path between TestDataPath and TestName
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "Projection", nameof(ProjectionArrayTest));

        /// <summary>
        /// Test Array type on an entity attribute.
        /// </summary>
        [TestMethod]
        public async Task TestEntityAttribute()
        {
            string testName = "TestEntityAttribute";
            string entityName = "ThreeMusketeers";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition nonStructuredResolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address"]
            // in non-structured form 
            // Expand 1...3;
            // renameFormat = {m}{o};
            // alterTraits = { has.expansionInfo.list(expansionName: "{a}", ordinal: "{o}", memberAttribute: "{m}") , "argumentsContainWildcards" : true }
            // addArtifactAttribute : "personCount"
            // alterTraits = { indicates.expansionInfo.count(expansionName: "{a}") , apply to "personCount" , "argumentsContainWildcards" : true }
            Assert.AreEqual(10, nonStructuredResolvedEntity.Attributes.Count);
            ProjectionTestUtils.ValidateExpansionInfoTrait(nonStructuredResolvedEntity.Attributes[0] as CdmTypeAttributeDefinition, "name1", 1, "ThreePeople", "name");
            ProjectionTestUtils.ValidateExpansionInfoTrait(nonStructuredResolvedEntity.Attributes[1] as CdmTypeAttributeDefinition, "age1", 1, "ThreePeople", "age");
            ProjectionTestUtils.ValidateExpansionInfoTrait(nonStructuredResolvedEntity.Attributes[2] as CdmTypeAttributeDefinition, "address1", 1, "ThreePeople", "address");
            ProjectionTestUtils.ValidateExpansionInfoTrait(nonStructuredResolvedEntity.Attributes[3] as CdmTypeAttributeDefinition, "name2", 2, "ThreePeople", "name");
            ProjectionTestUtils.ValidateExpansionInfoTrait(nonStructuredResolvedEntity.Attributes[4] as CdmTypeAttributeDefinition, "age2", 2, "ThreePeople", "age");
            ProjectionTestUtils.ValidateExpansionInfoTrait(nonStructuredResolvedEntity.Attributes[5] as CdmTypeAttributeDefinition, "address2", 2, "ThreePeople", "address");
            ProjectionTestUtils.ValidateExpansionInfoTrait(nonStructuredResolvedEntity.Attributes[6] as CdmTypeAttributeDefinition, "name3", 3, "ThreePeople", "name");
            ProjectionTestUtils.ValidateExpansionInfoTrait(nonStructuredResolvedEntity.Attributes[7] as CdmTypeAttributeDefinition, "age3", 3, "ThreePeople", "age");
            ProjectionTestUtils.ValidateExpansionInfoTrait(nonStructuredResolvedEntity.Attributes[8] as CdmTypeAttributeDefinition, "address3", 3, "ThreePeople", "address");
            Assert.AreEqual("personCount", (nonStructuredResolvedEntity.Attributes[9] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("indicates.expansionInfo.count", nonStructuredResolvedEntity.Attributes[9].AppliedTraits[1].NamedReference);
            Assert.AreEqual("ThreePeople", (nonStructuredResolvedEntity.Attributes[9].AppliedTraits[1] as CdmTraitReference).Arguments[0].Value);

            // Original set of attributes: ["name", "age", "address"]
            // in structured form 
            // alterTraits = { is.dataFormat.list }
            // addAttributeGroup: favoriteMusketeers
            CdmEntityDefinition structuredResolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "structured" });
            Assert.AreEqual(1, structuredResolvedEntity.Attributes.Count);
            CdmAttributeGroupDefinition attGroupDefinition = ProjectionTestUtils.ValidateAttributeGroup(structuredResolvedEntity.Attributes, "favoriteMusketeers");
            Assert.IsNotNull(attGroupDefinition.ExhibitsTraits.Item("is.dataFormat.list"));
        }

        /// <summary>
        /// Test Array type on an type attribute.
        /// </summary>
        [TestMethod]
        public async Task TestTypeAttribute()
        {
            string testName = "TestTypeAttribute";
            string entityName = "Person";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition nonStructuredResolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["Favorite Terms"]
            // in non-structured form 
            // Expand 1...2;
            // renameFormat = Term {o};
            // alterTraits = { has.expansionInfo.list(expansionName: "{m}", ordinal: "{o}") , "argumentsContainWildcards" : true }
            // addArtifactAttribute : "number of favorite terms"
            // alterTraits = { indicates.expansionInfo.count(expansionName: "{a}") , apply to "number of favorite terms" , "argumentsContainWildcards" : true }
            Assert.AreEqual(3, nonStructuredResolvedEntity.Attributes.Count);
            Assert.AreEqual("Term 1", (nonStructuredResolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("Term 2", (nonStructuredResolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("number of favorite terms", (nonStructuredResolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("indicates.expansionInfo.count", nonStructuredResolvedEntity.Attributes[2].AppliedTraits[1].NamedReference);
            Assert.AreEqual("Favorite Terms", (nonStructuredResolvedEntity.Attributes[2].AppliedTraits[1] as CdmTraitReference).Arguments[0].Value);

            // Original set of attributes: ["Favorite Terms"]
            // in structured form 
            // alterTraits = { is.dataFormat.list }
            CdmEntityDefinition structuredResolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "structured" });
            Assert.AreEqual(1, structuredResolvedEntity.Attributes.Count);
            Assert.AreEqual("Favorite Terms", (structuredResolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.IsNotNull(structuredResolvedEntity.Attributes[0].AppliedTraits.Item("is.dataFormat.list"));
        }
    }
}
