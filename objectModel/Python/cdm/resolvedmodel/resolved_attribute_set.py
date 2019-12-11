# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from collections import defaultdict
from typing import cast, List, Dict, Optional, Set, Tuple, Union, TYPE_CHECKING
import re

from cdm.enums import CdmAttributeContextType
from cdm.resolvedmodel.trait_param_spec import TraitParamSpec
from cdm.utilities import ApplierContext, AttributeContextParameters, RefCounted

if TYPE_CHECKING:
    from cdm.objectmodel import CdmAttributeContext, CdmAttributeResolutionGuidanceDefinition
    from cdm.resolvedmodel import ResolvedAttribute, ResolvedTraitSet, TraitSpec
    from cdm.utilities import AttributeResolutionApplier, ResolveOptions


class ResolvedAttributeSet(RefCounted):
    def __init__(self):
        super().__init__()

        self.attctx_to_rattr = {}  # type:  Dict[CdmAttributeContext, ResolvedAttribute]
        self.attribute_context = None  # type: CdmAttributeContext
        self.base_trait_to_attributes = None  # type: Optional[Dict[string, Set[ResolvedAttribute]]]
        self.insert_order = 0  # type: int
        self.rattr_to_attctxset = defaultdict(set)  # type: Dict[ResolvedAttribute, Set[CdmAttributeContext]]
        self.resolved_name_to_resolved_attribute = {}  # type: Dict[string, ResolvedAttribute]
        self.set = []  # type: List[ResolvedAttribute]

    @property
    def size(self) -> int:
        return len(self.resolved_name_to_resolved_attribute)

    def create_attribute_context(self, res_opt: 'ResolveOptions', acp: 'AttributeContextParameters') -> 'CdmAttributeContext':
        if acp is None:
            return None

        # Store the current context.
        from cdm.objectmodel import CdmAttributeContext
        self.attribute_context = CdmAttributeContext._create_child_under(res_opt, acp)
        return self.attribute_context

    def cache_attribute_context(self, att_ctx: 'CdmAttributeContext', ra: 'ResolvedAttribute') -> None:
        self.attctx_to_rattr[att_ctx] = ra

        # Set collection will take care of adding context to set.
        self.rattr_to_attctxset[ra].add(att_ctx)

    def merge(self, to_merge: 'ResolvedAttribute', att_ctx: 'CdmAttributeContext' = None) -> 'ResolvedAttributeSet':
        ras_result = self

        if to_merge is not None:
            if to_merge.resolved_name in ras_result.resolved_name_to_resolved_attribute:
                existing = ras_result.resolved_name_to_resolved_attribute[to_merge.resolved_name]

                if self.ref_cnt > 1 and existing.target != to_merge.target:
                    ras_result = ras_result.copy()  # copy on write.
                    existing = ras_result.resolved_name_to_resolved_attribute[to_merge.resolved_name]

                existing.target = to_merge.target  # replace with newest version.
                existing.arc = to_merge.arc

                rts_merge = existing.resolved_traits.merge_set(to_merge.resolved_traits)  # newest one may replace.
                if rts_merge != existing.resolved_traits:
                    ras_result = ras_result.copy()  # copy on write.
                    existing = ras_result.resolved_name_to_resolved_attribute[to_merge.resolved_name]
                    existing.resolved_traits = rts_merge
            else:
                if self.ref_cnt > 1:
                    ras_result = ras_result.copy()  # copy on write.
                if ras_result is None:
                    ras_result = self
                ras_result.resolved_name_to_resolved_attribute[to_merge.resolved_name] = to_merge
                # don't use the att_ctx on the actual attribute, that's only for doing appliers.
                if att_ctx is not None:
                    ras_result.cache_attribute_context(att_ctx, to_merge)
                ras_result.set.append(to_merge)

            self.base_trait_to_attributes = None

        return ras_result

    def alter_set_order_and_scope(self, new_set: List['ResolvedAttribute']) -> None:
        # assumption is that new_set contains only some or all attributes from the original value of Set.
        # if not, the stored attribute context mappings are busted
        self.base_trait_to_attributes = None
        self.resolved_name_to_resolved_attribute = {}  # rebuild with smaller set
        self.set = new_set
        for ra in new_set:
            self.resolved_name_to_resolved_attribute[ra.resolved_name] = ra

    def copy_att_ctx_mappings_into(self, rattr_to_attctxset: Dict['ResolvedAttribute', Set['CdmAttributeContext']],
                                   attctx_to_rattr: Dict['CdmAttributeContext', 'ResolvedAttribute'],
                                   source_ra: 'ResolvedAttribute', new_ra: 'ResolvedAttribute' = None) -> None:

        if self.rattr_to_attctxset:
            if new_ra is None:
                new_ra = source_ra
            # Get the set of attribute contexts for the old resolved attribute.
            keys = list(self.rattr_to_attctxset.keys())
            if source_ra in self.rattr_to_attctxset:
                # Map the new resolved attribute to the old context set.
                att_ctx_set = self.rattr_to_attctxset[source_ra]
                rattr_to_attctxset[new_ra] = att_ctx_set
                # Map the old contexts to the new resolved attributes.
                for att_ctx in att_ctx_set:
                    attctx_to_rattr[att_ctx] = new_ra

    def merge_set(self, to_merge: 'ResolvedAttributeSet') -> 'ResolvedAttributeSet':
        ras_result = self
        if to_merge is not None:
            for res_att in to_merge.set:
                # Don't pass in the context here.
                ras_merged = ras_result.merge(res_att)
                if ras_merged != ras_result:
                    ras_result = ras_merged
                # copy context here.
                to_merge.copy_att_ctx_mappings_into(ras_result.rattr_to_attctxset, ras_result.attctx_to_rattr, res_att)

        return ras_result

    def apply_traits(self, traits: 'ResolvedTraitSet', res_guide: 'CdmAttributeResolutionGuidanceDefinition',
                     actions: List['AttributeResolutionApplier']) -> 'ResolvedAttributeSet':
        ras_result = self

        if self.ref_cnt > 1 and ras_result.copy_needed(traits, res_guide, actions):
            ras_result = ras_result.copy()
        ras_applied = ras_result.apply(traits, res_guide, actions)

        ras_result.resolved_name_to_resolved_attribute = ras_applied.resolved_name_to_resolved_attribute
        ras_result.base_trait_to_attributes = None
        ras_result.set = ras_applied.set
        ras_result.rattr_to_attctxset = ras_applied.rattr_to_attctxset
        ras_result.attctx_to_rattr = ras_applied.attctx_to_rattr

        return ras_result

    def copy_needed(self, traits: 'ResolvedTraitSet', res_guide: 'CdmAttributeResolutionGuidanceDefinition',
                    actions: List['AttributeResolutionApplier']) -> bool:
        if not actions:
            return False

        # For every attribute in the set, detect if a merge of traits will alter the traits. If so, need to copy the
        # attribute set to avoid overwrite.
        for res_att in self.set:
            for trait_action in actions:
                ctx = ApplierContext()
                ctx.res_opt = traits.res_opt
                ctx.res_att_source = res_att
                ctx.res_guide = res_guide

                if trait_action.will_attribute_modify(ctx):
                    return True

        return False

    def apply(self, traits: 'ResolvedTraitSet', res_guide: 'CdmAttributeResolutionGuidanceDefinition',
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
        if self.set and applied_att_set.attribute_context and actions:
            res_att_test = self.set[0]
            for trait_action in actions:
                ctx = ApplierContext(res_opt=traits.res_opt, res_att_source=res_att_test, res_guide=res_guide)
                if trait_action.will_attribute_modify(ctx):
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

        for res_att in self.set:
            att_ctx_to_merge = None  # Optional[CdmAttributeContext]

            if isinstance(res_att.target, ResolvedAttributeSet):
                sub_set = cast('ResolvedAttributeSet', res_att.target)

                if making_copy:
                    res_att = res_att.copy()

                # the set contains another set. Process those.
                res_att.target = sub_set.apply(traits, res_guide, actions)
            else:
                rts_merge = res_att.resolved_traits.merge_set(traits)
                res_att.resolved_traits = rts_merge

                if actions:
                    for trait_action in actions:
                        ctx = ApplierContext()
                        ctx.res_opt = traits.res_opt
                        ctx.res_att_source = res_att
                        ctx.res_guide = res_guide

                        if trait_action.will_attribute_modify(ctx):
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

                            ctx.res_att_source = res_att

                            # modify it
                            trait_action.do_attribute_modify(ctx)

            applied_att_set.merge(res_att, att_ctx_to_merge)

        applied_att_set.attribute_context = self.attribute_context

        if not making_copy:
            # didn't copy the attributes or make any new context, so just take the old ones
            applied_att_set.rattr_to_attctxset = self.rattr_to_attctxset
            applied_att_set.attctx_to_rattr = self.attctx_to_rattr
        return applied_att_set

    def remove_requested_atts(self, marker: Tuple[int, int]) -> 'ResolvedAttributeSet':
        # The marker tracks the track the deletes 'under' a certain index.
        (count_index, mark_index) = marker

        # For every attribute in the set, run any attribute removers on the traits they have.
        applied_att_set = None  # type: ResolvedAttributeSet
        for i_att, res_att in enumerate(self.set):
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
                if not new_sub_set or not new_sub_set.set:
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

                        if apl.will_remove(ctx):
                            res_att = None
                            break

            if res_att:
                # Attribute remains. Are we building a new set?
                if applied_att_set:
                    self.copy_att_ctx_mappings_into(applied_att_set.rattr_to_attctxset, applied_att_set.attctx_to_rattr, res_att)
                    applied_att_set.merge(res_att)
                count_index += 1
            else:
                # Remove the attribute. If this is the first removed attribute, then make a copy of the set now. After
                # this point, the rest of the loop logic keeps the copy going as needed.
                if not applied_att_set:
                    applied_att_set = ResolvedAttributeSet()
                    for i_copy in range(i_att):
                        self.copy_att_ctx_mappings_into(applied_att_set.rattr_to_attctxset, applied_att_set.attctx_to_rattr, self.set[i_copy])
                        applied_att_set.merge(self.set[i_copy])

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
            for res_att in self.set:
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
                        pvals = ra.resolved_traits.find(res_opt, q.trait_base_name).parameter_values
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

        if name in self.resolved_name_to_resolved_attribute:
            return self.resolved_name_to_resolved_attribute[name]

        if self.set:
            # Deeper look. First see if there are any groups held in this group.
            for ra in self.set:
                if isinstance(ra.target, ResolvedAttributeSet) and cast('ResolvedAttributeSet', ra.target).set is not None:
                    ra_found = cast('ResolvedAttributeSet', ra.target).get(name)
                    if ra_found:
                        return ra_found

            # Nothing found that way, so now look through the attribute definitions for a match
            for ra in self.set:
                if isinstance(ra.target, CdmAttribute) and cast('CdmAttribute', ra.target).name == name:
                    return ra

        return None

    def copy(self) -> 'ResolvedAttributeSet':
        copy = ResolvedAttributeSet()
        copy.attribute_context = self.attribute_context

        # Save the mappings to overwrite. Maps from merge may not be correct.
        new_rattr_to_attctxset = {}  # type: Dict[ResolvedAttribute, Set[CdmAttributeContext]]
        new_attctx_to_rattr = {}  # type: Dict[CdmAttributeContext, ResolvedAttribute]

        for source_ra in self.set:
            copy_ra = source_ra.copy()
            self.copy_att_ctx_mappings_into(new_rattr_to_attctxset, new_attctx_to_rattr, source_ra, copy_ra)
            copy.merge(copy_ra)

        # Reset mappings to the correct one.
        copy.rattr_to_attctxset = new_rattr_to_attctxset
        copy.attctx_to_rattr = new_attctx_to_rattr

        return copy

    def spew(self, res_opt: 'ResolveOptions', to: 'SpewCatcher', indent: str, name_sort: bool) -> None:
        if self.set:

            new_set = self.set if not name_sort else sorted(self.set, key=lambda ra: re.sub('[^a-zA-Z0-9.]+', '', ra.resolved_name.casefold()))
            for ra in new_set:
                ra.spew(res_opt, to, indent, name_sort)
