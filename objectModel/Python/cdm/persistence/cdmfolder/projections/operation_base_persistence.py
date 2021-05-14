# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType, CdmLogCode
from cdm.enums.cdm_operation_type import OperationTypeConvertor, CdmOperationType
from cdm.utilities.logging import logger
from cdm.utilities.string_utils import StringUtils

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmOperationBase
    from cdm.utilities import ResolveOptions, CopyOptions


def _make_data_object(object_type: 'CdmObjectType'):
    """Instantiates a data object based on the object type."""
    from cdm.persistence.cdmfolder.types import OperationAddAttributeGroup, OperationAddCountAttribute, OperationAddSupportingAttribute, \
        OperationAddTypeAttribute, OperationArrayExpansion, OperationCombineAttributes, OperationExcludeAttributes, OperationIncludeAttributes, \
        OperationRenameAttributes, OperationReplaceAsForeignKey
    data_map = {
        CdmObjectType.OPERATION_ADD_ATTRIBUTE_GROUP_DEF: lambda: OperationAddAttributeGroup(),
        CdmObjectType.OPERATION_ADD_COUNT_ATTRIBUTE_DEF: lambda: OperationAddCountAttribute(),
        CdmObjectType.OPERATION_ADD_SUPPORTING_ATTRIBUTE_DEF: lambda: OperationAddSupportingAttribute(),
        CdmObjectType.OPERATION_ADD_TYPE_ATTRIBUTE_DEF: lambda: OperationAddTypeAttribute(),
        CdmObjectType.OPERATION_ARRAY_EXPANSION_DEF: lambda: OperationArrayExpansion(),
        CdmObjectType.OPERATION_COMBINE_ATTRIBUTES_DEF: lambda: OperationCombineAttributes(),
        CdmObjectType.OPERATION_EXCLUDE_ATTRIBUTES_DEF: lambda: OperationExcludeAttributes(),
        CdmObjectType.OPERATION_INCLUDE_ATTRIBUTES_DEF: lambda: OperationIncludeAttributes(),
        CdmObjectType.OPERATION_RENAME_ATTRIBUTES_DEF: lambda: OperationRenameAttributes(),
        CdmObjectType.OPERATION_REPLACE_AS_FOREIGN_KEY_DEF: lambda: OperationReplaceAsForeignKey(),
    }

    return data_map.get(object_type)()


class OperationBasePersistence:
    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', object_type: 'CdmObjectType', data: 'OperationBase'):
        if data is None:
            return None

        operation = ctx.corpus.make_object(object_type)  # type: CdmOperationBase
        operation_type = OperationTypeConvertor._from_object_type(object_type)  # type: CdmOperationType
        operation_name = OperationTypeConvertor._operation_type_to_string(CdmOperationType.COMBINE_ATTRIBUTES)
        if data.type and not StringUtils.equals_with_ignore_case(data.type, operation_name):
            logger.error(ctx, operation_name, OperationBasePersistence.from_data.__name__, None, CdmLogCode.ERR_PERSIST_PROJ_INVALID_TYPE, data.type)
        else:
            operation.type = operation_type

        operation.condition = data.condition
        operation.explanation = data.explanation
        operation.source_input = data.sourceInput

        return operation

    @staticmethod
    def to_data(instance: 'CdmOperationBase', res_opt: 'ResolveOptions', options: 'CopyOptions'):
        data = _make_data_object(instance.object_type)
        data.type = OperationTypeConvertor._operation_type_to_string(instance.type)
        data.condition = instance.condition
        data.explanation = instance.explanation
        data.sourceInput = instance.source_input

        return data
