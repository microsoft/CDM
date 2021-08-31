// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.Projection
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;

    /// <summary>
    /// A test class for testing the ArrayExpansion operation in a projection as well as Expansion in a resolution guidance
    /// </summary>
    [TestClass]
    public class ProjectionExpansionTest
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
        private string testsSubpath = Path.Combine("Cdm", "Projection", "ProjectionExpansionTest");

        /// <summary>
        /// Test for creating a projection with an ArrayExpansion operation on an entity attribute using the object model  
        /// </summary>
        [TestMethod]
        public async Task TestEntityAttributeProjUsingObjectModel()
        {
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, "TestEntityAttributeProjUsingObjectModel");
            corpus.Storage.Mount("local", new LocalAdapter(TestHelper.GetActualOutputFolderPath(testsSubpath, "TestEntityAttributeProjUsingObjectModel")));
            CdmFolderDefinition localRoot = corpus.Storage.FetchRootFolder("local");

            // Create an entity
            CdmEntityDefinition entity = ProjectionTestUtils.CreateEntity(corpus, localRoot);

            // Create a projection
            CdmProjection projection = ProjectionTestUtils.CreateProjection(corpus, localRoot);

            // Create an ArrayExpansion operation
            CdmOperationArrayExpansion arrayExpansionOp = corpus.MakeObject<CdmOperationArrayExpansion>(CdmObjectType.OperationArrayExpansionDef);
            arrayExpansionOp.StartOrdinal = 1;
            arrayExpansionOp.EndOrdinal = 2;
            projection.Operations.Add(arrayExpansionOp);

            // Create an entity reference to hold this projection
            CdmEntityReference projectionEntityRef = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            projectionEntityRef.ExplicitReference = projection;

            // Create another projection that does a rename so that we can see the expanded attributes in the final resolved entity
            CdmProjection projection2 = corpus.MakeObject<CdmProjection>(CdmObjectType.ProjectionDef);
            projection2.Source = projectionEntityRef;

            // Create a RenameAttributes operation
            CdmOperationRenameAttributes renameAttrsOp = corpus.MakeObject<CdmOperationRenameAttributes>(CdmObjectType.OperationRenameAttributesDef);
            renameAttrsOp.RenameFormat = "{m}{o}";
            projection2.Operations.Add(renameAttrsOp);

            // Create an entity reference to hold this projection
            CdmEntityReference projectionEntityRef2 = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            projectionEntityRef2.ExplicitReference = projection2;

            // Create an entity attribute that contains this projection and add this to the entity
            CdmEntityAttributeDefinition entityAttribute = corpus.MakeObject<CdmEntityAttributeDefinition>(CdmObjectType.EntityAttributeDef, "TestEntityAttribute");
            entityAttribute.Entity = projectionEntityRef2;
            entity.Attributes.Add(entityAttribute);

            // Resolve the entity
            CdmEntityDefinition resolvedEntity = await entity.CreateResolvedEntityAsync($"Resolved_{entity.EntityName}.cdm.json", null, localRoot);

            // Verify correctness of the resolved attributes after running the projections
            // Original set of attributes: ["id", "name", "value", "date"]
            // Expand 1...2, renameFormat = {m}{o}
            Assert.AreEqual(8, resolvedEntity.Attributes.Count);
            Assert.AreEqual("id1", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name1", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("value1", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("date1", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("id2", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name2", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("value2", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("date2", (resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Test for creating a projection with an ArrayExpansion operation on an entity definition using the object model  
        /// </summary>
        [TestMethod]
        public async Task TestEntityProjUsingObjectModel()
        {
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, "TestEntityProjUsingObjectModel");
            corpus.Storage.Mount("local", new LocalAdapter(TestHelper.GetActualOutputFolderPath(testsSubpath, "TestEntityProjUsingObjectModel")));
            CdmFolderDefinition localRoot = corpus.Storage.FetchRootFolder("local");

            // Create an entity
            CdmEntityDefinition entity = ProjectionTestUtils.CreateEntity(corpus, localRoot);

            // Create a projection
            CdmProjection projection = ProjectionTestUtils.CreateProjection(corpus, localRoot);

            // Create an ArrayExpansion operation
            CdmOperationArrayExpansion arrayExpansionOp = corpus.MakeObject<CdmOperationArrayExpansion>(CdmObjectType.OperationArrayExpansionDef);
            arrayExpansionOp.StartOrdinal = 1;
            arrayExpansionOp.EndOrdinal = 2;
            projection.Operations.Add(arrayExpansionOp);

            // Create an entity reference to hold this projection
            CdmEntityReference projectionEntityRef = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            projectionEntityRef.ExplicitReference = projection;

            // Create another projection that does a rename so that we can see the expanded attributes in the final resolved entity
            CdmProjection projection2 = corpus.MakeObject<CdmProjection>(CdmObjectType.ProjectionDef);
            projection2.Source = projectionEntityRef;

            // Create a RenameAttributes operation
            CdmOperationRenameAttributes renameAttrsOp = corpus.MakeObject<CdmOperationRenameAttributes>(CdmObjectType.OperationRenameAttributesDef);
            renameAttrsOp.RenameFormat = "{m}{o}";
            projection2.Operations.Add(renameAttrsOp);

            // Create an entity reference to hold this projection
            CdmEntityReference projectionEntityRef2 = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            projectionEntityRef2.ExplicitReference = projection2;

            // Set the entity's ExtendEntity to be the projection
            entity.ExtendsEntity = projectionEntityRef2;

            // Resolve the entity
            CdmEntityDefinition resolvedEntity = await entity.CreateResolvedEntityAsync($"Resolved_{entity.EntityName}.cdm.json", null, localRoot);

            // Verify correctness of the resolved attributes after running the projections
            // Original set of attributes: ["id", "name", "value", "date"]
            // Expand 1...2, renameFormat = {m}{o}
            Assert.AreEqual(8, resolvedEntity.Attributes.Count);
            Assert.AreEqual("id1", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name1", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("value1", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("date1", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("id2", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name2", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("value2", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("date2", (resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Test for creating a projection with an ArrayExpansion operation and a condition using the object model  
        /// </summary>
        [TestMethod]
        public async Task TestConditionalProjUsingObjectModel()
        {
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, "TestConditionalProjUsingObjectModel");
            corpus.Storage.Mount("local", new LocalAdapter(TestHelper.GetActualOutputFolderPath(testsSubpath, "TestConditionalProjUsingObjectModel")));
            CdmFolderDefinition localRoot = corpus.Storage.FetchRootFolder("local");

            // Create an entity
            CdmEntityDefinition entity = ProjectionTestUtils.CreateEntity(corpus, localRoot);

            // Create a projection with a condition that states the operation should only execute when the resolution directive is 'referenceOnly'
            CdmProjection projection = ProjectionTestUtils.CreateProjection(corpus, localRoot);
            projection.Condition = "referenceOnly==true";

            // Create an ArrayExpansion operation
            CdmOperationArrayExpansion arrayExpansionOp = corpus.MakeObject<CdmOperationArrayExpansion>(CdmObjectType.OperationArrayExpansionDef);
            arrayExpansionOp.StartOrdinal = 1;
            arrayExpansionOp.EndOrdinal = 2;
            projection.Operations.Add(arrayExpansionOp);

            // Create an entity reference to hold this projection
            CdmEntityReference projectionEntityRef = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            projectionEntityRef.ExplicitReference = projection;

            // Create another projection that does a rename so that we can see the expanded attributes in the final resolved entity
            CdmProjection projection2 = corpus.MakeObject<CdmProjection>(CdmObjectType.ProjectionDef);
            projection2.Source = projectionEntityRef;

            // Create a RenameAttributes operation
            CdmOperationRenameAttributes renameAttrsOp = corpus.MakeObject<CdmOperationRenameAttributes>(CdmObjectType.OperationRenameAttributesDef);
            renameAttrsOp.RenameFormat = "{m}{o}";
            projection2.Operations.Add(renameAttrsOp);

            // Create an entity reference to hold this projection
            CdmEntityReference projectionEntityRef2 = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            projectionEntityRef2.ExplicitReference = projection2;

            // Create an entity attribute that contains this projection and add this to the entity
            CdmEntityAttributeDefinition entityAttribute = corpus.MakeObject<CdmEntityAttributeDefinition>(CdmObjectType.EntityAttributeDef, "TestEntityAttribute");
            entityAttribute.Entity = projectionEntityRef2;
            entity.Attributes.Add(entityAttribute);

            // Create resolution options with the 'referenceOnly' directive
            ResolveOptions resOpt = new ResolveOptions(entity.InDocument);
            resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "referenceOnly" });

            // Resolve the entity with 'referenceOnly'
            CdmEntityDefinition resolvedEntityWithReferenceOnly = await entity.CreateResolvedEntityAsync($"Resolved_{entity.EntityName}.cdm.json", resOpt, localRoot);

            // Verify correctness of the resolved attributes after running the projections
            // Original set of attributes: ["id", "name", "value", "date"]
            // Expand 1...2, renameFormat = {m}{o}
            Assert.AreEqual(8, resolvedEntityWithReferenceOnly.Attributes.Count);
            Assert.AreEqual("id1", (resolvedEntityWithReferenceOnly.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name1", (resolvedEntityWithReferenceOnly.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("value1", (resolvedEntityWithReferenceOnly.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("date1", (resolvedEntityWithReferenceOnly.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("id2", (resolvedEntityWithReferenceOnly.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name2", (resolvedEntityWithReferenceOnly.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("value2", (resolvedEntityWithReferenceOnly.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("date2", (resolvedEntityWithReferenceOnly.Attributes[7] as CdmTypeAttributeDefinition).Name);

            // Now resolve the entity with the default directives
            resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { });
            CdmEntityDefinition resolvedEntityWithStructured = await entity.CreateResolvedEntityAsync($"Resolved_{entity.EntityName}.cdm.json", resOpt, localRoot);

            // Verify correctness of the resolved attributes after running the projections
            // Original set of attributes: ["id", "name", "value", "date"]
            // Expand 1...2, renameFormat = {m}{o}
            Assert.AreEqual(4, resolvedEntityWithStructured.Attributes.Count);
            Assert.AreEqual("id", (resolvedEntityWithStructured.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name", (resolvedEntityWithStructured.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("value", (resolvedEntityWithStructured.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("date", (resolvedEntityWithStructured.Attributes[3] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Expansion on an entity attribute
        /// </summary>
        [TestMethod]
        public async Task TestExpansion()
        {
            string testName = "TestExpansion";
            string entityName = "ThreeMusketeers";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address"]
            // Expand 1...3, renameFormat = {m}{o}
            Assert.AreEqual(10, resolvedEntity.Attributes.Count);
            Assert.AreEqual("count", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name1", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age1", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address1", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name2", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age2", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address2", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name3", (resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age3", (resolvedEntity.Attributes[8] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address3", (resolvedEntity.Attributes[9] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// ArrayExpansion on an entity attribute
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
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address"]
            // Expand 1...3, renameFormat = {m}{o}
            Assert.AreEqual(9, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name1", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age1", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address1", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name2", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age2", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address2", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name3", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age3", (resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address3", (resolvedEntity.Attributes[8] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// ArrayExpansion on an type attribute
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
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["Favorite Terms"]
            // Expand 1...2, renameFormat = Term {o}
            Assert.AreEqual(2, resolvedEntity.Attributes.Count);
            Assert.AreEqual("Term 1", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("Term 2", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// ArrayExpansion on an entity attribute without a RenameAttributes
        /// </summary>
        [TestMethod]
        public async Task TestProjNoRename()
        {
            string testName = "TestProjNoRename";
            string entityName = "ThreeMusketeers";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address"]
            // Expand 1...3
            // Since there's no rename, the expanded attributes just get merged together
            Assert.AreEqual(3, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Expansion on an entity definition
        /// NOTE: This is not supported in resolution guidance
        /// </summary>
        [TestMethod]
        public async Task TestExtendsEntity()
        {
            string testName = "TestExtendsEntity";
            string entityName = "ThreeMusketeers";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address"]
            // Expand 1...3, renameFormat = {m}{o}
            // ExtendsEntityResolutionGuidance doesn't support doing expansions, so we only get "count" here
            Assert.AreEqual(1, resolvedEntity.Attributes.Count);
            Assert.AreEqual("count", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// ArrayExpansion on an entity definition
        /// </summary>
        [TestMethod]
        public async Task TestExtendsEntityProj()
        {
            string testName = "TestExtendsEntityProj";
            string entityName = "ThreeMusketeers";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address"]
            // Expand 1...3, renameFormat = {m}{o}
            Assert.AreEqual(9, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name1", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age1", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address1", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name2", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age2", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address2", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name3", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age3", (resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address3", (resolvedEntity.Attributes[8] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Nested projections with ArrayExpansion
        /// </summary>
        [TestMethod]
        public async Task TestNestedProj()
        {
            string testName = "TestNestedProj";
            string entityName = "ThreeMusketeers";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address"]
            // Expand 1...3 and then 1...2, renameFormat = {m}_{o}
            Assert.AreEqual(18, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name_1_1", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age_1_1", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address_1_1", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name_2_1", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age_2_1", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address_2_1", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name_3_1", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age_3_1", (resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address_3_1", (resolvedEntity.Attributes[8] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name_1_2", (resolvedEntity.Attributes[9] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age_1_2", (resolvedEntity.Attributes[10] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address_1_2", (resolvedEntity.Attributes[11] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name_2_2", (resolvedEntity.Attributes[12] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age_2_2", (resolvedEntity.Attributes[13] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address_2_2", (resolvedEntity.Attributes[14] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name_3_2", (resolvedEntity.Attributes[15] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age_3_2", (resolvedEntity.Attributes[16] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address_3_2", (resolvedEntity.Attributes[17] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Start and end ordinals of -2...2
        /// </summary>
        [TestMethod]
        public async Task TestNegativeStartOrdinal()
        {
            string testName = "TestNegativeStartOrdinal";
            string entityName = "ThreeMusketeers";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address"]
            // Expand -2...2, renameFormat = {m}{o}
            // Since we don't allow negative ordinals, output should be 0...2
            Assert.AreEqual(9, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name0", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age0", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address0", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name1", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age1", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address1", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name2", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age2", (resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address2", (resolvedEntity.Attributes[8] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Start ordinal greater than end ordinal
        /// </summary>
        [TestMethod]
        public async Task TestStartGTEndOrdinal()
        {
            string testName = "TestStartGTEndOrdinal";
            string entityName = "ThreeMusketeers";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            // A warning should be logged when startOrdinal > endOrdinal
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    if (!message.Contains("startOrdinal 2 should not be greater than endOrdinal 0"))
                    {
                        Assert.Fail($"'Some unexpected failure - {message}!");
                    }
                }
            }, CdmStatusLevel.Warning);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address"]
            // Expand 2...0, renameFormat = {m}{o}
            // No array expansion happens here so the input just passes through
            Assert.AreEqual(3, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Same start and end ordinals
        /// </summary>
        [TestMethod]
        public async Task TestSameStartEndOrdinals()
        {
            string testName = "TestSameStartEndOrdinals";
            string entityName = "ThreeMusketeers";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address"]
            // Expand 1...1, renameFormat = {m}{o}
            Assert.AreEqual(3, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name1", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age1", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address1", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Combine ArrayExpansion, RenameAttributes, and IncludeAttributes in a single projection
        /// </summary>
        [TestMethod]
        public async Task TestCombineOps()
        {
            string testName = "TestCombineOps";
            string entityName = "ThreeMusketeers";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address"]
            // Expand 1...3, renameFormat = {m}{o}, include [name, age1]
            Assert.AreEqual(4, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name1", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name2", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name3", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age1", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Expansion on a polymorphic source
        /// </summary>
        [TestMethod]
        public async Task TestPolymorphic()
        {
            string testName = "TestPolymorphic";
            string entityName = "BusinessPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number"]
            // Expand 1...2, renameFormat = {m}{o}
            Assert.AreEqual(11, resolvedEntity.Attributes.Count);
            Assert.AreEqual("count", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("emailId1", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address1", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("isPrimary1", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneId1", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("number1", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("emailId2", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address2", (resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("isPrimary2", (resolvedEntity.Attributes[8] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneId2", (resolvedEntity.Attributes[9] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("number2", (resolvedEntity.Attributes[10] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// ArrayExpansion on a polymorphic source
        /// </summary>
        [TestMethod]
        public async Task TestPolymorphicProj()
        {
            string testName = "TestPolymorphicProj";
            string entityName = "BusinessPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                if (resOpt.Contains("structured"))
                {
                    // Array expansion is not supported on an attribute group yet.
                    continue;
                }

                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number"]
            // Expand 1...2, renameFormat = {m}{o}
            Assert.AreEqual(10, resolvedEntity.Attributes.Count);
            Assert.AreEqual("emailId1", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address1", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("isPrimary1", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneId1", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("number1", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("emailId2", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address2", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("isPrimary2", (resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneId2", (resolvedEntity.Attributes[8] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("number2", (resolvedEntity.Attributes[9] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Expansion on an array source
        /// NOTE: This is not supported in resolution guidance due to ordinals from a previous resolution guidance
        /// not being removed for the next resolution guidance, resulting in ordinals being skipped over in the new 
        /// resolution guidance as it thinks it has already done that round
        /// </summary>
        [TestMethod]
        public async Task TestArraySource()
        {
            string testName = "TestArraySource";
            string entityName = "FriendGroup";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["personCount", "name1", "age1", "address1", "name2", "age2", "address2"]
            // Expand 1...2, renameFormat = {m}_{o}
            // Since resolution guidance doesn't support doing an expansion on an array source, we end up with the
            // following result where it skips expanding attributes with the same ordinal (ex. name1_1, name2_2)
            Assert.AreEqual(9, resolvedEntity.Attributes.Count);
            Assert.AreEqual("count_", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("personCount_1", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name2_1", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age2_1", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address2_1", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("personCount_2", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name1_2", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age1_2", (resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address1_2", (resolvedEntity.Attributes[8] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// ArrayExpansion on an array source
        /// </summary>
        [TestMethod]
        public async Task TestArraySourceProj()
        {
            string testName = "TestArraySourceProj";
            string entityName = "FriendGroup";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["personCount", "name1", "age1", "address1", "name2", "age2", "address2"]
            // Expand 1...2, renameFormat = {m}_{o}
            Assert.AreEqual(14, resolvedEntity.Attributes.Count);
            Assert.AreEqual("personCount_1", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name1_1", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age1_1", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address1_1", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name2_1", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age2_1", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address2_1", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("personCount_2", (resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name1_2", (resolvedEntity.Attributes[8] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age1_2", (resolvedEntity.Attributes[9] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address1_2", (resolvedEntity.Attributes[10] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name2_2", (resolvedEntity.Attributes[11] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age2_2", (resolvedEntity.Attributes[12] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address2_2", (resolvedEntity.Attributes[13] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Expansion on an entity with an attribute group
        /// </summary>
        [TestMethod]
        public async Task TestGroup()
        {
            string testName = "TestGroup";
            string entityName = "ThreeMusketeers";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address"]
            // Expand 1...3, renameFormat = {m}{o}
            Assert.AreEqual(10, resolvedEntity.Attributes.Count);
            Assert.AreEqual("count", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name1", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age1", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address1", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name2", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age2", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address2", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name3", (resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age3", (resolvedEntity.Attributes[8] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address3", (resolvedEntity.Attributes[9] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// ArrayExpansion on an entity with an attribute group
        /// </summary>
        [TestMethod]
        public async Task TestGroupProj()
        {
            string testName = "TestGroupProj";
            string entityName = "ThreeMusketeers";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address"]
            // Expand 1...3, renameFormat = {m}{o}
            Assert.AreEqual(9, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name1", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age1", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address1", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name2", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age2", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address2", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name3", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age3", (resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address3", (resolvedEntity.Attributes[8] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// ArrayExpansion with a condition
        /// </summary>
        [TestMethod]
        public async Task TestConditionalProj()
        {
            string testName = "TestConditionalProj";
            string entityName = "ThreeMusketeers";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address"]
            // Expand 1...3, renameFormat = {m}{o}
            // No array expansion, condition was false
            Assert.AreEqual(3, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
        }
    }
}
