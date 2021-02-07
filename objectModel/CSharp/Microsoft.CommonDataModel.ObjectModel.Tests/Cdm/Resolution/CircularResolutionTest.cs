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
    public class CircularResolutionTest
    {
        /// <summary>
        /// The path between TestDataPath and TestName.
        /// </summary>
        private string testsSubpath = Path.Combine("Cdm", "Resolution", "CircularResolution");

        /// <summary>
        /// Test proper behavior for entities that contain circular references
        /// </summary>
        [TestMethod]
        public async Task TestCircularReference()
        {
            CdmCorpusDefinition cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, "TestCircularReference");
            CdmEntityDefinition customer = await cdmCorpus.FetchObjectAsync<CdmEntityDefinition>("local:/Customer.cdm.json/Customer");
            CdmEntityDefinition resCustomerStructured = await customer.CreateResolvedEntityAsync("resCustomer", new ResolveOptions(
                customer.InDocument,
                new AttributeResolutionDirectiveSet(new HashSet<string> { "normalized", "structured", "noMaxDepth" })
            ));

            // check that the circular reference attribute has a single id attribute
            CdmAttributeGroupDefinition storeGroupAtt =
                ((CdmAttributeGroupReference)resCustomerStructured.Attributes[1]).ExplicitReference as CdmAttributeGroupDefinition;
            CdmAttributeGroupDefinition customerGroupAtt =
                ((CdmAttributeGroupReference)storeGroupAtt.Members[1]).ExplicitReference as CdmAttributeGroupDefinition;
            Assert.AreEqual(1, customerGroupAtt.Members.Count);
            Assert.AreEqual("customerId", ((CdmTypeAttributeDefinition)customerGroupAtt.Members[0]).Name);
        }

        /// <summary>
        /// Test that relationship is created when an entity contains a reference to itself
        /// </summary>
        [TestMethod]
        public async Task TestSelfReference()
        {
            CdmCorpusDefinition cdmCorpus = TestHelper.GetLocalCorpus(testsSubpath, "TestSelfReference");
            CdmManifestDefinition manifest = await cdmCorpus.FetchObjectAsync<CdmManifestDefinition>("local:/SelfReference.manifest.cdm.json");
            await cdmCorpus.CalculateEntityGraphAsync(manifest);
            await manifest.PopulateManifestRelationshipsAsync();

            Assert.AreEqual(1, manifest.Relationships.Count);
            CdmE2ERelationship rel = manifest.Relationships[0];
            Assert.AreEqual("CustTable.cdm.json/CustTable", rel.FromEntity);
            Assert.AreEqual("CustTable.cdm.json/CustTable", rel.ToEntity);
            Assert.AreEqual("FactoringAccountRelationship", rel.FromEntityAttribute);
            Assert.AreEqual("PaymTermId", rel.ToEntityAttribute);
        }
    }
}
