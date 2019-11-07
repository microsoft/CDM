from typing import Union, List

from .purpose_reference import PurposeReference
from .data_type_reference import DataTypeReference
from .trait_reference import TraitReference
from .attribute_resolution_guidance import AttributeResolutionGuidance
from cdm.utilities import JObject


class TypeAttribute(JObject):
    def __init__(self):
        super().__init__()

        self.explanation = ''  # type: str
        self.name = ''  # type: str
        self.purpose = None  # type: Union[str, PurposeReference]
        self.dataType = None  # type: Union[str, DataTypeReference]
        self.appliedTraits = []  # type: List[Union[str, TraitReference]]
        self.attributeContext = ''  # type: str
        self.isPrimaryKey = False  # type: bool
        self.isReadOnly = False  # type: bool
        self.isNullable = False  # type: bool
        self.dataFormat = ''  # type: str
        self.sourceName = ''  # type: str
        self.sourceOrdering = 0  # type: int
        self.displayName = ''  # type: str
        self.description = ''  # type: str
        self.maximumValue = ''  # type: str
        self.minimumValue = ''  # type: str
        self.maximumLength = 0  # type: int
        self.valueConstrainedToList = False  # type: bool
        self.defaultValue = None  # type: object
        self.resolutionGuidance = None  # type: AttributeResolutionGuidance
