# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from datetime import datetime

from .data_object import DataObject


class Entity(DataObject):
    """
    Defines a base class for an entity. 
    An entity is a set of attributes and metadata that defines a concept
    like Account or Contact and can be defined by any data producer.
    """

    def __init__(self):
        super().__init__()

        self.type = None  # type: str
        self.lastChildFileModifiedTime = None  # type: datetime
        self.lastFileModifiedTime = None  # type: datetime
        self.lastFileStatusCheckTime = None  # type: datetime
