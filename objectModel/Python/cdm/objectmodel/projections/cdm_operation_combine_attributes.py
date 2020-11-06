# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
from collections import OrderedDict
from typing import Optional, TYPE_CHECKING, List

from cdm.enums import CdmObjectType, CdmOperationType, CdmAttributeContextType
from cdm.objectmodel import CdmAttributeContext
from cdm.utilities import logger, Errors, AttributeContextParameters

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

        self.select = []  # type: List[str]
        self.merge_into = None
        self.type = CdmOperationType.COMBINE_ATTRIBUTES  # type: CdmOperationType

        # --- internal ---
        self._TAG = CdmOperationCombineAttributes.__name__

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmOperationCombineAttributes'] = None) -> 'CdmOperationCombineAttributes':
        copy = CdmOperationCombineAttributes(self.ctx)
        if self.apply_to is not None:
            copy.select = self.select[:]
        if self.merge_into is not None:
            copy.merge_into = self.merge_into.copy(res_opt, host)   # type: CdmTypeAttributeDefinition
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
            logger.error(self._TAG, self.ctx, Errors.validate_error_string(self.at_corpus_path, missing_fields))
            return False

        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = ''
        if not self.ctx.corpus._block_declared_path_changes:
            path = self._declared_path
            if not path:
                path = path_from + 'operationCombineAttributes'
                self._declared_path = path

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
        leaf_level_combine_attribute_names =  OrderedDict() # OrderedDict[str, ProjectionAttributeState[]]()
        # Also, create a single list of leaf level PAS to add to the 'is.linkedEntity.identifier' trait parameter
        leaf_level_merge_pas_list = []  # type: List[ProjectionAttributeState]
        for select in self.select:
            leaf_level_list_for_current_select = ProjectionResolutionCommonUtil._get_leaf_list(proj_ctx, select)  # type: List[ProjectionAttributeState]
            if leaf_level_list_for_current_select is not None and len(leaf_level_list_for_current_select) > 0 and not(select in leaf_level_combine_attribute_names):
                leaf_level_combine_attribute_names.__setitem__(select, leaf_level_list_for_current_select)

                leaf_level_merge_pas_list.extend(leaf_level_list_for_current_select)

        # Create a List of top-level PAS objects that will be get merged based on the selected attributes
        pas_merge_list = []  # type: List[ProjectionAttributeState]

        # Run through the top-level PAS objects 
        for current_pas in proj_ctx._current_attribute_state_set._states:
            if (proj_ctx._projection_directive._owner_type is CdmObjectType.ENTITY_DEF or proj_ctx._projection_directive._is_source_polymorphic) and (current_pas._current_resolved_attribute._resolved_name in leaf_level_combine_attribute_names):
                # Attribute to Merge

                if not(pas_merge_list.__contains__(current_pas)):
                    pas_merge_list.append(current_pas)
            else:
                # Attribute to Pass Through

                # Create a projection attribute state for the non-selected / pass-through attribute by creating a copy of the current state
                # Copy() sets the current state as the previous state for the new one
                new_pas = current_pas._copy()  # type: ProjectionAttributeState

                proj_attr_state_set._add(new_pas)

        if len(pas_merge_list) > 0:
            merge_into_attribute = self.merge_into  # type: CdmTypeAttributeDefinition
            add_trait = [ 'is.linkedEntity.identifier' ]

            # Create new resolved attribute, set the new attribute as target, and apply 'is.linkedEntity.identifier' trait
            ra_new_merge_into = self._create_new_resolved_attribute(proj_ctx, attr_ctx_op_combine_attrs, merge_into_attribute, None, add_trait)  # type: ResolvedAttribute

            # update the new foreign key resolved attribute with trait param with reference details
            reqd_trait = ra_new_merge_into.resolved_traits.find(proj_ctx._projection_directive._res_opt, 'is.linkedEntity.identifier')  # type: ResolvedTrait
            if reqd_trait is not None:
                trait_param_ent_ref = ProjectionResolutionCommonUtil._create_foreign_key_linked_entity_identifier_trait_parameter(proj_ctx._projection_directive, proj_attr_state_set._ctx.corpus, leaf_level_merge_pas_list)  # type: CdmEntityReference
                reqd_trait.parameter_values.update_parameter_value(proj_ctx._projection_directive._res_opt, 'entityReferences', trait_param_ent_ref)

            # Create new output projection attribute state set for FK and add prevPas as previous state set
            new_merge_into_pas = ProjectionAttributeState(proj_attr_state_set._ctx)  # type: ProjectionAttributeState
            new_merge_into_pas._current_resolved_attribute = ra_new_merge_into
            new_merge_into_pas._previous_state_list = pas_merge_list

            # Create the attribute context parameters and just store it in the builder for now
            # We will create the attribute contexts at the end
            for select in leaf_level_combine_attribute_names.keys():
                if select in leaf_level_combine_attribute_names and leaf_level_combine_attribute_names[select] is not None and len(leaf_level_combine_attribute_names[select]) > 0:
                    for leaf_level_for_select in leaf_level_combine_attribute_names[select]:
                        attr_ctx_tree_builder._create_and_store_attribute_context_parameters(select, leaf_level_for_select, new_merge_into_pas._current_resolved_attribute, CdmAttributeContextType.ATTRIBUTE_DEFINITION)

            proj_attr_state_set._add(new_merge_into_pas)

        # Create all the attribute contexts and construct the tree
        attr_ctx_tree_builder._construct_attribute_context_tree(proj_ctx, True)

        return proj_attr_state_set
