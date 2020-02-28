# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from enum import Enum


class CdmDataFormat(Enum):
    UNKNOWN = 'Unknown'
    INT16 = 'Int16'
    INT32 = 'Int32'
    INT64 = 'Int64'
    FLOAT = 'Float'
    DOUBLE = 'Double'
    GUID = 'Guid'
    STRING = 'String'
    CHAR = 'Char'
    BYTE = 'Byte'
    BINARY = 'Binary'
    TIME = 'Time'
    DATE = 'Date'
    DATE_TIME = 'DateTime'
    DATE_TIME_OFFSET = 'DateTimeOffset'
    BOOLEAN = 'Boolean'
    DECIMAL = 'Decimal'
    JSON = 'Json'
