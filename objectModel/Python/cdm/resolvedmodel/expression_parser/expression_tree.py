# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union

from cdm.resolvedmodel.expression_parser.node import Node
from cdm.resolvedmodel.expression_parser.predefined_token_enum import PredefinedTokenEnum
from cdm.resolvedmodel.expression_parser.predefined_tokens import PredefinedTokens
from cdm.resolvedmodel.expression_parser.predefined_type import PredefinedType
from cdm.resolvedmodel.expression_parser.tokenizer import Tokenizer


class ExpressionTree:
    """Class to generate an expression tree so that expression can be evaluated or parsed at a later date"""

    _text_to_token_hash = PredefinedTokens._initialize_text_to_token_hash()

    def _create_new_node(self, value: Union[str, bool, int], type: 'PredefinedType') -> 'Node':
        """Create a new node of the expression tree"""
        new_node = Node()

        new_node._value = value
        new_node._value_type = type

        new_node._left = None
        new_node._right = None

        return new_node

    def _construct_expression_tree(self, expression: str) -> 'Node':
        """Given an expression string, create an expression tree"""
        if not expression or not expression.strip():
            # caller to log info "Optional expression missing. Implicit expression will automatically apply." if returned null
            return None

        op_stack = []
        value_stack = []

        # split into tokens
        token_list = Tokenizer._get_expression_as_token_list(expression)

        for token in token_list:
            new_node = self._create_new_node(token[0], token[1])

            if token[1] == PredefinedType.OPEN_PARENTHESIS:
                op_stack.append(new_node)
            elif token[1] == PredefinedType.CLOSE_PARENTHESIS:
                while len(op_stack) > 0 and op_stack[-1]._value_type != PredefinedType.OPEN_PARENTHESIS:
                    top_op_node = op_stack.pop()

                    val_node_right = None
                    val_node_left = None
                    if len(value_stack) > 0:
                        val_node_right = value_stack.pop()
                    if len(value_stack) > 0:
                        val_node_left = value_stack.pop() if top_op_node._value_type != PredefinedType.NOT_OPERATOR else None

                    top_op_node._right = val_node_right
                    top_op_node._left = val_node_left

                    value_stack.append(top_op_node)

                # finally found open parenthesis
                if len(op_stack) > 0 and len(value_stack) > 0:
                    # traverse left most node and add "("
                    curr_node = value_stack[-1]
                    while curr_node is not None and curr_node._left is not None:
                        curr_node = curr_node._left
                    if curr_node is not None:
                        curr_node._left = op_stack.pop()

                    # traverse right most node and add ")"
                    curr_node = value_stack[-1]
                    while curr_node is not None and curr_node._right is not None:
                        curr_node = curr_node._right
                    if curr_node is not None:
                        curr_node._right = new_node
            elif token[1] == PredefinedType.NOT_OPERATOR or token[1] == PredefinedType.OPERATOR:
                while len(op_stack) > 0 and self._operator_priority(op_stack[-1]._value) < self._operator_priority(token[0]):
                    top_op_node = op_stack.pop()

                    val_node_right = None
                    val_node_left = None
                    if len(value_stack) > 0:
                        val_node_right = value_stack.pop()
                    if len(value_stack) > 0:
                        val_node_left = value_stack.pop() if top_op_node._value_type != PredefinedType.NOT_OPERATOR else None

                    top_op_node._right = val_node_right
                    top_op_node._left = val_node_left

                    value_stack.append(top_op_node)
                op_stack.append(new_node)
            else:
                value_stack.append(new_node)

        while len(op_stack) > 0:
            top_op_node = op_stack.pop()

            val_node_right = None
            val_node_left = None
            if len(value_stack) > 0:
                val_node_right = value_stack.pop()
            if len(value_stack) > 0:
                val_node_left = value_stack.pop() if top_op_node._value_type != PredefinedType.NOT_OPERATOR else None

            top_op_node._right = val_node_right
            top_op_node._left = val_node_left

            value_stack.append(top_op_node)

        return value_stack.pop()

    def _operator_priority(self, op: str) -> int:
        """
        Order of operators
        Higher the priority - higher the precedence
        """
        if op not in ExpressionTree._text_to_token_hash:
            return 0
        else:
            token = ExpressionTree._text_to_token_hash[op]
            if token == PredefinedTokenEnum.OPENPAREN or token == PredefinedTokenEnum.CLOSEPAREN:
                return 4
            elif token == PredefinedTokenEnum.NOT:
                return 3
            elif token == PredefinedTokenEnum.AND or token == PredefinedTokenEnum.OR:
                return 2
            elif (token == PredefinedTokenEnum.GT or
                  token == PredefinedTokenEnum.LT or
                  token == PredefinedTokenEnum.EQ or
                  token == PredefinedTokenEnum.NE or
                  token == PredefinedTokenEnum.GE or
                  token == PredefinedTokenEnum.LE):
                return 1
            else:
                return 0

    @staticmethod
    def _evaluate_expression_tree(top: 'None', input: 'InputValues') -> Union[str, bool, int]:
        """Given an expression tree, evaluate the expression"""
        if top is not None:
            left_return = False
            right_return = False

            if top._left is not None:
                left_return = ExpressionTree._evaluate_expression_tree(top._left, input)

            if top._right is not None:
                right_return = ExpressionTree._evaluate_expression_tree(top._right, input)

            if top._value_type == PredefinedType.CUSTOM:
                # check if number and return number
                try:
                    num = int(top._value)
                    return num
                except ValueError:
                    pass

                # check if bool and return bool
                if top._value.strip().lower() == 'true':
                    return True
                elif top._value.strip().lower() == 'false':
                    return False

            if top._value not in ExpressionTree._text_to_token_hash:
                return top._value
            else:
                token = ExpressionTree._text_to_token_hash[top._value]
                if token == PredefinedTokenEnum.AND:
                    return False if left_return is None or right_return is None else left_return and right_return
                elif token == PredefinedTokenEnum.NOT:
                    return False if right_return is None else not right_return
                elif token == PredefinedTokenEnum.OR:
                    return False if left_return is None or right_return is None else left_return or right_return
                elif token == PredefinedTokenEnum.GT:
                    return False if left_return is None or right_return is None else left_return > right_return
                elif token == PredefinedTokenEnum.LT:
                    return False if left_return is None or right_return is None else left_return < right_return
                elif token == PredefinedTokenEnum.GE:
                    return False if left_return is None or right_return is None else left_return >= right_return
                elif token == PredefinedTokenEnum.LE:
                    return False if left_return is None or right_return is None else left_return <= right_return
                elif token == PredefinedTokenEnum.EQ:
                    return False if left_return is None or right_return is None else left_return == right_return
                elif token == PredefinedTokenEnum.NE:
                    return False if left_return is None or right_return is None else left_return != right_return
                elif token == PredefinedTokenEnum.TRUE:
                    return True
                elif token == PredefinedTokenEnum.FALSE:
                    return False
                elif token == PredefinedTokenEnum.OPENPAREN or token == PredefinedTokenEnum.CLOSEPAREN:
                    return True
                elif token == PredefinedTokenEnum.DEPTH:
                    return input.next_depth
                elif token == PredefinedTokenEnum.MAXDEPTH:
                    return input.max_depth
                elif token == PredefinedTokenEnum.ISARRAY:
                    return input.is_array
                elif token == PredefinedTokenEnum.NOMAXDEPTH:
                    return input.no_max_depth
                elif token == PredefinedTokenEnum.MINCARDINALITY:
                    return input.min_cardinality
                elif token == PredefinedTokenEnum.MAXCARDINALITY:
                    return input.max_cardinality
                elif token == PredefinedTokenEnum.NORMALIZED:
                    return input.normalized
                elif token == PredefinedTokenEnum.REFERENCEONLY:
                    return input.reference_only
                elif token == PredefinedTokenEnum.STRUCTURED:
                    return input.structured
                elif token == PredefinedTokenEnum.VIRTUAL:
                    return input.is_virtual
                elif token == PredefinedTokenEnum.ALWAYS:
                    return True
                else:
                    return top._value

        return False

    @staticmethod
    def _in_order_traversal(top: 'Node') -> None:
        """For unit test only"""
        if top is not None:
            if top._left is not None:
                ExpressionTree._in_order_traversal(top._left)

            print(' {} '.format(top._value))

            if top._right is not None:
                ExpressionTree._in_order_traversal(top._right)
