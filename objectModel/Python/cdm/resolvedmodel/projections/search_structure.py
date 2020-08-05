# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

from cdm.utilities.string_utils import StringUtils

if TYPE_CHECKING:
    from typing import List
    from cdm.resolvedmodel.projections.projection_attribute_state import ProjectionAttributeState

from cdm.resolvedmodel.projections.search_result import SearchResult


class SearchStructure:
    def __init__(self):
        """
        Structure to help search the ProjectionAttributeState previous state tree for leaf node and top node for a given attribute name
        E.g.: Given the following tree

            11  12  13 =====      14    15  17
            |   |   |       |     |     |   |
            |   |   |       |     |     |   |
            7   8   9 ==    10    16    7   8
            |   |   |   |   |     |     |   |
            |   |   |   |   |     |     |   |
            2   1   4   5   6     1     2   1
            |                           |
            |                           |
            1                           1

        Leaf Node Searches:
        - Search for 11's leaf nodes would be 1
        - Search for 10's leaf nodes would be 6
        - Search for 9's leaf nodes would be 4, 5
        - Search for 4's leaf nodes would be 4

        Top Node Searches:
        - Search for 1's top node would be 12 14 17
        - Search for 13's top node would be 13
        - Search for 5's top node would be 13
        - Search for 2's top node would be 11 15

        Smallest Depth Wins
        """

        # --- internal ---

        self._result = SearchResult()  # type: SearchResult
        self._structure = []  # type: List[ProjectionAttributeState]

    def dispose(self) -> None:
        self._structure = None
        self._result = None

    @property
    def _count(self) -> int:
        return -1 if self._structure is None else len(self._structure)

    def _add(self, pas: 'ProjectionAttributeState') -> None:
        if len(self._structure) == 0:
            self._result.top.append(pas)

        self._structure.append(pas)

    @staticmethod
    def _build_structure(
        curr: 'ProjectionAttributeState',
        top: 'ProjectionAttributeState',
        attr_name: str,
        st: 'SearchStructure',
        found_flag: bool,
        found_depth: int
    ) -> 'SearchStructure':
        """Build a structure using a stack"""
        if curr:
            st._add(curr)

            if StringUtils.equals_with_case(curr._current_resolved_attribute.resolved_name, attr_name):
                found_flag = True
                st._result.found_flag = True
                st._result.found_depth = found_depth
                st._result.found = curr

            if found_flag and (curr and (curr._previous_state_list is None or (curr._previous_state_list is not None and len(curr._previous_state_list) == 0))):
                st._result.leaf.append(curr)

            if curr._previous_state_list and len(curr._previous_state_list) > 0:
                for prev in curr._previous_state_list:
                    SearchStructure._build_structure(prev, top, attr_name, st, found_flag, found_depth + 1)

        return st
