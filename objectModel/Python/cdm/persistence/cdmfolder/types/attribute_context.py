# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List

from cdm.utilities import JObject


class AttributeContext(JObject):
    def __init__(self):
        super().__init__()

        self.explanation = None  # type: str
        self.type = None  # type: str
        self.name = None  # type: str
        self.parent = None  # type: str
        self.definition = None  # type: str
        self.appliedTraits = None  # type: Optional[List[str, TraitRefernce]]
        self.contents = None  # type: Optional[List[str, AttributeContext]]
