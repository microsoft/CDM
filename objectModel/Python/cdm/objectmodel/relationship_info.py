# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from cdm.resolvedmodel import ResolvedTraitSet


class RelationshipInfo:
    def __init__(self, is_by_ref, is_array, selects_one):
        self.is_by_ref = is_by_ref  # type: bool
        self.is_array = is_array  # type: bool
        self.selects_one = selects_one  # type: bool
