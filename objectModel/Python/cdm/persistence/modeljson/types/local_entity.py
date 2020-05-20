# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List

from cdm.persistence.cdmfolder.types import Import

from .attribute import Attribute
from .partition import Partition
from .entity import Entity


class LocalEntity(Entity):
    """
    Represents an entity that belongs to the current model.
    """

    def __init__(self):
        super().__init__()

        self.attributes = None  # type: List[Attribute]
        self.partitions = None  # type: List[Partition]
        self.schemas = None  # type: List[str]
        self.imports = None  # type: List[Import]
