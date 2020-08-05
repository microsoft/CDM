# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List, Tuple, Union

from cdm.resolvedmodel.expression_parser.predefined_token_enum import PredefinedTokenEnum
from cdm.resolvedmodel.expression_parser.predefined_tokens import PredefinedTokens
from cdm.resolvedmodel.expression_parser.predefined_type import PredefinedType


class Tokenizer:
    """Class that helps tokenize and identify tokens, operators, and parenthesis"""

    _text_to_type_hash = PredefinedTokens._initialize_text_to_type_hash()

    @staticmethod
    def _get_expression_as_token_list(expression: str) -> List[Tuple[Union[str, bool, int], 'PredefinedType']]:
        """Tokenize the expression into an array of token, operators and parenthesis"""

        # to split an expression as separate tokens may require proper spacing that the user may or may not have provide.
        # e.g. "(((true==true)))" can not be split into { '(', '(', '(', 'true', '==', 'true', ')', ')', ')' },
        # unless it is first appropriately spaced to generate "( ( ( true == true ) ) )"
        # the next 2 for loops do just that.
        for token in PredefinedTokens._supported_predefined_tokens_list:
            expression = expression.replace(token[1], ' {} '.format(token[1]))

        # but this could have resulted in "!=" getting split up as "! =", so fix that
        if ' ! = ' in expression:
            expression = expression.replace(' ! = ', ' != ')

        # but this could have resulted in ">=" getting split up as "> =", so fix that
        if ' > = ' in expression:
            expression = expression.replace(' > = ', ' >= ')

        # but this could have resulted in "<=" getting split up as "< =", so fix that
        if ' < = ' in expression:
            expression = expression.replace(' < = ', ' <= ')

        # now, split this into separate tokens and return as list
        # here are some samples:
        #     "" results in ==>
        #         {  }
        #     "  " results in ==>
        #         {  }
        #     "always" results in ==>
        #         { "always" }
        #     "!structured" results in ==>
        #         { "!", "structured" }
        #     "referenceOnly || (depth > 5)" results in ==>
        #         { "referenceOnly", "||", "(", "depth", ">", "5", ")" }
        #     "!normalized || (cardinality.maximum <= 1)" results in ==>
        #         { "!", "normalized", "||", "(", "cardinality.maximum", "<", "=", "1", ")" }
        #     "!(referenceOnly)" results in ==>
        #         { "!", "(", "referenceOnly", ")" }
        #     "!(normalized && cardinality.maximum > 1)" results in ==>
        #         { "!", "(", "normalized", "&&", "cardinality.maximum", ">", "1", ")" }
        #     "!(normalized && cardinality.maximum > 1) && !(structured)" results in ==>
        #         { "!", "(", "normalized", "&&", "cardinality.maximum", ">", "1", ")", "&&", "!", "(", "structured", ")" }
        #     "!(unknownToken != 1 && cardinality.maximum >                                       1) && !anotherUnknownToken" results in ==>
        #         { "!", "(", "unknownToken", "!=", "1", "&&", "cardinality.maximum", ">", "1", ")", "&&", "!", "anotherUnknownToken" }
        #     "true" results in ==>
        #         { "true" }
        #     "(((true==true)))" results in ==>
        #         { "(", "(", "(", "true", "==", "true", ")", ")", ")" }

        list = []

        for token in filter(None, expression.split(' ')):
            if token not in Tokenizer._text_to_type_hash:
                list.append([token, PredefinedType.CUSTOM])
            else:
                type = Tokenizer._text_to_type_hash[token]
                if type == PredefinedType.TOKEN:
                    list.append((token, PredefinedType.TOKEN))
                elif type == PredefinedType.CONSTANT:
                    list.append((token, PredefinedType.CONSTANT))
                elif type == PredefinedType.OPEN_PARENTHESIS:
                    list.append((token, PredefinedType.OPEN_PARENTHESIS))
                elif type == PredefinedType.CLOSE_PARENTHESIS:
                    list.append((token, PredefinedType.CLOSE_PARENTHESIS))
                elif type == PredefinedType.NOT_OPERATOR:
                    list.append((token, PredefinedType.NOT_OPERATOR))
                elif type == PredefinedType.OPERATOR:
                    list.append((token, PredefinedType.OPERATOR))
                else:
                    raise NotImplementedError('It should not have come to this!')

        return list
