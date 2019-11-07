# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from cdm.utilities import JObject


class SchemaEntityInfo(JObject):
    """
    Entity information stored in a schema.
    """

    def __init__(self):
        super().__init__()

        self.entityName = ''  # type: str
        self.entityVersion = ''  # type: str
        self.entityNamespace = ''  # type: str
