# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from enum import IntEnum


class CdmStatusLevel(IntEnum):
    INFO = 0
    PROGRESS = 1
    WARNING = 2
    ERROR = 3
