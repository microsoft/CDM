# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List, Optional, Union

from cdm.utilities import JObject

from .attribute_context import AttributeContext
from .attribute_resolution_guidance import AttributeResolutionGuidance
from .entity_reference import EntityReference
from .attribute_group_reference import AttributeGroupReference
from .type_attribute import TypeAttribute
from .entity_attribute import EntityAttribute


class Entity(JObject):
    def __init__(self):
        super().__init__()

        self.explanation = ''  # type: str
        self.entityName = ''  # type: str
        self.extendsEntity = None  # type: Union[str, EntityReference]
        self.ExtendsEntityResolutionGuidance = None  # type: Optional[AttributeResolutionGuidance]
        self.exhibitsTraits = []  # type: List[Union[str, TraitReference]]
        self.attributeContext = None  # type: AttributeContext
        self.hasAttributes = []  # type: List[Union[str, AttributeGroupReference, TypeAttribute, EntityAttribute]]
        self.sourceName = ''  # type: str
        self.displayName = ''  # type: str
        self.description = ''  # type: str
        self.version = ''  # type: str
        self.cdmSchemas = []  # type: List[str]
