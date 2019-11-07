# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from .data_object import DataObject


class Attribute(DataObject):
    """
    Represents a field within an entity.
    """

    def __init__(self):
        super().__init__()

        self.dataType = ''  # type: str
