# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

import copy
from typing import Callable, TYPE_CHECKING

if TYPE_CHECKING:
    from cdm.resolvedmodel import ResolvedAttribute


class ApplierState:

    def __init__(self) -> None:
        self.flex_remove = False  # type: bool
        self.array_template = None  # type: ResolvedAttribute
        self.flex_current_ordinal = None  # type: Optional[int]
        self.array_final_ordinal = None  # type: Optional[int]
        self.array_initial_ordinal = None  # type: Optional[int]
        self.array_specialized_context = None  # type: Optional[Callable]

    def copy(self) -> 'ApplierState':
        return copy.copy(self)
