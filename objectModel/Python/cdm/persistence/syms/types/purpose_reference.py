﻿# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional

from .purpose import *
from .trait_reference import TraitReference
from .trait_group_reference import TraitGroupReference
from cdm.utilities import JObject


class PurposeReference(JObject):
    def __init__(self):
        super().__init__()

        self.purposeReference = None  # type: Optional[Union[str, Purpose]]
        self.appliedTraits = None  # type: Optional[List[Union[str, TraitReference, TraitGroupReference]]]
        self.optional = None  # type: Optional[bool]
