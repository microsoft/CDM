# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.enums.cdm_operation_type import OperationTypeConvertor, CdmOperationType

from cdm.persistence.cdmfolder import utils
from cdm.persistence.cdmfolder.types import OperationCombineAttributes
from cdm.utilities.logging import logger
from cdm.utilities.string_utils import StringUtils

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmOperationCombineAttributes
    from cdm.utilities import ResolveOptions, CopyOptions

_TAG = 'OperationCombineAttributesPersistence'


class OperationCombineAttributesPersistence:
    """Operation CombineAttributes persistence"""

    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', data: 'OperationCombineAttributes') -> 'CdmOperationCombineAttributes':
        if not data:
            return None

        combine_attributes_op = ctx.corpus.make_object(CdmObjectType.OPERATION_COMBINE_ATTRIBUTES_DEF)

        if data.type and not StringUtils.equals_with_ignore_case(data.type, OperationTypeConvertor._operation_type_to_string(CdmOperationType.COMBINE_ATTRIBUTES)):
            logger.error(_TAG, ctx, '$type {} is invalid for this operation.'.format(data.type))
        else:
            combine_attributes_op.type = CdmOperationType.COMBINE_ATTRIBUTES

        if data.explanation:
            combine_attributes_op.explanation = data.explanation

        combine_attributes_op.select = data.select
        combine_attributes_op.merge_into = utils.create_attribute(ctx, data.mergeInto)

        return combine_attributes_op

    @staticmethod
    def to_data(instance: 'CdmOperationCombineAttributes', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'OperationCombineAttributes':
        from cdm.persistence.cdmfolder.type_attribute_persistence import TypeAttributePersistence

        if not instance:
            return None

        obj = OperationCombineAttributes()
        obj.type = OperationTypeConvertor._operation_type_to_string(CdmOperationType.COMBINE_ATTRIBUTES)
        obj.explanation = instance.explanation
        obj.select = instance.select
        obj.mergeInto = TypeAttributePersistence.to_data(instance.merge_into, res_opt, options)

        return obj
