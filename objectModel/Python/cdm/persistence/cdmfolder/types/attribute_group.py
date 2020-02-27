# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List, Union

from cdm.utilities import JObject


class AttributeGroup(JObject):
    def __init__(self):
        super().__init__()

        self.explanation = ''  # type: str
        self.attributeGroupName = ''  # type: str
        self.attributeContext = None  # type: Union[str, IdentifierRef]
        self.members = []  # type: List[Union[str, AttributeGroupReference, TypeAttribute, EntityAttribute]]
        self.exhibitsTraits = []  # type: List[Union[str, TraitReference]]
