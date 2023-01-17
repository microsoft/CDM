# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import asyncio
from datetime import datetime, timezone
from typing import cast, Iterable, Optional, Union, TYPE_CHECKING

from cdm.enums import CdmObjectType, CdmRelationshipDiscoveryStyle, ImportsLoadStrategy, PartitionFileStatusCheckType, \
    CdmIncrementalPartitionType
from cdm.utilities import AttributeResolutionDirectiveSet, FileStatusCheckOptions, logger, ResolveOptions, time_utils
from cdm.enums import CdmLogCode

from .cdm_collection import CdmCollection
from .cdm_entity_collection import CdmEntityCollection
from .cdm_document_def import CdmDocumentDefinition
from .cdm_entity_declaration_def import CdmEntityDeclarationDefinition
from .cdm_entity_def import CdmEntityDefinition
from .cdm_file_status import CdmFileStatus
from .cdm_folder_def import CdmFolderDefinition
from .cdm_object_def import CdmObjectDefinition
from .cdm_referenced_entity_declaration_def import CdmReferencedEntityDeclarationDefinition
from .cdm_trait_collection import CdmTraitCollection
from .cdm_import import CdmImport
from ..utilities.string_utils import StringUtils

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmE2ERelationship, \
    CdmManifestDeclarationDefinition, CdmObject
    from cdm.utilities import CopyOptions, VisitCallback


class CdmManifestDefinition(CdmDocumentDefinition, CdmObjectDefinition, CdmFileStatus):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx, '{}.manifest.cdm.json'.format(name))

        self._TAG = CdmManifestDefinition.__name__
        # The name of the manifest
        self.manifest_name = name

        self.explanation = None  # type: Optional[str]

        self.last_child_file_modified_time = None  # type: Optional[datetime]

        self.last_file_modified_time = None  # type: Optional[datetime]

        self.last_file_status_check_time = None  # type: Optional[datetime]

        # --- internal ---
        self._file_system_modified_time = None  # type: Optional[datetime]
        self._virtual_location = None

    @property
    def object_type(self) -> CdmObjectType:
        return CdmObjectType.MANIFEST_DEF

    @property
    def entities(self) -> 'CdmCollection[CdmEntityDeclarationDefinition]':
        if not hasattr(self, '_entities'):
            self._entities = CdmEntityCollection(self.ctx, self)  # type: CdmCollection[CdmEntityDeclarationDefinition]
        return self._entities

    @property
    def exhibits_traits(self) -> 'CdmTraitCollection':
        if not hasattr(self, '_exhibits_traits'):
            self._exhibits_traits = CdmTraitCollection(self.ctx, self)  # type: CdmTraitCollection
        return self._exhibits_traits

    @property
    def relationships(self) -> 'CdmCollection[CdmE2ERelationship]':
        if not hasattr(self, '_relationships'):
            self._relationships = CdmCollection(self.ctx, self, CdmObjectType.E2E_RELATIONSHIP_DEF)  # type: CdmCollection[CdmE2ERelationship]
        return self._relationships

    @property
    def sub_manifests(self) -> 'CdmCollection[CdmManifestDeclarationDefinition]':
        if not hasattr(self, '_sub_manifests'):
            self._sub_manifests = CdmCollection(self.ctx, self, CdmObjectType.MANIFEST_DECLARATION_DEF)  # type: CdmCollection[CdmManifestDeclarationDefinition]
        return self._sub_manifests

    @property
    def _is_virtual(self) -> bool:
        """Gets whether this entity is virtual, which means it's coming from model.json file"""
        return not StringUtils.is_null_or_white_space(self._virtual_location)

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmManifestDefinition'] = None) -> 'CdmManifestDefinition':
        # since we need to call the base copy which will only return a document when there is no host, make a fake host here
        if not host:
            host = CdmManifestDefinition(self.ctx, self.manifest_name)

        copy = super().copy(res_opt, host)  # type: CdmManifestDefinition
        copy.manifest_name = self.manifest_name
        copy.explanation = self.explanation
        copy.last_file_status_check_time = self.last_file_status_check_time
        copy.last_file_modified_time = self.last_file_modified_time
        copy.last_child_file_modified_time = self.last_child_file_modified_time
        copy._virtual_location = self._virtual_location

        copy.entities.clear()
        for ent in self.entities:
            copy.entities.append(ent.copy(res_opt))

        copy.relationships.clear()
        for rel in self.relationships:
            copy.relationships.append(rel.copy(res_opt))

        copy.sub_manifests.clear()
        for man in self.sub_manifests:
            copy.sub_manifests.append(man.copy(res_opt))

        copy.exhibits_traits.clear()
        for et in self.exhibits_traits:
            copy.exhibits_traits.append(et.copy(res_opt))

        return copy

    async def create_resolved_manifest_async(self, new_manifest_name: str, new_entity_document_name_format: Optional[str], directives: Optional[AttributeResolutionDirectiveSet] = None) -> Optional['CdmManifestDefinition']:
        """Creates a resolved copy of the manifest.
        new_entity_document_name_format specifies a pattern to use when creating documents for resolved entities.
        The default is "resolved/{n}.cdm.json" to avoid a document name conflict with documents in the same folder as
        the manifest. Every instance of the string {n} is replaced with the entity name from the source manifest. Any
        sub-folders described by the pattern should exist in the corpus prior to calling this function.
        """
        with logger._enter_scope(self._TAG, self.ctx, self.create_resolved_manifest_async.__name__):
            if self.entities is None:
                return None

            if not self.owner:
                logger.error(
                    self.ctx,
                    self._TAG,
                    self.create_resolved_manifest_async.__name__,
                    self.at_corpus_path,
                    CdmLogCode.ERR_RESOLVE_MANIFEST_FAILED, self.manifest_name
                )
                return None

            if new_entity_document_name_format is None:
                new_entity_document_name_format = '{f}resolved/{n}.cdm.json'
            elif new_entity_document_name_format == '':  # for back compat
                new_entity_document_name_format = '{n}.cdm.json'
            elif '{n}' not in new_entity_document_name_format:  # for back compat
                new_entity_document_name_format = new_entity_document_name_format + '/{n}.cdm.json'

            source_manifest_path = self.ctx.corpus.storage.create_absolute_corpus_path(self.at_corpus_path, self)
            source_manifest_folder_path = self.ctx.corpus.storage.create_absolute_corpus_path(self.owner.at_corpus_path, self)

            resolved_manifest_path_split = new_manifest_name.rfind('/') + 1
            resolved_manifest_folder = None
            if resolved_manifest_path_split > 0:
                resolved_manifest_path = new_manifest_name[0:resolved_manifest_path_split]
                new_folder_path = self.ctx.corpus.storage.create_absolute_corpus_path(resolved_manifest_path, self)
                resolved_manifest_folder = await self.ctx.corpus.fetch_object_async(new_folder_path)  # type: CdmFolderDefinition
                if not isinstance(resolved_manifest_folder, CdmFolderDefinition):
                    logger.error(self.ctx, self._TAG, self.calculate_entity_graph_async.__name__, self.at_corpus_path,
                                 CdmLogCode.ERR_INVALID_CAST, new_folder_path, 'CdmFolderDefinition')
                    return None
                if resolved_manifest_folder is None:
                    logger.error(self.ctx, self._TAG, self.create_resolved_manifest_async.__name__, self.at_corpus_path, CdmLogCode.ERR_RESOLVE_FOLDER_NOT_FOUND, new_folder_path)
                    return None
                new_manifest_name = new_manifest_name[resolved_manifest_path_split:]
            else:
                resolved_manifest_folder = self.owner

            if resolved_manifest_folder.documents.item(new_manifest_name) is not None:
                logger.error(self.ctx, self._TAG, self.create_resolved_manifest_async.__name__, self.at_corpus_path, CdmLogCode.ERR_RESOLVE_MANIFEST_EXISTS, new_manifest_name, resolved_manifest_folder.at_corpus_path)
                return None

            logger.debug(self.ctx, self._TAG, self.create_resolved_manifest_async.__name__, self.at_corpus_path,
                         'resolving manifest {}'.format(source_manifest_path))

            # using the references present in the resolved entities, get an entity
            # create an imports doc with all the necessary resolved entity references and then resolve it
            # sometimes they might send the docname, that makes sense a bit, don't include the suffix in the name
            if new_manifest_name.lower().endswith('.manifest.cdm.json'):
                new_manifest_name = new_manifest_name[0: (len(new_manifest_name) - len('.manifest.cdm.json'))]
            resolved_manifest = CdmManifestDefinition(self.ctx, new_manifest_name)

            # add the new document to the folder
            if resolved_manifest_folder.documents.append(resolved_manifest) is None:
                # when would this happen?
                return None

            # bring over any imports in this document or other bobbles
            resolved_manifest.schema = self.schema
            resolved_manifest.explanation = self.explanation
            resolved_manifest.document_version = self.document_version
            for imp in self.imports:
                resolved_manifest.imports.append(imp.copy())

            for entity in self.entities:
                entity_path = await self._get_entity_path_from_declaration(entity, cast('CdmObject', self))
                ent_def = await self.ctx.corpus.fetch_object_async(entity_path)  # type: CdmEntityDefinition

                if not isinstance(ent_def, CdmEntityDefinition):
                    logger.error(self.ctx, self._TAG, self.create_resolved_manifest_async.__name__, self.at_corpus_path,
                                 CdmLogCode.ERR_INVALID_CAST, entity_path, 'CdmEntityDefinition')
                    return None
                elif ent_def is None:
                    logger.error(self.ctx, self._TAG, self.create_resolved_manifest_async.__name__, None, CdmLogCode.ERR_RESOLVE_ENTITY_FAILURE, entity_path)
                    return None

                if not ent_def.in_document.owner:
                    logger.error(self.ctx, self._TAG, self.create_resolved_manifest_async.__name__, self.at_corpus_path, CdmLogCode.ERR_DOC_IS_NOT_FOLDERformat, ent_def.entity_name)
                    return None

                # get the path from this manifest to the source entity. this will be the {f} replacement value
                source_entity_full_path = self.ctx.corpus.storage.create_absolute_corpus_path(ent_def.in_document.owner.at_corpus_path, self)
                f = ''
                if source_entity_full_path.startswith(source_manifest_folder_path):
                    f = source_entity_full_path[len(source_manifest_folder_path):]

                new_document_full_path = new_entity_document_name_format.replace('{n}', ent_def.entity_name).replace('{f}', f)
                new_document_full_path = self.ctx.corpus.storage.create_absolute_corpus_path(new_document_full_path, self)

                new_document_path_split = new_document_full_path.rfind('/') + 1
                new_document_path = new_document_full_path[0:new_document_path_split]
                new_document_name = new_document_full_path[new_document_path_split:]

                # make sure the new folder exists
                folder = await self.ctx.corpus.fetch_object_async(new_document_path)  # type: CdmFolderDefinition
                if not isinstance(folder, CdmFolderDefinition):
                    logger.error(self.ctx, self._TAG, self.create_resolved_manifest_async.__name__, self.at_corpus_path,
                                 CdmLogCode.ERR_INVALID_CAST, new_document_path, 'CdmFolderDefinition')
                    return None

                if not folder:
                    logger.error(self.ctx, self._TAG, self.create_resolved_manifest_async.__name__, self.at_corpus_path, CdmLogCode.ERR_RESOLVE_FOLDER_NOT_FOUND, new_document_path)
                    return None

                # next create the resolved entity.
                with_directives = directives if directives is not None else self.ctx.corpus.default_resolution_directives
                res_opt = ResolveOptions(ent_def.in_document, with_directives.copy())

                logger.debug(self.ctx, self._TAG, self.create_resolved_manifest_async.__name__, self.at_corpus_path,
                             'resolving entity {} to document {}'.format(source_entity_full_path,
                                                                         new_document_full_path))

                resolved_entity = await ent_def.create_resolved_entity_async(ent_def.entity_name, res_opt, folder, new_document_name)
                if not resolved_entity:
                    # fail all resolution, if any one entity resolution fails
                    return None

                result = entity.copy(res_opt)
                if result.object_type == CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF:
                    relative_entity_path = self.ctx.corpus.storage.create_relative_corpus_path(resolved_entity.at_corpus_path, resolved_manifest)
                    result.entity_path = relative_entity_path or result.at_corpus_path

                resolved_manifest.entities.append(result)

            logger.debug(self.ctx, self._TAG, self.create_resolved_manifest_async.__name__, self.at_corpus_path,
                         'calculating relationships')
            # Calculate the entity graph for just this manifest.
            await self.ctx.corpus.calculate_entity_graph_async(resolved_manifest)
            # Stick results into the relationships list for the manifest.
            await resolved_manifest.populate_manifest_relationships_async(CdmRelationshipDiscoveryStyle.EXCLUSIVE)

            # needed until Matt's changes with collections where I can propigate
            resolved_manifest._is_dirty = True
            return resolved_manifest

    async def file_status_check_async(self, partition_file_status_check_type: Optional['PartitionFileStatusCheckType'] = PartitionFileStatusCheckType.FULL, incremental_type: Optional['CdmIncrementalPartitionType'] = CdmIncrementalPartitionType.NONE, file_status_check_options: Optional[FileStatusCheckOptions] = None) -> None:
        """
        Check the modified time for this object and any children.
        """
        with logger._enter_scope(self._TAG, self.ctx, self.file_status_check_async.__name__):
            adapter = self.ctx.corpus.storage.fetch_adapter(self.in_document._namespace)
            if adapter:
                context = adapter.create_file_query_cache_context()
                try:
                    modified_time = await self.ctx.corpus._get_last_modified_time_from_object_async(self)

                    self.last_file_status_check_time = datetime.now(timezone.utc)
                    if not self.last_file_modified_time:
                        self.last_file_modified_time = self._file_system_modified_time

                    # Reload the manifest if it has been updated in the file system.
                    if modified_time and self._file_system_modified_time and modified_time != self._file_system_modified_time:
                        await self._reload_async()
                        self.last_file_modified_time = time_utils._max_time(modified_time, self.last_file_modified_time)
                        self._file_system_modified_time = self.last_file_modified_time

                    for entity in self.entities:
                        from cdm.objectmodel import CdmLocalEntityDeclarationDefinition
                        if isinstance(entity, CdmReferencedEntityDeclarationDefinition):
                            await entity.file_status_check_async()
                        elif isinstance(entity, CdmLocalEntityDeclarationDefinition):
                            await cast(CdmLocalEntityDeclarationDefinition, entity).file_status_check_async(partition_file_status_check_type, incremental_type, file_status_check_options)

                    for sub_manifest in self.sub_manifests:
                        await sub_manifest.file_status_check_async()

                finally:
                    context.dispose()

    async def _get_entity_path_from_declaration(self, entity_dec: 'CdmEntityDeclarationDefinition', obj: Optional['CdmObject'] = None):
        while isinstance(entity_dec, CdmReferencedEntityDeclarationDefinition):
            entity_dec = await self.ctx.corpus.fetch_object_async(entity_dec.entity_path, obj)
            if not isinstance(entity_dec, CdmEntityDeclarationDefinition):
                logger.error(self.ctx, self._TAG, self._get_entity_path_from_declaration.__name__, self.at_corpus_path,
                             CdmLogCode.ERR_INVALID_CAST, entity_dec.entity_path, 'CdmEntityDefinition')
                return None
            elif not entity_dec:
                return None
            obj = entity_dec.in_document

        return self.ctx.corpus.storage.create_absolute_corpus_path(entity_dec.entity_path, obj)

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        return False

    def _is_rel_allowed(self, rel: 'CdmE2ERelationship', option: 'CdmRelationshipDiscoveryStyle') -> bool:
        if option == CdmRelationshipDiscoveryStyle.NONE:
            return False
        if option == CdmRelationshipDiscoveryStyle.EXCLUSIVE:
            absolute_from_ent_string = self.ctx.corpus.storage.create_absolute_corpus_path(rel.from_entity, self)

            #  only true if from and to entities are both found in the entities list of self folio
            from_ent_in_manifest = bool(list(filter(lambda x: self.ctx.corpus.storage.create_absolute_corpus_path(x.entity_path, self) == absolute_from_ent_string,
                                                    self.entities)))

            absolute_to_ent_string = self.ctx.corpus.storage.create_absolute_corpus_path(rel.to_entity, self)
            to_ent_in_manifest = bool(list(filter(lambda x: self.ctx.corpus.storage.create_absolute_corpus_path(x.entity_path, self) == absolute_to_ent_string,
                                                  self.entities)))

            return bool(from_ent_in_manifest and to_ent_in_manifest)
        return True

    async def _add_elevated_traits_and_relationships(self, rel: 'CdmE2ERelationship') -> None:
        """
        Adds imports for elevated purpose traits for relationships, then adds the relationships to the manifest.
        The last import has the highest priority, so we insert the imports for traits to the beginning of the list.
        """
        res_opt = ResolveOptions(self)
        for trait_ref in rel.exhibits_traits:
            trait_def = self.ctx.corpus._resolve_symbol_reference(res_opt, self, trait_ref.fetch_object_definition_name(), CdmObjectType.TRAIT_DEF, True)
            if trait_def is None:
                abs_path = rel._elevated_trait_corpus_path[trait_ref]
                relative_path = self.ctx.corpus.storage.create_relative_corpus_path(abs_path, self)
                # Adds the import to this manifest file
                self.imports.insert(0, CdmImport(self.ctx, relative_path, None))
                # Fetches the actual file of the import and indexes it
                import_document = await self.ctx.corpus.fetch_object_async(abs_path)  # type: 'CdmDocumentDefinition'
                if not isinstance(import_document, CdmDocumentDefinition):
                    logger.error(self.ctx, self._TAG, self._add_elevated_traits_and_relationships.__name__, self.at_corpus_path,
                                 CdmLogCode.ERR_INVALID_CAST, abs_path, 'CdmDocumentDefinition')
                    continue
                await import_document._index_if_needed(res_opt)
                # Resolves the imports in the manifests
                await self.ctx.corpus._resolve_imports_async(self, set(self.at_corpus_path), res_opt)
                # Calls `GetImportPriorities` to prioritize all imports properly after a new import added (which requires `ImportPriorities` set to null)
                self._import_priorities = None
                self._get_import_priorities()
                # As adding a new import above set the manifest needsIndexing to true, we want to avoid over indexing for each import insertion
                # so we handle the indexing for the new import above seperately in this case, no indexing needed at this point
                self._needs_indexing = False

        self.relationships.append(self._localize_rel_to_manifest(rel))


    def _localize_rel_to_manifest(self, rel: 'CdmE2ERelationship') -> 'CdmE2ERelationship':
        rel_copy = self.ctx.corpus.make_object(CdmObjectType.E2E_RELATIONSHIP_DEF, rel.name)  # type: CdmE2ERelationship
        rel_copy.to_entity = self.ctx.corpus.storage.create_relative_corpus_path(rel.to_entity, self)
        rel_copy.from_entity = self.ctx.corpus.storage.create_relative_corpus_path(rel.from_entity, self)
        rel_copy.to_entity_attribute = rel.to_entity_attribute
        rel_copy.from_entity_attribute = rel.from_entity_attribute
        rel_copy.exhibits_traits.extend(rel.exhibits_traits)
        return rel_copy

    async def populate_manifest_relationships_async(self, option: CdmRelationshipDiscoveryStyle = CdmRelationshipDiscoveryStyle.ALL) -> None:
        """Populate the relationships that the entities in the current manifest are involved in."""
        with logger._enter_scope(self._TAG, self.ctx, self.populate_manifest_relationships_async.__name__):
            self.relationships.clear()
            rel_cache = set()  # Set[str]

            if self.entities:
                # Indexes on this manifest before calling `AddElevatedTraitsAndRelationships`
                # and calls `RefreshAsync` after adding all imports and traits to relationships
                out_res_opt = ResolveOptions(self)
                await self._index_if_needed(out_res_opt, True)

                for ent_dec in self.entities:
                    ent_path = await self._get_entity_path_from_declaration(ent_dec, self)
                    curr_entity = await self.ctx.corpus.fetch_object_async(ent_path)  # type: Optional[CdmEntityDefinition]

                    if not isinstance(curr_entity, CdmEntityDefinition):
                        logger.error(self.ctx, self._TAG, self.populate_manifest_relationships_async.__name__, self.at_corpus_path,
                                     CdmLogCode.ERR_INVALID_CAST, ent_path, 'CdmEntityDefinition')
                        continue
                    if curr_entity is None:
                        continue

                    # handle the outgoing relationships
                    outgoing_rels = self.ctx.corpus.fetch_outgoing_relationships(curr_entity)  # List[CdmE2ERelationship]
                    if outgoing_rels:
                        for rel in outgoing_rels:
                            cache_key = rel.create_cache_key()
                            if cache_key not in rel_cache and self._is_rel_allowed(rel, option):
                                await self._add_elevated_traits_and_relationships(rel)
                                rel_cache.add(cache_key)

                    incoming_rels = self.ctx.corpus.fetch_incoming_relationships(curr_entity)  # type: List[CdmE2ERelationship]

                    if incoming_rels:
                        for in_rel in incoming_rels:
                            # get entity object for current toEntity
                            current_in_base = await self.ctx.corpus.fetch_object_async(in_rel.to_entity, self)  # type: Optional[CdmEntityDefinition]

                            if not isinstance(current_in_base, CdmEntityDefinition):
                                logger.error(self.ctx, self._TAG, self.calculate_entity_graph_async.__name__, self.at_corpus_path,
                                             CdmLogCode.ERR_INVALID_CAST, in_rel.to_entity, 'CdmEntityDefinition')
                                continue
                            if not current_in_base:
                                continue

                            # create graph of inheritance for to current_in_base
                            # graph represented by an array where entity at i extends entity at i+1
                            to_inheritance_graph = []  # type: List[CdmEntityDefinition]
                            while current_in_base:
                                res_opt = ResolveOptions(wrt_doc=current_in_base.in_document)
                                current_in_base = current_in_base.extends_entity.fetch_object_definition(res_opt) if current_in_base.extends_entity else None
                                if current_in_base:
                                    to_inheritance_graph.append(current_in_base)

                            # add current incoming relationship
                            cache_key = in_rel.create_cache_key()
                            if cache_key not in rel_cache and self._is_rel_allowed(in_rel, option):
                                await self._add_elevated_traits_and_relationships(in_rel)
                                rel_cache.add(cache_key)

                            # if A points at B, A's base classes must point at B as well
                            for base_entity in to_inheritance_graph:
                                incoming_rels_for_base = self.ctx.corpus.fetch_incoming_relationships(base_entity)  # type: List[CdmE2ERelationship]

                                if incoming_rels_for_base:
                                    for in_rel_base in incoming_rels_for_base:
                                        new_rel = self.ctx.corpus.make_object(CdmObjectType.E2E_RELATIONSHIP_DEF, '')
                                        new_rel.from_entity = in_rel_base.from_entity
                                        new_rel.from_entity_attribute = in_rel_base.from_entity_attribute
                                        new_rel.to_entity = in_rel.to_entity
                                        new_rel.to_entity_attribute = in_rel.to_entity_attribute

                                        base_rel_cache_key = new_rel.create_cache_key()
                                        if base_rel_cache_key not in rel_cache and self._is_rel_allowed(new_rel, option):
                                            await self._add_elevated_traits_and_relationships(new_rel)
                                            rel_cache.add(base_rel_cache_key)

                # Calls RefreshAsync on this manifest to resolve purpose traits in relationships
                # after adding all imports and traits by calling `AddElevatedTraitsAndRelationships`
                await self.refresh_async(out_res_opt)

            if self.sub_manifests:
                for sub_manifest_def in self.sub_manifests:
                    corpus_path = self.ctx.corpus.storage.create_absolute_corpus_path(sub_manifest_def.definition, self)
                    sub_manifest = await self.ctx.corpus.fetch_object_async(corpus_path)  # type: Optional[CdmManifestDefinition]
                    if not isinstance(sub_manifest, CdmManifestDefinition):
                        logger.error(self.ctx, self._TAG, self.populate_manifest_relationships_async.__name__, self.at_corpus_path,
                                     CdmLogCode.ERR_INVALID_CAST, corpus_path, 'CdmManifestDefinition')
                        continue
                    await sub_manifest.populate_manifest_relationships_async(option)

    async def report_most_recent_time_async(self, child_time: datetime) -> None:
        """Report most recent modified time (of current or children objects) to the parent object."""
        if child_time:
            self.last_child_file_modified_time = time_utils._max_time(child_time, self.last_child_file_modified_time)

    async def _query_on_traits_async(self, query_spec: Union[str, object]) -> Iterable[object]:
        """Query the manifest for a set of entities that match an input query
        query_spec = a JSON object (or a string that can be parsed into one) of the form
        {"entityName":"", "attributes":[{see QueryOnTraits for CdmEntityDefinition for details}]}
        returns null for 0 results or an array of json objects, each matching the shape of
        the input query, with entity and attribute names filled in"""
        return None

    async def _save_dirty_link(self, relative: str, options: 'CopyOptions') -> bool:
        """Helper that fixes a path from local to absolute, gets the object from that path
        then looks at the document where the object is found.
        if dirty, the document is saved with the original name"""

        # get the document object from the import
        doc_path = self.ctx.corpus.storage.create_absolute_corpus_path(relative, self)
        if doc_path is None:
            logger.error(self.ctx, self._TAG, self._save_dirty_link.__name__, self.at_corpus_path, CdmLogCode.ERR_VALDN_INVALID_CORPUS_PATH, relative)
            return False

        obj_at = await self.ctx.corpus.fetch_object_async(doc_path)
        if obj_at is None:
            logger.error(self.ctx, self._TAG, self._save_dirty_link.__name__, self.at_corpus_path, CdmLogCode.ERR_PERSIST_OBJECT_NOT_FOUND, doc_path)
            return False

        doc_imp = cast('CdmDocumentDefinition', obj_at.in_document)
        if doc_imp:
            if doc_imp._is_dirty:
                # save it with the same name
                if not await doc_imp.save_as_async(doc_imp.name, True, options):
                    logger.error(self.ctx, self._TAG, self._save_dirty_link.__name__, self.at_corpus_path, CdmLogCode.ERR_DOC_ENTITY_DOC_SAVING_FAILURE, doc_imp.name)
                    return False
        return True

    async def _fetch_document_definition(self, relative_path: str) -> CdmDocumentDefinition:
        """Helper that fixes a path from local to absolute.Gets the object from that path.
        Created from SaveDirtyLink in order to be able to save docs in parallel.
        Represents the part of SaveDirtyLink that could not be parallelized."""

        # get the document object from the import
        doc_path = self.ctx.corpus.storage.create_absolute_corpus_path(relative_path, self)
        if doc_path is None:
            logger.error(self.ctx, self._TAG, self._fetch_document_definition.__name__, self.at_corpus_path, CdmLogCode.ERR_VALDN_INVALID_CORPUS_PATH, relative_path)
            return None

        res_opt = ResolveOptions()
        res_opt.imports_load_strategy = ImportsLoadStrategy.LOAD
        obj_at = await self.ctx.corpus.fetch_object_async(doc_path, None, res_opt=res_opt)
        if obj_at is None:
            logger.error(self.ctx, self._TAG, self._fetch_document_definition.__name__, self.at_corpus_path, CdmLogCode.ERR_PERSIST_OBJECT_NOT_FOUND, doc_path)
            return None
        document = cast('CdmDocumentDefinition', obj_at.in_document)
        return document

    async def _save_document_if_dirty(self, doc_imp, options: 'CopyOptions') -> None:
        """Saves CdmDocumentDefinition if dirty.
        Was created from SaveDirtyLink in order to be able to save docs in parallel.
        Represents the part of SaveDirtyLink that could be parallelized."""
        loop = asyncio.get_event_loop()
        if doc_imp and doc_imp._is_dirty:
                # save it with the same name
                t = loop.create_task(doc_imp.save_as_async(doc_imp.name, True, options))
                if not await t:
                    logger.error(self.ctx, self._TAG, self._save_document_if_dirty.__name__, self.at_corpus_path, CdmLogCode.ERR_DOC_ENTITY_DOC_SAVING_FAILURE, doc_imp.name)
                    return False
        return True

    async def _save_linked_documents_async(self, options: 'CopyOptions') -> bool:
        links = set()
        if self.imports:
            for imp in self.imports:
                links.add(imp.corpus_path)
        if self.entities:
            # only the local entity declarations please
            for entity_def in self.entities:
                if entity_def.object_type == CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF:
                    links.add(entity_def.entity_path)
                # also, partitions can have their own schemas
                if entity_def.data_partitions:
                    for partition in entity_def.data_partitions:
                        if partition.specialized_schema:
                            links.add(partition.specialized_schema)
                if entity_def.incremental_partitions:
                    for partition in entity_def.incremental_partitions:
                        if partition.specialized_schema:
                            links.add(partition.specialized_schema)
                # so can patterns
                if entity_def.data_partition_patterns:
                    for pattern in entity_def.data_partition_patterns:
                        if pattern.specialized_schema:
                            links.add(pattern.specialized_schema)
                if entity_def.incremental_partition_patterns:
                    for pattern in entity_def.incremental_partition_patterns:
                        if pattern.specialized_schema:
                            links.add(pattern.specialized_schema)
        # Get all Cdm documents sequentially
        docs = list()  # type: List[CdmDocumentDefinition]
        for link in links:
            doc = await self._fetch_document_definition(link)
            if not doc:
                return False

            docs.append(doc)

        tasks = list()
        loop = asyncio.get_event_loop()
        for d in docs:
            tasks.append(loop.create_task(self._save_document_if_dirty(d, options)))

        results = await asyncio.gather(*tasks)

        if self.sub_manifests:
            for sub_declaration in self.sub_manifests:
                sub_manifest = await self._fetch_document_definition(sub_declaration.definition)
                if not sub_manifest or not isinstance(sub_manifest,
                                                      CdmManifestDefinition) or not await self._save_document_if_dirty(
                        sub_manifest, options):
                    return False

        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        if pre_children and pre_children(self, path_from):
            return False

        if self.imports and self.imports._visit_array(path_from, pre_children, post_children):
            return True

        if self.definitions and self.definitions._visit_array(path_from, pre_children, post_children):
            return True

        if self.entities and self.entities._visit_array(path_from, pre_children, post_children):
            return True

        if self.relationships and self.relationships._visit_array('{}/relationships/'.format(path_from), pre_children, post_children):
            return True

        if self.sub_manifests and self.sub_manifests._visit_array('{}/subManifests/'.format(path_from), pre_children, post_children):
            return True

        if post_children and post_children(self, path_from):
            return True

        return False
