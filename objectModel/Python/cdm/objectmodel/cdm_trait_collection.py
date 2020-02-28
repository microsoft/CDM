# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, TYPE_CHECKING

from cdm.enums import CdmObjectType

from .cdm_collection import CdmCollection

if TYPE_CHECKING:
    from .cdm_trait_def import CdmTraitDefinition
    from .cdm_trait_ref import CdmTraitReference

    CdmTraitDefOrRef = Union[str, CdmTraitDefinition, CdmTraitReference]


class CdmTraitCollection(CdmCollection):
    def __init__(self, ctx: 'CdmCorpusContext', owner: 'CdmObject'):
        super().__init__(ctx, owner, CdmObjectType.TRAIT_REF)

    def append(self, obj: Union[str, 'CdmTraitDefOrRef'], simple_ref: bool = False) -> 'CdmTraitReference':
        self._clear_cache()
        if not isinstance(obj, str):
            if obj.object_type == CdmObjectType.TRAIT_DEF:
                from .cdm_trait_ref import CdmTraitReference
                obj = CdmTraitReference(self.ctx, obj, simple_ref)
        # when the obj is a trait name or a trait reference
        return super().append(obj, simple_ref)

    def clear(self) -> None:
        self._clear_cache()
        super().clear()

    def index(self, obj: Union[str, 'CdmTraitDefOrRef'], only_from_property: bool = False):
        if not isinstance(obj, str):
            if obj.object_type == CdmObjectType.TRAIT_DEF:
                return self.index(obj.trait_name, only_from_property)
            return self.index(obj.fetch_object_definition_name(), only_from_property)
        # when obj is a trait name
        index_of_trait_not_from_property = -1

        for index, trait in enumerate(self):
            if self._corresponds(trait, obj):
                if trait.is_from_property:
                    return index
                index_of_trait_not_from_property = index

        return -1 if only_from_property else index_of_trait_not_from_property

    def insert(self, index: int, obj: 'CdmTraitReference'):
        self._clear_cache()
        super().insert(index, obj)

    def remove(self, obj: Union[str, 'CdmTraitDefOrRef'], only_from_property: bool = False) -> None:
        if not isinstance(obj, str):
            if obj.object_type == CdmObjectType.TRAIT_DEF:
                super()._propagate_in_document(obj, None)
                return self.remove(obj.trait_name, only_from_property)
            return self.remove(obj.fetch_object_definition_name(), only_from_property)
        # when obj is a trait name
        super()._make_document_dirty()
        found_trait_not_from_property = None
        self._clear_cache()
        for trait in self:
            if self._corresponds(trait, obj):
                if trait.is_from_property:
                    return super().remove(trait)
                found_trait_not_from_property = trait

        if not only_from_property and found_trait_not_from_property:
            super()._propagate_in_document(found_trait_not_from_property, None)
            return super().remove(found_trait_not_from_property)

    def _corresponds(self, obj: 'CdmTraitDefOrRef', trait_name: str) -> bool:
        return obj.fetch_object_definition_name() == trait_name

    def _clear_cache(self):
        # if isinstance(self.owner, 'CdmObject'):
        self.owner._clear_trait_cache()
