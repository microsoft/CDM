# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Callable, cast, List, Optional, Tuple, TYPE_CHECKING

from cdm.enums import CdmAttributeContextType
from cdm.resolvedmodel.attribute_resolution_applier_capabilities import AttributeResolutionApplierCapabilities
from cdm.resolvedmodel.resolved_attribute import ResolvedAttribute
from cdm.resolvedmodel.resolved_attribute_set import ResolvedAttributeSet
from cdm.utilities import primitive_appliers
from cdm.utilities.attribute_context_parameters import AttributeContextParameters
from cdm.utilities.applier_context import ApplierContext
from cdm.utilities.applier_state import ApplierState

if TYPE_CHECKING:
    from cdm.objectmodel import CdmAttributeResolutionGuidanceDefinition
    from cdm.resolvedmodel import ResolvedTraitSet
    from cdm.utilities import AttributeResolutionApplier, ResolveOptions
    ApplierAction = Callable[[ApplierContext], None]
    ApplierQuery = Callable[[ApplierContext], bool]


class AttributeResolutionContext:
    def __init__(self, res_opt: 'ResolveOptions', res_guide: 'CdmAttributeResolutionGuidanceDefinition', traits: 'ResolvedTraitSet') -> None:
        # Collect a set of appliers for all traits.
        self.res_opt = res_opt  # type: ResolveOptions
        self.res_guide = res_guide  # type: CdmAttributeResolutionGuidanceDefinition
        self.traits_to_apply = traits  # type: ResolvedTraitSet

        self.actions_modify = []  # type: List[AttributeResolutionApplier]
        self.actions_group_add = []  # type: List[AttributeResolutionApplier]
        self.actions_round_add = []  # type: List[AttributeResolutionApplier]
        self.actions_attribute_add = []  # type: List[AttributeResolutionApplier]
        self.actions_remove = []  # type: List[AttributeResolutionApplier]
        self.applier_caps = None  # type: Optional[AttributeResolutionApplierCapabilities]

        from cdm.objectmodel import CdmObject
        self.res_opt = res_opt.copy()

        if not res_guide:
            return

        if not self.applier_caps:
            self.applier_caps = AttributeResolutionApplierCapabilities()

        def add_applier(apl: 'AttributeResolutionApplier') -> bool:
            # Collect the code that will perform the right action.
            # Associate with the resolved trait and get the priority.

            if apl._will_attribute_modify and apl._do_attribute_modify:
                self.actions_modify.append(apl)
                self.applier_caps.can_attribute_modify = True

            if apl._will_attribute_add and apl._do_attribute_add:
                self.actions_attribute_add.append(apl)
                self.applier_caps.can_attribute_add = True

            if apl._will_group_add and apl._do_group_add:
                self.actions_group_add.append(apl)
                self.applier_caps.can_group_add = True

            if apl._will_round_add and apl._do_round_add:
                self.actions_round_add.append(apl)
                self.applier_caps.can_round_add = True

            if apl._will_alter_directives and apl._do_alter_directives:
                self.applier_caps.can_alter_directives = True
                apl._do_alter_directives(self.res_opt, res_guide)

            if apl._will_create_context and apl._do_create_context:
                self.applier_caps.can_create_context = True

            if apl._will_remove:
                self.actions_remove.append(apl)
                self.applier_caps.can_remove = True

            return True

        if res_guide.remove_attribute:
            add_applier(primitive_appliers._is_removed)
        if res_guide.imposed_directives:
            add_applier(primitive_appliers._does_impose_directives)
        if res_guide.removed_directives:
            add_applier(primitive_appliers._does_remove_directives)
        if res_guide.add_supporting_attribute:
            add_applier(primitive_appliers._does_add_supporting_attribute)
        if res_guide.rename_format:
            add_applier(primitive_appliers._does_disambiguate_names)
        if res_guide.cardinality == 'many':
            add_applier(primitive_appliers._does_explain_array)
        if res_guide.entity_by_reference:
            add_applier(primitive_appliers._does_reference_entity_via)
        if res_guide.selects_sub_attribute and res_guide.selects_sub_attribute.selects == 'one':
            add_applier(primitive_appliers._does_select_attributes)

        # Sorted by priority.
        self.actions_modify.sort(key=lambda ara: ara._priority)
        self.actions_group_add.sort(key=lambda ara: ara._priority)
        self.actions_round_add.sort(key=lambda ara: ara._priority)
        self.actions_attribute_add.sort(key=lambda ara: ara._priority)


class ResolvedAttributeSetBuilder:
    def __init__(self):
        self.ras = ResolvedAttributeSet()  # type: Optional[ResolvedAttributeSet]
        self.inherited_mark = 0  # type: int

    def merge_attributes(self, ras_new: 'ResolvedAttributeSet') -> None:
        if ras_new:
            self.take_reference(self.ras.merge_set(ras_new))
        if ras_new._depth_traveled > self.ras._depth_traveled:
            self.ras._depth_traveled = ras_new._depth_traveled

    def take_reference(self, ras_new: 'ResolvedAttributeSet') -> None:
        if self.ras != ras_new:
            if ras_new:
                ras_new._add_ref()
            if self.ras:
                self.ras._release()
            self.ras = ras_new

    def give_reference(self) -> Optional['ResolvedAttributeSet']:
        ras_ref = self.ras
        if self.ras:
            self.ras._release()
            if self.ras._ref_cnt == 0:
                self.ras = None

        return ras_ref

    def own_one(self, ra: 'ResolvedAttribute') -> None:
        # Save the current context.
        att_ctx = self.ras.attribute_context
        self.take_reference(ResolvedAttributeSet())
        self.ras.merge(ra, ra.att_ctx)
        # Reapply the old attribute context.
        self.ras.attribute_context = att_ctx

    def apply_traits(self, arc: 'AttributeResolutionContext') -> None:
        if self.ras and arc and arc.traits_to_apply:
            self.take_reference(self.ras.apply_traits(arc.traits_to_apply, arc.res_opt, arc.res_guide, arc.actions_modify))

    def generate_applier_attributes(self, arc: 'AttributeResolutionContext', apply_traits_to_new: bool) -> None:
        if not arc or not arc.applier_caps:
            return

        if not self.ras:
            self.take_reference(ResolvedAttributeSet())

        # make sure all of the 'source' attributes know about this context.
        resolved_set = self.ras._set
        if resolved_set is not None:
            for ra in resolved_set:
                ra.arc = arc

            # the resolution guidance may be asking for a one time 'take' or avoid of attributes from the source
            # this also can re-order the attributes
            if arc.res_guide and arc.res_guide.selects_sub_attribute and \
                    arc.res_guide.selects_sub_attribute.selects == 'some' and \
                    (arc.res_guide.selects_sub_attribute.selects_some_take_names or arc.res_guide.selects_sub_attribute.selects_some_avoid_names):
                # we will make a new resolved attribute set from the 'take' list
                take_set = []  # type: List[ResolvedAttribute]
                selects_some_take_names = arc.res_guide.selects_sub_attribute.selects_some_take_names  # type: List[str]
                selects_some_avoid_names = arc.res_guide.selects_sub_attribute.selects_some_avoid_names  # type: List[str]

                if selects_some_take_names and not selects_some_avoid_names:
                    # make an index that goes from name to insertion order
                    inverted = {}  # type: Dictionary[str, int]
                    for index, resolved_attribute in enumerate(resolved_set):
                        inverted[resolved_attribute._resolved_name] = index

                    for name in selects_some_take_names:
                        # if in the original set of attributes, take it in the new order
                        if name in inverted:
                            take_set.append(resolved_set[inverted[name]])

                if selects_some_avoid_names:
                    # make a quick look up of avoid names
                    avoid = set(selects_some_avoid_names)  # type: Set[str]

                    for resolved_attribute in resolved_set:
                        # only take the ones not in avoid the list given
                        if resolved_attribute._resolved_name not in avoid:
                            take_set.append(resolved_attribute)

                # replace the guts of the resolvedAttributeSet with this
                self.ras.alter_set_order_and_scope(take_set)

        # get the new atts and then add them one at a time into this set.
        new_atts = self._get_applier_generated_attributes(arc, True, apply_traits_to_new)
        if new_atts:
            ras = self.ras
            for new_att in new_atts:
                # here we want the context that was created in the appliers.
                ras = ras.merge(new_att, new_att.att_ctx)

            self.take_reference(ras)

    def remove_requested_atts(self) -> None:
        if self.ras:
            marker = (0, self.inherited_mark)  # type: Tuple[int, int]
            self.take_reference(self.ras.remove_requested_atts(marker))
            self.inherited_mark = marker[1]

    def mark_inherited(self) -> None:
        if not self.ras or not self.ras._set:
            self.inherited_mark = 0
            return

        def count_set(ras_sub: 'ResolvedAttributeSet', offset: int) -> int:
            last = offset
            if ras_sub and ras_sub._set:
                for ra in ras_sub._set:
                    if isinstance(ra.target, ResolvedAttributeSet) and ra.target._set:
                        last = count_set(cast('ResolvedAttributeSet', ra.target), last)
                    else:
                        last += 1

            return last

        self.inherited_mark = count_set(self.ras, 0)

    def mark_order(self) -> None:
        def mark_set(ras_sub: 'ResolvedAttributeSet', inherited_mark: int, offset: int) -> int:
            last = offset
            if ras_sub and ras_sub._set:
                ras_sub.insert_order = last
                for ra in ras_sub._set:
                    if isinstance(ra.target, ResolvedAttributeSet) and ra.target._set:
                        last = mark_set(cast('ResolvedAttributeSet', ra.target), inherited_mark, last)
                    else:
                        if last >= inherited_mark:
                            ra.insert_order = last
                        last += 1

            return last

        mark_set(self.ras, self.inherited_mark, 0)

    def _get_applier_generated_attributes(self, arc: 'AttributeResolutionContext', clear_state: bool, apply_modifiers: bool) \
            -> Optional[List['ResolvedAttribute']]:
        if not self.ras or self.ras._set is None or not arc or not arc.applier_caps:
            return None

        caps = arc.applier_caps

        if not caps.can_attribute_add and not caps.can_group_add and not caps.can_round_add:
            return None

        from cdm.objectmodel import CdmAttributeContext

        res_att_out = []  # type: List[ResolvedAttribute]

        # This function constructs a 'plan' for building up the resolved attributes that get generated from a set of
        # traits being applied to a set of attributes. It manifests the plan into an array of resolved attributes there
        # are a few levels of hierarchy to consider.
        # 1. Once per set of attributes, the traits may want to generate attributes. This is an attribute that is somehow
        #    descriptive of the whole set, even if it has repeating patterns, like the count for an expanded array.
        # 2. It is possible that some traits (like the array expander) want to keep generating new attributes for some run.
        #    Each time they do this is considered a 'round'the traits are given a chance to generate attributes once per round.
        #    Every set gets at least one round, so these should be the attributes that describe the set of other attributes.
        #    For example, the foreign key of a relationship or the 'class' of a polymorphic type, etc.
        # 3. For each round, there are new attributes created based on the resolved attributes from the previous round
        #    (or the starting atts for this set) the previous round attribute need to be 'done'.
        #    Having traits applied before they are used as sources for the current round.
        #    The goal here is to process each attribute completely before moving on to the next one

        # That may need to start out clean.
        if clear_state:
            for ra in self.ras._set:
                ra.applier_state = None

        # make an attribute context to hold attributes that are generated from appliers
        # there is a context for the entire set and one for each 'round' of applications that happen
        att_ctx_container_group = self.ras.attribute_context  # type: CdmAttributeContext
        if att_ctx_container_group:
            acp = AttributeContextParameters(
                under=att_ctx_container_group,
                type=CdmAttributeContextType.GENERATED_SET,
                name='_generatedAttributeSet')
            att_ctx_container_group = CdmAttributeContext._create_child_under(arc.res_opt, acp)

        att_ctx_container = att_ctx_container_group  # type: CdmAttributeContext

        def make_resolved_attribute(res_att_source: 'ResolvedAttribute', action: 'AttributeResolutionApplier',
                                    query_add: 'ApplierQuery', do_add: 'ApplierAction', state: str) -> 'ApplierContext':
            app_ctx = ApplierContext()
            app_ctx.state = state
            app_ctx.res_opt = arc.res_opt
            app_ctx.att_ctx = att_ctx_container
            app_ctx.res_att_source = res_att_source
            app_ctx.res_guide = arc.res_guide

            if res_att_source and isinstance(res_att_source.target, ResolvedAttributeSet) and cast('ResolvedAttributeSet', res_att_source.target)._set:
                return app_ctx  # Makes no sense for a group.

            # Will something add?
            if query_add(app_ctx):
                # May want to make a new attribute group.
                # make the 'new' attribute look like any source attribute for the duration of this call to make a context. there could be state needed
                app_ctx.res_att_new = res_att_source
                if self.ras.attribute_context and action._will_create_context and action._will_create_context(app_ctx):
                    action._do_create_context(app_ctx)

                # Make a new resolved attribute as a place to hold results.
                app_ctx.res_att_new = ResolvedAttribute(app_ctx.res_opt, None, None, app_ctx.att_ctx)

                # Copy state from source.
                if res_att_source and res_att_source.applier_state:
                    app_ctx.res_att_new.applier_state = res_att_source.applier_state._copy()
                else:
                    app_ctx.res_att_new.applier_state = ApplierState()

                # If applying traits, then add the sets traits as a staring point.
                if apply_modifiers:
                    app_ctx.res_att_new.resolved_traits = arc.traits_to_apply.deep_copy()

                # Make it
                do_add(app_ctx)

                # Combine resolution guidance for this set with anything new from the new attribute.
                app_ctx.res_guide_new = app_ctx.res_guide._combine_resolution_guidance(app_ctx.res_guide_new)

                app_ctx.res_att_new.arc = AttributeResolutionContext(arc.res_opt, app_ctx.res_guide_new, app_ctx.res_att_new.resolved_traits)

                if apply_modifiers:
                    # Add the sets traits back in to this newly added one.
                    app_ctx.res_att_new.resolved_traits = app_ctx.res_att_new.resolved_traits.merge_set(arc.traits_to_apply)

                    # Be sure to use the new arc, the new attribute may have added actions. For now, only modify and
                    # remove will get acted on because recursion. Do all of the modify traits.
                    if app_ctx.res_att_new.arc.applier_caps.can_attribute_modify:
                        # Modify acts on the source and we should be done with it.
                        app_ctx.res_att_source = app_ctx.res_att_new

                        for mod_act in app_ctx.res_att_new.arc.actions_modify:
                            if mod_act._will_attribute_modify(app_ctx):
                                mod_act._do_attribute_modify(app_ctx)
                app_ctx.res_att_new.complete_context(app_ctx.res_opt)

            return app_ctx

        # Get the one time atts.
        if caps.can_group_add and arc.actions_group_add:
            for action in arc.actions_group_add:
                app_ctx = make_resolved_attribute(None, action, action._will_group_add, action._do_group_add, 'group')
                # Save it.
                if app_ctx and app_ctx.res_att_new:
                    res_att_out.append(app_ctx.res_att_new)

        # Now starts a repeating pattern of rounds. First step is to get attribute that are descriptions of the round.
        # Do this once and then use them as the first entries in the first set of 'previous' atts for the loop.

        # make an attribute context to hold attributes that are generated from appliers in this round
        round_num = 0
        if att_ctx_container_group:
            acp = AttributeContextParameters(
                under=att_ctx_container_group,
                type=CdmAttributeContextType.GENERATED_ROUND,
                name='_generatedAttributeRound0')
            att_ctx_container = CdmAttributeContext._create_child_under(arc.res_opt, acp)

        res_atts_last_round = []  # type: List[ResolvedAttribute]
        if caps.can_round_add and arc.actions_round_add:
            for action in arc.actions_round_add:
                app_ctx = make_resolved_attribute(None, action, action._will_round_add, action._do_round_add, 'round')
                # Save it.
                if app_ctx and app_ctx.res_att_new:
                    # Overall list.
                    res_att_out.append(app_ctx.res_att_new)
                    # Previous list.
                    res_atts_last_round.append(app_ctx.res_att_new)

        # The first per-round set of attributes is the set owned by this object.
        res_atts_last_round += self.ras._set

        # Now loop over all of the previous atts until they all say 'stop'.
        if res_atts_last_round:
            continues = 1
            while continues:
                continues = 0
                res_att_this_round = []  # type: List[ResolvedAttribute]
                if caps.can_attribute_add:
                    for att in res_atts_last_round:
                        if arc.actions_attribute_add:
                            for action in arc.actions_attribute_add:
                                app_ctx = make_resolved_attribute(att, action, action._will_attribute_add, action._do_attribute_add, 'detail')
                                # Save it
                                if app_ctx and app_ctx.res_att_new:
                                    # Overall list.
                                    res_att_out.append(app_ctx.res_att_new)
                                    res_att_this_round.append(app_ctx.res_att_new)
                                    if app_ctx.is_continue:
                                        continues += 1
                res_atts_last_round = res_att_this_round

                round_num += 1
                if att_ctx_container_group:
                    acp = AttributeContextParameters(
                        under=att_ctx_container_group,
                        type=CdmAttributeContextType.GENERATED_ROUND,
                        name='_generatedAttributeRound{}'.format(round_num))
                    att_ctx_container = CdmAttributeContext._create_child_under(arc.res_opt, acp)

        return res_att_out
