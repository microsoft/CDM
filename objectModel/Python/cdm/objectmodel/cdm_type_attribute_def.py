# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Any, cast, Optional, TYPE_CHECKING

from cdm.enums import CdmDataFormat, CdmObjectType
from cdm.utilities import ResolveOptions, TraitToPropertyMap, logger, Errors

from .cdm_attribute_def import CdmAttribute

if TYPE_CHECKING:
    from cdm.objectmodel import CdmAttributeContext, CdmCorpusContext, CdmDataTypeReference, CdmObjectReference, \
    CardinalitySettings
    from cdm.resolvedmodel import ResolvedAttributeSetBuilder, ResolvedEntityReferenceSet
    from cdm.utilities import FriendlyFormatNode, VisitCallback


class CdmTypeAttributeDefinition(CdmAttribute):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx, name)

        # the type attribute context.
        self.attribute_context = None  # type: Optional[CdmObjectReference]

        # the type attribute data type.
        self.data_type = None  # type: Optional[CdmDataTypeReference]

        # --- internal ---
        self._ttpm = None  # type: Optional[TraitToPropertyMap]
        self._attribute_count = 1

        self._TAG = CdmTypeAttributeDefinition.__name__

    @property
    def object_type(self) -> CdmObjectType:
        return CdmObjectType.TYPE_ATTRIBUTE_DEF

    @property
    def is_read_only(self) -> bool:
        return cast(bool, self._trait_to_property_map._fetch_property_value('isReadOnly'))

    @is_read_only.setter
    def is_read_only(self, val: bool) -> None:
        self._trait_to_property_map._update_property_value('isReadOnly', val)

    @property
    def is_nullable(self) -> bool:
        return cast(bool, self._trait_to_property_map._fetch_property_value('isNullable'))

    @is_nullable.setter
    def is_nullable(self, val: bool) -> None:
        self._trait_to_property_map._update_property_value('isNullable', val)

    @property
    def source_name(self) -> str:
        return cast(str, self._trait_to_property_map._fetch_property_value('sourceName'))

    @source_name.setter
    def source_name(self, val: str) -> None:
        self._trait_to_property_map._update_property_value('sourceName', val)

    @property
    def description(self) -> str:
        return cast(str, self._trait_to_property_map._fetch_property_value('description'))

    @description.setter
    def description(self, val: str) -> None:
        self._trait_to_property_map._update_property_value('description', val)

    @property
    def display_name(self) -> str:
        return cast(str, self._trait_to_property_map._fetch_property_value('displayName'))

    @display_name.setter
    def display_name(self, val: str) -> None:
        self._trait_to_property_map._update_property_value('displayName', val)

    @property
    def source_ordering(self) -> int:
        return cast(int, self._trait_to_property_map._fetch_property_value('sourceOrdering'))

    @source_ordering.setter
    def source_ordering(self, val: int) -> None:
        self._trait_to_property_map._update_property_value('sourceOrdering', val)

    @property
    def value_constrained_to_list(self) -> bool:
        return cast(bool, self._trait_to_property_map._fetch_property_value('valueConstrainedToList'))

    @value_constrained_to_list.setter
    def value_constrained_to_list(self, val: bool) -> None:
        self._trait_to_property_map._update_property_value('valueConstrainedToList', val)

    @property
    def is_primary_key(self) -> bool:
        return cast(bool, self._trait_to_property_map._fetch_property_value('isPrimaryKey'))

    @property
    def maximum_length(self) -> int:
        return cast(int, self._trait_to_property_map._fetch_property_value('maximumLength'))

    @maximum_length.setter
    def maximum_length(self, val: int) -> None:
        self._trait_to_property_map._update_property_value('maximumLength', val)

    @property
    def maximum_value(self) -> str:
        return cast(str, self._trait_to_property_map._fetch_property_value('maximumValue'))

    @maximum_value.setter
    def maximum_value(self, val: str) -> None:
        self._trait_to_property_map._update_property_value('maximumValue', val)

    @property
    def minimum_value(self) -> str:
        return cast(str, self._trait_to_property_map._fetch_property_value('minimumValue'))

    @minimum_value.setter
    def minimum_value(self, val: str) -> None:
        self._trait_to_property_map._update_property_value('minimumValue', val)

    @property
    def data_format(self) -> CdmDataFormat:
        return cast(CdmDataFormat, self._trait_to_property_map._fetch_property_value('dataFormat'))

    @data_format.setter
    def data_format(self, val: CdmDataFormat) -> None:
        self._trait_to_property_map._update_property_value('dataFormat', val)

    @property
    def default_value(self) -> str:
        return cast(str, self._trait_to_property_map._fetch_property_value('defaultValue'))

    @default_value.setter
    def default_value(self, val: object) -> None:
        self._trait_to_property_map._update_property_value('defaultValue', val)

    @property
    def _trait_to_property_map(self) -> 'TraitToPropertyMap':
        if not self._ttpm:
            self._ttpm = TraitToPropertyMap(self)
        return self._ttpm

    def _construct_resolved_attributes(self, res_opt: 'ResolveOptions', under: Optional['CdmAttributeContext']) -> 'ResolvedAttributeSetBuilder':
        # find and cache the complete set of attributes
        # attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
        # the datatype used as an attribute, traits applied to that datatype,
        # the purpose of the attribute, any traits applied to the attribute.
        from cdm.resolvedmodel import AttributeResolutionContext, ResolvedAttribute, ResolvedAttributeSetBuilder

        from .cdm_attribute_resolution_guidance_def import CdmAttributeResolutionGuidanceDefinition

        rasb = ResolvedAttributeSetBuilder()
        rasb.ras.attribute_context = under

        # add this attribute to the set
        # make a new one and apply any traits
        new_att = ResolvedAttribute(res_opt, self, self.name, under)
        rasb.own_one(new_att)
        rts = self._fetch_resolved_traits(res_opt)

        # this context object holds all of the info about what needs to happen to resolve these attributes.
        # make a copy and add defaults if missing
        res_guide_with_default = None
        if self.resolution_guidance is not None:
            res_guide_with_default = self.resolution_guidance.copy(res_opt)
        else:
            res_guide_with_default = CdmAttributeResolutionGuidanceDefinition(self.ctx)

        # rename_format is not currently supported for type attributes
        res_guide_with_default.rename_format = None

        res_guide_with_default._update_attribute_defaults(None)
        arc = AttributeResolutionContext(res_opt, res_guide_with_default, rts)

        # from the traits of the datatype, purpose and applied here, see if new attributes get generated
        rasb.apply_traits(arc)
        rasb.generate_applier_attributes(arc, False)  # false = don't apply these traits to added things
        # this may have added symbols to the dependencies, so merge them
        res_opt._symbol_ref_set._merge(arc.res_opt._symbol_ref_set)

        return rasb

    def _construct_resolved_traits(self, rtsb: 'ResolvedTraitSetBuilder', res_opt: 'ResolveOptions') -> None:
        from .cdm_attribute_ref import CdmAttributeReference

        # get from datatype
        if self.data_type:
            rtsb.take_reference(self.data_type._fetch_resolved_traits(res_opt))

        # get from purpose
        if self.purpose:
            rtsb.merge_traits(self.purpose._fetch_resolved_traits(res_opt))

        self._add_resolved_traits_applied(rtsb, res_opt)

        # special case for attributes, replace a default "this.attribute" with self attribute on traits that elevate attribute
        if rtsb.resolved_trait_set and rtsb.resolved_trait_set.has_elevated:
            replacement = CdmAttributeReference(self.ctx, self.name, True)
            replacement.ctx = self.ctx
            replacement.explicit_reference = self
            rtsb.replace_trait_parameter_value(res_opt, 'does.elevateAttribute', 'attribute', 'this.attribute', replacement)

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmTypeAttributeDefinition'] = None) -> 'CdmTypeAttributeDefinition':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        if not host:
            copy = CdmTypeAttributeDefinition(self.ctx, self.name)

        else:
            copy = host
            copy.ctx = self.ctx
            copy.name = self.name

        if self.data_type:
            copy.data_type = self.data_type.copy(res_opt)

        if self.attribute_context:
            copy.attribute_context = self.attribute_context.copy(res_opt)

        self._copy_att(res_opt, copy)

        return copy

    def _fetch_property(self, property_name: str) -> Any:
        """returns the value direclty assigned to a property (ignore value from traits)."""
        return self._trait_to_property_map._fetch_property_value(property_name, True)

    def fetch_resolved_entity_references(self, res_opt: 'ResolveOptions') -> 'ResolvedEntityReferenceSet':
        return

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        return False

    def validate(self) -> bool:
        missing_fields = []
        if not bool(self.name):
            missing_fields.append('name')
        if bool(self.cardinality):
            if not bool(self.cardinality.minimum):
                missing_fields.append('cardinality.minimum')
            if not bool(self.cardinality.maximum):
                missing_fields.append('cardinality.maximum')

        if missing_fields:
            logger.error(self._TAG, self.ctx, Errors.validate_error_string(self.at_corpus_path, missing_fields))
            return False

        if bool(self.cardinality):
            if not CardinalitySettings._is_minimum_valid(self.cardinality.minimum):
                logger.error(self._TAG, self.ctx, 'Invalid minimum cardinality {}.'.format(self.cardinality.minimum))
                return False
            if not CardinalitySettings._is_maximum_valid(self.cardinality.maximum):
                logger.error(self._TAG, self.ctx, 'Invalid maximum cardinality {}.'.format(self.cardinality.maximum))
                return False
        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = ''
        if self.ctx.corpus._block_declared_path_changes is False:
            path = self._declared_path
            if not path:
                path = path_from + self.name
                self._declared_path = path

        if pre_children and pre_children(self, path):
            return False

        if self.data_type and self.data_type.visit('{}/dataType/'.format(path), pre_children, post_children):
            return True

        if self.attribute_context and self.attribute_context.visit('{}/attributeContext/'.format(path), pre_children, post_children):
            return True

        if self._visit_att(path, pre_children, post_children):
            return True

        if post_children and post_children(self, path):
            return True

        return False
