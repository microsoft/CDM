# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, List, Union, TYPE_CHECKING

from cdm.enums import CdmObjectType

from .cdm_collection import CdmCollection

if TYPE_CHECKING:
    from .cdm_document_def import CdmDocumentDefinition


class CdmDocumentCollection(CdmCollection):
    def __init__(self, ctx: 'CdmCorpusContext', owner: 'CdmObject'):
        super().__init__(ctx, owner, CdmObjectType.DOCUMENT_DEF)

    def append(self, obj: Union[str, 'CdmDocumentDefinition'], document_name: Optional[str] = None) -> 'CdmDocumentDefinition':
        if isinstance(obj, str):
            return self.append(self.ctx.corpus.make_object(self.default_type, obj))

        if document_name:
            obj.name = document_name

        self._add_item_modifications(obj)
        obj.owner = self.owner
        list.append(self, obj)

        return obj

    def clear(self) -> None:
        for element in self:
            self._remove_item_modifications(element.name)
        super().clear()

    def insert(self, index: int, obj: 'CdmDocumentDefinition') -> None:
        self._add_item_modifications(obj)
        obj.owner = self.owner
        list.insert(self, index, obj)

    def remove(self, doc: Union[str, 'CdmDocumentDefinition']) -> None:
        """Removes a document from this folder object.

        arguments:
        name: The name of the document."""
        name = doc if isinstance(doc, str) else doc.name
        if name in self.owner._document_lookup:
            self._remove_item_modifications(name)
            # setting this currentlyResolving flag will keep the base collection code from setting the inDocument to null
            # this makes sense because a document is "in" itself. always.
            b_save = self.ctx.corpus._is_currently_resolving
            self.ctx.corpus._is_currently_resolving = True
            elem = next(d for d in self if d.name == name)
            self.ctx.corpus._is_currently_resolving = b_save
            return super().remove(elem)

    def _add_item_modifications(self, obj: 'CdmDocumentDefinition') -> None:
        if obj.owner and obj.owner is not self.owner:
            # this is fun! the document is moving from one folder to another
            # it must be removed from the old folder for sure, but also now
            # there will be a problem with any corpus paths that are relative to that old folder location.
            # so, whip through the document and change any corpus paths to be relative to this folder
            obj._localize_corpus_paths(self.owner)  # returns false if it fails, but ... who cares? we tried
            obj.owner.documents.remove(obj.name)

        obj.folder_path = self.owner.folder_path
        obj.folder = self.owner
        obj.namespace = self.owner.namespace

        super()._make_document_dirty()  # set the document to dirty so it will get saved in the new folder location if saved
        self.owner._corpus._add_document_objects(self.owner, obj)
        self.owner._document_lookup[obj.name] = obj

    def _remove_item_modifications(self, name: str) -> None:
        self.owner._corpus._remove_document_objects(self.owner, self.owner._document_lookup[name])
        self.owner._document_lookup.pop(name)
