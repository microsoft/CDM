# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
import json

import dateutil.parser
from typing import List

from cdm.enums import CdmLogCode, CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmManifestDefinition
from cdm.persistence import PersistenceLayer
from cdm.utilities import CopyOptions, ResolveOptions, StorageUtils, TraitToPropertyMap, copy_data_utils, logger, \
    time_utils, Constants

from . import utils
from .e2e_relationship_persistence import E2ERelationshipPersistence
from .import_persistence import ImportPersistence
from .local_entity_declaration_persistence import LocalEntityDeclarationPersistence
from cdm.persistence.syms.models import ColumnRelationshipInformation, DataSource, DatabaseEntity, \
    DatabaseProperties, RelationshipEntity, TableEntity
from cdm.persistence.syms.types import SymsManifestContent
from cdm.persistence.syms.models.sy_msapi_service_client_enums import SASEntityType

_TAG = 'ManifestPersistence'


class ManifestPersistence:
    is_persistence_async = False

    formats = [PersistenceLayer.MANIFEST_EXTENSION, PersistenceLayer.FOLIO_EXTENSION]
    db_location_trait = "is.storagesource"
    db_location_trait_arg_name = "namespace"

    @staticmethod
    def from_object(ctx: CdmCorpusContext, docname: str, namespace: str, path: str,
                    data_obj: 'SymsManifestContent') -> 'CdmManifestDefinition':
        database = data_obj.database
        if database == None or database.type != SASEntityType.database:
            logger.error(ctx, _TAG, 'from_object', None, CdmLogCode.ERR_PERSIST_SYMS_INVALID_DB_OBJECT)
            return None

        database_properties = DatabaseProperties.deserialize(database.properties)
        source = DataSource(None).deserialize(database_properties.source)
        if database_properties == None or source  == None:
            logger.error(ctx, _TAG, 'from_object', None, CdmLogCode.ERR_PERSIST_SYMS_INVALID_DB_PROP_OBJECT)
            return None

        properties = database_properties.properties
        manifest = ctx.corpus.make_object(CdmObjectType.MANIFEST_DEF)

        manifest._folder_path = path
        manifest._namespace = namespace
        manifest.manifest_name = data_obj.database.name
        manifest.name = docname
        manifest.explanation = database_properties.description

        if properties is not None:
            if "cdm:schema" in properties:
                manifest.schema = properties["cdm:schema"]
            if "cdm:jsonSchemaSemanticVersion" in properties:
                manifest.json_schema_semantic_version = properties["cdm:jsonSchemaSemanticVersion"]
            if "cdm:documentVersion" in properties:
                manifest.DocumentVersion = properties["cdm:documentVersion"]
            if "cdm:traits" in properties:
                utils.add_list_to_cdm_collection(manifest.exhibits_traits,
                                            utils.create_trait_reference_array(ctx, properties["cdm:traits"]))
            if "cdm:imports" in properties:
                for import_obj in properties["cdm:imports"]:
                    manifest.imports.append(ImportPersistence.from_data(ctx, json.loads(import_obj)))
            if "cdm:lastFileStatusCheckTime" in properties:
                manifest.last_file_status_check_time = dateutil.parser.parse(properties["cdm:lastFileStatusCheckTime"])
            if "cdm:lastFileModifiedTime" in properties:
                manifest.last_file_modified_time = dateutil.parser.parse(properties["cdm:lastFileModifiedTime"])
            if "cdm:lastChildFileModifiedTime" in properties:
                manifest.last_child_file_modified_time = dateutil.parser.parse(properties["cdm:lastChildFileModifiedTime"])

        t2pm = TraitToPropertyMap(manifest)
        source_trait = t2pm._fetch_trait_reference(ManifestPersistence.db_location_trait)
        if source_trait == None:
            source_trait = utils.create_source_trait(ctx, ManifestPersistence.db_location_trait, ManifestPersistence.db_location_trait_arg_name)
            manifest.exhibits_traits.append(source_trait)

        adls_path = utils.syms_path_to_adls_adapter_path(source.location)
        adls_corpus_path = ctx.corpus.storage.adapter_path_to_corpus_path(adls_path)
        if not adls_corpus_path:
           path_tuple = StorageUtils.split_namespace_path(source_trait.arguments[0].value)
           obj = utils.create_and_mount_adls_adapter_from_adls_path(ctx.corpus.storage, adls_path, path_tuple[0])
           if  obj == None:
               logger.error(ctx, _TAG, 'from_object', None, CdmLogCode.ERR_PERSIST_SYMS_ADLS_ADAPTER_NOT_MOUNTED, adls_path)
               return None

        if data_obj.entities is not None:
            for item in data_obj.entities.items:
                entity_obj = TableEntity(None, None).deserialize(item)
                if entity_obj.type == SASEntityType.table:
                    entity = LocalEntityDeclarationPersistence.from_data(ctx, entity_obj, manifest, database_properties.source.location)
                    if entity is not None:
                        manifest.entities.append(entity)
                    else:
                        logger.warning(ctx, _TAG, 'from_object', None, CdmLogCode.WARN_PERSIST_SYMS_ENTITY_SKIPPED, entity_obj.name)

        if not (x for x in manifest.imports if x.corpus_path == Constants._FOUNDATIONS_CORPUS_PATH) or len(manifest.imports) == 0:
            manifest.imports.append(Constants._FOUNDATIONS_CORPUS_PATH)

        if data_obj.relationships is not None:
            for item in data_obj.relationships.items:
                relationship_entity = RelationshipEntity(None, None).deserialize(item)
                manifest.relationships.extend(E2ERelationshipPersistence.from_data(ctx, relationship_entity))

        # TODO: Submanifest
        return manifest

    @staticmethod
    async def to_data_async(instance: CdmManifestDefinition, res_opt: ResolveOptions, options: CopyOptions, is_delta_sync: bool = False, existing_syms_tables: List[TableEntity] = None, existing_syms_relationships: List[RelationshipEntity] = None) -> SymsManifestContent:
        source = ManifestPersistence.create_data_source(instance)
        if source == None:
            return None

        properties = ManifestPersistence.create_database_propertybags(instance, res_opt, options)

        existing_table_entities = {}
        removed_syms_table = []
        if existing_syms_tables is not None and len(existing_syms_tables.items) > 0 :
            # convert to dictionary for better searching
            ents = []
            for ent in instance.entities:
                ents.append(ent.entity_name)

            for item in existing_syms_tables.items:
                entity_obj = TableEntity(None, None).deserialize(item)
                if entity_obj.type == SASEntityType.table:
                    existing_table_entities[entity_obj.name] = entity_obj
                    if entity_obj.name not in ents:
                        removed_syms_table.append(entity_obj.name)

        added_or_modified_syms_tables = await ManifestPersistence.create_syms_tables_objects(instance, res_opt, options, source.location,
                                                                  existing_table_entities)
        # TODO: Submanifest
        existing_relationship_entities = {}
        removed_syms_relationships = []
        if existing_syms_relationships is not None and len(existing_syms_relationships.items) > 0:
            rels = []
            for rel in instance.relationships:
                rels.append(rel.name)

            for item in existing_syms_relationships.items:
                rel_obj = RelationshipEntity(None, None).deserialize(item)
                existing_relationship_entities[rel_obj.name] = rel_obj
                if rel_obj.name not in rels:
                        removed_syms_relationships.append(rel_obj.name)
    
        added_or_modified_syms_relationships = ManifestPersistence.create_relationships(instance, existing_relationship_entities, res_opt, options)
    
        dbproperties = DatabaseProperties(source=source)
        if instance.explanation is not None:
            dbproperties.description =  instance.explanation
        else:
            dbproperties.description = instance.manifest_name + " syms database"
        dbproperties.properties = properties
    
        database_entity = DatabaseEntity(name = instance.manifest_name,
        properties = dbproperties,
        type = SASEntityType.database)
    
        syms_content = SymsManifestContent()
        syms_content.database = database_entity
        syms_content.entities = added_or_modified_syms_tables
        syms_content.relationships = added_or_modified_syms_relationships
        syms_content.intial_sync = not is_delta_sync
        syms_content.removed_entities = removed_syms_table
        syms_content.removed_relationships = removed_syms_relationships
        return syms_content

    @staticmethod
    def create_data_source(instance: CdmManifestDefinition) -> DataSource:
        source = DataSource(None)
        t2pm = TraitToPropertyMap(instance)
        source_traits = t2pm._fetch_trait_reference(ManifestPersistence.db_location_trait)
        if source_traits is not None and source_traits.arguments is not None and len(source_traits.arguments) == 1 and \
            source_traits.arguments[0].name == ManifestPersistence.db_location_trait_arg_name:
            source.location = utils.corpus_path_to_syms_path(source_traits.arguments[0].value, instance.ctx.corpus.storage)
        if source.location == None:
            logger.error(instance.ctx, _TAG, 'create_data_source', instance.at_corpus_path, CdmLogCode.ERR_PERSIST_SYMS_STORAGE_SOURCE_TRAIT_ERROR, ManifestPersistence.db_location_trait , ManifestPersistence.db_location_trait_arg_name)
            return None

        return source

    @staticmethod
    def create_database_propertybags(instance: CdmManifestDefinition, res_opt: ResolveOptions, options: CopyOptions):
        properties = {}
        last_file_status_check_time = time_utils._get_formatted_date_string(instance.last_file_status_check_time)
        last_file_modified_time = time_utils._get_formatted_date_string(instance.last_file_modified_time)
        last_child_file_modified_time = time_utils._get_formatted_date_string(instance.last_child_file_modified_time)

        if last_file_status_check_time is not None:
            properties["cdm:lastFileStatusCheckTime"] = last_file_status_check_time

        if last_file_modified_time is not None:
            properties["cdm:lastFileModifiedTime"] = last_file_modified_time

        if last_child_file_modified_time is not None:
            properties["cdm:lastChildFileModifiedTime"] = last_child_file_modified_time

        if instance.schema is not None:
            properties["cdm:schema"] = instance.schema

        if instance.document_version is not None:
            properties["cdm:documentVersion"] = instance.document_version

        if instance.json_schema_semantic_version is not None:
            properties["cdm:jsonSchemaSemanticVersion"] = instance.json_schema_semantic_version

        if instance.imports is not None and len(instance.imports) > 0:
            properties["cdm:imports"] = copy_data_utils._array_copy_data(res_opt, instance.imports, options)

        if instance.exhibits_traits is not None and len(instance.exhibits_traits) > 0:
            properties["cdm:traits"] = copy_data_utils._array_copy_data(res_opt, instance.exhibits_traits, options)

        return properties

    @staticmethod
    def create_relationships(instance: CdmManifestDefinition, existing_relationship_entities,
             res_opt: ResolveOptions, options: CopyOptions)-> List[RelationshipEntity]:
        relationships = {}
        if instance.relationships is not None and len(instance.relationships) > 0:
            for cdm_relationship in instance.relationships:
                if utils.is_relationship_added_or_modified(cdm_relationship, existing_relationship_entities):
                    if not instance.name in relationships:
                        relationship = E2ERelationshipPersistence.to_data(cdm_relationship, instance.manifest_name, res_opt, options)
                        if relationship is not None:
                            relationships[relationship.name] = relationship
                        else:
                            logger.error(instance.ctx, _TAG, 'create_relationships', instance.at_corpus_path, CdmLogCode.ERR_PERSIST_SYMS_ENTITY_DECL_CONVERSION_FAILURE)
                    else:
                         relationship_entity = relationships[instance.name]
                         cr = ColumnRelationshipInformation()
                         cr.from_column_name = cdm_relationship.from_entity_attribute
                         cr.from_column_name = cdm_relationship.to_entity_attribute

                         relationship_entity.properties.ColumnRelationshipInformations.append(cr)
        return relationships.values()

    @staticmethod
    async def create_syms_tables_objects(instance: 'CdmManifestDefinition', res_opt: 'ResolveOptions', options: 'CopyOptions',
                      location: str, existingTableEntities = None) -> List['TableEntity']:
        syms_tables = []

        if instance.entities and len(instance.entities) > 0:
            # Schedule processing of each entity to be added to the manifest
            for entity in instance.entities:
                element = None
                if entity.object_type == CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF \
                        and utils.is_entity_added_or_modified(entity, existingTableEntities):
                    element = await LocalEntityDeclarationPersistence.to_data_async(entity, instance, location, res_opt, options)

                if element:
                    syms_tables.append(element)
                else:
                    logger.error(instance.ctx, _TAG, 'create_syms_tables_objects', instance.at_corpus_path, CdmLogCode.ERR_PERSIST_SYMS_ENTITY_DECL_CONVERSION_FAILURE, entity.entity_name)

        return syms_tables

    @staticmethod
    async def convert_manifest_to_syms(doc: 'CdmManifestDefinition', adapter: 'StorageAdapter', path: str, res_opt: 'ResolveOptions', options: 'CopyOptions')-> 'SymsManifestContent':
        database_entity = None
        is_delta_sync = True
        existing_syms_tables = None
        existing_syms_relationship_entities = None
        try:
            req = await adapter.read_async(path)
            database_entity = DatabaseEntity().deserialize(json.loads(req))
        except Exception as e:
            if e.code == 404:
                is_delta_sync = False
            else:
                raise

        if is_delta_sync:
            json_data = await adapter.read_async("/" + database_entity.name + "/" + database_entity.name + ".manifest.cdm.json/entitydefinition")
            from cdm.persistence.syms.models.query_artifacts_response import QueryArtifactsResponse
            entities = QueryArtifactsResponse().deserialize(json.loads(json_data))
            existing_syms_tables = entities

            json_data = await adapter.read_async("/" + database_entity.name + "/" + database_entity.name+ ".manifest.cdm.json/relationships")
            realtionships = QueryArtifactsResponse().deserialize(json.loads(json_data))
            existing_syms_relationship_entities = realtionships

        return await ManifestPersistence.to_data_async(doc, res_opt, options, is_delta_sync, existing_syms_tables, existing_syms_relationship_entities)
