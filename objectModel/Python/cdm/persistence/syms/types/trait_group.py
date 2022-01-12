# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, List, Optional

from cdm.utilities import JObject


class TraitGroup(JObject):
    def __init__(self):
        super().__init__()

        self.explanation = None  # type: Optional[str]
        self.traitGroupName = None  # type: str
        self.exhibitsTraits = None  # type: List[Union[str, 'TraitReference', 'TraitGroupReference']]