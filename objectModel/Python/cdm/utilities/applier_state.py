# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import copy
from typing import Callable, TYPE_CHECKING

if TYPE_CHECKING:
    from cdm.resolvedmodel import ResolvedAttribute


class ApplierState:

    def __init__(self) -> None:
        self._flex_remove = False  # type: bool
        self._array_template = None  # type: ResolvedAttribute
        self._flex_current_ordinal = None  # type: Optional[int]
        self._array_final_ordinal = None  # type: Optional[int]
        self._array_initial_ordinal = None  # type: Optional[int]
        self._array_specialized_context = None  # type: Optional[Callable]

    def _copy(self) -> 'ApplierState':
        return copy.copy(self)
