# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.persistence.cdmfolder.types import OperationArrayExpansion

from .operation_base_persistence import OperationBasePersistence

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmOperationArrayExpansion
    from cdm.utilities import ResolveOptions, CopyOptions


class OperationArrayExpansionPersistence:
    """Operation ArrayExpansion persistence"""

    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', data: 'OperationArrayExpansion') -> 'CdmOperationArrayExpansion':
        if not data:
            return None
        
        array_expansion_op = OperationBasePersistence.from_data(ctx,
            CdmObjectType.OPERATION_ARRAY_EXPANSION_DEF, data)  # type: CdmOperationArrayExpansion
        array_expansion_op.start_ordinal = data.startOrdinal
        array_expansion_op.end_ordinal = data.endOrdinal

        return array_expansion_op

    @staticmethod
    def to_data(instance: 'CdmOperationArrayExpansion', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'OperationArrayExpansion':
        if not instance:
            return None

        obj = OperationBasePersistence.to_data(instance, res_opt, options)  # type: OperationArrayExpansion
        obj.startOrdinal = instance.start_ordinal
        obj.endOrdinal = instance.end_ordinal

        return obj
