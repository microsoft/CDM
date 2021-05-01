# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List, Optional

from cdm.utilities import JObject
from .trait_reference import TraitReference
from .trait_group_reference import TraitGroupReference


class AttributeContext(JObject):
    def __init__(self):
        super().__init__()

        self.explanation = None  # type: Optional[str]
        self.type = None  # type: Optional[str]
        self.name = None  # type: Optional[str]
        self.parent = None  # type: Optional[str]
        self.definition = None  # type: Optional[str]
        self.appliedTraits = None  # type: Optional[List[str, TraitReference, TraitGroupReference]]
        self.contents = None  # type: Optional[List[str, AttributeContext]]
        self.lineage = None  # type: Optional[List[AttributeContext]]
