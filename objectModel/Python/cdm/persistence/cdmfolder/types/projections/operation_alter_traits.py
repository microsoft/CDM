# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, List, Optional, TYPE_CHECKING
from cdm.persistence.cdmfolder.types.projections.operation_base import OperationBase
from cdm.objectmodel import CdmTraitGroupReference, CdmTraitGroupReference

if TYPE_CHECKING:
    from cdm.persistence.cdmfolder.types import TraitGroupReference, TraitReference


class OperationAlterTraits(OperationBase):
    """OperationAlterTraits class"""

    def __init__(self):
        super().__init__()

        self.traitsToAdd = None  # type: List[Union[str, TraitReference, TraitGroupReference]]
        self.traitsToRemove = None  # type: List[Union[str, TraitReference, TraitGroupReference]]
        self.argumentsContainWildcards = None  # type: Optional[bool]
        self.applyTo = None
        self.applyToTraits = None
