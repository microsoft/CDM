# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.utilities import JObject

class NameValuePair(JObject):
    """
    Name value pair class
    """

    def __init__(self):
        super().__init__()

        self.name = None  # type: str
        self.value = None  # type: str
