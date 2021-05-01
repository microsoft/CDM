# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, List, Optional

from cdm.utilities import JObject
from .trait_reference import TraitReference
from .trait_group_reference import TraitGroupReference


class EntityReference(JObject):
    def __init__(self):
        super().__init__()

        self.entityReference = None  # type: Optional[Union[str, Entity, ConstantEntity]]
        self.appliedTraits = None  # type: Optional[List[Union[str, TraitReference, TraitGroupReference]]]
        self.optional = None  # type: Optional[bool]
