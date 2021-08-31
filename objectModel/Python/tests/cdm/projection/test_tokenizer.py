# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.resolvedmodel.expression_parser.tokenizer import Tokenizer


class TokenizerUnitTest(unittest.TestCase):
    """Unit test for Tokenizer functions"""

    # The path between TestDataPath and TestName.
    tests_subpath = os.path.join('Cdm', 'Projection', 'TokenizerTest')

    def test_get_expression_as_token_list(self):
        expr_and_expected_list = []
        expr_and_expected_list.append(('(cardinality.maximum > 1) && (!referenceOnly)', '( cardinality.maximum > 1 ) && ( ! referenceOnly )'))
        expr_and_expected_list.append(('', ''))
        expr_and_expected_list.append(('  ', ''))
        expr_and_expected_list.append(('always', 'always'))
        expr_and_expected_list.append(('!structured', '! structured'))
        expr_and_expected_list.append(('referenceOnly || (depth > 5)', 'referenceOnly || ( depth > 5 )'))
        expr_and_expected_list.append(('!(referenceOnly)', '! ( referenceOnly )'))
        expr_and_expected_list.append(('!(normalized && cardinality.maximum > 1)', '! ( normalized && cardinality.maximum > 1 )'))
        expr_and_expected_list.append(('true', 'true'))
        expr_and_expected_list.append(('(((true==true)))', '( ( ( true == true ) ) )'))
        expr_and_expected_list.append(('!normalized || (cardinality.maximum <= 1)', '! normalized || ( cardinality.maximum <= 1 )'))
        expr_and_expected_list.append(('!(normalized && cardinality.maximum > 1) && !(structured)', '! ( normalized && cardinality.maximum > 1 ) && ! ( structured )'))
        expr_and_expected_list.append(('!(unknownToken != 1 && cardinality.maximum >                                       1) && !anotherUnknownToken', '! ( unknownToken != 1 && cardinality.maximum > 1 ) && ! anotherUnknownToken'))
        expr_and_expected_list.append(('!(normalized && isArray) || noMaxDepth', '! ( normalized && isArray ) || noMaxDepth'))

        for item in expr_and_expected_list:
            expected = item[1]
            exp_tuple_list = Tokenizer._get_expression_as_token_list(item[0])
            exp_list = []
            for t in exp_tuple_list:
                exp_list.append(str(t[0]))
            actual = ' '.join(exp_list)
            self.assertEqual(expected, actual)
