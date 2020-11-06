# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest
from tests.common import async_test, TestHelper
from cdm.utilities import AttributeResolutionDirectiveSet, ResolveOptions


class CircularResolution(unittest.TestCase):
    tests_subpath = os.path.join('Cdm', 'Resolution', 'CircularResolution')

    @async_test
    async def test_circular_reference(self):
        cdm_corpus = TestHelper.get_local_corpus(self.tests_subpath, 'TestCircularReference')
        customer = await cdm_corpus.fetch_object_async('local:/Customer.cdm.json/Customer')
        res_customer_structured = await customer.create_resolved_entity_async('resCustomer', ResolveOptions(customer.in_document, AttributeResolutionDirectiveSet({'normalized', 'structured', 'noMaxDepth'})))

        # check that the circular reference attribute has a single id attribute
        store_group_att = res_customer_structured.attributes[1].explicit_reference
        customer_group_att = store_group_att.members[1].explicit_reference
        self.assertEqual(len(customer_group_att.members), 1)
        self.assertEqual(customer_group_att.members[0].name, 'customerId')

    @async_test
    async def test_(self):
        cdm_corpus = TestHelper.get_local_corpus(self.tests_subpath, 'TestSelfReference')
        manifest = await cdm_corpus.fetch_object_async('local:/SelfReference.manifest.cdm.json')
        await cdm_corpus.calculate_entity_graph_async(manifest)
        await manifest.populate_manifest_relationships_async()

        self.assertEqual(len(manifest.relationships), 1)
        rel = manifest.relationships[0]
        self.assertEqual(rel.from_entity, 'CustTable.cdm.json/CustTable')
        self.assertEqual(rel.to_entity, 'CustTable.cdm.json/CustTable')
        self.assertEqual(rel.from_entity_attribute, 'FactoringAccountRelationship')
        self.assertEqual(rel.to_entity_attribute, 'PaymTermId')
