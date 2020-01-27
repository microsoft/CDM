# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from typing import Set, Optional


class AttributeResolutionDirectiveSet:
    def __init__(self, directives: Set[str] = None) -> None:
        self.added_set = directives.copy() if directives is not None else set()  # type: Set[str]
        self.removed_set = set()  # type: Set[str]
        self._sorted_tag = None  # type: Optional[str]

    def copy(self) -> 'AttributeResolutionDirectiveSet':
        result = AttributeResolutionDirectiveSet()
        if self.added_set is not None:
            result.added_set = self.added_set.copy()
        if self.removed_set is not None:
            result.removed_set = self.removed_set.copy()
        result._sorted_tag = self._sorted_tag
        return result

    def has(self, directive: str) -> bool:
        return self.added_set is not None and directive in self.added_set

    def add(self, directive: str) -> None:
        # Once explicitly removed from a set, never put it back.
        if directive in self.removed_set:
            return

        if self.added_set is None:
            self.added_set = set()

        self.added_set.add(directive)
        self._sorted_tag = None

    def delete(self, directive: str) -> None:
        if self.removed_set is None:
            self.removed_set = {}

        self.removed_set.add(directive)
        if self.added_set is not None and directive in self.added_set:
            self.added_set.remove(directive)
        self._sorted_tag = None

    def merge(self, directives: 'AttributeResolutionDirectiveSet') -> None:
        if directives is None:
            return

        # Copy over the removed list first.
        if directives.removed_set is not None:
            for d in directives.removed_set:
                self.delete(d)

        if directives.added_set is not None:
            for d in directives.added_set:
                self.add(d)

        self._sorted_tag = None

    def get_tag(self) -> str:
        if not self._sorted_tag:
            if self.added_set is not None:
                self._sorted_tag = ''.join(['-' + d for d in sorted(self.added_set)])
        return self._sorted_tag
