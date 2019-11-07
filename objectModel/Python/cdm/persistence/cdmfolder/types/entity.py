from typing import Union, List

from .entity_reference import *
from .attribute_context import AttributeContext
from .attribute_group_reference import AttributeGroupReference
from .type_attribute import TypeAttribute
from .entity_attribute import *
from cdm.utilities import JObject


class Entity(JObject):
    def __init__(self):
        super().__init__()

        self.explanation = ''  # type: str
        self.entityName = ''  # type: str
        self.extendsEntity = None  # type: Union[str, EntityReference]
        self.exhibitsTraits = []  # type: List[Union[str, TraitReference]]
        self.attributeContext = None  # type: AttributeContext
        self.hasAttributes = []  # type: List[Union[str, AttributeGroupReference, TypeAttribute, EntityAttribute]]
        self.sourceName = ''  # type: str
        self.displayName = ''  # type: str
        self.description = ''  # type: str
        self.version = ''  # type: str
        self.cdmSchemas = []  # type: List[str]
