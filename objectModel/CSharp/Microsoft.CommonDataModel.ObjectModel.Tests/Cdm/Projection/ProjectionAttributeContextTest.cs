// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
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
            string entityName = testName;

            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);
            CdmManifestDefinition manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>($"local:/default.manifest.cdm.json");
            string expectedOutputPath = TestHelper.GetExpectedOutputFolderPath(testsSubpath, testName);

            CdmEntityDefinition entTestEntityStringReference = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}", manifest);
            Assert.IsNotNull(entTestEntityStringReference);
            CdmEntityDefinition resolvedTestEntityStringReference = await ProjectionTestUtils.GetResolvedEntity(corpus, entTestEntityStringReference, new List<string> { });
            Assert.IsNotNull(resolvedTestEntityStringReference);
            AttributeContextUtil.ValidateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityStringReference);
        }

        /// <summary>
        /// Extends entity with an entity reference
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestEntityEntityReference()
        {
            string testName = "TestEntityEntityReference";
            string entityName = testName;

            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);
            CdmManifestDefinition manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>($"local:/default.manifest.cdm.json");
            string expectedOutputPath = TestHelper.GetExpectedOutputFolderPath(testsSubpath, testName);

            CdmEntityDefinition entTestEntityEntityReference = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}", manifest);
            Assert.IsNotNull(entTestEntityEntityReference);
            CdmEntityDefinition resolvedTestEntityEntityReference = await ProjectionTestUtils.GetResolvedEntity(corpus, entTestEntityEntityReference, new List<string> { });
            Assert.IsNotNull(resolvedTestEntityEntityReference);
            AttributeContextUtil.ValidateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityEntityReference);
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

            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);
            CdmManifestDefinition manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>($"local:/default.manifest.cdm.json");
            string expectedOutputPath = TestHelper.GetExpectedOutputFolderPath(testsSubpath, testName);

            CdmEntityDefinition entTestEntityProjection = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}", manifest);
            Assert.IsNotNull(entTestEntityProjection);
            CdmEntityDefinition resolvedTestEntityProjection = await ProjectionTestUtils.GetResolvedEntity(corpus, entTestEntityProjection, new List<string> { });
            Assert.IsNotNull(resolvedTestEntityProjection);
            AttributeContextUtil.ValidateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityProjection);
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

            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);
            CdmManifestDefinition manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>($"local:/default.manifest.cdm.json");
            string expectedOutputPath = TestHelper.GetExpectedOutputFolderPath(testsSubpath, testName);

            CdmEntityDefinition entTestEntityNestedProjection = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}", manifest);
            Assert.IsNotNull(entTestEntityNestedProjection);
            CdmEntityDefinition resolvedTestEntityNestedProjection = await ProjectionTestUtils.GetResolvedEntity(corpus, entTestEntityNestedProjection, new List<string> { });
            Assert.IsNotNull(resolvedTestEntityNestedProjection);
            AttributeContextUtil.ValidateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityNestedProjection);
        }

        /// <summary>
        /// Entity attribute referenced with a string
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestEntityAttributeStringReference()
        {
            string testName = "TestEntityAttributeStringReference";
            string entityName = testName;

            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);
            CdmManifestDefinition manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>($"local:/default.manifest.cdm.json");
            string expectedOutputPath = TestHelper.GetExpectedOutputFolderPath(testsSubpath, testName);

            CdmEntityDefinition entTestEntityAttributeStringReference = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}", manifest);
            Assert.IsNotNull(entTestEntityAttributeStringReference);
            CdmEntityDefinition resolvedTestEntityAttributeStringReference = await ProjectionTestUtils.GetResolvedEntity(corpus, entTestEntityAttributeStringReference, new List<string> { });
            Assert.IsNotNull(resolvedTestEntityAttributeStringReference);
            AttributeContextUtil.ValidateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityAttributeStringReference);
        }

        /// <summary>
        /// Entity attribute referenced with an entity reference
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestEntityAttributeEntityReference()
        {
            string testName = "TestEntityAttributeEntityReference";
            string entityName = testName;

            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);
            CdmManifestDefinition manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>($"local:/default.manifest.cdm.json");
            string expectedOutputPath = TestHelper.GetExpectedOutputFolderPath(testsSubpath, testName);

            CdmEntityDefinition entTestEntityAttributeEntityReference = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}", manifest);
            Assert.IsNotNull(entTestEntityAttributeEntityReference);
            CdmEntityDefinition resolvedTestEntityAttributeEntityReference = await ProjectionTestUtils.GetResolvedEntity(corpus, entTestEntityAttributeEntityReference, new List<string> { });
            Assert.IsNotNull(resolvedTestEntityAttributeEntityReference);
            AttributeContextUtil.ValidateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityAttributeEntityReference);
        }

        /// <summary>
        /// Entity attribute referenced with a projection
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestEntityAttributeProjection()
        {
            string testName = "TestEntityAttributeProjection";
            string entityName = testName;

            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);
            CdmManifestDefinition manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>($"local:/default.manifest.cdm.json");
            string expectedOutputPath = TestHelper.GetExpectedOutputFolderPath(testsSubpath, testName);

            CdmEntityDefinition entTestEntityAttributeProjection = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}", manifest);
            Assert.IsNotNull(entTestEntityAttributeProjection);
            CdmEntityDefinition resolvedTestEntityAttributeProjection = await ProjectionTestUtils.GetResolvedEntity(corpus, entTestEntityAttributeProjection, new List<string> { });
            Assert.IsNotNull(resolvedTestEntityAttributeProjection);
            AttributeContextUtil.ValidateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityAttributeProjection);
        }

        /// <summary>
        /// Entity attribute referenced with a nested projection
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestEntityAttributeNestedProjection()
        {
            string testName = "TestEntityAttributeNestedProjection";
            string entityName = testName;

            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);
            CdmManifestDefinition manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>($"local:/default.manifest.cdm.json");
            string expectedOutputPath = TestHelper.GetExpectedOutputFolderPath(testsSubpath, testName);

            CdmEntityDefinition entTestEntityAttributeNestedProjection = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}", manifest);
            Assert.IsNotNull(entTestEntityAttributeNestedProjection);
            CdmEntityDefinition resolvedTestEntityAttributeNestedProjection = await ProjectionTestUtils.GetResolvedEntity(corpus, entTestEntityAttributeNestedProjection, new List<string> { });
            Assert.IsNotNull(resolvedTestEntityAttributeNestedProjection);
            AttributeContextUtil.ValidateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityAttributeNestedProjection);
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

            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);
            CdmManifestDefinition manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>($"local:/default.manifest.cdm.json");
            string expectedOutputPath = TestHelper.GetExpectedOutputFolderPath(testsSubpath, testName);

            CdmEntityDefinition entTestEntityTrait = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}", manifest);
            Assert.IsNotNull(entTestEntityTrait);
            CdmEntityDefinition resolvedTestEntityTrait = await ProjectionTestUtils.GetResolvedEntity(corpus, entTestEntityTrait, new List<string> { });
            Assert.IsNotNull(resolvedTestEntityTrait);
            AttributeContextUtil.ValidateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityTrait);
            {
                // Attribute Name
                Assert.AreEqual("TestAttribute", ((CdmTypeAttributeDefinition)resolvedTestEntityTrait.Attributes[0]).Name);
                // Trait Name
                Assert.AreEqual("does.haveDefault", ((CdmTypeAttributeDefinition)resolvedTestEntityTrait.Attributes[0]).AppliedTraits[3].NamedReference);

                // Trait Name
                Assert.AreEqual("testTrait", ((CdmTypeAttributeDefinition)resolvedTestEntityTrait.Attributes[0]).AppliedTraits[4].NamedReference);
                // Trait Param Name
                Assert.AreEqual("testTraitParam1", ((CdmArgumentDefinition)((CdmTypeAttributeDefinition)resolvedTestEntityTrait.Attributes[0]).AppliedTraits[4].Arguments[0]).ResolvedParameter.Name);
                // Trait Param Default Value
                Assert.AreEqual("TestTrait Param 1 DefaultValue", ((CdmArgumentDefinition)((CdmTypeAttributeDefinition)resolvedTestEntityTrait.Attributes[0]).AppliedTraits[4].Arguments[0]).Value);
            }
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

            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);
            CdmManifestDefinition manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>($"local:/default.manifest.cdm.json");
            string expectedOutputPath = TestHelper.GetExpectedOutputFolderPath(testsSubpath, testName);

            CdmEntityDefinition entTestEntityExtendsTrait = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}", manifest);
            Assert.IsNotNull(entTestEntityExtendsTrait);
            CdmEntityDefinition resolvedTestEntityExtendsTrait = await ProjectionTestUtils.GetResolvedEntity(corpus, entTestEntityExtendsTrait, new List<string> { });
            Assert.IsNotNull(resolvedTestEntityExtendsTrait);
            AttributeContextUtil.ValidateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestEntityExtendsTrait);
            {
                // Attribute Name
                Assert.AreEqual("TestExtendsTraitAttribute", ((CdmTypeAttributeDefinition)resolvedTestEntityExtendsTrait.Attributes[0]).Name);
                // Trait Name
                Assert.AreEqual("does.haveDefault", ((CdmTypeAttributeDefinition)resolvedTestEntityExtendsTrait.Attributes[0]).AppliedTraits[3].NamedReference);

                // Trait Name
                Assert.AreEqual("testTraitDerived", ((CdmTypeAttributeDefinition)resolvedTestEntityExtendsTrait.Attributes[0]).AppliedTraits[4].NamedReference);
                // Trait Param Name
                Assert.AreEqual("testTraitParam1", ((CdmArgumentDefinition)((CdmTypeAttributeDefinition)resolvedTestEntityExtendsTrait.Attributes[0]).AppliedTraits[4].Arguments[0]).ResolvedParameter.Name);
                // Trait Param Default Value
                Assert.AreEqual("TestTrait Param 1 DefaultValue", ((CdmArgumentDefinition)((CdmTypeAttributeDefinition)resolvedTestEntityExtendsTrait.Attributes[0]).AppliedTraits[4].Arguments[0]).Value);
            }
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

            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);
            CdmManifestDefinition manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>($"local:/default.manifest.cdm.json");
            string expectedOutputPath = TestHelper.GetExpectedOutputFolderPath(testsSubpath, testName);

            CdmEntityDefinition entTestProjectionTrait = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}", manifest);
            Assert.IsNotNull(entTestProjectionTrait);
            CdmEntityDefinition resolvedTestProjectionTrait = await ProjectionTestUtils.GetResolvedEntity(corpus, entTestProjectionTrait, new List<string> { });
            Assert.IsNotNull(resolvedTestProjectionTrait);
            AttributeContextUtil.ValidateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestProjectionTrait);
            {
                // Attribute Name
                Assert.AreEqual("TestProjectionAttribute", ((CdmTypeAttributeDefinition)resolvedTestProjectionTrait.Attributes[0]).Name);
                // Trait Name
                Assert.AreEqual("does.haveDefault", ((CdmTypeAttributeDefinition)resolvedTestProjectionTrait.Attributes[0]).AppliedTraits[3].NamedReference);

                // Trait Name
                Assert.AreEqual("testTrait", ((CdmTypeAttributeDefinition)resolvedTestProjectionTrait.Attributes[0]).AppliedTraits[4].NamedReference);
                // Trait Param Name
                Assert.AreEqual("testTraitParam1", ((CdmArgumentDefinition)((CdmTypeAttributeDefinition)resolvedTestProjectionTrait.Attributes[0]).AppliedTraits[4].Arguments[0]).ResolvedParameter.Name);
                // Trait Param Default Value
                Assert.AreEqual("TestTrait Param 1 DefaultValue", ((CdmArgumentDefinition)((CdmTypeAttributeDefinition)resolvedTestProjectionTrait.Attributes[0]).AppliedTraits[4].Arguments[0]).Value);
            }
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

            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);
            CdmManifestDefinition manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>($"local:/default.manifest.cdm.json");
            string expectedOutputPath = TestHelper.GetExpectedOutputFolderPath(testsSubpath, testName);

            CdmEntityDefinition entTestProjectionExtendsTrait = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}", manifest);
            Assert.IsNotNull(entTestProjectionExtendsTrait);
            CdmEntityDefinition resolvedTestProjectionExtendsTrait = await ProjectionTestUtils.GetResolvedEntity(corpus, entTestProjectionExtendsTrait, new List<string> { });
            Assert.IsNotNull(resolvedTestProjectionExtendsTrait);
            AttributeContextUtil.ValidateAttributeContext(corpus, expectedOutputPath, entityName, resolvedTestProjectionExtendsTrait);
            {
                // Attribute Name
                Assert.AreEqual("TestProjectionAttribute", ((CdmTypeAttributeDefinition)resolvedTestProjectionExtendsTrait.Attributes[0]).Name);
                // Trait Name
                Assert.AreEqual("does.haveDefault", ((CdmTypeAttributeDefinition)resolvedTestProjectionExtendsTrait.Attributes[0]).AppliedTraits[3].NamedReference);

                // Trait Name
                Assert.AreEqual("testTrait", ((CdmTypeAttributeDefinition)resolvedTestProjectionExtendsTrait.Attributes[0]).AppliedTraits[4].NamedReference);
                // Trait Param Name
                Assert.AreEqual("testTraitParam1", ((CdmArgumentDefinition)((CdmTypeAttributeDefinition)resolvedTestProjectionExtendsTrait.Attributes[0]).AppliedTraits[4].Arguments[0]).ResolvedParameter.Name);
                // Trait Param Default Value
                Assert.AreEqual("TestTrait Param 1 DefaultValue", ((CdmArgumentDefinition)((CdmTypeAttributeDefinition)resolvedTestProjectionExtendsTrait.Attributes[0]).AppliedTraits[4].Arguments[0]).Value);


                // Attribute Name
                Assert.AreEqual("TestProjectionAttributeB", ((CdmTypeAttributeDefinition)resolvedTestProjectionExtendsTrait.Attributes[1]).Name);
                // Trait Name
                Assert.AreEqual("does.haveDefault", ((CdmTypeAttributeDefinition)resolvedTestProjectionExtendsTrait.Attributes[1]).AppliedTraits[3].NamedReference);

                // Trait Name
                Assert.AreEqual("testTrait", ((CdmTypeAttributeDefinition)resolvedTestProjectionExtendsTrait.Attributes[1]).AppliedTraits[4].NamedReference);
                // Trait Param Name
                Assert.AreEqual("testTraitParam1", ((CdmArgumentDefinition)((CdmTypeAttributeDefinition)resolvedTestProjectionExtendsTrait.Attributes[1]).AppliedTraits[4].Arguments[0]).ResolvedParameter.Name);
                // Trait Param Default Value
                Assert.AreEqual("TestTrait Param 1 DefaultValue", ((CdmArgumentDefinition)((CdmTypeAttributeDefinition)resolvedTestProjectionExtendsTrait.Attributes[1]).AppliedTraits[4].Arguments[0]).Value);

                // Trait Name
                Assert.AreEqual("testExtendsTraitB", ((CdmTypeAttributeDefinition)resolvedTestProjectionExtendsTrait.Attributes[1]).AppliedTraits[5].NamedReference);
                // Trait Param Name
                Assert.AreEqual("testTraitParam1", ((CdmArgumentDefinition)((CdmTypeAttributeDefinition)resolvedTestProjectionExtendsTrait.Attributes[1]).AppliedTraits[5].Arguments[0]).ResolvedParameter.Name);
                // Trait Param Default Value
                Assert.AreEqual("TestTrait Param 1 DefaultValue", ((CdmArgumentDefinition)((CdmTypeAttributeDefinition)resolvedTestProjectionExtendsTrait.Attributes[1]).AppliedTraits[5].Arguments[0]).Value);
                // Trait Param Name
                Assert.AreEqual("testExtendsTraitBParam1", ((CdmArgumentDefinition)((CdmTypeAttributeDefinition)resolvedTestProjectionExtendsTrait.Attributes[1]).AppliedTraits[5].Arguments[1]).ResolvedParameter.Name);
                // Trait Param Default Value
                Assert.AreEqual("TestExtendsTraitB Param 1 DefaultValue", ((CdmArgumentDefinition)((CdmTypeAttributeDefinition)resolvedTestProjectionExtendsTrait.Attributes[1]).AppliedTraits[5].Arguments[1]).Value);
            }
        }
    }
}
