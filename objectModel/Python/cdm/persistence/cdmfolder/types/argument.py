# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union

from cdm.utilities import JObject


class Argument(JObject):
    def __init__(self):
        super().__init__()
        self.explanation = ''  # type: str
        self.name = ''  # type: str
        self.value = None  # type: Union[str, CdmObject]
