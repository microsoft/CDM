# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union

from cdm.resolvedmodel.expression_parser.predefined_type import PredefinedType


class Node:
    """A node in the expression tree"""

    def __init__(self):
        # --- internal ---

        # Value for the node
        # This can hold string tokens from an expression when building the tree,
        # but it can also hold a boolean value when evaluating the tree
        self._value = None  # type: Union[str, bool]

        # Type of the value
        self._value_type = None  # type: PredefinedType

        # Left node
        self._left = None  # type: Node

        # Right node
        self._right = None  # type: Node
