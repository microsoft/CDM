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
    using System.Linq;
    using System.Threading.Tasks;

    /// <summary>
    /// A test class for testing the IncludeAttributes operation in a projection as well as SelectsSomeTakeNames in a resolution guidance
    /// </summary>
    [TestClass]
    public class ProjectionIncludeTest
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
        /// Path to foundations
        /// </summary>
        private const string foundationJsonPath = "cdm:/foundations.cdm.json";

        /// <summary>
        /// The path between TestDataPath and TestName
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "Projection", "ProjectionIncludeTest");

        /// <summary>
        /// Test for entity extends with resolution guidance with a SelectsSomeTakeNames
        /// </summary>
        [TestMethod]
        public async Task TestExtends()
        {
            string testName = "TestExtends";
            string entityName = "Color";

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test for entity extends with projection with an includeAttributes operation
        /// </summary>
        [TestMethod]
        public async Task TestExtendsProj()
        {
            string testName = "TestExtendsProj";
            string entityName = "Color";

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test for entity attribute with resolution guidance with a SelectsSomeTakeNames
        /// </summary>
        [TestMethod]
        public async Task TestEA()
        {
            string testName = "TestEA";
            string entityName = "Color";

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test for entity attribute with projection with an includeAttributes operation
        /// </summary>
        [TestMethod]
        public async Task TestEAProj()
        {
            string testName = "TestEAProj";
            string entityName = "Color";

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test for object model
        /// </summary>
        [TestMethod]
        public void TestEAProjOM()
        {
            string className = "ProjectionIncludeTest";
            string testName = "TestEAProjOM";

            string entityName_RGB = "RGB";
            List<TypeAttributeParam> attributeParams_RGB = new List<TypeAttributeParam>();
            {
                attributeParams_RGB.Add(new TypeAttributeParam("Red", "string", "hasA"));
                attributeParams_RGB.Add(new TypeAttributeParam("Green", "string", "hasA"));
                attributeParams_RGB.Add(new TypeAttributeParam("Blue", "string", "hasA"));
                attributeParams_RGB.Add(new TypeAttributeParam("IsGrayscale", "boolean", "hasA"));
            }

            string entityName_Color = "Color";
            List<TypeAttributeParam> attributeParams_Color = new List<TypeAttributeParam>();
            {
                attributeParams_Color.Add(new TypeAttributeParam("ColorName", "string", "identifiedBy"));
            }

            List<string> includeAttributeNames = new List<string>()
            {
                "Red",
                "Green",
                "Blue"
            };

            using (ProjectionOMTestUtil util = new ProjectionOMTestUtil(className, testName))
            {
                CdmEntityDefinition entity_RGB = util.CreateBasicEntity(entityName_RGB, attributeParams_RGB);
                util.ValidateBasicEntity(entity_RGB, entityName_RGB, attributeParams_RGB);

                CdmEntityDefinition entity_Color = util.CreateBasicEntity(entityName_Color, attributeParams_Color);
                util.ValidateBasicEntity(entity_Color, entityName_Color, attributeParams_Color);

                CdmProjection projection_RGBColor = util.CreateProjection(entity_RGB.EntityName);
                CdmOperationIncludeAttributes operation_IncludeAttributes = util.CreateOperationInputAttribute(projection_RGBColor, includeAttributeNames);
                CdmEntityReference projectionEntityRef_RGBColor = util.CreateProjectionInlineEntityReference(projection_RGBColor);

                CdmEntityAttributeDefinition entityAttribute_RGBColor = util.CreateEntityAttribute("RGBColor", projectionEntityRef_RGBColor);
                entity_Color.Attributes.Add(entityAttribute_RGBColor);

                foreach (List<string> resOpts in resOptsCombinations)
                {
                    CdmEntityDefinition resolvedEntity_Color = util.GetAndValidateResolvedEntity(entity_Color, resOpts);
                }

                util.DefaultManifest.SaveAsAsync(util.ManifestDocName, saveReferenced: true).GetAwaiter().GetResult();
            }
        }

        /// <summary>
        /// Test for leaf level projection
        /// </summary>
        [TestMethod]
        public async Task TestNested1of3Proj()
        {
            string testName = "TestNested1of3Proj";
            string entityName = "Color";

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test for mid level projection
        /// </summary>
        [TestMethod]
        public async Task TestNested2of3Proj()
        {
            string testName = "TestNested2of3Proj";
            string entityName = "Color";

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test for top level projection
        /// </summary>
        [TestMethod]
        public async Task TestNested3of3Proj()
        {
            string testName = "TestNested3of3Proj";
            string entityName = "Color";

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test for Condition = "false"
        /// </summary>
        [TestMethod]
        public async Task TestConditionProj()
        {
            string testName = "TestConditionProj";
            string entityName = "Color";

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test for SelectsSomeTakeNames by Group Name
        /// </summary>
        [TestMethod]
        public async Task TestGroupName()
        {
            string testName = "TestGroupName";
            string entityName = "Product";

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test for include attributes operation by Group Name
        /// </summary>
        [TestMethod]
        public async Task TestGroupNameProj()
        {
            string testName = "TestGroupNameProj";
            string entityName = "Product";

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test for SelectsSomeTakeNames from an Array
        /// </summary>
        [TestMethod]
        public async Task TestArray()
        {
            string testName = "TestArray";
            string entityName = "Sales";

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test for SelectsSomeTakeNames from a renamed Array
        /// </summary>
        [TestMethod]
        public async Task TestArrayRename()
        {
            string testName = "TestArrayRename";
            string entityName = "Sales";

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test for Include Attributes from an Array
        /// </summary>
        [TestMethod]
        public async Task TestArrayProj()
        {
            string testName = "TestArrayProj";
            string entityName = "Sales";

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test for SelectsSomeTakeNames from a Polymorphic Source
        /// </summary>
        [TestMethod]
        public async Task TestPolymorphic()
        {
            string testName = "TestPolymorphic";
            string entityName = "Person";

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test for Include Attributes from a Polymorphic Source
        /// </summary>
        [TestMethod]
        public async Task TestPolymorphicProj()
        {
            string testName = "TestPolymorphicProj";
            string entityName = "Person";

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test for entity attribute with resolution guidance with an empty SelectsSomeTakeNames list
        /// </summary>
        [TestMethod]
        public async Task TestEmpty()
        {
            string testName = "TestEmpty";
            string entityName = "Color";

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test for entity attribute with projection with an empty includeAttributes operation list
        /// </summary>
        [TestMethod]
        public async Task TestEmptyProj()
        {
            string testName = "TestEmptyProj";
            string entityName = "Color";

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test for Nested Projections that include then exclude some attributes
        /// </summary>
        [TestMethod]
        public async Task TestNestedIncludeExcludeProj()
        {
            string testName = "TestNestedIncludeExcludeProj";
            string entityName = "Color";

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test for Projections with include and exclude
        /// </summary>
        [TestMethod]
        public async Task TestIncludeExcludeProj()
        {
            string testName = "TestIncludeExcludeProj";
            string entityName = "Color";

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        /// <summary>
        /// Loads an entity, resolves it, and then validates the generated attribute contexts
        /// </summary>
        private async Task LoadEntityForResolutionOptionAndSave(string testName, string entityName, List<string> resOpts)
        {
            string expectedOutputPath = TestHelper.GetExpectedOutputFolderPath(testsSubpath, testName);
            string fileNameSuffix = ProjectionTestUtils.GetResolutionOptionNameSuffix(resOpts);

            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);
            corpus.Storage.Mount("expected", new LocalAdapter(expectedOutputPath));
            CdmManifestDefinition manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>($"local:/default.manifest.cdm.json");

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            Assert.IsNotNull(entity);
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, resOpts, true);
            Assert.IsNotNull(resolvedEntity);

            await ValidateResolvedAttributes(corpus, resolvedEntity, entityName, fileNameSuffix);

            AttributeContextUtil.ValidateAttributeContext(corpus, expectedOutputPath, $"{entityName}{fileNameSuffix}", resolvedEntity);
        }

        /// <summary>
        /// Validate the list of resolved attributes against an expected list
        /// </summary>
        private async Task ValidateResolvedAttributes(CdmCorpusDefinition corpus, CdmEntityDefinition actualResolvedEntity, string entityName, string fileNameSuffix)
        {
            CdmEntityDefinition expectedResolvedEntity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"expected:/Resolved_{entityName}{fileNameSuffix}.cdm.json/Resolved_{entityName}{fileNameSuffix}");

            Assert.AreEqual(expectedResolvedEntity.Attributes.Count, actualResolvedEntity.Attributes.Count);
            for (int i = 0; i < expectedResolvedEntity.Attributes.Count; i++)
            {
                Assert.AreEqual(expectedResolvedEntity.Attributes[i].FetchObjectDefinitionName(), actualResolvedEntity.Attributes[i].FetchObjectDefinitionName());
            }
        }
    }
}
