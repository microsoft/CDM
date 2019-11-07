from typing import Union, TYPE_CHECKING

from cdm.enums import CdmObjectType

from .cdm_collection import CdmCollection

if TYPE_CHECKING:
    from .cdm_trait_def import CdmTraitDefinition
    from .cdm_trait_ref import CdmTraitReference

    CdmTraitDefOrRef = Union[str, CdmTraitDefinition, CdmTraitReference]


def _get_trait_ref_name(trait_def_or_ref: 'CdmTraitDefOrRef') -> str:
    if isinstance(trait_def_or_ref, str):
        return trait_def_or_ref
    if trait_def_or_ref.object_type == CdmObjectType.TRAIT_DEF:
        return trait_def_or_ref.get_name()
    if trait_def_or_ref.object_type == CdmObjectType.TRAIT_REF:
        return trait_def_or_ref.fetch_object_definition_name()

    return None


class CdmTraitCollection(CdmCollection):
    def __init__(self, ctx: 'CdmCorpusContext', owner: 'CdmObject'):
        super().__init__(ctx, owner, CdmObjectType.TRAIT_REF)

    def append(self, obj: Union[str, 'CdmTraitDefOrRef'], simple_ref: bool = False) -> 'CdmTraitReference':
        if not isinstance(obj, str):
            if obj.object_type == CdmObjectType.TRAIT_DEF:
                from .cdm_trait_ref import CdmTraitReference
                obj = CdmTraitReference(self.ctx, obj, simple_ref)
        self._clear_cache()
        return super().append(obj, simple_ref)

    def clear(self) -> None:
        self._clear_cache()
        super().clear()

    def index(self, obj: 'CdmTraitDefOrRef', only_from_property: bool = False):
        trait_name = _get_trait_ref_name(obj)
        trait_index = -1

        for index, trait in enumerate(self):
            if _get_trait_ref_name(trait) == trait_name:
                trait_index = index
                if trait.is_from_property:
                    return index

        return -1 if only_from_property else trait_index

    def insert(self, index: int, obj: 'CdmTraitReference'):
        self._clear_cache()
        super().insert(index, obj)

    def remove(self, obj: 'CdmTraitDefOrRef', only_from_property: bool = False):
        index = self.index(obj, only_from_property)
        if index >= 0:
            self.pop(index)
            self._clear_cache()

    def _clear_cache(self):
        self.owner._clear_trait_cache()
