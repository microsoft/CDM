# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from typing import List
    from cdm.resolvedmodel.projections.projection_attribute_state import ProjectionAttributeState


class SearchResult:
    def __init__(self):
        self.found_flag = False  # type: bool
        self.found_depth = None  # type: int
        self.found = None  # type: ProjectionAttributeState
        self.top = []  # type: List[ProjectionAttributeState]
        self.leaf = []  # type: List[ProjectionAttributeState]
