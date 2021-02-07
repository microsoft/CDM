# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.resolvedmodel.expression_parser.expression_tree import ExpressionTree
from cdm.resolvedmodel.expression_parser.input_values import InputValues


class ExpressionTreeUnitTest(unittest.TestCase):
    """Unit test for ExpressionTree functions"""

    # The path between TestDataPath and TestName.
    tests_subpath = os.path.join('Cdm', 'Projection', 'TestExpressionTree')

    def test_entity_string_reference(self):
        """Test evaluate_expression function"""
        input = InputValues()
        input.max_cardinality = 1
        input.min_cardinality = 0
        input.max_depth = 32
        input.next_depth = 1
        input.no_max_depth = True
        input.is_array = True
        input.normalized = False
        input.reference_only = True
        input.structured = True

        expr_and_expected_result_list = []
        expr_and_expected_result_list.append(('(cardinality.maximum > 1) && (!referenceOnly)', 'False'))
        expr_and_expected_result_list.append(('', 'False'))
        expr_and_expected_result_list.append(('  ', 'False'))
        expr_and_expected_result_list.append(('always', 'True'))
        expr_and_expected_result_list.append(('!structured', 'False'))
        expr_and_expected_result_list.append(('referenceOnly || (depth > 5)', 'True'))
        expr_and_expected_result_list.append(('!(referenceOnly)', 'False'))
        expr_and_expected_result_list.append(('!(normalized && cardinality.maximum > 1)', 'True'))
        expr_and_expected_result_list.append(('true', 'True'))
        expr_and_expected_result_list.append(('(((true==true)))', 'True'))
        expr_and_expected_result_list.append(('!(normalized && isArray) || noMaxDepth', 'False'))

        for item in expr_and_expected_result_list:
            tree = ExpressionTree()
            tree_top = tree._construct_expression_tree(item[0])
            expected = item[1]
            actual = str(ExpressionTree._evaluate_expression_tree(tree_top, input))

            self.assertEqual(expected, actual)
