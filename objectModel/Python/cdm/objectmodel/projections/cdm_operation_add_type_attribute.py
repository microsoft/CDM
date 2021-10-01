# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType, CdmOperationType, CdmAttributeContextType
from cdm.objectmodel import CdmAttributeContext
from cdm.resolvedmodel.projections.projection_attribute_state import ProjectionAttributeState
from cdm.utilities import logger, AttributeContextParameters
from cdm.enums import CdmLogCode
from cdm.utilities.string_utils import StringUtils

from .cdm_operation_base import CdmOperationBase

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmTypeAttributeDefinition
    from cdm.resolvedmodel.projections.projection_attribute_state_set import ProjectionAttributeStateSet
    from cdm.resolvedmodel.projections.projection_context import ProjectionContext
    from cdm.utilities import VisitCallback, ResolveOptions


class CdmOperationAddTypeAttribute(CdmOperationBase):
    """Class to handle AddTypeAttribute operations"""

    def __init__(self, ctx: 'CdmCorpusContext') -> None:
        super().__init__(ctx)

        self._TAG = CdmOperationAddTypeAttribute.__name__
        self.type_attribute = None  # type: CdmTypeAttributeDefinition
        self.type = CdmOperationType.ADD_TYPE_ATTRIBUTE  # type: CdmOperationType

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmOperationAddTypeAttribute'] = None) -> 'CdmOperationAddTypeAttribute':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        copy = CdmOperationAddTypeAttribute(self.ctx) if not host else host

        copy.type_attribute = self.type_attribute.copy(res_opt) if self.type_attribute else None

        self._copy_proj(res_opt, copy)
        return copy

    def get_name(self) -> str:
        return 'operationAddTypeAttribute'

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.OPERATION_ADD_TYPE_ATTRIBUTE_DEF

    def validate(self) -> bool:
        missing_fields = []

        if not bool(self.type_attribute):
            missing_fields.append('type_attribute')

        if len(missing_fields) > 0:
            logger.error(self.ctx, self._TAG, 'validate', self.at_corpus_path, CdmLogCode.ERR_VALDN_INTEGRITY_CHECK_FAILURE, self.at_corpus_path, ', '.join(map(lambda s: '\'' + s + '\'', missing_fields)))
            return False

        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = self._fetch_declared_path(path_from)

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
        attr_ctx_op_add_type_param = AttributeContextParameters()
        attr_ctx_op_add_type_param._under = attr_ctx
        attr_ctx_op_add_type_param._type = CdmAttributeContextType.OPERATION_ADD_TYPE_ATTRIBUTE
        attr_ctx_op_add_type_param._name = 'operation/index{}/operationAddTypeAttribute'.format(self._index)
        attr_ctx_op_add_type = CdmAttributeContext._create_child_under(proj_ctx._projection_directive._res_opt, attr_ctx_op_add_type_param)

        # Create a new attribute context for the Type attribute we will create
        attr_ctx_type_attr_param = AttributeContextParameters()
        attr_ctx_type_attr_param._under = attr_ctx_op_add_type
        attr_ctx_type_attr_param._type = CdmAttributeContextType.ADDED_ATTRIBUTE_SELECTED_TYPE
        attr_ctx_type_attr_param._name = '_selectedEntityName'
        attr_ctx_type_attr = CdmAttributeContext._create_child_under(proj_ctx._projection_directive._res_opt, attr_ctx_type_attr_param)

        # Create the Type attribute with the specified "typeAttribute" (from the operation) as its target and apply the trait "is.linkedEntity.name" to it
        add_trait = ['is.linkedEntity.name']
        new_res_attr = self._create_new_resolved_attribute(proj_ctx, attr_ctx_type_attr, self.type_attribute, None, add_trait)

        # Create a new projection attribute state for the new Type attribute and add it to the output set
        # There is no previous state for the newly created Type attribute
        new_PAS = ProjectionAttributeState(proj_output_set._ctx)
        new_PAS._current_resolved_attribute = new_res_attr

        proj_output_set._add(new_PAS)

        return proj_output_set
