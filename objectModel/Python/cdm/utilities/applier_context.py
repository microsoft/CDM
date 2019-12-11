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
    def __init__(self, **kwargs):
        self.state = kwargs.get('state', None)  # type: str
        self.res_opt = kwargs.get('res_opt', None)  # type: ResolveOptions
        self.att_ctx = kwargs.get('att_ctx', None)  # type: CdmAttributeContext
        self.res_guide = kwargs.get('res_guide', None)  # type: CdmAttributeResolutionGuidanceDefinition
        self.res_att_source = kwargs.get('res_att_source', None)  # type: ResolvedAttribute
        self.res_att_new = kwargs.get('res_att_new', None)  # type: ResolvedAttribute
        self.res_guide_new = kwargs.get('res_guide_new', None)  # type: CdmAttributeResolutionGuidanceDefinition
        self.is_continue = kwargs.get('is_continue', False)  # type: bool
