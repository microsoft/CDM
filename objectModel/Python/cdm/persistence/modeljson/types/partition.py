# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from typing import Optional, TYPE_CHECKING

from .data_object import DataObject
from .csv_format_settings import CsvFormatSettings

if TYPE_CHECKING:
    import datetime


class Partition(DataObject):
    """
    Represents the name and location of the actual data 
    files corresponding to the entity definition.
    """

    def __init__(self):
        super().__init__()

        self.refreshTime = None  # type: datetime
        self.location = ''  # type: str
        self.fileFormatSettings = None  # type: Optional[CsvFormatSettings]
        self.lastFileStatusCheckTime = None  # type: datetime
        self.lastFileModifiedTime = None  # type: datetime
