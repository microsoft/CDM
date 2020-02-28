# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from enum import IntEnum


class CdmValidationStep(IntEnum):
    START = 1
    IMPORTS = 2
    INTEGRITY = 3
    DECLARATIONS = 4
    REFERENCES = 5
    PARAMETERS = 6
    TRAIT_APPLIERS = 7
    MINIMUM_FOR_RESOLVING = 8
    TRAITS = 9
    ATTRIBUTES = 10
    ENTITY_REFERENCES = 11
    FINISHED = 12
    ERROR = 13
