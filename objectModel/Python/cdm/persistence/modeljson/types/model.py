# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from datetime import datetime
from typing import List

from .data_object import DataObject
from .single_key_relationship import SingleKeyRelationship
from .reference_model import ReferenceModel
from .entity import Entity


class Model(DataObject):
    """
    Represents the data in the CDM folder, metadata and location, 
    as well as how it was generated and by which data producer.
    """

    def __init__(self):
        super().__init__()

        self.json_rename({
            "type": "$type",
            "imports": "cdm:imports",
            "lastFileStatusCheckTime": "cdm:lastFileStatusCheckTime",
            "lastChildFileModifiedTime": "cdm:lastChildFileModifiedTime",
            "lastFileModifiedTime": "cdm:lastFileModifiedTime",
            "documentVersion": "cdm:documentVersion",
            "traits": "cdm:traits"
        })

        self.json_sort({"version": 1, "type": -2})

        self.application = None  # type: str
        self.version = None  # type: str
        self.entities = None  # <JToken> # type: list
        self.relationships = None  # type: List[SingleKeyRelationship]
        self.referenceModels = None  # type: List[ReferenceModel]
        self.culture = None  # type: str
        self.modifiedTime = None  # type: datetime
        self.imports = None  # <JToken> # type: list
        self.lastFileStatusCheckTime = None  # type: datetime
        self.lastChildFileModifiedTime = None  # type: datetime
        self.documentVersion = None  # type: str
