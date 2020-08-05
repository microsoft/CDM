# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.enums.cdm_operation_type import OperationTypeConvertor, CdmOperationType

from cdm.persistence.cdmfolder import utils
from cdm.persistence.cdmfolder.types import OperationAddSupportingAttribute
from cdm.utilities.logging import logger
from cdm.utilities.string_utils import StringUtils

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmOperationAddSupportingAttribute
    from cdm.utilities import ResolveOptions, CopyOptions

_TAG = 'OperationAddSupportingAttributePersistence'


class OperationAddSupportingAttributePersistence:
    """Operation AddSupportingAttribute persistence"""

    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', data: 'OperationAddSupportingAttribute') -> 'CdmOperationAddSupportingAttribute':
        if not data:
            return None

        add_supporting_attribute_op = ctx.corpus.make_object(CdmObjectType.OPERATION_ADD_SUPPORTING_ATTRIBUTE_DEF)

        if data.type and not StringUtils.equals_with_ignore_case(data.type, OperationTypeConvertor._operation_type_to_string(CdmOperationType.ADD_SUPPORTING_ATTRIBUTE)):
            logger.error(_TAG, ctx, '$type {} is invalid for this operation.'.format(data.type))
        else:
            add_supporting_attribute_op.type = CdmOperationType.ADD_SUPPORTING_ATTRIBUTE

        if data.explanation:
            add_supporting_attribute_op.explanation = data.explanation

        if data.supportingAttribute:
            add_supporting_attribute_op.supporting_attribute = utils.create_attribute(ctx, data.supportingAttribute)

        return add_supporting_attribute_op

    @staticmethod
    def to_data(instance: 'CdmOperationAddSupportingAttribute', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'OperationAddSupportingAttribute':
        from cdm.persistence.cdmfolder.type_attribute_persistence import TypeAttributePersistence

        if not instance:
            return None

        obj = OperationAddSupportingAttribute()
        obj.type = OperationTypeConvertor._operation_type_to_string(CdmOperationType.ADD_SUPPORTING_ATTRIBUTE)
        obj.explanation = instance.explanation
        obj.supportingAttribute = TypeAttributePersistence.to_data(instance.supporting_attribute, res_opt, options)

        return obj
