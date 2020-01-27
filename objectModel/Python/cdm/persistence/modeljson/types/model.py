# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

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
            "traits": "cdm:traits"
        })

        self.json_sort({"version": 1, "type": -2})

        self.application = ''  # type: str
        self.version = ''  # type: str
        self.entities = []  # <JToken> # type: list
        self.relationships = []  # type: List[SingleKeyRelationship]
        self.referenceModels = []  # type: List[ReferenceModel]
        self.culture = ''  # type: str
        self.modifiedTime = None  # type: datetime
        self.imports = []  # <JToken> # type: list
        self.lastFileStatusCheckTime = None  # type: datetime
        self.lastChildFileModifiedTime = None  # type: datetime
