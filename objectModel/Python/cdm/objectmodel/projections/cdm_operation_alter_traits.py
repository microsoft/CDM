# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING, cast


from cdm.enums import CdmLogCode
from cdm.enums import CdmAttributeContextType, CdmObjectType, CdmOperationType
from cdm.objectmodel import CdmAttributeContext, CdmAttribute
from cdm.resolvedmodel import ResolvedAttributeSet, ResolvedAttribute, ResolvedTraitSet, ParameterValueSet
from cdm.resolvedmodel.projections.projection_attribute_state import ProjectionAttributeState
from cdm.resolvedmodel.projections.projection_resolution_common_util import ProjectionResolutionCommonUtil
from cdm.utilities import AttributeContextParameters, logger

from .cdm_operation_base import CdmOperationBase

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmTraitReferenceBase
    from cdm.resolvedmodel.projections.projection_attribute_state_set import ProjectionAttributeStateSet
    from cdm.resolvedmodel.projections.projection_context import ProjectionContext
    from cdm.utilities import VisitCallback, ResolveOptions


class CdmOperationAlterTraits(CdmOperationBase):
    """Class to handle AlterTraits operations"""

    def __init__(self, ctx: 'CdmCorpusContext') -> None:
        super().__init__(ctx)

        self._TAG = CdmOperationAlterTraits.__name__
        self.traits_to_add = None  # type: List[CdmTraitReferenceBase]
        self.traits_to_remove = None  # type: List[CdmTraitReferenceBase]
        self.arguments_contain_wildcards = None  # type: Optional[bool]
        self.apply_to = None  # type: List[str]
        self.type = CdmOperationType.ALTER_TRAITS  # type: CdmOperationType

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmOperationAlterTraits'] = None) -> 'CdmOperationAlterTraits':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        copy = CdmOperationAlterTraits(self.ctx) if not host else host

        traits_to_add = []
        if self.traits_to_add is not None:
            for trait in self.traits_to_add:
                traits_to_add.append(cast(CdmTraitReferenceBase, trait.copy(res_opt)))

        traits_to_remove = []
        if self.traits_to_remove is not None:
            for trait in self.traits_to_remove:
                traits_to_remove.append(cast(CdmTraitReferenceBase, trait.copy(res_opt)))

        if self.apply_to is not None:
            copy.apply_to = self.apply_to.copy()

        copy.traits_to_add = traits_to_add
        copy.traits_to_remove = traits_to_remove
        copy.arguments_contain_wildcards = self.arguments_contain_wildcards

        self._copy_proj(res_opt, copy)
        return copy

    def get_name(self) -> str:
        return 'operationAlterTraits'

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.OPERATION_ALTER_TRAITS_DEF

    def validate(self) -> bool:
        missing_fields = []

        # Need to have either traitsToAdd or traitsToRemove
        if not bool(self.traits_to_add) and not bool(self.traits_to_remove):
            missing_fields.append('traits_to_add')
            missing_fields.append('traits_to_remove')

        if len(missing_fields) > 0:
            logger.error(self.ctx, self._TAG, 'validate', self.at_corpus_path, CdmLogCode.ERR_VALDN_INTEGRITY_CHECK_FAILURE,
                         self.at_corpus_path, ', '.join(map(lambda s: '\'' + s + '\'', missing_fields)))
            return False

        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = ''
        if not self.ctx.corpus._block_declared_path_changes:
            path = self._declared_path
            if not path:
                path = path_from + self.get_name()
                self._declared_path = path

        if pre_children and pre_children(self, path):
            return False

        if post_children and post_children(self, path):
            return True

        return False

    def _append_projection_attribute_state(self, proj_ctx: 'ProjectionContext', proj_output_set: 'ProjectionAttributeStateSet', \
                                           attr_ctx: 'CdmAttributeContext') -> 'ProjectionAttributeStateSet':
        # Create a new attribute context for the operation
        attr_ctx_op_alter_traits_param = AttributeContextParameters()
        attr_ctx_op_alter_traits_param._under = attr_ctx
        attr_ctx_op_alter_traits_param._type = CdmAttributeContextType.OPERATION_ALTER_TRAITS
        attr_ctx_op_alter_traits_param._name = 'operation/index{}/{}'.format(self._index, self.get_name())
        attr_ctx_op_alter_traits = CdmAttributeContext._create_child_under(proj_ctx._projection_directive._res_opt, attr_ctx_op_alter_traits_param)

        # Get the top-level attribute names of the selected attributes to apply
        # We use the top-level names because the applyTo list may contain a previous name our current resolved attributes had
        top_level_selected_attribute_names = ProjectionResolutionCommonUtil._get_top_list(proj_ctx, self.apply_to) if self.apply_to is not None else None  # type: Dict[str, str]

        # Iterate through all the PAS in the PASSet generated from the projection source's resolved attributes
        for current_PAS in proj_ctx._current_attribute_state_set._states:
            # Check if the current projection attribute state's resolved attribute is in the list of selected attributes
            # If this attribute is not in the list, then we are including it in the output without changes
            if top_level_selected_attribute_names is None or current_PAS._current_resolved_attribute.resolved_name in top_level_selected_attribute_names:

                # Create a new attribute context for the new artifact attribute we will create
                attr_ctx_new_attr_param = AttributeContextParameters()
                attr_ctx_new_attr_param._under = attr_ctx_op_alter_traits
                attr_ctx_new_attr_param._type = CdmAttributeContextType.ATTRIBUTE_DEFINITION
                attr_ctx_new_attr_param._name = current_PAS._current_resolved_attribute.resolved_name
                attr_ctx_new_attr = CdmAttributeContext._create_child_under(proj_ctx._projection_directive._res_opt, attr_ctx_new_attr_param)

                new_res_attr = None

                if isinstance(current_PAS._current_resolved_attribute.target, ResolvedAttributeSet):
                    # Attribute group
                    # Create a copy of resolved attribute set
                    res_attr_new_copy = current_PAS._current_resolved_attribute.target.copy()
                    new_res_attr = ResolvedAttribute(proj_ctx._projection_directive._res_opt, res_attr_new_copy, current_PAS._current_resolved_attribute.resolved_name, attr_ctx_new_attr)

                    # the resolved attribute group obtained from previous projection operation may have a different set of traits comparing to the resolved attribute target.
                    #  We would want to take the set of traits from the resolved attribute.
                    new_res_attr.resolved_traits = current_PAS._current_resolved_attribute.resolved_traits.deep_copy()

                elif isinstance(current_PAS._current_resolved_attribute.target, CdmAttribute):
                    # Entity Attribute or Type Attribute
                    new_res_attr = self._create_new_resolved_attribute(proj_ctx, attr_ctx_new_attr, current_PAS._current_resolved_attribute, current_PAS._current_resolved_attribute.resolved_name)

                else:
                    logger.error(self.ctx, self._TAG, CdmOperationAlterTraits._append_projection_attribute_state.__name__,
                                 self.at_corpus_path, CdmLogCode.ERR_PROJ_UNSUPPORTED_SOURCE, str(current_PAS._current_resolved_attribute.object_type), self.get_name())
                    proj_output_set._add(current_PAS)
                    break

                new_res_attr.resolved_traits = new_res_attr.resolved_traits.merge_set(self._resolved_new_traits(proj_ctx, current_PAS))
                self._remove_traits_in_new_attribute(proj_ctx._projection_directive._res_opt, new_res_attr)

                # Create a projection attribute state for the new attribute with new applied traits by creating a copy of the current state
                # Copy() sets the current state as the previous state for the new one
                new_PAS = current_PAS._copy()

                # Update the resolved attribute to be the new attribute we created
                new_PAS._current_resolved_attribute = new_res_attr

                proj_output_set._add(new_PAS)

            else:
                # Pass through
                proj_output_set._add(current_PAS)

        return proj_output_set


    def _resolved_new_traits(self, proj_ctx: 'ProjectionContext', current_PAS: 'ProjectionAttributeState'):
        resolved_trait_set = ResolvedTraitSet(proj_ctx._projection_directive._res_opt)
        base_attribute_name = proj_ctx._projection_directive._original_source_entity_attribute_name or proj_ctx._projection_directive._owner.get_name() or ''
        ordinal = str(current_PAS._ordinal) if current_PAS._ordinal else ''
        current_attribute_name = current_PAS._current_resolved_attribute.target.name if isinstance(current_PAS._current_resolved_attribute.target, CdmAttribute) else '' or ''

        for trait_ref in self.traits_to_add:
            trait_ref_copy = trait_ref._fetch_resolved_traits(proj_ctx._projection_directive._res_opt).deep_copy()
            self._replace_wildcard_characters(proj_ctx._projection_directive._res_opt, trait_ref_copy, base_attribute_name, ordinal, current_attribute_name)
            resolved_trait_set = resolved_trait_set.merge_set(trait_ref_copy)

        return resolved_trait_set

    def _replace_wildcard_characters(self, res_opt: 'ResolveOptions', resolved_trait_set: ResolvedTraitSet, base_attribute_name: str, ordinal: str,  current_attribute_name: str) -> None:
        if self.arguments_contain_wildcards is not None and self.arguments_contain_wildcards is True:
            for resolved_trait in resolved_trait_set.rt_set:
                parameter_value_set = resolved_trait.parameter_values  # type: ParameterValueSet
                for i in range(parameter_value_set.length):
                    value = parameter_value_set.fetch_value(i)
                    if isinstance(value, str):
                        new_val = super()._replace_wildcard_characters(value, base_attribute_name, ordinal, current_attribute_name)
                        if new_val != value:
                            parameter_value_set.update_parameter_value(res_opt, parameter_value_set.fetch_parameter_at_index(i).get_name(), new_val)


    def _remove_traits_in_new_attribute(self, res_opt: 'ResolveOptions', new_res_attr: 'ResolvedAttribute') -> None:
        """
        Remove traits from the new resolved attribute.
        """
        trait_names_to_remove = set()
        if self.traits_to_remove is not None:
            for trait_ref in self.traits_to_remove:
                resolved_trait_set = trait_ref._fetch_resolved_traits(res_opt).deep_copy()  # type: ResolvedTraitSet
                for rt in resolved_trait_set.rt_set:
                    trait_names_to_remove.add(rt.trait_name)

            for trait_name in trait_names_to_remove:
                new_res_attr.resolved_traits.remove(res_opt, trait_name)

