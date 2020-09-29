# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType, CdmOperationType
from cdm.utilities import logger

from .cdm_operation_base import CdmOperationBase

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmAttributeContext
    from cdm.resolvedmodel.projections.projection_attribute_state_set import ProjectionAttributeStateSet
    from cdm.resolvedmodel.projections.projection_context import ProjectionContext
    from cdm.utilities import VisitCallback, ResolveOptions


class CdmOperationAddAttributeGroup(CdmOperationBase):
    """Class to handle AddAttributeGroup operations"""

    def __init__(self, ctx: 'CdmCorpusContext') -> None:
        super().__init__(ctx)

        # TODO (sukanyas): Property to be defined

        self.type = CdmOperationType.ADD_ATTRIBUTE_GROUP  # type: CdmOperationType

        # --- internal ---
        self._TAG = CdmOperationAddAttributeGroup.__name__

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmOperationAddAttributeGroup'] = None) -> 'CdmOperationAddAttributeGroup':
        logger.error(self._TAG, self.ctx, 'Projection operation not implemented yet.', 'copy')
        return CdmOperationAddAttributeGroup(self.ctx)

    def get_name(self) -> str:
        return 'operationAddAttributeGroup'

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.OPERATION_ADD_ATTRIBUTE_GROUP_DEF

    def validate(self) -> bool:
        missing_fields = []

        # TODO (sukanyas): required Property to be defined

        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = ''
        if not self.ctx.corpus._block_declared_path_changes:
            path = self._declared_path
            if not path:
                path = path_from + 'operationAddAttributeGroup'
                self._declared_path = path

        if pre_children and pre_children(self, path):
            return False

        if post_children and post_children(self, path):
            return True

        return False

    def _append_projection_attribute_state(self, proj_ctx: 'ProjectionContext', proj_attr_state_set: 'ProjectionAttributeStateSet', attr_ctx: 'CdmAttributeContext') -> 'ProjectionAttributeStateSet':
        logger.error(self._TAG, self.ctx, 'Projection operation not implemented yet.', '_append_projection_attribute_state')
        return None
