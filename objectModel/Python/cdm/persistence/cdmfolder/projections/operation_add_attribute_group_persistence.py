# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.enums.cdm_operation_type import OperationTypeConvertor, CdmOperationType
from cdm.persistence.cdmfolder.types import OperationAddAttributeGroup

from cdm.utilities.logging import logger
from cdm.utilities.string_utils import StringUtils

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmOperationAddAttributeGroup
    from cdm.utilities import ResolveOptions, CopyOptions

_TAG = 'OperationAddAttributeGroupPersistence'


class OperationAddAttributeGroupPersistence:
    """Operation AddAttributeGroup persistence"""

    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', data: 'OperationAddAttributeGroup') -> 'CdmOperationAddAttributeGroup':
        if not data:
            return None

        add_attribute_group_op = ctx.corpus.make_object(CdmObjectType.OPERATION_ADD_ATTRIBUTE_GROUP_DEF)  # type: CdmOperationAddAttributeGroup

        if data.type and not StringUtils.equals_with_ignore_case(data.type, OperationTypeConvertor._operation_type_to_string(CdmOperationType.ADD_ATTRIBUTE_GROUP)):
            logger.error(_TAG, ctx, '$type {} is invalid for this operation.'.format(data.type))
        else:
            add_attribute_group_op.type = CdmOperationType.ADD_ATTRIBUTE_GROUP

        add_attribute_group_op.attribute_group_name = data.attributeGroupName
        add_attribute_group_op.explanation = data.explanation

        return add_attribute_group_op

    @staticmethod
    def to_data(instance: 'CdmOperationAddAttributeGroup', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'OperationAddAttributeGroup':
        if not instance:
            return None

        obj = OperationAddAttributeGroup()
        obj.type = OperationTypeConvertor._operation_type_to_string(CdmOperationType.ADD_ATTRIBUTE_GROUP)
        obj.attributeGroupName = instance.attribute_group_name
        obj.explanation = instance.explanation

        return obj
