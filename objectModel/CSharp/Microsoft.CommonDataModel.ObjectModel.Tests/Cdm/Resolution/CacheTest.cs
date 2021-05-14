// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.CommonDataModel.ObjectModel.Cdm;
using Microsoft.CommonDataModel.ObjectModel.Utilities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Microsoft.CommonDataModel.ObjectModel.Tests.Cdm.Resolution
{
    [TestClass]
    public class CacheTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "Resolution", "Cache");

        /// <summary>
        /// The TestName for all tests here
        /// </summary>
        private string testPath = "TestMaxDepth";

        /// <summary>
        /// Test when cached value hit the max depth, we are now getting
        /// attributes where max depth should not be reached
        /// </summary>
        [TestMethod]
        public async Task TestMaxDepthCached()
        {
            CdmCorpusDefinition cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, testPath);
            CdmEntityDefinition aEnt = await cdmCorpus.FetchObjectAsync<CdmEntityDefinition>("A.cdm.json/A");
            CdmEntityDefinition bEnt = await cdmCorpus.FetchObjectAsync<CdmEntityDefinition>("B.cdm.json/B");
            CdmEntityDefinition cEnt = await cdmCorpus.FetchObjectAsync<CdmEntityDefinition>("C.cdm.json/C");
            CdmEntityDefinition dEnt = await cdmCorpus.FetchObjectAsync<CdmEntityDefinition>("D.cdm.json/D");

            // when resolving B, it should include any attributes from D because
            // it is outside of the maxDepth
            CdmEntityDefinition resB = await bEnt.CreateResolvedEntityAsync("resB", new ResolveOptions(
                bEnt.InDocument,
                new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "structured" })
            ));
            // ensure that when resolving A, attributes from D are excluded because they are beyond the max depth
            CdmEntityDefinition resA = await aEnt.CreateResolvedEntityAsync("resA", new ResolveOptions(
                aEnt.InDocument,
                new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "structured" })
            ));

            // check the attributes found in D from resolving A
            CdmAttributeGroupDefinition bAttInA = ((CdmAttributeGroupDefinition)((CdmAttributeGroupReference)resA.Attributes[1]).ExplicitReference);
            CdmAttributeGroupDefinition cAttInA = ((CdmAttributeGroupDefinition)((CdmAttributeGroupReference)(bAttInA.Members[1])).ExplicitReference);
            CdmAttributeGroupDefinition dAttInA = ((CdmAttributeGroupDefinition)((CdmAttributeGroupReference)(cAttInA.Members[1])).ExplicitReference);
            Assert.AreEqual(1, dAttInA.Members.Count);
            // check that the attribute in D is a foreign key attribute
            CdmTypeAttributeDefinition dIdAttFromA = (CdmTypeAttributeDefinition)(dAttInA.Members[0]);
            Assert.AreEqual("dId", dIdAttFromA.Name);
            Assert.IsNotNull(dIdAttFromA.AppliedTraits.Item("is.linkedEntity.identifier"));

            // check the attributes found in D from resolving B
            CdmAttributeGroupDefinition cAttInB = ((CdmAttributeGroupDefinition)((CdmAttributeGroupReference)resB.Attributes[1]).ExplicitReference);
            CdmAttributeGroupDefinition dAttInB = ((CdmAttributeGroupDefinition)((CdmAttributeGroupReference)(cAttInB.Members[1])).ExplicitReference);
            Assert.AreEqual(dAttInB.Members.Count, 2);
            // check that the attribute in D is not a foreign key attribute
            CdmTypeAttributeDefinition dIdAttFromB = (CdmTypeAttributeDefinition)(dAttInB.Members[0]);
            Assert.AreEqual("dId", dIdAttFromB.Name);
            Assert.IsNull(dIdAttFromB.AppliedTraits.Item("is.linkedEntity.identifier"));
        }

        /// <summary>
        /// Test when cached value did not hit max depth and we are
        /// now getting attributes where max depth should be hit
        /// </summary>
        [TestMethod]
        public async Task TestNonMaxDepthCached()
        {
            CdmCorpusDefinition cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, "TestMaxDepth");
            CdmEntityDefinition aEnt = await cdmCorpus.FetchObjectAsync<CdmEntityDefinition>("A.cdm.json/A");
            CdmEntityDefinition bEnt = await cdmCorpus.FetchObjectAsync<CdmEntityDefinition>("B.cdm.json/B");
            CdmEntityDefinition cEnt = await cdmCorpus.FetchObjectAsync<CdmEntityDefinition>("C.cdm.json/C");
            CdmEntityDefinition dEnt = await cdmCorpus.FetchObjectAsync<CdmEntityDefinition>("D.cdm.json/D");

            // when resolving A, B should be cached and it should exclude any attributes from D because
            // it is outside of the maxDepth
            CdmEntityDefinition resA = await aEnt.CreateResolvedEntityAsync("resA", new ResolveOptions(
                aEnt.InDocument,
                new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "structured" })
            ));
            // ensure that when resolving B on its own, attributes from D are included
            CdmEntityDefinition resB = await bEnt.CreateResolvedEntityAsync("resB", new ResolveOptions(
                bEnt.InDocument,
                new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "structured" })
            ));

            // check the attributes found in D from resolving A
            CdmAttributeGroupDefinition bAttInA = ((CdmAttributeGroupDefinition)((CdmAttributeGroupReference)resA.Attributes[1]).ExplicitReference);
            CdmAttributeGroupDefinition cAttInA = ((CdmAttributeGroupDefinition)((CdmAttributeGroupReference)(bAttInA.Members[1])).ExplicitReference);
            CdmAttributeGroupDefinition dAttInA = ((CdmAttributeGroupDefinition)((CdmAttributeGroupReference)(cAttInA.Members[1])).ExplicitReference);
            Assert.AreEqual(1, dAttInA.Members.Count);
            // check that the attribute in D is a foreign key attribute
            CdmTypeAttributeDefinition dIdAttFromA = (CdmTypeAttributeDefinition)(dAttInA.Members[0]);
            Assert.AreEqual("dId", dIdAttFromA.Name);
            Assert.IsNotNull(dIdAttFromA.AppliedTraits.Item("is.linkedEntity.identifier"));

            // check the attributes found in D from resolving B
            CdmAttributeGroupDefinition cAttInB = ((CdmAttributeGroupDefinition)((CdmAttributeGroupReference)resB.Attributes[1]).ExplicitReference);
            CdmAttributeGroupDefinition dAttInB = ((CdmAttributeGroupDefinition)((CdmAttributeGroupReference)(cAttInB.Members[1])).ExplicitReference);
            Assert.AreEqual(dAttInB.Members.Count, 2);
            // check that the attribute in D is not a foreign key attribute
            CdmTypeAttributeDefinition dIdAttFromB = (CdmTypeAttributeDefinition)(dAttInB.Members[0]);
            Assert.AreEqual("dId", dIdAttFromB.Name);
            Assert.IsNull(dIdAttFromB.AppliedTraits.Item("is.linkedEntity.identifier"));
        }
    }
}
