# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, List

from .data_type_reference import DataTypeReference
from .trait_reference import TraitReference
from cdm.utilities import JObject


class DataType(JObject):
    def __init__(self):
        super().__init__()

        self.explanation = None  # type: str
        self.dataTypeName = None  # type: str
        self.extendsDataType = None  # type: Union[str, DataTypeReference]
        self.exhibitsTraits = None  # type: List[Union[str, TraitReference]]
