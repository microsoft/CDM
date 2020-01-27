# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from .metadata_object import MetadataObject


class Relationship(MetadataObject):
    """
    Describes how entities are connected.
    """

    def __init__(self):
        super().__init__()

        self.type = ''  # type: str
