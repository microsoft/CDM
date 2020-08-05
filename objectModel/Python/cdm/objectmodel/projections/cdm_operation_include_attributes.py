# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING, List

from cdm.enums import CdmObjectType, CdmOperationType
from cdm.utilities import logger, Errors

from .cdm_operation_base import CdmOperationBase

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmAttributeContext
    from cdm.resolvedmodel.projections.projection_attribute_state_set import ProjectionAttributeStateSet
    from cdm.resolvedmodel.projections.projection_context import ProjectionContext
    from cdm.utilities import VisitCallback, ResolveOptions


class CdmOperationIncludeAttributes(CdmOperationBase):
    """Class to handle IncludeAttributes operations"""

    def __init__(self, ctx: 'CdmCorpusContext') -> None:
        super().__init__(ctx)

        self.include_attributes = None  # type: List[str]
        self.type = CdmOperationType.INCLUDE_ATTRIBUTES  # type: CdmOperationType

        # --- internal ---
        self._TAG = CdmOperationIncludeAttributes.__name__

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmOperationIncludeAttributes'] = None) -> 'CdmOperationIncludeAttributes':
        logger.error(self._TAG, self.ctx, 'Projection operation not implemented yet.', 'copy')
        return CdmOperationIncludeAttributes(self.ctx)

    def get_name(self) -> str:
        return 'operationIncludeAttributes'

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.OPERATION_INCLUDE_ATTRIBUTES_DEF

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        logger.error(self._TAG, self.ctx, 'Projection operation not implemented yet.', 'is_derived_from')
        return False

    def validate(self) -> bool:
        missing_fields = []

        if not bool(self.include_attributes):
            missing_fields.append('include_attributes')

        if len(missing_fields) > 0:
            logger.error(self._TAG, self.ctx, Errors.validate_error_string(self.at_corpus_path, missing_fields))
            return False

        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = ''
        if not self.ctx.corpus._block_declared_path_changes:
            path = self._declared_path
            if not path:
                path = path_from + 'operationIncludeAttributes'
                self._declared_path = path

        if pre_children and pre_children(self, path):
            return False

        if post_children and post_children(self, path):
            return True

        return False

    def _append_projection_attribute_state(self, proj_ctx: 'ProjectionContext', proj_attr_state_set: 'ProjectionAttributeStateSet', attr_ctx: 'CdmAttributeContext') -> 'ProjectionAttributeStateSet':
        logger.error(self._TAG, self.ctx, 'Projection operation not implemented yet.', '_append_projection_attribute_state')
        return None
