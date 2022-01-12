﻿# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, List, Optional

from .trait import Trait
from .argument import Argument
from cdm.utilities import JObject


class TraitReference(JObject):
    def __init__(self):
        super().__init__()

        self.traitReference = None  # type: Optional[Union[str, Trait]]
        self.arguments = None  # type: Optional[List[Union[str, Argument]]]
        self.appliedTraits = None  # type: Optional[List[Union[str, Trait]]]
        self.optional = None  # type: Optional[bool]
