# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from enum import IntEnum


class CdmAttributeContextType(IntEnum):
    ENTITY = 1
    ENTITY_REFERENCE_EXTENDS = 2
    ATTRIBUTE_DEFINITION = 3
    ATTRIBUTE_GROUP = 4
    GENERATED_SET = 5
    GENERATED_ROUND = 6
    ADDED_ATTRIBUTE_SUPPORTING = 7
    ADDED_ATTRIBUTE_IDENTITY = 8
    ADDED_ATTRIBUTE_SELECTED_TYPE = 9
    ADDED_ATTRIBUTE_EXPANSION_TOTAL = 10
    PASS_THROUGH = 11
