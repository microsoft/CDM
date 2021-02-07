# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from enum import Enum
from typing import Dict

from .cdm_object_type import CdmObjectType


class CdmOperationType(Enum):
    """Enumeration of operation types"""

    ADD_ATTRIBUTE_GROUP = "AddAttributeGroup"
    ADD_COUNT_ATTRIBUTE = 'AddCountAttribute'
    ADD_SUPPORTING_ATTRIBUTE = 'AddSupportingAttribute'
    ADD_TYPE_ATTRIBUTE = 'AddTypeAttribute'
    ARRAY_EXPANSION = 'ArrayExpansion'
    COMBINE_ATTRIBUTES = 'CombineAttributes'
    EXCLUDE_ATTRIBUTES = 'ExcludeAttributes'
    INCLUDE_ATTRIBUTES = 'IncludeAttributes'
    RENAME_ATTRIBUTES = 'RenameAttributes'
    REPLACE_AS_FOREIGN_KEY = 'ReplaceAsForeignKey'
    ERROR = 'Error'

object_type_to_operation_type = {
    CdmObjectType.OPERATION_ADD_ATTRIBUTE_GROUP_DEF: CdmOperationType.ADD_ATTRIBUTE_GROUP,
    CdmObjectType.OPERATION_ADD_COUNT_ATTRIBUTE_DEF: CdmOperationType.ADD_COUNT_ATTRIBUTE,
    CdmObjectType.OPERATION_ADD_SUPPORTING_ATTRIBUTE_DEF: CdmOperationType.ADD_SUPPORTING_ATTRIBUTE,
    CdmObjectType.OPERATION_ADD_TYPE_ATTRIBUTE_DEF: CdmOperationType.ADD_TYPE_ATTRIBUTE,
    CdmObjectType.OPERATION_ARRAY_EXPANSION_DEF: CdmOperationType.ARRAY_EXPANSION,
    CdmObjectType.OPERATION_COMBINE_ATTRIBUTES_DEF: CdmOperationType.COMBINE_ATTRIBUTES,
    CdmObjectType.OPERATION_EXCLUDE_ATTRIBUTES_DEF: CdmOperationType.EXCLUDE_ATTRIBUTES,
    CdmObjectType.OPERATION_INCLUDE_ATTRIBUTES_DEF: CdmOperationType.INCLUDE_ATTRIBUTES,
    CdmObjectType.OPERATION_RENAME_ATTRIBUTES_DEF: CdmOperationType.RENAME_ATTRIBUTES,
    CdmObjectType.OPERATION_REPLACE_AS_FOREIGN_KEY_DEF: CdmOperationType.REPLACE_AS_FOREIGN_KEY
}  # type: Dict[CdmObjectType, CdmOperationType]

class OperationTypeConvertor:
    @staticmethod
    def _operation_type_to_string(op_type: 'CdmOperationType'):
        if op_type == CdmOperationType.ADD_COUNT_ATTRIBUTE:
            return 'addCountAttribute'
        elif op_type == CdmOperationType.ADD_SUPPORTING_ATTRIBUTE:
            return 'addSupportingAttribute'
        elif op_type == CdmOperationType.ADD_TYPE_ATTRIBUTE:
            return 'addTypeAttribute'
        elif op_type == CdmOperationType.EXCLUDE_ATTRIBUTES:
            return 'excludeAttributes'
        elif op_type == CdmOperationType.ARRAY_EXPANSION:
            return 'arrayExpansion'
        elif op_type == CdmOperationType.COMBINE_ATTRIBUTES:
            return 'combineAttributes'
        elif op_type == CdmOperationType.RENAME_ATTRIBUTES:
            return 'renameAttributes'
        elif op_type == CdmOperationType.REPLACE_AS_FOREIGN_KEY:
            return 'replaceAsForeignKey'
        elif op_type == CdmOperationType.INCLUDE_ATTRIBUTES:
            return 'includeAttributes'
        elif op_type == CdmOperationType.ADD_ATTRIBUTE_GROUP:
            return 'addAttributeGroup'
        elif op_type == CdmOperationType.ERROR:
            raise NotImplementedError()
        else:
            raise NotImplementedError()

    @staticmethod
    def _from_object_type(object_type: 'CdmObjectType') -> 'CdmOperationType':
        return object_type_to_operation_type.get(object_type, CdmOperationType.ERROR)
