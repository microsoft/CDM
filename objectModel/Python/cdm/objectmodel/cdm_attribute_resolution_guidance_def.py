# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List, Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.utilities import ResolveOptions

from .cdm_object_simple import CdmObjectSimple

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmTypeAttributeDefinition
    from cdm.utilities import FriendlyFormatNode, VisitCallback


class CdmAttributeResolutionGuidance_Expansion:
    starting_ordinal = None  # type: Optional[int]

    # the greatest number of time that the attribute pattern should be repeated.
    maximum_expansion = None  # type: Optional[int]

    # The supplied attribute definition will be added to the Entity to represent the total number of instances found in the data.
    count_attribute = None  # type: Optional[CdmTypeAttributeDefinition]


class CdmAttributeResolutionGuidance_EntityByReference:
    # explicitly, is a reference allowed
    allow_reference = None  # type: Optional[bool]

    # if true, a foreign key attribute will be added to the entity even when the entity attribute is imbedded in a nested way
    always_include_foreign_key = None  # type: Optional[bool]

    # After a given depth of non-reference nesting using entity attributes, the 'referenceOnly' directive will be impose
    reference_only_after_depth = None  # type: Optional[int]

    # The supplied attribute definition will be added to the Entity to hold a foreign key value for the referenced entity.
    foreign_key_attribute = None  # type: Optional[CdmTypeAttributeDefinition]


class CdmAttributeResolutionGuidance_SelectsSubAttribute:
    # used to indicate either 'one', 'all' or 'some' sub-attributes selected.
    # When 'one' the selectedTypeAttribute will hold the name selected per record
    # when 'some' the selects_some_take_names array can contain an ordered list of the attributes to take from
    # the source entity. attributes will be added to the containing entity in the same order as this list
    # or the selects_some_avoid_names array can be used to filter out specific attribute names.
    # If both exist only the selects_some_avoid_names will be used
    selects = None  # type: Optional[str]

    # The supplied attribute definition will be added to the Entity to hold a description of
    # the single attribute that was selected from the sub-entitywhen selects is 'one'
    selected_type_attribute = None  # type: Optional[CdmTypeAttributeDefinition]

    # An ordered list of strings, one for each attribute name to take from the source entity.
    selects_some_take_names = []  # type: List[str]

    # A list of strings, one for each attribute name to NOT take from the source entity.
    selects_some_avoid_names = []  # type: List[str]


class CdmAttributeResolutionGuidanceDefinition(CdmObjectSimple):
    def __init__(self, ctx: 'CdmCorpusContext') -> None:
        super().__init__(ctx)

        # If true, this attribute definiton will be removed from the final resolved attribute list of an entity.
        self.remove_attribute = None  # type: Optional[bool]

        # A list of strings, one for each 'directive' that should be always imposed at this attribute definition
        self.imposed_directives = None  # type: Optional[List[str]]

        # A list of strings, one for each 'directive' that should be removed if previously imposed
        self.removed_directives = None  # type: Optional[List[str]]

        # The supplied attribute definition will be added to the Entity after this attribute definition with a trait indicating its supporting role on this.
        self.add_supporting_attribute = None  # type: Optional[CdmTypeAttributeDefinition]

        # If 'one' then there is a single instance of the attribute or entity used. 'many' indicates multiple instances and
        # the 'expansion' properties will describe array enumeration to use when needed.
        self.cardinality = None  # type: Optional[str]

        # format specifier for generated attribute names. May contain a single occurence of
        # ('{a} or 'A'), ('{m}' or '{M}') and '{o}'for the base (a/A)ttribute name, any (m/M)ember attributes from entities and array (o)rdinal.
        # examples: '{a}{o}.{m}' could produce 'address2.city', '{a}{o}' gives 'city1'. Using '{A}' or '{M}'
        # will uppercase the first letter of the name portions.
        self.rename_format = None  # type: Optional[str]

        # Parameters that control array expansion if inline repeating of attributes is needed.
        self.expansion = None  # type: Optional[CdmAttributeResolutionGuidance_Expansion]

        # Parameters that control the use of foreign keys to reference entity instances instead of imbedding the entity in a nested way
        self.entity_by_reference = None  # type: Optional[CdmAttributeResolutionGuidance_EntityByReference]

        # used to indicate that this attribute select either 'one' or 'all' of the sub-attributes from an entity.
        # If the 'structured' directive is set, this trait causes resolved attributes to end up in groups rather than a flattend list
        self.selects_sub_attribute = None  # type: Optional[CdmAttributeResolutionGuidance_SelectsSubAttribute]

    @property
    def object_type(self) -> CdmObjectType:
        return CdmObjectType.ATTRIBUTE_RESOLUTION_GUIDANCE_DEF

    def _combine_resolution_guidance(self, add_in: 'CdmAttributeResolutionGuidanceDefinition') -> 'CdmAttributeResolutionGuidanceDefinition':
        start_with = self
        if not add_in:
            return start_with
        if not start_with:
            return add_in

        result = CdmAttributeResolutionGuidanceDefinition(self.ctx)

        # can remove and then un-remove later
        if start_with.remove_attribute:
            if add_in.remove_attribute is None or add_in.remove_attribute:
                result.remove_attribute = True
        else:
            if add_in.remove_attribute is not None and add_in.remove_attribute:
                result.remove_attribute = True

        # copy and combine if needed
        if add_in.imposed_directives:
            if start_with.imposed_directives:
                result.imposed_directives = start_with.imposed_directives[:]
            else:
                result.imposed_directives = []
            result.imposed_directives += add_in.imposed_directives
        else:
            result.imposed_directives = start_with.imposed_directives

        if add_in.removed_directives:
            if start_with.removed_directives:
                result.removed_directives = start_with.removed_directives[:]
            else:
                result.removed_directives = []
            result.removed_directives += add_in.removed_directives
        else:
            result.removed_directives = start_with.removed_directives

        result.add_supporting_attribute = start_with.add_supporting_attribute
        if add_in.add_supporting_attribute:
            result.add_supporting_attribute = add_in.add_supporting_attribute

        result.cardinality = start_with.cardinality
        if add_in.cardinality:
            result.cardinality = add_in.cardinality

        result.rename_format = start_with.rename_format
        if add_in.rename_format:
            result.rename_format = add_in.rename_format

        # for these sub objects, ok to just use the same objects unless something is combined. assumption is that these are static during the resolution
        if add_in.expansion:
            if start_with.expansion:
                result.expansion = CdmAttributeResolutionGuidance_Expansion()
                result.expansion.starting_ordinal = start_with.expansion.starting_ordinal
                if add_in.expansion.starting_ordinal is not None:
                    result.expansion.starting_ordinal = add_in.expansion.starting_ordinal
                result.expansion.maximum_expansion = start_with.expansion.maximum_expansion
                if add_in.expansion.maximum_expansion is not None:
                    result.expansion.maximum_expansion = add_in.expansion.maximum_expansion
                result.expansion.count_attribute = start_with.expansion.count_attribute
                if add_in.expansion.count_attribute is not None:
                    result.expansion.count_attribute = add_in.expansion.count_attribute
            else:
                result.expansion = add_in.expansion
        else:
            result.expansion = start_with.expansion

        if add_in.entity_by_reference:
            if start_with.entity_by_reference:
                result.entity_by_reference = CdmAttributeResolutionGuidance_EntityByReference()
                result.entity_by_reference.always_include_foreign_key = start_with.entity_by_reference.always_include_foreign_key
                if add_in.entity_by_reference.always_include_foreign_key is not None:
                    result.entity_by_reference.always_include_foreign_key = add_in.entity_by_reference.always_include_foreign_key
                result.entity_by_reference.reference_only_after_depth = start_with.entity_by_reference.reference_only_after_depth
                if add_in.entity_by_reference.reference_only_after_depth is not None:
                    result.entity_by_reference.reference_only_after_depth = add_in.entity_by_reference.reference_only_after_depth
                result.entity_by_reference.foreign_key_attribute = start_with.entity_by_reference.foreign_key_attribute
                if add_in.entity_by_reference.foreign_key_attribute is not None:
                    result.entity_by_reference.foreign_key_attribute = add_in.entity_by_reference.foreign_key_attribute
                result.entity_by_reference.allow_reference = start_with.entity_by_reference.allow_reference
                if add_in.entity_by_reference.allow_reference is not None:
                    result.entity_by_reference.allow_reference = add_in.entity_by_reference.allow_reference
            else:
                result.entity_by_reference = add_in.entity_by_reference
        else:
            result.entity_by_reference = start_with.entity_by_reference

        if add_in.selects_sub_attribute:
            if start_with.selects_sub_attribute:
                result.selects_sub_attribute = CdmAttributeResolutionGuidance_SelectsSubAttribute()
                result.selects_sub_attribute.selected_type_attribute = start_with.selects_sub_attribute.selected_type_attribute
                if add_in.selects_sub_attribute.selected_type_attribute is not None:
                    result.selects_sub_attribute.selected_type_attribute = add_in.selects_sub_attribute.selected_type_attribute
                result.selects_sub_attribute.selects = start_with.selects_sub_attribute.selects
                if add_in.selects_sub_attribute.selects is not None:
                    result.selects_sub_attribute.selects = add_in.selects_sub_attribute.selects
                if start_with.selects_sub_attribute.selects_some_take_names or add_in.selects_sub_attribute.selects_some_take_names:
                    result.selects_sub_attribute.selects_some_take_names = []
                    if start_with.selects_sub_attribute.selects_some_take_names is not None:
                        result.selects_sub_attribute.selects_some_take_names.extend(start_with.selects_sub_attribute.selects_some_take_names)
                    if add_in.selects_sub_attribute.selects_some_take_names is not None:
                        result.selects_sub_attribute.selects_some_take_names.extend(add_in.selects_sub_attribute.selects_some_take_names)
                if start_with.selects_sub_attribute.selects_some_avoid_names or add_in.selects_sub_attribute.selects_some_avoid_names:
                    result.selects_sub_attribute.selects_some_avoid_names = []
                    if start_with.selects_sub_attribute.selects_some_avoid_names is not None:
                        result.selects_sub_attribute.selects_some_avoid_names.extend(start_with.selects_sub_attribute.selects_some_avoid_names)
                    if add_in.selects_sub_attribute.selects_some_avoid_names is not None:
                        result.selects_sub_attribute.selects_some_avoid_names.extend(add_in.selects_sub_attribute.selects_some_avoid_names)
            else:
                result.selects_sub_attribute = add_in.selects_sub_attribute
        else:
            result.selects_sub_attribute = start_with.selects_sub_attribute

        return result

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmAttributeResolutionGuidanceDefinition'] = None) -> 'CdmAttributeResolutionGuidanceDefinition':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        if not host:
            copy = CdmAttributeResolutionGuidanceDefinition(self.ctx)
        else:
            copy = host
            copy.ctx = self.ctx
            copy.expansion = None
            copy.entity_by_reference = None
            copy.selects_sub_attribute = None

        copy.remove_attribute = self.remove_attribute
        if self.imposed_directives:
            copy.imposed_directives = self.imposed_directives[:]
        if self.removed_directives:
            copy.removed_directives = self.removed_directives[:]
        copy.add_supporting_attribute = self.add_supporting_attribute.copy(res_opt) if self.add_supporting_attribute else None
        copy.cardinality = self.cardinality
        copy.rename_format = self.rename_format

        if self.expansion:
            copy.expansion = CdmAttributeResolutionGuidance_Expansion()
            copy.expansion.starting_ordinal = self.expansion.starting_ordinal
            copy.expansion.maximum_expansion = self.expansion.maximum_expansion
            copy.expansion.count_attribute = self.expansion.count_attribute

        if self.entity_by_reference:
            copy.entity_by_reference = CdmAttributeResolutionGuidance_EntityByReference()
            copy.entity_by_reference.always_include_foreign_key = self.entity_by_reference.always_include_foreign_key
            copy.entity_by_reference.reference_only_after_depth = self.entity_by_reference.reference_only_after_depth
            copy.entity_by_reference.allow_reference = self.entity_by_reference.allow_reference
            copy.entity_by_reference.foreign_key_attribute = self.entity_by_reference.foreign_key_attribute

        if self.selects_sub_attribute:
            copy.selects_sub_attribute = CdmAttributeResolutionGuidance_SelectsSubAttribute()
            copy.selects_sub_attribute.selects = self.selects_sub_attribute.selects
            copy.selects_sub_attribute.selected_type_attribute = self.selects_sub_attribute.selected_type_attribute
            copy.selects_sub_attribute.selects_some_take_names = self.selects_sub_attribute.selects_some_take_names[:]
            copy.selects_sub_attribute.selects_some_avoid_names = self.selects_sub_attribute.selects_some_avoid_names[:]

        return copy

    def _update_attribute_defaults(self, att_name: str, owner: 'CdmObject') -> None:
        # handle the cardinality and expansion group.
        # default is one, but if there is some hint of an array, make it work

        if self.cardinality is None:
            if self.expansion is not None:
                self.cardinality = 'many'
            else:
                self.cardinality = 'one'

        if self.cardinality == 'many' and self.expansion is None:
            self.expansion = CdmAttributeResolutionGuidance_Expansion()

        if self.cardinality == 'many' and self.expansion is not None:
            if self.expansion.starting_ordinal is None:
                self.expansion.starting_ordinal = 0

            if self.expansion.maximum_expansion is None:
                self.expansion.maximum_expansion = 5

            if self.expansion.count_attribute is None:
                self.expansion.count_attribute = self.ctx.corpus._fetch_artifact_attribute('count')
                self.expansion.count_attribute.owner = owner
                self.expansion.count_attribute.in_document = owner.in_document

        # entity by ref. anything mentioned?
        if self.entity_by_reference:
            if self.entity_by_reference.allow_reference is None:
                self.entity_by_reference.allow_reference = True

            if self.entity_by_reference.allow_reference:
                if self.entity_by_reference.always_include_foreign_key is None:
                    self.entity_by_reference.always_include_foreign_key = False
                if self.entity_by_reference.foreign_key_attribute is None:
                    # make up a fk
                    self.entity_by_reference.foreign_key_attribute = self.ctx.corpus._fetch_artifact_attribute('id')
                    self.entity_by_reference.foreign_key_attribute.owner = owner
                    self.entity_by_reference.foreign_key_attribute.in_document = owner.in_document

        # selects one>
        if self.selects_sub_attribute:
            if self.selects_sub_attribute.selects is None:
                self.selects_sub_attribute.selects = 'one'
            if self.selects_sub_attribute.selects == 'one':
                if self.selects_sub_attribute.selected_type_attribute is None:
                    # make up a type indicator
                    self.selects_sub_attribute.selected_type_attribute = self.ctx.corpus._fetch_artifact_attribute('type')
                    self.selects_sub_attribute.selected_type_attribute.owner = owner
                    self.selects_sub_attribute.selected_type_attribute.in_document = owner.in_document

        # only set a rename format if one is needed for arrays or added atts
        if self.rename_format is None:
            if att_name is None:  # a type attribute, so no nesting
                if self.cardinality == 'many':
                    self.rename_format = '{a}{o}'
            else:
                if self.cardinality == 'many':
                    self.rename_format = '{a}{o}{M}'
                else:
                    self.rename_format = '{a}{M}'

        if self.rename_format is not None:
            # rename format is a lie. actually only supports sub-attribute name and ordinal as 'a' and 'o'
            if att_name is not None:
                # replace the use of {a or A} with the outer attributeName
                upper = False
                index_a = self.rename_format.find('{a}')
                if index_a < 0:
                    index_a = self.rename_format.find('{A}')
                    upper = True

                if index_a >= 0:
                    if upper:
                        att_name = att_name[0].upper() + att_name[1:]
                    self.rename_format = self.rename_format[0:index_a] + att_name + self.rename_format[index_a + 3:]

                # now, use of {m/M} should be turned to {a/A}
                index_m = self.rename_format.find('{m}')
                if index_m >= 0:
                    self.rename_format = self.rename_format[0:index_m] + '{a}' + self.rename_format[index_m + 3:]
                else:
                    index_m = self.rename_format.find('{M}')
                    if index_m >= 0:
                        self.rename_format = self.rename_format[0:index_m] + '{A}' + self.rename_format[index_m + 3:]

    def validate(self) -> bool:
        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        if pre_children and pre_children(self, path_from):
            return False

        if self.add_supporting_attribute and self.add_supporting_attribute.visit('{}addSupportingAttribute/'.format(path_from), pre_children, post_children):
            return True

        if self.expansion and self.expansion.count_attribute and \
                self.expansion.count_attribute.visit('{}countAttribute/'.format(path_from), pre_children, post_children):
            return True

        if self.entity_by_reference and self.entity_by_reference.foreign_key_attribute and \
                self.entity_by_reference.foreign_key_attribute.visit('{}foreignKeyAttribute/'.format(path_from), pre_children, post_children):
            return True

        if self.selects_sub_attribute and self.selects_sub_attribute.selected_type_attribute and \
                self.selects_sub_attribute.selected_type_attribute.visit('{}selectedTypeAttribute/'.format(path_from), pre_children, post_children):
            return True

        if post_children and post_children(self, path_from):
            return True

        return False
