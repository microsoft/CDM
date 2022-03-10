# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmLogCode
from cdm.enums import CdmAttributeContextType, CdmObjectType, CdmOperationType
from cdm.objectmodel import CdmAttributeContext
from cdm.resolvedmodel.projections.projection_attribute_state import ProjectionAttributeState
from cdm.utilities import AttributeContextParameters, logger

from .cdm_operation_base import CdmOperationBase

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmAttributeItem, CdmAttribute, CdmTypeAttributeDefinition, CdmEntityAttributeDefinition, CdmAttributeGroupReference
    from cdm.resolvedmodel.projections.projection_attribute_state_set import ProjectionAttributeStateSet
    from cdm.resolvedmodel.projections.projection_context import ProjectionContext
    from cdm.utilities import VisitCallback, ResolveOptions


class CdmOperationAddArtifactAttribute(CdmOperationBase):
    """Class to handle AddArtifactAttribute operations"""

    def __init__(self, ctx: 'CdmCorpusContext') -> None:
        super().__init__(ctx)

        self._TAG = CdmOperationAddArtifactAttribute.__name__
        self.new_attribute = None  # type: CdmAttributeItem
        self.insert_at_top = None  # type: Optional[bool]
        self.type = CdmOperationType.ADD_ARTIFACT_ATTRIBUTE  # type: CdmOperationType

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmOperationAddArtifactAttribute'] = None) -> 'CdmOperationAddArtifactAttribute':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        copy = CdmOperationAddArtifactAttribute(self.ctx) if not host else host

        copy.new_attribute = self.new_attribute.copy(res_opt) if self.new_attribute else None
        copy.insert_at_top = self.insert_at_top

        self._copy_proj(res_opt, copy)
        return copy

    def get_name(self) -> str:
        return 'operationAddArtifactAttribute'

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.OPERATION_ADD_ARTIFACT_ATTRIBUTE_DEF

    def validate(self) -> bool:
        missing_fields = []

        if not bool(self.new_attribute):
            missing_fields.append('new_attribute')

        if len(missing_fields) > 0:
            logger.error(self.ctx, self._TAG, 'validate', self.at_corpus_path, CdmLogCode.ERR_VALDN_INTEGRITY_CHECK_FAILURE,
                         self.at_corpus_path, ', '.join(map(lambda s: '\'' + s + '\'', missing_fields)))
            return False

        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = self._fetch_declared_path(path_from)

        if pre_children and pre_children(self, path):
            return False

        if self.new_attribute and self.new_attribute.visit('{}/newAttribute/'.format(path), pre_children, post_children):
            return True

        if post_children and post_children(self, path):
            return True

        return False

    def _append_projection_attribute_state(self, proj_ctx: 'ProjectionContext', proj_output_set: 'ProjectionAttributeStateSet',
                                           attr_ctx: 'CdmAttributeContext') -> 'ProjectionAttributeStateSet':
        if self.insert_at_top is not True:
            self._add_all_previous_attribute_states(proj_ctx, proj_output_set)
            self._add_new_artifact_attribute_state(proj_ctx, proj_output_set, attr_ctx)
        else:
            self._add_new_artifact_attribute_state(proj_ctx, proj_output_set, attr_ctx)
            self._add_all_previous_attribute_states(proj_ctx, proj_output_set)

        return proj_output_set

    def _add_new_artifact_attribute_state(self, proj_ctx: 'ProjectionContext', proj_output_set: 'ProjectionAttributeStateSet', attr_ctx: 'CdmAttributeContext') -> None:
        # Create a new attribute context for the operation
        attr_ctx_op_add_artifact_attr_param = AttributeContextParameters()
        attr_ctx_op_add_artifact_attr_param._under = attr_ctx
        attr_ctx_op_add_artifact_attr_param._type = CdmAttributeContextType.OPERATION_ADD_ARTIFACT_ATTRIBUTE
        attr_ctx_op_add_artifact_attr_param._name = 'operation/index{}/{}'.format(self._index, self.get_name())
        attr_ctx_op_add_artifact_attr = CdmAttributeContext._create_child_under(proj_ctx._projection_directive._res_opt, attr_ctx_op_add_artifact_attr_param)

        from cdm.objectmodel import CdmTypeAttributeDefinition, CdmEntityAttributeDefinition, CdmAttributeGroupReference
        if isinstance(self.new_attribute, CdmTypeAttributeDefinition):
            # Create a new attribute context for the new artifact attribute we will create
            attr_ctx_new_attr_param = AttributeContextParameters()
            attr_ctx_new_attr_param._under = attr_ctx_op_add_artifact_attr
            attr_ctx_new_attr_param._type = CdmAttributeContextType.ADDED_ATTRIBUTE_NEW_ARTIFACT
            attr_ctx_new_attr_param._name = self.new_attribute.fetch_object_definition_name()
            attr_ctx_new_attr = CdmAttributeContext._create_child_under(proj_ctx._projection_directive._res_opt, attr_ctx_new_attr_param)
            new_res_attr = self._create_new_resolved_attribute(proj_ctx, attr_ctx_new_attr, self.new_attribute)

            # Create a new projection attribute state for the new artifact attribute and add it to the output set
            # There is no previous state for the newly created attribute
            new_PAS = ProjectionAttributeState(self.ctx)
            new_PAS._current_resolved_attribute = new_res_attr
            proj_output_set._add(new_PAS)

        elif isinstance(self.new_attribute, CdmEntityAttributeDefinition) or isinstance(self.new_attribute, CdmAttributeGroupReference):
            type_str = 'an entity attribute' if isinstance(self.new_attribute, CdmEntityAttributeDefinition) else 'an attribute group'
            logger.warning(self.ctx, self._TAG, CdmOperationAddArtifactAttribute._append_projection_attribute_state.__name__,
                           self.at_corpus_path, CdmLogCode.WARN_PROJ_ADD_ARTIFACT_ATTR_NOT_SUPPORTED, type_str)

        else:
            logger.error(self.ctx, self._TAG, CdmOperationAddArtifactAttribute._append_projection_attribute_state.__name__,
                         self.at_corpus_path, CdmLogCode.ERR_PROJ_UNSUPPORTED_SOURCE, str(self.new_attribute.object_type), self.get_name())

        return proj_output_set

    def _add_all_previous_attribute_states(self, proj_ctx: 'ProjectionContext', proj_output_set: 'ProjectionAttributeStateSet'):
        """
        Pass through all the input projection attribute states if there are any.
        """
        # Pass through all the input projection attribute states if there are any
        for current_PAS in proj_ctx._current_attribute_state_set._states:
            proj_output_set._add(current_PAS)
