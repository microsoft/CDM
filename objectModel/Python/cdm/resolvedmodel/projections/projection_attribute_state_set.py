# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from collections import OrderedDict
from typing import List

from cdm.objectmodel import CdmCorpusContext
from cdm.resolvedmodel.projections.projection_attribute_state import ProjectionAttributeState
from cdm.utilities.logging import logger


class ProjectionAttributeStateSet:
    """
    A collection of ProjectionAttributeState with a hash for a easy search
    and links to collection of previous projection states
    """

    def __init__(self, ctx: 'CdmCorpusContext'):
        # A set with the resolved attribute name as a the key and the projection attribute state as value
        self._set = OrderedDict()

        # --- internal ---

        self._ctx = ctx  # type: CdmCorpusContext
        self._TAG = ProjectionAttributeStateSet.__name__

    def _add(self, pas: 'ProjectionAttributeState') -> None:
        """Add to the collection"""
        if not pas or not pas._current_resolved_attribute or not pas._current_resolved_attribute.resolved_name:
            logger.error(self._TAG, self._ctx, 'Invalid ProjectionAttributeState provided for addition to the Set. Add operation failed.', ProjectionAttributeStateSet._add.__name__)
        else:
            self._set[pas._current_resolved_attribute.resolved_name] = pas

    def _remove(self, resolved_attribute_name: str) -> bool:
        """Remove from collection if key is found"""
        if resolved_attribute_name in self._set:
            del self._set[resolved_attribute_name]
            return True
        else:
            logger.warning(self._TAG, self._ctx, 'Invalid ProjectionAttributeState provided for removal from the Set. Remove operation failed.', ProjectionAttributeStateSet._remove.__name__)
            return False

    def _remove(self, pas: 'ProjectionAttributeState') -> bool:
        """Remove from collection if key is found"""
        if pas._current_resolved_attribute.resolved_name in self._set and self._set[pas._current_resolved_attribute.resolved_name] == pas:
            return self._remove(pas._current_resolved_attribute.resolved_name)
        else:
            logger.warning(self._TAG, self._ctx, 'Invalid ProjectionAttributeState provided for removal from the Set. Remove operation failed.', ProjectionAttributeStateSet._remove.__name__)
            return False

    def _contains(self, resolved_attribute_name: str) -> bool:
        """Check if exists in collection"""
        return resolved_attribute_name in self._set

    def _get_value(self, resolved_attribute_name: str) ->  'ProjectionAttributeState':
        """Find in collection"""
        if resolved_attribute_name in self._set:
            return self._set[resolved_attribute_name]
        else:
            return None

    @property
    def _values(self) -> List['ProjectionAttributeState']:
        """Get a list of values"""
        return list(self._set.values())
