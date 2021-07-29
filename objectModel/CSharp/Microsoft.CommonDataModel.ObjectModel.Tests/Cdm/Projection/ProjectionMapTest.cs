// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.Projection
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;

    /// <summary>
    /// A test class for testing the map type with a set of foundational operations in a projection
    /// </summary>
    [TestClass]
    public class ProjectionMapTest
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
        private string testsSubpath = Path.Combine("Cdm", "Projection", "ProjectionMapTest");

        /// <summary>
        /// Test map type on an entity attribute.
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
            // addArtifactAttribute : { "key" , "insertAtTop": true }
            // Expand 1...3;
            // renameAttributes = { {a}_{o}_key, apply to "key" }
            // renameAttributes = { {a}_{m}_{o}_value, apply to "name", "age", "address" }
            // alterTraits = { indicates.expansionInfo.mapKey(expansionName: "{a}", ordinal: "{o}") , apply to "key" , "argumentsContainWildcards" : true }
            // alterTraits = { has.expansionInfo.mapValue(expansionName: "{a}", ordinal: "{o}", memberAttribute: "{m}") , apply to "name", "age", "address"  , "argumentsContainWildcards" : true }
            // addArtifactAttribute : "personCount"
            // alterTraits = { indicates.expansionInfo.count(expansionName: "{a}") , apply to "personCount" , "argumentsContainWildcards" : true }
            Assert.AreEqual(13, nonStructuredResolvedEntity.Attributes.Count);
            ValidateAttributeTrait(nonStructuredResolvedEntity.Attributes[0] as CdmTypeAttributeDefinition, "ThreePeople_1_key", 1, "ThreePeople", isKey: true);
            ValidateAttributeTrait(nonStructuredResolvedEntity.Attributes[1] as CdmTypeAttributeDefinition, "ThreePeople_name_1_value", 1, "ThreePeople", "name");
            ValidateAttributeTrait(nonStructuredResolvedEntity.Attributes[2] as CdmTypeAttributeDefinition, "ThreePeople_age_1_value", 1, "ThreePeople", "age");
            ValidateAttributeTrait(nonStructuredResolvedEntity.Attributes[3] as CdmTypeAttributeDefinition, "ThreePeople_address_1_value", 1, "ThreePeople", "address");
            ValidateAttributeTrait(nonStructuredResolvedEntity.Attributes[4] as CdmTypeAttributeDefinition, "ThreePeople_2_key", 2, "ThreePeople", isKey: true);
            ValidateAttributeTrait(nonStructuredResolvedEntity.Attributes[5] as CdmTypeAttributeDefinition, "ThreePeople_name_2_value", 2, "ThreePeople", "name");
            ValidateAttributeTrait(nonStructuredResolvedEntity.Attributes[6] as CdmTypeAttributeDefinition, "ThreePeople_age_2_value", 2, "ThreePeople", "age");
            ValidateAttributeTrait(nonStructuredResolvedEntity.Attributes[7] as CdmTypeAttributeDefinition, "ThreePeople_address_2_value", 2, "ThreePeople", "address");
            ValidateAttributeTrait(nonStructuredResolvedEntity.Attributes[8] as CdmTypeAttributeDefinition, "ThreePeople_3_key", 3, "ThreePeople", isKey: true);
            ValidateAttributeTrait(nonStructuredResolvedEntity.Attributes[9] as CdmTypeAttributeDefinition, "ThreePeople_name_3_value", 3, "ThreePeople", "name");
            ValidateAttributeTrait(nonStructuredResolvedEntity.Attributes[10] as CdmTypeAttributeDefinition, "ThreePeople_age_3_value", 3, "ThreePeople", "age");
            ValidateAttributeTrait(nonStructuredResolvedEntity.Attributes[11] as CdmTypeAttributeDefinition, "ThreePeople_address_3_value", 3, "ThreePeople", "address");
            Assert.AreEqual("personCount", (nonStructuredResolvedEntity.Attributes[12] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("indicates.expansionInfo.count", nonStructuredResolvedEntity.Attributes[12].AppliedTraits[1].NamedReference);
            Assert.AreEqual("ThreePeople", (nonStructuredResolvedEntity.Attributes[12].AppliedTraits[1] as CdmTraitReference).Arguments[0].Value);

            // Original set of attributes: ["name", "age", "address"]
            // in structured form 
            // addAttributeGroup: favorite people
            // alterTraits = { is.dataFormat.mapValue }
            // addArtifactAttribute : { "favorite People Key" (with trait "is.dataFormat.mapKey") , "insertAtTop": true }
            // addAttributeGroup: favorite People Group
            // alterTraits = { is.dataFormat.map }
            CdmEntityDefinition structuredResolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "structured" });
            Assert.AreEqual(1, structuredResolvedEntity.Attributes.Count);
            CdmAttributeGroupDefinition attGroupDefinition = ProjectionTestUtils.ValidateAttributeGroup(structuredResolvedEntity.Attributes, "favorite People Group");
            Assert.IsNotNull(attGroupDefinition.ExhibitsTraits.Item("is.dataFormat.map"));
            Assert.AreEqual("favorite People Key", (attGroupDefinition.Members[0] as CdmTypeAttributeDefinition).Name);
            Assert.IsNotNull(attGroupDefinition.Members[0].AppliedTraits.Item("is.dataFormat.mapKey"));
            Assert.AreEqual(CdmObjectType.AttributeGroupRef, attGroupDefinition.Members[1].ObjectType);
            CdmAttributeGroupReference innerAttGroupRef = attGroupDefinition.Members[1] as CdmAttributeGroupReference;
            Assert.IsNotNull(innerAttGroupRef.ExplicitReference);
            CdmAttributeGroupDefinition innerAttGroupDefinition = innerAttGroupRef.ExplicitReference as CdmAttributeGroupDefinition;
            Assert.AreEqual("favorite people", innerAttGroupDefinition.AttributeGroupName);
            Assert.IsNotNull(innerAttGroupDefinition.ExhibitsTraits.Item("is.dataFormat.mapValue"));
        }

        /// <summary>
        /// Test map type on a type attribute.
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

            // Original set of attributes: [ "FavoriteTerms" ]
            // in non-structured form
            // addArtifactAttribute : { "Term key" , "insertAtTop": true }
            // Expand 1...2;
            // renameAttributes = { {m}_{o}_key, apply to "Term key" }
            // renameAttributes = { {m}_{o}_value, apply to "FavoriteTerms" }
            // alterTraits = { indicates.expansionInfo.mapKey(expansionName: "{a}", ordinal: "{o}") , apply to "Term key" , "argumentsContainWildcards" : true }
            // alterTraits = { has.expansionInfo.mapValue(expansionName: "{m}", ordinal: "{o}") , apply to "FavoriteTerms"  , "argumentsContainWildcards" : true }
            // addArtifactAttribute : number of favorite terms"
            // alterTraits = { indicates.expansionInfo.count(expansionName: "{a}") , apply to "number of favorite terms" , "argumentsContainWildcards" : true }
            Assert.AreEqual(5, nonStructuredResolvedEntity.Attributes.Count);
            ValidateAttributeTrait(nonStructuredResolvedEntity.Attributes[0] as CdmTypeAttributeDefinition, "Term key_1_key", 1, "FavoriteTerms", isKey: true);
            ValidateAttributeTrait(nonStructuredResolvedEntity.Attributes[1] as CdmTypeAttributeDefinition, "FavoriteTerms_1_value", 1, "FavoriteTerms");
            ValidateAttributeTrait(nonStructuredResolvedEntity.Attributes[2] as CdmTypeAttributeDefinition, "Term key_2_key", 2, "FavoriteTerms", isKey: true);
            ValidateAttributeTrait(nonStructuredResolvedEntity.Attributes[3] as CdmTypeAttributeDefinition, "FavoriteTerms_2_value", 2, "FavoriteTerms");
            Assert.AreEqual("number of favorite terms", (nonStructuredResolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("indicates.expansionInfo.count", nonStructuredResolvedEntity.Attributes[4].AppliedTraits[1].NamedReference);
            Assert.AreEqual("FavoriteTerms", (nonStructuredResolvedEntity.Attributes[4].AppliedTraits[1] as CdmTraitReference).Arguments[0].Value);

            // Original set of attributes: [ "FavoriteTerms" ]
            // in structured form 
            // alterTraits = { is.dataFormat.mapValue }
            // addArtifactAttribute : { "Favorite Terms Key" (with trait "is.dataFormat.mapKey")  , "insertAtTop": true }
            // addAttributeGroup: favorite Term Group
            // alterTraits = { is.dataFormat.map }
            CdmEntityDefinition structuredResolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "structured" });
            Assert.AreEqual(1, structuredResolvedEntity.Attributes.Count);
            CdmAttributeGroupDefinition attGroupDefinition = ProjectionTestUtils.ValidateAttributeGroup(structuredResolvedEntity.Attributes, "favorite Term Group");
            Assert.IsNotNull(attGroupDefinition.ExhibitsTraits.Item("is.dataFormat.map"));
            Assert.AreEqual("Favorite Terms Key", (attGroupDefinition.Members[0] as CdmTypeAttributeDefinition).Name);
            Assert.IsNotNull(attGroupDefinition.Members[0].AppliedTraits.Item("is.dataFormat.mapKey"));
            Assert.AreEqual("FavoriteTerms", (attGroupDefinition.Members[1] as CdmTypeAttributeDefinition).Name);
            Assert.IsNotNull(attGroupDefinition.Members[1].AppliedTraits.Item("is.dataFormat.mapValue"));
        }

        /// <summary>
        /// Validates trait for map's value or key.
        /// </summary>
        /// <param name="attribute">The type attribute.</param>
        /// <param name="ordinal">The expected ordinal.</param>
        /// <param name="expansionName">The expected expansion name.</param>
        /// <param name="memberAttribute">The expected member attribute name.</param>
        /// <param name="isKey">Whether this is a key.</param>
        /// <returns></returns>
        private void ValidateAttributeTrait(CdmTypeAttributeDefinition attribute, string expectedAttrName, int ordinal, string expansionName, string memberAttribute = null, bool isKey = false)
        {
            Assert.AreEqual(expectedAttrName, attribute.Name);
            CdmTraitReference trait = (CdmTraitReference)attribute.AppliedTraits.Item(isKey ? "indicates.expansionInfo.mapKey" : "has.expansionInfo.mapValue");
            Assert.IsNotNull(trait);
            Assert.AreEqual(trait.Arguments.FetchValue("expansionName"), expansionName);
            Assert.AreEqual(trait.Arguments.FetchValue("ordinal"), ordinal.ToString());
            if (memberAttribute != null)
            {
                Assert.AreEqual(trait.Arguments.FetchValue("memberAttribute"), memberAttribute);
            }
        }
    }
}
