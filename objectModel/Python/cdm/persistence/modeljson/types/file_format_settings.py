# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from cdm.utilities import JObject


class FileFormatSettings(JObject):
    """
    Represents a base class for file format settings.
    """

    def __init__(self):
        super().__init__()

        self.type = ''  # type: str
