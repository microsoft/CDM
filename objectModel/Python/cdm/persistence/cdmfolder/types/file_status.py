# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.utilities import JObject


class FileStatus(JObject):
    def __init__(self):
        super().__init__()

        self.lastFileStatusCheckTime = None  # type: str
        """Last time the modified times were updated"""

        self.lastFileModifiedTime = None  # type: str
        """Last time this file was modified"""

        self.lastChildFileModifiedTime = None  # type: str
        """Last time the most recently modified child object was modified"""
