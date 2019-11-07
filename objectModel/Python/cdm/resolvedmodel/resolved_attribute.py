# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from typing import Any, cast, Optional, Union, TYPE_CHECKING

from cdm.resolvedmodel.resolved_trait_set import ResolvedTraitSet

if TYPE_CHECKING:
    from cdm.objectmodel import CdmAttribute, CdmAttributeContext, CdmObject, SpewCatcher
    from cdm.resolvedmodel import AttributeResolutionContext, ResolvedAttributeSet
    from cdm.utilities import ApplierState, ResolveOptions, TraitToPropertyMap

    ResolutionTarget = Union[CdmAttribute, ResolvedAttributeSet]


class ResolvedAttribute():
    def __init__(self, res_opt: 'ResolveOptions', target: 'ResolutionTarget', default_name: str, att_ctx: 'CdmAttributeContext') -> None:
        self.applier_state = None  # type: Optional[ApplierState]
        self.arc = None  # type: Optional[AttributeResolutionContext]
        self.att_ctx = att_ctx  # type: CdmAttributeContext
        self.insert_order = 0  # type: int
        self.previous_resolved_name = default_name  # type: str
        self.resolved_traits = ResolvedTraitSet(res_opt)  # type: ResolvedTraitSet
        self.target = target  # type: ResolutionTarget

        self._resolved_name = default_name  # type: str
        self._ttpm = None  # type: Optional[TraitToPropertyMap]

    @property
    def resolved_name(self) -> str:
        return self._resolved_name

    @resolved_name.setter
    def resolved_name(self, value: str) -> None:
        self._resolved_name = value
        if self.previous_resolved_name is None:
            self.previous_resolved_name = value

    @property
    def is_primary_key(self) -> Optional[bool]:
        return self._trait_to_property_map.fetch_property_value('isPrimaryKey')

    @property
    def is_read_only(self) -> Optional[bool]:
        return self._trait_to_property_map.fetch_property_value('isReadOnly')

    @property
    def is_nullable(self) -> Optional[bool]:
        return self._trait_to_property_map.fetch_property_value('isNullable')

    @property
    def data_format(self) -> str:
        return self._trait_to_property_map.fetch_property_value('dataFormat')

    @property
    def source_name(self) -> str:
        return self._trait_to_property_map.fetch_property_value('sourceName')

    @property
    def source_ordering(self) -> Optional[int]:
        return self._trait_to_property_map.fetch_property_value('sourceOrdering')

    @property
    def display_name(self) -> str:
        return self._trait_to_property_map.fetch_property_value('displayName')

    @property
    def description(self) -> str:
        return self._trait_to_property_map.fetch_property_value('description')

    @property
    def maximum_value(self) -> str:
        return self._trait_to_property_map.fetch_property_value('maximumValue')

    @property
    def minimum_value(self) -> str:
        return self._trait_to_property_map.fetch_property_value('minimumValue')

    @property
    def maximum_length(self) -> Optional[int]:
        return self._trait_to_property_map.fetch_property_value('maximumLength')

    @property
    def value_constrained_to_list(self) -> Optional[bool]:
        return self._trait_to_property_map.fetch_property_value('valueConstrainedToList')

    @property
    def default_value(self) -> Any:
        return self._trait_to_property_map.fetch_property_value('defaultValue')

    @property
    def creation_sequence(self) -> int:
        return self.insert_order

    @property
    def _trait_to_property_map(self) -> 'TraitToPropertyMap':
        from cdm.utilities import TraitToPropertyMap

        if self._ttpm is not None:
            return self._ttpm

        self._ttpm = TraitToPropertyMap(cast('CdmObject', self.target))
        return self._ttpm

    def copy(self) -> 'ResolvedAttribute':
        # Use the options from the traits.
        copy = ResolvedAttribute(self.resolved_traits.res_opt, self.target, self._resolved_name, self.att_ctx)
        copy.resolved_traits = self.resolved_traits.shallow_copy()
        copy.insert_order = self.insert_order
        copy.arc = self.arc

        if self.applier_state is not None:
            copy.applier_state = self.applier_state.copy()

        return copy

    def spew(self, res_opt: 'ResolveOptions', to: 'SpewCatcher', indent: str, name_sort: bool) -> None:
        to.spew_line('{}[{}]'.format(indent, self._resolved_name))
        self.resolved_traits.spew(res_opt, to, indent + '-', name_sort)

    def complete_context(self, res_opt: 'ResolveOptions') -> None:
        from cdm.objectmodel import CdmAttribute

        if self.att_ctx is None or self.att_ctx.name is not None:
            return

        self.att_ctx.name = self._resolved_name

        if isinstance(self.target, CdmAttribute):
            self.att_ctx.definition = self.target.create_simple_reference(res_opt)

        self.att_ctx.at_corpus_path = str(self.att_ctx.parent.fetch_object_definition(res_opt).at_corpus_path) + '/' + self._resolved_name
