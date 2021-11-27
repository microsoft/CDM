# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
from collections import OrderedDict
from typing import Optional, TYPE_CHECKING, List

from cdm.enums import CdmObjectType, CdmOperationType, CdmAttributeContextType
from cdm.objectmodel import CdmAttributeContext
from cdm.utilities import logger, AttributeContextParameters
from cdm.enums import CdmLogCode
from cdm.utilities.string_utils import StringUtils

from .cdm_operation_base import CdmOperationBase
from ...resolvedmodel import ResolvedAttribute, ResolvedTrait
from ...resolvedmodel.projections.projection_attribute_context_tree_builder import ProjectionAttributeContextTreeBuilder
from ...resolvedmodel.projections.projection_attribute_state import ProjectionAttributeState
from ...resolvedmodel.projections.projection_resolution_common_util import ProjectionResolutionCommonUtil

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmTypeAttributeDefinition, CdmAttributeContext, CdmEntityReference
    from cdm.resolvedmodel.projections.projection_attribute_state_set import ProjectionAttributeStateSet
    from cdm.resolvedmodel.projections.projection_context import ProjectionContext
    from cdm.utilities import VisitCallback, ResolveOptions


class CdmOperationCombineAttributes(CdmOperationBase):
    """Class to handle CombineAttributes operations"""

    def __init__(self, ctx: 'CdmCorpusContext') -> None:
        super().__init__(ctx)

        self._TAG = CdmOperationCombineAttributes.__name__
        self.select = []  # type: List[str]
        self.merge_into = None
        self.type = CdmOperationType.COMBINE_ATTRIBUTES  # type: CdmOperationType

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmOperationCombineAttributes'] = None) -> 'CdmOperationCombineAttributes':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        copy = CdmOperationCombineAttributes(self.ctx) if not host else host

        if self.select is not None:
            copy.select = self.select.copy()
        copy.merge_into = self.merge_into.copy(res_opt) if self.merge_into else None

        self._copy_proj(res_opt, copy)
        return copy

    def get_name(self) -> str:
        return 'operationCombineAttributes'

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.OPERATION_COMBINE_ATTRIBUTES_DEF

    def validate(self) -> bool:
        missing_fields = []

        if self.select is None:
            missing_fields.append('select')

        if not (self.merge_into):
            missing_fields.append('merge_into')

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

    def _append_projection_attribute_state(self, proj_ctx: 'ProjectionContext', proj_attr_state_set: 'ProjectionAttributeStateSet', attr_ctx: 'CdmAttributeContext') -> 'ProjectionAttributeStateSet':
        # Create a new attribute context for the operation
        attr_ctx_op_combine_attrs_param = AttributeContextParameters()  # type: AttributeContextParameters
        attr_ctx_op_combine_attrs_param._under = attr_ctx
        attr_ctx_op_combine_attrs_param._type = CdmAttributeContextType.OPERATION_COMBINE_ATTRIBUTES
        attr_ctx_op_combine_attrs_param._name = 'operation/index{}/operationCombineAttributes'.format(self._index)

        attr_ctx_op_combine_attrs = CdmAttributeContext._create_child_under(proj_ctx._projection_directive._res_opt, attr_ctx_op_combine_attrs_param)  # type: CdmAttributeContext

        # Initialize a projection attribute context tree builder with the created attribute context for the operation
        attr_ctx_tree_builder = ProjectionAttributeContextTreeBuilder(attr_ctx_op_combine_attrs)

        # Get all the leaf level PAS nodes from the tree for each selected attribute and cache to a dictionary
        leaf_level_combine_attribute_names = OrderedDict() # OrderedDict[str, ProjectionAttributeState[]]()
        # Also, create a single list of leaf level PAS
        leaf_level_merge_pas_list = []  # type: List[ProjectionAttributeState]
        for select in self.select:
            leaf_level_list_for_current_select = ProjectionResolutionCommonUtil._get_leaf_list(proj_ctx, select)  # type: List[ProjectionAttributeState]
            if leaf_level_list_for_current_select is not None and len(leaf_level_list_for_current_select) > 0 and not(select in leaf_level_combine_attribute_names):
                leaf_level_combine_attribute_names.__setitem__(select, leaf_level_list_for_current_select)

                leaf_level_merge_pas_list.extend(leaf_level_list_for_current_select)

        # Create a list of top-level PAS objects that will be get merged based on the selected attributes
        pas_merge_list = []  # type: List[ProjectionAttributeState]

        # Run through the top-level PAS objects 
        for current_pas in proj_ctx._current_attribute_state_set._states:
            if current_pas._current_resolved_attribute._resolved_name in leaf_level_combine_attribute_names:
                # Attribute to Merge

                if current_pas not in pas_merge_list:
                    pas_merge_list.append(current_pas)
            else:
                # Attribute to Pass Through

                # Create a projection attribute state for the non-selected / pass-through attribute by creating a copy of the current state
                # Copy() sets the current state as the previous state for the new one
                new_pas = current_pas._copy()  # type: ProjectionAttributeState

                proj_attr_state_set._add(new_pas)

        if len(pas_merge_list) > 0:
            merge_into_attribute = self.merge_into  # type: CdmTypeAttributeDefinition

            # the merged attribute needs one new place to live, so here it is
            merged_attr_ctx_param = AttributeContextParameters()  # type: AttributeContextParameters
            merged_attr_ctx_param._under = attr_ctx_op_combine_attrs
            merged_attr_ctx_param._type = CdmAttributeContextType.ATTRIBUTE_DEFINITION
            merged_attr_ctx_param._name = merge_into_attribute.get_name()

            merged_attr_ctx = CdmAttributeContext._create_child_under(proj_ctx._projection_directive._res_opt, merged_attr_ctx_param)

            # Create new resolved attribute, set the new attribute as target
            ra_new_merge_into = self._create_new_resolved_attribute(proj_ctx, merged_attr_ctx, merge_into_attribute, None)

            # Create new output projection attribute state set
            new_merge_into_pas = ProjectionAttributeState(proj_attr_state_set._ctx)  # type: ProjectionAttributeState
            new_merge_into_pas._current_resolved_attribute = ra_new_merge_into
            new_merge_into_pas._previous_state_list = pas_merge_list

            attributes_added_to_context = set()

            # Create the attribute context parameters and just store it in the builder for now
            # We will create the attribute contexts at the end
            for select in leaf_level_combine_attribute_names.keys():
                if select in leaf_level_combine_attribute_names and leaf_level_combine_attribute_names[select] is not None and len(leaf_level_combine_attribute_names[select]) > 0:
                    for leaf_level_for_select in leaf_level_combine_attribute_names[select]:
                        # When dealing with a polymorphic entity, it is possible that multiple entities have an attribute with the same name
                        # Only one attribute with each name should be added otherwise the attribute context will end up with duplicated nodes
                        if leaf_level_for_select._current_resolved_attribute._resolved_name not in attributes_added_to_context:
                            attributes_added_to_context.add(leaf_level_for_select._current_resolved_attribute._resolved_name)
                            attr_ctx_tree_builder._create_and_store_attribute_context_parameters(
                                select, leaf_level_for_select, new_merge_into_pas._current_resolved_attribute,
                                CdmAttributeContextType.ATTRIBUTE_DEFINITION,
                                leaf_level_for_select._current_resolved_attribute.att_ctx,  # lineage is the source att
                                new_merge_into_pas._current_resolved_attribute.att_ctx)  # merge into points back here

            proj_attr_state_set._add(new_merge_into_pas)

        # Create all the attribute contexts and construct the tree
        attr_ctx_tree_builder._construct_attribute_context_tree(proj_ctx)

        return proj_attr_state_set
