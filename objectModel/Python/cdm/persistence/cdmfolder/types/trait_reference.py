# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, List, Optional

from cdm.utilities import JObject


class TraitReference(JObject):
    def __init__(self):
        super().__init__()

        self.traitReference = None  # type: Union[str, Trait]
        self.arguments = None  # type: Optional[List[Union[str, Argument]]]
