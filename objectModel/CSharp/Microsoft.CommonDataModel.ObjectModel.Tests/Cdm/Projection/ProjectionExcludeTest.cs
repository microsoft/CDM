// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
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
    /// A test class for testing the ExcludeAttributes operation in a projection as well as SelectsSomeAvoidNames in a resolution guidance
    /// </summary>
    [TestClass]
    public class ProjectionExcludeTest
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
        private string testsSubpath = Path.Combine("Cdm", "Projection", "ProjectionExcludeTest");

        /// <summary>
        /// Test for creating a projection with an ExcludeAttributes operation on an entity attribute using the object model  
        /// </summary>
        [TestMethod]
        public async Task TestEntityAttributeProjUsingObjectModel()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestEntityAttributeProjUsingObjectModel");
            corpus.Storage.Mount("local", new LocalAdapter(TestHelper.GetActualOutputFolderPath(testsSubpath, "TestEntityAttributeProjUsingObjectModel")));
            CdmFolderDefinition localRoot = corpus.Storage.FetchRootFolder("local");

            // Create an entity
            CdmEntityDefinition entity = ProjectionTestUtils.CreateEntity(corpus, localRoot);

            // Create a projection
            CdmProjection projection = ProjectionTestUtils.CreateProjection(corpus, localRoot);

            // Create an ExcludeAttributes operation
            CdmOperationExcludeAttributes excludeAttrsOp = corpus.MakeObject<CdmOperationExcludeAttributes>(CdmObjectType.OperationExcludeAttributesDef);
            excludeAttrsOp.ExcludeAttributes.Add("id");
            excludeAttrsOp.ExcludeAttributes.Add("date");
            projection.Operations.Add(excludeAttrsOp);

            // Create an entity reference to hold this projection
            CdmEntityReference projectionEntityRef = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            projectionEntityRef.ExplicitReference = projection;

            // Create an entity attribute that contains this projection and add this to the entity
            CdmEntityAttributeDefinition entityAttribute = corpus.MakeObject<CdmEntityAttributeDefinition>(CdmObjectType.EntityAttributeDef, "TestEntityAttribute");
            entityAttribute.Entity = projectionEntityRef;
            entity.Attributes.Add(entityAttribute);

            // Resolve the entity
            CdmEntityDefinition resolvedEntity = await entity.CreateResolvedEntityAsync($"Resolved_{entity.EntityName}.cdm.json", null, localRoot);

            // Verify correctness of the resolved attributes after running the ExcludeAttributes operation
            // Original set of attributes: ["id", "name", "value", "date"]
            // Excluded attributes: ["id", "date"]
            Assert.AreEqual(2, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("value", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Test for creating a projection with an ExcludeAttributes operation on an entity definition using the object model  
        /// </summary>
        [TestMethod]
        public async Task TestEntityProjUsingObjectModel()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestEntityProjUsingObjectModel");
            corpus.Storage.Mount("local", new LocalAdapter(TestHelper.GetActualOutputFolderPath(testsSubpath, "TestEntityProjUsingObjectModel")));
            CdmFolderDefinition localRoot = corpus.Storage.FetchRootFolder("local");

            // Create an entity
            CdmEntityDefinition entity = ProjectionTestUtils.CreateEntity(corpus, localRoot);

            // Create a projection
            CdmProjection projection = ProjectionTestUtils.CreateProjection(corpus, localRoot);

            // Create an ExcludeAttributes operation
            CdmOperationExcludeAttributes excludeAttrsOp = corpus.MakeObject<CdmOperationExcludeAttributes>(CdmObjectType.OperationExcludeAttributesDef);
            excludeAttrsOp.ExcludeAttributes.Add("name");
            excludeAttrsOp.ExcludeAttributes.Add("value");
            projection.Operations.Add(excludeAttrsOp);

            // Create an entity reference to hold this projection
            CdmEntityReference projectionEntityRef = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            projectionEntityRef.ExplicitReference = projection;

            // Set the entity's ExtendEntity to be the projection
            entity.ExtendsEntity = projectionEntityRef;

            // Resolve the entity
            CdmEntityDefinition resolvedEntity = await entity.CreateResolvedEntityAsync($"Resolved_{entity.EntityName}.cdm.json", null, localRoot);

            // Verify correctness of the resolved attributes after running the ExcludeAttributes operation
            // Original set of attributes: ["id", "name", "value", "date"]
            // Excluded attributes: ["name", "value"]
            Assert.AreEqual(2, resolvedEntity.Attributes.Count);
            Assert.AreEqual("id", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("date", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Test for creating nested projections with ExcludeAttributes operations using the object model  
        /// </summary>
        [TestMethod]
        public async Task TestNestedProjUsingObjectModel()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestNestedProjUsingObjectModel");
            corpus.Storage.Mount("local", new LocalAdapter(TestHelper.GetActualOutputFolderPath(testsSubpath, "TestNestedProjUsingObjectModel")));
            CdmFolderDefinition localRoot = corpus.Storage.FetchRootFolder("local");

            // Create an entity
            CdmEntityDefinition entity = ProjectionTestUtils.CreateEntity(corpus, localRoot);

            // Create a projection
            CdmProjection projection = ProjectionTestUtils.CreateProjection(corpus, localRoot);

            // Create an ExcludeAttributes operation
            CdmOperationExcludeAttributes excludeAttrsOp = corpus.MakeObject<CdmOperationExcludeAttributes>(CdmObjectType.OperationExcludeAttributesDef);
            excludeAttrsOp.ExcludeAttributes.Add("id");
            excludeAttrsOp.ExcludeAttributes.Add("date");
            projection.Operations.Add(excludeAttrsOp);

            // Create an entity reference to hold this projection
            CdmEntityReference projectionEntityRef = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            projectionEntityRef.ExplicitReference = projection;

            // Create another projection that uses the previous projection as its source
            CdmProjection projection2 = corpus.MakeObject<CdmProjection>(CdmObjectType.ProjectionDef);
            projection2.Source = projectionEntityRef;

            // Create an ExcludeAttributes operation
            CdmOperationExcludeAttributes excludeAttrsOp2 = corpus.MakeObject<CdmOperationExcludeAttributes>(CdmObjectType.OperationExcludeAttributesDef);
            excludeAttrsOp2.ExcludeAttributes.Add("value");
            projection2.Operations.Add(excludeAttrsOp2);

            // Create an entity reference to hold this projection
            CdmEntityReference projectionEntityRef2 = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            projectionEntityRef2.ExplicitReference = projection2;

            // Create an entity attribute that contains this projection and add this to the entity
            CdmEntityAttributeDefinition entityAttribute = corpus.MakeObject<CdmEntityAttributeDefinition>(CdmObjectType.EntityAttributeDef, "TestEntityAttribute");
            entityAttribute.Entity = projectionEntityRef2;
            entity.Attributes.Add(entityAttribute);

            // Resolve the entity
            CdmEntityDefinition resolvedEntity = await entity.CreateResolvedEntityAsync($"Resolved_{entity.EntityName}.cdm.json", null, localRoot);

            // Verify correctness of the resolved attributes after running the ExcludeAttributes operations
            // Original set of attributes: ["id", "name", "value", "date"]
            // Excluded attributes: ["id", "date"], ["value"]
            Assert.AreEqual(1, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Test for creating a projection with an ExcludeAttributes operation and a condition using the object model  
        /// </summary>
        [TestMethod]
        public async Task TestConditionalProjUsingObjectModel()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestConditionalProjUsingObjectModel");
            corpus.Storage.Mount("local", new LocalAdapter(TestHelper.GetActualOutputFolderPath(testsSubpath, "TestConditionalProjUsingObjectModel")));
            CdmFolderDefinition localRoot = corpus.Storage.FetchRootFolder("local");

            // Create an entity
            CdmEntityDefinition entity = ProjectionTestUtils.CreateEntity(corpus, localRoot);

            // Create a projection with a condition that states the operation should only execute when the resolution directive is 'referenceOnly'
            CdmProjection projection = ProjectionTestUtils.CreateProjection(corpus, localRoot);
            projection.Condition = "referenceOnly==true";

            // Create an ExcludeAttributes operation
            CdmOperationExcludeAttributes excludeAttrsOp = corpus.MakeObject<CdmOperationExcludeAttributes>(CdmObjectType.OperationExcludeAttributesDef);
            excludeAttrsOp.ExcludeAttributes.Add("id");
            excludeAttrsOp.ExcludeAttributes.Add("date");
            projection.Operations.Add(excludeAttrsOp);

            // Create an entity reference to hold this projection
            CdmEntityReference projectionEntityRef = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            projectionEntityRef.ExplicitReference = projection;

            // Create an entity attribute that contains this projection and add this to the entity
            CdmEntityAttributeDefinition entityAttribute = corpus.MakeObject<CdmEntityAttributeDefinition>(CdmObjectType.EntityAttributeDef, "TestEntityAttribute");
            entityAttribute.Entity = projectionEntityRef;
            entity.Attributes.Add(entityAttribute);

            // Create resolution options with the 'referenceOnly' directive
            ResolveOptions resOpt = new ResolveOptions(entity.InDocument);
            resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "referenceOnly" });

            // Resolve the entity with 'referenceOnly'
            CdmEntityDefinition resolvedEntityWithReferenceOnly = await entity.CreateResolvedEntityAsync($"Resolved_{entity.EntityName}.cdm.json", resOpt, localRoot);

            // Verify correctness of the resolved attributes after running the ExcludeAttributes operation
            // Original set of attributes: ["id", "name", "value", "date"]
            // Excluded attributes: ["id", "date"]
            Assert.AreEqual(2, resolvedEntityWithReferenceOnly.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntityWithReferenceOnly.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("value", (resolvedEntityWithReferenceOnly.Attributes[1] as CdmTypeAttributeDefinition).Name);

            // Now resolve the entity with the 'structured' directive
            resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "structured" });
            CdmEntityDefinition resolvedEntityWithStructured = await entity.CreateResolvedEntityAsync($"Resolved_{entity.EntityName}.cdm.json", resOpt, localRoot);

            // Verify correctness of the resolved attributes after running the ExcludeAttributes operation
            // Original set of attributes: ["id", "name", "value", "date"]
            // Excluded attributes: none, condition was false
            Assert.AreEqual(4, resolvedEntityWithStructured.Attributes.Count);
            Assert.AreEqual("id", (resolvedEntityWithStructured.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name", (resolvedEntityWithStructured.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("value", (resolvedEntityWithStructured.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("date", (resolvedEntityWithStructured.Attributes[3] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// ExcludeAttributes on an entity attribute
        /// </summary>
        [TestMethod]
        public async Task TestExcludeAttributes()
        {
            string testName = "TestExcludeAttributes";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Excluded attributes: ["address", "phoneNumber", "email"]
            Assert.AreEqual(2, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// SelectsSomeAvoidNames on an entity attribute
        /// </summary>
        [TestMethod]
        public async Task TestSSAN()
        {
            string testName = "TestSSAN";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["PersonInfoName", "PersonInfoAge", "PersonInfoAddress", "PersonInfoPhoneNumber", "PersonInfoEmail"]
            // Excluded attributes: ["PersonInfoAddress", "PersonInfoPhoneNumber", "PersonInfoEmail"]
            Assert.AreEqual(2, resolvedEntity.Attributes.Count, 2);
            Assert.AreEqual("PersonInfoName", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfoAge", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// SelectsSomeAvoidNames on an entity attribute that has renameFormat = "{m}"
        /// </summary>
        [TestMethod]
        public async Task TestSSANRename()
        {
            string testName = "TestSSANRename";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Excluded attributes: ["address", "phoneNumber", "email"]
            Assert.AreEqual(2, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// A nested ExcludeAttributes operation in a single projection
        /// </summary>
        [TestMethod]
        public async Task TestSingleNestedProj()
        {
            string testName = "TestSingleNestedProj";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Excluded attributes: ["address", "phoneNumber", "email"]
            Assert.AreEqual(2, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Nested projections with ExcludeAttributes
        /// </summary>
        [TestMethod]
        public async Task TestNestedProj()
        {
            string testName = "TestNestedProj";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Excluded attributes: ["address", "phoneNumber", "email"], ["age"]
            Assert.AreEqual(1, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Multiple ExcludeAttributes in a single projection
        /// </summary>
        [TestMethod]
        public async Task TestMultipleExclude()
        {
            string testName = "TestMultipleExclude";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Excluded attributes: ["name", "age", "address"], ["address", "email"]
            Assert.AreEqual(4, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// ExcludeAttributes on an entity definition
        /// </summary>
        [TestMethod]
        public async Task TestExtendsEntityProj()
        {
            string testName = "TestExtendsEntityProj";
            string entityName = "Child";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Excluded attributes: ["phoneNumber", "email"]
            Assert.AreEqual(3, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// SelectsSomeAvoidNames on an entity definition
        /// </summary>
        [TestMethod]
        public async Task TestExtendsEntity()
        {
            string testName = "TestExtendsEntity";
            string entityName = "Child";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Excluded attributes: ["phoneNumber", "email"]
            Assert.AreEqual(3, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// ExcludeAttributes on a polymorphic source
        /// </summary>
        [TestMethod]
        public async Task TestPolymorphicProj()
        {
            string testName = "TestPolymorphicProj";
            string entityName = "BusinessPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
            // Excluded attributes: ["socialId", "account"]
            Assert.AreEqual(5, resolvedEntity.Attributes.Count);
            Assert.AreEqual("emailId", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("isPrimary", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneId", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("number", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// SelectsSomeAvoidNames on a polymorphic source
        /// </summary>
        [TestMethod]
        public async Task TestPolymorphic()
        {
            string testName = "TestPolymorphic";
            string entityName = "BusinessPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
            // Excluded attributes: ["socialId", "account"]
            Assert.AreEqual(5, resolvedEntity.Attributes.Count);
            Assert.AreEqual("emailId", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("isPrimary", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneId", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("number", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// ExcludeAttributes on an array source
        /// </summary>
        [TestMethod]
        public async Task TestArraySourceProj()
        {
            string testName = "TestArraySourceProj";
            string entityName = "FriendGroup";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["personCount", "name1", "age1", "address1", "phoneNumber1", "email1", ..., "email3"] (16 total)
            // Excluded attributes: ["age1", "age2", "age3"]
            Assert.AreEqual(13, resolvedEntity.Attributes.Count);
            Assert.AreEqual("personCount", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name1", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address1", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber1", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email1", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name2", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address2", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber2", (resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email2", (resolvedEntity.Attributes[8] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name3", (resolvedEntity.Attributes[9] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address3", (resolvedEntity.Attributes[10] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber3", (resolvedEntity.Attributes[11] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email3", (resolvedEntity.Attributes[12] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// SelectsSomeAvoidNames on an array source
        /// </summary>
        [TestMethod]
        public async Task TestArraySource()
        {
            string testName = "TestArraySource";
            string entityName = "FriendGroup";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["GroupOfPeoplePersonCount", "GroupOfPeopleName1", "GroupOfPeopleAge1", "GroupOfPeopleAddress1",
            //                              "GroupOfPeoplePhoneNumber1", "GroupOfPeopleEmail1", ..., "GroupOfPeopleEmail3"] (16 total)
            // Excluded attributes: ["GroupOfPeopleAge1", "GroupOfPeopleAge2", "GroupOfPeopleAge3"]
            Assert.AreEqual(13, resolvedEntity.Attributes.Count);
            Assert.AreEqual("GroupOfPeoplePersonCount", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeopleName1", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeopleAddress1", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeoplePhoneNumber1", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeopleEmail1", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeopleName2", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeopleAddress2", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeoplePhoneNumber2", (resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeopleEmail2", (resolvedEntity.Attributes[8] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeopleName3", (resolvedEntity.Attributes[9] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeopleAddress3", (resolvedEntity.Attributes[10] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeoplePhoneNumber3", (resolvedEntity.Attributes[11] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeopleEmail3", (resolvedEntity.Attributes[12] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// SelectsSomeAvoidNames on an array source that has renameFormat = "{m}"
        /// </summary>
        [TestMethod]
        public async Task TestArraySourceRename()
        {
            string testName = "TestArraySourceRename";
            string entityName = "FriendGroup";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["personCount", "name1", "age1", "address1", "phoneNumber1", "email1", ..., "email3"] (16 total)
            // Excluded attributes: ["age1", "age2", "age3"]
            Assert.AreEqual(13, resolvedEntity.Attributes.Count);
            Assert.AreEqual("personCount", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name1", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address1", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber1", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email1", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name2", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address2", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber2", (resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email2", (resolvedEntity.Attributes[8] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name3", (resolvedEntity.Attributes[9] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address3", (resolvedEntity.Attributes[10] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber3", (resolvedEntity.Attributes[11] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email3", (resolvedEntity.Attributes[12] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// ExcludeAttributes with a condition
        /// </summary>
        [TestMethod]
        public async Task TestConditionalProj()
        {
            string testName = "TestConditionalProj";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "referenceOnly" });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Excluded attributes: ["address", "phoneNumber", "email"]
            Assert.AreEqual(2, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);

            CdmEntityDefinition resolvedEntity2 = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Excluded attributes: none, condition was false
            Assert.AreEqual(5, resolvedEntity2.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity2.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity2.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity2.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (resolvedEntity2.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (resolvedEntity2.Attributes[4] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// ExcludeAttributes with an empty exclude attributes list
        /// </summary>
        [TestMethod]
        public async Task TestEmptyExclude()
        {
            string testName = "TestEmptyExclude";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Excluded attributes: []
            Assert.AreEqual(5, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// ExcludeAttributes on an entity with an attribute group
        /// </summary>
        [TestMethod]
        public async Task TestGroupProj()
        {
            string testName = "TestGroupProj";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Excluded attributes: ["address", "phoneNumber", "email"]
            Assert.AreEqual(2, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// SelectsSomeAvoidNames on an entity with an attribute group
        /// </summary>
        [TestMethod]
        public async Task TestGroup()
        {
            string testName = "TestGroup";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["PersonInfoName", "PersonInfoAge", "PersonInfoAddress", "PersonInfoPhoneNumber", "PersonInfoEmail"]
            // Excluded attributes: ["PersonInfoAddress", "PersonInfoPhoneNumber", "PersonInfoEmail"]
            Assert.AreEqual(2, resolvedEntity.Attributes.Count);
            Assert.AreEqual("PersonInfoName", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfoAge", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// SelectsSomeAvoidNames on an entity with an attribute group that has renameFormat = "{m}"
        /// </summary>
        [TestMethod]
        public async Task TestGroupRename()
        {
            string testName = "TestGroupRename";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Excluded attributes: ["address", "phoneNumber", "email"]
            Assert.AreEqual(2, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// ExcludeAttributes with an entity attribute name on an inline entity reference that contains entity attributes
        /// This is testing that, for the case of the structured directive, we can filter using the name of an entity attribute
        /// in the inline entity reference to exclude the entire entity attribute group
        /// </summary>
        [TestMethod]
        public async Task TestEANameProj()
        {
            string testName = "TestEANameProj";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "structured" });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email", "title", "company", "tenure"]
            // Excluded attributes: ["OccupationInfo"] (name of entity attribute that contains "title", "company", "tenure")
            Assert.AreEqual(1, resolvedEntity.Attributes.Count); // attribute group created because of structured directive
            CdmAttributeGroupDefinition attGroup = (resolvedEntity.Attributes[0] as CdmAttributeGroupReference).ExplicitReference as CdmAttributeGroupDefinition;
            Assert.AreEqual(5, attGroup.Members.Count);
            Assert.AreEqual("name", (attGroup.Members[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (attGroup.Members[1] as CdmTypeAttributeDefinition).Name, "age");
            Assert.AreEqual("address", (attGroup.Members[2] as CdmTypeAttributeDefinition).Name, "address");
            Assert.AreEqual("phoneNumber", (attGroup.Members[3] as CdmTypeAttributeDefinition).Name, "phoneNumber");
            Assert.AreEqual("email", (attGroup.Members[4] as CdmTypeAttributeDefinition).Name, "email");
        }

        /// <summary>
        /// Test resolving a type attribute with a exclude attributes operation
        /// </summary>
        [TestMethod]
        public async Task TestTypeAttributeProj()
        {
            string testName = "TestTypeAttributeProj";
            string entityName = "Person";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "referenceOnly" });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Exclude attributes ["address"]
            Assert.AreEqual(4, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
        }
    }
}
