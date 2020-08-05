# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.enums.cdm_operation_type import OperationTypeConvertor, CdmOperationType

from cdm.persistence.cdmfolder.types import OperationExcludeAttributes
from cdm.utilities.logging import logger
from cdm.utilities.string_utils import StringUtils

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmOperationExcludeAttributes
    from cdm.utilities import ResolveOptions, CopyOptions

_TAG = 'OperationExcludeAttributesPersistence'


class OperationExcludeAttributesPersistence:
    """Operation ExcludeAttributes persistence"""

    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', data: 'OperationExcludeAttributes') -> 'CdmOperationExcludeAttributes':
        if not data:
            return None

        exclude_attributes_op = ctx.corpus.make_object(CdmObjectType.OPERATION_EXCLUDE_ATTRIBUTES_DEF)

        if data.type and not StringUtils.equals_with_ignore_case(data.type, OperationTypeConvertor._operation_type_to_string(CdmOperationType.EXCLUDE_ATTRIBUTES)):
            logger.error(_TAG, ctx, '$type {} is invalid for this operation.'.format(data.type))
        else:
            exclude_attributes_op.type = CdmOperationType.EXCLUDE_ATTRIBUTES

        if data.explanation:
            exclude_attributes_op.explanation = data.explanation

        exclude_attributes_op.exclude_attributes = data.excludeAttributes

        return exclude_attributes_op

    @staticmethod
    def to_data(instance: 'CdmOperationExcludeAttributes', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'OperationExcludeAttributes':
        if not instance:
            return None

        obj = OperationExcludeAttributes()
        obj.type = OperationTypeConvertor._operation_type_to_string(CdmOperationType.EXCLUDE_ATTRIBUTES)
        obj.explanation = instance.explanation
        obj.excludeAttributes = instance.exclude_attributes

        return obj
