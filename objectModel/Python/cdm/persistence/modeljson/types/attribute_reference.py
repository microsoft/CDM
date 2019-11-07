# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from cdm.utilities import JObject


class AttributeReference(JObject):
    def __init__(self):
        super().__init__()

        self.entityName = ''  # type: str
        self.attributeName = ''  # type: str
