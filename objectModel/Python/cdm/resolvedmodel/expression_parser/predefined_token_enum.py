# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from enum import IntEnum


class PredefinedTokenEnum(IntEnum):
    ALWAYS = 1

    AND = 2
    OR = 3
    NOT = 4

    TRUE = 5
    FALSE = 6

    GT = 7
    LT = 8
    EQ = 9
    NE = 10
    GE = 11
    LE = 12

    DEPTH = 13
    MAXDEPTH = 14

    NOMAXDEPTH = 15
    ISARRAY = 16

    MINCARDINALITY = 17
    MAXCARDINALITY = 18

    REFERENCEONLY = 19
    NORMALIZED = 20
    STRUCTURED = 21
    VIRTUAL = 22

    OPENPAREN = 23
    CLOSEPAREN = 24
