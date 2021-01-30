# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.


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

        # Indicates if the maxDepth value has been hit when resolving
        self.max_depth_exceeded = False  # type: int

    def _copy(self):
        """Creates a copy of this depth info instance."""

        copy = DepthInfo()
        copy.current_depth = self.current_depth
        copy.max_depth = self.max_depth
        copy.max_depth_exceeded = self.max_depth_exceeded

        return copy
