# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from .entity import Entity


class ReferenceEntity(Entity):
    """
    Represents a model that contains source to an external model.
    """

    def __init__(self):
        super().__init__()

        self.source = ''  # type: str
        self.modelId = ''  # type: str
