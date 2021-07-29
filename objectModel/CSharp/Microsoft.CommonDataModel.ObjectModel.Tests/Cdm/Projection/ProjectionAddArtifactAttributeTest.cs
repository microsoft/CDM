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
    public class ProjectionAddArtifactAttributeTest
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
        private readonly string testsSubpath = Path.Combine("Cdm", "Projection", nameof(ProjectionAddArtifactAttributeTest));


        /// <summary>
        /// Test AddArtifactAttribute to add an entity attribute on an entity attribute.
        /// </summary>
        [TestMethod]
        public async Task TestAddEntAttrOnEntAttrProj()
        {
            string testName = nameof(TestAddEntAttrOnEntAttrProj);
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    if (!message.Contains("CdmOperationAddArtifactAttribute | Operation AddArtifactAttribute is not supported on an entity attribute yet."))
                        Assert.Fail($"Some unexpected failure - {message}!");
                }
            }, CdmStatusLevel.Warning);

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });
        }

        /// <summary>
        /// Test AddArtifactAttribute to add an attribute group on an entity attribute.
        /// </summary>
        [TestMethod]
        public async Task TestAddAttrGrpOnEntAttrProj()
        {
            string testName = nameof(TestAddAttrGrpOnEntAttrProj);
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);
            corpus.SetEventCallback(new EventCallback
            {
                Invoke = (CdmStatusLevel statusLevel, string message) =>
                {
                    if (!message.Contains("CdmOperationAddArtifactAttribute | Operation AddArtifactAttribute is not supported on an attribute group yet."))
                        Assert.Fail($"Some unexpected failure - {message}!");
                }
            }, CdmStatusLevel.Warning);

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });
        }

        /// <summary>
        /// Test AddArtifactAttribute to add a type attribute on a type attribute.
        /// </summary>
        [TestMethod]
        public async Task TestAddTypeAttrOnTypeAttrProj()
        {
            string testName = nameof(TestAddTypeAttrOnTypeAttrProj);
            string entityName = "Person";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            Assert.AreEqual(2, resolvedEntity.Attributes.Count);
            Assert.AreEqual("newTerm", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("FavoriteTerm", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Test AddArtifactAttribute operation nested with ExcludeAttributes/RenameAttributes.
        /// </summary>
        [TestMethod]
        public async Task TestCombineOpsNestedProj()
        {
            string testName = nameof(TestCombineOpsNestedProj);
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: [ { "name", "age", "address", "phoneNumber", "email" }, "FavoriteTerm" ]
            // Entity Attribuite:
            // Exclude attributes: ["age", "phoneNumber", "name"]
            // Add attribute: ["newName"]
            // Rename attribute ["newName" -> "renaming-{m}" ]
            // Rename attribute ["renaming-newName" -> "renamingAgain-{m}" ]
            // Add attribute: ["newName_1"]
            // Type Attribute:
            // Add attribute: ["newName"]
            // Rename attribute ["newName" -> "renamed-{m}" ]
            // Add attribute: ["newTerm" (InsertAtTop:true)]
            Assert.AreEqual(7, resolvedEntity.Attributes.Count);
            Assert.AreEqual("address", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("renamingAgain-renaming-newName", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("newName_1", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("newTerm", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("FavoriteTerm", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("renamed-newName", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Test AddArtifactAttribute operation with a "structured" condition.
        /// </summary>
        [TestMethod]
        public async Task TestConditionalProj()
        {
            string testName = nameof(TestConditionalProj);
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

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
            // Condition met, keep attributes in flat list and add the new attribute "newName" all attributes at the end
            Assert.AreEqual(6, resolvedEntity2.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity2.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity2.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity2.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (resolvedEntity2.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (resolvedEntity2.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("newName", (resolvedEntity2.Attributes[5] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Test for creating a projection with an AddArtifactAttribute operation and a condition using the object model.
        /// </summary>
        [TestMethod]
        public async Task TestConditionalProjUsingObjectModel()
        {
            string testName = nameof(TestConditionalProjUsingObjectModel);
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);
            CdmFolderDefinition localRoot = corpus.Storage.FetchRootFolder("local");

            // Create an entity.
            CdmEntityDefinition entity = ProjectionTestUtils.CreateEntity(corpus, localRoot);

            // Create a projection with a condition that states the operation should only execute when the resolution directive is 'structured'.
            CdmProjection projection = ProjectionTestUtils.CreateProjection(corpus, localRoot);
            projection.Condition = "structured==true";

            // Create an AddArtifactAttribute operation
            CdmOperationAddArtifactAttribute addArtifactAttributeOp = corpus.MakeObject<CdmOperationAddArtifactAttribute>(CdmObjectType.OperationAddArtifactAttributeDef);
            addArtifactAttributeOp.NewAttribute = corpus.MakeObject<CdmTypeAttributeDefinition>(CdmObjectType.TypeAttributeDef, "newName");
            ((CdmTypeAttributeDefinition) addArtifactAttributeOp.NewAttribute).DataType = corpus.MakeRef<CdmDataTypeReference>(CdmObjectType.DataTypeRef, "string", true);
            projection.Operations.Add(addArtifactAttributeOp);

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

            // Original set of attributes: ["id", "name", "value", "date"]
            // Condition met, keep attributes in flat list and add the new attribute "newName" all attributes at the end
            Assert.AreEqual(5, resolvedEntityWithStructured.Attributes.Count);
            Assert.AreEqual("id", (resolvedEntityWithStructured.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name", (resolvedEntityWithStructured.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("value", (resolvedEntityWithStructured.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("date", (resolvedEntityWithStructured.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("newName", (resolvedEntityWithStructured.Attributes[4] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Test AddArtifactAttribute operation on an entity definition.
        /// </summary>
        [TestMethod]
        public async Task TestExtendsEntityProj()
        {
            string testName = nameof(TestExtendsEntityProj);
            string entityName = "Child";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            Assert.AreEqual(6, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("newName", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Multiple AddArtifactAttribute operations on the same projection.
        /// </summary>
        [TestMethod]
        public async Task TestMultipleOpProj()
        {
            string testName = nameof(TestMultipleOpProj);
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Add attribute: ["newName", "newName_1", "newName"]
            // 2 "newName" will be merged
            Assert.AreEqual(7, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("newName", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("newName_1", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Test insertAtTop field in AddArtifactAttribute operation.
        /// </summary>
        [TestMethod]
        public async Task TestInsertAtTop()
        {
            string testName = nameof(TestInsertAtTop);
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Add attribute: ["newName" (InsertAtTop:false), "newName_1" (InsertAtTop:true)]
            Assert.AreEqual(7, resolvedEntity.Attributes.Count);
            Assert.AreEqual("newName_1", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("name", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("newName", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Nested projections with AddArtifactAttribute.
        /// </summary>
        [TestMethod]
        public async Task TestNestedProj()
        {
            string testName = "TestNestedProj";
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            Assert.AreEqual(7, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("phoneNumber", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("email", (resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("newName_inner", (resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("newName_outer", (resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition).Name);
        }
    }
}
