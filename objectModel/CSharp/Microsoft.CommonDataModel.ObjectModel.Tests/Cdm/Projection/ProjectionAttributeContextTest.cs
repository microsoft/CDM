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
    /// A test class to verify the attribute context tree and traits generated for various resolution scenarios given a default resolution option/directive.
    /// </summary>
    [TestClass]
    public class ProjectionAttributeContextTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "Projection", "ProjectionAttributeContextTest");

        /// <summary>
        /// Extends entity with a string reference
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestEntityStringReference()
        {
            string testName = "TestEntityStringReference";
            string entityName = "TestEntStrRef";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, new List<string> { });
        }

        /// <summary>
        /// Extends entity with an entity reference
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestEntityEntityReference()
        {
            string testName = "TestEntityEntityReference";
            string entityName = "TestEntEntRef";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, new List<string> { });
        }

        /// <summary>
        /// Extends entity with a projection
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestEntityProjection()
        {
            string testName = "TestEntityProjection";
            string entityName = testName;
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);
            
            await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, new List<string> { });
        }

        /// <summary>
        /// Extends entity with a nested projection
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestEntityNestedProjection()
        {
            string testName = "TestEntityNestedProjection";
            string entityName = testName;
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);
            
            await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, new List<string> { });
        }

        /// <summary>
        /// Entity attribute referenced with a string
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestEntityAttributeStringReference()
        {
            string testName = "TestEntityAttributeStringReference";
            string entityName = "TestEntAttrStrRef";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, new List<string> { });
        }

        /// <summary>
        /// Entity attribute referenced with an entity reference
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestEntityAttributeEntityReference()
        {
            string testName = "TestEntityAttributeEntityReference";
            string entityName = "TestEntAttrEntRef";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, new List<string> { });
        }

        /// <summary>
        /// Entity attribute referenced with a projection
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestEntityAttributeProjection()
        {
            string testName = "TestEntityAttributeProjection";
            string entityName = "TestEntAttrProj";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, new List<string> { });
        }

        /// <summary>
        /// Entity attribute referenced with a nested projection
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestEntityAttributeNestedProjection()
        {
            string testName = "TestEntityAttributeNestedProjection";
            string entityName = "NestedProjection";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, new List<string> { });
        }

        /// <summary>
        /// Entity that exhibits custom traits
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestEntityTrait()
        {
            string testName = "TestEntityTrait";
            string entityName = testName;
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, new List<string> { });

            // Attribute Name
            Assert.AreEqual("TestAttribute", ((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0]).Name);
            // Trait Name
            Assert.AreEqual("does.haveDefault", ((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0]).AppliedTraits[3].NamedReference);

            // Trait Name
            Assert.AreEqual("testTrait", ((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0]).AppliedTraits[4].NamedReference);
            // Trait Param Name
            Assert.AreEqual("testTraitParam1", ((CdmTraitReference)((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0]).AppliedTraits[4]).Arguments[0].ResolvedParameter.Name);
            // Trait Param Default Value
            Assert.AreEqual("TestTrait Param 1 DefaultValue", ((CdmTraitReference)((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0]).AppliedTraits[4]).Arguments[0].Value);
        }

        /// <summary>
        /// Entity that extends and exhibits custom traits
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestEntityExtendsTrait()
        {
            string testName = "TestEntityExtendsTrait";
            string entityName = testName;
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, new List<string> { });

            // Attribute Name
            Assert.AreEqual("TestExtendsTraitAttribute", ((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0]).Name);
            // Trait Name
            Assert.AreEqual("does.haveDefault", ((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0]).AppliedTraits[3].NamedReference);

            // Trait Name
            Assert.AreEqual("testTraitDerived", ((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0]).AppliedTraits[4].NamedReference);
            // Trait Param Name
            Assert.AreEqual("testTraitParam1", ((CdmTraitReference)((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0]).AppliedTraits[4]).Arguments[0].ResolvedParameter.Name);
            // Trait Param Default Value
            Assert.AreEqual("TestTrait Param 1 DefaultValue", ((CdmTraitReference)((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0]).AppliedTraits[4]).Arguments[0].Value);
        }

        /// <summary>
        /// Entity with projection that exhibits custom traits
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestProjectionTrait()
        {
            string testName = "TestProjectionTrait";
            string entityName = testName;
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, new List<string> { });

            // Attribute Name
            Assert.AreEqual("TestProjectionAttribute", ((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0]).Name);
            // Trait Name
            Assert.AreEqual("does.haveDefault", ((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0]).AppliedTraits[3].NamedReference);

            // Trait Name
            Assert.AreEqual("testTrait", ((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0]).AppliedTraits[4].NamedReference);
            // Trait Param Name
            Assert.AreEqual("testTraitParam1", ((CdmTraitReference)((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0]).AppliedTraits[4]).Arguments[0].ResolvedParameter.Name);
            // Trait Param Default Value
            Assert.AreEqual("TestTrait Param 1 DefaultValue", ((CdmTraitReference)((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0]).AppliedTraits[4]).Arguments[0].Value);
        }

        /// <summary>
        /// Entity with projection that extends and exhibits custom traits
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestProjectionExtendsTrait()
        {
            string testName = "TestProjectionExtendsTrait";
            string entityName = testName;
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, new List<string> { });

            // Attribute Name
            Assert.AreEqual("TestProjectionAttribute", ((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0]).Name);
            // Trait Name
            Assert.AreEqual("does.haveDefault", ((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0]).AppliedTraits[3].NamedReference);

            // Trait Name
            Assert.AreEqual("testTrait", ((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0]).AppliedTraits[4].NamedReference);
            // Trait Param Name
            Assert.AreEqual("testTraitParam1", ((CdmTraitReference)((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0]).AppliedTraits[4]).Arguments[0].ResolvedParameter.Name);
            // Trait Param Default Value
            Assert.AreEqual("TestTrait Param 1 DefaultValue", ((CdmTraitReference)((CdmTypeAttributeDefinition)resolvedEntity.Attributes[0]).AppliedTraits[4]).Arguments[0].Value);


            // Attribute Name
            Assert.AreEqual("TestProjectionAttributeB", ((CdmTypeAttributeDefinition)resolvedEntity.Attributes[1]).Name);
            // Trait Name
            Assert.AreEqual("does.haveDefault", ((CdmTypeAttributeDefinition)resolvedEntity.Attributes[1]).AppliedTraits[3].NamedReference);

            // Trait Name
            Assert.AreEqual("testTrait", ((CdmTypeAttributeDefinition)resolvedEntity.Attributes[1]).AppliedTraits[4].NamedReference);
            // Trait Param Name
            Assert.AreEqual("testTraitParam1", ((CdmTraitReference)((CdmTypeAttributeDefinition)resolvedEntity.Attributes[1]).AppliedTraits[4]).Arguments[0].ResolvedParameter.Name);
            // Trait Param Default Value
            Assert.AreEqual("TestTrait Param 1 DefaultValue", ((CdmTraitReference)((CdmTypeAttributeDefinition)resolvedEntity.Attributes[1]).AppliedTraits[4]).Arguments[0].Value);

            // Trait Name
            Assert.AreEqual("testExtendsTraitB", ((CdmTypeAttributeDefinition)resolvedEntity.Attributes[1]).AppliedTraits[5].NamedReference);
            // Trait Param Name
            Assert.AreEqual("testTraitParam1", ((CdmTraitReference)((CdmTypeAttributeDefinition)resolvedEntity.Attributes[1]).AppliedTraits[5]).Arguments[0].ResolvedParameter.Name);
            // Trait Param Default Value
            Assert.AreEqual("TestTrait Param 1 DefaultValue", ((CdmTraitReference)((CdmTypeAttributeDefinition)resolvedEntity.Attributes[1]).AppliedTraits[5]).Arguments[0].Value);
            // Trait Param Name
            Assert.AreEqual("testExtendsTraitBParam1", ((CdmTraitReference)((CdmTypeAttributeDefinition)resolvedEntity.Attributes[1]).AppliedTraits[5]).Arguments[1].ResolvedParameter.Name);
            // Trait Param Default Value
            Assert.AreEqual("TestExtendsTraitB Param 1 DefaultValue", ((CdmTraitReference)((CdmTypeAttributeDefinition)resolvedEntity.Attributes[1]).AppliedTraits[5]).Arguments[1].Value);
        }
    }
}
