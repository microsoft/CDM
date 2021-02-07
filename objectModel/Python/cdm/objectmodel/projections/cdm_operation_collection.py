# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCollection

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmObject, CdmOperationBase


class CdmOperationCollection(CdmCollection):
    """Collection of operations"""

    def __init__(self, ctx: 'CdmCorpusContext', owner: 'CdmObject'):
        super().__init__(ctx, owner, CdmObjectType.ERROR)

    def append(self, operation: 'CdmOperationBase') -> 'CdmOperationBase':
        return super().append(operation)

    def remove(self, operation: 'CdmOperationBase') -> None:
        return super().remove(operation)
