# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.utilities import JObject


class SchemaEntityInfo(JObject):
    """
    Entity information stored in a schema.
    """

    def __init__(self):
        super().__init__()

        self.entityName = None  # type: str
        self.entityVersion = None  # type: str
        self.entityNamespace = None  # type: str
