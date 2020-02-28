# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, List

from .trait_reference import TraitReference
from .parameter import Parameter
from cdm.utilities import JObject


class Trait(JObject):
    def __init__(self):
        super().__init__()

        self.explanation = ''  # type: str
        self.traitName = ''  # type: str
        self.extendsTrait = None  # type: Union[str, TraitReference]
        self.hasParameters = []  # type: List[Union[str, Parameter]]
        self.elevated = False  # type: bool
        self.modifiesAttributes = False  # type: bool
        self.ugly = False  # type: bool
        self.associatedProperties = []  # type: List[str]
