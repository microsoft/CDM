# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from typing import Callable, TYPE_CHECKING

if TYPE_CHECKING:
    from cdm.objectmodel import CdmObject

VisitCallback = Callable[['CdmObject', str], bool]
