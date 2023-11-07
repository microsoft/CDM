# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from .utils import AutoNumber


class CdmStatusLevel(AutoNumber):
    PROGRESS = ()
    INFO = ()
    WARNING = ()
    ERROR = ()
    NONE = ()
