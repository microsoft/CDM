# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.utilities import JObject


class Import(JObject):
    def __init__(self):
        super().__init__()

        self.corpusPath = ''  # type: str
        self.moniker = ''  # type: str

        self.uri = ''  # type: str
        """DEPRECATED"""
