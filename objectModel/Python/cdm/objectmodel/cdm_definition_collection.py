from typing import Optional, Union, TYPE_CHECKING

from cdm.enums import CdmObjectType

from .cdm_collection import CdmCollection

if TYPE_CHECKING:
    from .cdm_object_def import CdmObjectDefinition


class CdmDefinitionCollection(CdmCollection):
    def __init__(self, ctx: 'CdmCorpusContext', owner: 'CdmObject'):
        super().__init__(ctx, owner, CdmObjectType.ENTITY_DEF)

    def append(self, obj: Union[str, 'CdmObjectDefinition'], of_type: Optional[CdmObjectType] = None) -> 'CdmObjectDefinition':
        """
        If a object definition is provided adds it to the list otherwise
        creates a object with type 'of_type' if provided or an EntityDefinition if not.
        """
        if isinstance(obj, str):
            if of_type is None:
                of_type = self.default_type
            obj = self.ctx.corpus.make_object(of_type, obj)

        self._add_item_modifications(obj)
        return super().append(obj)

    def insert(self, index: int, obj: 'CdmObjectDefinition') -> None:
        self._add_item_modifications(obj)
        super().insert(index, obj)

    def _add_item_modifications(self, obj: 'CdmObjectDefinition') -> None:
        """Performs changes to an item that is added to the collection.
        Does not actually add the item to the collection."""
        obj._doc_created_in = self.owner
        self.owner._is_dirty = True
