# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from .attribute_reference import AttributeReference
from .relationship import Relationship


class SingleKeyRelationship(Relationship):
    """
    A relationship of with a single key to a field.
    """

    def __init__(self):
        super().__init__()

        self.fromAttribute = None  # type: AttributeReference
        self.toAttribute = None  # type: AttributeReference
