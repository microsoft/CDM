# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, List, Optional, TYPE_CHECKING, cast, Tuple

from cdm.enums import CdmObjectType

from .cdm_collection import CdmCollection

if TYPE_CHECKING:
    from .cdm_trait_def import CdmTraitDefinition
    from .cdm_trait_ref import CdmTraitReference
    from .cdm_trait_group_def import CdmTraitGroupDefinition
    from .cdm_trait_group_ref import CdmTraitGroupReference
    from .cdm_trait_ref_base import CdmTraitReferenceBase
    from cdm.objectmodel import CdmArgumentValue

    CdmTraitDefOrRef = Union[str, CdmTraitDefinition, CdmTraitReference]
    CdmTraitGroupDefOrRef = Union[CdmTraitGroupDefinition, CdmTraitGroupReference]
    Arguments = List[Tuple[str, 'CdmArgumentValue']]


class CdmTraitCollection(CdmCollection):
    def __init__(self, ctx: 'CdmCorpusContext', owner: 'CdmObject'):
        super().__init__(ctx, owner, CdmObjectType.TRAIT_REF)

    def insert(self, index: int, obj: 'CdmTraitReferenceBase'):
        self._clear_cache()
        super().insert(index, obj)

    def append(self, obj: Union['CdmTraitDefOrRef', 'CdmTraitGroupDefOrRef', str], simple_ref_or_args: Optional[Union[bool, List[Tuple[str, 'CdmArgumentValue']]]]=None) -> 'CdmTraitReferenceBase':
        self._clear_cache()

        if not simple_ref_or_args or simple_ref_or_args and isinstance(simple_ref_or_args, bool):
            simple_ref = simple_ref_or_args if simple_ref_or_args else False
            if not isinstance(obj, str):
                if obj.object_type == CdmObjectType.TRAIT_DEF:
                    from .cdm_trait_ref import CdmTraitReference
                    obj = CdmTraitReference(self.ctx, obj, simple_ref)
                elif obj.object_type == CdmObjectType.TRAIT_GROUP_DEF:
                    from .cdm_trait_group_ref import CdmTraitGroupReference
                    obj = CdmTraitGroupReference(self.ctx, obj, simple_ref)
            # when the obj is a trait name or a trait reference
            return super().append(obj, simple_ref)
        else:
            # Creates an non-simple-referenced CdmTraitReference object, assigns it the name passed as parameter,
            # adds the supplied arguments to it if provided, and adds it to the collection.
            trait_ref = cast('CdmTraitReference', super().append(obj))
            if not trait_ref or not simple_ref_or_args:
                return trait_ref

            for item1, item2 in simple_ref_or_args:
                trait_ref.arguments.append(item1, item2)

            return trait_ref

    def extend(self, trait_list: Union[List['CdmTraitDefOrRef'], List['CdmTraitGroupDefOrRef']]) -> None:
        for element in trait_list:
            self.append(element)

    def clear(self) -> None:
        self._clear_cache()
        super().clear()

    def index(self, obj: Union['CdmTraitDefOrRef', 'CdmTraitGroupDefOrRef'],
              only_from_property: Optional[bool] = False) -> int:
        if not isinstance(obj, str):
            return self.index(obj.fetch_object_definition_name(), only_from_property)

        # when obj is a trait name
        index_of_trait_not_from_property = -1

        for index, trait in enumerate(self):
            if self._corresponds(trait, obj):
                if trait.is_from_property:
                    return index
                index_of_trait_not_from_property = index

        return -1 if only_from_property else index_of_trait_not_from_property

    def remove(self, obj: Union['CdmTraitDefOrRef', 'CdmTraitGroupDefOrRef'],
               only_from_property: Optional[bool] = False) -> None:
        if not isinstance(obj, str):
            return self.remove(obj.fetch_object_definition_name(), only_from_property)

        # when obj is a trait name
        found_trait_not_from_property = None
        self._clear_cache()

        for trait in self:
            if self._corresponds(trait, obj):
                if trait.is_from_property:
                    return super().remove(trait)
                found_trait_not_from_property = trait

        if not only_from_property and found_trait_not_from_property:
            return super().remove(found_trait_not_from_property)

    def to_trait_refs(self) -> CdmCollection['CdmTraitReference']:
        """Returns a new collection consisting of only the trait reference objects present in this collection."""
        trait_collection = CdmCollection(self.ctx, self.owner, CdmObjectType.TRAIT_REF)
        for x in self:
            if x.object_type == CdmObjectType.TRAIT_REF:
                trait_collection.append(x)
        return trait_collection

    def to_trait_group_refs(self) -> CdmCollection['CdmTraitGroupReference']:
        """Returns a new collection consisting of only the trait group reference objects present in this collection."""
        trait_collection = CdmCollection(self.ctx, self.owner, CdmObjectType.TRAIT_GROUP_REF)
        for x in self:
            if x.object_type == CdmObjectType.TRAIT_GROUP_REF:
                trait_collection.append(x)
        return trait_collection

    def _corresponds(self, obj: 'CdmTraitReferenceBase', trait_name: str) -> bool:
        return obj.fetch_object_definition_name() == trait_name

    def _clear_cache(self) -> None:
        # if isinstance(self.owner, 'CdmObject'):
        self.owner._clear_trait_cache()
