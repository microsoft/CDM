# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional


class InputValues:
    """A structure to carry all the input values during evaluation/resolution of an expression tree"""

    def __init__(self):
        self.next_depth = None  # type: Optional[int]
        self.max_depth = None  # type: Optional[int]
        self.no_max_depth = None  # type: Optional[bool]
        self.is_array = None  # type: Optional[bool]

        self.min_cardinality = None  # type: Optional[int]
        self.max_cardinality = None  # type: Optional[int]

        self.reference_only = False  # type: bool
        self.normalized = False  # type: bool
        self.structured = False  # type: bool
        self.is_virtual = False  # type: bool
