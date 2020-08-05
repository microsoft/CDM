# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.enums.cdm_operation_type import OperationTypeConvertor, CdmOperationType

from cdm.persistence.cdmfolder.types import OperationArrayExpansion
from cdm.utilities.logging import logger
from cdm.utilities.string_utils import StringUtils

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmOperationArrayExpansion
    from cdm.utilities import ResolveOptions, CopyOptions

_TAG = 'OperationArrayExpansionPersistence'


class OperationArrayExpansionPersistence:
    """Operation ArrayExpansion persistence"""

    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', data: 'OperationArrayExpansion') -> 'CdmOperationArrayExpansion':
        if not data:
            return None

        array_expansion_op = ctx.corpus.make_object(CdmObjectType.OPERATION_ARRAY_EXPANSION_DEF)

        if data.type and not StringUtils.equals_with_ignore_case(data.type, OperationTypeConvertor._operation_type_to_string(CdmOperationType.ARRAY_EXPANSION)):
            logger.error(_TAG, ctx, '$type {} is invalid for this operation.'.format(data.type))
        else:
            array_expansion_op.type = CdmOperationType.ARRAY_EXPANSION

        if data.explanation:
            array_expansion_op.explanation = data.explanation

        array_expansion_op.start_ordinal = data.startOrdinal
        array_expansion_op.end_ordinal = data.endOrdinal

        return array_expansion_op

    @staticmethod
    def to_data(instance: 'CdmOperationArrayExpansion', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'OperationArrayExpansion':
        if not instance:
            return None

        obj = OperationArrayExpansion()
        obj.type = OperationTypeConvertor._operation_type_to_string(CdmOperationType.ARRAY_EXPANSION)
        obj.explanation = instance.explanation
        obj.startOrdinal = instance.start_ordinal
        obj.endOrdinal = instance.end_ordinal

        return obj
