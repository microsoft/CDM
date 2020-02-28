# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.utilities import JObject


class ReferenceModel(JObject):
    """
    Represents an entity that belongs to an external model.
    """

    def __init__(self):
        super().__init__()

        self.id = ''  # type: str
        self.location = ''  # type: str
