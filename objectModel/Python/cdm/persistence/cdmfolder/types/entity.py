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

        self.explanation = None  # type: str
        self.entityName = None  # type: str
        self.extendsEntity = None  # type: Union[str, EntityReference]
        self.ExtendsEntityResolutionGuidance = None  # type: Optional[AttributeResolutionGuidance]
        self.exhibitsTraits = None  # type: List[Union[str, TraitReference]]
        self.attributeContext = None  # type: AttributeContext
        self.hasAttributes = None  # type: List[Union[str, AttributeGroupReference, TypeAttribute, EntityAttribute]]
        self.sourceName = None  # type: str
        self.displayName = None  # type: str
        self.description = None  # type: str
        self.version = None  # type: str
        self.cdmSchemas = None  # type: List[str]
