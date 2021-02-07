# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from cdm.resolvedmodel import ResolvedTraitSet


class RelationshipInfo:
    def __init__(self, rts, is_by_ref, is_array, selects_one, next_depth, max_depth, max_depth_exceeded):
        self.is_by_ref = is_by_ref  # type: bool
        self.is_array = is_array  # type: bool
        self.selects_one = selects_one  # type: bool
        self.next_depth = next_depth  # type: int
        self.max_depth = max_depth  # type: int
        self.max_depth_exceeded = max_depth_exceeded  # type: bool

        # Internal

        self._rts = rts  # type: ResolvedTraitSet
