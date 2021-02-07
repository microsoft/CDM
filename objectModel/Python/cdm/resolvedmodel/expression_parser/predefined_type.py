# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from enum import IntEnum


class PredefinedType(IntEnum):
    NOT_OPERATOR = 1
    OPERATOR = 2
    TOKEN = 3
    CONSTANT = 4
    OPEN_PARENTHESIS = 5
    CLOSE_PARENTHESIS = 6
    CUSTOM = 7
