# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List, Dict

from cdm.resolvedmodel.expression_parser.predefined_token_enum import PredefinedTokenEnum
from cdm.resolvedmodel.expression_parser.predefined_type import PredefinedType


class PredefinedTokens:
    """Predefined tokens"""

    _supported_predefined_tokens_list = [
        (PredefinedTokenEnum.ALWAYS, 'always', PredefinedType.TOKEN),
        (PredefinedTokenEnum.AND, '&&', PredefinedType.OPERATOR),
        (PredefinedTokenEnum.OR, '||', PredefinedType.OPERATOR),
        (PredefinedTokenEnum.NOT, '!', PredefinedType.NOT_OPERATOR),
        (PredefinedTokenEnum.TRUE, 'true', PredefinedType.CONSTANT),
        (PredefinedTokenEnum.FALSE, 'false', PredefinedType.CONSTANT),
        (PredefinedTokenEnum.GT, '>', PredefinedType.OPERATOR),
        (PredefinedTokenEnum.LT, '<', PredefinedType.OPERATOR),
        (PredefinedTokenEnum.EQ, '==', PredefinedType.OPERATOR),
        (PredefinedTokenEnum.NE, '!=', PredefinedType.OPERATOR),
        (PredefinedTokenEnum.GE, '>=', PredefinedType.OPERATOR),
        (PredefinedTokenEnum.LE, '<=', PredefinedType.OPERATOR),
        (PredefinedTokenEnum.DEPTH, 'depth', PredefinedType.TOKEN),
        (PredefinedTokenEnum.MAXDEPTH, 'maxDepth', PredefinedType.TOKEN),
        (PredefinedTokenEnum.NOMAXDEPTH, 'noMaxDepth', PredefinedType.TOKEN),
        (PredefinedTokenEnum.ISARRAY, 'isArray', PredefinedType.TOKEN),
        (PredefinedTokenEnum.MINCARDINALITY, 'cardinality.minimum', PredefinedType.TOKEN),
        (PredefinedTokenEnum.MAXCARDINALITY, 'cardinality.maximum', PredefinedType.TOKEN),
        (PredefinedTokenEnum.REFERENCEONLY, 'referenceOnly', PredefinedType.TOKEN),
        (PredefinedTokenEnum.NORMALIZED, 'normalized', PredefinedType.TOKEN),
        (PredefinedTokenEnum.STRUCTURED, 'structured', PredefinedType.TOKEN),
        (PredefinedTokenEnum.OPENPAREN, '(', PredefinedType.OPEN_PARENTHESIS),
        (PredefinedTokenEnum.CLOSEPAREN, ')', PredefinedType.CLOSE_PARENTHESIS)
    ]

    @staticmethod
    def _initialize_text_to_type_hash() -> Dict[str, 'PredefinedType']:
        """Create a hash to find a string to type"""
        text_to_type_hash = {}

        for token in PredefinedTokens._supported_predefined_tokens_list:
            text_to_type_hash[token[1]] = token[2]

        return text_to_type_hash

    @staticmethod
    def _initialize_text_to_token_hash() -> Dict[str, 'PredefinedTokenEnum']:
        """Create a hash to find a string to token enum"""
        text_to_token_hash = {}

        for token in PredefinedTokens._supported_predefined_tokens_list:
            text_to_token_hash[token[1]] = token[0]

        return text_to_token_hash

    @staticmethod
    def _get_predefined_tokens() -> List[str]:
        """
        FOR UNIT TESTS ONLY
        Function to retrieve and cache the list of predefined tokens that are recognized as keywords and are supported directly
        """
        tokens = []

        found_tokens = list(filter(lambda token: token[2] == PredefinedType.TOKEN,
                                   PredefinedTokens._supported_predefined_tokens_list))

        for token in found_tokens:
            tokens.append(token[1])

        # Expected: { "always", "depth", "maxDepth", "cardinality.minimum", "cardinality.maximum", "referenceOnly", "normalized", "structured",  }
        return tokens

    @staticmethod
    def _get_supported_operators() -> List[str]:
        """
        FOR UNIT TESTS ONLY
        Function to retrieve and cache the list of supported operators
        """
        operators = []

        found_operators = list(filter(lambda token: token[2] == PredefinedType.OPERATOR,
                                      PredefinedTokens._supported_predefined_tokens_list))

        for op in found_operators:
            operators.append(op[1])

        # Expected: { "&&", "||", ">", "<", "==", "!=", ">=", "<=",  }
        # "!" is captured as PredefinedType.NotOperator and not included here
        return operators

    @staticmethod
    def _get_supported_parenthesis() -> List[str]:
        """
        FOR UNIT TESTS ONLY
        Function to retrieve and cache the supported open and close parenthesis
        """
        parenthesis = []

        found_parenthesis = list(filter(lambda token: token[2] == PredefinedType.OPEN_PARENTHESIS or token[2] == PredefinedType.CLOSE_PARENTHESIS,
                                        PredefinedTokens._supported_predefined_tokens_list))

        for paren in found_parenthesis:
            parenthesis.append(paren[1])

        # Expected: { "(", ")",  }
        return parenthesis

    @staticmethod
    def _get_predefined_constants() -> List[str]:
        """
        FOR UNIT TESTS ONLY
        Function to retrieve and cache the predefined constants
        """
        constants = []

        found_constants = list(filter(lambda token: token[2] == PredefinedType.CONSTANT,
                                      PredefinedTokens._supported_predefined_tokens_list))

        for constant in found_constants:
            constants.append(constant[1])

        # Expected: { "true", "false",  }
        return constants
