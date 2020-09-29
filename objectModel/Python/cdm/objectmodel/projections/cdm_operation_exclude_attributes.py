# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING, List

from cdm.enums import CdmAttributeContextType, CdmObjectType, CdmOperationType
from cdm.objectmodel import CdmAttributeContext
from cdm.resolvedmodel.projections.projection_attribute_context_tree_builder import ProjectionAttributeContextTreeBuilder
from cdm.resolvedmodel.projections.projection_attribute_state import ProjectionAttributeState
from cdm.resolvedmodel.projections.projection_resolution_common_util import ProjectionResolutionCommonUtil
from cdm.utilities import AttributeContextParameters, Errors, logger

from .cdm_operation_base import CdmOperationBase

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext
    from cdm.resolvedmodel.projections.projection_attribute_state_set import ProjectionAttributeStateSet
    from cdm.resolvedmodel.projections.projection_context import ProjectionContext
    from cdm.utilities import VisitCallback, ResolveOptions


class CdmOperationExcludeAttributes(CdmOperationBase):
    """Class to handle ExcludeAttributes operations"""

    def __init__(self, ctx: 'CdmCorpusContext') -> None:
        super().__init__(ctx)

        self.exclude_attributes = []  # type: List[str]
        self.type = CdmOperationType.EXCLUDE_ATTRIBUTES  # type: CdmOperationType

        # --- internal ---
        self._TAG = CdmOperationExcludeAttributes.__name__

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmOperationExcludeAttributes'] = None) -> 'CdmOperationExcludeAttributes':
        copy = CdmOperationExcludeAttributes(self.ctx)
        copy.exclude_attributes = self.exclude_attributes[:]
        return copy

    def get_name(self) -> str:
        return 'operationExcludeAttributes'

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.OPERATION_EXCLUDE_ATTRIBUTES_DEF

    def validate(self) -> bool:
        missing_fields = []

        if self.exclude_attributes is None:
            missing_fields.append('exclude_attributes')

        if len(missing_fields) > 0:
            logger.error(self._TAG, self.ctx, Errors.validate_error_string(self.at_corpus_path, missing_fields))
            return False

        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = ''
        if not self.ctx.corpus._block_declared_path_changes:
            path = self._declared_path
            if not path:
                path = path_from + 'operationExcludeAttributes'
                self._declared_path = path

        if pre_children and pre_children(self, path):
            return False

        if post_children and post_children(self, path):
            return True

        return False

    def _append_projection_attribute_state(self, proj_ctx: 'ProjectionContext', proj_output_set: 'ProjectionAttributeStateSet', attr_ctx: 'CdmAttributeContext') -> 'ProjectionAttributeStateSet':
        # Create a new attribute context for the operation
        attr_ctx_op_exclude_attrs_param = AttributeContextParameters()
        attr_ctx_op_exclude_attrs_param._under = attr_ctx
        attr_ctx_op_exclude_attrs_param._type = CdmAttributeContextType.OPERATION_EXCLUDE_ATTRIBUTES
        attr_ctx_op_exclude_attrs_param._name = 'operation/index{}/operationExcludeAttributes'.format(self._index)
        attr_ctx_op_exclude_attrs = CdmAttributeContext._create_child_under(proj_ctx._projection_directive._res_opt, attr_ctx_op_exclude_attrs_param)

        # Get the top-level attribute names of the attributes to exclude
        # We use the top-level names because the exclude list may contain a previous name our current resolved attributes had
        top_level_exclude_attribute_names = ProjectionResolutionCommonUtil._get_top_list(proj_ctx, self.exclude_attributes)

        # Initialize a projection attribute context tree builder with the created attribute context for the operation
        attr_ctx_tree_builder = ProjectionAttributeContextTreeBuilder(attr_ctx_op_exclude_attrs)

        # Iterate through all the projection attribute states generated from the source's resolved attributes
        # Each projection attribute state contains a resolved attribute that it is corresponding to
        for current_PAS in proj_ctx._current_attribute_state_set._states:
            # Check if the current projection attribute state's resolved attribute is in the list of attributes to exclude
            # If this attribute is not in the exclude list, then we are including it in the output
            if current_PAS._current_resolved_attribute.resolved_name not in top_level_exclude_attribute_names:
                # Create the attribute context parameters and just store it in the builder for now
                # We will create the attribute contexts at the end
                attr_ctx_tree_builder._create_and_store_attribute_context_parameters(None, current_PAS, current_PAS._current_resolved_attribute, CdmAttributeContextType.ATTRIBUTE_DEFINITION)

                # Create a projection attribute state for the included attribute by creating a copy of the current state
                # Copy() sets the current state as the previous state for the new one
                # We only create projection attribute states for attributes that are not in the exclude list
                new_PAS = current_PAS._copy()

                proj_output_set._add(new_PAS)
            else:
                # The current projection attribute state's resolved attribute is in the exclude list

                # Get the attribute name the way it appears in the exclude list
                exclude_attribute_name = top_level_exclude_attribute_names[current_PAS._current_resolved_attribute.resolved_name]

                # Create the attribute context parameters and just store it in the builder for now
                # We will create the attribute contexts at the end
                attr_ctx_tree_builder._create_and_store_attribute_context_parameters(exclude_attribute_name, current_PAS, current_PAS._current_resolved_attribute, CdmAttributeContextType.ATTRIBUTE_DEFINITION)

        # Create all the attribute contexts and construct the tree
        attr_ctx_tree_builder._construct_attribute_context_tree(proj_ctx)

        return proj_output_set
