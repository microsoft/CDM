# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Dict, Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.utilities import logger, Errors

from .cdm_container_def import CdmContainerDefinition
from .cdm_document_collection import CdmDocumentCollection
from .cdm_document_def import CdmDocumentDefinition
from .cdm_folder_collection import CdmFolderCollection
from .cdm_object_def import CdmObjectDefinition

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmImport
    from cdm.resolvedmodel import ResolvedAttributeSet
    from cdm.utilities import AttributeContextParameters, FriendlyFormatNode, ResolveOptions


class CdmFolderDefinition(CdmObjectDefinition, CdmContainerDefinition):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx)

        #  the folder name.
        self.name = name  # type: str

        self.namespace = None  # type: Optional[str]

        self.folder_path = '{}/'.format(name)  # type: Optional[str]

        # --- Internal ---

        self._document_lookup = {}  # type: Dict[str, CdmDocumentDefinition]

        # the direct children for the directory folder.
        self._child_folders = CdmFolderCollection(self.ctx, self)  # type: CdmFolderCollection

        # the child documents for the directory folder.
        self._documents = CdmDocumentCollection(self.ctx, self)  # type: CdmDocumentCollection

        self._corpus = None  # type: CdmDocumentDefinition

        self._TAG = CdmFolderDefinition.__name__

    @property
    def at_corpus_path(self) -> str:
        if self.namespace is None:
            # We're not under any adapter (not in a corpus), so return special indicator.
            return 'NULL:{}'.format(self.folder_path)

        return '{}:{}'.format(self.namespace, self.folder_path)

    @property
    def child_folders(self) -> 'CdmFolderCollection':
        return self._child_folders

    @property
    def documents(self) -> 'CdmDocumentCollection':
        return self._documents

    @property
    def object_type(self) -> CdmObjectType:
        return CdmObjectType.FOLDER_DEF

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmFolderDefinition'] = None) -> 'CdmFolderDefinition':
        return None

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        return False

    def validate(self) -> bool:
        if not bool(self.name):
            logger.error(self._TAG, self.ctx, Errors.validate_error_string(self.at_corpus_path, ['name']))
            return False
        return True

    def get_name(self) -> str:
        """ Gets the name of the folder."""
        return self.name

    def _fetch_resolved_attributes(self, res_opt: 'ResolveOptions',
                                   acp_in_context: 'AttributeContextParameters') -> 'ResolvedAttributeSet':
        return None

    def _fetch_child_folder_from_path(self, path: str, make_folder: bool) -> 'CdmFolderDefinition':
        """Gets the child folder from corpus path.

        arguments:
        path: The path.
        makeFolder: Create the folder if it doesn't exist."""

        name = None
        remaining_path = path
        child_folder = self

        while child_folder and remaining_path.find('/') != -1:
            first = remaining_path.find('/')
            name = remaining_path[0: first]
            remaining_path = remaining_path[first + 1:]

            if name.lower() != child_folder.name.lower():
                logger.error(self._TAG, self.ctx, 'Invalid path \'{}\''.format(path), '_fetch_child_folder_from_path')
                return None

            # the end?
            if not remaining_path:
                return child_folder

            first = remaining_path.find('/')
            child_folder_name = remaining_path
            if first != -1:
                child_folder_name = remaining_path[0: first]
            else:
                # the last part of the path will be considered part of the part depending on the make_folder flag.
                break

            # check children folders
            result = None
            if child_folder.child_folders:
                for folder in child_folder.child_folders:
                    if child_folder_name == folder.name:
                        result = folder
                        break
            if not result:
                result = child_folder.child_folders.append(child_folder_name)

            child_folder = result

        if make_folder:
            child_folder = child_folder.child_folders.append(remaining_path)

        return child_folder

    async def _fetch_document_from_folder_path_async(self, document_path: str, adapter: 'StorageAdapterBase',
                                                     force_reload: bool, res_opt: Optional['ResolveOptions'] = None) -> 'CdmDocumentDefinition':
        """Gets the document from folder path.

        arguments:
        path: The path.
        adapter: The storage adapter where the document can be found."""

        doc_name = None
        first = document_path.find('/')

        if first < 0:
            doc_name = document_path
        else:
            doc_name = document_path[0: first]

        # got that doc?
        doc = None  # type: Optional[CdmDocumentDefinition]

        if doc_name in self._document_lookup:
            doc = self._document_lookup[doc_name]
            if not force_reload:
                return doc

            # remove them from the caches since they will be back in a moment
            if doc._is_dirty:
                logger.warning(self._TAG, self.ctx, 'discarding changes in document: {}'.format(doc.name))

            self.documents.remove(doc_name)

        # go get the doc
        doc = await self._corpus.persistence._load_document_from_path_async(self, doc_name, doc, res_opt)

        return doc

    def _fetch_resolved_traits(self, res_opt: 'ResolveOptions') -> 'ResolvedTraitSet':
        return None

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        return False
