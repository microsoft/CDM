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
    /// A test class for testing the AddSupportingAttribute operation in a projection and in a resolution guidance
    /// </summary>
    [TestClass]
    public class ProjectionAddSupportingAttributeTest
    {
        /// <summary>
        /// All possible combinations of the different resolution directives
        /// </summary>
        private static readonly List<List<string>> resOptsCombinations = new List<List<string>>() {
            new List<string> { },
            new List<string> { "referenceOnly" },
            new List<string> { "normalized" },
            new List<string> { "structured" },
            new List<string> { "referenceOnly", "normalized" },
            new List<string> { "referenceOnly", "structured" },
            new List<string> { "referenceOnly", "virtual" },
            new List<string> { "normalized", "structured" },
            new List<string> { "normalized", "structured", "virtual" },
            new List<string> { "referenceOnly", "normalized", "structured" },
            new List<string> { "referenceOnly", "normalized", "structured", "virtual" },
        };

        /// <summary>
        /// The path between TestDataPath and TestName
        /// </summary>
        private readonly string testsSubpath = Path.Combine("Cdm", "Projection", "ProjectionAddSupportingAttributeTest");

        /// <summary>
        /// AddSupportingAttribute with replaceAsForeignKey operation in the same projection
        /// </summary>
        [TestMethod]
        public async Task TestCombineOpsProj()
        {
            string testName = "TestCombineOpsProj";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            //// Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Supporting attribute: "PersonInfo_display", rename "address" to "homeAddress"
            Assert.AreEqual(7, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("homeAddress", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo_display", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            ValidateInSupportOfAttribute(resolvedEntity.Attributes[6], "email");
        }

        /// <summary>
        /// Test AddAttributeGroup operation with a "referenceOnly" and "virtual" condition
        /// </summary>
        [TestMethod]
        public async Task TestConditionalProj()
        {
            string testName = "TestConditionalProj";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "referenceOnly" });

            //// Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            //// Condition not met, don't include supporting attribute
            Assert.AreEqual(5, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);

            CdmEntityDefinition resolvedEntity2 = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "referenceOnly", "virtual" });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Condition met, include the supporting attribute
            Assert.AreEqual(6, resolvedEntity2.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity2.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity2.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity2.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (resolvedEntity2.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (resolvedEntity2.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo_display", (resolvedEntity2.Attributes[5] as CdmTypeAttributeDefinition).Name);
            ValidateInSupportOfAttribute(resolvedEntity2.Attributes[5], "email");
        }

        /// <summary>
        /// Test resolving an entity attribute using resolution guidance
        /// </summary>
        [TestMethod]
        public async Task TestEntityAttribute()
        {
            string testName = "TestEntityAttribute";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");

            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "referenceOnly" });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            Assert.AreEqual(2, resolvedEntity.Attributes.Count);
            Assert.AreEqual("id", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo_display", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            ValidateInSupportOfAttribute(resolvedEntity.Attributes[1], "id", false);

            // Resolve without directives
            resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            Assert.AreEqual(6, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo_display", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            ValidateInSupportOfAttribute(resolvedEntity.Attributes[5], "email", false);
        }

        /// <summary>
        /// Test resolving an entity attribute with add supporting attribute operation
        /// </summary>
        [TestMethod]
        public async Task TestEntityAttributeProj()
        {
            string testName = "TestEntityAttributeProj";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "referenceOnly" });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            Assert.AreEqual(6, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo_display", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            ValidateInSupportOfAttribute(resolvedEntity.Attributes[5], "email");
        }

        /// <summary>
        /// addSupportingAttribute on an entity definition using resolution guidance
        /// </summary>
        [TestMethod]
        public async Task TestExtendsEntity()
        {
            string testName = "TestExtendsEntity";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Supporting attribute: "PersonInfo_display" (using extendsEntityResolutionGuidance)
            Assert.AreEqual(6, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo_display", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            ValidateInSupportOfAttribute(resolvedEntity.Attributes[5], "email", false);
        }

        /// <summary>
        /// addSupportingAttribute on an entity definition
        /// </summary>
        [TestMethod]
        public async Task TestExtendsEntityProj()
        {
            string testName = "TestExtendsEntityProj";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Supporting attribute: "PersonInfo_display" (using extendsEntityResolutionGuidance)
            Assert.AreEqual(6, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo_display", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            ValidateInSupportOfAttribute(resolvedEntity.Attributes[5], "email");
        }

        /// <summary>
        /// Nested replaceAsForeignKey with addSupporingAttribute
        /// </summary>
        [TestMethod]
        public async Task TestNestedProj()
        {
            string testName = "TestNestedProj";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "referenceOnly" });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            Assert.AreEqual(2, resolvedEntity.Attributes.Count);
            Assert.AreEqual("personId", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo_display", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            ValidateInSupportOfAttribute(resolvedEntity.Attributes[1], "personId");
        }

        /// <summary>
        /// Test resolving a type attribute with a nested add supporting attribute operation
        /// </summary>
        [TestMethod]
        public async Task TestNestedTypeAttributeProj()
        {
            string testName = "TestNestedTAProj";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "referenceOnly" });

            // Original set of attributes: ["PersonInfo"]
            Assert.AreEqual(2, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            CdmTypeAttributeDefinition supportingAttribute = resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition;
            Assert.AreEqual("name_display", supportingAttribute.Name);
            ValidateInSupportOfAttribute(supportingAttribute, "name");
        }


        /// <summary>
        /// Test resolving a type attribute using resolution guidance
        /// </summary>
        [TestMethod]
        public async Task TestTypeAttribute()
        {
            string testName = "TestTypeAttribute";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "structured" });

            // Original set of attributes: ["PersonInfo"]
            Assert.AreEqual(2, resolvedEntity.Attributes.Count);
            Assert.AreEqual("PersonInfo", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            CdmTypeAttributeDefinition supportingAttribute = resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition;
            Assert.AreEqual("PersonInfo_display", supportingAttribute.Name);
            ValidateInSupportOfAttribute(supportingAttribute, "PersonInfo", false);
        }

        /// <summary>
        /// Test resolving a type attribute with an add supporting attribute operation
        /// </summary>
        [TestMethod]
        public async Task TestTypeAttributeProj()
        {
            string testName = "TestTypeAttributeProj";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "referenceOnly" });

            // Original set of attributes: ["PersonInfo"]
            Assert.AreEqual(2, resolvedEntity.Attributes.Count);
            Assert.AreEqual("PersonInfo", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            CdmTypeAttributeDefinition supportingAttribute = resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition;
            Assert.AreEqual("PersonInfo_display", supportingAttribute.Name);
            ValidateInSupportOfAttribute(supportingAttribute, "PersonInfo");
        }

        /// <summary>
        /// Validates that the supporting attribute has the "is.addedInSupportOf" and "is.virtual.attribute" traits
        /// </summary>
        /// <param name="supportingAttribute"></param>
        /// <param name="fromAttribute"></param>
        private void ValidateInSupportOfAttribute(CdmAttributeItem supportingAttribute, string fromAttribute, bool checkVirtualTrait = true)
        {
            var inSupportOfTrait = supportingAttribute.AppliedTraits.Item("is.addedInSupportOf") as CdmTraitReference;
            Assert.IsNotNull(inSupportOfTrait);
            Assert.AreEqual(1, inSupportOfTrait.Arguments.Count);
            Assert.AreEqual(fromAttribute, inSupportOfTrait.Arguments[0].Value);

            if (checkVirtualTrait)
            {
                Assert.IsNotNull(supportingAttribute.AppliedTraits.Item("is.virtual.attribute"), "Missing is.virtual.attribute traits");
            }
        }
    }
}
