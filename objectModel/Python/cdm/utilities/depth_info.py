# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.


class DepthInfo:
    # The default depth that we travel before forcing a foreign key attribute
    DEFAULT_MAX_DEPTH = 2
    # The max depth set if the user specified to not use max depth
    MAX_DEPTH_LIMIT = 32

    def __init__(self, current_depth, max_depth, max_depth_exceeded):
        # The maximum depth that we can resolve entity attributes.
        # This value is set in resolution guidance.
        self.current_depth = current_depth  # type: int
        # The current depth that we are resolving at. Each entity attribute that we resolve
        # into adds 1 to depth.
        self.max_depth = max_depth  # type: int
        # Indicates if the maxDepth value has been hit when resolving
        self.max_depth_exceeded = max_depth_exceeded  # type: int
