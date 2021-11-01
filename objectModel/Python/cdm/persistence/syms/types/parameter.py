# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union

from .data_type_reference import DataTypeReference
from cdm.utilities import JObject


class Parameter(JObject):
    def __init__(self):
        super().__init__()

        self.explanation = None  # type: str
        self.name = None  # type: str
        self.defaultValue = None  # type: CdmJsonType
        self.required = False  # type: bool
        self.dataType = None  # type: Union[str, DataTypeReference]
