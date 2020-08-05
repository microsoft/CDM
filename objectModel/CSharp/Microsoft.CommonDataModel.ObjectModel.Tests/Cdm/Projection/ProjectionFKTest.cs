// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    [TestClass]
    public class ProjectionFKTest
    {
        private static List<List<string>> restOptsCombinations = new List<List<string>>() {
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
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "Projection", "ProjectionFKTest");

        [TestMethod]
        public async Task TestEntityAttribute()
        {
            string testName = "TestEntityAttribute";
            string entityName = "SalesEntityAttribute";

            foreach (List<string> resOpt in restOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }


        [TestMethod]
        public async Task TestEntityAttributeProj()
        {
            string testName = "TestEntityAttributeProj";
            string entityName = "SalesEntityAttribute";

            foreach (List<string> resOpt in restOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        [TestMethod]
        public async Task TestSourceWithEA()
        {
            string testName = "TestSourceWithEA";
            string entityName = "SalesSourceWithEA";

            foreach (List<string> resOpt in restOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        [TestMethod]
        public async Task TestSourceWithEAProj()
        {
            string testName = "TestSourceWithEAProj";
            string entityName = "SalesSourceWithEA";

            foreach (List<string> resOpt in restOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        [TestMethod]
        public async Task TestGroupFK()
        {
            string testName = "TestGroupFK";
            string entityName = "SalesGroupFK";

            foreach (List<string> resOpt in restOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        [TestMethod]
        public async Task TestGroupFKProj()
        {
            string testName = "TestGroupFKProj";
            string entityName = "SalesGroupFK";

            foreach (List<string> resOpt in restOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        [TestMethod]
        public async Task TestNestedFKProj()
        {
            string testName = "TestNestedFKProj";
            string entityName = "SalesNestedFK";

            foreach (List<string> resOpt in restOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        [TestMethod]
        public async Task TestPolymorphic()
        {
            string testName = "TestPolymorphic";
            string entityName = "PersonPolymorphicSource";

            foreach (List<string> resOpt in restOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        [TestMethod]
        public async Task TestPolymorphicProj()
        {
            string testName = "TestPolymorphicProj";
            string entityName = "PersonPolymorphicSource";

            foreach (List<string> resOpt in restOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        [TestMethod]
        public async Task TestPolymorphicFKProj()
        {
            string testName = "TestPolymorphicFKProj";
            string entityName = "PersonPolymorphicSourceFK";

            foreach (List<string> resOpt in restOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        [TestMethod]
        public async Task TestArraySource()
        {
            string testName = "TestArraySource";
            string entityName = "SalesArraySource";

            foreach (List<string> resOpt in restOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        [TestMethod]
        public async Task TestArraySourceProj()
        {
            string testName = "TestArraySourceProj";
            string entityName = "SalesArraySource";

            foreach (List<string> resOpt in restOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        [TestMethod]
        public async Task TestForeignKey()
        {
            string testName = "TestForeignKey";
            string entityName = "SalesForeignKey";

            foreach (List<string> resOpt in restOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        [TestMethod]
        public async Task TestForeignKeyProj()
        {
            string testName = "TestForeignKeyProj";
            string entityName = "SalesForeignKey";

            foreach (List<string> resOpt in restOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        [TestMethod]
        public async Task TestForeignKeyAlways()
        {
            string testName = "TestForeignKeyAlways";
            string entityName = "SalesForeignKeyAlways";

            foreach (List<string> resOpt in restOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        [TestMethod]
        public async Task TestCompositeKeyProj()
        {
            string testName = "TestCompositeKeyProj";
            string entityName = "SalesCompositeKey";

            foreach (List<string> resOpt in restOptsCombinations)
            {
                await LoadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
            }
        }

        private async Task LoadEntityForResolutionOptionAndSave(string testName, string entityName, List<string> resOpts)
        {
            CdmCorpusDefinition corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);
            CdmManifestDefinition manifest = await corpus.FetchObjectAsync<CdmManifestDefinition>($"local:/default.manifest.cdm.json");

            string expectedOutputPath = TestHelper.GetExpectedOutputFolderPath(testsSubpath, testName);
            string fileNameSuffix = GetResolutionOptionNameSuffix(resOpts);

            CdmEntityDefinition entSalesForeignKeyProjection = await corpus.FetchObjectAsync<CdmEntityDefinition>($"local:/{entityName}.cdm.json/{entityName}", manifest);
            Assert.IsNotNull(entSalesForeignKeyProjection);
            CdmEntityDefinition resolvedSalesForeignKeyProjection = await SaveResolved(corpus, manifest, testName, entSalesForeignKeyProjection, resOpts);
            Assert.IsNotNull(resolvedSalesForeignKeyProjection);
            AttributeContextUtil.ValidateAttributeContext(corpus, expectedOutputPath, $"{entityName}{fileNameSuffix}", resolvedSalesForeignKeyProjection);
        }

        private string GetResolutionOptionNameSuffix(List<string> resolutionOptions)
        {
            string fileNamePrefix = string.Empty;

            for (int i = 0; i < resolutionOptions.Count; i++)
            {
                fileNamePrefix = $"{fileNamePrefix}_{resolutionOptions[i]}";
            }

            if (string.IsNullOrWhiteSpace(fileNamePrefix))
            {
                fileNamePrefix = "_default";
            }

            return fileNamePrefix;
        }

        private async Task<CdmEntityDefinition> SaveResolved(CdmCorpusDefinition corpus, CdmManifestDefinition manifest, string testName, CdmEntityDefinition inputEntity, List<string> resolutionOptions)
        {
            HashSet<string> roHashSet = new HashSet<string>();
            for (int i = 0; i < resolutionOptions.Count; i++)
            {
                roHashSet.Add(resolutionOptions[i]);
            }

            string fileNameSuffix = GetResolutionOptionNameSuffix(resolutionOptions);

            string resolvedEntityName = $"Resolved_{inputEntity.EntityName}{fileNameSuffix}.cdm.json";

            ResolveOptions ro = new ResolveOptions(inputEntity.InDocument)
            {
                Directives = new AttributeResolutionDirectiveSet(roHashSet)
            };

            CdmFolderDefinition resolvedFolder = corpus.Storage.FetchRootFolder("output");
            CdmEntityDefinition resolvedEntity = await inputEntity.CreateResolvedEntityAsync(resolvedEntityName, ro, resolvedFolder);

            return resolvedEntity;
        }
    }
}
