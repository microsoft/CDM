# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from cdm.utilities import JObject


class ReferenceModel(JObject):
    """
    Represents an entity that belongs to an external model.
    """

    def __init__(self):
        super().__init__()

        self.id = ''  # type: str
        self.location = ''  # type: str
