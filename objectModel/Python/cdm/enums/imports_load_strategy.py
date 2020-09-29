# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from enum import IntEnum

class ImportsLoadStrategy(IntEnum):
    """Specifies how the OM will load the imports from a document."""

    # With the LAZY_LOAD option, the imports will only be loaded when a symbol from an external file is needed by the OM.
    LAZY_LOAD = 1
    # The imports will be loaded along with the file.
    LOAD = 2
    # The imports will not be loaded at all. If a symbol is needed the OM will log an error.
    DO_NOT_LOAD = 3
