# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from enum import Enum


class CdmOperationType(Enum):
    """Enumeration of operation types"""

    ERROR = 'Error',
    ADD_COUNT_ATTRIBUTE = 'AddCountAttribute',
    ADD_SUPPORTING_ATTRIBUTE = 'AddSupportingAttribute',
    ADD_TYPE_ATTRIBUTE = 'AddTypeAttribute',
    EXCLUDE_ATTRIBUTES = 'ExcludeAttributes',
    ARRAY_EXPANSION = 'ArrayExpansion',
    COMBINE_ATTRIBUTES = 'CombineAttributes',
    RENAME_ATTRIBUTES = 'RenameAttributes',
    REPLACE_AS_FOREIGN_KEY = 'ReplaceAsForeignKey',
    INCLUDE_ATTRIBUTES = 'IncludeAttributes',
    ADD_ATTRIBUTE_GROUP = "AddAttributeGroup"


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
