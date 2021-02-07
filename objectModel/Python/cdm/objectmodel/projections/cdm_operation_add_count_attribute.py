# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType, CdmOperationType, CdmAttributeContextType
from cdm.objectmodel import CdmAttributeContext
from cdm.resolvedmodel.projections.projection_attribute_state import ProjectionAttributeState
from cdm.utilities import Errors, logger, AttributeContextParameters

from .cdm_operation_base import CdmOperationBase

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmTypeAttributeDefinition
    from cdm.resolvedmodel.projections.projection_attribute_state_set import ProjectionAttributeStateSet
    from cdm.resolvedmodel.projections.projection_context import ProjectionContext
    from cdm.utilities import VisitCallback, ResolveOptions


class CdmOperationAddCountAttribute(CdmOperationBase):
    """Class to handle AddCountAttribute operations"""

    def __init__(self, ctx: 'CdmCorpusContext') -> None:
        super().__init__(ctx)

        self.count_attribute = None  # type: CdmTypeAttributeDefinition
        self.type = CdmOperationType.ADD_COUNT_ATTRIBUTE  # type: CdmOperationType

        # --- internal ---
        self._TAG = CdmOperationAddCountAttribute.__name__

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmOperationAddCountAttribute'] = None) -> 'CdmOperationAddCountAttribute':
        copy = CdmOperationAddCountAttribute(self.ctx)
        copy.count_attribute = self.count_attribute.copy(res_opt, host)
        return copy

    def get_name(self) -> str:
        return 'operationAddCountAttribute'

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.OPERATION_ADD_COUNT_ATTRIBUTE_DEF

    def validate(self) -> bool:
        missing_fields = []

        if not bool(self.count_attribute):
            missing_fields.append('count_attribute')

        if len(missing_fields) > 0:
            logger.error(self._TAG, self.ctx, Errors.validate_error_string(self.at_corpus_path, missing_fields))
            return False

        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = ''
        if not self.ctx.corpus._block_declared_path_changes:
            path = self._declared_path
            if not path:
                path = path_from + 'operationAddCountAttribute'
                self._declared_path = path

        if pre_children and pre_children(self, path):
            return False

        if post_children and post_children(self, path):
            return True

        return False

    def _append_projection_attribute_state(self, proj_ctx: 'ProjectionContext', proj_output_set: 'ProjectionAttributeStateSet', attr_ctx: 'CdmAttributeContext') -> 'ProjectionAttributeStateSet':
        # Pass through all the input projection attribute states if there are any
        for current_PAS in proj_ctx._current_attribute_state_set._states:
            proj_output_set._add(current_PAS)

        # Create a new attribute context for the operation
        attr_ctx_op_add_count_param = AttributeContextParameters()
        attr_ctx_op_add_count_param._under = attr_ctx
        attr_ctx_op_add_count_param._type = CdmAttributeContextType.OPERATION_ADD_COUNT_ATTRIBUTE
        attr_ctx_op_add_count_param._name = 'operation/index{}/operationAddCountAttribute'.format(self._index)
        attr_ctx_op_add_count = CdmAttributeContext._create_child_under(proj_ctx._projection_directive._res_opt, attr_ctx_op_add_count_param)

        # Create a new attribute context for the Count attribute we will create
        attr_ctx_count_attr_param = AttributeContextParameters()
        attr_ctx_count_attr_param._under = attr_ctx_op_add_count
        attr_ctx_count_attr_param._type = CdmAttributeContextType.ADDED_ATTRIBUTE_EXPANSION_TOTAL
        attr_ctx_count_attr_param._name = self.count_attribute.name
        attr_ctx_count_attr = CdmAttributeContext._create_child_under(proj_ctx._projection_directive._res_opt, attr_ctx_count_attr_param)

        # Create the Count attribute with the specified CountAttribute as its target and apply the trait "is.linkedEntity.array.count" to it
        add_trait = ['is.linkedEntity.array.count']
        new_res_attr = self._create_new_resolved_attribute(proj_ctx, attr_ctx_count_attr, self.count_attribute, None, add_trait)

        # Create a new projection attribute state for the new Count attribute and add it to the output set
        # There is no previous state for the newly created Count attribute
        new_PAS = ProjectionAttributeState(proj_output_set._ctx)
        new_PAS._current_resolved_attribute = new_res_attr

        proj_output_set._add(new_PAS)

        return proj_output_set
