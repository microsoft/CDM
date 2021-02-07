# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List, Optional

from cdm.utilities import JObject

from .annotation import Annotation


class MetadataObject(JObject):
    """
    Represents a base class for a metadata object.
    """

    def __init__(self):
        super().__init__()

        self.name = None  # type: str
        self.description = None  # type: str
        self.annotations = None  # type: Optional[List[Annotation]]
        self.traits = None  # type: Optional[List]
