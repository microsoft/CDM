# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from collections import OrderedDict
from typing import List

from cdm.objectmodel import CdmCorpusContext
from cdm.resolvedmodel.projections.projection_attribute_state import ProjectionAttributeState
from cdm.utilities.logging import logger
from cdm.enums import CdmLogCode


class ProjectionAttributeStateSet:
    """
    A collection of ProjectionAttributeState objects
    """

    def __init__(self, ctx: 'CdmCorpusContext'):
        # --- internal ---
        self._TAG = ProjectionAttributeStateSet.__name__

        # A list containing all the ProjectionAttributeStates
        self._states = []  # type: List[ProjectionAttributeState]
        self._ctx = ctx  # type: CdmCorpusContext

    def _add(self, pas: 'ProjectionAttributeState') -> None:
        """Add to the collection"""
        if not pas or not pas._current_resolved_attribute or not pas._current_resolved_attribute.resolved_name:
            logger.error(self._ctx, ProjectionAttributeStateSet._add.__name__, self._TAG, None, CdmLogCode.ERR_PROJ_INVALID_ATTR_STATE)
        else:
            self._states.append(pas)

    def _copy(self):
        """Creates a copy of this projection attribute state set"""
        copy = ProjectionAttributeStateSet(self._ctx)
        copy._states.extend(self._states)

        return copy

    def _contains(self, pas: 'ProjectionAttributeState') -> bool:
        """Check if exists in collection"""
        return pas in self._states
