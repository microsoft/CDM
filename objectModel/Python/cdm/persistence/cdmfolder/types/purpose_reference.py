# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, List

from .purpose import *
from .trait_reference import TraitReference
from cdm.utilities import JObject


class PurposeReference(JObject):
    def __init__(self):
        super().__init__()

        self.purposeReference = None  # type: Union[str, Purpose]
        self.appliedTraits = []  # type: List[Union[str, TraitReference]]
