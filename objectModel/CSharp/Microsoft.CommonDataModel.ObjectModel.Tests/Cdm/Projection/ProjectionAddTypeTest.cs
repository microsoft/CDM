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
    /// A test class for testing the AddTypeAttribute operation in a projection as well as SelectedTypeAttribute in a resolution guidance
    /// </summary>
    [TestClass]
    public class ProjectionAddTypeTest
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
        private string testsSubpath = Path.Combine("Cdm", "Projection", "ProjectionAddTypeTest");

        /// <summary>
        /// Test for creating a projection with an AddTypeAttribute operation on an entity attribute using the object model  
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

            // Create an AddTypeAttribute operation
            CdmOperationAddTypeAttribute addTypeAttrOp = corpus.MakeObject<CdmOperationAddTypeAttribute>(CdmObjectType.OperationAddTypeAttributeDef);
            addTypeAttrOp.TypeAttribute = corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, "testType");
            addTypeAttrOp.TypeAttribute.DataType = corpus.MakeRef<CdmDataTypeReference>(CdmObjectType.DataTypeRef, "entityName", true);
            projection.Operations.Add(addTypeAttrOp);

            // Create an entity reference to hold this projection
            CdmEntityReference projectionEntityRef = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            projectionEntityRef.ExplicitReference = projection;

            // Create an entity attribute that contains this projection and add this to the entity
            CdmEntityAttributeDefinition entityAttribute = corpus.MakeObject<CdmEntityAttributeDefinition>(CdmObjectType.EntityAttributeDef, "TestEntityAttribute");
            entityAttribute.Entity = projectionEntityRef;
            entity.Attributes.Add(entityAttribute);

            // Resolve the entity
            CdmEntityDefinition resolvedEntity = await entity.CreateResolvedEntityAsync($"Resolved_{entity.EntityName}.cdm.json", null, localRoot);

            // Verify correctness of the resolved attributes after running the AddTypeAttribute operation
            // Original set of attributes: ["id", "name", "value", "date"]
            // Type attribute: "testType"
            Assert.AreEqual(5, resolvedEntity.Attributes.Count);
            Assert.AreEqual("id", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("value", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("date", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("testType", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("is.linkedEntity.name", resolvedEntity.Attributes[4].AppliedTraits[4].NamedReference);
        }

        /// <summary>
        /// Test for creating a projection with an AddTypeAttribute operation on an entity definition using the object model  
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

            // Create an AddTypeAttribute operation
            CdmOperationAddTypeAttribute addTypeAttrOp = corpus.MakeObject<CdmOperationAddTypeAttribute>(CdmObjectType.OperationAddTypeAttributeDef);
            addTypeAttrOp.TypeAttribute = corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, "testType");
            addTypeAttrOp.TypeAttribute.DataType = corpus.MakeRef<CdmDataTypeReference>(CdmObjectType.DataTypeRef, "entityName", true);
            projection.Operations.Add(addTypeAttrOp);

            // Create an entity reference to hold this projection
            CdmEntityReference projectionEntityRef = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            projectionEntityRef.ExplicitReference = projection;

            // Set the entity's ExtendEntity to be the projection
            entity.ExtendsEntity = projectionEntityRef;

            // Resolve the entity
            CdmEntityDefinition resolvedEntity = await entity.CreateResolvedEntityAsync($"Resolved_{entity.EntityName}.cdm.json", null, localRoot);

            // Verify correctness of the resolved attributes after running the AddTypeAttribute operation
            // Original set of attributes: ["id", "name", "value", "date"]
            // Type attribute: "testType"
            Assert.AreEqual(5, resolvedEntity.Attributes.Count);
            Assert.AreEqual("id", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("value", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("date", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("testType", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("is.linkedEntity.name", resolvedEntity.Attributes[4].AppliedTraits[4].NamedReference);
        }

        /// <summary>
        /// Test for creating a projection with an AddTypeAttribute operation and a condition using the object model  
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

            // Create an AddTypeAttribute operation
            CdmOperationAddTypeAttribute addTypeAttrOp = corpus.MakeObject<CdmOperationAddTypeAttribute>(CdmObjectType.OperationAddTypeAttributeDef);
            addTypeAttrOp.TypeAttribute = corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, "testType");
            addTypeAttrOp.TypeAttribute.DataType = corpus.MakeRef<CdmDataTypeReference>(CdmObjectType.DataTypeRef, "entityName", true);
            projection.Operations.Add(addTypeAttrOp);

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

            // Verify correctness of the resolved attributes after running the AddTypeAttribute operation
            // Original set of attributes: ["id", "name", "value", "date"]
            // Type attribute: "testType"
            Assert.AreEqual(5, resolvedEntityWithReferenceOnly.Attributes.Count);
            Assert.AreEqual("id", (resolvedEntityWithReferenceOnly.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name", (resolvedEntityWithReferenceOnly.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("value", (resolvedEntityWithReferenceOnly.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("date", (resolvedEntityWithReferenceOnly.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("testType", (resolvedEntityWithReferenceOnly.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("is.linkedEntity.name", resolvedEntityWithReferenceOnly.Attributes[4].AppliedTraits[4].NamedReference);

            // Now resolve the entity with the 'structured' directive
            resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "structured" });
            CdmEntityDefinition resolvedEntityWithStructured = await entity.CreateResolvedEntityAsync($"Resolved_{entity.EntityName}.cdm.json", resOpt, localRoot);

            // Verify correctness of the resolved attributes after running the AddTypeAttribute operation
            // Original set of attributes: ["id", "name", "value", "date"]
            // No Type attribute added, condition was false
            Assert.AreEqual(4, resolvedEntityWithStructured.Attributes.Count);
            Assert.AreEqual("id", (resolvedEntityWithStructured.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name", (resolvedEntityWithStructured.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("value", (resolvedEntityWithStructured.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("date", (resolvedEntityWithStructured.Attributes[3] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// AddTypeAttribute on an entity attribute
        /// </summary>
        [TestMethod]
        public async Task TestAddTypeAttributeProj()
        {
            string testName = "TestAddTypeAttributeProj";
            string entityName = "Customer";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
            // Type attribute: "someType"
            Assert.AreEqual(8, resolvedEntity.Attributes.Count);
            Assert.AreEqual("emailId", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("isPrimary", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneId", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("number", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("socialId", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("account", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("someType", (resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("is.linkedEntity.name", resolvedEntity.Attributes[7].AppliedTraits[4].NamedReference);
        }

        /// <summary>
        /// SelectedTypeAttribute on an entity attribute
        /// </summary>
        [TestMethod]
        public async Task TestSelectedTypeAttr()
        {
            string testName = "TestSelectedTypeAttr";
            string entityName = "Customer";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
            // Type attribute: "someType"
            Assert.AreEqual(8, resolvedEntity.Attributes.Count);
            Assert.AreEqual("emailId", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("isPrimary", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneId", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("number", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("socialId", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("account", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("someType", (resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("is.linkedEntity.name", resolvedEntity.Attributes[7].AppliedTraits[4].NamedReference);
        }

        /// <summary>
        /// AddTypeAttribute on an entity definition
        /// </summary>
        [TestMethod]
        public async Task TestExtendsEntityProj()
        {
            string testName = "TestExtendsEntityProj";
            string entityName = "Customer";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
            // Type attribute: "someType"
            Assert.AreEqual(8, resolvedEntity.Attributes.Count);
            Assert.AreEqual("emailId", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("isPrimary", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneId", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("number", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("socialId", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("account", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("someType", (resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("is.linkedEntity.name", resolvedEntity.Attributes[7].AppliedTraits[4].NamedReference);
        }

        /// <summary>
        /// SelectedTypeAttribute on an entity definition
        /// </summary>
        [TestMethod]
        public async Task TestExtendsEntity()
        {
            string testName = "TestExtendsEntity";
            string entityName = "Customer";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
            // Type attribute: "someType" (using extendsEntityResolutionGuidance)
            Assert.AreEqual(8, resolvedEntity.Attributes.Count);
            Assert.AreEqual("emailId", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("isPrimary", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneId", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("number", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("socialId", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("account", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("someType", (resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("is.linkedEntity.name", resolvedEntity.Attributes[7].AppliedTraits[4].NamedReference);
        }

        /// <summary>
        /// AddTypeAttribute on an entity attribute (after a CombineAttributes)
        /// </summary>
        [TestMethod]
        public async Task TestAddTypeWithCombineProj()
        {
            string testName = "TestAddTypeWithCombineProj";
            string entityName = "Customer";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
            // Merge ["emailId, "phoneId, "socialId"] into "contactId", type attribute: "contactType"
            Assert.AreEqual(6, resolvedEntity.Attributes.Count);
            Assert.AreEqual("address", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("isPrimary", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("number", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("account", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("contactId", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("contactType", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("is.linkedEntity.name", resolvedEntity.Attributes[5].AppliedTraits[4].NamedReference);
        }

        /// <summary>
        /// AddTypeAttribute with other operations in the same projection
        /// </summary>
        [TestMethod]
        public async Task TestCombineOpsProj()
        {
            string testName = "TestCombineOpsProj";
            string entityName = "Customer";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
            // Type attribute: "someType", rename "address" to "homeAddress"
            Assert.AreEqual(9, resolvedEntity.Attributes.Count);
            Assert.AreEqual("emailId", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("isPrimary", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneId", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("number", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("socialId", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("account", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("someType", (resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("is.linkedEntity.name", resolvedEntity.Attributes[7].AppliedTraits[4].NamedReference);
            Assert.AreEqual("homeAddress", (resolvedEntity.Attributes[8] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Nested projections with AddTypeAttribute and other operations
        /// </summary>
        [TestMethod]
        public async Task TestCombineOpsNestedProj()
        {
            string testName = "TestCombineOpsNestedProj";
            string entityName = "Customer";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
            // Merge ["emailId, "phoneId, "socialId"] into "contactId", type attribute: "contactType",
            // rename ["contactId", "isPrimary"] as "new_{m}", include ["contactId", "new_isPrimary", "contactType"]
            Assert.AreEqual(3, resolvedEntity.Attributes.Count);
            Assert.AreEqual("new_contactId", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("new_isPrimary", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("contactType", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("is.linkedEntity.name", resolvedEntity.Attributes[2].AppliedTraits[4].NamedReference);
        }

        /// <summary>
        /// AddTypeAttribute with a condition
        /// </summary>
        [TestMethod]
        public async Task TestConditionalProj()
        {
            string testName = "TestConditionalProj";
            string entityName = "Customer";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["emailId", "address", "isPrimary", "phoneId", "number", "socialId", "account"]
            // Merge ["emailId, "phoneId, "socialId"] into "contactId", type attribute: "contactType"
            // Condition for projection containing AddTypeAttribute is false, so no Type attribute is created
            Assert.AreEqual(5, resolvedEntity.Attributes.Count);
            Assert.AreEqual("address", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("isPrimary", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("number", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("account", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("contactId", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
        }
    }
}
