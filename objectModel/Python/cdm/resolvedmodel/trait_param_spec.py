# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from typing import Dict, Optional, Union

TraitSpec = Union[str, 'TraitParamSpec']


class TraitParamSpec:
    def __init__(self) -> None:
        self.trait_base_name = None  # type: Optional[str]
        self.parameters = None  # type: Optional[Dict[str, str]]
