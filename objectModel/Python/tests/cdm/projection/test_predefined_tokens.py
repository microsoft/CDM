# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.resolvedmodel.expression_parser.predefined_tokens import PredefinedTokens


class PredefinedTokensUnitTest(unittest.TestCase):
    """Unit test for PredefinedTokens functions"""

    # The path between TestDataPath and TestName.
    tests_subpath = os.path.join('Cdm', 'Projection', 'PredefinedTokensTest')

    def test_get_predefined_tokens(self):
        tokens = PredefinedTokens._get_predefined_tokens()
        expected = 'always depth maxDepth noMaxDepth isArray cardinality.minimum cardinality.maximum referenceOnly normalized structured virtual'
        actual = ' '.join(tokens)
        self.assertEqual(expected, actual)

    def test_predefined_constants(self):
        constants = PredefinedTokens._get_predefined_constants()
        expected = 'true false'
        actual = ' '.join(constants)
        self.assertEqual(expected, actual)

    def test_get_supported_operators(self):
        ops = PredefinedTokens._get_supported_operators()

        # all expect the '!' operator since that is tagged separately
        expected = '&& || > < == != >= <='
        actual = ' '.join(ops)
        self.assertEqual(expected, actual)

    def test_get_supported_parenthesis(self):
        ops = PredefinedTokens._get_supported_parenthesis()

        expected = '( )'
        actual = ' '.join(ops)
        self.assertEqual(expected, actual)
