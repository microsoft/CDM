# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.objectmodel import CdmCorpusDefinition
from cdm.resolvedmodel import ResolvedAttribute
from cdm.resolvedmodel.projections.projection_attribute_state import ProjectionAttributeState
from cdm.resolvedmodel.projections.projection_context import ProjectionContext
from cdm.resolvedmodel.projections.projection_directive import ProjectionDirective
from cdm.resolvedmodel.projections.search_result import SearchResult
from cdm.resolvedmodel.projections.search_structure import SearchStructure
from cdm.utilities import ResolveOptions
from tests.common import TestHelper


class SearchStructureUnitTest(unittest.TestCase):
    """
    Unit test for SearchStructure functions

    E.g.: Given the following tree

        11  12  13 =====      14    15  17
        |   |   |       |     |     |   |
        |   |   |       |     |     |   |
        7   8   9 ==    10    16    7   8
        |   |   |   |   |     |     |   |
        |   |   |   |   |     |     |   |
        2   1   4   5   6     1     2   1
        |                           |
        |                           |
        1                           1

    Leaf Node Searches:
    - Search for 11's leaf nodes would be 1
    - Search for 10's leaf nodes would be 6
    - Search for 9's leaf nodes would be 4, 5
    - Search for 4's leaf nodes would be 4

    Top Node Searches:
    - Search for 1's top node would be 12 14 17
    - Search for 13's top node would be 13
    - Search for 5's top node would be 13
    - Search for 2's top node would be 11 15
    """

    # The path between TestDataPath and TestName.
    tests_subpath = os.path.join('Cdm', 'Projection', 'TestSearchStructure')

    # Unit test for building a tree
    def test_build_tree(self):
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_build_tree')

        pc = self._build_fake_tree(corpus)

        self.assertEqual('1 ==>> [ 12 14 17 .. 1 ..  1]', self._search_tree_traversal(pc, '1'))
        self.assertEqual('8 ==>> [ 12 17 .. 8 ..  1]', self._search_tree_traversal(pc, '8'))
        self.assertEqual('13 ==>> [ 13 .. 13 ..  4 5 6]', self._search_tree_traversal(pc, '13'))
        self.assertEqual('9 ==>> [ 13 .. 9 ..  4 5]', self._search_tree_traversal(pc, '9'))
        self.assertEqual('5 ==>> [ 13 .. 5 ..  5]', self._search_tree_traversal(pc, '5'))
        self.assertEqual('7 ==>> [ 11 15 .. 7 ..  1]', self._search_tree_traversal(pc, '7'))

    def _build_fake_tree(self, corpus: 'CdmCorpusDefinition') -> 'ProjectionContext':
        proj_dir = ProjectionDirective(ResolveOptions(), None)
        pc = ProjectionContext(proj_dir, None)

        p1 = ProjectionAttributeState(corpus.ctx)
        p1._current_resolved_attribute = ResolvedAttribute(proj_dir._res_opt, '1', '1', None)
        p2 = ProjectionAttributeState(corpus.ctx)
        p2._current_resolved_attribute = ResolvedAttribute(proj_dir._res_opt, '2', '2', None)
        p4 = ProjectionAttributeState(corpus.ctx)
        p4._current_resolved_attribute = ResolvedAttribute(proj_dir._res_opt, '4', '4', None)
        p5 = ProjectionAttributeState(corpus.ctx)
        p5._current_resolved_attribute = ResolvedAttribute(proj_dir._res_opt, '5', '5', None)
        p6 = ProjectionAttributeState(corpus.ctx)
        p6._current_resolved_attribute = ResolvedAttribute(proj_dir._res_opt, '6', '6', None)
        p7 = ProjectionAttributeState(corpus.ctx)
        p7._current_resolved_attribute = ResolvedAttribute(proj_dir._res_opt, '7', '7', None)
        p8 = ProjectionAttributeState(corpus.ctx)
        p8._current_resolved_attribute = ResolvedAttribute(proj_dir._res_opt, '8', '8', None)
        p9 = ProjectionAttributeState(corpus.ctx)
        p9._current_resolved_attribute = ResolvedAttribute(proj_dir._res_opt, '9', '9', None)
        p10 = ProjectionAttributeState(corpus.ctx)
        p10._current_resolved_attribute = ResolvedAttribute(proj_dir._res_opt, '10', '10', None)
        p11 = ProjectionAttributeState(corpus.ctx)
        p11._current_resolved_attribute = ResolvedAttribute(proj_dir._res_opt, '11', '11', None)
        p12 = ProjectionAttributeState(corpus.ctx)
        p12._current_resolved_attribute = ResolvedAttribute(proj_dir._res_opt, '12', '12', None)
        p13 = ProjectionAttributeState(corpus.ctx)
        p13._current_resolved_attribute = ResolvedAttribute(proj_dir._res_opt, '13', '13', None)
        p14 = ProjectionAttributeState(corpus.ctx)
        p14._current_resolved_attribute = ResolvedAttribute(proj_dir._res_opt, '14', '14', None)
        p15 = ProjectionAttributeState(corpus.ctx)
        p15._current_resolved_attribute = ResolvedAttribute(proj_dir._res_opt, '15', '15', None)
        p16 = ProjectionAttributeState(corpus.ctx)
        p16._current_resolved_attribute = ResolvedAttribute(proj_dir._res_opt, '16', '16', None)
        p17 = ProjectionAttributeState(corpus.ctx)
        p17._current_resolved_attribute = ResolvedAttribute(proj_dir._res_opt, '17', '17', None)

        p1._previous_state_list = []
        p2._previous_state_list = []
        p4._previous_state_list = []
        p5._previous_state_list = []
        p6._previous_state_list = []
        p7._previous_state_list = []
        p8._previous_state_list = []
        p9._previous_state_list = []
        p10._previous_state_list = []
        p11._previous_state_list = []
        p12._previous_state_list = []
        p13._previous_state_list = []
        p14._previous_state_list = []
        p15._previous_state_list = []
        p16._previous_state_list = []
        p17._previous_state_list = []

        p11._previous_state_list.append(p7)
        p7._previous_state_list.append(p2)
        p2._previous_state_list.append(p1)
        p12._previous_state_list.append(p8)
        p8._previous_state_list.append(p1)
        p13._previous_state_list.append(p9)
        p9._previous_state_list.append(p4)
        p9._previous_state_list.append(p5)
        p13._previous_state_list.append(p10)
        p10._previous_state_list.append(p6)
        p14._previous_state_list.append(p16)
        p16._previous_state_list.append(p1)
        p15._previous_state_list.append(p7)
        p17._previous_state_list.append(p8)

        pc._current_attribute_state_set._add(p11)
        pc._current_attribute_state_set._add(p12)
        pc._current_attribute_state_set._add(p13)
        pc._current_attribute_state_set._add(p14)
        pc._current_attribute_state_set._add(p15)
        pc._current_attribute_state_set._add(p17)

        return pc

    def _search_tree_traversal(self, pc: 'ProjectionContext', val: str) -> str:
        result = SearchResult()
        for top in pc._current_attribute_state_set._states:
            st = SearchStructure()
            st = SearchStructure._build_structure(top, top, val, st, False, 0)
            if st:
                if st._result.found_flag == True:
                    if result.found_flag == False:
                        result = st._result
                    elif result.found_depth > st._result.found_depth:
                        result = st._result
                    elif result.found_depth == st._result.found_depth:
                        for new_tops in st._result.top:
                            result.top.append(new_tops)

        return self._get_result(val, result) if result.found_flag else ''

    def _get_result(self, val: str, result: 'SearchResult') -> str:
        found_or_leaf = ''
        if len(result.leaf) > 0:
            for leaf in result.leaf:
                found_or_leaf = found_or_leaf + ' {}'.format(leaf._current_resolved_attribute.resolved_name)
        else:
            found_or_leaf = 'N/A'

        found_or_top = ''
        if len(result.top) > 0:
            for top in result.top:
                found_or_top = found_or_top + ' {}'.format(top._current_resolved_attribute.resolved_name)
        else:
            found_or_top = 'N/A'

        return '{} ==>> [{} .. {} .. {}]'.format(val, found_or_top, result.found._current_resolved_attribute.resolved_name, found_or_leaf)
