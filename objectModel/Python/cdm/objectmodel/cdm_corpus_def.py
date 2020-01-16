import asyncio
from collections import defaultdict
from datetime import datetime
from typing import cast, Callable, Dict, List, Optional, Set, Tuple, TypeVar, Union, TYPE_CHECKING

from cdm.storage import StorageManager
from cdm.enums import CdmAttributeContextType, CdmObjectType, CdmStatusLevel, CdmValidationStep
from cdm.objectmodel import CdmContainerDefinition
from cdm.utilities import AttributeResolutionDirectiveSet, DocsResult, logger, ResolveOptions, SymbolSet

from .cdm_attribute_ref import CdmAttributeReference
from .cdm_corpus_context import CdmCorpusContext
from .cdm_document_def import CdmDocumentDefinition
from .cdm_e2e_relationship import CdmE2ERelationship
from .cdm_folder_def import CdmFolderDefinition
from .cdm_object import CdmObject
from .cdm_object_ref import CdmObjectReference

if TYPE_CHECKING:
    from cdm.objectmodel import CdmArgumentValue, CdmAttributeContext, CdmDocumentDefinition, CdmEntityDefinition, \
        CdmEntityReference, CdmLocalEntityDeclarationDefinition, CdmManifestDefinition, CdmObject, CdmObjectDefinition, \
        CdmObjectReference, CdmParameterDefinition
    from cdm.storage import StorageAdapterBase
    from cdm.utilities import CdmError, CopyOptions, EventCallback

    TObject = TypeVar('TObject', bound=CdmObject)
    TObjectRef = TypeVar('TObjectRef', bound=CdmObjectReference)


SYMBOL_TYPE_CHECK = {
    CdmObjectType.TRAIT_REF: CdmObjectType.TRAIT_DEF,
    CdmObjectType.DATA_TYPE_REF: CdmObjectType.DATA_TYPE_DEF,
    CdmObjectType.ENTITY_REF: CdmObjectType.ENTITY_DEF,
    CdmObjectType.PARAMETER_DEF: CdmObjectType.PARAMETER_DEF,
    CdmObjectType.PURPOSE_REF: CdmObjectType.PURPOSE_DEF,
    CdmObjectType.ATTRIBUTE_GROUP_REF: CdmObjectType.ATTRIBUTE_GROUP_DEF
}


class CdmCorpusDefinition:
    _CDM_EXTENSION = 'cdm.json'

    def __init__(self):
        from cdm.persistence import PersistenceLayer

        # the corpus root path.
        self.root_path = None  # type: Optional[str]

        self.ctx = CdmCorpusContext(self, None)

        # the app ID, optional property.
        self.app_id = None # type: Optional[str]

        # whether we are currently performing a resolution or not.
        # used to stop making documents dirty during CdmCollections operations.
        self.is_currently_resolving = False # type: bool

        # used by visit functions of CdmObjects to skip calculating the declaredPath.
        self.block_declared_path_changes = False # type: bool

        # --- internal ---
        self._all_documents = []  # type: List[Tuple[CdmFolderDefinition, CdmDocumentDefinition]]
        self._path_lookup = {}  # type: Dict[str, Tuple[CdmFolderDefinition, CdmDocumentDefinition]]
        self._symbol_definitions = {}  # type: Dict[str, List[CdmDocumentDefinition]]
        self._incoming_relationships = defaultdict(list)  # type: Dict[CdmEntityDefinition, List[CdmE2ERelationship]]
        self._outgoing_relationships = defaultdict(list)  # type: Dict[CdmEntityDefinition, List[CdmE2ERelationship]]
        self._definition_reference_symbols = {}  # type: Dict[str, SymbolSet]
        self._empty_rts = {}  # type: Dict[str, ResolvedTraitSet]
        self._object_cache = {} # type: Dict[str, CdmObject]
        self._storage = StorageManager(self)
        self._persistence = PersistenceLayer(self)
        self._symbol_to_entity_def_list = defaultdict(list)  # type: Dict[str, List[CdmEntityDefinition]]
        self._root_manifest = None  # type: Optional[CdmManifestDefinition]
        self._TAG = CdmCorpusDefinition.__name__

        self._docs_not_loaded = set() # type: Set[str]
        self._docs_currently_loading = set() # type: Set[str]
        self._docs_not_indexed = set() # type: Set[CdmDocumentDefinition]
        self._docs_not_found = set() # type: Set[str]

    @property
    def storage(self) -> 'StorageManager':
        return self._storage

    @property
    def persistence(self) -> 'PersistenceLayer':
        return self._persistence

    def _add_document_objects(self, folder: 'CdmFolderDefinition', doc: 'CdmDocumentDefinition'):
        path = self.storage.create_absolute_corpus_path('{}{}'.format(doc.folder_path, doc.name), doc).lower()
        if path not in self._path_lookup:
            self._all_documents.append((folder, doc))
            self._path_lookup[path] = (folder, doc)

        return doc

    async def calculate_entity_graph_async(self, curr_manifest: 'CdmManifestDefinition') -> None:
        """Calculate the entity to entity relationships for all the entities present in the folder and its sub folder."""
        # Index all the entities that are present in the tree of manifests passed.
        await self._calculate_entity_graph_async(curr_manifest)

    async def _calculate_entity_graph_async(self, curr_manifest: 'CdmManifestDefinition', res_ent_map: Optional[Dict[str, str]] = None) -> None:
        for entity_dec in curr_manifest.entities:
            entity_path = await curr_manifest._get_entity_path_from_declaration(entity_dec, curr_manifest)
            entity = await self.fetch_object_async(entity_path)  # type: CdmEntityDefinition

            if entity is None:
                continue

            res_entity = None # type: Optional[CdmEntityDefinition]
            res_opt = ResolveOptions(entity.in_document)

            is_resolved_entity = entity.attribute_context is not None

            # only create a resolved entity if the entity passed in was not a resolved entity
            if not is_resolved_entity:
                # first get the resolved entity so that all of the references are present
                res_entity = await entity.create_resolved_entity_async('wrtSelf_' + entity.entity_name, res_opt)
            else:
                res_entity = entity

            self._symbol_to_entity_def_list[entity.entity_name].append(entity)

            # find outgoing entity relationships using attribute context
            outgoing_relationships = self._find_outgoing_relationships(res_opt, res_entity, res_entity.attribute_context)  # type: List[CdmE2ERelationship]

            # if the entity is a resolved entity, change the relationships to point to the resolved versions
            if is_resolved_entity and res_ent_map:
                for rel in outgoing_relationships:
                    if rel.to_entity in res_ent_map:
                        rel.to_entity = res_ent_map[rel.to_entity]

            self._outgoing_relationships[entity] = outgoing_relationships

            # flip outgoing entity relationships list to get incoming relationships map
            if outgoing_relationships:
                for rel in outgoing_relationships:
                    target_ent = await self.fetch_object_async(rel.to_entity, curr_manifest)
                    self._incoming_relationships[target_ent].append(rel)

            # delete the resolved entity if we created one here
            if not is_resolved_entity:
                res_entity.in_document.folder.documents.remove(res_entity.in_document.name)

        for sub_manifest_def in curr_manifest.sub_manifests:
            sub_manifest = await self.fetch_object_async(sub_manifest_def.definition, curr_manifest) # type: CdmManifestDefinition
            await self.calculate_entity_graph_async(sub_manifest)

    def _check_object_integrity(self, current_doc: 'CdmDocumentDefinition') -> bool:
        ctx = self.ctx
        error_count = 0

        def callback(obj: 'CdmObject', path: str) -> bool:
            nonlocal error_count
            if not obj.validate():
                logger.error(self._TAG, self.ctx, 'integrity check failed for : \'{}\''.format(current_doc.folder_path + path))
                error_count += 1
            else:
                obj.ctx = ctx

            logger.info(self._TAG, self.ctx, 'checked \'{}\''.format(current_doc.folder_path + path))

            return False

        current_doc.visit('', callback, None)

        return error_count == 0

    def _const_type_check(self, res_opt: 'ResolveOptions', current_doc: 'CdmDocumentDefinition', param_def: 'CdmParameterDefinition', a_value: 'CdmArgumentValue') -> 'CdmArgumentValue':
        ctx = self.ctx
        replacement = a_value
        # if parameter type is entity, then the value should be an entity or ref to one
        # same is true of 'dataType' dataType
        ref = param_def.data_type_ref
        if not ref:
            return replacement

        dt = ref.fetch_object_definition(res_opt)

        # compare with passed in value or default for parameter
        p_value = a_value
        if not p_value:
            p_value = param_def.default_value
            replacement = p_value

        if p_value:
            if dt.is_derived_from('cdmObject', res_opt):
                expected_types = []
                expected = None
                if dt.is_derived_from('entity', res_opt):
                    expected_types.append(CdmObjectType.CONSTANT_ENTITY_DEF)
                    expected_types.append(CdmObjectType.ENTITY_REF)
                    expected_types.append(CdmObjectType.ENTITY_DEF)
                    expected = 'entity'
                elif dt.is_derived_from('attribute', res_opt):
                    expected_types.append(CdmObjectType.ATTRIBUTE_REF)
                    expected_types.append(CdmObjectType.TYPE_ATTRIBUTE_DEF)
                    expected_types.append(CdmObjectType.ENTITY_ATTRIBUTE_DEF)
                    expected = 'attribute'
                elif dt.is_derived_from('dataType', res_opt):
                    expected_types.append(CdmObjectType.DATA_TYPE_REF)
                    expected_types.append(CdmObjectType.DATA_TYPE_DEF)
                    expected = 'dataType'
                elif dt.is_derived_from('purpose', res_opt):
                    expected_types.append(CdmObjectType.PURPOSE_REF)
                    expected_types.append(CdmObjectType.PURPOSE_DEF)
                    expected = 'purpose'
                elif dt.is_derived_from('trait', res_opt):
                    expected_types.append(CdmObjectType.TRAIT_REF)
                    expected_types.append(CdmObjectType.TRAIT_DEF)
                    expected = 'trait'
                elif dt.is_derived_from('attributeGroup', res_opt):
                    expected_types.append(CdmObjectType.ATTRIBUTE_GROUP_REF)
                    expected_types.append(CdmObjectType.ATTRIBUTE_GROUP_DEF)
                    expected = 'attributeGroup'

                if not expected_types:
                    logger.error(self._TAG, self.ctx, 'parameter \'{}\' has an unexpected dataType.'.format(param_def.name), ctx._relative_path)

                # if a string constant, resolve to an object ref.
                found_type = CdmObjectType.ERROR
                if isinstance(p_value, CdmObject):
                    found_type = p_value.object_type

                found_desc = ctx._relative_path
                if isinstance(p_value, str):
                    if p_value == 'this.attribute' and expected == 'attribute':
                        # will get sorted out later when resolving traits
                        found_type = CdmObjectType.ATTRIBUTE_REF
                    else:
                        found_desc = p_value
                        seek_res_att = CdmObjectReference.offset_attribute_promise(p_value)
                        if seek_res_att >= 0:
                            # get an object there that will get resolved later after resolved attributes
                            replacement = CdmAttributeReference(self.ctx, p_value, True)
                            replacement.in_document = current_doc
                            found_type = CdmObjectType.ATTRIBUTE_REF
                        else:
                            lu = ctx.corpus._resolve_symbol_reference(res_opt, current_doc, p_value, CdmObjectType.ERROR, True)
                            if lu:
                                if expected == 'attribute':
                                    replacement = CdmAttributeReference(self.ctx, p_value, True)
                                    replacement.in_document = current_doc
                                    found_type = CdmObjectType.ATTRIBUTE_REF
                                else:
                                    replacement = lu
                                    if isinstance(replacement, CdmObject):
                                        found_type = replacement.object_type

                if expected_types.index(found_type) == -1:
                    logger.error(self._TAG, self.ctx,
                                    'parameter \'{0}\' has the dataType of \'{1}\' but the value \'{2}\' does\'t resolve to a known {1} referenece'\
                                        .format(param_def.get_name(), expected, found_desc),
                                    current_doc.folder_path + ctx._relative_path)
                else:
                    logger.info(self._TAG, self.ctx, '    resolved \'{}\''.format(found_desc), ctx._relative_path)

        return replacement

    async def create_root_manifest_async(self, corpus_path: str) -> Optional['CdmManifestDefinition']:
        if self._is_path_manifest_document(corpus_path):
            self._root_manifest = await self._fetch_object_async(corpus_path)
            return self._root_manifest
        return None

    def _find_missing_imports_from_document(self, doc: 'CdmDocumentDefinition') -> None:
        """Find import objects for the document that have not been loaded yet"""
        if doc.imports:
            for imp in doc.imports:
                if not imp.doc:
                    # no document set for this import, see if it is already loaded into the corpus
                    path = self.storage.create_absolute_corpus_path(imp.corpus_path, doc)
                    if path not in self._docs_not_found:
                        lookup = self._path_lookup.get(path.lower()) # type: Tuple[CdmFolderDefinition, CdmDocumentDefinition]
                        if not lookup:
                            self._docs_not_loaded.add(path)

    def _find_outgoing_relationships(self, res_opt: 'ResolveOptions', res_entity: 'CdmEntityDefinition', att_ctx: 'CdmAttributeContext', \
                                     outer_att_group: Optional['CdmAttributeContext'] = None) -> List['CdmE2ERelationship']:
        out_rels = [] # type: List[CdmE2ERelationship]
        inner_att_group = None # type: Optional[CdmAttributeContext]

        get_attribute_name = lambda named_reference: named_reference[named_reference.rfind('/') + 1:]

        def find_added_attribute_identity(context: 'CdmAttributeContext') -> Optional[str]:
            """get the attribute name from the foreign key"""
            for sub in context.contents:
                if sub.object_type != CdmObjectType.ATTRIBUTE_CONTEXT_DEF or sub.type == CdmAttributeContextType.ENTITY:
                    continue
                sub_ctx = sub  # type: CdmAttributeContext
                fk = find_added_attribute_identity(sub_ctx)
                if fk is not None:
                    return fk
                elif sub_ctx.type == CdmAttributeContextType.ADDED_ATTRIBUTE_IDENTITY and sub_ctx.contents:
                    # the foreign key is found in the first of the array of the 'ADDED_ATTRIBUTE_IDENTITY' context type
                    return cast('CdmObjectReference', sub_ctx.contents[0]).named_reference
            return None

        if att_ctx:
            for sub_att_ctx in att_ctx.contents:
                # find entity references that identifies the 'this' entity
                if sub_att_ctx.object_type != CdmObjectType.ATTRIBUTE_CONTEXT_DEF:
                    continue

                child = sub_att_ctx  # type: CdmAttributeContext

                if child.definition and child.definition.object_type == CdmObjectType.ENTITY_REF:
                    to_att = [get_attribute_name(trait.arguments[0].value.named_reference) for trait in child.exhibits_traits \
                            if trait.fetch_object_definition_name() == 'is.identifiedBy' and trait.arguments] # type: List[string]

                    to_entity = child.definition.fetch_object_definition(res_opt) # type: CdmEntityDefinition

                    # entity references should have the 'is.identifiedBy' trait, and the entity ref should be valid
                    if len(to_att) == 1 and to_entity:
                        foreign_key = find_added_attribute_identity(outer_att_group or att_ctx)

                        if foreign_key is not None:
                            from_att = get_attribute_name(foreign_key).replace(child.name + '_', '')
                            new_e2e_relationship = CdmE2ERelationship(self.ctx, '')
                            new_e2e_relationship.from_entity = \
                                self.storage.create_absolute_corpus_path(res_entity.at_corpus_path.replace('wrtSelf_', ''), res_entity)
                            new_e2e_relationship.from_entity_attribute = from_att
                            new_e2e_relationship.to_entity = \
                                self.storage.create_absolute_corpus_path(to_entity.at_corpus_path.replace('wrtSelf_', ''), to_entity)
                            new_e2e_relationship.to_entity_attribute = to_att[0]
                            out_rels.append(new_e2e_relationship)
                elif child.definition and child.definition.object_type == CdmObjectType.ATTRIBUTE_GROUP_REF:
                    # if this is an attribute group, we need to search for foreign keys from this level
                    inner_att_group = child

                # repeat the process on the child node
                sub_out_rels = self._find_outgoing_relationships(res_opt, res_entity, child, inner_att_group or outer_att_group)
                inner_att_group = None
                out_rels.extend(sub_out_rels)

        return out_rels

    def _fetch_definition_cache_tag(self, res_opt: 'ResolveOptions', definition: 'CdmObject', kind: str, extra_tags: str = '',
                                    use_name_not_id: bool = False) -> str:
        # construct a tag that is unique for a given object in a given context
        # context is:
        #   (1) the wrt_doc has a set of imports and defintions that may change what the object is point at
        #   (2) there are different kinds of things stored per object (resolved traits, atts, etc.)
        #   (3) the directives from the resolve Options might matter
        #   (4) sometimes the caller needs different caches (extra_tags) even give 1-3 are the same
        # the hardest part is (1). To do this, see if the object has a set of reference documents registered.
        # if there is nothing registered, there is only one possible way to resolve the object so don't include doc info in the tag.
        # if there IS something registered, then the object could be ambiguous.
        # find the 'index' of each of the ref documents (potential definition of something referenced under this scope)
        # in the wrt document's list of imports. sort the ref docs by their index,
        # the relative ordering of found documents makes a unique context.
        # the hope is that many, many different lists of imported files will result in identical reference sortings, so lots of re-use
        # since this is an expensive operation, actually cache the sorted list associated with this object and wrt_doc

        # easy stuff first
        this_id = ''
        this_name = definition.fetch_object_definition_name()
        if use_name_not_id:
            this_id = this_name
        else:
            this_id = str(definition.id)

        tag_suffix = '-{}-{}'.format(kind, this_id)
        tag_suffix += '-({})'.format(res_opt.directives.get_tag() if res_opt.directives else '')
        if extra_tags:
            tag_suffix += '-{}'.format(extra_tags)

        # is there a registered set?
        # (for the objectdef, not for a reference) of the many symbols involved in defining this thing(might be none)
        obj_def = definition.fetch_object_definition(res_opt)
        symbols_ref = None  # type: SymbolSet
        if obj_def:
            key = CdmCorpusDefinition._fetch_cache_key_from_object(obj_def, kind)
            symbols_ref = self._definition_reference_symbols.get(key)

        if symbols_ref is None and this_name is not None:
            # every symbol should depend on at least itself
            sym_set_this = SymbolSet()
            sym_set_this.add(this_name)
            self._register_definition_reference_symbols(definition, kind, sym_set_this)
            symbols_ref = sym_set_this

        if symbols_ref and symbols_ref.size > 0:
            # each symbol may have definitions in many documents. use import_priority to figure out which one we want
            wrt_doc = res_opt.wrt_doc
            found_doc_ids = set()
            if wrt_doc._import_priorities:
                for sym_ref in symbols_ref:
                    # get the set of docs where defined
                    docs_res = self._docs_for_symbol(res_opt, wrt_doc, definition.in_document, sym_ref)
                    # we only add the best doc if there are multiple options
                    if docs_res is not None and docs_res.doc_list is not None and len(docs_res.doc_list) > 1:
                        doc_best = CdmCorpusDefinition._fetch_priority_doc(docs_res.doc_list, wrt_doc._import_priorities.import_priority)
                        if doc_best:
                            found_doc_ids.add(str(doc_best.id))

            found_doc_ids_list = list(found_doc_ids)
            found_doc_ids_list.sort()
            tag_pre = '-'.join(found_doc_ids_list)

            return tag_pre + tag_suffix

        return None

    async def fetch_object_async(self, object_path: str, relative_object: 'CdmObject' = None) -> 'CdmObject':
        """gets an object by the path from the Corpus."""
        return await self._fetch_object_async(object_path, relative_object=relative_object, force_reload=False)

    def _index_documents(self, res_opt: 'ResolveOptions', current_doc: 'CdmDocumentDefinition') -> bool:
        if not self._docs_not_indexed:
            return True

        # index any imports
        for doc in self._docs_not_indexed:
            if doc._needs_indexing:
                logger.debug(self._TAG, self.ctx, 'index start: {}'.format(doc.at_corpus_path), self._index_documents.__name__)
                doc._clear_caches()
                doc._get_import_priorities()

        # check basic integrity
        for doc in self._docs_not_indexed:
            if doc._needs_indexing:
                if not self._check_object_integrity(doc):
                    return False

        # declare definitions of objects in this doc
        for doc in self._docs_not_indexed:
            if doc._needs_indexing:
                self._declare_object_definitions(doc, '')

        # make sure we can find everything that is named by reference
        for doc in self._docs_not_indexed:
            if doc._needs_indexing:
                res_opt_local = CdmObject._copy_resolve_options(res_opt)
                res_opt_local.wrt_doc = doc
                self._resolve_object_definitions(res_opt_local, doc)

        # now resolve any trait arguments that are type object
        for doc in self._docs_not_indexed:
            if doc._needs_indexing:
                res_opt_local = CdmObject._copy_resolve_options(res_opt)
                res_opt_local.wrt_doc = doc
                self._resolve_trait_arguments(res_opt_local, doc)

        # finish up
        # make a copy to avoid error iterating over set that is modified in loop
        for doc in self._docs_not_indexed.copy():
            if doc._needs_indexing:
                logger.debug(self._TAG, self.ctx, 'index finish: {}'.format(doc.at_corpus_path), self._index_documents.__name__)
                self._finish_document_resolve(doc)
    
        return True

    def _declare_object_definitions(self, current_doc: 'CdmDocumentDefinition', relative_path: str) -> None:
        ctx = self.ctx
        # TODO: find a better solution for this set
        internal_declaration_types = set([CdmObjectType.ENTITY_DEF, CdmObjectType.PARAMETER_DEF, CdmObjectType.TRAIT_DEF, CdmObjectType.PURPOSE_DEF,
                                          CdmObjectType.DATA_TYPE_DEF, CdmObjectType.TYPE_ATTRIBUTE_DEF, CdmObjectType.ENTITY_ATTRIBUTE_DEF,
                                          CdmObjectType.ATTRIBUTE_GROUP_DEF, CdmObjectType.CONSTANT_ENTITY_DEF, CdmObjectType.ATTRIBUTE_CONTEXT_DEF,
                                          CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF, CdmObjectType.REFERENCED_ENTITY_DECLARATION_DEF])

        def callback(obj: 'CdmObject', path: str) -> bool:
            if path.find('(unspecified)') > 0:
                return True

            if obj.object_type in internal_declaration_types:
                ctx._relative_path = relative_path

                corpus_path = '{}/{}'.format(corpus_path_root, path)
                if path in current_doc.internal_declarations:
                    logger.error(self._TAG, self.ctx, 'duplicate declaration for item \'{}\''.format(path), corpus_path)
                    return False

                current_doc.internal_declarations[path] = obj
                self._register_symbol(path, current_doc)

                logger.info(self._TAG, self.ctx, 'declared \'{}\''.format(path), corpus_path)

            return False

        corpus_path_root = current_doc.folder_path + current_doc.name
        current_doc.visit(relative_path, callback, None)

    def _docs_for_symbol(self, res_opt: 'ResolveOptions', wrt_doc: 'CdmDocumentDefinition', from_doc: 'CdmDocumentDefinition', symbol_def: str) -> DocsResult:
        ctx = self.ctx
        result = DocsResult(new_symbol=symbol_def)

        # first decision, is the symbol defined anywhere?
        result.doc_list = self._symbol_definitions.get(symbol_def)
        if not result.doc_list:
            # this can happen when the symbol is disambiguated with a moniker for one of the imports used
            # in this situation, the 'wrt' needs to be ignored,
            # the document where the reference is being made has a map of the 'one best' monikered import to search for each moniker
            pre_end = symbol_def.find('/')

            if pre_end == 0:
                # absolute refererence
                logger.error(self._TAG, self.ctx, 'no support for absolute references yet. fix \'{}\''.format(symbol_def), ctx._relative_path)

                return None

            if pre_end > 0:
                prefix = symbol_def[0: pre_end]
                result.new_symbol = symbol_def[pre_end + 1:]
                result.doc_list = self._symbol_definitions.get(result.new_symbol)
                if from_doc and from_doc._import_priorities and prefix in from_doc._import_priorities.moniker_priority_map:
                    temp_moniker_doc = from_doc._import_priorities.moniker_priority_map.get(prefix)
                    # if more monikers, keep looking
                    if result.new_symbol.find('/') >= 0 and result.new_symbol not in self._symbol_definitions:
                        return self._docs_for_symbol(res_opt, wrt_doc, temp_moniker_doc, result.new_symbol)
                    res_opt.from_monier = prefix
                    result.doc_best = temp_moniker_doc
                elif wrt_doc._import_priorities and prefix in wrt_doc._import_priorities.moniker_priority_map:
                    # if that didn't work, then see if the wrt_doc can find the moniker
                    temp_moniker_doc = wrt_doc._import_priorities.moniker_priority_map.get(prefix)
                    # if more monikers, keep looking
                    if result.new_symbol.find('/') >= 0:
                        return self._docs_for_symbol(res_opt, wrt_doc, temp_moniker_doc, result.new_symbol)
                    res_opt.from_monier = prefix
                    result.doc_best = temp_moniker_doc
                else:
                    # moniker not recognized in either doc, fail with grace
                    result.new_symbol = symbol_def
                    result.doc_list = None

        return result

    def _fetch_empty_resolved_trait_set(self, res_opt: 'ResolveOptions') -> 'ResolvedTraitSet':
        from cdm.resolvedmodel import ResolvedTraitSet

        key = ''
        if res_opt:
            if res_opt.wrt_doc:
                key = str(res_opt.wrt_doc.id)
            key += '-'
            if res_opt.directives:
                key += res_opt.directives.get_tag()
        rts = self._empty_rts.get(key)
        if not rts:
            rts = ResolvedTraitSet(res_opt)
            self._empty_rts[key] = rts

        return rts

    def _finish_document_resolve(self, doc: 'CdmDocumentDetinition') -> None:
        doc._currently_indexing = False
        doc._imports_indexed = True
        doc._needs_indexing = False

        for definition in doc.definitions:
            if definition.object_type == CdmObjectType.ENTITY_DEF:
                logger.debug(self._TAG, self.ctx, 'indexed entity: {}'.format(definition.at_corpus_path))
        
        self._docs_not_indexed.discard(doc)

    def _finish_resolve(self) -> None:
        ctx = self.ctx
        #  cleanup references
        logger.debug(self._TAG, self.ctx, 'finishing...')

        # turn elevated traits back on, they are off by default and should work fully now that everything is resolved
        for fd in self._all_documents:
            self._finish_document_resolve(fd[1])

    async def _load_folder_or_document(self, object_path: str, force_reload: bool = False) -> Optional['CdmContainerDefinition']:
        if not object_path:
            return None

        # first check for namespace
        path_tuple = self.storage.split_namespace_path(object_path)
        namespace = path_tuple[0] or self.storage.default_namespace
        object_path = path_tuple[1]

        if object_path.find('/') == 0:
            namespace_folder = self.storage.fetch_root_folder(namespace)
            namespace_adapter = self.storage.fetch_adapter(namespace)
            if not namespace_folder or not namespace_adapter:
                logger.error(self._TAG, self.ctx, 'The namespace "{}" has not been registered'.format(namespace),
                             '{}({})'.format(self._load_folder_or_document.__name__, object_path))

                return None

            last_folder = await namespace_folder._fetch_child_folder_from_path_async(object_path, namespace_adapter, False)

            # don't create new folders, just go as far as possible
            if last_folder:
                # maybe the search is for a folder?
                last_path = last_folder.folder_path
                if last_path == object_path:
                    return last_folder

                # remove path to folder and then look in the folder
                object_path = object_path[len(last_path):]

                return await last_folder._fetch_document_from_folder_path_async(object_path, namespace_adapter, force_reload)

        return None

    async def _load_imports_async(self, doc: 'CdmDocumentDefinition') -> None:
        docs_now_loaded = set() # type: Set[CdmDocumentDefinition]

        if self._docs_not_loaded:
            async def load_docs(missing: str) -> None:
                if missing not in self._docs_not_found and missing not in self._docs_currently_loading and missing in self._docs_not_loaded:
                    # set status to loading
                    self._docs_not_loaded.remove(missing)
                    self._docs_currently_loading.add(missing)

                    # load it
                    new_doc = await self._load_folder_or_document(missing) # type: CdmDocumentDefinition

                    if new_doc:
                        logger.info(self._TAG, self.ctx, 'resolved import for \'{}\''.format(new_doc.name), doc.at_corpus_path)
                        # doc is now loaded
                        docs_now_loaded.add(new_doc)
                        # next step is that the doc needs to be indexed
                        self._docs_not_indexed.add(new_doc)
                        new_doc._currently_indexing = True
                    else:
                        logger.warning(self._TAG, self.ctx, 'unable to resolve import for \'{}\''.format(missing), doc.at_corpus_path)
                        # set doc as not found
                        self._docs_not_found.add(missing)
                    # doc is no longer loading
                    self._docs_currently_loading.remove(missing)

            task_list = [load_docs(missing) for missing in self._docs_not_loaded]

            # wait for all of the missing docs to finish loading
            await asyncio.gather(*task_list)

            # now that we've loaded new docs, find imports from them that need loading
            for loaded_doc in docs_now_loaded:
                self._find_missing_imports_from_document(loaded_doc)

            # repeat self process for the imports of the imports
            import_task_list = [self._load_imports_async(loaded_doc) for loaded_doc in docs_now_loaded]
            await asyncio.gather(*import_task_list)

            # now we know everything for the imports have been loaded
            # attach newly loaded import docs to import list
            #   note: we do not know if all imports for 'doc' are loaded
            #   because loadImportsAsync could have been called in parallel
            #   and a different call of loadImportsAsync could be loading an
            #   import that we will need
            for loaded_doc in docs_now_loaded:
                self._set_import_documents(loaded_doc)

    def make_object(self, of_type: 'CdmObjectType', name_or_ref: str = None, simple_name_ref: bool = False) -> 'TObject':
        """instantiates a OM class based on the object type passed as first parameter."""
        from .cdm_make_object import make_object

        return make_object(self.ctx, of_type, name_or_ref, simple_name_ref)

    def make_ref(self, of_type: 'CdmObjectType', ref_obj: Union[str, 'CdmObjectDefinition'],
                 simple_name_ref: bool) -> 'TObjectRef':
        """instantiates a OM class reference based on the object type passed as first parameter."""
        object_ref = None

        if not ref_obj:
            return None

        if isinstance(ref_obj, str):
            object_ref = self.make_object(of_type, ref_obj, simple_name_ref)
        else:
            if ref_obj.object_type == of_type:
                object_ref = ref_obj
            else:
                object_ref = self.make_object(of_type)
                object_ref.explicit_reference = ref_obj

        return object_ref

    def _register_definition_reference_symbols(self, definition: 'CdmObject', kind: str, symbol_ref_set: 'SymbolSet') -> None:
        key = CdmCorpusDefinition._fetch_cache_key_from_object(definition, kind)
        existing_symbols = self._definition_reference_symbols.get(key)
        if existing_symbols is None:
            # nothing set, just use it
            self._definition_reference_symbols[key] = symbol_ref_set
        else:
            # something there, need to merge
            existing_symbols.merge(symbol_ref_set)

    def _register_symbol(self, symbol_def: str, in_doc: 'CdmDocumentDefinition') -> None:
        if symbol_def not in self._symbol_definitions:
            self._symbol_definitions[symbol_def] = []

        self._symbol_definitions[symbol_def].append(in_doc)

    def _remove_document_objects(self, folder: 'CdmFolderDefinition', doc_def: 'CdmDocumentDefinition') -> None:
        doc = cast('CdmDocumentDefinition', doc_def)
        # Don't worry about defintion_wrt_tag because it uses the doc ID that won't get re-used in this session unless
        # there are more than 4 billion objects every symbol defined in this document is pointing at the document, so
        # remove from cache. Also remove the list of docs that it depends on.
        self._remove_object_definitions(doc)

        # Remove from path lookup, folder lookup and global list of documents.
        path = self.storage.create_absolute_corpus_path(doc.folder_path + doc.name, doc).lower()
        if path in self._path_lookup:
            self._path_lookup.pop(path)
            self._all_documents.remove((folder, doc))

    def _remove_object_definitions(self, doc: CdmDocumentDefinition) -> None:
        ctx = self.ctx

        def visit_callback(i_object: 'CdmObject', path: str) -> bool:
            if path.find('(unspecified)') > 0:
                return True

            if i_object.object_type in [CdmObjectType.ENTITY_DEF, CdmObjectType.PARAMETER_DEF, CdmObjectType.TRAIT_DEF, CdmObjectType.PURPOSE_DEF, \
                    CdmObjectType.DATA_TYPE_DEF, CdmObjectType.TYPE_ATTRIBUTE_DEF, CdmObjectType.ENTITY_ATTRIBUTE_DEF, CdmObjectType.ATTRIBUTE_GROUP_DEF, \
                    CdmObjectType.CONSTANT_ENTITY_DEF, CdmObjectType.ATTRIBUTE_CONTEXT_DEF, CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF, \
                    CdmObjectType.REFERENCED_ENTITY_DECLARATION_DEF]:
                self._unregister_symbol(path, doc)
                self._unregister_definition_reference_documents(i_object, 'rasb')

            return False

        doc.visit('', visit_callback, None)

    def _resolve_document_imports(self, doc: 'CdmDocumentDefinition', missing_set: Set[str],
                                  imports_not_indexed: Set[CdmDocumentDefinition], docs_not_found: Set[str]) -> None:
        if not doc.imports:
            return

        for imp in doc.imports:
            if not imp.doc:
                # no document set for this import, see if it is already loaded into the corpus
                path = self.storage.create_absolute_corpus_path(imp.corpus_path, doc)
                if path not in docs_not_found:
                    lookup = self._path_lookup.get(path.lower())
                    if lookup:
                        current_doc = lookup[1]
                        if not current_doc._imports_indexed and not current_doc._currently_indexing:
                            current_doc._currently_indexing = True
                            imports_not_indexed.add(current_doc)
                        imp.doc = lookup[1]
                    elif missing_set is not None:
                        missing_set.add(path)

    async def _resolve_imports_async(self, doc: 'CdmDocumentDefinition') -> None:
        """takes a callback that askes for promise to do URI resolution."""
        # find imports for this doc
        self._find_missing_imports_from_document(doc)
        # load imports (and imports of imports)
        await self._load_imports_async(doc)
        # now that everything is loaded, attach import docs to this doc's import list
        self._set_import_documents(doc)

    async def resolve_references_and_validate_async(self, stage: 'CdmValidationStep',
                                                    stage_through: 'CdmValidationStep', res_opt: Optional['ResolveOptions'] = None) -> 'CdmValidationStep':
        # use the provided directives or make a relational default
        directives = None  # type: AttributeResolutionDirectiveSet
        if res_opt is not None:
            directives = res_opt.directives
        else:
            directives = AttributeResolutionDirectiveSet({'referenceOnly', 'normalized'})
        res_opt = ResolveOptions(wrt_doc=None, directives=directives)
        res_opt._relationship_depth = 0

        for doc in self._all_documents:
            await doc[1]._index_if_needed(res_opt)

        finish_resolve = stage_through == stage

        def traits_step():
            self._resolve_references_step('resolving traits...', self._resolve_traits, res_opt, False, finish_resolve, CdmValidationStep.TRAITS)
            return self._resolve_references_step('checking required arguments...', self._resolve_references_traits_arguments,\
                res_opt, True, finish_resolve, CdmValidationStep.ATTRIBUTES)

        switcher = {
            CdmValidationStep.START: lambda: self._resolve_references_step('defining traits...', lambda *args: None, res_opt, True,\
                finish_resolve or stage_through == CdmValidationStep.MINIMUM_FOR_RESOLVING, CdmValidationStep.TRAITS),
            CdmValidationStep.TRAITS: traits_step,
            CdmValidationStep.ATTRIBUTES: lambda: self._resolve_references_step('resolving attributes...',\
                self._resolve_attributes, res_opt, True, finish_resolve, CdmValidationStep.ENTITY_REFERENCES),
            CdmValidationStep.ENTITY_REFERENCES: lambda: self._resolve_references_step('resolving foreign key references...',\
                self._resolve_foreign_key_references, res_opt, True, True, CdmValidationStep.FINISHED)
        }

        switcher[CdmValidationStep.TRAIT_APPLIERS] = switcher[CdmValidationStep.START]

        func = switcher.get(stage, lambda: CdmValidationStep.ERROR)

        # bad step sent in
        return func()

    def _resolve_references_step(self, status_message: str, resolve_action: Callable, resolve_opt: 'ResolveOptions',\
                                 stage_finished: bool, finish_resolve: bool, next_stage: 'CdmValidationStep') -> 'CdmValidationStep':
        logger.debug(self._TAG, self.ctx, status_message)
        entity_nesting = [0]

        for fd in self._all_documents:
            # cache import documents
            current_doc = fd[1] # type: CdmDocumentDefinition
            resolve_opt.wrt_doc = current_doc
            resolve_action(current_doc, resolve_opt, entity_nesting)

        if stage_finished:
            if finish_resolve:
                self._finish_resolve()
                return CdmValidationStep.FINISHED
            return next_stage
        return next_stage

    def _resolve_foreign_key_references(self, current_doc: 'CdmDocumentDefinition', res_opt: 'ResolveOptions', entity_nesting: List[int]) -> None:
        ctx = self.ctx
        nesting = entity_nesting[0]

        def pre_visit(obj: 'CdmObject', path: str) -> bool:
            nonlocal ctx, nesting
            ot = obj.object_type
            if ot == CdmObjectType.ATTRIBUTE_GROUP_DEF:
                nesting += 1
            if ot == CdmObjectType.ENTITY_DEF:
                nesting += 1
                if nesting == 1:
                    ctx._relative_path = path
                    obj.fetch_resolved_entity_references(res_opt)
            return False

        def post_visit(obj: 'CdmObject', path: str) -> bool:
            nonlocal nesting
            if obj.object_type == CdmObjectType.ENTITY_DEF or obj.object_type == CdmObjectType.ATTRIBUTE_GROUP_DEF:
                nesting -= 1
            return False

        current_doc.visit('', pre_visit, post_visit)
        entity_nesting[0] = nesting

    def _resolve_attributes(self, current_doc: 'CdmDocumentDefinition', res_opt: 'ResolveOptions', entity_nesting: List[int]) -> None:
        ctx = self.ctx
        nesting = entity_nesting[0]

        def pre_visit(obj: 'CdmObject', path: str) -> bool:
            nonlocal ctx, nesting

            ot = obj.object_type
            if ot == CdmObjectType.ENTITY_DEF:
                nesting += 1
                if nesting == 1:
                    ctx._relative_path = path
                    obj.fetch_resolved_attributes(res_opt)

            if ot == CdmObjectType.ATTRIBUTE_GROUP_DEF:
                nesting += 1
                if nesting == 1:
                    ctx._relative_path = path
                    obj.fetch_resolved_attributes(res_opt)
            return False

        def post_visit(obj: 'CdmObject', path: str) -> bool:
            nonlocal nesting

            if obj.object_type == CdmObjectType.ENTITY_DEF or obj.object_type == CdmObjectType.ATTRIBUTE_GROUP_DEF:
                nesting -= 1
            return False

        current_doc.visit('', pre_visit, post_visit)
        entity_nesting[0] = nesting

    def _resolve_references_traits_arguments(self, current_doc: 'CdmDocumentDefinition', res_opt: 'ResolveOptions', entity_nesting: List[int]) -> None:
        ctx = self.ctx
        def check_required_params_on_resolved_traits(obj) -> 'CdmObject':
            rts = obj._fetch_resolved_traits(res_opt)
            if rts is None:
                return

            for rt in rts:
                found = 0
                resolved = 0
                if rt.parameter_values is not None:
                    for i_param in range(len(rt.parameter_values)):
                        param = rt.parameter_values.fetch_parameter_at_index(i_param)
                        if param.required:
                            found += 1
                            if rt.parameter_values.fetch_value(i_param) is None:
                                defi = obj.fetch_object_definition(res_opt)
                                logger.error(self._TAG, self.ctx, 'no argument supplied for required parameter \'{}\' of trait \'{}\' on \'{}\''. \
                                    format(param.name, rt.trait_name, defi.get_name()), current_doc.folder_path + ctx._relative_path)
                            else:
                                resolved += 1
                if found > 0 and found == resolved:
                    defi = obj.fetch_object_definition(res_opt)
                    logger.info(self._TAG, self.ctx, 'found and resolved \'{}\' required parameters of trait \'{}\' on \'{}\''. \
                        format(found, rt.trait_name, defi.get_name()), current_doc.folder_path + ctx._relative_path)

        def post_visit(obj: 'CdmObject', path: str) -> bool:
            ot = obj.object_type
            if ot == CdmObjectType.ENTITY_DEF:
                ctx._relative_path = path
                # get the resolution of all parameters and values through inheritence and defaults and arguments, etc.
                check_required_params_on_resolved_traits(obj)
                has_attribute_defs = obj.Attributes
                # do the same for all attributes
                if has_attribute_defs is not None:
                    for att_def in has_attribute_defs:
                        check_required_params_on_resolved_traits(att_def)
            if ot == CdmObjectType.ATTRIBUTE_GROUP_DEF:
                ctx._relative_path = path
                # get the resolution of all parameters and values through inheritence and defaults and arguments, etc.
                check_required_params_on_resolved_traits(obj)
                member_attribute_defs = obj.members
                # do the same for all attributes
                if member_attribute_defs is not None:
                    for att_def in member_attribute_defs:
                        check_required_params_on_resolved_traits(att_def)
            return False

        current_doc.visit("", None, post_visit)

    def _resolve_traits(self, current_doc: 'CdmDocumentDefinition', res_opt: 'ResolveOptions', entity_nesting: List[int]) -> None:
        ctx = self.ctx
        nesting = entity_nesting[0]

        def pre_visit(obj: 'CdmObject', path: str) -> bool:
            nonlocal ctx, nesting
            if obj.object_type == CdmObjectType.TRAIT_DEF or obj.object_type == CdmObjectType.PURPOSE_DEF or obj.object_type == CdmObjectType.DATA_TYPE_DEF or \
                 obj.object_type == CdmObjectType.ENTITY_DEF or obj.object_type == CdmObjectType.ATTRIBUTE_GROUP_DEF:
                if obj.object_type == CdmObjectType.ENTITY_DEF or obj.object_type == CdmObjectType.ATTRIBUTE_GROUP_DEF:
                    nesting += 1
                    # don't do this for entities and groups defined within entities since getting traits already does that
                    if nesting > 1:
                        return False

                    ctx._relative_path = path
                    obj.fetch_resolved_traits(res_opt)
            elif obj.object_type == CdmObjectType.ENTITY_ATTRIBUTE_DEF or obj.object_type == CdmObjectType.TYPE_ATTRIBUTE_DEF:
                ctx._relative_path = path
                obj.fetch_resolved_traits(res_opt)

            return False

        def post_visit(obj: 'CdmObject', path: str) -> bool:
            nonlocal nesting
            if obj.object_type == CdmObjectType.ENTITY_DEF or obj.object_type == CdmObjectType.ATTRIBUTE_GROUP_DEF:
                nesting -= 1
            return False

        current_doc.visit('', pre_visit, post_visit)

        entity_nesting[0] = nesting

    def _resolve_symbol_reference(self, res_opt: 'ResolveOptions', from_doc: 'CdmDocumentDefinition', symbol_def: str,
                                  expected_type: 'CdmObjectType', retry: bool) -> 'CdmObject':
        """given a symbolic name,
        find the 'highest prirority' definition of the object from the point of view of a given document (with respect to, wrt_doc)
        (meaning given a document and the things it defines and the files it imports and the files they import,
        where is the 'last' definition found)"""

        if not res_opt or not res_opt.wrt_doc:
            # no way to figure this out
            return None

        wrt_doc = res_opt.wrt_doc

        # get the array of documents where the symbol is defined
        symbol_docs_result = self._docs_for_symbol(res_opt, wrt_doc, from_doc, symbol_def)
        doc_best = symbol_docs_result.doc_best
        symbol_def = symbol_docs_result.new_symbol
        docs = symbol_docs_result.doc_list  # type: List[CdmDocumentDefinition]

        if docs:
            # add this symbol to the set being collected in res_opt, we will need this when caching
            if not res_opt.symbol_ref_set:
                res_opt.symbol_ref_set = SymbolSet()

            res_opt.symbol_ref_set.add(symbol_def)
            # for the given doc, there is a sorted list of imported docs (including the doc itself as item 0).
            # find the lowest number imported document that has a definition for this symbol
            if not wrt_doc._import_priorities:
                return None  # need to index imports first, should have happened

            import_priority = wrt_doc._import_priorities.import_priority  # type: Dict[CdmDocumentDefinition, int]
            if not import_priority:
                return None

            if not doc_best:
                doc_best = CdmCorpusDefinition._fetch_priority_doc(docs, import_priority)

        # perhaps we have never heard of this symbol in the imports for this document?
        if not doc_best:
            return None

        # return the definition found in the best document
        found = doc_best.internal_declarations.get(symbol_def)
        if not found and retry:
            # maybe just locatable from here not defined here
            found = self._resolve_symbol_reference(res_opt, doc_best, symbol_def, expected_type, False)

        if found and expected_type != CdmObjectType.ERROR:
            if expected_type in SYMBOL_TYPE_CHECK and SYMBOL_TYPE_CHECK[expected_type] != found.object_type:
                type_name = ''.join([name.title() for name in expected_type.name.split('_')])
                logger.error(self._TAG, self.ctx, 'expected type {}'.format(type_name), symbol_def)
                found = None

        return found

    def _resolve_object_definitions(self, res_opt: 'ResolveOptions', current_doc: 'CdmDocumentDefinition') -> None:
        ctx = self.ctx
        res_opt._indexing_doc = current_doc
        reference_type_set = set([
            CdmObjectType.ATTRIBUTE_REF, CdmObjectType.ATTRIBUTE_GROUP_REF, CdmObjectType.ATTRIBUTE_CONTEXT_REF,
            CdmObjectType.DATA_TYPE_REF, CdmObjectType.ENTITY_REF, CdmObjectType.PURPOSE_REF, CdmObjectType.TRAIT_REF
        ])

        def pre_callback(obj: 'CdmObject', path: str) -> bool:
            if obj.object_type in reference_type_set:
                ctx._relative_path = path

                if CdmObjectReference.offset_attribute_promise(obj.named_reference) < 0:
                    res_new = obj.fetch_object_definition(res_opt)

                    if not res_new:
                        # it is 'ok' to not find entity refs sometimes

                        if obj.object_type == CdmObjectType.ENTITY_REF:
                            logger.warning(self._TAG, self.ctx, 'unable to resolve the reference \'{}\' to a known object'.format(obj.named_reference),
                                           current_doc.folder_path + path)
                        else:
                            logger.error(self._TAG, self.ctx, 'unable to resolve the reference \'{}\' to a known object'.format(obj.named_reference),
                                         current_doc.folder_path + path)
                    else:
                        logger.info(self._TAG, self.ctx, '    resolved \'{}\''.format(obj.named_reference), current_doc.folder_path + path)

            return False

        def pos_callback(obj: 'CdmObject', path: str) -> bool:
            if obj.object_type == CdmObjectType.PARAMETER_DEF:
                # when a parameter has a datatype that is a cdm object, validate that any default value is the
                # right kind object
                self._const_type_check(res_opt, current_doc, obj, None)
            return False

        current_doc.visit('', pre_callback, pos_callback)
        res_opt._indexing_doc = None

    def _resolve_trait_arguments(self, res_opt: 'ResolveOptions', current_doc: 'CdmDocumentDefinition') -> None:
        ctx = self.ctx

        def pre_visit(obj: 'CdmObject', path: str) -> bool:
            if obj.object_type == CdmObjectType.TRAIT_REF:
                ctx.push_scope(obj.fetch_object_definition(res_opt))
            elif obj.object_type == CdmObjectType.ARGUMENT_DEF:
                try:
                    if ctx._current_scope.current_trait:
                        ctx._relative_path = path
                        params = ctx._current_scope.current_trait._fetch_all_parameters(res_opt)

                        param_found = params.resolve_parameter(
                            ctx._current_scope.current_parameter,
                            obj.get_name())

                        obj.resolved_parameter = param_found
                        a_value = obj.value

                        # if parameter type is entity, then the value should be an entity or ref to one
                        # same is true of 'dataType' dataType
                        a_value = self._const_type_check(res_opt, current_doc, param_found, a_value)
                        obj.value = a_value
                except Exception as e:
                    logger.error(self._TAG, self.ctx, e, path)
                    logger.error(self._TAG, self.ctx, 'failed to resolve parameter on trait \'{}\''.format(ctx._current_scope.current_trait.get_name()),
                                 current_doc.folder_path + path)

                ctx._current_scope.current_parameter += 1

            return False

        def post_visit(obj: 'CdmObject', path: str) -> bool:
            if obj.object_type == CdmObjectType.TRAIT_REF:
                obj._resolved_arguments = True
                ctx.pop_scope()

            return False

        current_doc.visit('', pre_visit, post_visit)

    def set_event_callback(self, status: 'EventCallback', report_at_level: 'CdmStatusLevel' = CdmStatusLevel.INFO):
        self.ctx.status_event = status
        self.ctx.report_at_level = report_at_level

    def _set_import_documents(self, doc: 'CdmDocumentDefinition') -> None:
        if not doc.imports:
            return

        for imp in doc.imports:
            if not imp.doc:
                # no document set for this import, see if it is already loaded into the corpus
                path = self.storage.create_absolute_corpus_path(imp.corpus_path, doc)

                if path not in self._docs_not_found:
                    lookup = self._path_lookup.get(path.lower()) # type: Tuple[CdmFolderDefinition, CdmDocumentDefinition]
                    if lookup:
                        inner_doc = lookup[1] # type: CdmDocumentDefinition
                        if not inner_doc._imports_indexed and not inner_doc._currently_indexing:
                            inner_doc._currently_indexing = True
                            self._docs_not_indexed.add(inner_doc)
                        imp.doc = inner_doc

                        # repeat the process for the import documents
                        self._set_import_documents(imp.doc)

    def _unregister_symbol(self, symbol_def: str, in_doc: 'CdmDocumentDefinition') -> None:
        docs = self._symbol_definitions.get(symbol_def)
        if docs and in_doc in docs:
            docs.remove(in_doc)


    def _unregister_definition_reference_documents(self, definition: 'CdmObject', kind: str) -> None:
        key = CdmCorpusDefinition._fetch_cache_key_from_object(definition, kind)
        self._definition_reference_symbols.pop(key, None)

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        return False

    async def _compute_last_modified_time_async(self, corpus_path: str, obj: Optional['CdmObject'] = None) -> datetime:
        """Return last modified time of the file where the object at corpus path can be found."""
        curr_object = await self.fetch_object_async(corpus_path, obj)
        if curr_object:
            return await self._fetch_last_modified_time_from_object_async(curr_object)
        return None

    async def _fetch_last_modified_time_from_object_async(self, curr_object: 'CdmObject') -> datetime:
        """Return last modified time of the file where the input object can be found."""
        if isinstance(curr_object, CdmContainerDefinition):
            adapter = self.storage.fetch_adapter(cast('CdmContainerDefinition', curr_object).namespace)
            adapter_path = adapter.create_adapter_path(curr_object.at_corpus_path)
            return await adapter.compute_last_modified_time_async(adapter_path)
        else:
            return await self._fetch_last_modified_time_from_object_async(curr_object.in_document)

    async def _fetch_last_modified_time_from_partition_path_async(self, corpus_path: str) -> datetime:
        """Return last modified time of a partition object."""

        # We do not want to load partitions from file, just check the modified times.
        path_tuple = self.storage.split_namespace_path(corpus_path)
        namespace = path_tuple[0]
        if namespace:
            adapter = self.storage.fetch_adapter(namespace)
            adapter_path = adapter.create_adapter_path(corpus_path)
            return await adapter.compute_last_modified_time_async(adapter_path)
        return None

    @staticmethod
    def _fetch_cache_key_from_object(definition: 'CdmObject', kind: str) -> str:
        return '{}-{}'.format(definition.id, kind)

    @staticmethod
    def _fetch_priority_doc(docs: List['CdmDocumentDefinition'], import_priority: Dict['CdmDocumentDefinition', int]) -> 'CdmDocumentDefinition':
        doc_best = None
        index_best = None

        for doc_defined in docs:
            # is this one of the imported docs?
            index_found = import_priority.get(doc_defined)
            if index_found is not None and (index_best is None or index_found < index_best):
                index_best = index_found
                doc_best = doc_defined
                if index_best == 0:
                    #  hard to be better than the best
                    break

        return doc_best

    @staticmethod
    def _map_reference_type(of_type: 'CdmObjectType') -> 'CdmObjectType':
        if of_type in [CdmObjectType.ARGUMENT_DEF, CdmObjectType.DOCUMENT_DEF, CdmObjectType.MANIFEST_DEF, CdmObjectType.IMPORT, CdmObjectType.PARAMETER_DEF]:
            return CdmObjectType.ERROR
        if of_type in [CdmObjectType.ATTRIBUTE_GROUP_REF, CdmObjectType.ATTRIBUTE_GROUP_DEF]:
            return CdmObjectType.ATTRIBUTE_GROUP_REF
        if of_type in [CdmObjectType.CONSTANT_ENTITY_DEF, CdmObjectType.ENTITY_DEF, CdmObjectType.ENTITY_REF]:
            return CdmObjectType.ENTITY_REF
        if of_type in [CdmObjectType.DATA_TYPE_DEF, CdmObjectType.DATA_TYPE_REF]:
            return CdmObjectType.DATA_TYPE_REF
        if of_type in [CdmObjectType.PURPOSE_DEF, CdmObjectType.PURPOSE_REF]:
            return CdmObjectType.PURPOSE_REF
        if of_type in [CdmObjectType.TRAIT_DEF, CdmObjectType.TRAIT_REF]:
            return CdmObjectType.TRAIT_REF
        if of_type in [CdmObjectType.ENTITY_ATTRIBUTE_DEF, CdmObjectType.TYPE_ATTRIBUTE_DEF, CdmObjectType.ATTRIBUTE_REF]:
            return CdmObjectType.ATTRIBUTE_REF
        if of_type in [CdmObjectType.ATTRIBUTE_CONTEXT_DEF, CdmObjectType.ATTRIBUTE_CONTEXT_REF]:
            return CdmObjectType.ATTRIBUTE_CONTEXT_REF

        return CdmObjectType.ERROR

    async def _fetch_object_async(self, object_path: str, relative_object: 'CdmObject' = None, force_reload: bool = False) -> 'CdmObject':
        object_path = self.storage.create_absolute_corpus_path(object_path, relative_object)
        document_path = object_path
        document_name_index = object_path.rfind(CdmCorpusDefinition._CDM_EXTENSION)

        if document_name_index != -1:
            # if there is something after the document path, split it into document path and object path.
            document_name_index += len(CdmCorpusDefinition._CDM_EXTENSION)
            document_path = object_path[0: document_name_index]

        logger.debug(self._TAG, self.ctx, 'request object: {}'.format(object_path), self._fetch_object_async.__name__)
        obj = await self._load_folder_or_document(document_path, force_reload)

        if not obj:
            return

        # get imports and index each document that is loaded
        if isinstance(obj, CdmDocumentDefinition):
            res_opt = ResolveOptions(wrt_doc=obj, directives=AttributeResolutionDirectiveSet())
            if not await obj._index_if_needed(res_opt):
                return None

        if document_path == object_path:
            return obj

        if document_name_index == -1:
            # there is no remaining path to be loaded, so return.
            return

        # trim off the document path to get the object path in the doc
        remaining_object_path = object_path[document_name_index + 1:]

        result = obj.fetch_object_from_document_path(remaining_object_path)
        if not result:
            logger.error(self._TAG, self.ctx, 'Could not find symbol "{}" in document [{}]'.format(remaining_object_path, obj.at_corpus_path), self._fetch_object_async.__name__)

        return result

    def _is_path_manifest_document(self, path: str) -> bool:
        from cdm.persistence import PersistenceLayer

        return path.endswith(PersistenceLayer._FOLIO_EXTENSION) or path.endswith(PersistenceLayer._MANIFEST_EXTENSION) \
            or path.endswith(PersistenceLayer._MODEL_JSON_EXTENSION)

    def fetch_incoming_relationships(self, path: str) -> List['E2ERelationshipDef']:
        return self._incoming_relationships.get(path, [])

    def fetch_outgoing_relationships(self, path: str) ->  List['E2ERelationshipDef']:
        return self._outgoing_relationships.get(path, [])
