# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, List

from cdm.utilities import JObject

from .entity_reference import EntityReference


class ConstantEntity(JObject):
    def __init__(self):
        super().__init__()

        self.explanation = None  # type: str
        self.constantEntityName = None  # type: str
        self.entityShape = None  # type: Union[str, EntityReference]
        self.constantValues = None  # type: List[List[str]]
