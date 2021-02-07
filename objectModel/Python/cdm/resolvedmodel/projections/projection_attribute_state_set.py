# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from collections import OrderedDict
from typing import List

from cdm.objectmodel import CdmCorpusContext
from cdm.resolvedmodel.projections.projection_attribute_state import ProjectionAttributeState
from cdm.utilities.logging import logger


class ProjectionAttributeStateSet:
    """
    A collection of ProjectionAttributeState objects
    """

    def __init__(self, ctx: 'CdmCorpusContext'):
        # --- internal ---

        # A list containing all the ProjectionAttributeStates
        self._states = []  # type: List[ProjectionAttributeState]
        self._ctx = ctx  # type: CdmCorpusContext
        self._TAG = ProjectionAttributeStateSet.__name__

    def _add(self, pas: 'ProjectionAttributeState') -> None:
        """Add to the collection"""
        if not pas or not pas._current_resolved_attribute or not pas._current_resolved_attribute.resolved_name:
            logger.error(self._TAG, self._ctx, 'Invalid ProjectionAttributeState provided for addition to the Set. Add operation failed.', ProjectionAttributeStateSet._add.__name__)
        else:
            self._states.append(pas)

    def _remove(self, pas: 'ProjectionAttributeState') -> bool:
        """Remove from collection"""
        if pas is not None and self._contains(pas):
            self._states.remove(pas)
            return True
        else:
            logger.warning(self._TAG, self._ctx, 'Invalid ProjectionAttributeState provided for removal from the Set. Remove operation failed.', ProjectionAttributeStateSet._remove.__name__)
            return False

    def _contains(self, pas: 'ProjectionAttributeState') -> bool:
        """Check if exists in collection"""
        return pas in self._states
