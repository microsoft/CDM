# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Generic, List, TypeVar, Union, Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType

from .cdm_object import CdmObject

if TYPE_CHECKING:
    from cdm.utilities import VisitCallback

    from .cdm_corpus_context import CdmCorpusContext
    from .cdm_document_def import CdmDocumentDefinition

T = TypeVar('T', bound=CdmObject, covariant=True)


class CdmCollection(list, Generic[T]):
    def __init__(self, ctx: 'CdmCorpusContext', owner: 'CdmObject', default_type: 'CdmObjectType') -> None:
        super().__init__(self)
        self.ctx = ctx
        self.owner = owner  # type: T
        self.default_type = default_type  # type: CdmObjectType

    def append(self, obj: Union[str, 'T'], simple_ref: Optional[bool] = False) -> 'CdmObject':
        if isinstance(obj, (list, CdmCollection)):
            raise Exception('add called with a list. You should call extend instead')

        if not isinstance(obj, str):
            self._make_document_dirty()
            obj.owner = self.owner
            self._propagate_in_document(obj, self.owner.in_document)
            super().append(obj)
        else:
            obj = self.ctx.corpus.make_object(self.default_type, obj, simple_ref)
            self.append(obj)

        return obj

    def extend(self, obj: List[Union['T', str]]) -> None:
        self.__add__(obj)

    def remove(self, curr_object: 'T'):
        try:
            super().remove(curr_object)
            self._propagate_in_document(curr_object, None)
            curr_object.owner = None
            self._make_document_dirty()
        except ValueError:
            pass

    def clear(self) -> None:
        for item in self:
            item.owner = None
            self._propagate_in_document(item, None)
        self._make_document_dirty()
        super().clear()

    def pop(self, index: int) -> None:
        if self and 0 <= index < len(self):
            self.remove(self[index])

    def insert(self, index: int, obj: 'T') -> None:
        obj.owner = self.owner
        self._propagate_in_document(obj, self.owner.in_document)
        self._make_document_dirty()
        super().insert(index, obj)

    def item(self, name: str) -> 'T':
        for x in self:
            if x.fetch_object_definition_name() == name:
                return x
        return None

    def _make_document_dirty(self):
        """Make the outermost document containing this collection dirty because the collection was changed."""
        if self.ctx.corpus._is_currently_resolving is False:
            if self.owner:
                document = self.owner.in_document if self.owner.in_document is not None else self.owner  # type: CdmDocumentDefinition

                if document:
                    document._is_dirty = True
                    document._needs_indexing = True

    def _propagate_in_document(self, cdm_object: 'CdmObject', document: 'CdmDocumentDefinition'):
        """Propagate document through all objects."""
        if self.ctx.corpus._is_currently_resolving is False:
            self.ctx.corpus._block_declared_path_changes = True

            def visit_callback(obj: 'CdmObject', path: str) -> bool:
                # If object's document is already the same as the one we're trying to set
                # then we're assuming that every sub-object is also set to it, so bail out.
                if obj.in_document == document:
                    return True
                obj.in_document = document
                return False

            cdm_object.visit('', visit_callback, None)
            self.ctx.corpus._block_declared_path_changes = False

    def _visit_array(self, path: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        result = False

        for item in self:
            if item and item.visit(path, pre_children, post_children):
                result = True
                break

        return result

    def __add__(self, obj: List[Union['T', str]]):
        if not obj:
            return

        if isinstance(obj, (list, CdmCollection)):
            for element in obj:
                self.append(element)
