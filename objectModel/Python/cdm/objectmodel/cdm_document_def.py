from datetime import datetime
from typing import Dict, Optional, Set, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.utilities import CopyOptions, ResolveOptions

from .cdm_container_def import CdmContainerDefinition
from .cdm_definition_collection import CdmDefinitionCollection
from .cdm_import_collection import CdmImportCollection
from .cdm_object_simple import CdmObjectSimple

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmDataTypeDefinition, CdmFolderDefinition, CdmObject, \
        CdmObjectDefinition, CdmTraitDefinition
    from cdm.utilities import FriendlyFormatNode, VisitCallback


class ImportPriorities:
    def __init__(self):
        self.import_priority = {}  # type: Dict[CdmDocumentDefinition, int]
        self.moniker_priority_map = {}  # type: Dict[str, CdmDocumentDefinition]

    def copy(self) -> 'ImportPriorities':
        c = ImportPriorities()
        if self.import_priority:
            c.import_priority = self.import_priority.copy()
            c.moniker_priority_map = self.moniker_priority_map.copy()

        return c


class CdmDocumentDefinition(CdmObjectSimple, CdmContainerDefinition):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx)

        # the document name.
        self.name = name  # type: str

        # the document schema.
        self.schema = None  # type: Optional[str]

        # the document json schema semantic version.
        self.json_schema_semantic_version = '0.9.0'  # type: str

        # the document folder.
        self.folder = None  # type: Optional[CdmFolderDefinition]

        # The namespace where this object can be found
        self.namespace = None  # type: Optional[str]

        # The folder where this object exists
        self.folder_path = None  # type: Optional[str]

        # internal

        self._doc_created_in = self
        self._currently_indexing = False
        self._file_system_modified_time = None  # type: Optional[datetime]
        self._imports_indexed = False
        self._import_priorities = None  # type: Optional[ImportPriorities]
        self._is_dirty = True  # type: bool
        self._needs_indexing = True
        self._imports = CdmImportCollection(self.ctx, self)
        self._definitions = CdmDefinitionCollection(self.ctx, self)

        self._clear_caches()

    @property
    def at_corpus_path(self) -> str:
        return '{}:{}{}'.format(self.namespace or self.folder.namespace, self.folder_path, self.name)

    @property
    def imports(self) -> 'CdmImportCollection':
        """the document imports"""
        return self._imports

    @property
    def definitions(self) -> 'CdmDefinitionCollection':
        """the document definitions."""
        return self._definitions

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.DOCUMENT_DEF

    def _construct_resolved_attributes(self, res_opt: 'ResolveOptions', under: Optional['CdmAttributeContext']) -> 'ResolvedAttributeSetBuilder':
        return None

    def _construct_resolved_traits(self, rtsb: 'ResolvedTraitSetBuilder', res_opt: 'ResolveOptions') -> None:
        pass

    def copy(self, res_opt: Optional['ResolveOptions'] = None) -> 'CdmDocumentDefinition':
        res_opt = res_opt if res_opt is not None else ResolveOptions(wrt_doc=self)

        copy = CdmDocumentDefinition(self.ctx, self.name)
        copy.ctx = self.ctx
        copy._is_dirty = self._is_dirty
        copy.folder_path = self.folder_path
        copy.schema = self.schema
        copy.json_schema_semantic_version = self.json_schema_semantic_version

        for definition in self.definitions:
            copy.definitions.append(definition)

        for imp in self.imports:
            copy.imports.append(imp)

        return copy

    async def _index_if_needed(self, res_opt: 'ResolveOptions') -> None:
        if not self._needs_indexing:
            return

        # make the corpus internal machinery pay attention to this document for this call
        corpus = self.folder.corpus
        old_doc = self

        docs_just_added = set()  # type Set[CdmDocumentDefinition]
        docs_not_found = set()  # type Set[str]
        await corpus.resolve_imports_async(self, docs_just_added, docs_not_found)

        # maintain actual current doc
        corpus.ctx.current_doc = old_doc
        self.ctx.corpus.ctx.current_doc = old_doc
        docs_just_added.add(self)

        corpus._index_documents(res_opt, docs_just_added)

    def _get_import_priorities(self) -> 'ImportPriorities':
        if not self._import_priorities:
            self._import_priorities = ImportPriorities()
            self._import_priorities.import_priority[self] = 0
            self._prioritize_imports(set(), self._import_priorities.import_priority, 1, self._import_priorities.moniker_priority_map, False)

        # make a copy so the caller doesn't mess these up
        return self._import_priorities.copy()

    def get_name(self) -> str:
        return self.name

    def fetch_object_from_document_path(self, object_path: str) -> 'CdmObject':
        if object_path in self.internal_declarations:
            return self.internal_declarations[object_path]

    def _prioritize_imports(self, processed_set: Set['CdmDocumentDefinition'], priority_map: Dict['CdmDocumentDefinition', int], sequence: int,
                            moniker_map: Dict[str, 'CdmDocumentDefinition'], skip_monikered: bool = False) -> int:
        # goal is to make a map from the reverse order of imports (breadth first) to the first (aka last) sequence number in that list.
        # This gives the semantic that the 'last/shallowest' definition for a duplicate symbol wins,
        # the lower in this list a document shows up, the higher priority its definitions are for resolving conflicts.
        # for 'moniker' imports, keep track of the 'last/shallowest' use of each moniker tag.

        # if already in list, don't do this again
        if self in processed_set:
            return sequence

        processed_set.add(self)

        if self.imports:
            # reverse order
            # first add the imports done at this level only
            rev_imp = self.imports[::-1]  # reverse the list
            for imp in rev_imp:
                imp_doc = imp._resolved_document  # type: CdmDocumentDefinition
                # don't add the moniker imports to the priority list
                if imp._resolved_document and not imp.moniker:
                    if imp_doc not in priority_map:
                        # add doc
                        priority_map[imp_doc] = sequence
                        sequence += 1

            # now add the imports of the imports
            for imp in rev_imp:
                imp_doc = imp._resolved_document  # type: CdmDocumentDefinition
                is_moniker = bool(imp.moniker)
                if imp_doc and imp_doc._import_priorities:
                    # lucky, already done so avoid recursion and copy
                    imp_pri_sub = imp_doc._get_import_priorities()
                    imp_pri_sub.import_priority.pop(imp_doc)  # because already added above
                    imports = list(imp_pri_sub.import_priority.keys())
                    imports.sort(key=lambda i: imp_pri_sub.import_priority[i])
                    for key in imports:
                        if key not in priority_map:
                            # add doc
                            priority_map[key] = sequence
                            sequence += 1

                    if not is_moniker:
                        for key, value in imp_pri_sub.moniker_priority_map.items():
                            moniker_map[key] = value
                elif imp_doc:
                    # skip the monikered imports from here if this is a monikered import itself and we are only collecting the dependencies
                    sequence = imp_doc._prioritize_imports(processed_set, priority_map, sequence, moniker_map, is_moniker)

            if not skip_monikered:
                # moniker imports are prioritized by the 'closest' use of the moniker to the starting doc.
                # so last one found in this recursion
                for imp in self.imports:
                    if imp._resolved_document and imp.moniker:
                        moniker_map[imp.moniker] = imp._resolved_document

        return sequence

    async def refresh_async(self, res_opt: Optional['ResolveOptions'] = None) -> None:
        """updates indexes for document content, call this after modifying objects in the document"""
        res_opt = res_opt if res_opt is not None else ResolveOptions(wrt_doc=self)

        self._needs_indexing = True
        await self._index_if_needed(res_opt)

    async def _reload_async(self) -> None:
        await self.ctx.corpus._fetch_object_async(self.corpus_path, force_reload=True)

    async def save_as_async(self, new_name: str, save_referenced: bool = False, options: Optional['CopyOptions'] = None) -> bool:
        """saves the document back through the adapter in the requested format
        format is specified via document name/extension based on conventions:
        'model.json' for back compat model, '*.manifest.json' for manifest, '*.json' for cdm defs
        save_referenced (default false) when true will also save any schema defintion documents that are
        linked from the source doc and that have been modified. existing document names are used for those."""
        options = options if options is not None else CopyOptions()

        if new_name == self.name:
            self._is_dirty = False

        return await self.ctx.corpus._save_document_as(self, options, new_name, save_referenced)

    async def _save_linked_documents_async(self, options: 'CopyOptions') -> bool:
        # the only linked documents would be the imports
        if self.imports:
            for imp in self.imports:
                # get the document object from the import
                doc_imp = await self.ctx.corpus.fetch_object_async(imp.corpus_path, self)
                if doc_imp and doc_imp._is_dirty:
                    # save it with the same name
                    if not await doc_imp.save_as_async(doc_imp.name, True, options):
                        self.ctx.logger.error('Failed to save import {}'.format(doc_imp.name))
                        return False
        return True

    def validate(self) -> bool:
        return bool(self.name)

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        if pre_children and pre_children(self, path_from):
            return False

        if self.definitions and self.definitions._visit_array(path_from, pre_children, post_children):
            return True

        if post_children and post_children(self, path_from):
            return True

        return False

    def _clear_caches(self):
        self.internal_declarations = {}
