# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import threading
from typing import Dict, List, Optional, Set, Tuple, TYPE_CHECKING

from cdm.utilities.concurrent._concurrent_semaphore import ConcurrentSemaphore

if TYPE_CHECKING:
    from cdm.objectmodel import CdmDocumentDefinition, CdmFolderDefinition

class DocumentLibrary:
    """Synchronizes all dictionaries relating to the documents (and their statuses) in the corpus."""

    def __init__(self):
        # --- internal ---

        self._document_library_lock = threading.Lock()
        self._docs_currently_loading = set()  # type: Set[str]
        self._docs_not_indexed = set()  # type: Set[CdmDocumentDefinition]
        self._docs_not_found = set()  # type: Set[str]
        self._all_documents = []  # type: List[Tuple[CdmFolderDefinition, CdmDocumentDefinition]]
        self._path_lookup = {}  # type: Dict[str, Tuple[CdmFolderDefinition, CdmDocumentDefinition]]
        self._concurrent_read_lock = ConcurrentSemaphore()

    def _add_document_path(self, path: str, folder: 'CdmFolderDefinition', doc: 'CdmDocumentDefinition'):
        """Adds a folder and document to the list of all documents in the corpus. Also adds the document path to the path lookup."""
        with self._document_library_lock:
            if path not in self._path_lookup:
                self._all_documents.append((folder, doc))
                self._path_lookup[path] = (folder, doc)
                folder._document_lookup[doc.name] = doc

    def _remove_document_path(self, path: str, folder: 'CdmFolderDefinition', doc: 'CdmDocumentDefinition'):
        """Removes a folder and document from the list of all documents in the corpus. Also removes the document path from the path lookup."""
        with self._document_library_lock:
            if path in self._path_lookup:
                self._path_lookup.pop(path)
                self._all_documents.remove((folder, doc))

    def _list_docs_not_indexed(self) -> List['CdmDocumentDefinition']:
        """Returns a list of all the documents that are not indexed."""
        docs_not_indexed = []  # type: List[CdmDocumentDefinition]
        with self._document_library_lock:
            # gets all the documents that needs indexing and set the currentlyIndexing flag to true.
            for doc in self._docs_not_indexed:
                doc._currently_indexing = True
                docs_not_indexed.append(doc)
        return docs_not_indexed

    def _list_all_documents(self) -> List['CdmDocumentDefinition']:
        """Returns a list of all the documents in the corpus."""
        with self._document_library_lock:
            return [fd[1] for fd in self._all_documents]

    def _fetch_document(self, path: str) -> Optional['CdmDocumentDefinition']:
        """Fetches a document from the path lookup."""
        with self._document_library_lock:
            if path not in self._docs_not_found:
                lookup = self._path_lookup.get(path)  # type: Tuple[CdmFolderDefinition, CdmDocumentDefinition]
                if lookup:
                    inner_doc = lookup[1]  # type: CdmDocumentDefinition
                    return inner_doc
        return None

    def _need_to_load_document(self, doc_path: str) -> bool:
        """Sets a document's status to loading if the document needs to be loaded."""

        with self._document_library_lock:
            document = self._path_lookup[doc_path][1] if doc_path in self._path_lookup else None

            # first check if the document was not found or is currently loading already.
            # if the document was loaded previously, check if its imports were not indexed and it's not being indexed currently.
            need_to_load = doc_path not in self._docs_not_found and doc_path not in self._docs_currently_loading and \
                (not document or (not document._imports_indexed and not document._currently_indexing))

            if need_to_load:
                self._docs_currently_loading.add(doc_path)

            return need_to_load

    def _mark_document_as_loaded_or_failed(self, doc_path: str, doc: 'CdmDocumentDefinition') -> bool:
        """Marks a document for indexing if it has loaded successfully, or adds it to the list of documents not found if it failed to load."""
        with self._document_library_lock:
            # doc is no longer loading
            self._docs_currently_loading.discard(doc_path)
            if doc:
                # the doc needs to be indexed
                self._docs_not_indexed.add(doc)
                doc._currently_indexing = True
                return True
            else:
                # the doc failed to load, so set doc as not found
                self._docs_not_found.add(doc_path)
                return False

    def _mark_document_as_indexed(self, doc: 'CdmDocumentDefinition'):
        """Removes a document from the list of documents that are not indexed to mark it as indexed."""
        with self._document_library_lock:
            self._docs_not_indexed.discard(doc)

    def _mark_document_for_indexing(self, doc: 'CdmDocumentDefinition'):
        """Adds a document to the list of documents that are not indexed to mark it for indexing."""
        with self._document_library_lock:
            self._docs_not_indexed.add(doc)

    def _contains(self, fd: Tuple['CdmFolderDefinition', 'CdmDocumentDefinition']) -> bool:
        """Whether a specific pair of folder-document exists in the list of all documents in the corpus."""
        return fd in self._all_documents
