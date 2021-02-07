# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.utilities import JObject


class AttributeReference(JObject):
    def __init__(self):
        super().__init__()

        self.entityName = None  # type: str
        self.attributeName = None  # type: str
