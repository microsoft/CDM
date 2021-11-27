# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional

from .data_type import *


class DataTypeReference(JObject):
    def __init__(self):
        super().__init__()

        self.dataTypeReference = None  # type: Optional[Union[str, DataType]]
        self.appliedTraits = None  # type: Optional[List[Union[str, 'TraitReference', 'TraitGroupReference']]]
        self.optional = None  # type: Optional[bool]
