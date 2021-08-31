# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from enum import IntEnum

class EnvironmentType(IntEnum):
    """
    Specifies the security/privacy level of running environment.
    """
    # Development environment.
    DEV = 0

    # Testing In Production.
    TEST = 1

    # Production environment.
    PROD = 2