# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List, Optional, TYPE_CHECKING, cast


from cdm.enums import CdmLogCode
from cdm.enums import CdmAttributeContextType, CdmObjectType, CdmOperationType
from cdm.objectmodel import CdmAttributeContext, CdmAttribute, CdmCollection 
from cdm.resolvedmodel import ResolvedAttributeSet, ResolvedAttribute, ResolvedTraitSet, ParameterValueSet
from cdm.resolvedmodel.projections.projection_attribute_state import ProjectionAttributeState
from cdm.resolvedmodel.projections.projection_attribute_state_set import ProjectionAttributeStateSet
from cdm.resolvedmodel.projections.projection_resolution_common_util import ProjectionResolutionCommonUtil
from cdm.resolvedmodel import TraitProfileCache
from cdm.utilities import AttributeContextParameters, logger

from .cdm_operation_base import CdmOperationBase

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmTraitReferenceBase, CdmTraitReference 
    from cdm.resolvedmodel.projections.projection_context import ProjectionContext
    from cdm.utilities import VisitCallback, ResolveOptions

class CdmOperationAlterTraits(CdmOperationBase):
    """Class to handle AlterTraits operations"""

    def __init__(self, ctx: 'CdmCorpusContext') -> None:
        super().__init__(ctx)

        self._TAG = CdmOperationAlterTraits.__name__
        # this cache is for all the traits we might get profiles about. because once is enough
        self.prof_cache = TraitProfileCache() # type: TraitProfileCache

        self.traits_to_add = None  # type: CdmCollection[CdmTraitReferenceBase]
        self.traits_to_remove = None  # type: CdmCollection[CdmTraitReferenceBase]
        self.arguments_contain_wildcards = None  # type: Optional[bool]
        self.apply_to = None  # type: List[str]
        self.apply_to_traits = None  # type: List[str]
        self.type = CdmOperationType.ALTER_TRAITS  # type: CdmOperationType

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmOperationAlterTraits'] = None) -> 'CdmOperationAlterTraits':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        copy = CdmOperationAlterTraits(self.ctx) if not host else host

        if self.traits_to_add:
            for trait in self.traits_to_add:
                copy.traits_to_add.append(trait.copy())

        if self.traits_to_remove:
            for trait in self.traits_to_remove:
                copy.traits_to_remove.append(trait.copy())

        if self.apply_to is not None:
            copy.apply_to = self.apply_to.copy()

        if self.apply_to_traits is not None:
            copy.apply_to_traits = self.apply_to_traits.copy()

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
        path = self._fetch_declared_path(path_from)

        if pre_children and pre_children(self, path):
            return False

        if self.traits_to_add and self.traits_to_add._visit_array('{}/traitsToAdd/'.format(path), pre_children, post_children):
            return True

        if self.traits_to_remove and self.traits_to_remove._visit_array('{}/traitsToRemove/'.format(path), pre_children, post_children):
            return True

        if post_children and post_children(self, path):
            return True

        return False

    def _append_projection_attribute_state(self, proj_ctx: 'ProjectionContext', proj_output_set: 'ProjectionAttributeStateSet',
                                           attr_ctx: 'CdmAttributeContext') -> 'ProjectionAttributeStateSet':
        from cdm.objectmodel import CdmObject                                           
        # Create a new attribute context for the operation
        attr_ctx_op_alter_traits_param = AttributeContextParameters()
        attr_ctx_op_alter_traits_param._under = attr_ctx
        attr_ctx_op_alter_traits_param._type = CdmAttributeContextType.OPERATION_ALTER_TRAITS
        attr_ctx_op_alter_traits_param._name = 'operation/index{}/{}'.format(self._index, self.get_name())
        attr_ctx_op_alter_traits = CdmAttributeContext._create_child_under(proj_ctx._projection_directive._res_opt, attr_ctx_op_alter_traits_param)

        # Get the top-level attribute names of the selected attributes to apply
        # We use the top-level names because the applyTo list may contain a previous name our current resolved attributes had
        top_level_selected_attribute_names = ProjectionResolutionCommonUtil._get_top_list(
            proj_ctx, self.apply_to) if self.apply_to is not None else None  # type: dict[str, str]

        # if set, make a hashset of trait names that need to be removed
        trait_names_to_remove = set() # type: set[str]
        if (self.traits_to_remove is not None):
            for trait_ref in self.traits_to_remove:
                # resolve self because it could be a traitgroup name and turn into many other traits
                tr = trait_ref # type: CdmTraitReferenceBase
                resolved_trait_set = tr._fetch_resolved_traits(proj_ctx._projection_directive._res_opt) # type: ResolvedTraitSet
                for rt in resolved_trait_set.rt_set:
                    trait_names_to_remove.add(rt.trait_name)

        # if set, make a hashset from the applyToTraits for fast lookup later
        apply_to_trait_names = None # type: set[str]
        if (self.apply_to_traits is not None):
            apply_to_trait_names = set(self.apply_to_traits)

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
                    new_res_attr = ResolvedAttribute(proj_ctx._projection_directive._res_opt, res_attr_new_copy,
                                                     current_PAS._current_resolved_attribute.resolved_name, attr_ctx_new_attr)

                    # the resolved attribute group obtained from previous projection operation may have a different set of traits comparing to the resolved attribute target.
                    #  We would want to take the set of traits from the resolved attribute.
                    new_res_attr.resolved_traits = current_PAS._current_resolved_attribute.resolved_traits.deep_copy()

                elif isinstance(current_PAS._current_resolved_attribute.target, CdmAttribute):
                    # Entity Attribute or Type Attribute
                    new_res_attr = self._create_new_resolved_attribute(
                        proj_ctx, attr_ctx_new_attr, current_PAS._current_resolved_attribute, current_PAS._current_resolved_attribute.resolved_name)

                else:
                    logger.error(self.ctx, self._TAG, CdmOperationAlterTraits._append_projection_attribute_state.__name__,
                                 self.at_corpus_path, CdmLogCode.ERR_PROJ_UNSUPPORTED_SOURCE, str(current_PAS._current_resolved_attribute.object_type), self.get_name())
                    proj_output_set._add(current_PAS)
                    break

                new_traits = self._resolved_new_traits(proj_ctx, current_PAS) # type: ResolvedTraitSet
                # if the applyToTraits property was set, then these traits apply to the traits of the selected attributes, else to the attribute directly
                if apply_to_trait_names is None:
                    # alter traits of atts
                    new_res_attr.resolved_traits = new_res_attr.resolved_traits.merge_set(new_traits)
                    # remove if requested
                    if trait_names_to_remove is not None:
                        for trait_name in trait_names_to_remove:
                            new_res_attr.resolved_traits.remove(proj_ctx._projection_directive._res_opt, trait_name)
                else:
                    # alter traits of traits of atts
                    # for every current resolved trait on this attribute, find the ones that match the criteria.
                    # a match is the trait name or extended name or any classifications set on it
                    # will need trait references for these resolved traits because metatraits are 'un resolved'
                    new_trait_refs = [] # type: List[CdmTraitReference]
                    for nrt in new_traits.rt_set:
                        new_trait_refs.append(CdmObject._resolved_trait_to_trait_ref(proj_ctx._projection_directive._res_opt, nrt))

                    for rt in new_res_attr.resolved_traits.rt_set:
                        # so get a hashset of the 'tokens' that classify this trait
                        classifiers = set() # type: set[str]
                        # this profile lists the classifiers and all base traits
                        profile = rt.fetch_trait_profile(proj_ctx._projection_directive._res_opt, self.prof_cache, None)
                        if profile is not None:
                            profile = profile.consolidate(self.prof_cache)
                            # all classifications 
                            if profile.classifications is not None:
                                for c in profile.classifications:
                                    classifiers.add(c.trait_name)
                            while profile is not None:
                                classifiers.add(profile.trait_name)
                                profile = profile.IS_A

                        # is there an intersection between the set of things to look for and the set of things that describe the trait?
                        if len(classifiers.intersection(apply_to_trait_names)) > 0:
                            # add the specified and fixed up traits to the metatraits of the resolved
                            if new_trait_refs is not None and len(new_trait_refs) > 0:
                                if rt.meta_traits is None:
                                    rt.meta_traits = [] # type List[CdmTraitReferenceBase]
                                rt.meta_traits.extend(new_trait_refs)
                            # remove some?
                            if trait_names_to_remove is not None and len(trait_names_to_remove) > 0 and rt.meta_traits is not None:
                                rt.meta_traits = [keep for keep in rt.meta_traits if keep not in trait_names_to_remove]
                                if len(rt.meta_traits) == 0:
                                    rt.meta_traits = None

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
        projection_owner_name = proj_ctx._projection_directive._original_source_attribute_name if proj_ctx._projection_directive._original_source_attribute_name is not None else ''

        if self.traits_to_add is not None:
            for trait_ref in self.traits_to_add:
                trait_ref_copy = trait_ref._fetch_resolved_traits(proj_ctx._projection_directive._res_opt).deep_copy()
                self._replace_wildcard_characters(proj_ctx._projection_directive._res_opt, trait_ref_copy, projection_owner_name, current_PAS)
                resolved_trait_set = resolved_trait_set.merge_set(trait_ref_copy)

        return resolved_trait_set

    def _replace_wildcard_characters(self, res_opt: 'ResolveOptions', resolved_trait_set: ResolvedTraitSet, projection_owner_name: str, current_PAS: 'ProjectionAttributeState') -> None:
        if self.arguments_contain_wildcards is not None and self.arguments_contain_wildcards is True:
            for resolved_trait in resolved_trait_set.rt_set:
                parameter_value_set = resolved_trait.parameter_values  # type: ParameterValueSet
                for i in range(parameter_value_set.length):
                    value = parameter_value_set.fetch_value(i)
                    if isinstance(value, str):
                        new_val = super()._replace_wildcard_characters(value, projection_owner_name, current_PAS)
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
