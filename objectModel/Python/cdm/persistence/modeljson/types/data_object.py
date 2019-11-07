# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from typing import Optional

from .metadata_object import MetadataObject


class DataObject(MetadataObject):
    """
    Defines a base class for a data object.
    """

    def __init__(self):
        super().__init__()

        self.isHidden = None  # type: Optional[bool]
