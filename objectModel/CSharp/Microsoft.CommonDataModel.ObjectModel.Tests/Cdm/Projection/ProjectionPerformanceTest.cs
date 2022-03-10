// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.Projection
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using System.Diagnostics;
    using System.IO;
    using System.Threading.Tasks;
    using Assert = Microsoft.CommonDataModel.ObjectModel.Tests.AssertExtension;

    /// <summary>
    /// A test class for testing the performance of projection operations
    /// </summary>
    [TestClass]
    public class ProjectionPerformanceTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName
        /// </summary>
        private readonly string testsSubpath = Path.Combine("Cdm", "Projection", nameof(ProjectionPerformanceTest));

        /// <summary>
        /// Test the performance of loading an entity that contains a deeply nested projection
        /// </summary>
        [TestMethod]
        public async Task TestProjectionPerformanceOnLoad()
        {
            string testName = nameof(TestProjectionPerformanceOnLoad);
            var corpus = TestHelper.GetLocalCorpus(testsSubpath, testName);
            var entity = await corpus.FetchObjectAsync<CdmEntityDefinition>("largeProjectionEntity.cdm.json/largeProjectionEntity");
            var operation = ((entity.Attributes[0] as CdmEntityAttributeDefinition).Entity.ExplicitReference as CdmProjection).Operations[0] as CdmOperationAddArtifactAttribute;
            var attGroup = (operation.NewAttribute as CdmAttributeGroupReference).ExplicitReference as CdmAttributeGroupDefinition;

            // add a large number of attributes to the projection
            for (var i = 1; i < 10000; i++)
            {
                attGroup.Members.Add(new CdmTypeAttributeDefinition(corpus.Ctx, "a" + i));
            }
            var watch = Stopwatch.StartNew();
            // reindex the entity to run through the visit function
            await entity.InDocument.IndexIfNeeded(new ResolveOptions(entity.InDocument), true);
            watch.Stop();
            Assert.Performance(500, watch.ElapsedMilliseconds);
        }
    }
}
