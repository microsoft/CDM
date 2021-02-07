# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, List, Optional

from cdm.utilities import JObject

from .entity_reference import EntityReference
from .purpose_reference import PurposeReference
from .trait_reference import TraitReference
from .attribute_resolution_guidance import AttributeResolutionGuidance
from .projections.projection import Projection


class EntityAttribute(JObject):
    def __init__(self):
        super().__init__()

        self.name = None  # type: str
        self.explanation = None  # type: str
        self.description = None  # type: str
        self.displayName = None  # type: str
        self.purpose = None  # type: Union[str, PurposeReference]
        self.isPolymorphicSource = None  # type: Optional[bool]
        self.entity = None  # type: Union[str, EntityReference, Projection]
        self.appliedTraits = None  # type: List[Union[str, TraitReference]]
        self.resolutionGuidance = None  # type: AttributeResolutionGuidance
