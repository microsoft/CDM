// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.Projection
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Storage;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;

    /// <summary>
    /// A test class for testing the CombineAttributes operation in a projection as well as Select 'one' in a resolution guidance
    /// </summary>
    [TestClass]
    public class ProjectionCombineTest
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
        private string testsSubpath = Path.Combine("Cdm", "Projection", "ProjectionCombineTest");

        /// <summary>
        /// Test Entity Extends with a Resolution Guidance that selects 'one'
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestExtends()
        {
            string testName = "TestExtends";
            string entityName = "Customer";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test Entity Extends with a Combine Attributes operation
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestExtendsProj()
        {
            string testName = "TestExtendsProj";
            string entityName = "Customer";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test Entity Attribute with a Resolution Guidance that selects 'one'
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestEA()
        {
            string testName = "TestEA";
            string entityName = "Customer";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test Entity Attribute with a Combine Attributes operation
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestEAProj()
        {
            string testName = "TestEAProj";
            string entityName = "Customer";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test Entity Attribute with a Combine Attributes operation but IsPolymorphicSource flag set to false
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestNonPolymorphicProj()
        {
            string testName = "TestNonPolymorphicProj";
            string entityName = "NewPerson";

            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            CdmEntityDefinition entity = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}");
            CdmEntityDefinition resolvedEntity = await ProjectionTestUtils.GetResolvedEntity(corpus, entity, new List<string> { });

            // Original set of attributes: ["name", "age", "address", "phoneNumber", "email"]
            // Combined attributes ["phoneNumber", "email"] into "contactAt"
            Assert.AreEqual(4, resolvedEntity.Attributes.Count);
            Assert.AreEqual("name", (resolvedEntity.Attributes[0] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("age", (resolvedEntity.Attributes[1] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("address", (resolvedEntity.Attributes[2] as CdmTypeAttributeDefinition).Name);
            Assert.AreEqual("contactAt", (resolvedEntity.Attributes[3] as CdmTypeAttributeDefinition).Name);
        }

        /// <summary>
        /// Test a Combine Attributes operation with an empty select list
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestEmptyProj()
        {
            string testName = "TestEmptyProj";
            string entityName = "Customer";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test a collection of Combine Attributes operation
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestCollProj()
        {
            string testName = "TestCollProj";
            string entityName = "Customer";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test Nested Combine Attributes operations
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestNestedProj()
        {
            string testName = "TestNestedProj";
            string entityName = "Customer";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test Multiple Nested Operations with Combine including ArrayExpansion and Rename
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestMultiProj()
        {
            string testName = "TestMultiProj";
            string entityName = "Customer";
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
        }

        /// <summary>
        /// Test a Combine Attributes operation with condition set to false
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestCondProj()
        {
            string testName = "TestCondProj";
            string entityName = "Customer";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test Nested Combine with Rename Operation
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestRenProj()
        {
            string testName = "TestRenProj";
            string entityName = "Customer";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                if (resOpt.Contains("structured"))
                {
                    // Rename attributes is not supported on an attribute group yet.
                    continue;
                }

                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test Entity Attribute with a Combine Attributes operation that selects a common already 'merged' attribute (e.g. IsPrimary)
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestCommProj()
        {
            string testName = "TestCommProj";
            string entityName = "Customer";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test a Combine Attributes operation by selecting missing attributes
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestMissProj()
        {
            string testName = "TestMissProj";
            string entityName = "Customer";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test a Combine Attributes operation with a different sequence of selection attributes
        /// </summary>
        /// <returns></returns>
        [TestMethod]
        public async Task TestSeqProj()
        {
            string testName = "TestSeqProj";
            string entityName = "Customer";
            CdmCorpusDefinition corpus = ProjectionTestUtils.GetLocalCorpus(testsSubpath, testName);

            foreach (List<string> resOpt in resOptsCombinations)
            {
                await ProjectionTestUtils.LoadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
            }
        }

        /// <summary>
        /// Test for object model
        /// </summary>
        [TestMethod]
        public async Task TestEAProjOM()
        {
            string className = "ProjectionCombineTest";
            string testName = "TestEAProjOM";

            string entityName_Email = "Email";
            List<TypeAttributeParam> attributeParams_Email = new List<TypeAttributeParam>();
            {
                attributeParams_Email.Add(new TypeAttributeParam("EmailID", "string", "identifiedBy"));
                attributeParams_Email.Add(new TypeAttributeParam("Address", "string", "hasA"));
                attributeParams_Email.Add(new TypeAttributeParam("IsPrimary", "boolean", "hasA"));
            }

            string entityName_Phone = "Phone";
            List<TypeAttributeParam> attributeParams_Phone = new List<TypeAttributeParam>();
            {
                attributeParams_Phone.Add(new TypeAttributeParam("PhoneID", "string", "identifiedBy"));
                attributeParams_Phone.Add(new TypeAttributeParam("Number", "string", "hasA"));
                attributeParams_Phone.Add(new TypeAttributeParam("IsPrimary", "boolean", "hasA"));
            }

            string entityName_Social = "Social";
            List<TypeAttributeParam> attributeParams_Social = new List<TypeAttributeParam>();
            {
                attributeParams_Social.Add(new TypeAttributeParam("SocialID", "string", "identifiedBy"));
                attributeParams_Social.Add(new TypeAttributeParam("Account", "string", "hasA"));
                attributeParams_Social.Add(new TypeAttributeParam("IsPrimary", "boolean", "hasA"));
            }

            string entityName_Customer = "Customer";
            List<TypeAttributeParam> attributeParams_Customer = new List<TypeAttributeParam>();
            {
                attributeParams_Customer.Add(new TypeAttributeParam("CustomerName", "string", "hasA"));
            }

            List<string> selectedAttributes = new List<string>()
            {
                "EmailID",
                "PhoneID",
                "SocialID"
            };

            using (ProjectionOMTestUtil util = new ProjectionOMTestUtil(className, testName))
            {
                CdmEntityDefinition entity_Email = util.CreateBasicEntity(entityName_Email, attributeParams_Email);
                util.ValidateBasicEntity(entity_Email, entityName_Email, attributeParams_Email);

                CdmEntityDefinition entity_Phone = util.CreateBasicEntity(entityName_Phone, attributeParams_Phone);
                util.ValidateBasicEntity(entity_Phone, entityName_Phone, attributeParams_Phone);

                CdmEntityDefinition entity_Social = util.CreateBasicEntity(entityName_Social, attributeParams_Social);
                util.ValidateBasicEntity(entity_Social, entityName_Social, attributeParams_Social);

                CdmEntityDefinition entity_Customer = util.CreateBasicEntity(entityName_Customer, attributeParams_Customer);
                util.ValidateBasicEntity(entity_Customer, entityName_Customer, attributeParams_Customer);

                CdmProjection projection_Customer = util.CreateProjection(entity_Customer.EntityName);
                CdmTypeAttributeDefinition typeAttribute_MergeInto = util.CreateTypeAttribute("MergeInto", "string", "hasA");
                CdmOperationCombineAttributes operation_CombineAttributes = util.CreateOperationCombineAttributes(projection_Customer, selectedAttributes, typeAttribute_MergeInto);
                CdmEntityReference projectionEntityRef_Customer = util.CreateProjectionInlineEntityReference(projection_Customer);

                CdmEntityAttributeDefinition entityAttribute_ContactAt = util.CreateEntityAttribute("ContactAt", projectionEntityRef_Customer);
                entity_Customer.Attributes.Add(entityAttribute_ContactAt);

                foreach (List<string> resOpts in resOptsCombinations)
                {
                    await util.GetAndValidateResolvedEntity(entity_Customer, resOpts);
                }

                await util.DefaultManifest.SaveAsAsync(util.ManifestDocName, saveReferenced: true);
            }
        }
    }
}
