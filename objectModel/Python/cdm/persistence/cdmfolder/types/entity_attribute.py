from typing import Union, List

from cdm.utilities import JObject

from .entity_reference import EntityReference
from .purpose_reference import PurposeReference
from .trait_reference import TraitReference
from .attribute_resolution_guidance import AttributeResolutionGuidance


class EntityAttribute(JObject):
    def __init__(self):
        super().__init__()

        self.explanation = ''  # type: str
        self.purpose = None  # type: Union[str, PurposeReference]
        self.name = ''  # type: str
        self.entity = None  # type: Union[str, EntityReference]
        self.appliedTraits = None  # type: List[Union[str, TraitReference]]
        self.resolutionGuidance = None  # type: AttributeResolutionGuidance
