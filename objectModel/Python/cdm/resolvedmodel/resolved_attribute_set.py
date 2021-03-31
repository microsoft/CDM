# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from collections import defaultdict, OrderedDict
from typing import cast, List, Dict, Optional, Set, Tuple, Union, TYPE_CHECKING
import re

from cdm.enums import CdmAttributeContextType
from cdm.resolvedmodel.trait_param_spec import TraitParamSpec
from cdm.utilities import ApplierContext, AttributeContextParameters, RefCounted, primitive_appliers, ApplierState

if TYPE_CHECKING:
    from cdm.objectmodel import CdmAttributeContext, CdmAttributeResolutionGuidanceDefinition, CdmAttribute
    from cdm.resolvedmodel import ResolvedAttribute, ResolvedTraitSet, TraitSpec
    from cdm.utilities import AttributeResolutionApplier, ResolveOptions


class ResolvedAttributeSet(RefCounted):
    def __init__(self):
        super().__init__()

        self.attribute_context = None  # type: CdmAttributeContext
        self.base_trait_to_attributes = None  # type: Optional[Dict[string, Set[ResolvedAttribute]]]
        self.insert_order = 0  # type: int
        self._resolved_name_to_resolved_attribute = OrderedDict()  # type: Dict[string, ResolvedAttribute]
        # we need this instead of checking the size of the set because there may be attributes
        # nested in an attribute group and we need each of those attributes counted here as well
        self._resolved_attribute_count = 0  # type: int
        # indicates the depth level that this set was resolved at.
        # resulting set can vary depending on the maxDepth value
        self._depth_traveled = 0 # type: int
        self._set = []  # type: List[ResolvedAttribute]
        # this maps the the name of an owner (an entity attribute) to a set of the attributes names that were added because of that entAtt
        # used in the entity attribute code to decide when previous (inherit) attributes from an entAtt with the same name might need to be removed
        self._attribute_ownership_map = None  # type: Dict[string, Set[string]]

    @property
    def size(self) -> int:
        return len(self._resolved_name_to_resolved_attribute)

    @property
    def _set(self) -> List['ResolvedAttribute']:
        return self.__set

    @_set.setter
    def _set(self, value: List['ResolvedAttribute']) -> None:
        self._resolved_attribute_count = sum([att._resolved_attribute_count for att in value])
        self.__set = value

    def create_attribute_context(self, res_opt: 'ResolveOptions', acp: 'AttributeContextParameters') -> 'CdmAttributeContext':
        if acp is None:
            return None

        # Store the current context.
        from cdm.objectmodel import CdmAttributeContext
        self.attribute_context = CdmAttributeContext._create_child_under(res_opt, acp)
        return self.attribute_context

    def _remove_cached_attribute_context(self, att_ctx: 'CdmAttributeContext') -> None:
        if att_ctx is not None:
            old_ra = self.attctx_to_rattr.get(att_ctx)
            if old_ra is not None and old_ra in self.rattr_to_attctxset:
                del self.attctx_to_rattr[att_ctx]
                self.rattr_to_attctxset[old_ra].remove(att_ctx)
                if not self.rattr_to_attctxset[old_ra]:
                    del self.rattr_to_attctxset[old_ra]

    def merge(self, to_merge: 'ResolvedAttribute') -> 'ResolvedAttributeSet':
        ras_result = self

        if to_merge is not None:
            # if there is already a resolve attribute present, remove it before adding the new attribute
            if to_merge.resolved_name in ras_result._resolved_name_to_resolved_attribute:
                existing = ras_result._resolved_name_to_resolved_attribute[to_merge.resolved_name]
                if existing != to_merge:
                    if self._ref_cnt > 1 and existing.target != to_merge.target:
                        ras_result = ras_result.copy()  # copy on write.
                        existing = ras_result._resolved_name_to_resolved_attribute[to_merge.resolved_name]
                    else:
                        ras_result = self

                    from cdm.objectmodel import CdmAttribute
                    if isinstance(existing.target, CdmAttribute):
                        ras_result._resolved_attribute_count -= existing.target._attribute_count
                    elif isinstance(existing.target, ResolvedAttributeSet):
                        ras_result._resolved_attribute_count -= existing.target._resolved_attribute_count

                    if isinstance(to_merge.target, CdmAttribute):
                        ras_result._resolved_attribute_count += to_merge.target._attribute_count
                    elif isinstance(to_merge.target, ResolvedAttributeSet):
                        ras_result._resolved_attribute_count += to_merge.target._resolved_attribute_count

                    existing.target = to_merge.target  # replace with newest version.
                    existing.arc = to_merge.arc
    
                    # merge a new ra into one with the same name, so make a lineage
                    # the existing attCtx becomes the new lineage. but the old one needs to stay too... so you get both. it came from both places.
                    # we need ONE place where this RA can point, so that will be the most recent place with a fixed lineage
                    # A->C1->C0 gets merged with A'->C2->C3 that turns into A->C2->[(c3), (C1->C0)]. in the more simple case this is just A->C2->C1
                    if to_merge.att_ctx is not None:
                        if existing.att_ctx is not None:
                            to_merge.att_ctx._add_lineage(existing.att_ctx)
                        existing.att_ctx = to_merge.att_ctx

                    rts_merge = existing.resolved_traits.merge_set(to_merge.resolved_traits)  # newest one may replace.
                    if rts_merge != existing.resolved_traits:
                        ras_result = ras_result.copy()  # copy on write.
                        existing = ras_result._resolved_name_to_resolved_attribute[to_merge.resolved_name]
                        existing.resolved_traits = rts_merge
            else:
                if self._ref_cnt > 1:
                    ras_result = ras_result.copy()  # copy on write.
                if ras_result is None:
                    ras_result = self
                ras_result._resolved_name_to_resolved_attribute[to_merge.resolved_name] = to_merge
                ras_result._set.append(to_merge)
                ras_result._resolved_attribute_count += to_merge._resolved_attribute_count

            self.base_trait_to_attributes = None

        return ras_result

    def alter_set_order_and_scope(self, new_set: List['ResolvedAttribute']) -> None:
        # assumption is that new_set contains only some or all attributes from the original value of Set.
        # if not, the stored attribute context mappings are busted
        self.base_trait_to_attributes = None
        self._resolved_name_to_resolved_attribute = {}  # rebuild with smaller set
        self._set = new_set
        for ra in new_set:
            if ra.resolved_name not in self._resolved_name_to_resolved_attribute:
                self._resolved_name_to_resolved_attribute[ra.resolved_name] = ra

    def merge_set(self, to_merge: 'ResolvedAttributeSet') -> 'ResolvedAttributeSet':
        ras_result = self
        if to_merge is not None:
            for res_att in to_merge._set:
                # Don't pass in the context here.
                ras_merged = ras_result.merge(res_att)
                if ras_merged != ras_result:
                    ras_result = ras_merged
                # get the attribute from the merged set, attributes that were already present were merged, not replaced
                current_ra = ras_result._resolved_name_to_resolved_attribute.get(res_att.resolved_name, None)

            # merge the ownership map.
            if to_merge._attribute_ownership_map is not None:
                if self._attribute_ownership_map is None:
                    self._attribute_ownership_map = OrderedDict()
                for key, value in to_merge._attribute_ownership_map.items():
                    # always take the new one as the right list, not sure if the constructor for dictionary uses this logic or fails
                    self._attribute_ownership_map[key] = value

        return ras_result

    def set_target_owner(self, entity: 'CdmEntityDefinition'):
        """Recursively sets the target owner's to be the provided entity."""
        from cdm.objectmodel import CdmAttribute

        for ra in self._set:
            if isinstance(ra.target, CdmAttribute):
                ra.target.owner = entity
                ra.target.in_document = entity.in_document
            elif isinstance(ra.target, ResolvedAttributeSet):
                ra.target.set_target_owner(entity)

    def apply_traits(self, traits: 'ResolvedTraitSet', res_opt: 'ResolveOptions', res_guide: 'CdmAttributeResolutionGuidanceDefinition',
                     actions: List['AttributeResolutionApplier']) -> 'ResolvedAttributeSet':
        ras_result = self

        if self._ref_cnt > 1 and ras_result.copy_needed(traits, res_opt, res_guide, actions):
            ras_result = ras_result.copy()
        ras_applied = ras_result.apply(traits, res_opt, res_guide, actions)

        ras_result._resolved_name_to_resolved_attribute = ras_applied._resolved_name_to_resolved_attribute
        ras_result.base_trait_to_attributes = None
        ras_result._set = ras_applied._set

        return ras_result

    def copy_needed(self, traits: 'ResolvedTraitSet', res_opt: 'ResolveOptions', res_guide: 'CdmAttributeResolutionGuidanceDefinition',
                    actions: List['AttributeResolutionApplier']) -> bool:
        if not actions:
            return False

        # For every attribute in the set, detect if a merge of traits will alter the traits. If so, need to copy the
        # attribute set to avoid overwrite.
        for res_att in self._set:
            for trait_action in actions:
                ctx = ApplierContext()
                ctx.res_opt = res_opt
                ctx.res_att_source = res_att
                ctx.res_guide = res_guide

                if trait_action._will_attribute_modify(ctx):
                    return True

        return False

    def apply(self, traits: 'ResolvedTraitSet', res_opt: 'ResolveOptions', res_guide: 'CdmAttributeResolutionGuidanceDefinition',
              actions: List['AttributeResolutionApplier']) -> 'ResolvedAttributeSet':
        from cdm.objectmodel import CdmAttributeContext

        if not traits and not actions:
            # nothing can change.
            return self

        # for every attribute in the set run any attribute appliers.
        applied_att_set = ResolvedAttributeSet()
        applied_att_set.attribute_context = self.attribute_context

        # check to see if we need to make a copy of the attributes
        # do this when building an attribute context and when we will modify the attributes (beyond traits)
        # see if any of the appliers want to modify
        making_copy = False
        if self._set and applied_att_set.attribute_context and actions:
            res_att_test = self._set[0]
            for trait_action in actions:
                ctx = ApplierContext(res_opt=res_opt, res_att_source=res_att_test, res_guide=res_guide)
                if trait_action._will_attribute_modify(ctx):
                    making_copy = True
                    break

        if making_copy:
            # fake up a generation round for these copies that are about to happen
            acp = AttributeContextParameters(
                under=applied_att_set.attribute_context,
                type=CdmAttributeContextType.GENERATED_SET,
                name='_generatedAttributeSet')
            applied_att_set.attribute_context = CdmAttributeContext._create_child_under(traits.res_opt, acp)
            acp = AttributeContextParameters(
                under=applied_att_set.attribute_context,
                type=CdmAttributeContextType.GENERATED_ROUND,
                name='_generatedAttributeRound0')

            applied_att_set.attribute_context = CdmAttributeContext._create_child_under(traits.res_opt, acp)

        for res_att in self._set:
            att_ctx_to_merge = res_att.att_ctx  # start with the current context for the resolved att, if a copy happens this will change

            if isinstance(res_att.target, ResolvedAttributeSet):
                sub_set = cast('ResolvedAttributeSet', res_att.target)

                if making_copy:
                    res_att = res_att.copy()
                    # making a copy of a subset (att group) also bring along the context tree for that whole group
                    att_ctx_to_merge = res_att.att_ctx

                # the set contains another set. Process those.
                res_att.target = sub_set.apply(traits, res_opt, res_guide, actions)
            else:
                rts_merge = res_att.resolved_traits.merge_set(traits)
                res_att.resolved_traits = rts_merge

                if actions:
                    for trait_action in actions:
                        ctx = ApplierContext()
                        ctx.res_opt = traits.res_opt
                        ctx.res_att_source = res_att
                        ctx.res_guide = res_guide

                        if trait_action._will_attribute_modify(ctx):
                            # make a context for this new copy
                            if making_copy:
                                acp = AttributeContextParameters(
                                    under=applied_att_set.attribute_context,
                                    type=CdmAttributeContextType.ATTRIBUTE_DEFINITION,
                                    name=res_att.resolved_name,
                                    regarding=res_att.target)
                                ctx.att_ctx = CdmAttributeContext._create_child_under(traits.res_opt, acp)
                                att_ctx_to_merge = ctx.att_ctx  # type: CdmAttributeContext

                            # make a copy of the resolved att
                            if making_copy:
                                res_att = res_att.copy()
                                att_ctx_to_merge._add_lineage(res_att.att_ctx)
                                res_att.att_ctx = att_ctx_to_merge

                            ctx.res_att_source = res_att

                            # modify it
                            trait_action._do_attribute_modify(ctx)

            applied_att_set.merge(res_att)

        applied_att_set.attribute_context = self.attribute_context

        return applied_att_set

    def remove_requested_atts(self, marker: Tuple[int, int]) -> 'ResolvedAttributeSet':
        # The marker tracks the track the deletes 'under' a certain index.
        (count_index, mark_index) = marker

        # For every attribute in the set, run any attribute removers on the traits they have.
        applied_att_set = None  # type: ResolvedAttributeSet
        for i_att, res_att in enumerate(self._set):
            # Possible for another set to be in this set.
            if isinstance(res_att.target, ResolvedAttributeSet):
                sub_set = cast('ResolvedAttributeSet', res_att.target)
                # Go around again on this same function and get rid of things from this group.
                marker = (count_index, mark_index)
                new_sub_set = sub_set.remove_requested_atts(marker)
                (count_index, mark_index) = marker
                # Replace the set with the new one that came back.
                res_att.target = new_sub_set
                # If everything went away, then remove this group.
                if not new_sub_set or not new_sub_set._set:
                    res_att = None
                else:
                    # Don't count this as an attribute (later).
                    count_index -= 1
            else:
                # This is a good time to make the resolved names final.
                res_att.previous_resolved_name = res_att.resolved_name
                if res_att.arc and res_att.arc.applier_caps and res_att.arc.applier_caps.can_remove:
                    for apl in res_att.arc.actions_remove:
                        # This should look like the applier context when the att was created.
                        ctx = ApplierContext()
                        ctx.res_opt = res_att.arc.res_opt
                        ctx.res_att_source = res_att
                        ctx.res_guide = res_att.arc.res_guide

                        if apl._will_remove(ctx):
                            res_att = None
                            break

            if res_att:
                # Attribute remains. Are we building a new set?
                if applied_att_set:
                    applied_att_set.merge(res_att)
                count_index += 1
            else:
                # Remove the attribute. If this is the first removed attribute, then make a copy of the set now. After
                # this point, the rest of the loop logic keeps the copy going as needed.
                if not applied_att_set:
                    applied_att_set = ResolvedAttributeSet()
                    for i_copy in range(i_att):
                        applied_att_set.merge(self._set[i_copy])

                # Track deletes under the mark (move the mark up)
                if count_index < mark_index:
                    mark_index -= 1

        marker = (count_index, mark_index)

        # Now we are that (or a copy).
        ras_result = self
        if applied_att_set and applied_att_set.size != ras_result.size:
            ras_result = applied_att_set
            ras_result.base_trait_to_attributes = None
            ras_result.attribute_context = self.attribute_context

        return ras_result

    def fetch_attributes_with_traits(self, res_opt: 'ResolveOptions', query_for: Union['TraitSpec', List['TraitSpec']]) -> Optional['ResolvedAttributeSet']:
        # Put the input into a standard form.
        query = []  # type: List[TraitParamSpec]
        if isinstance(query_for, List):
            for q in query_for:
                if isinstance(q, str):
                    trait_param_spec = TraitParamSpec()
                    trait_param_spec.trait_base_name = q
                    trait_param_spec.parameters = {}
                    query.append(trait_param_spec)
                else:
                    query.append(q)
        else:
            if isinstance(query_for, str):
                trait_param_spec = TraitParamSpec()
                trait_param_spec.trait_base_name = query_for
                trait_param_spec.parameters = {}
                query.append(trait_param_spec)
            else:
                query.append(query_for)

        # If the map isn't in place, make one now. Assumption is that this is called as part of a usage pattern where it
        # will get called again.
        if not self.base_trait_to_attributes:
            self.base_trait_to_attributes = {}
            for res_att in self._set:
                # Create a map from the name of every trait found in this whole set of attributes to the attributes that
                # have the trait (included base classes of traits).
                trait_names = res_att.resolved_traits.collect_trait_names()
                for t_name in trait_names:
                    if not t_name in self.base_trait_to_attributes:
                        self.base_trait_to_attributes[t_name] = set()
                    self.base_trait_to_attributes[t_name].add(res_att)

        # For every trait in the query, get the set of attributes. Intersect these sets to get the final answer.
        final_set = set()  # type: Set[ResolvedAttribute]
        for q in query:
            if q.trait_base_name in self.base_trait_to_attributes:
                sub_set = self.base_trait_to_attributes[q.trait_base_name]
                if q.parameters:
                    # Need to check param values, so copy the subset to something we can modify.
                    filtered_sub_set = set()
                    for ra in sub_set:
                        # Get parameters of the the actual trait matched.
                        trait_obj = ra.resolved_traits.find(res_opt, q.trait_base_name)
                        if trait_obj:
                            pvals = trait_obj.parameter_values
                            # Compare to all query params.
                            match = True

                            for key, val in q.parameters:
                                pv = pvals.fetch_parameter_value(key)
                                if not pv or pv.fetch_value_string(res_opt) != val:
                                    match = False
                                    break

                            if match:
                                filtered_sub_set.add(ra)

                    sub_set = filtered_sub_set

                if sub_set:
                    # Got some. Either use as starting point for answer or intersect this in.
                    final_set = final_set.intersection(sub_set)

        # Collect the final set into a resolved attribute set.
        if final_set:
            ras_result = ResolvedAttributeSet()
            for ra in final_set:
                ras_result.merge(ra)
            return ras_result

        return None

    def get(self, name: str) -> Optional['ResolvedAttribute']:
        from cdm.objectmodel import CdmAttribute

        if name in self._resolved_name_to_resolved_attribute:
            return self._resolved_name_to_resolved_attribute[name]

        if self._set:
            # Deeper look. First see if there are any groups held in this group.
            for ra in self._set:
                if isinstance(ra.target, ResolvedAttributeSet) and cast('ResolvedAttributeSet', ra.target)._set is not None:
                    ra_found = cast('ResolvedAttributeSet', ra.target).get(name)
                    if ra_found:
                        return ra_found

            # Nothing found that way, so now look through the attribute definitions for a match
            for ra in self._set:
                if isinstance(ra.target, CdmAttribute) and cast('CdmAttribute', ra.target).name == name:
                    return ra

        return None

    def copy(self) -> 'ResolvedAttributeSet':
        copy = ResolvedAttributeSet()
        copy.attribute_context = self.attribute_context

        for source_ra in self._set:
            copy_ra = source_ra.copy()
            copy.merge(copy_ra)

        # copy the ownership map. new map will point at old att lists, but we never update these lists, only make new ones, so all is well
        if self._attribute_ownership_map is not None:
            copy._attribute_ownership_map = OrderedDict(self._attribute_ownership_map)

        copy._depth_traveled = self._depth_traveled

        return copy

    def spew(self, res_opt: 'ResolveOptions', to: 'SpewCatcher', indent: str, name_sort: bool) -> None:
        if self._set:

            new_set = self._set if not name_sort else sorted(self._set, key=lambda ra: re.sub('[^a-zA-Z0-9.]+', '', ra.resolved_name.casefold()))
            for ra in new_set:
                ra.spew(res_opt, to, indent, name_sort)

    def _set_attribute_ownership(self, owner_name) -> None:
        """everything in this set now 'belongs' to the specified owner"""
        if self._set is not None and len(self._set) > 0:
            self._attribute_ownership_map = OrderedDict()
            name_set = set(self._resolved_name_to_resolved_attribute.keys())  # this map should always be up to date, so fair to use as a source of all names
            self._attribute_ownership_map[owner_name] = name_set

    def mark_orphans_for_removal(self, owner_name: str, ras_new_ones: 'ResolvedAttributeSet') -> None:
        if self._attribute_ownership_map is None:
            return
        if owner_name not in self._attribute_ownership_map:
            return

        last_set = self._attribute_ownership_map[owner_name]
        # make a list of all atts from last time with this owner, remove the ones that show up now
        those_not_repeated = set(last_set)
        # of course, if none show up, all must go
        if ras_new_ones is not None and ras_new_ones._set is not None and len(ras_new_ones._set) > 0:
            for new_one in ras_new_ones._set:
                if new_one.resolved_name in last_set:
                    # congrats, you are not doomed
                    those_not_repeated.remove(new_one.resolved_name)
        # anyone left must be marked for remove
        fixed_arcs = set()  # to avoid checking if we need to fix the same thing many times
        for to_remove in those_not_repeated:
            ra_doomed = self._resolved_name_to_resolved_attribute[to_remove]
            if ra_doomed.arc is not None:
                # to remove these, need to have our special remover thing in the set of actions
                if ra_doomed.arc not in fixed_arcs:
                    fixed_arcs.add(ra_doomed.arc)  # not again
                    if ra_doomed.arc.applier_caps.can_remove:
                        if primitive_appliers._is_removed_internal not in ra_doomed.arc.actions_remove:
                            ra_doomed.arc.actions_remove.append(primitive_appliers._is_removed_internal)
                    else:
                        ra_doomed.arc.actions_remove.append(primitive_appliers._is_removed_internal)
                        ra_doomed.arc.applier_caps.can_remove = True

                # mark the att in the state
                if ra_doomed.applier_state is None:
                    ra_doomed.applier_state = ApplierState()
                ra_doomed.applier_state._flex_remove = True





