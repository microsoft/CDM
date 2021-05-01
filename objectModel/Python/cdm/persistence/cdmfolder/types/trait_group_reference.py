# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, List, Optional

from .trait_group import TraitGroup
from .trait_reference import TraitReference
from cdm.utilities import JObject


class TraitGroupReference(JObject):
    def __init__(self):
        super().__init__()

        self.traitGroupReference = None  # type: Optional[Union[str, TraitGroup]]
        self.appliedTraits = None  # type: Optional[List[Union[str, TraitReference, TraitGroupReference]]]
        self.optional = None  # type: Optional[bool]
