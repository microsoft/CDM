# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, List

from cdm.enums import CdmObjectType, CdmOperationType, CdmAttributeContextType
from cdm.objectmodel import CdmCorpusContext, CdmAttributeContext
from cdm.resolvedmodel.projections.projection_attribute_context_tree_builder import ProjectionAttributeContextTreeBuilder
from cdm.resolvedmodel.projections.projection_attribute_state import ProjectionAttributeState
from cdm.resolvedmodel.projections.projection_attribute_state_set import ProjectionAttributeStateSet
from cdm.resolvedmodel.projections.projection_context import ProjectionContext
from cdm.resolvedmodel.projections.projection_resolution_common_util import ProjectionResolutionCommonUtil
from cdm.utilities import logger, AttributeContextParameters, VisitCallback, ResolveOptions
from .cdm_operation_base import CdmOperationBase
from cdm.enums import CdmLogCode
from cdm.utilities.string_utils import StringUtils


class CdmOperationIncludeAttributes(CdmOperationBase):
    """Class to handle IncludeAttributes operations"""

    def __init__(self, ctx: 'CdmCorpusContext') -> None:
        super().__init__(ctx)

        self._TAG = CdmOperationIncludeAttributes.__name__
        self.include_attributes = []  # type: List[str]
        self.type = CdmOperationType.INCLUDE_ATTRIBUTES  # type: CdmOperationType

    def copy(self, res_opt: Optional['ResolveOptions'] = None,
             host: Optional['CdmOperationIncludeAttributes'] = None) -> 'CdmOperationIncludeAttributes':
        copy = CdmOperationIncludeAttributes(self.ctx)
        copy.include_attributes = self.include_attributes[:]
        return copy

    def get_name(self) -> str:
        return 'operationIncludeAttributes'

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.OPERATION_INCLUDE_ATTRIBUTES_DEF

    def validate(self) -> bool:
        missing_fields = []

        if not bool(self.include_attributes):
            missing_fields.append('includeAttributes')

        if len(missing_fields) > 0:
            logger.error(self.ctx, self._TAG, 'validate', self.at_corpus_path, CdmLogCode.ERR_VALDN_INTEGRITY_CHECK_FAILURE, self.at_corpus_path, ', '.join(map(lambda s: '\'' + s + '\'', missing_fields)))
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
        # Create a new attribute context for the operation
        attr_ctx_op_include_attrs_param = AttributeContextParameters()  # type: AttributeContextParameters
        attr_ctx_op_include_attrs_param._under = attr_ctx
        attr_ctx_op_include_attrs_param._type = CdmAttributeContextType.OPERATION_INCLUDE_ATTRIBUTES
        attr_ctx_op_include_attrs_param._name = 'operation/index{}/operationIncludeAttributes'.format(self._index)

        attr_ctx_op_include_attrs = CdmAttributeContext._create_child_under(
            proj_ctx._projection_directive._res_opt, attr_ctx_op_include_attrs_param)  # type: CdmAttributeContext

        # Get the top-level attribute names for each of the included attributes
        # Since the include operation allows providing either current state resolved attribute names
        #   or the previous state resolved attribute names, we search for the name in the PAS tree
        #   and fetch the top level resolved attribute names.
        top_level_include_attribute_names = ProjectionResolutionCommonUtil._get_top_list(proj_ctx, self.include_attributes)  # type: Dict[str, str]

        # Initialize a projection attribute context tree builder with the created attribute context for the operation
        attr_ctx_tree_builder = ProjectionAttributeContextTreeBuilder(attr_ctx_op_include_attrs)

        # Iterate through all the PAS in the PASSet generated from the projection source's resolved attributes
        for current_PAS in proj_ctx._current_attribute_state_set._states:
            # Check if the current PASs RA is in the list of attributes to include.
            if current_PAS._current_resolved_attribute.resolved_name in top_level_include_attribute_names:
                # Get the attribute name the way it appears in the include list
                include_attribute_name = top_level_include_attribute_names[current_PAS._current_resolved_attribute.resolved_name]  # type: str

                # Create the attribute context parameters and just store it in the builder for now
                # We will create the attribute contexts at the end
                attr_ctx_tree_builder._create_and_store_attribute_context_parameters(
                    include_attribute_name, current_PAS, current_PAS._current_resolved_attribute,
                    CdmAttributeContextType.ATTRIBUTE_DEFINITION,
                    current_PAS._current_resolved_attribute.att_ctx,  # lineage is the included attribute
                    None)  # don't know who will point here yet

                # Create a projection attribute state for the included attribute by creating a copy of the current state
                # Copy() sets the current state as the previous state for the new one
                # We only create projection attribute states for attributes in the include list
                new_PAS = current_PAS._copy()

                proj_attr_state_set._add(new_PAS)
            else:
                # Create the attribute context parameters and just store it in the builder for now
                # We will create the attribute contexts at the end
                attr_ctx_tree_builder._create_and_store_attribute_context_parameters(
                    None, current_PAS, current_PAS._current_resolved_attribute,
                    CdmAttributeContextType.ATTRIBUTE_DEFINITION,
                    current_PAS._current_resolved_attribute.att_ctx,  # lineage is the excluded attribute
                    None)  # don't know who will point here, probably nobody, I mean, we got excluded

        # Create all the attribute contexts and construct the tree
        attr_ctx_tree_builder._construct_attribute_context_tree(proj_ctx)

        return proj_attr_state_set
