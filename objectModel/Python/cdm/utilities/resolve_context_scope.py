# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from cdm.objectmodel import CdmTraitDefinition


class ResolveContextScope:
    def __init__(self, current_trait=None, current_parameter=None):
        self._current_trait = current_trait  # type: Optional[CdmTraitDefinition]
        self._current_parameter = current_parameter  # type: Optional[int]
