# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.utilities import JObject


class FileFormatSettings(JObject):
    """
    Represents a base class for file format settings.
    """

    def __init__(self):
        super().__init__()

        self.type = ''  # type: str
