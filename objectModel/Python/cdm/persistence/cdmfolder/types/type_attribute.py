# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, List

from .purpose_reference import PurposeReference
from .data_type_reference import DataTypeReference
from .trait_reference import TraitReference
from .attribute_resolution_guidance import AttributeResolutionGuidance
from cdm.utilities import JObject


class TypeAttribute(JObject):
    def __init__(self):
        super().__init__()

        self.explanation = None  # type: str
        self.name = None  # type: str
        self.purpose = None  # type: Union[str, PurposeReference]
        self.dataType = None  # type: Union[str, DataTypeReference]
        self.appliedTraits = None  # type: List[Union[str, TraitReference]]
        self.attributeContext = None  # type: str
        self.isPrimaryKey = None  # type: bool
        self.isReadOnly = None  # type: bool
        self.isNullable = None  # type: bool
        self.dataFormat = None  # type: str
        self.sourceName = None  # type: str
        self.sourceOrdering = None  # type: int
        self.displayName = None  # type: str
        self.description = None  # type: str
        self.maximumValue = None  # type: str
        self.minimumValue = None  # type: str
        self.maximumLength = None  # type: int
        self.valueConstrainedToList = None  # type: bool
        self.defaultValue = None  # type: object
        self.resolutionGuidance = None  # type: AttributeResolutionGuidance
