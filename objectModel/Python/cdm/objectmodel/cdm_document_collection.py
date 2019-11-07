from typing import Union, TYPE_CHECKING

from cdm.enums import CdmObjectType

from .cdm_collection import CdmCollection

if TYPE_CHECKING:
    from .cdm_document_def import CdmDocumentDefinition


class CdmDocumentCollection(CdmCollection):
    def __init__(self, ctx: 'CdmCorpusContext', owner: 'CdmObject'):
        super().__init__(ctx, owner, CdmObjectType.DOCUMENT_DEF)

    def append(self, doc: Union[str, 'CdmDocumentDefinition']) -> 'CdmDocumentDefinition':
        """Adds a child document.

        arguments:
        name: The name of the document.
        content: The content of the document."""
        from .cdm_document_def import CdmDocumentDefinition

        doc = CdmDocumentDefinition(self.owner.ctx, doc) if isinstance(doc, str) else doc
        self._add_item_modifications(doc)
        return super().append(doc)

    def clear(self) -> None:
        for element in self:
            self._remove_item_modifications(element)
        super().clear()

    def insert(self, index: int, obj: 'CdmObjectDefinition') -> None:
        self._add_item_modifications(obj)
        super().insert(index, obj)

    def pop(self, index: int) -> 'CdmObjectDefinition':
        if 0 <= index < len(self):
            self.remove(self[index].name)
        return super().pop(index)

    def remove(self, doc: Union[str, 'CdmDocumentDefinition']) -> None:
        """Removes a document from this folder object.

        arguments:
        name: The name of the document."""
        name = doc if isinstance(doc, str) else doc.name
        if name in self.owner._document_lookup:
            self._remove_item_modifications(name)
            elem = next(d for d in self if d.name == name)
            super().remove(elem)

    def _add_item_modifications(self, obj: 'CdmDocumentDefinition') -> None:
        obj.folder_path = self.owner.folder_path
        obj.folder = self.owner
        obj.namespace = self.owner.namespace
        obj._needs_indexing = True

        self.owner.corpus._add_document_objects(self.owner, obj)
        self.owner._document_lookup[obj.name] = obj

    def _remove_item_modifications(self, name: str) -> None:
        self.owner.corpus._remove_document_objects(self, self.owner._document_lookup[name])
        self.owner._document_lookup.pop(name)
