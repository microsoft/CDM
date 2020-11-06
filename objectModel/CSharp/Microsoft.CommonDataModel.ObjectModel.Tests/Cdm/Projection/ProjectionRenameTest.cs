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
    /// A test class for testing the RenameAttributes operation in a projection as well as SelectsSomeAvoidNames in a resolution guidance
    /// </summary>
    [TestClass]
    public class ProjectionRenameTest
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
            new List<string> { "normalized", "structured" },
            new List<string> { "referenceOnly", "normalized", "structured" },
        };

        /// <summary>
        /// The path between TestDataPath and TestName
        /// </summary>
        private readonly string testsSubpath = Path.Combine("Cdm", "Projection", "ProjectionRenameTest");

        /// <summary>
        /// Test for creating a projection with an RenameAttributes operation on an entity attribute using the object model  
        /// </summary>
        [TestMethod]
        public async Task TestEntityAttributeProjUsingObjectModel()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestEntityAttributeProjUsingObjectModel");
            CdmFolderDefinition localRoot = corpus.Storage.FetchRootFolder("local");

            // Create an entity
            CdmEntityDefinition entity = ProjectionTestUtils.CreateEntity(corpus, localRoot);

            // Create a projection
            CdmProjection projection = ProjectionTestUtils.CreateProjection(corpus, localRoot);

            // Create an RenameAttributes operation
            CdmOperationRenameAttributes renameAttrsOp = corpus.MakeObject<CdmOperationRenameAttributes>(CdmObjectType.OperationRenameAttributesDef);
            renameAttrsOp.RenameFormat = "{a}-{o}-{m}";
            projection.Operations.Add(renameAttrsOp);

            // Create an entity reference to hold this projection
            CdmEntityReference projectionEntityRef = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            projectionEntityRef.ExplicitReference = projection;

            // Create an entity attribute that contains this projection and add this to the entity
            CdmEntityAttributeDefinition entityAttribute = corpus.MakeObject<CdmEntityAttributeDefinition>(CdmObjectType.EntityAttributeDef, "TestEntityAttribute");
            entityAttribute.Entity = projectionEntityRef;
            entity.Attributes.Add(entityAttribute);

            // Resolve the entity.
            CdmEntityDefinition resolvedEntity = await entity.CreateResolvedEntityAsync($"Resolved_{entity.EntityName}.cdm.json", null, localRoot);

            // Verify correctness of the resolved attributes after running the RenameAttributes operation
            // Original set of attributes: ["id", "name", "value", "date"]
            // Rename all attributes with format "{a}-{o}-{m}"
            Assert.AreEqual(4, resolvedEntity.Attributes.Count);
            Assert.AreEqual("TestEntityAttribute--id", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("TestEntityAttribute--name", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("TestEntityAttribute--value", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("TestEntityAttribute--date", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Test for creating a projection with an RenameAttributes operation on an entity definition using the object model
        /// </summary>
        [TestMethod]
        public async Task TestEntityProjUsingObjectModel()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestEntityProjUsingObjectModel");
            CdmFolderDefinition localRoot = corpus.Storage.FetchRootFolder("local");

            // Create an entity
            CdmEntityDefinition entity = ProjectionTestUtils.CreateEntity(corpus, localRoot);

            // Create a projection
            CdmProjection projection = ProjectionTestUtils.CreateProjection(corpus, localRoot);

            // Create an RenameAttributes operation
            CdmOperationRenameAttributes renameAttrsOp = corpus.MakeObject<CdmOperationRenameAttributes>(CdmObjectType.OperationRenameAttributesDef);
            renameAttrsOp.RenameFormat = "{A}.{o}.{M}";
            projection.Operations.Add(renameAttrsOp);

            // Create an entity reference to hold this projection
            CdmEntityReference projectionEntityRef = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            projectionEntityRef.ExplicitReference = projection;

            // Set the entity's ExtendEntity to be the projection
            entity.ExtendsEntity = projectionEntityRef;

            // Resolve the entity
            CdmEntityDefinition resolvedEntity = await entity.CreateResolvedEntityAsync($"Resolved_{entity.EntityName}.cdm.json", null, localRoot);

            // Verify correctness of the resolved attributes after running the RenameAttributes operation
            // Original set of attributes: ["id", "name", "value", "date"]
            // Rename all attributes with format {A}.{o}.{M}
            Assert.AreEqual(4, resolvedEntity.Attributes.Count);
            Assert.AreEqual("..Id", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("..Name", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("..Value", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("..Date", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Test for creating nested projections with RenameAttributes operations using the object model
        /// </summary>
        [TestMethod]
        public async Task TestNestedProjUsingObjectModel()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestNestedProjUsingObjectModel");
            CdmFolderDefinition localRoot = corpus.Storage.FetchRootFolder("local");

            // Create an entity
            CdmEntityDefinition entity = ProjectionTestUtils.CreateEntity(corpus, localRoot);

            // Create a projection
            CdmProjection projection = ProjectionTestUtils.CreateProjection(corpus, localRoot);

            // Create an RenameAttributes operation
            CdmOperationRenameAttributes renameAttrsOp = corpus.MakeObject<CdmOperationRenameAttributes>(CdmObjectType.OperationRenameAttributesDef);
            renameAttrsOp.RenameFormat = "{A}.{o}.{M}";
            projection.Operations.Add(renameAttrsOp);

            // Create an entity reference to hold this projection
            CdmEntityReference projectionEntityRef = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            projectionEntityRef.ExplicitReference = projection;

            // Create another projection that uses the previous projection as its source
            CdmProjection projection2 = corpus.MakeObject<CdmProjection>(CdmObjectType.ProjectionDef);
            projection2.Source = projectionEntityRef;

            // Create an RenameAttributes operation
            CdmOperationRenameAttributes renameAttrsOp2 = corpus.MakeObject<CdmOperationRenameAttributes>(CdmObjectType.OperationRenameAttributesDef);
            renameAttrsOp2.RenameFormat = "{a}-{o}-{m}";
            renameAttrsOp2.ApplyTo = new List<string>()
            {
                "name"
            };
            projection2.Operations.Add(renameAttrsOp2);

            // Create an entity reference to hold this projection
            CdmEntityReference projectionEntityRef2 = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            projectionEntityRef2.ExplicitReference = projection2;

            // Create an entity attribute that contains this projection and add this to the entity
            CdmEntityAttributeDefinition entityAttribute = corpus.MakeObject<CdmEntityAttributeDefinition>(CdmObjectType.EntityAttributeDef, "TestEntityAttribute");
            entityAttribute.Entity = projectionEntityRef2;
            entity.Attributes.Add(entityAttribute);

            // Resolve the entity
            CdmEntityDefinition resolvedEntity = await entity.CreateResolvedEntityAsync($"Resolved_{entity.EntityName}.cdm.json", null, localRoot);

            // Verify correctness of the resolved attributes after running the RenameAttributes operations
            // Original set of attributes: ["id", "name", "value", "date"]
            // Rename all attributes attributes with format {A}.{o}.{M}, then rename "name" with format "{a}-{o}-{m}"
            Assert.AreEqual(4, resolvedEntity.Attributes.Count);
            Assert.AreEqual("TestEntityAttribute..Id", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("TestEntityAttribute--TestEntityAttribute..Name", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("TestEntityAttribute..Value", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("TestEntityAttribute..Date", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Test correctness when renameFormat has repeated pattern
        /// </summary>
        [TestMethod]
        public async Task TestRepeatedPatternProj()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestEntityAttributeProjUsingObjectModel");
            corpus.Storage.Mount("local", new LocalAdapter(TestHelper.GetActualOutputFolderPath(testsSubpath, "TestEntityAttributeProjUsingObjectModel")));
            CdmFolderDefinition localRoot = corpus.Storage.FetchRootFolder("local");

            // Create an entity
            CdmEntityDefinition entity = ProjectionTestUtils.CreateEntity(corpus, localRoot);

            // Create a projection
            CdmProjection projection = ProjectionTestUtils.CreateProjection(corpus, localRoot);

            // Create an RenameAttributes operation
            CdmOperationRenameAttributes renameAttrsOp = corpus.MakeObject<CdmOperationRenameAttributes>(CdmObjectType.OperationRenameAttributesDef);
            renameAttrsOp.RenameFormat = "{a}-{M}-{o}-{A}-{m}-{O}";
            projection.Operations.Add(renameAttrsOp);

            // Create an entity reference to hold this projection
            CdmEntityReference projectionEntityRef = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            projectionEntityRef.ExplicitReference = projection;

            // Create an entity attribute that contains this projection and add this to the entity
            CdmEntityAttributeDefinition entityAttribute = corpus.MakeObject<CdmEntityAttributeDefinition>(CdmObjectType.EntityAttributeDef, "TestEntityAttribute");
            entityAttribute.Entity = projectionEntityRef;
            entity.Attributes.Add(entityAttribute);

            // Resolve the entity.
            CdmEntityDefinition resolvedEntity = await entity.CreateResolvedEntityAsync($"Resolved_{entity.EntityName}.cdm.json", null, localRoot);

            // Verify correctness of the resolved attributes after running the RenameAttributes operation
            // Original set of attributes: ["id", "name", "value", "date"]
            // Rename all attributes with format "{a}-{M}-{o}-{A}-{m}-{O}"
            Assert.AreEqual(4, resolvedEntity.Attributes.Count);
            Assert.AreEqual("TestEntityAttribute-Id--TestEntityAttribute-id-", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("TestEntityAttribute-Name--TestEntityAttribute-name-", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("TestEntityAttribute-Value--TestEntityAttribute-value-", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("TestEntityAttribute-Date--TestEntityAttribute-date-", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Test for creating a projection with an RenameAttributes operation and a condition using the object model
        /// </summary>
        [TestMethod]
        public async Task TestConditionalProjUsingObjectModel()
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, "TestConditionalProjUsingObjectModel");
            corpus.Storage.Mount("local", new LocalAdapter(TestHelper.GetActualOutputFolderPath(testsSubpath, "TestConditionalProjUsingObjectModel")));
            CdmFolderDefinition localRoot = corpus.Storage.FetchRootFolder("local");

            // Create an entity.
            CdmEntityDefinition entity = ProjectionTestUtils.CreateEntity(corpus, localRoot);

            // Create a projection with a condition that states the operation should only execute when the resolution directive is 'referenceOnly'.
            CdmProjection projection = ProjectionTestUtils.CreateProjection(corpus, localRoot);
            projection.Condition = "referenceOnly==true";

            // Create an RenameAttributes operation
            CdmOperationRenameAttributes renameAttrsOp = corpus.MakeObject<CdmOperationRenameAttributes>(CdmObjectType.OperationRenameAttributesDef);
            renameAttrsOp.RenameFormat = "{A}.{o}.{M}";
            projection.Operations.Add(renameAttrsOp);

            // Create an entity reference to hold this projection.
            CdmEntityReference projectionEntityRef = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            projectionEntityRef.ExplicitReference = projection;

            // Create an entity attribute that contains this projection and add this to the entity.
            CdmEntityAttributeDefinition entityAttribute = corpus.MakeObject<CdmEntityAttributeDefinition>(CdmObjectType.EntityAttributeDef, "TestEntityAttribute");
            entityAttribute.Entity = projectionEntityRef;
            entity.Attributes.Add(entityAttribute);

            // Create resolution options with the 'referenceOnly' directive.
            ResolveOptions resOpt = new ResolveOptions(entity.InDocument)
            {
                Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "referenceOnly" })
            };

            // Resolve the entity with 'referenceOnly'
            CdmEntityDefinition resolvedEntityWithReferenceOnly = await entity.CreateResolvedEntityAsync($"Resolved_{entity.EntityName}.cdm.json", resOpt, localRoot);

            // Verify correctness of the resolved attributes after running the RenameAttributes operation
            // Original set of attributes: ["id", "name", "value", "date"]
            // Rename all attributes with format "{A}.{o}.{M}"
            Assert.AreEqual(4, resolvedEntityWithReferenceOnly.Attributes.Count);
            Assert.AreEqual("TestEntityAttribute..Id", (resolvedEntityWithReferenceOnly.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("TestEntityAttribute..Name", (resolvedEntityWithReferenceOnly.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("TestEntityAttribute..Value", (resolvedEntityWithReferenceOnly.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("TestEntityAttribute..Date", (resolvedEntityWithReferenceOnly.Attributes[3] as CdmTypeAttributeDefinition).Name);

            // Now resolve the entity with the 'structured' directive
            resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "structured" });
            CdmEntityDefinition resolvedEntityWithStructured = await entity.CreateResolvedEntityAsync($"Resolved_{entity.EntityName}.cdm.json", resOpt, localRoot);

            // Verify correctness of the resolved attributes after running the RenameAttributes operation
            // Original set of attributes: ["id", "name", "value", "date"]
            // Renamed attributes: none, condition was false
            Assert.AreEqual(4, resolvedEntityWithStructured.Attributes.Count);
            Assert.AreEqual("id", (resolvedEntityWithStructured.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name", (resolvedEntityWithStructured.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("value", (resolvedEntityWithStructured.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("date", (resolvedEntityWithStructured.Attributes[3] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// RenameAttributes with a plain string as rename format.
        /// </summary>
        [TestMethod]
        public async Task TestRenameFormatAsStringProj()
        {
            string testName = "TestRenameFormatAsStringProj";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"].
            // Renamed attribute "address" with format "whereYouLive".
            Assert.AreEqual(5, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("whereYouLive", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// RenameFormat on an entity attribute.
        /// </summary>
        [TestMethod]
        public async Task TestRenameFormat()
        {
            string testName = "TestRenameFormat";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["PersonInfoName", "PersonInfoAge", "PersonInfoAddress", "PersonInfoPhoneNumber", "PersonInfoEmail"].
            // Renamed all attributes with format {a}.{o}.{M}
            Assert.AreEqual(5, resolvedEntity.Attributes.Count);
            Assert.AreEqual("PersonInfo..Name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo..Age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo..Address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo..PhoneNumber", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo..Email", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// RenameFormat on an entity attribute.
        /// </summary>
        [TestMethod]
        public async Task TestRenameFormatProj()
        {
            string testName = "TestRenameFormatProj";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["PersonInfoName", "PersonInfoAge", "PersonInfoAddress", "PersonInfoPhoneNumber", "PersonInfoEmail"].
            // Renamed all attributes with format {a}.{o}.{M}
            Assert.AreEqual(5, resolvedEntity.Attributes.Count);
            Assert.AreEqual("PersonInfo..Name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo..Age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo..Address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo..PhoneNumber", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo..Email", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// A nested RenameAttributes operation in a single projection.
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

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"].
            // Renamed all attributes with format "New{M}".
            Assert.AreEqual(5, resolvedEntity.Attributes.Count);
            Assert.AreEqual("NewName", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("NewAge", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("NewAddress", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("NewPhoneNumber", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("NewEmail", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Nested projections with RenameAttributes
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
            // Rename all attributes attributes with format {A}.{o}.{M}, then rename "age" with format "{a}-{o}-{m}"
            Assert.AreEqual(5, resolvedEntity.Attributes.Count);
            Assert.AreEqual("PersonInfo..Name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo--PersonInfo..Age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo..Address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo..PhoneNumber", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo..Email", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Multiple RenameAttributes in a single projection.
        /// </summary>
        [TestMethod]
        public async Task TestMultipleRename()
        {
            string testName = "TestMultipleRename";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Rename attributes "age" to "yearsOld" then "address" to "homePlace"
            Assert.AreEqual(7, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("yearsOld", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("homePlace", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// RenameFormat on an entity definition.
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

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"].
            // All attributes renamed with format "{a}.{o}.{M}".
            Assert.AreEqual(5, resolvedEntity.Attributes.Count);
            Assert.AreEqual("..name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("..age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("..address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("..phoneNumber", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("..email", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// RenameFormat on an entity definition.
        /// NOTE: this is not supported with resolution guidance.
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

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"].
            // Renamed attributes: [] with format "{a}.{o}.{M}".
            Assert.AreEqual(5, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// RenameAttributes on a polymorphic source
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
            // Renamed all attributes with format {A}.{o}.{M}
            Assert.AreEqual(7, resolvedEntity.Attributes.Count);
            Assert.AreEqual("ContactAt..EmailId", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("ContactAt..Address", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("ContactAt..IsPrimary", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("ContactAt..PhoneId", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("ContactAt..Number", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("ContactAt..SocialId", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("ContactAt..Account", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// RenameAttributes on a polymorphic source
        /// </summary>
        [TestMethod]
        public async Task TestPolymorphicApplyToProj()
        {
            string testName = "TestPolymorphicApplyToProj";
            string entityName = "BusinessPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
            // Renamed attributes: [address, number] with format {A}.{o}.{M}
            Assert.AreEqual(7, resolvedEntity.Attributes.Count);
            Assert.AreEqual("emailId", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("ContactAt..Address", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("isPrimary", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneId", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("ContactAt..Number", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("socialId", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("account", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
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
            // Renamed all attributes with format "{A}.{o}.{M}"
            Assert.AreEqual(7, resolvedEntity.Attributes.Count);
            Assert.AreEqual("ContactAt..EmailId", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("ContactAt..Address", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("ContactAt..IsPrimary", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("ContactAt..PhoneId", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("ContactAt..Number", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("ContactAt..SocialId", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("ContactAt..Account", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// RenameAttributes on an array source
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
            // Attributes renamed from format {a}{M} to {a}.{o}.{M}
            // NOTE: This behavior is different in the rename projection. The ordinal is this case is leaked by the resolution guidance
            Assert.AreEqual(16, resolvedEntity.Attributes.Count);
            Assert.AreEqual("GroupOfPeople..PersonCount", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople..Name1", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople..Age1", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople..Address1", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople..PhoneNumber1", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople..Email1", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople..Name2", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople..Age2", (resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople..Address2", (resolvedEntity.Attributes[8] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople..PhoneNumber2", (resolvedEntity.Attributes[9] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople..Email2", (resolvedEntity.Attributes[10] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople..Name3", (resolvedEntity.Attributes[11] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople..Age3", (resolvedEntity.Attributes[12] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople..Address3", (resolvedEntity.Attributes[13] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople..PhoneNumber3", (resolvedEntity.Attributes[14] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople..Email3", (resolvedEntity.Attributes[15] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// RenameFormat on an array source
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
            // Attributes renamed from format {a}{M} to {a}.{o}.{M}
            // NOTE: This behavior is different in the rename projection. The ordinal is this case is leaked by the resolution guidance
            Assert.AreEqual(16, resolvedEntity.Attributes.Count);
            Assert.AreEqual("GroupOfPeople..PersonCount", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople.1.Name1", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople.1.Age1", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople.1.Address1", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople.1.PhoneNumber1", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople.1.Email1", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople.2.Name2", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople.2.Age2", (resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople.2.Address2", (resolvedEntity.Attributes[8] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople.2.PhoneNumber2", (resolvedEntity.Attributes[9] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople.2.Email2", (resolvedEntity.Attributes[10] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople.3.Name3", (resolvedEntity.Attributes[11] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople.3.Age3", (resolvedEntity.Attributes[12] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople.3.Address3", (resolvedEntity.Attributes[13] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople.3.PhoneNumber3", (resolvedEntity.Attributes[14] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople.3.Email3", (resolvedEntity.Attributes[15] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// RenameFormat on an array source using apply to.
        /// </summary>
        [TestMethod]
        public async Task TestArraySourceRenameApplyToProj()
        {
            string testName = "TestArraySourceRenameApplyToProj";
            string entityName = "FriendGroup";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["personCount", "name1", "age1", "address1", "phoneNumber1", "email1", ..., "email3"] (16 total).
            // Renamed attributes: ["age1", "age2", "age3"] with the format "{a}.{o}.{M}".
            Assert.AreEqual(16, resolvedEntity.Attributes.Count);
            Assert.AreEqual("personCount", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name1", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople..Age1", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address1", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber1", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email1", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name2", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople..Age2", (resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address2", (resolvedEntity.Attributes[8] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber2", (resolvedEntity.Attributes[9] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email2", (resolvedEntity.Attributes[10] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name3", (resolvedEntity.Attributes[11] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("GroupOfPeople..Age3", (resolvedEntity.Attributes[12] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address3", (resolvedEntity.Attributes[13] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber3", (resolvedEntity.Attributes[14] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email3", (resolvedEntity.Attributes[15] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// RenameAttributes with a condition.
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

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"].
            // Renamed attributes with format "{M}.{o}.{a}"
            Assert.AreEqual(5, resolvedEntity.Attributes.Count);
            Assert.AreEqual("Name..personInfo", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("Age..personInfo", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("Address..personInfo", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PhoneNumber..personInfo", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("Email..personInfo", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);

            CdmEntityDefinition resolvedEntity2 = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"].
            // Renamed attributes: none, condition was false.
            Assert.AreEqual(5, resolvedEntity2.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity2.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity2.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity2.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (resolvedEntity2.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (resolvedEntity2.Attributes[4] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// RenameAttributes with an empty apply to list.
        /// </summary>
        [TestMethod]
        public async Task TestEmptyApplyTo()
        {
            string testName = "TestEmptyApplyTo";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"].
            // Renamed attributes: [].
            Assert.AreEqual(5, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// RenameFormat on an entity with an attribute group.
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

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"].
            // Rename all attributes with format {a}-{o}-{M}
            Assert.AreEqual(5, resolvedEntity.Attributes.Count);
            Assert.AreEqual("PersonInfo--Name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo--Age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo--Address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo--PhoneNumber", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo--Email", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// RenameFormat on an entity with an attribute group.
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

            // Original set of attributes: ["PersonInfoName", "PersonInfoAge", "PersonInfoAddress", "PersonInfoPhoneNumber", "PersonInfoEmail"].
            // Rename all attributes with format {a}-{o}-{M}
            Assert.AreEqual(5, resolvedEntity.Attributes.Count);
            Assert.AreEqual("PersonInfo--Name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo--Age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo--Address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo--PhoneNumber", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo--Email", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Test RenameFormat applying a rename nested in a exclude operation
        /// </summary>
        [TestMethod]
        public async Task TestRenameAndExcludeProj()
        {
            string testName = "TestRenameAndExcludeProj";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Rename all attributes with format {a}-{o}-{M} and remove ["age", "PersonInfo--PhoneNumber"]
            Assert.AreEqual(3, resolvedEntity.Attributes.Count);
            Assert.AreEqual("PersonInfo--Name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo--Address", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("PersonInfo--Email", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// RenameAttributes with an entity attribute name on an inline entity reference that contains entity attributes.
        /// This is testing that, for the case of the structured directive, we can filter using the name of an entity attribute.
        /// in the inline entity reference to rename the entire entity attribute group.
        /// </summary>
        // [TestMethod]
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

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email", "title", "company", "tenure"].
            // Rename with format "{a}-{o}-{M}" attributes ["PersonInfoAge", "OccupationInfo"]
            // "OccupationInfo" is an entity attribute
            Assert.AreEqual(2, resolvedEntity.Attributes.Count); // attribute group created because of structured directive.
            CdmAttributeGroupDefinition attGroup = (resolvedEntity.Attributes[0] as CdmAttributeGroupReference).ExplicitReference as CdmAttributeGroupDefinition;
            Assert.AreEqual("PersonInfo", attGroup.GetName());
            Assert.AreEqual(5, attGroup.Members.Count);
            Assert.AreEqual("name", (attGroup.Members[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (attGroup.Members[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (attGroup.Members[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (attGroup.Members[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (attGroup.Members[4] as CdmTypeAttributeDefinition).Name);

            CdmAttributeGroupDefinition attGroup2 = (resolvedEntity.Attributes[0] as CdmAttributeGroupReference).ExplicitReference as CdmAttributeGroupDefinition;
            Assert.AreEqual("PersonInfo--OccupationInfo", attGroup.GetName());
            Assert.AreEqual(3, attGroup2.Members.Count);
            Assert.AreEqual("title", (attGroup2.Members[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("company", (attGroup2.Members[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("tenure", (attGroup2.Members[2] as CdmTypeAttributeDefinition).Name);
        }
    }
}
