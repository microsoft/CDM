# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional


class DepthInfo:
    # The max depth set if the user specified to not use max depth
    MAX_DEPTH_LIMIT = 32

    def __init__(self):
        self._reset()

    def _reset(self):
        """Resets the instance to its initial values."""

        # The maximum depth that we can resolve entity attributes.
        # This value is set in resolution guidance.
        self.current_depth = 0  # type: int

        # The current depth that we are resolving at. Each entity attribute that we resolve
        # into adds 1 to depth.
        self.max_depth = None  # type: Optional[int]

        # Indicates if the max_depth value has been hit when resolving
        self.max_depth_exceeded = False  # type: int

    def _copy(self):
        """Creates a copy of this depth info instance."""

        copy = DepthInfo()
        copy.current_depth = self.current_depth
        copy.max_depth = self.max_depth
        copy.max_depth_exceeded = self.max_depth_exceeded

        return copy

    def _update_to_next_level(self, res_opt: 'ResolveOptions', is_polymorphic: Optional[bool], arc: Optional['AttributeResolutionContext'] = None) -> None:
        directives = res_opt.directives  # type: AttributeResolutionDirectiveSet
        is_by_ref = False

        self.max_depth = res_opt.max_depth

        # if using resolution guidance, read its properties first
        if arc:
            if arc.res_opt:
                directives = arc.res_opt.directives

                if is_polymorphic is None and directives:
                    is_polymorphic = directives.has('selectOne')

            if arc.res_guide and arc.res_guide.entity_by_reference:
                if arc.res_guide.entity_by_reference.reference_only_after_depth:
                    self.max_depth = arc.res_guide.entity_by_reference.reference_only_after_depth

                if arc.res_guide.entity_by_reference.allow_reference and directives:
                    is_by_ref = directives.has('referenceOnly')

        if directives is not None:
            if directives.has('noMaxDepth'):
                # no max? really? what if we loop forever? if you need more than 32 nested entities, then you should buy a different metadata description system
                self.max_depth = DepthInfo.MAX_DEPTH_LIMIT

        # if this is a polymorphic, then skip counting this entity in the depth, else count it
        # if it's already by reference, we won't go one more level down so don't increase current depth
        if not is_polymorphic and not is_by_ref:
            self.current_depth += 1

            if self.current_depth > self.max_depth:
                self.max_depth_exceeded = True