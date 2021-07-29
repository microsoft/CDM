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

    [TestClass]
    public class ProjectionAlterTraitsTest
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
        private readonly string testsSubpath = Path.Combine("Cdm", "Projection", nameof(ProjectionAlterTraitsTest));

        private readonly string traitGroupFilePath = Path.Combine(TestHelper.TestDataPath, "Cdm", "Projection", nameof(ProjectionAlterTraitsTest));

        /// <summary>
        /// Test AlterTraits on an type attribute.
        /// </summary>
        [TestMethod]
        public async Task TestAlterTraitsOnTypeAttrProj()
        {
            string testName = nameof(TestAlterTraitsOnTypeAttrProj);
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);
            corpus.Storage.Mount("traitGroup", new LocalAdapter(traitGroupFilePath));

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });
            Assert.AreEqual(1, resolvedEntity.Attributes.Count);
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0], "FavoriteTerm", true);
        }

        /// <summary>
        /// Test AlterTraits on an entity attribute.
        /// </summary>
        [TestMethod]
        public async Task TestAlterTraitsOnEntiAttrProj()
        {
            string testName = nameof(TestAlterTraitsOnEntiAttrProj);
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);
            corpus.Storage.Mount("traitGroup", new LocalAdapter(traitGroupFilePath));

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });
            Assert.AreEqual(5, resolvedEntity.Attributes.Count);
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0], "name", true);
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[1], "age");
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[2], "address");
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[3], "phoneNumber");
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[4], "email");
        }

        /// <summary>
        /// Test AlterTraits on an attribute group.
        /// </summary>
        [TestMethod]
        public async Task TestAlterTraitsOnAttrGrpProj()
        {
            string testName = nameof(TestAlterTraitsOnAttrGrpProj);
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);
            corpus.Storage.Mount("traitGroup", new LocalAdapter(traitGroupFilePath));

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });
            
            CdmAttributeGroupReference attGroupReference = resolvedEntity.Attributes[0] as CdmAttributeGroupReference;
            CdmAttributeGroupDefinition attGroupDefinition = attGroupReference.ExplicitReference as CdmAttributeGroupDefinition;
            Assert.AreEqual(5, attGroupDefinition.Members.Count);
            Assert.AreEqual("PersonAttributeGroup", attGroupDefinition.AttributeGroupName);
            Assert.IsNotNull(attGroupDefinition.ExhibitsTraits.Item("means.TraitG100"));
            Assert.IsNotNull(attGroupDefinition.ExhibitsTraits.Item("means.TraitG200"));
            Assert.IsNull(attGroupDefinition.ExhibitsTraits.Item("means.TraitG300"));
            Assert.IsNotNull(attGroupDefinition.ExhibitsTraits.Item("means.TraitG400"));
            CdmTraitReference traitG4 = (CdmTraitReference)attGroupDefinition.ExhibitsTraits.Item("means.TraitG4");
            Assert.IsNotNull(traitG4);
            Assert.AreEqual("5", traitG4.Arguments.FetchValue("precision"));
            Assert.AreEqual("15", traitG4.Arguments.FetchValue("scale"));
        }

        /// <summary>
        /// Test AlterTraits operation nested with IncludeAttributes and RenameAttribute.
        /// </summary>
        [TestMethod]
        public async Task TestCombineOpsNestedProj()
        {
            string testName = nameof(TestCombineOpsNestedProj);
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);
            corpus.Storage.Mount("traitGroup", new LocalAdapter(traitGroupFilePath));

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Include attributes: ["age", "phoneNumber", "name"]
            // Add attribute: ["newName"]
            // alter traits on ["newName", "name", + { "means.TraitG100" , "JobTitleBase" } - { "means.TraitG300" } ]
            // Rename attribute ["newName" -> "renaming-{m}" ]
            // alter traits on ["renaming-newName", + { "means.TraitG4(precision:5, scale:15)" } ]
            Assert.AreEqual(4, resolvedEntity.Attributes.Count);
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0], "name");
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[1], "age", doesNotExist: true);
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[2], "phoneNumber", doesNotExist: true);
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[3], "renaming-newName", true);
        }

        /// <summary>
        /// Test AlterTraits operation with a "structured" condition.
        /// </summary>
        [TestMethod]
        public async Task TestConditionalProj()
        {
            string testName = nameof(TestConditionalProj);
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);
            corpus.Storage.Mount("traitGroup", new LocalAdapter(traitGroupFilePath));

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "referenceOnly" });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Condition not met, no traits are added
            Assert.AreEqual(5, resolvedEntity.Attributes.Count);
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0], "name", doesNotExist: true);
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[1], "age", doesNotExist: true);
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[2], "address", doesNotExist: true);
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[3], "phoneNumber", doesNotExist: true);
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[4], "email", doesNotExist: true);

            CdmEntityDefinition resolvedEntity2 = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "structured" });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Condition met, new traits are added
            Assert.AreEqual(5, resolvedEntity2.Attributes.Count);
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity2.Attributes[0], "name", true);
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity2.Attributes[1], "age");
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity2.Attributes[2], "address");
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity2.Attributes[3], "phoneNumber");
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity2.Attributes[4], "email");
        }

        /// <summary>
        /// Test for creating a projection with an AlterTraits operation and a condition using the object model.
        /// </summary>
        [TestMethod]
        public async Task TestConditionalProjUsingObjectModel()
        {
            string testName = nameof(TestConditionalProjUsingObjectModel);
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);
            CdmFolderDefinition localRoot = corpus.Storage.FetchRootFolder("local");
            corpus.Storage.Mount("traitGroup", new LocalAdapter(traitGroupFilePath));

            // Create an entity.
            CdmEntityDefinition entity = ProjectionTestUtils.CreateEntity(corpus, localRoot);
            entity.InDocument.Imports.Add("traitGroup:/TraitGroup.cdm.json");

            // Create a projection with a condition that states the operation should only execute when the resolution directive is 'structured'.
            CdmProjection projection = ProjectionTestUtils.CreateProjection(corpus, localRoot);
            projection.Condition = "structured==true";
            projection.RunSequentially = true;

            // Create an AlterTraits operation
            CdmOperationAlterTraits alterTraitsOp_1 = corpus.MakeObject<CdmOperationAlterTraits>(CdmObjectType.OperationAlterTraitsDef);
            alterTraitsOp_1.TraitsToAdd = new List<CdmTraitReferenceBase>();
            alterTraitsOp_1.TraitsToAdd.Add(corpus.MakeRef<CdmTraitReference>(CdmObjectType.TraitRef, "means.TraitG100", true));
            alterTraitsOp_1.TraitsToAdd.Add(corpus.MakeRef<CdmTraitGroupReference>(CdmObjectType.TraitGroupRef, "JobTitleBase", true));
            alterTraitsOp_1.TraitsToRemove = new List<CdmTraitReferenceBase>();
            alterTraitsOp_1.TraitsToRemove.Add(corpus.MakeRef<CdmTraitReference>(CdmObjectType.TraitRef, "means.TraitG300", true));
            projection.Operations.Add(alterTraitsOp_1);

            CdmOperationAlterTraits alterTraitsOp_2 = corpus.MakeObject<CdmOperationAlterTraits>(CdmObjectType.OperationAlterTraitsDef);
            alterTraitsOp_2.TraitsToAdd = new List<CdmTraitReferenceBase>();
            var traitG4 = corpus.MakeRef<CdmTraitReference>(CdmObjectType.TraitRef, "means.TraitG4", true);
            traitG4.Arguments.Add("precision", "5");
            traitG4.Arguments.Add("scale", "15");
            alterTraitsOp_2.TraitsToAdd.Add(traitG4);
            alterTraitsOp_2.ApplyTo = new List<string>() { "name" };
            projection.Operations.Add(alterTraitsOp_2);

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
            CdmEntityDefinition resolvedEntityWithReferenceOnly = await entity.CreateResolvedEntityAsync($"Resolved_{entity.EntityName}.cdm.json", resOpt, localRoot);

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Condition not met, no traits are added
            Assert.AreEqual(4, resolvedEntityWithReferenceOnly.Attributes.Count);
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntityWithReferenceOnly.Attributes[0], "id", doesNotExist: true);
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntityWithReferenceOnly.Attributes[1], "name", doesNotExist: true);
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntityWithReferenceOnly.Attributes[2], "value", doesNotExist: true);
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntityWithReferenceOnly.Attributes[3], "date", doesNotExist: true);

            CdmEntityDefinition resolvedEntityWithStructured = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "structured" });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Condition met, new traits are added
            Assert.AreEqual(4, resolvedEntityWithStructured.Attributes.Count);
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntityWithStructured.Attributes[0], "id");
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntityWithStructured.Attributes[1], "name", true);
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntityWithStructured.Attributes[2], "value");
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntityWithStructured.Attributes[3], "date");
        }

        /// <summary>
        /// Test AlterTraits operation on an extended entity definition.
        /// </summary>
        [TestMethod]
        public async Task TestExtendsEntityProj()
        {
            string testName = nameof(TestExtendsEntityProj);
            string entityName = "Child";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);
            corpus.Storage.Mount("traitGroup", new LocalAdapter(traitGroupFilePath));

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            Assert.AreEqual(5, resolvedEntity.Attributes.Count);
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0], "name", true);
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[1], "age");
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[2], "address");
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[3], "phoneNumber");
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[4], "email");
        }

        /// <summary>
        /// Multiple AlterTraits operations on the same projection.
        /// </summary>
        [TestMethod]
        public async Task TestMultipleOpProj()
        {
            string testName = nameof(TestMultipleOpProj);
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);
            corpus.Storage.Mount("traitGroup", new LocalAdapter(traitGroupFilePath));

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            Assert.AreEqual(5, resolvedEntity.Attributes.Count);
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0], "name");
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[1], "age");
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[2], "address");
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[3], "phoneNumber");
            ValidateTrait((CdmTypeAttributeDefinition)resolvedEntity.Attributes[4], "email");
        }

        /// <summary>
        /// Test argumentsContainWildcards field in AlterTraits with ArrayExpansion and RenameAttributes operations.
        /// </summary>
        [TestMethod]
        public async Task TestWildcardArgs()
        {
            string testName = nameof(TestWildcardArgs);
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
            // Add traits with wildcard characters
            Assert.AreEqual(9, resolvedEntity.Attributes.Count);
            ProjectionTestUtils.ValidateExpansionInfoTrait(resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition, "name1", 1, "ThreePeople", "name");
            ProjectionTestUtils.ValidateExpansionInfoTrait(resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition, "age1", 1, "ThreePeople", "age");
            ProjectionTestUtils.ValidateExpansionInfoTrait(resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition, "address1", 1, "ThreePeople", "address");
            ProjectionTestUtils.ValidateExpansionInfoTrait(resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition, "name2", 2, "ThreePeople", "name");
            ProjectionTestUtils.ValidateExpansionInfoTrait(resolvedEntity.Attributes[4] as CdmTypeAttributeDefinition, "age2", 2, "ThreePeople", "age");
            ProjectionTestUtils.ValidateExpansionInfoTrait(resolvedEntity.Attributes[5] as CdmTypeAttributeDefinition, "address2", 2, "ThreePeople", "address");
            ProjectionTestUtils.ValidateExpansionInfoTrait(resolvedEntity.Attributes[6] as CdmTypeAttributeDefinition, "name3", 3, "ThreePeople", "name");
            ProjectionTestUtils.ValidateExpansionInfoTrait(resolvedEntity.Attributes[7] as CdmTypeAttributeDefinition, "age3", 3, "ThreePeople", "age");
            ProjectionTestUtils.ValidateExpansionInfoTrait(resolvedEntity.Attributes[8] as CdmTypeAttributeDefinition, "address3", 3, "ThreePeople", "address");
        }

        /// <summary>
        /// Test alter arguments.
        /// </summary>
        [TestMethod]
        public async Task TestAlterArguments()
        {
            string testName = nameof(TestAlterArguments);
            string entityName = "NewPerson";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);
            corpus.Storage.Mount("traitGroup", new LocalAdapter(traitGroupFilePath));

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Create resolution options with the 'referenceOnly' directive.
            CdmEntityDefinition resolvedEntityWithReferenceOnly = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "referenceOnly" });

            // Original set of attributes: ["name", "age", "address[means.TraitG4(scale:15)]" , "phoneNumber", "email"]
            // Condition not met, no trait is changed
            Assert.AreEqual("address", ((CdmTypeAttributeDefinition)resolvedEntityWithReferenceOnly.Attributes[2]).Name);
            CdmTraitReference traitG4 = (CdmTraitReference) resolvedEntityWithReferenceOnly.Attributes[2].AppliedTraits.Item("means.TraitG4");
            Assert.IsNotNull(traitG4);
            Assert.IsNull(traitG4.Arguments.FetchValue("precision"));
            Assert.AreEqual("15", traitG4.Arguments.FetchValue("scale"));

            // Create resolution options with the 'structured' directive.
            CdmEntityDefinition resolvedEntityWithStructured = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "structured" });
            // Original set of attributes: ["name", "age", "address[means.TraitG4(scale:15)]" , "phoneNumber", "email"]
            // Condition met, alter traits on ["address", + { "means.TraitG4, "arguments": ["6", {"name": "scale","value": "20"}"] }]
            Assert.AreEqual("address", ((CdmTypeAttributeDefinition)resolvedEntityWithStructured.Attributes[2]).Name);
            CdmTraitReference traitG4_1 = (CdmTraitReference) resolvedEntityWithStructured.Attributes[2].AppliedTraits.Item("means.TraitG4");
            Assert.IsNotNull(traitG4_1);
            Assert.AreEqual("6", traitG4_1.Arguments.FetchValue("precision"));
            Assert.AreEqual("20", traitG4_1.Arguments.FetchValue("scale"));

            // Create resolution options with the 'normalized' directive.
            CdmEntityDefinition resolvedEntityWithNormalized = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { "normalized" });
            // Original set of attributes: ["name", "age", "address[means.TraitG4(scale:15)]" , "phoneNumber", "email"]
            // Condition met, alter traits on ["address", + { "means.TraitG4, "arguments": ["8", null] }]
            Assert.AreEqual("address", ((CdmTypeAttributeDefinition)resolvedEntityWithNormalized.Attributes[2]).Name);
            CdmTraitReference traitG4_2 = (CdmTraitReference)resolvedEntityWithNormalized.Attributes[2].AppliedTraits.Item("means.TraitG4");
            Assert.IsNotNull(traitG4_2);
            Assert.AreEqual("8", traitG4_2.Arguments.FetchValue("precision"));
            Assert.IsNull(traitG4_2.Arguments.FetchValue("scale"));
        }

        /// <summary>
        /// Validates trait for this test class.
        /// </summary>
        /// <param name="attribute">The type attribute.</param>
        /// <param name="expectedAttrName">The expected attribute name.</param>
        /// <param name="haveTraitG4">Whether this attribute has "means.TraitG4".</param>
        /// <param name="doesNotExist">Whether this attribute has traits from <c traitGroupFilePath/>.</param>
        /// <returns></returns>
        private static void ValidateTrait(CdmTypeAttributeDefinition attribute, string expectedAttrName, bool haveTraitG4 = false, bool doesNotExist = false)
        {  
            Assert.AreEqual(expectedAttrName, attribute.Name);
            if (!doesNotExist)
            {
                Assert.IsNotNull(attribute.AppliedTraits.Item("means.TraitG100"));
                Assert.IsNotNull(attribute.AppliedTraits.Item("means.TraitG200"));
                Assert.IsNull(attribute.AppliedTraits.Item("means.TraitG300"));
                Assert.IsNotNull(attribute.AppliedTraits.Item("means.TraitG400"));
                if (haveTraitG4)
                {
                    CdmTraitReference traitG4 = (CdmTraitReference)attribute.AppliedTraits.Item("means.TraitG4");
                    Assert.IsNotNull(traitG4); 
                    Assert.AreEqual("5", traitG4.Arguments.FetchValue("precision"));
                    Assert.AreEqual("15", traitG4.Arguments.FetchValue("scale"));
                }
            } 
            else
            {
                Assert.IsNull(attribute.AppliedTraits.Item("means.TraitG100"));
                Assert.IsNull(attribute.AppliedTraits.Item("means.TraitG200"));
                Assert.IsNull(attribute.AppliedTraits.Item("means.TraitG300"));
                Assert.IsNull(attribute.AppliedTraits.Item("means.TraitG400"));
                Assert.IsNull(attribute.AppliedTraits.Item("means.TraitG4"));
            }
        }
    }
}
