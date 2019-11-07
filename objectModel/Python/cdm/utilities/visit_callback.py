# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from typing import Callable, NewType, TYPE_CHECKING

if TYPE_CHECKING:
    from cdm.objectmodel import CdmObject

VisitCallback = NewType('VisitCallback', Callable[['CdmObject', str], bool])
