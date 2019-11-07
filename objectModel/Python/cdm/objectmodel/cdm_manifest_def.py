from datetime import datetime, timezone
from typing import cast, Dict, Iterable, Optional, Union, TYPE_CHECKING

from cdm.enums import CdmObjectType, CdmRelationshipDiscoveryStyle
from cdm.utilities import AttributeResolutionDirectiveSet, ResolveOptions, time_utils

from .cdm_collection import CdmCollection
from .cdm_entity_collection import CdmEntityCollection
from .cdm_document_def import CdmDocumentDefinition
from .cdm_file_status import CdmFileStatus
from .cdm_object_def import CdmObjectDefinition
from .cdm_referenced_entity_declaration_def import CdmReferencedEntityDeclarationDefinition
from .cdm_trait_collection import CdmTraitCollection

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmCorpusDefinition, CdmE2ERelationship, CdmEntityDefinition, CdmEntityDeclarationDefinition, \
        CdmFolderDefinition, CdmLocalEntityDeclarationDefinition, CdmManifestDeclarationDefinition, CdmObject, CdmTraitDefinition, CdmTraitReference
    from cdm.utilities import CopyOptions, VisitCallback


def rel2_cache_key(rel: 'CdmE2ERelationship') -> str:
    """"standardized way of turning a relationship object into a key for caching
    without using the object itself as a key (could be duplicate relationship objects)"""
    return '{}|{}|{}|{}'.format(rel.to_entity, rel.to_entity_attribute, rel.from_entity, rel.from_entity_attribute)


class CdmManifestDefinition(CdmDocumentDefinition, CdmObjectDefinition, CdmFileStatus):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx, '{}.manifest.cdm.json'.format(name))
        # The name of the manifest
        self.manifest_name = name

        self.explanation = None  # type: Optional[str]

        self.last_child_file_modified_time = None  # type: Optional[datetime]

        self.last_file_modified_time = None  # type: Optional[datetime]

        self.last_file_status_check_time = None  # type: Optional[datetime]

        # Internal
        self._file_system_modified_time = None  # type: Optional[datetime]
        self._entities = CdmEntityCollection(self.ctx, self)  # type: CdmCollection[CdmEntityDeclarationDefinition]
        self._exhibits_traits = CdmTraitCollection(self.ctx, self)  # type: CdmTraitCollection
        self._relationships = CdmCollection(self.ctx, self, CdmObjectType.E2E_RELATIONSHIP_DEF)  # type: CdmCollection[CdmE2ERelationship]
        self._sub_manifests = CdmCollection(self.ctx, self, CdmObjectType.MANIFEST_DECLARATION_DEF)  # type: CdmCollection[CdmManifestDeclarationDefinition]

    @property
    def object_type(self) -> CdmObjectType:
        return CdmObjectType.MANIFEST_DEF

    @property
    def entities(self) -> 'CdmCollection[CdmEntityDeclarationDefinition]':
        return self._entities

    @property
    def exhibits_traits(self) -> 'CdmTraitCollection':
        return self._exhibits_traits

    @property
    def relationships(self) -> 'CdmCollection[CdmE2ERelationship]':
        return self._relationships

    @property
    def sub_manifests(self) -> 'CdmCollection[CdmManifestDeclarationDefinition]':
        return self._sub_manifests

    async def create_resolved_manifest_async(self, new_manifest_name: str, new_entity_document_name_format: str) -> Optional['CdmManifestDefinition']:
        """Creates a resolved copy of the manifest.
        new_entity_document_name_format specifies a pattern to use when creating documents for resolved entities.
        The default is "resolved/{n}.cdm.json" to avoid a document name conflict with documents in the same folder as
        the manifest. Every instance of the string {n} is replaced with the entity name from the source manifest. Any
        sub-folders described by the pattern should exist in the corpus prior to calling this function.
        """

        if self.entities is None:
            return None

        if new_entity_document_name_format is None:
            new_entity_document_name_format = 'resolved/{n}.cdm.json'
        elif new_entity_document_name_format == '':  # for back compat
            new_entity_document_name_format = '{n}.cdm.json'
        elif '{n}' in new_entity_document_name_format:  # for back compat
            new_entity_document_name_format = new_entity_document_name_format + '/{n}.cdm.json'

        source_manifest_path = self.ctx.corpus.storage.create_absolute_corpus_path(self.at_corpus_path, self)
        source_manifest_folder_path = self.ctx.corpus.storage.create_absolute_corpus_path(self.folder.at_corpus_path, self)

        resolved_manifest_path_split = new_manifest_name.rfind('/') + 1
        resolved_manifest_folder = None
        if resolved_manifest_path_split > 0:
            resolved_manifest_path = new_manifest_name[0:resolved_manifest_path_split]
            new_folder_path = self.ctx.corpus.storage.create_absolute_corpus_path(resolved_manifest_path, self)
            resolved_manifest_folder = await self.ctx.corpus.fetch_object_async(new_folder_path)  # type: CdmFolderDefinition
            if resolved_manifest_folder is None:
                self.ctx.logger.error('New folder for manifest not found {}'.format(new_folder_path), 'create_resolved_manifest_async')
                return None
            new_manifest_name = new_manifest_name[resolved_manifest_path_split:]
        else:
            resolved_manifest_folder = self.owner

        self.ctx.logger.debug('resolving manifest {}'.format(source_manifest_path), 'create_resolved_manifest_async')

        # using the references present in the resolved entities, get an entity
        # create an imports doc with all the necessary resolved entity references and then resolve it
        resolved_manifest = CdmManifestDefinition(self.ctx, new_manifest_name)

        # add the new document to the folder
        if resolved_manifest_folder.documents.append(resolved_manifest) is None:
            # when would this happen?
            return None

        # mapping from entity path to resolved entity path for translating relationhsip paths
        res_ent_map = {}  # type: Dict[str, str]

        for entity in self.entities:
            ent_def = await self._get_entity_from_reference(entity, self)

            if not ent_def:
                self.ctx.logger.error('Unable to get entity from reference')
                return None

            # get the path from this manifest to the source entity. this will be the {f} replacement value
            source_entity_full_path = self.ctx.corpus.storage.create_absolute_corpus_path(ent_def.in_document.folder.at_corpus_path, self)
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
            if not folder:
                self.ctx.logger.error('New folder not found {}'.format(new_document_path))
                return None

            # next create the resolved entity.
            res_opt = ResolveOptions()
            res_opt.wrt_doc = ent_def.in_document
            res_opt.directives = AttributeResolutionDirectiveSet({'normalized', 'referenceOnly'})

            self.ctx.logger.debug('    resolving entity {} to document {}'.format(source_entity_full_path, new_document_full_path))

            resolved_entity = await ent_def.create_resolved_entity_async(ent_def.entity_name, res_opt, folder, new_document_name)
            if not resolved_entity:
                # fail all resolution, if any one entity resolution fails
                return None

            result = entity.copy(res_opt)
            if result.object_type == CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF:
                result.at_corpus_path = resolved_entity.at_corpus_path
                relative_entity_path = self.ctx.corpus.storage.create_relative_corpus_path(result.at_corpus_path, resolved_manifest)
                result.entity_path = relative_entity_path or result.at_corpus_path

            resolved_manifest.entities.append(result)
            res_ent_map[self.ctx.corpus.storage.create_absolute_corpus_path(ent_def.at_corpus_path, ent_def.in_document)] = result.entity_path

        self.ctx.logger.debug('    calculating relationships')
        # Calculate the entity graph for just this manifest.
        await self.ctx.corpus._calculate_entity_graph_async(resolved_manifest, res_ent_map)
        # Stick results into the relationships list for the manifest.
        await resolved_manifest.populate_manifest_relationships_async(CdmRelationshipDiscoveryStyle.EXCLUSIVE)

        # needed until Matt's changes with collections where I can propigate
        resolved_manifest._is_dirty = True
        return resolved_manifest

    async def file_status_check_async(self) -> None:
        """Check the modified time for this object and any children."""
        modified_time = await self.ctx.corpus._fetch_last_modified_time_from_object_async(self)

        for entity in self.entities:
            await entity.file_status_check_async()

        for sub_manifest in self.sub_manifests:
            await sub_manifest.file_status_check_async()

        self.last_file_status_check_time = datetime.now(timezone.utc)
        if not self.last_file_modified_time:
            self.last_file_modified_time = self._file_system_modified_time

        # Reload the manifest if it has been updated in the file system.
        if modified_time and self._file_system_modified_time and modified_time != self._file_system_modified_time:
            await self._reload_async()
            self.last_file_modified_time = time_utils.max_time(modified_time, self.last_file_modified_time)
            self._file_system_modified_time = self.last_file_modified_time

    async def _get_entity_from_reference(self, entity: 'CdmEntityDeclarationDefinition', manifest: 'CdmManifestDefinition') -> 'CdmEntityDefinition':
        current_file = cast('CdmObject', manifest)
        while isinstance(entity, CdmReferencedEntityDeclarationDefinition) and entity.entity_path is not None:
            entity = await self.ctx.corpus.fetch_object_async(entity.entity_path, current_file)
            current_file = entity

        result = await self.ctx.corpus.fetch_object_async(entity.entity_path, current_file)  # type: CdmEntityDefinition

        if result is None:
            corpus_path = self.ctx.corpus.storage.create_absolute_corpus_path(entity.entity_path, current_file)
            self.ctx.logger.error('failed to resolve entity %s', corpus_path)

        return result

    async def _get_entity_path_from_declaration(self, entity_dec: 'CdmEntityDeclarationDefinition', obj: Optional['CdmObject'] = None):
        while isinstance(entity_dec, CdmReferencedEntityDeclarationDefinition):
            entity_dec = await self.ctx.corpus.fetch_object_async(entity_dec.entity_path, obj)
            obj = entity_dec.in_document

        return self.ctx.corpus.storage.create_absolute_corpus_path(entity_dec.entity_path, obj)

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        return False

    def is_rel_allowed(self, rel: 'CdmE2ERelationship', option: 'CdmRelationshipDiscoveryStyle') -> bool:
        if option == CdmRelationshipDiscoveryStyle.NONE:
            return False
        if option == CdmRelationshipDiscoveryStyle.EXCLUSIVE:
            absolute_from_ent_string = self.ctx.corpus.storage.create_absolute_corpus_path(rel.from_entity, self)

            #  only true if from and to entities are both found in the entities list of self folio
            from_ent_in_manifest = bool(filter(lambda x: self.ctx.corpus.storage.create_absolute_corpus_path(x.entity_path, self) == absolute_from_ent_string,
                                               self.entities))

            absolute_to_ent_string = self.ctx.corpus.storage.create_absolute_corpus_path(rel.to_entity, self)
            to_ent_in_manifest = bool(filter(lambda x: self.ctx.corpus.storage.create_absolute_corpus_path(x.entity_path) == absolute_to_ent_string,
                                             self.entities))

            return bool(from_ent_in_manifest and to_ent_in_manifest)
        return True

    def _localize_rel_to_manifest(self, rel: 'CdmE2ERelationship') -> 'CdmE2ERelationship':
        rel_copy = self.ctx.corpus.make_object(CdmObjectType.E2E_RELATIONSHIP_DEF)  # type: CdmE2ERelationship
        rel_copy.to_entity = self.ctx.corpus.storage.create_relative_corpus_path(rel.to_entity, self)
        rel_copy.from_entity = self.ctx.corpus.storage.create_relative_corpus_path(rel.from_entity, self)
        rel_copy.to_entity_attribute = rel.to_entity_attribute
        rel_copy.from_entity_attribute = rel.from_entity_attribute
        return rel_copy

    async def populate_manifest_relationships_async(self, option: CdmRelationshipDiscoveryStyle = CdmRelationshipDiscoveryStyle.ALL) -> None:
        """Populate the relationships that the entities in the current manifest are involved in."""
        self.relationships.clear()
        rel_cache = set()  # Set[str]

        for ent_dec in self.entities:
            ent_path = await self._get_entity_path_from_declaration(ent_dec, self)
            curr_entity = await self.ctx.corpus.fetch_object_async(ent_path)  # type: CdmEntityDefinition

            # handle the outgoing relationships
            outgoing_rels = self.ctx.corpus.fetch_outgoing_relationships(curr_entity)  # List[CdmE2ERelationship]
            if outgoing_rels:
                for rel in outgoing_rels:
                    cache_key = rel2_cache_key(rel)
                    if cache_key not in rel_cache and self.is_rel_allowed(rel, option):
                        self.relationships.append(self._localize_rel_to_manifest(rel))
                        rel_cache.add(cache_key)

            incoming_rels = self.ctx.corpus.fetch_incoming_relationships(curr_entity)  # type: List[CdmE2ERelationship]

            if incoming_rels:
                for in_rel in incoming_rels:
                    # get entity object for current toEntity
                    to_entity_path = self.ctx.corpus.storage.create_absolute_corpus_path(in_rel.to_entity)
                    current_in_base = await self.ctx.corpus.fetch_object_async(to_entity_path)  # type: CdmEntityDefinition

                    # create graph of inheritance for to current_in_base
                    # graph represented by an array where entity at i extends entity at i+1
                    to_inheritance_graph = []  # type: List[CdmEntityDefinition]
                    while current_in_base:
                        res_opt = ResolveOptions(wrt_doc=current_in_base.in_document)
                        current_in_base = current_in_base.extends_entity.fetch_object_definition(res_opt) if current_in_base.extends_entity else None
                        if current_in_base:
                            to_inheritance_graph.append(current_in_base)

                    # add current incoming relationship
                    cache_key = rel2_cache_key(in_rel)
                    if cache_key not in rel_cache and self.is_rel_allowed(in_rel, option):
                        self.relationships.append(self._localize_rel_to_manifest(in_rel))
                        rel_cache.add(cache_key)

                    # if A points at B, A's base classes must point at B as well
                    for base_entity in to_inheritance_graph:
                        incoming_rels_for_base = self.ctx.corpus.fetch_incoming_relationships(base_entity)  # type: List[CdmE2ERelationship]

                        if incoming_rels_for_base:
                            for in_rel_base in incoming_rels_for_base:
                                new_rel = CdmE2ERelationship(self.ctx, "")
                                new_rel.from_entity = in_rel_base.from_entity
                                new_rel.from_entity_attribute = in_rel_base.from_entity_attribute
                                new_rel.to_entity = in_rel.to_entity
                                new_rel.to_entity_attribute = in_rel.to_entity_attribute

                                base_rel_cache_key = rel2_cache_key(new_rel)
                                if base_rel_cache_key not in rel_cache and self.is_rel_allowed(new_rel, option):
                                    self.relationships.append(self._localize_rel_to_manifest(new_rel))
                                    rel_cache.add(base_rel_cache_key)
        if self.sub_manifests:
            for sub_manifest_def in self.sub_manifests:
                corpus_path = self.ctx.corpus.storage.create_absolute_corpus_path(sub_manifest_def.definition, self)
                sub_manifest = await self.ctx.corpus.fetch_object_async(corpus_path)  # type: CdmManifestDefinition
                await sub_manifest.populate_manifest_relationships_async(option)

    async def report_most_recent_time_async(self, child_time: datetime) -> None:
        """Report most recent modified time (of current or children objects) to the parent object."""
        if child_time:
            self.last_child_file_modified_time = time_utils.max_time(child_time, self.last_child_file_modified_time)

    async def query_on_traits_async(self, query_spec: Union[str, object]) -> Iterable[object]:
        """Query the manifest for a set of entities that match an input query
        query_spec = a JSON object (or a string that can be parsed into one) of the form
        {"entityName":"", "attributes":[{see QueryOnTraits for CdmEntityDefinition for details}]}
        returns null for 0 results or an array of json objects, each matching the shape of
        the input query, with entity and attribute names filled in"""
        return None

    async def _save_dirty_link(self, relative: str, options: 'CopyOptions') -> None:
        """helper that fixes a path from local to absolute, gets the object from that path
        then looks at the document where the object is found.
        if dirty, the document is saved with the original name"""

        # get the document object from the import
        doc_path = self.ctx.corpus.storage.create_absolute_corpus_path(relative, self)
        if doc_path is None:
            self.ctx.logger.error('Invalid corpus path {}'.format(relative))
            return False

        obj_at = await self.ctx.corpus.fetch_object_async(doc_path)
        if obj_at is None:
            self.ctx.logger.error('Couldn\'t get object from path {}'.format(doc_path))
            return False

        doc_imp = cast('CdmDocumentDefinition', obj_at.in_document)
        if doc_imp:
            if doc_imp._is_dirty:
                # save it with the same name
                if not await doc_imp.save_as_async(doc_imp.name, True, options):
                    self.ctx.logger.error('failed saving document {}'.format(doc_imp.name))
                    return False
        return True

    async def _save_linked_documents_async(self, options: 'CopyOptions') -> bool:
        if self.imports:
            for imp in self.imports:
                if not await self._save_dirty_link(imp.corpus_path, options):
                    self.ctx.logger.error('failed saving imported document {}'.format(imp.corpus_path))
                    return False

        # only the local entity declarations please
        for entity_def in self.entities:
            if entity_def.object_type == CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF:
                if not await self._save_dirty_link(entity_def.entity_path, options):
                    self.ctx.logger.error('failed saving local entity schema document {}'.format(entity_def.entity_path))
                    return False

                # also, partitions can have their own schemas
                if entity_def.data_partitions:
                    for partition in entity_def.data_partitions:
                        if partition.specialized_schema:
                            if not await self._save_dirty_link(partition.specialized_schema, options):
                                self.ctx.logger.error('failed saving partition schema document {}'.format(partition.specialized_schema))
                                return False

                # so can patterns
                if entity_def.data_partition_patterns:
                    for pattern in entity_def.data_partition_patterns:
                        if pattern.specialized_schema:
                            if not await self._save_dirty_link(pattern.specialized_schema, options):
                                self.ctx.logger.error('failed saving partition schema document {}'.format(pattern.specialized_schema))
                                return False

        if self.sub_manifests:
            for sub in self.sub_manifests:
                if not await self._save_dirty_link(sub.definition, options):
                    self.ctx.logger.error('failed saving sub-manifest document {}'.format(sub.definition))
                    return False

        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        if pre_children and pre_children(self, path_from):
            return False

        if self.definitions and self._definitions._visit_array(path_from, pre_children, post_children):
            return True

        if self.entities:
            if self._entities._visit_array(path_from, pre_children, post_children):
                return True

        if self.sub_manifests and self._sub_manifests._visit_array(path_from, pre_children, post_children):
            return True

        if post_children and post_children(self, path_from):
            return True

        return False
