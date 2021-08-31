# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest
from tests.common import async_test, TestHelper
from cdm.utilities import AttributeResolutionDirectiveSet, ResolveOptions


class Cache(unittest.TestCase):
    tests_subpath = os.path.join('Cdm', 'Resolution', 'CacheTest')
    test_name_path = 'TestMaxDepth'

    @async_test
    async def test_max_depth_cached(self):
        cdm_corpus = TestHelper.get_local_corpus(self.tests_subpath, self.test_name_path)
        a_ent = await cdm_corpus .fetch_object_async('A.cdm.json/A')
        b_ent = await cdm_corpus .fetch_object_async('B.cdm.json/B')
        c_ent = await cdm_corpus .fetch_object_async('C.cdm.json/C')
        d_ent = await cdm_corpus .fetch_object_async('D.cdm.json/D')

        # when resolving A, B should be cached and it should exclude any attributes from D because
        # it is outside of the maxDepth
        res_a = await a_ent.create_resolved_entity_async('resA', ResolveOptions(a_ent.in_document, AttributeResolutionDirectiveSet({'normalized', 'structured'})))
        # ensure that when resolving B on its own, attributes from D are included
        res_b = await b_ent.create_resolved_entity_async('resB', ResolveOptions(b_ent.in_document, AttributeResolutionDirectiveSet({'normalized', 'structured'})))

        # check the attributes found in D from resolving A
        b_att_in_a = res_a.attributes[1].explicit_reference
        c_att_in_a = b_att_in_a.members[1].explicit_reference
        d_att_in_a = c_att_in_a.members[1].explicit_reference
        self.assertEqual(len(d_att_in_a.members), 1)
        # check that the attribute in D is a foreign key atttribute
        dId_att_from_a = d_att_in_a.members[0]
        self.assertEqual(dId_att_from_a.name, 'dId')
        self.assertIsNotNone(dId_att_from_a.applied_traits.item('is.linkedEntity.identifier'))

        # check the attributes found in D from resolving B
        c_att_in_b = res_b.attributes[1].explicit_reference
        d_att_in_b = c_att_in_b.members[1].explicit_reference
        self.assertEqual(len(d_att_in_b.members), 2)
        # check that the attribute in D is not a foreign key atttribute
        dId_att_from_b = d_att_in_b.members[0]
        self.assertEqual(dId_att_from_b.name, 'dId')
        self.assertIsNone(dId_att_from_b.applied_traits.item('is.linkedEntity.identifier'))

    @async_test
    async def test_non_max_depth_cached(self):
        cdm_corpus = TestHelper.get_local_corpus(self.tests_subpath, self.test_name_path)
        a_ent = await cdm_corpus.fetch_object_async('A.cdm.json/A')
        b_ent = await cdm_corpus.fetch_object_async('B.cdm.json/B')
        c_ent = await cdm_corpus.fetch_object_async('C.cdm.json/C')
        d_ent = await cdm_corpus.fetch_object_async('D.cdm.json/D')

        # when resolving B, it should include any attributes from D because
        # it is outside of the maxDepth
        res_b = await b_ent.create_resolved_entity_async('resB', ResolveOptions(b_ent.in_document, AttributeResolutionDirectiveSet({'normalized', 'structured'})))
        # ensure that when resolving A, attributes from D are excluded because they are beyond the max depth
        res_a = await a_ent.create_resolved_entity_async('resA', ResolveOptions(a_ent.in_document, AttributeResolutionDirectiveSet({'normalized', 'structured'})))

        # check the attributes found in D from resolving A
        b_att_in_a = res_a.attributes[1].explicit_reference
        c_att_in_a = b_att_in_a.members[1].explicit_reference
        d_att_in_a = c_att_in_a.members[1].explicit_reference
        self.assertEqual(len(d_att_in_a.members), 1)
        # check that the attribute in D is a foreign key atttribute
        dId_att_from_a = d_att_in_a.members[0]
        self.assertEqual(dId_att_from_a.name, 'dId')
        self.assertIsNotNone(dId_att_from_a.applied_traits.item('is.linkedEntity.identifier'))

        # check the attributes found in D from resolving B
        c_att_in_b = res_b.attributes[1].explicit_reference
        d_att_in_b = c_att_in_b.members[1].explicit_reference
        self.assertEqual(len(d_att_in_b.members), 2)
        # check that the attribute in D is not a foreign key atttribute
        dId_att_from_b = d_att_in_b.members[0]
        self.assertEqual(dId_att_from_b.name, 'dId')
        self.assertIsNone(dId_att_from_b.applied_traits.item('is.linkedEntity.identifier'))
