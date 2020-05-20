# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from .data_object import DataObject


class Attribute(DataObject):
    """
    Represents a field within an entity.
    """

    def __init__(self):
        super().__init__()

        self.dataType = None  # type: str
