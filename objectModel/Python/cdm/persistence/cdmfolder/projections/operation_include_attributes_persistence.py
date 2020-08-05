# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.enums.cdm_operation_type import OperationTypeConvertor, CdmOperationType

from cdm.persistence.cdmfolder.types import OperationIncludeAttributes
from cdm.utilities.logging import logger
from cdm.utilities.string_utils import StringUtils

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmOperationIncludeAttributes
    from cdm.utilities import ResolveOptions, CopyOptions

_TAG = 'OperationIncludeAttributesPersistence'


class OperationIncludeAttributesPersistence:
    """Operation IncludeAttributes persistence"""

    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', data: 'OperationIncludeAttributes') -> 'CdmOperationIncludeAttributes':
        if not data:
            return None

        include_attributes_op = ctx.corpus.make_object(CdmObjectType.OPERATION_INCLUDE_ATTRIBUTES_DEF)

        if data.type and not StringUtils.equals_with_ignore_case(data.type, OperationTypeConvertor._operation_type_to_string(CdmOperationType.INCLUDE_ATTRIBUTES)):
            logger.error(_TAG, ctx, '$type {} is invalid for this operation.'.format(data.type))
        else:
            include_attributes_op.type = CdmOperationType.INCLUDE_ATTRIBUTES

        if data.explanation:
            include_attributes_op.explanation = data.explanation

        include_attributes_op.include_attributes = data.includeAttributes

        return include_attributes_op

    @staticmethod
    def to_data(instance: 'CdmOperationIncludeAttributes', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'OperationIncludeAttributes':
        if not instance:
            return None

        obj = OperationIncludeAttributes()
        obj.type = OperationTypeConvertor._operation_type_to_string(CdmOperationType.INCLUDE_ATTRIBUTES)
        obj.explanation = instance.explanation
        obj.includeAttributes = instance.include_attributes

        return obj
