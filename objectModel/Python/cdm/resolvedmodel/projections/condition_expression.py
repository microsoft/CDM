# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmOperationCollection, CdmObject


class ConditionExpression:
    """A class to manage the conditional directive of the util"""

    @staticmethod
    def _get_entity_attribute_overall_condition_expression(owner: Optional['CdmObject'] = None) -> str:
        bldr = ''

        # if the owner of the projection is an entity attribute
        if owner and owner.object_type == CdmObjectType.ENTITY_ATTRIBUTE_DEF:
            bldr += ' ( (!normalized) || (cardinality.maximum <= 1) ) '

        return bldr if len(bldr) > 0 else None

    @staticmethod
    def _get_default_condition_expression(operations: 'CdmOperationCollection', owner: Optional['CdmObject'] = None) -> str:
        """
        When no explicit condition is provided, a projection will apply the default condition expression based on the operations
        This function defined the defaults for each operation and builds the projection's condition expression
        """
        bldr = ''

        # if the owner of the projection is an entity attribute
        if owner and owner.object_type == CdmObjectType.ENTITY_ATTRIBUTE_DEF:
            bldr += ' ( (!normalized) || (cardinality.maximum <= 1) ) '

        if len(operations) > 0:
            if ConditionExpression._has_foreign_key_operations(operations):
                bldr = ConditionExpression._append_string(bldr, ' (referenceOnly || noMaxDepth || (depth > maxDepth)) ')
            elif ConditionExpression._has_not_structured_operations(operations):
                bldr = ConditionExpression._append_string(bldr, ' (!structured) ')
            else:
                bldr = ConditionExpression._append_string(bldr, ' (true) ') # do these always

        return bldr if len(bldr) > 0 else None

    @staticmethod
    def _append_string(bldr: str, message: str) -> str:
        if len(bldr) > 0:
            bldr += ' && '
        bldr += message

        return bldr

    @staticmethod
    def _has_foreign_key_operations(operations: 'CdmOperationCollection') -> bool:
        """Function to find if the operations collection has a foreign key"""
        filtered_list = list(filter(lambda op: op.object_type == CdmObjectType.OPERATION_REPLACE_AS_FOREIGN_KEY_DEF, operations))

        return len(filtered_list) > 0

    @staticmethod
    def _has_not_structured_operations(operations: 'CdmOperationCollection') -> bool:
        """Function to find if the operations collection has an operation that is not resolved for structured directive"""
        object_types = [
            CdmObjectType.OPERATION_ADD_COUNT_ATTRIBUTE_DEF,
            CdmObjectType.OPERATION_ADD_TYPE_ATTRIBUTE_DEF,
            CdmObjectType.OPERATION_RENAME_ATTRIBUTES_DEF,
            CdmObjectType.OPERATION_ARRAY_EXPANSION_DEF
        ]
        filtered_list = list(filter(lambda op: op.object_type in object_types, operations))

        return len(filtered_list) > 0
