# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import cast, TYPE_CHECKING

from cdm.enums import CdmAttributeContextType

from .applier_state import ApplierState
from .attribute_resolution_applier import AttributeResolutionApplier
from .attribute_resolution_directive_set import AttributeResolutionDirectiveSet
from .attribute_context_parameters import AttributeContextParameters

if TYPE_CHECKING:
    from cdm.objectmodel import CdmAttributeContext, CdmAttributeDefinition, CdmTraitDefinition, CdmTraitReference
    from cdm.objectmodel.cdm_attribute_resolution_guidance_def import CdmAttributeResolutionGuidanceDefinition
    from . import ApplierContext, ResolveOptions


def _create_child_under(res_opt: 'ResolveOptions', acp: 'AttributeContextParameters') -> 'CdmAttributeContext':
    from cdm.objectmodel.cdm_attribute_context import CdmAttributeContext

    return CdmAttributeContext._create_child_under(res_opt, acp)


def _is_removed_builder():
    def will_remove(on_step: 'ApplierContext') -> bool:  # pylint: disable=unused-argument
        return True

    _is_removed = AttributeResolutionApplier()
    _is_removed._match_name = 'is.removed'
    _is_removed._priority = 10
    _is_removed._overrides_base = False
    _is_removed._will_remove = will_remove
    return _is_removed


_is_removed = _is_removed_builder()


def _does_reference_entity_builder():
    def will_remove(app_ctx: 'ApplierContext') -> bool:  # pylint: disable=unused-argument
        # Return always false for the time being.
        # visible = True
        # if app_ctx.res_att_source:
        #     # All others go away.
        #     visible = False
        #     if app_ctx.res_att_source.target == app_ctx.res_guide.entity_by_reference.foreign_key_attribute:
        #         visible = True
        return False

    def will_round_add(app_ctx: 'ApplierContext') -> bool:  # pylint: disable=unused-argument
        return True

    def do_round_add(app_ctx: 'ApplierContext') -> None:
        # Get the added attribute and applied trait.
        sub = cast('CdmAttributeDefinition', app_ctx.res_guide.entity_by_reference.foreign_key_attribute)
        app_ctx.res_att_new.target = sub
        # Use the default name.
        app_ctx.res_att_new.resolved_name = sub.name
        # Add the trait that tells them what this means.
        if not sub.applied_traits or not next(filter(lambda atr: atr.fetch_object_definition_name() == 'is.linkedEntity.identifier', sub.applied_traits), False):
            sub.applied_traits.append('is.linkedEntity.identifier', True)

        # Get the resolved traits from attribute.
        app_ctx.res_att_new.resolved_traits = sub._fetch_resolved_traits(app_ctx.res_opt)
        app_ctx.res_guide_new = sub.resolution_guidance
        if app_ctx.res_att_new.resolved_traits:
            app_ctx.res_att_new.resolved_traits = app_ctx.res_att_new.resolved_traits.deep_copy()

    def will_create_context(app_ctx: 'ApplierContext') -> bool:  # pylint: disable=unused-argument
        return True

    def do_create_context(app_ctx: 'ApplierContext') -> None:
        # Make a new attribute context to differentiate this supporting att.
        acp = AttributeContextParameters()
        acp._under = app_ctx.att_ctx
        acp._type = CdmAttributeContextType.ADDED_ATTRIBUTE_IDENTITY
        acp._name = '_foreignKey'

        app_ctx.att_ctx = _create_child_under(app_ctx.res_opt, acp)

    _does_reference_entity = AttributeResolutionApplier()
    _does_reference_entity._match_name = 'does.referenceEntity'
    _does_reference_entity._priority = 4
    _does_reference_entity._overrides_base = True
    _does_reference_entity._will_remove = will_remove
    _does_reference_entity._will_round_add = will_round_add
    _does_reference_entity._do_round_add = do_round_add
    _does_reference_entity._will_create_context = will_create_context
    _does_reference_entity._do_create_context = do_create_context
    return _does_reference_entity


_does_reference_entity = _does_reference_entity_builder()


def _does_add_supporting_attribute_builder():
    def will_attribute_add(app_ctx: 'ApplierContext') -> bool:  # pylint: disable=unused-argument
        return True

    def do_attribute_add(app_ctx: 'ApplierContext') -> None:
        # Get the added attribute and applied trait.
        sub = cast('CdmAttributeDefinition', app_ctx.res_guide.add_supporting_attribute)
        sub = cast('CdmAttributeDefinition', sub.copy(app_ctx.res_opt))
        # Use the default name.
        app_ctx.res_att_new.resolved_name = sub.name
        # Add a supporting trait to this attribute.
        sup_trait_ref = cast('CdmTraitReference', sub.applied_traits.append('is.addedInSupportOf', False))
        sup_trait_def = cast('CdmTraitDefinition', sup_trait_ref.fetch_object_definition(app_ctx.res_opt))

        # Get the resolved traits from attribute.
        app_ctx.res_att_new.resolved_traits = sub._fetch_resolved_traits(app_ctx.res_opt)
        # Assumes some things, like the argument name. Probably a dumb design should just take the name and assume the
        # trait too. That simplifies the source docs.
        supporting = '(unspecified)'
        if app_ctx.res_att_source:
            supporting = app_ctx.res_att_source.resolved_name

        app_ctx.res_att_new.resolved_traits = app_ctx.res_att_new.resolved_traits.set_trait_parameter_value(
            app_ctx.res_opt, sup_trait_def, 'inSupportOf', supporting)

        app_ctx.res_att_new.target = sub
        app_ctx.res_guide_new = sub.resolution_guidance

    def will_create_context(app_ctx: 'ApplierContext') -> bool:  # pylint: disable=unused-argument
        return True

    def do_create_context(app_ctx: 'ApplierContext') -> None:
        # Make a new attribute context to differentiate this supporting att.
        acp = AttributeContextParameters()
        acp._under = app_ctx.att_ctx
        acp._type = CdmAttributeContextType.ADDED_ATTRIBUTE_SUPPORTING
        acp._name = 'supporting_' + app_ctx.res_att_source.resolved_name
        acp._regarding = cast('CdmAttributeDefinition', app_ctx.res_att_source.target)

        app_ctx.att_ctx = _create_child_under(app_ctx.res_opt, acp)

    _does_add_supporting_attribute = AttributeResolutionApplier()
    _does_add_supporting_attribute._match_name = 'does.addSupportingAttribute'
    _does_add_supporting_attribute._priority = 8
    _does_add_supporting_attribute._overrides_base = True
    _does_add_supporting_attribute._will_attribute_add = will_attribute_add
    _does_add_supporting_attribute._do_attribute_add = do_attribute_add
    _does_add_supporting_attribute._will_create_context = will_create_context
    _does_add_supporting_attribute._do_create_context = do_create_context
    return _does_add_supporting_attribute


_does_add_supporting_attribute = _does_add_supporting_attribute_builder()


def _does_impose_directives_builder():
    def will_alter_directives(res_opt: 'ResolveOptions', res_guide: 'CdmAttributeResolutionGuidanceDefinition') -> bool:  # pylint: disable=unused-argument
        return True

    def do_alter_directives(res_opt: 'ResolveOptions', res_guide: 'CdmAttributeResolutionGuidanceDefinition') -> None:  # pylint: disable=unused-argument
        all_added = res_guide.imposed_directives
        if all_added and res_opt.directives:
            res_opt.directives = res_opt.directives.copy()
            for d in all_added:
                res_opt.directives.add(d)

    _does_impose_directives = AttributeResolutionApplier()
    _does_impose_directives._match_name = 'does.imposeDirectives'
    _does_impose_directives._priority = 1
    _does_impose_directives._overrides_base = True
    _does_impose_directives._will_alter_directives = will_alter_directives
    _does_impose_directives._do_alter_directives = do_alter_directives
    return _does_impose_directives


_does_impose_directives = _does_impose_directives_builder()


def _does_remove_directives_builder():
    def will_alter_directives(res_opt: 'ResolveOptions', res_guide: 'CdmAttributeResolutionGuidanceDefinition') -> bool:  # pylint: disable=unused-argument
        return True

    def do_alter_directives(res_opt: 'ResolveOptions', res_guide: 'CdmAttributeResolutionGuidanceDefinition') -> None:  # pylint: disable=unused-argument
        all_removed = res_guide.removed_directives
        if all_removed and res_opt.directives:
            res_opt.directives = res_opt.directives.copy()
            for d in all_removed:
                res_opt.directives.delete(d)

    _does_remove_directives = AttributeResolutionApplier()
    _does_remove_directives._match_name = 'does.removeDirectives'
    _does_remove_directives._priority = 2
    _does_remove_directives._overrides_base = True
    _does_remove_directives._will_alter_directives = will_alter_directives
    _does_remove_directives._do_alter_directives = do_alter_directives
    return _does_remove_directives


_does_remove_directives = _does_remove_directives_builder()


def _does_select_attributes_builder():
    def will_alter_directives(res_opt: 'ResolveOptions', res_guide: 'CdmAttributeResolutionGuidanceDefinition') -> bool:  # pylint: disable=unused-argument
        return res_guide.selects_sub_attribute.selects == 'one'

    def do_alter_directives(res_opt: 'ResolveOptions', res_guide: 'CdmAttributeResolutionGuidanceDefinition') -> None:  # pylint: disable=unused-argument
        res_opt.directives = res_opt.directives.copy() if res_opt.directives else AttributeResolutionDirectiveSet()
        res_opt.directives.add('selectOne')

    def will_round_add(app_ctx: 'ApplierContext') -> bool:
        dirs = app_ctx.res_opt.directives
        selects_one = dirs is not None and dirs.has('selectOne')
        structured = dirs is not None and dirs.has('structured')

        # When one class is being pulled from a list of them, add the class attribute unless this is a structured
        # output (assumes they know the class).
        return selects_one and not structured

    def do_round_add(app_ctx: 'ApplierContext') -> None:
        # Get the added attribute and applied trait.
        sub = cast('CdmAttributeDefinition', app_ctx.res_guide.selects_sub_attribute.selected_type_attribute)
        app_ctx.res_att_new.target = sub
        app_ctx.res_att_new.applier_state._flex_remove = False
        # Use the default name.
        app_ctx.res_att_new.resolved_name = sub.name
        # Add the trait that tells them what this means.
        if not sub.applied_traits or next(filter(lambda atr: atr.fetch_object_definition_name() == 'is.linkedEntity.name', sub.applied_traits), False):
            sub.applied_traits.append('is.linkedEntity.name', True)

        # Get the resolved traits from attribute.
        app_ctx.res_att_new.resolved_traits = sub._fetch_resolved_traits(app_ctx.res_opt)
        app_ctx.res_guide_new = sub.resolution_guidance

        # make this code create a context for any copy of this attribute that gets repeated in an array
        app_ctx.res_att_new.applier_state._array_specialized_context = _does_select_attributes._do_create_context

    def will_create_context(app_ctx: 'ApplierContext') -> bool:
        dirs = app_ctx.res_opt.directives
        selects_one = dirs is not None and dirs.has('selectOne')
        structured = dirs is not None and dirs.has('structured')
        return selects_one and not structured

    def do_create_context(app_ctx: 'ApplierContext') -> None:
        # Make a new attributeContext to differentiate this supporting att.
        acp = AttributeContextParameters()
        acp._under = app_ctx.att_ctx
        acp._type = CdmAttributeContextType.ADDED_ATTRIBUTE_SELECTED_TYPE
        acp._name = '_selectedEntityName'

        app_ctx.att_ctx = _create_child_under(app_ctx.res_opt, acp)

    _does_select_attributes = AttributeResolutionApplier()
    _does_select_attributes._match_name = 'does.selectAttributes'
    _does_select_attributes._priority = 4
    _does_select_attributes._overrides_base = False
    _does_select_attributes._will_alter_directives = will_alter_directives
    _does_select_attributes._do_alter_directives = do_alter_directives
    _does_select_attributes._will_round_add = will_round_add
    _does_select_attributes._do_round_add = do_round_add
    _does_select_attributes._will_create_context = will_create_context
    _does_select_attributes._do_create_context = do_create_context
    return _does_select_attributes


_does_select_attributes = _does_select_attributes_builder()


def _does_disambiguate_names_builder():
    def will_attribute_modify(app_ctx: 'ApplierContext') -> bool:
        return app_ctx.res_att_source is not None and not app_ctx.res_opt.directives.has('structured')

    def do_attribute_modify(app_ctx: 'ApplierContext') -> None:
        if app_ctx.res_att_source:
            ren_format = app_ctx.res_guide.rename_format
            state = app_ctx.res_att_source.applier_state
            ordinal = str(state._flex_current_ordinal) if state and state._flex_current_ordinal is not None else ''
            format_length = len(ren_format)
            if not ren_format or not format_length:
                return

            # Parse the format looking for positions of {a} and {o} and text chunks around them there are only 5 possibilies.
            idx_a = ren_format.find('{a}')
            upper = False

            if idx_a < 0:
                idx_a = ren_format.find('{A}')
                upper = True

            idx_o = ren_format.find('{o}')

            def replace(start: int, at: int, length: int, value: str) -> str:
                new_value = value[0].upper() + value[1:] if upper and value else value
                return ren_format[start:at] + new_value + ren_format[at+3:length]

            src_name = app_ctx.res_att_source.previous_resolved_name
            if idx_a < 0 and idx_o < 0:
                result = ren_format
            elif idx_a < 0:
                result = replace(0, idx_o, format_length, ordinal)
            elif idx_o < 0:
                result = replace(0, idx_a, format_length, src_name)
            elif idx_a < idx_o:
                result = replace(0, idx_a, idx_o, src_name) + replace(idx_o, idx_o, format_length, ordinal)
            else:
                result = replace(0, idx_o, idx_a, ordinal) + replace(idx_a, idx_a, format_length, src_name)

            app_ctx.res_att_source.resolved_name = result

    _does_disambiguate_names = AttributeResolutionApplier()
    _does_disambiguate_names._match_name = 'does.disambiguateNames'
    _does_disambiguate_names._priority = 9
    _does_disambiguate_names._overrides_base = True
    _does_disambiguate_names._will_attribute_modify = will_attribute_modify
    _does_disambiguate_names._do_attribute_modify = do_attribute_modify
    return _does_disambiguate_names


_does_disambiguate_names = _does_disambiguate_names_builder()


def _does_reference_entity_via_builder():
    def will_remove(app_ctx: 'ApplierContext') -> bool:
        dirs = app_ctx.res_opt.directives
        is_norm = dirs is not None and dirs.has('normalized')
        is_array = dirs is not None and dirs.has('isArray')
        is_ref_only = dirs is not None and dirs.has('referenceOnly')
        always_add = app_ctx.res_guide.entity_by_reference.always_include_foreign_key
        do_fk = (always_add or is_ref_only) and (not is_norm or not is_array)

        visible = True
        if do_fk and app_ctx.res_att_source:
            # If in reference only mode, then remove everything that isn't marked to retain.
            visible = always_add or (app_ctx.res_att_source.applier_state and not app_ctx.res_att_source.applier_state._flex_remove)

        return not visible

    def will_round_add(app_ctx: 'ApplierContext') -> bool:
        dirs = app_ctx.res_opt.directives
        is_norm = dirs is not None and dirs.has('normalized')
        is_array = dirs is not None and dirs.has('isArray')
        is_ref_only = dirs is not None and dirs.has('referenceOnly')
        always_add = app_ctx.res_guide.entity_by_reference.always_include_foreign_key is True

        # Add a foreign key and remove everything else when asked to do so. However, avoid doing this for normalized
        # arrays, since they remove all atts anyway.
        return (is_ref_only or always_add) and (not is_norm or not is_array)

    def do_round_add(app_ctx: 'ApplierContext') -> None:
        # Get the added attribute and applied trait.
        sub = cast('CdmAttributeDefinition', app_ctx.res_guide.entity_by_reference.foreign_key_attribute)
        app_ctx.res_att_new.target = sub
        app_ctx.res_att_new.applier_state._flex_remove = False
        # Use the default name.
        app_ctx.res_att_new.resolved_name = sub.name

        # Add the trait that tells them what this means.
        if not sub.applied_traits or next(filter(lambda atr: atr.fetch_object_definition_name() == 'is.linkedEntity.identifier', sub.applied_traits), False):
            sub.applied_traits.append('is.linkedEntity.identifier', True)

        # Get the resolved traits from attribute, make a copy to avoid conflicting on the param values
        app_ctx.res_guide_new = sub.resolution_guidance
        app_ctx.res_att_new.resolved_traits = sub._fetch_resolved_traits(app_ctx.res_opt)
        if app_ctx.res_att_new.resolved_traits:
            app_ctx.res_att_new.resolved_traits = app_ctx.res_att_new.resolved_traits.deep_copy()

        # make this code create a context for any copy of this attribute that gets repeated in an array
        app_ctx.res_att_new.applier_state._array_specialized_context = _does_reference_entity_via._do_create_context

    def will_create_context(app_ctx: 'ApplierContext') -> bool:
        dirs = app_ctx.res_opt.directives
        is_norm = dirs is not None and dirs.has('normalized')
        is_array = dirs is not None and dirs.has('isArray')
        is_ref_only = dirs is not None and dirs.has('referenceOnly')
        always_add = app_ctx.res_guide.entity_by_reference.always_include_foreign_key

        return (is_ref_only or always_add) and (not is_norm or not is_array)

    def do_create_context(app_ctx: 'ApplierContext') -> None:
        # Make a new attribute context to differentiate this supporting att.
        acp = AttributeContextParameters()
        acp._under = app_ctx.att_ctx
        acp._type = CdmAttributeContextType.ADDED_ATTRIBUTE_IDENTITY
        acp._name = '_foreignKey'

        app_ctx.att_ctx = _create_child_under(app_ctx.res_opt, acp)

    _does_reference_entity_via = AttributeResolutionApplier()
    _does_reference_entity_via._match_name = 'does.referenceEntityVia'
    _does_reference_entity_via._priority = 4
    _does_reference_entity_via._overrides_base = False
    _does_reference_entity_via._will_remove = will_remove
    _does_reference_entity_via._will_round_add = will_round_add
    _does_reference_entity_via._do_round_add = do_round_add
    _does_reference_entity_via._will_create_context = will_create_context
    _does_reference_entity_via._do_create_context = do_create_context
    return _does_reference_entity_via


_does_reference_entity_via = _does_reference_entity_via_builder()


def _does_explain_array_builder():

    def will_group_add(app_ctx: 'ApplierContext') -> bool:
        dirs = app_ctx.res_opt.directives
        is_norm = dirs is not None and dirs.has('normalized')
        is_array = dirs is not None and dirs.has('isArray')
        is_structured = dirs is not None and dirs.has('structured')

        # Expand array and add a count if this is an array and it isn't structured or normalized.
        # Structured assumes they know about the array size from the structured data format.
        # Normalized means that arrays of entities shouldn't be put inline, they should reference or include from the
        # 'other' side of that 1:M relationship.
        return is_array and not is_norm and not is_structured

    def do_group_add(app_ctx: 'ApplierContext') -> None:
        # Get the added attribute and applied trait.
        sub = cast('CdmAttributeDefinition', app_ctx.res_guide.expansion.count_attribute)
        app_ctx.res_att_new.target = sub
        app_ctx.res_att_new.applier_state._flex_remove = False
        # Use the default name.
        app_ctx.res_att_new.resolved_name = sub.name
        # Add the trait that tells them what this means.
        if not sub.applied_traits or next(filter(lambda atr: atr.fetch_object_definition_name() == 'is.linkedEntity.array.count', sub.applied_traits), False):
            sub.applied_traits.append('is.linkedEntity.array.count', True)

        # Get the resolved traits from attribute.
        app_ctx.res_att_new.resolved_traits = sub._fetch_resolved_traits(app_ctx.res_opt)
        app_ctx.res_guide_new = sub.resolution_guidance

    def will_create_context(app_ctx: 'ApplierContext') -> bool:  # pylint: disable=unused-argument
        return True

    def do_create_context(app_ctx: 'ApplierContext') -> None:
        if app_ctx.res_att_new and app_ctx.res_att_new.applier_state and app_ctx.res_att_new.applier_state._array_specialized_context:
            # this attribute may have a special context that it wants, use that instead
            app_ctx.res_att_new.applier_state._array_specialized_context(app_ctx)
        else:
            ctx_type = CdmAttributeContextType.ATTRIBUTE_DEFINITION  # type: CdmAttributeContextType
            # if this is the group add, then we are adding the counter
            if app_ctx.state == 'group':
                ctx_type = CdmAttributeContextType.ADDED_ATTRIBUTE_EXPANSION_TOTAL
            acp = AttributeContextParameters()
            acp._under = app_ctx.att_ctx
            acp._type = ctx_type
            app_ctx.att_ctx = _create_child_under(app_ctx.res_opt, acp)

    def will_attribute_add(app_ctx: 'ApplierContext') -> bool:
        dirs = app_ctx.res_opt.directives
        is_norm = dirs is not None and dirs.has('normalized')
        is_array = dirs is not None and dirs.has('isArray')
        is_structured = dirs is not None and dirs.has('structured')

        return is_array and not is_norm and not is_structured

    def do_attribute_add(app_ctx: 'ApplierContext') -> None:
        app_ctx.is_continue = False
        if not app_ctx.res_att_source:
            return

        state = app_ctx.res_att_new.applier_state
        if state._array_final_ordinal is None:
            # Get the fixed size (not set means no fixed size).
            fixed_size = 1
            if app_ctx.res_guide.expansion and app_ctx.res_guide.expansion.maximum_expansion:
                fixed_size = app_ctx.res_guide.expansion.maximum_expansion
            initial = 0
            if app_ctx.res_guide.expansion and app_ctx.res_guide.expansion.starting_ordinal:
                initial = app_ctx.res_guide.expansion.starting_ordinal
            fixed_size += initial

            # Marks this att as the template for expansion.
            state._array_template = app_ctx.res_att_source
            if not app_ctx.res_att_source.applier_state:
                app_ctx.res_att_source.applier_state = ApplierState()
            app_ctx.res_att_source.applier_state._flex_remove = True

            # Give back the attribute that holds the count first.
            state._array_initial_ordinal = initial
            state._array_final_ordinal = fixed_size - 1
            state._flex_current_ordinal = initial
        else:
            state._flex_current_ordinal = state._flex_current_ordinal + 1

        if state._flex_current_ordinal <= state._array_final_ordinal:
            template = cast('ResolvedAttribute', state._array_template)
            app_ctx.res_att_new.target = template.target
            # Copy the template.
            app_ctx.res_att_new.resolved_name = state._array_template.previous_resolved_name
            app_ctx.res_att_new.resolved_traits = template.resolved_traits.deep_copy()
            # Just take the source, because this is not a new attribute that may have different settings.
            app_ctx.res_guide_new = app_ctx.res_guide
            app_ctx.is_continue = state._flex_current_ordinal < state._array_final_ordinal

    def will_alter_directives(res_opt: 'ResolveOptions', res_guide: 'CdmAttributeResolutionGuidanceDefinition') -> bool:  # pylint: disable=unused-argument
        return res_guide.cardinality is not None and res_guide.cardinality == 'many'

    def do_alter_directives(res_opt: 'ResolveOptions', res_guide: 'CdmAttributeResolutionGuidanceDefinition') -> None:  # pylint: disable=unused-argument
        res_opt.directives = res_opt.directives.copy() if res_opt.directives else AttributeResolutionDirectiveSet()
        res_opt.directives.add('isArray')

    def will_remove(app_ctx: 'ApplierContext') -> bool:
        dirs = app_ctx.res_opt.directives
        is_norm = dirs is not None and dirs.has('normalized')
        is_array = dirs is not None and dirs.has('isArray')

        # Remove the 'template' attributes that got copied on expansion if they come here. Also, normalized means that
        # arrays of entities shouldn't be put inline. Only remove the template attributes that seeded the array expansion.
        is_template = app_ctx.res_att_source.applier_state and app_ctx.res_att_source.applier_state._flex_remove
        return is_array and (is_template or is_norm)

    _does_explain_array = AttributeResolutionApplier()
    _does_explain_array._match_name = 'does.explainArray'
    _does_explain_array._priority = 6
    _does_explain_array._overrides_base = False
    _does_explain_array._will_group_add = will_group_add
    _does_explain_array._do_group_add = do_group_add
    _does_explain_array._will_create_context = will_create_context
    _does_explain_array._do_create_context = do_create_context
    _does_explain_array._will_attribute_add = will_attribute_add
    _does_explain_array._do_attribute_add = do_attribute_add
    _does_explain_array._will_alter_directives = will_alter_directives
    _does_explain_array._do_alter_directives = do_alter_directives
    _does_explain_array._will_remove = will_remove
    return _does_explain_array


_does_explain_array = _does_explain_array_builder()