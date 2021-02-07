# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from .metadata_object import MetadataObject


class Relationship(MetadataObject):
    """
    Describes how entities are connected.
    """

    def __init__(self):
        super().__init__()

        self.type = None  # type: str
