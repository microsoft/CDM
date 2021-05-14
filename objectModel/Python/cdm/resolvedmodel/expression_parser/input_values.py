# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from cdm.resolvedmodel.projections.projection_directive import ProjectionDirective


class InputValues:
    """A structure to carry all the input values during evaluation/resolution of an expression tree"""

    def __init__(self, proj_directive: 'ProjectionDirective'):
        if not proj_directive:
            return

        self.no_max_depth = proj_directive._has_no_maximum_depth  # type: Optional[bool]
        self.is_array = proj_directive._is_array  # type: Optional[bool]

        self.reference_only = proj_directive._is_reference_only  # type: Optional[bool]
        self.normalized = proj_directive._is_normalized  # type: Optional[bool]
        self.structured = proj_directive._is_structured  # type: Optional[bool]
        self.is_virtual = proj_directive._is_virtual  # type: Optional[bool]

        self.next_depth = proj_directive._res_opt._depth_info.current_depth  # type: Optional[int]
        self.max_depth = proj_directive._maximum_depth  # type: Optional[int]
        
        self.min_cardinality = proj_directive._cardinality._minimum_number if proj_directive._cardinality else None  # type: Optional[int]
        self.max_cardinality = proj_directive._cardinality._maximum_number if proj_directive._cardinality else None  # type: Optional[int]
