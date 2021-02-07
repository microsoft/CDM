# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List, Optional

from cdm.objectmodel import CdmCorpusContext
from cdm.resolvedmodel import ResolvedAttribute


class ProjectionAttributeState:
    """
    This node maintains the attribute's state during projection and between stages of a operations
    and links to collection of previous projection states
    """

    def __init__(self, ctx: 'CdmCorpusContext'):
        # --- internal ---

        # Keep context for error logging
        self._ctx = ctx  # type: CdmCorpusContext

        # Current resolved attribute
        self._current_resolved_attribute = None  # type: ResolvedAttribute

        # Keep a list of original polymorphic source states
        self._previous_state_list = None  # type: List[ProjectionAttributeState]

        # The attribute ordinal originated from the array expansion operation
        self._ordinal = None  # type: Optional[int]

    def _copy(self) -> 'ProjectionAttributeState':
        """Creates a copy of the state and sets its previous state to be itself"""
        copy = ProjectionAttributeState(self._ctx)
        copy._current_resolved_attribute = self._current_resolved_attribute
        copy._previous_state_list = [self]
        copy._ordinal = self._ordinal
        return copy
