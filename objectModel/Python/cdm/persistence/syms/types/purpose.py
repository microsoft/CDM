# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, List

from .purpose_reference import *
from .trait_reference import TraitReference
from .trait_group_reference import TraitGroupReference
from cdm.utilities import JObject


class Purpose(JObject):
    def __init__(self):
        super().__init__()

        self.explanation = None  # type: str
        self.purposeName = None  # type: str
        self.extendsPurpose = None  # type: Union[str, PurposeReference]
        self.exhibitsTraits = None  # type: List[Union[str, TraitReference, TraitGroupReference]]
