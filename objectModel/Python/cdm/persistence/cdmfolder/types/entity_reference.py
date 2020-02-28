# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, List

from cdm.utilities import JObject


class EntityReference(JObject):
    def __init__(self):
        super().__init__()

        self.entityReference = None  # type: Union[str, Entity]
        self.appliedTraits = []  # type: List[Union[str, TraitReference]]
