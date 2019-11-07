# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from cdm.objectmodel import CdmAttributeContext, CdmAttributeResolutionGuidanceDefinition
    from cdm.resolvedmodel import ResolvedAttribute
    from cdm.utilities import ResolveOptions


class ApplierContext:
    def __init__(self):
        self.state = None  # type: str
        self.res_opt = None  # type: ResolveOptions
        self.att_ctx = None  # type: CdmAttributeContext
        self.res_guide = None  # type: CdmAttributeResolutionGuidanceDefinition
        self.res_att_source = None  # type: ResolvedAttribute
        self.res_att_new = None  # type: ResolvedAttribute
        self.res_guide_new = None  # type: CdmAttributeResolutionGuidanceDefinition
        self.is_continue = False  # type: bool
