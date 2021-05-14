# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.objectmodel import CdmAttributeContext
from cdm.resolvedmodel.projections.projection_attribute_state_set import ProjectionAttributeStateSet
from cdm.resolvedmodel.projections.projection_directive import ProjectionDirective


class ProjectionContext:
    """Context for each projection or nested projection"""

    def __init__(self, proj_directive: 'ProjectionDirective', attr_ctx: 'CdmAttributeContext'):
        # --- internal ---

        # Directive passed to the root projection
        self._projection_directive = proj_directive

        # The attribute context of the current resolve attribute
        self._current_attribute_context = attr_ctx

        # A list of attribute state
        self._current_attribute_state_set = ProjectionAttributeStateSet(proj_directive._owner.ctx if proj_directive and proj_directive._owner else None)
