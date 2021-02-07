# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, List

from .cdm_import import Import
from .trait import Trait
from .data_type import DataType
from .purpose import Purpose
from .attribute_group import AttributeGroup
from .entity import Entity
from .constant_entity import ConstantEntity
from cdm.utilities import JObject


class DocumentContent(JObject):
    def __init__(self):
        super().__init__()

        self.json_rename({"schema": "$schema"})

        self.schema = None  # type: str
        self.jsonSchemaSemanticVersion = None  # type: str
        self.imports = None  # type: List[Import]
        self.definitions = None  # type: Union[Trait, DataType, Purpose, AttributeGroup, Entity, ConstantEntity]
        self.documentVersion = None  # type: str

        self.schemaVersion = None  # type: str
        """DEPRECATED"""
