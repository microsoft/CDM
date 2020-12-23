// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.Projection
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;

    [TestClass]
    public class ProjectionAddAttributeGroupTest
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
        private readonly string testsSubpath = Path.Combine("Cdm", "Projection", "ProjectionAddAttributeGroupTest");

        /// <summary>
        /// Test AddAttributeGroup operation nested with ExcludeAttributes
        /// </summary>
        [TestMethod]
        public async Task TestCombineOpsNestedProj()
        {
            string testName = "TestCombineOpsNestedProj";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Exclude attributes: ["age", "phoneNumber"]
            CdmAttributeGroupDefinition attGroupDefinition = this.ValidateAttributeGroup(resolvedEntity.Attributes, "PersonAttributeGroup");
            Assert.AreEqual(3, attGroupDefinition.Members.Count);
            Assert.AreEqual("name", (attGroupDefinition.Members[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (attGroupDefinition.Members[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (attGroupDefinition.Members[2] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Test AddAttributeGroup and IncludeAttributes operations in the same projection
        /// </summary>
        [TestMethod]
        public async Task TestCombineOpsProj()
        {
            string testName = "TestCombineOpsProj";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Included attributes: ["age", "phoneNumber"]
            CdmAttributeGroupDefinition attGroupDefinition = this.ValidateAttributeGroup(resolvedEntity.Attributes, "PersonAttributeGroup", 3);
            Assert.AreEqual(5, attGroupDefinition.Members.Count);
            Assert.AreEqual("name", (attGroupDefinition.Members[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (attGroupDefinition.Members[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (attGroupDefinition.Members[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (attGroupDefinition.Members[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (attGroupDefinition.Members[4] as CdmTypeAttributeDefinition).Name);

            // Check the attributes coming from the IncludeAttribute operation
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Test AddAttributeGroup operation with a "structured" condition
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
            // Condition not met, keep attributes in flat list
            Assert.AreEqual(5, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);

            CdmEntityDefinition resolvedEntity2 = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "structured" });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Condition met, put all attributes in an attribute group
            CdmAttributeGroupDefinition attGroupDefinition = this.ValidateAttributeGroup(resolvedEntity2.Attributes, "PersonAttributeGroup");
            Assert.AreEqual(5, attGroupDefinition.Members.Count);
            Assert.AreEqual("name", (attGroupDefinition.Members[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (attGroupDefinition.Members[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (attGroupDefinition.Members[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (attGroupDefinition.Members[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (attGroupDefinition.Members[4] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Test for creating a projection with an AddAttributeGroup operation and a condition using the object model
        /// </summary>
        [TestMethod]
        public async Task TestConditionalProjUsingObjectModel()
        {
            string testName = "TestConditionalProjUsingObjectModel";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);
            CdmFolderDefinition localRoot = corpus.Storage.FetchRootFolder("local");

            // Create an entity.
            CdmEntityDefinition entity = ProjectionTestUtils.CreateEntity(corpus, localRoot);

            // Create a projection with a condition that states the operation should only execute when the resolution directive is 'structured'.
            CdmProjection projection = ProjectionTestUtils.CreateProjection(corpus, localRoot);
            projection.Condition = "structured==true";

            // Create an AddAttributeGroup operation
            CdmOperationAddAttributeGroup addAttGroupOp = corpus.MakeObject<CdmOperationAddAttributeGroup>(CdmObjectType.OperationAddAttributeGroupDef);
            addAttGroupOp.AttributeGroupName = "PersonAttributeGroup";
            projection.Operations.Add(addAttGroupOp);

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

            // Verify correctness of the resolved attributes after running the AddAttributeGroup operation
            // Original set of attributes: ["id", "name", "value", "date"]
            // Condition not met, keep attributes in flat list
            Assert.AreEqual(4, resolvedEntityWithReferenceOnly.Attributes.Count);
            Assert.AreEqual("id", (resolvedEntityWithReferenceOnly.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name", (resolvedEntityWithReferenceOnly.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("value", (resolvedEntityWithReferenceOnly.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("date", (resolvedEntityWithReferenceOnly.Attributes[3] as CdmTypeAttributeDefinition).Name);

            // Now resolve the entity with the 'structured' directive
            resOpt.Directives = new AttributeResolutionDirectiveSet(new HashSet<string> { "structured" });
            CdmEntityDefinition resolvedEntityWithStructured = await entity.CreateResolvedEntityAsync($"Resolved_{entity.EntityName}.cdm.json", resOpt, localRoot);

            // Verify correctness of the resolved attributes after running the AddAttributeGroup operation
            // Original set of attributes: ["id", "name", "value", "date"]
            // Condition met, put all attributes in an attribute group
            CdmAttributeGroupDefinition attGroupDefinition = this.ValidateAttributeGroup(resolvedEntityWithStructured.Attributes, "PersonAttributeGroup");
            Assert.AreEqual(4, attGroupDefinition.Members.Count);
            Assert.AreEqual("id", (attGroupDefinition.Members[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name", (attGroupDefinition.Members[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("value", (attGroupDefinition.Members[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("date", (attGroupDefinition.Members[3] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Test resolving an entity attribute using resolution guidance
        /// </summary>
        [TestMethod]
        public async Task TestEntityAttribute()
        {
            string testName = "TestEntityAttribute";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "structured" });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            CdmAttributeGroupDefinition attGroupDefinition = this.ValidateAttributeGroup(resolvedEntity.Attributes, "PersonInfo");
            Assert.AreEqual(5, attGroupDefinition.Members.Count);
            Assert.AreEqual("name", (attGroupDefinition.Members[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (attGroupDefinition.Members[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (attGroupDefinition.Members[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (attGroupDefinition.Members[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (attGroupDefinition.Members[4] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Test for creating a projection with an AddAttributeGroup operation on an entity attribute using the object model  
        /// </summary>
        [TestMethod]
        public async Task TestEntityAttributeProjUsingObjectModel()
        {
            string testName = "TestEntityAttributeProjUsingObjectModel";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);
            CdmFolderDefinition localRoot = corpus.Storage.FetchRootFolder("local");

            // Create an entity
            CdmEntityDefinition entity = ProjectionTestUtils.CreateEntity(corpus, localRoot);

            // Create a projection
            CdmProjection projection = ProjectionTestUtils.CreateProjection(corpus, localRoot);

            // Create an AddAttributeGroup operation
            CdmOperationAddAttributeGroup addAttGroupOp = corpus.MakeObject<CdmOperationAddAttributeGroup>(CdmObjectType.OperationAddAttributeGroupDef);
            addAttGroupOp.AttributeGroupName = "PersonAttributeGroup";
            projection.Operations.Add(addAttGroupOp);

            // Create an entity reference to hold this projection
            CdmEntityReference projectionEntityRef = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            projectionEntityRef.ExplicitReference = projection;

            // Create an entity attribute that contains this projection and add this to the entity
            CdmEntityAttributeDefinition entityAttribute = corpus.MakeObject<CdmEntityAttributeDefinition>(CdmObjectType.EntityAttributeDef, "TestEntityAttribute");
            entityAttribute.Entity = projectionEntityRef;
            entity.Attributes.Add(entityAttribute);

            // Resolve the entity.
            CdmEntityDefinition resolvedEntity = await entity.CreateResolvedEntityAsync($"Resolved_{entity.EntityName}.cdm.json", null, localRoot);

            // Verify correctness of the resolved attributes after running the AddAttributeGroup operation
            // Original set of attributes: ["id", "name", "value", "date"]
            CdmAttributeGroupDefinition attGroupDefinition = this.ValidateAttributeGroup(resolvedEntity.Attributes, "PersonAttributeGroup");
            Assert.AreEqual(4, attGroupDefinition.Members.Count);
            Assert.AreEqual("id", (attGroupDefinition.Members[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name", (attGroupDefinition.Members[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("value", (attGroupDefinition.Members[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("date", (attGroupDefinition.Members[3] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Test for creating a projection with an AddAttributeGroup operation on an entity definition using the object model
        /// </summary>
        [TestMethod]
        public async Task TestEntityProjUsingObjectModel()
        {
            string testName = "TestEntityProjUsingObjectModel";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);
            CdmFolderDefinition localRoot = corpus.Storage.FetchRootFolder("local");

            // Create an entity
            CdmEntityDefinition entity = ProjectionTestUtils.CreateEntity(corpus, localRoot);

            // Create a projection
            CdmProjection projection = ProjectionTestUtils.CreateProjection(corpus, localRoot);

            // Create an AddAttributeGroup operation
            CdmOperationAddAttributeGroup addAttGroupOp = corpus.MakeObject<CdmOperationAddAttributeGroup>(CdmObjectType.OperationAddAttributeGroupDef);
            addAttGroupOp.AttributeGroupName = "PersonAttributeGroup";
            projection.Operations.Add(addAttGroupOp);

            // Create an entity reference to hold this projection
            CdmEntityReference projectionEntityRef = corpus.MakeObject<CdmEntityReference>(CdmObjectType.EntityRef, null);
            projectionEntityRef.ExplicitReference = projection;

            // Set the entity's ExtendEntity to be the projection
            entity.ExtendsEntity = projectionEntityRef;

            // Resolve the entity
            CdmEntityDefinition resolvedEntity = await entity.CreateResolvedEntityAsync($"Resolved_{entity.EntityName}.cdm.json", null, localRoot);

            // Verify correctness of the resolved attributes after running the AddAttributeGroup operation
            // Original set of attributes: ["id", "name", "value", "date"]
            CdmAttributeGroupDefinition attGroupDefinition = this.ValidateAttributeGroup(resolvedEntity.Attributes, "PersonAttributeGroup");
            Assert.AreEqual(4, attGroupDefinition.Members.Count);
            Assert.AreEqual("id", (attGroupDefinition.Members[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name", (attGroupDefinition.Members[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("value", (attGroupDefinition.Members[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("date", (attGroupDefinition.Members[3] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Test AddAttributeGroup operation on an entity definition
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
            CdmAttributeGroupDefinition attGroupDefinition = this.ValidateAttributeGroup(resolvedEntity.Attributes, "ChildAttributeGroup");
            Assert.AreEqual(5, attGroupDefinition.Members.Count);
            Assert.AreEqual("name", (attGroupDefinition.Members[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (attGroupDefinition.Members[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (attGroupDefinition.Members[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (attGroupDefinition.Members[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (attGroupDefinition.Members[4] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Multiple AddAttributeGroup operations on the same projection 
        /// </summary>
        [TestMethod]
        public async Task TestMultipleOpProj()
        {
            string testName = "TestMultipleOpProj";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetCorpus(testName, testsSubpath);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // This will result in two attribute groups with the same set of attributes being generated
            CdmAttributeGroupDefinition attGroup1 = this.ValidateAttributeGroup(resolvedEntity.Attributes, "PersonAttributeGroup", 2);
            Assert.AreEqual(5, attGroup1.Members.Count);
            Assert.AreEqual("name", (attGroup1.Members[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (attGroup1.Members[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (attGroup1.Members[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (attGroup1.Members[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (attGroup1.Members[4] as CdmTypeAttributeDefinition).Name);

            CdmAttributeGroupDefinition attGroup2 = this.ValidateAttributeGroup(resolvedEntity.Attributes, "SecondAttributeGroup", 2, 1);
            Assert.AreEqual(5, attGroup2.Members.Count);
            Assert.AreEqual("name", (attGroup2.Members[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (attGroup2.Members[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (attGroup2.Members[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (attGroup2.Members[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (attGroup2.Members[4] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Nested projections with AddAttributeGroup
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
            CdmAttributeGroupDefinition outerAttGroup = this.ValidateAttributeGroup(resolvedEntity.Attributes, "OuterAttributeGroup");
            CdmAttributeGroupDefinition innerAttGroup = this.ValidateAttributeGroup(outerAttGroup.Members, "InnerAttributeGroup");

            Assert.AreEqual(5, innerAttGroup.Members.Count);
            Assert.AreEqual("name", (innerAttGroup.Members[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (innerAttGroup.Members[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (innerAttGroup.Members[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (innerAttGroup.Members[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (innerAttGroup.Members[4] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Test resolving a type attribute with an add attribute group operation
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
            // Add attribute group applied to "address"
            Assert.AreEqual(5, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            CdmAttributeGroupDefinition attGroupDefinition = this.ValidateAttributeGroup(resolvedEntity.Attributes, "AddressAttributeGroup", 5, 2);
            Assert.AreEqual("address", (attGroupDefinition.Members[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
        }


        /// <summary>
        /// Validates the creation of an attribute group and return its definition
        /// </summary>
        /// <param name="attributes">The collection of attributes.</param>
        /// <param name="attributeGroupName">The attribute group name.</param>
        /// <param name="attributesSize">The expected size of the attributes collection.</param>
        /// <returns></returns>
        private CdmAttributeGroupDefinition ValidateAttributeGroup(CdmCollection<CdmAttributeItem> attributes, string attributeGroupName, int attributesSize = 1, int index = 0)
        {
            Assert.AreEqual(attributesSize, attributes.Count);
            Assert.AreEqual(CdmObjectType.AttributeGroupRef, attributes[index].ObjectType);
            CdmAttributeGroupReference attGroupReference = attributes[index] as CdmAttributeGroupReference;
            Assert.IsNotNull(attGroupReference.ExplicitReference);

            CdmAttributeGroupDefinition attGroupDefinition = attGroupReference.ExplicitReference as CdmAttributeGroupDefinition;
            Assert.AreEqual(attributeGroupName, attGroupDefinition.AttributeGroupName);

            return attGroupDefinition;
        }
    }
}
