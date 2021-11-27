# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import threading
from typing import Dict, List, Optional, Set, Tuple, TYPE_CHECKING

from cdm.enums import CdmLogCode
from cdm.utilities import logger, StorageUtils
from cdm.utilities.concurrent._concurrent_semaphore import ConcurrentSemaphore

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusDefinition, CdmDocumentDefinition, CdmFolderDefinition

class DocumentLibrary:
    """Synchronizes all dictionaries relating to the documents (and their statuses) in the corpus."""
    _TAG = 'DocumentLibrary'

    def __init__(self, corpus: 'CdmCorpusDefinition'):
        # --- internal ---

        self._all_documents = []  # type: List[Tuple[CdmFolderDefinition, CdmDocumentDefinition]]
        self._corpus = corpus  # type: CdmCorpusDefinition
        self._concurrent_read_lock = ConcurrentSemaphore()
        self._document_library_lock = threading.RLock()
        self._docs_currently_indexing = set()  # type: Set[CdmDocumentDefinition]
        self._docs_currently_loading = set()  # type: Set[str]
        self._docs_not_found = set()  # type: Set[str]
        self._path_lookup = {}  # type: Dict[str, Tuple[CdmFolderDefinition, CdmDocumentDefinition]]

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

    def _list_docs_not_indexed(self, root_doc: 'CdmDocumentDefinition', docs_loaded: Set[str]) -> List['CdmDocumentDefinition']:
        """Returns a list of all the documents that are not indexed."""
        docs_not_indexed = []  # type: List[CdmDocumentDefinition]
        with self._document_library_lock:
            # gets all the documents that needs indexing and set the currentlyIndexing flag to true.
            for doc_path in docs_loaded:
                doc = self._fetch_document(doc_path)

                if not doc:
                    continue

                # The root document that started this indexing process is already masked for indexing, don't mark it again.
                if not doc is root_doc:
                    if self._mark_document_for_indexing(doc):
                        docs_not_indexed.append(doc)
                else:
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

    def _need_to_load_document(self, doc_path: str, docs_loading: Set[str]) -> bool:
        """Sets a document's status to loading if the document needs to be loaded."""

        with self._document_library_lock:
            document = self._path_lookup[doc_path][1] if doc_path in self._path_lookup else None

            # first check if the document was not found or is currently loading.
            # if the document was loaded previously, check if its imports were not indexed and it's not being indexed currently.
            need_to_load = doc_path not in self._docs_not_found and doc_path not in docs_loading and \
                (not document or (not document._imports_indexed and not document._currently_indexing))

            if need_to_load:
                docs_loading.add(doc_path)

            return need_to_load

    def _mark_as_loaded_or_failed(self, doc_path: str, doc: 'CdmDocumentDefinition') -> None:
        """Marks a document for indexing if it has loaded successfully, or adds it to the list of documents not found if it failed to load."""
        with self._document_library_lock:
            # doc is no longer loading
            self._docs_currently_loading.discard(doc_path)

            if not doc:
                # the doc failed to load, so set doc as not found
                self._docs_not_found.add(doc_path)

    def _mark_document_as_indexed(self, doc: 'CdmDocumentDefinition') -> None:
        """Removes a document from the list of documents that are not indexed to mark it as indexed."""
        with self._document_library_lock:
            doc._currently_indexing = False
            self._docs_currently_indexing.discard(doc)

    def _mark_document_for_indexing(self, doc: 'CdmDocumentDefinition') -> bool:
        """Adds a document to the list of documents that are not indexed to mark it for indexing."""
        with self._document_library_lock:
            if doc._needs_indexing and not doc._currently_indexing:
                # If the document was not indexed before and it's not currently being indexed.
                self._docs_currently_indexing.add(doc)
                doc._currently_indexing = True
            
            return doc._needs_indexing

    def _contains(self, fd: Tuple['CdmFolderDefinition', 'CdmDocumentDefinition']) -> bool:
        """Whether a specific pair of folder-document exists in the list of all documents in the corpus."""
        return fd in self._all_documents

    async def _load_folder_or_document(self, object_path: str, force_reload: Optional[bool] = False,
                                       res_opt: Optional['ResolveOptions'] = None) -> Optional['CdmContainerDefinition']:
        """Loads a folder or document given its corpus path."""

        with self._document_library_lock:
            # If the document is already loaded and the user do not want to force a reload, return the document previously loaded.
            if not force_reload and object_path in self._path_lookup:
                doc = self._path_lookup[object_path][1]
                return doc

            # Mark as loading.
            self._docs_currently_loading.add(object_path)

        # The document needs to be loaded. Create a task to load it and add to the list of documents currently loading.
        async def load():
            result = await self._load_folder_or_document_internal(object_path, force_reload, res_opt)
            self._mark_as_loaded_or_failed(object_path, result)
            return result

        return await load()

    async def _load_folder_or_document_internal(self, object_path: str, force_reload: Optional[bool] = False,
                                       res_opt: Optional['ResolveOptions'] = None) -> Optional['CdmContainerDefinition']:
        """Loads a folder or document given its corpus path."""

        if not object_path:
            return None

        # first check for namespace
        path_tuple = StorageUtils.split_namespace_path(object_path)
        if not path_tuple:
            logger.error(self._corpus.ctx, self._TAG, self._load_folder_or_document.__name__, object_path,
                         CdmLogCode.ERR_PATH_NULL_OBJECT_PATH)
            return None
        namespace = path_tuple[0] or self._corpus.storage.default_namespace
        object_path = path_tuple[1]

        if not object_path.startswith('/'):
            return None

        namespace_folder = self._corpus.storage.fetch_root_folder(namespace)
        namespace_adapter = self._corpus.storage.fetch_adapter(namespace)
        if not namespace_folder or not namespace_adapter:
            logger.error(self._corpus.ctx, self._TAG, self._load_folder_or_document.__name__, object_path,
                            CdmLogCode.ERR_STORAGE_NAMESPACE_NOT_REGISTERED, namespace)
            return None

        last_folder = namespace_folder._fetch_child_folder_from_path(object_path, False)

        # don't create new folders, just go as far as possible
        if not last_folder:
            return None

        # maybe the search is for a folder?
        last_path = last_folder._folder_path
        if last_path == object_path:
            return last_folder

        # remove path to folder and then look in the folder
        object_path = object_path[len(last_path):]

        self._concurrent_read_lock.acquire()

        # During this step the document will be added to the pathLookup when it is added to a folder.
        doc = await last_folder._fetch_document_from_folder_path_async(object_path, force_reload, res_opt)

        self._concurrent_read_lock.release()

        return doc

