# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING, List

from cdm.enums import CdmAttributeContextType, CdmObjectType, CdmOperationType
from cdm.objectmodel import CdmAttributeContext
from cdm.resolvedmodel.projections.projection_attribute_context_tree_builder import ProjectionAttributeContextTreeBuilder
from cdm.resolvedmodel.projections.projection_attribute_state import ProjectionAttributeState
from cdm.resolvedmodel.projections.projection_resolution_common_util import ProjectionResolutionCommonUtil
from cdm.utilities import AttributeContextParameters, logger
from cdm.enums import CdmLogCode
from cdm.utilities.string_utils import StringUtils

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

        self._TAG = CdmOperationExcludeAttributes.__name__
        self.type = CdmOperationType.EXCLUDE_ATTRIBUTES  # type: CdmOperationType

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmOperationExcludeAttributes'] = None) -> 'CdmOperationExcludeAttributes':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        copy = CdmOperationExcludeAttributes(self.ctx) if not host else host

        if self.exclude_attributes is not None:
            copy.exclude_attributes = self.exclude_attributes.copy()

        self._copy_proj(res_opt, copy)
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
                attr_ctx_tree_builder._create_and_store_attribute_context_parameters(
                    None, current_PAS, current_PAS._current_resolved_attribute,
                    CdmAttributeContextType.ATTRIBUTE_DEFINITION,
                    current_PAS._current_resolved_attribute.att_ctx,  # lineage is the included attribute
                    None)  # don't know who will point here yet

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
                attr_ctx_tree_builder._create_and_store_attribute_context_parameters(
                    exclude_attribute_name, current_PAS, current_PAS._current_resolved_attribute,
                    CdmAttributeContextType.ATTRIBUTE_EXCLUDED,
                    current_PAS._current_resolved_attribute.att_ctx,  # lineage is the included attribute
                    None)  # don't know who will point here yet, excluded, so... this could be the end for you.

        # Create all the attribute contexts and construct the tree
        attr_ctx_tree_builder._construct_attribute_context_tree(proj_ctx)

        return proj_output_set