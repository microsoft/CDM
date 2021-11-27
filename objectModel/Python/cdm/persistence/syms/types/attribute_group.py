# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List, Union, Optional

from cdm.utilities import JObject
from .trait_reference import TraitReference
from .trait_group_reference import TraitGroupReference

class AttributeGroup(JObject):
    def __init__(self):
        super().__init__()

        self.explanation = None  # type: Optional[str]
        self.attributeGroupName = None  # type: Optional[str]
        self.attributeContext = None  # type: Union[str, IdentifierRef]
        self.members = None  # type: Optional[List[Union[str, AttributeGroupReference, TypeAttribute, EntityAttribute]]]
        self.exhibitsTraits = None  # type: Optional[List[Union[str, TraitReference, TraitGroupReference]]]
