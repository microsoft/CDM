# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from datetime import datetime
from typing import Dict, List, Optional, Set, Tuple, TYPE_CHECKING
import warnings

from cdm.enums import CdmLogCode
from cdm.utilities.string_utils import StringUtils

from cdm.enums import CdmObjectType, ImportsLoadStrategy
from cdm.utilities import CopyOptions, ImportInfo, logger, ResolveOptions

from .cdm_container_def import CdmContainerDefinition
from .cdm_definition_collection import CdmDefinitionCollection
from .cdm_import_collection import CdmImportCollection
from .cdm_object_simple import CdmObjectSimple

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmDataTypeDefinition, CdmImport, CdmFolderDefinition, CdmObject, \
        CdmObjectDefinition, CdmTraitDefinition
    from cdm.utilities import FriendlyFormatNode, VisitCallback


class ImportPriorities:
    def __init__(self):
        self.import_priority = {}  # type: Dict[CdmDocumentDefinition, ImportInfo]
        self.moniker_priority_map = {}  # type: Dict[str, CdmDocumentDefinition]

        # True if one of the document's imports import this document back.
        # Ex.: A.cdm.json -> B.cdm.json -> A.cdm.json
        self.has_circular_import = False # type: bool

    def copy(self) -> 'ImportPriorities':
        c = ImportPriorities()
        if self.import_priority:
            c.import_priority = self.import_priority.copy()
        if self.moniker_priority_map:
            c.moniker_priority_map = self.moniker_priority_map.copy()
        c.has_circular_import = self.has_circular_import

        return c


class CdmDocumentDefinition(CdmObjectSimple, CdmContainerDefinition):
    # The maximum json semantic version supported by this ObjectModel version.
    current_json_schema_semantic_version = '1.2.0'

    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx)

        self._TAG = CdmDocumentDefinition.__name__

        # the document name.
        self.name = name  # type: str

        self.in_document = self

        # the document schema.
        self.schema = None  # type: Optional[str]

        # the document json schema semantic version.
        self.json_schema_semantic_version = self.current_json_schema_semantic_version  # type: str
        
        # the document version.
        self.document_version = None  # type: Optional[str]

        # the document folder.
        self.folder = None  # type: Optional[CdmFolderDefinition]

        # --- internal ---

        self._currently_indexing = False
        self._declarations_indexed = False
        self._file_system_modified_time = None  # type: Optional[datetime]
        # The folder where this object exists
        self._folder_path = None  # type: Optional[str]
        self._imports_indexed = False
        self._import_priorities = None  # type: Optional[ImportPriorities]
        self._is_dirty = True  # type: bool
        # The namespace where this object can be found
        self._namespace = None  # type: Optional[str]
        self._needs_indexing = True
        self._imports = CdmImportCollection(self.ctx, self)
        self._definitions = CdmDefinitionCollection(self.ctx, self)
        self._is_valid = True  # types: bool

        self._clear_caches()

    @property
    def at_corpus_path(self) -> str:
        if self.folder is None:
            return 'NULL:/{}'.format(self.name)

        return self.folder.at_corpus_path + self.name

    @property
    def folder_path(self) -> str:
        warnings.warn('This property is likely to be removed soon.\nUse doc.owner._folder_path instead.', DeprecationWarning)
        return self._folder_path

    @property
    def namespace(self) -> str:
        warnings.warn('This property is likely to be removed soon.\nUse doc.owner.namespace instead.', DeprecationWarning)
        return self._namespace

    @property
    def imports(self) -> 'CdmImportCollection':
        """the document imports"""
        return self._imports

    @property
    def definitions(self) -> 'CdmDefinitionCollection':
        """the document definitions."""
        return self._definitions

    @property
    def is_valid(self) -> str:
        warnings.warn('Property deprecated.', DeprecationWarning)
        return self._is_valid

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.DOCUMENT_DEF

    def _construct_resolved_attributes(self, res_opt: 'ResolveOptions', under: Optional['CdmAttributeContext']) -> 'ResolvedAttributeSetBuilder':
        return None

    def _construct_resolved_traits(self, rtsb: 'ResolvedTraitSetBuilder', res_opt: 'ResolveOptions') -> None:
        pass

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmDocumentDefinition'] = None) -> 'CdmDocumentDefinition':
        res_opt = res_opt if res_opt is not None else ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        if host is None:
            copy = CdmDocumentDefinition(self.ctx, self.name)
        else:
            copy = host
            copy.ctx = self.ctx
            copy.name = self.name
            copy.definitions.clear()
            copy._declarations_indexed = False
            copy.internal_declarations = {}
            copy._needs_indexing = True
            copy.imports.clear()
            copy._imports_indexed = False

        copy.in_document = copy
        copy._is_dirty = True
        copy._folder_path = self._folder_path
        copy.schema = self.schema
        copy.json_schema_semantic_version = self.json_schema_semantic_version
        copy.document_version = self.document_version

        for definition in self.definitions:
            copy.definitions.append(definition)

        for imp in self.imports:
            copy.imports.append(imp)

        return copy

    async def _index_if_needed(self, res_opt: 'ResolveOptions', load_imports: bool = False) -> bool:
        if not self._needs_indexing or self._currently_indexing:
            return True

        if not self.folder:
            logger.error(self.ctx, self._TAG, self._index_if_needed.__name__, self.at_corpus_path, CdmLogCode.ERR_VALDN_MISSING_DOC, self.name)
            return False

        corpus = self.folder._corpus

        # if the imports load strategy is "LAZY_LOAD", loadImports value will be the one sent by the called function.
        if res_opt.imports_load_strategy == ImportsLoadStrategy.DO_NOT_LOAD:
            load_imports = False
        elif res_opt.imports_load_strategy == ImportsLoadStrategy.LOAD:
            load_imports = True

        if load_imports:
            await corpus._resolve_imports_async(self, res_opt)

        # make the corpus internal machinery pay attention to this document for this call
        corpus._document_library._mark_document_for_indexing(self)

        return corpus._index_documents(res_opt, load_imports)

    def _get_import_priorities(self) -> 'ImportPriorities':
        if not self._import_priorities:
            import_priorities = ImportPriorities()
            import_priorities.import_priority[self] = ImportInfo(0, False)
            self._prioritize_imports(set(), import_priorities, 1, False)
            self._import_priorities = import_priorities

        # make a copy so the caller doesn't mess these up
        return self._import_priorities.copy()

    def get_name(self) -> str:
        return self.name

    def _fetch_object_from_document_path(self, object_path: str, res_opt: ResolveOptions) -> 'CdmObject':
        if object_path in self.internal_declarations:
            return self.internal_declarations[object_path]
        else:
            # this might be a request for an object def drill through of a reference.
            # path/(object)/paths
            # there can be several such requests in one path AND some of the requested
            # defintions might be defined inline inside a reference meaning the declared path
            # includes that reference name and could still be inside this document. example:
            # /path/path/refToInline/(object)/member1/refToSymbol/(object)/member2
            # the full path is not in this doc but /path/path/refToInline/(object)/member1/refToSymbol
            # is declared in this document. we then need to go to the doc for refToSymbol and
            # search for refToSymbol/member2

            # work backward until we find something in this document
            last_obj = object_path.rindex('/(object)')
            this_doc_part = object_path
            while last_obj > 0:
                this_doc_part = object_path[0, last_obj]
                if this_doc_part in self.internal_declarations:
                    this_doc_obj_ref = self.internal_declarations.get(this_doc_part)
                    that_doc_obj_def = this_doc_obj_ref.fetch_object_definition(res_opt)
                    if not that_doc_obj_def:
                        # get from other document.
                        # but first fix the path to look like it is relative to that object as declared in that doc
                        that_doc_part = object_path[last_obj + len('/(object)')]
                        that_doc_part = that_doc_obj_def.declared_path + that_doc_part
                        if that_doc_part == object_path:
                            # we got back to were we started. probably because something is just not found.
                            return None
                        return that_doc_obj_def.in_document.fetch_object_from_document_path(that_doc_part, res_opt)
                    return None
                last_obj = this_doc_part.rindex('/(object)')
            return None

    def _localize_corpus_paths(self, new_folder: 'CdmFolderDefinition') -> bool:
        all_went_well = True
        was_blocking = self.ctx.corpus._block_declared_path_changes
        self.ctx.corpus._block_declared_path_changes = True

        logger.info(self.ctx, self._TAG, self._localize_corpus_paths.__name__, new_folder.at_corpus_path,
                    'Localizing corpus paths in document \'{}\''.format(self.name))

        def import_callback(obj: 'CdmObject', path: str) -> bool:
            nonlocal all_went_well
            corpus_path, worked = self._localize_corpus_path(obj.corpus_path, new_folder)
            if not worked:
                all_went_well = False
            else:
                obj.corpus_path = corpus_path

        def entity_declaration_definition_callback(obj: 'CdmObject', path: str) -> bool:
            nonlocal all_went_well
            corpus_path, worked = self._localize_corpus_path(obj.entity_path, new_folder)
            if not worked:
                all_went_well = False
            else:
                obj.entity_path = corpus_path

        def data_partition_callback(obj: 'CdmObject', path: str) -> bool:
            nonlocal all_went_well
            corpus_path, worked = self._localize_corpus_path(obj.location, new_folder)
            if not worked:
                all_went_well = False
            else:
                obj.location = corpus_path
            corpus_path, worked = self._localize_corpus_path(obj.specialized_schema, new_folder)
            if not worked:
                all_went_well = False
            else:
                obj.specialized_schema = corpus_path

        def data_partition_pattern_callback(obj: 'CdmObject', path: str) -> bool:
            nonlocal all_went_well
            corpus_path, worked = self._localize_corpus_path(obj.root_location, new_folder)
            if not worked:
                all_went_well = False
            else:
                obj.root_location = corpus_path
            corpus_path, worked = self._localize_corpus_path(obj.specialized_schema, new_folder)
            if not worked:
                all_went_well = False
            else:
                obj.specialized_schema = corpus_path

        def e2e_relationship_callback(obj: 'CdmObject', path: str) -> bool:
            nonlocal all_went_well
            corpus_path, worked = self._localize_corpus_path(obj.to_entity, new_folder)
            if not worked:
                all_went_well = False
            else:
                obj.to_entity = corpus_path
            corpus_path, worked = self._localize_corpus_path(obj.from_entity, new_folder)
            if not worked:
                all_went_well = False
            else:
                obj.from_entity = corpus_path

        def manifest_declaration_callback(obj: 'CdmObject', path: str) -> bool:
            nonlocal all_went_well
            corpus_path, worked = self._localize_corpus_path(obj.definition, new_folder)
            if not worked:
                all_went_well = False
            else:
                obj.definition = corpus_path

        switcher = {
            CdmObjectType.IMPORT: import_callback,
            CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF: entity_declaration_definition_callback,
            CdmObjectType.REFERENCED_ENTITY_DECLARATION_DEF: entity_declaration_definition_callback,
            CdmObjectType.DATA_PARTITION_DEF: data_partition_callback,
            CdmObjectType.DATA_PARTITION_PATTERN_DEF: data_partition_pattern_callback,
            CdmObjectType.E2E_RELATIONSHIP_DEF: e2e_relationship_callback,
            CdmObjectType.MANIFEST_DECLARATION_DEF: manifest_declaration_callback
        }

        def pre_callback(obj: 'CdmObject', path: str) -> bool:
            # i don't like that document needs to know a little about these objects
            # in theory, we could create a virtual function on cdmObject that localizes properties
            # but then every object would need to know about the documents and paths and such ...
            # also, i already wrote this code.
            func = switcher.get(obj.object_type)
            if func:
                func(obj, path)
            return False

        # find anything in the document that is a corpus path
        self.visit('', pre_callback, None)

        self.ctx.corpus._block_declared_path_changes = was_blocking

        return all_went_well

    def _localize_corpus_path(self, path: str, new_folder: Optional['CdmFolderDefinition']) -> Tuple[str, bool]:
        # if this isn't a local path, then don't do anything to it
        if not path:
            return (path, True)

        # but first, if there was no previous folder (odd) then just localize as best we can
        old_folder = self.owner
        new_path = ''
        if old_folder is None:
            new_path = self.ctx.corpus.storage.create_relative_corpus_path(path, new_folder)
        else:
            # if the current value != the absolute path, then assume it is a relative path
            abs_path = self.ctx.corpus.storage.create_absolute_corpus_path(path, old_folder)
            if abs_path == path:
                new_path = abs_path  # leave it alone
            else:
                # make it relative to the new folder then
                new_path = self.ctx.corpus.storage.create_relative_corpus_path(abs_path, new_folder)

        if new_path is None:
            return (new_path, False)

        return (new_path, True)

    def _prioritize_imports(self, processed_set: Set['CdmDocumentDefinition'], import_priorities: 'ImportPriorities', sequence: int, \
                            skip_monikered: bool) -> int:
        # goal is to make a map from the reverse order of imports (breadth first) to the first (aka last) sequence number in that list.
        # This gives the semantic that the 'last/shallowest' definition for a duplicate symbol wins,
        # the lower in this list a document shows up, the higher priority its definitions are for resolving conflicts.
        # for 'moniker' imports, keep track of the 'last/shallowest' use of each moniker tag.

        # maps document to priority.
        priority_map = import_priorities.import_priority  # type: Dict[CdmDocumentDefinition, ImportInfo]

        # maps moniker to document.
        moniker_map = import_priorities.moniker_priority_map  # type: Dict[str, CdmDocumentDefinition]

        # if already in list, don't do this again
        if self in processed_set:
            # if the first document in the priority map is this then the document was the starting point of the recursion.
            # and if this document is present in the processedSet we know that there is a circular list of imports.
            if self in priority_map and priority_map[self].priority == 0:
                import_priorities.has_circular_import = True
            return sequence

        processed_set.add(self)

        if self.imports:
            # reverse order.
            # first add the imports done at this level only.
            # reverse the list
            reversed_imports = self.imports[::-1]  # type: List[CdmImport]
            moniker_imports = []  # type: List[CdmDocumentDefinition]

            for imp in reversed_imports:
                imp_doc = imp._document  # type: CdmDocumentDefinition

                # moniker imports will be added to the end of the priority list later.
                if imp_doc:
                    if not imp.moniker and imp_doc not in priority_map:
                        # add doc
                        priority_map[imp_doc] = ImportInfo(sequence, False)
                        sequence += 1
                    else:
                        moniker_imports.append(imp_doc)
                else:
                    logger.warning(self.ctx, self._TAG, CdmDocumentDefinition._prioritize_imports.__name__, self.at_corpus_path,
                                   CdmLogCode.WARN_DOC_IMPORT_NOT_LOADED ,imp.corpus_path)

            # now add the imports of the imports.
            for imp in reversed_imports:
                imp_doc = imp._document  # type: CdmDocumentDefinition
                is_moniker = bool(imp.moniker)

                if not imp_doc:
                    logger.warning(self.ctx, self._TAG, CdmDocumentDefinition._prioritize_imports.__name__, self.at_corpus_path,
                                   CdmLogCode.WARN_DOC_IMPORT_NOT_LOADED ,imp.corpus_path)

                # if the document has circular imports its order on the impDoc.ImportPriorities list is not correct
                # since the document itself will always be the first one on the list.
                if imp_doc and imp_doc._import_priorities and not imp_doc._import_priorities.has_circular_import:
                    # lucky, already done so avoid recursion and copy
                    imp_pri_sub = imp_doc._get_import_priorities()
                    imp_pri_sub.import_priority.pop(imp_doc)  # because already added above
                    imports = list(imp_pri_sub.import_priority.keys())
                    imports.sort(key=lambda doc: imp_pri_sub.import_priority[doc].priority)
                    for key in imports:
                        # if the document is imported with moniker in another document do not include it in the priority list of this one.
                        # moniker imports are only added to the priority list of the document that directly imports them.
                        if key not in priority_map and not imp_pri_sub.import_priority[key].is_moniker:
                            # add doc
                            priority_map[key] = ImportInfo(sequence, False)
                            sequence += 1

                    # if the import is not monikered then merge its monikerMap to this one.
                    if not is_moniker:
                        for key, value in imp_pri_sub.moniker_priority_map.items():
                            moniker_map[key] = value
                elif imp_doc:
                    # skip the monikered imports from here if this is a monikered import itself and we are only collecting the dependencies
                    sequence = imp_doc._prioritize_imports(processed_set, import_priorities, sequence, is_moniker)

            if not skip_monikered:
                # moniker imports are prioritized by the 'closest' use of the moniker to the starting doc.
                # so last one found in this recursion
                for imp in self.imports:
                    if imp._document and imp.moniker:
                        moniker_map[imp.moniker] = imp._document

                # if the document index is zero, the document being processed is the root of the imports chain.
                # in this case add the monikered imports to the end of the priorityMap.
                if self in priority_map and priority_map[self].priority == 0:
                    for doc in moniker_imports:
                        if doc not in priority_map:
                            priority_map[doc] = ImportInfo(sequence, True)
                            sequence += 1

        return sequence

    async def refresh_async(self, res_opt: Optional['ResolveOptions'] = None) -> bool:
        """updates indexes for document content, call this after modifying objects in the document"""
        res_opt = res_opt if res_opt is not None else ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        self._declarations_indexed = False
        self._needs_indexing = True
        self._is_valid = True
        return await self._index_if_needed(res_opt, True)

    async def _reload_async(self) -> None:
        await self.ctx.corpus.fetch_object_async(self.at_corpus_path, force_reload=True)

    async def save_as_async(self, new_name: str, save_referenced: bool = False, options: Optional['CopyOptions'] = None) -> bool:
        """saves the document back through the adapter in the requested format
        format is specified via document name/extension based on conventions:
        'model.json' for back compat model, '*.manifest.json' for manifest, '*.json' for cdm defs
        save_referenced (default False) when true will also save any schema defintion documents that are
        linked from the source doc and that have been modified. existing document names are used for those."""
        with logger._enter_scope(self._TAG, self.ctx, self.save_as_async.__name__):
            options = options if options is not None else CopyOptions()

            index_if_needed = await self._index_if_needed(ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives))
            if not index_if_needed:
                logger.error(self.ctx, self._TAG, self.save_as_async.__name__, self.at_corpus_path, CdmLogCode.ERR_INDEX_FAILED, self.name)
                return False

            if new_name == self.name:
                self._is_dirty = False

            return await self.ctx.corpus.persistence._save_document_as_async(self, options, new_name, save_referenced)

    async def _save_linked_documents_async(self, options: 'CopyOptions') -> bool:
        # the only linked documents would be the imports
        if self.imports:
            for imp in self.imports:
                # get the document object from the import
                doc_imp = await self.ctx.corpus.fetch_object_async(imp.corpus_path, self)
                if doc_imp and doc_imp._is_dirty:
                    # save it with the same name
                    if not await doc_imp.save_as_async(doc_imp.name, True, options):
                        logger.error(self.ctx, self._TAG, self._save_linked_documents_async.__name__, self.at_corpus_path, CdmLogCode.ERR_DOC_IMPORT_SAVING_FAILURE, doc_imp.name)
                        return False
        return True

    def fetch_object_definition(self, res_opt: Optional['ResolveOptions'] = None) -> Optional['CdmObjectDefinition']:
        if res_opt is None:
            res_opt = ResolveOptions(self, self.ctx.corpus.default_resolution_directives)
        return self

    def fetch_object_definition_name(self) -> Optional[str]:
        return self.name

    def validate(self) -> bool:
        if not bool(self.name):
            missing_fields = ['name']
            logger.error(self.ctx, self._TAG, 'validate', self.at_corpus_path, CdmLogCode.ERR_VALDN_INTEGRITY_CHECK_FAILURE, self.at_corpus_path, ', '.join(map(lambda s: '\'' + s + '\'', missing_fields)))
            return False
        return True

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

        def post_visit(obj: 'CdmObject', path: str) -> bool:
            obj.declared_path = None
            return False

        self.visit('', None, post_visit)

    def _import_path_to_doc(self, doc_dest: 'CdmDocumentDefinition') -> str:
        avoid_loop = set()

        def _internal_import_path_to_doc(doc_check: 'CdmDocumentDefinition', path: str) -> str:
            if doc_check == doc_dest:
                return ''
            if doc_check in avoid_loop:
                return None
            avoid_loop.add(doc_check)
            # if the docDest is one of the monikered imports of docCheck, then add the moniker and we are cool
            if doc_check._import_priorities and doc_check._import_priorities.moniker_priority_map:
                for key, value in doc_check._import_priorities.moniker_priority_map.items():
                    if value == doc_dest:
                        return '{}{}/'.format(path, key)
            # ok, what if the document can be reached directly from the imports here
            imp_info =  doc_check._import_priorities.import_priority[doc_check] \
                if doc_check._import_priorities and doc_check._import_priorities.import_priority else None
            if imp_info and imp_info.is_moniker is False:
                # good enough
                return path

            # still nothing, now we need to check those docs deeper
            if doc_check._import_priorities and doc_check._import_priorities.moniker_priority_map:
                for key, value in doc_check._import_priorities.moniker_priority_map:
                    path_found = _internal_import_path_to_doc(value, '{}{}/'.format(path, key))
                    if path_found:
                        return path_found

            if doc_check._import_priorities and doc_check._import_priorities.import_priority:
                for key, value in doc_check._import_priorities.import_priority:
                    if not value.is_moniker:
                        path_found = _internal_import_path_to_doc(key, path)
                        if path_found:
                            return path_found

            return None

        return _internal_import_path_to_doc(self, '')
