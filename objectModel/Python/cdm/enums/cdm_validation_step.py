# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from .utils import AutoNumber


class CdmValidationStep(AutoNumber):
    START = ()
    IMPORTS = ()
    INTEGRITY = ()
    DECLARATIONS = ()
    REFERENCES = ()
    PARAMETERS = ()
    TRAIT_APPLIERS = ()
    MINIMUM_FOR_RESOLVING = ()
    TRAITS = ()
    ATTRIBUTES = ()
    ENTITY_REFERENCES = ()
    FINISHED = ()
    ERROR = ()
