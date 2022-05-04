# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import dateutil.parser

from cdm.enums import CdmObjectType, CdmLogCode
from cdm.objectmodel import CdmCorpusContext, CdmManifestDefinition, CdmLocalEntityDeclarationDefinition
from cdm.persistence import PersistenceLayer
from cdm.utilities import logger, CopyOptions, ResolveOptions, time_utils, copy_data_utils, Constants
from cdm.utilities.string_utils import StringUtils

from . import utils
from .attribute_group_persistence import AttributeGroupPersistence
from .constant_entity_persistence import ConstantEntityPersistence
from .data_type_persistence import DataTypePersistence
from .entity_persistence import EntityPersistence
from .e2e_relationship_persistence import E2ERelationshipPersistence
from .manifest_declaration_persistence import ManifestDeclarationPersistence
from .import_persistence import ImportPersistence
from .local_entity_declaration_persistence import LocalEntityDeclarationPersistence
from .purpose_persistence import PurposePersistence
from .referenced_entity_declaration_persistence import ReferencedEntityDeclarationPersistence
from .trait_persistence import TraitPersistence
from .types import ManifestContent


_TAG = 'ManifestPersistence'


class ManifestPersistence:
    is_persistence_async = False

    formats = [PersistenceLayer.MANIFEST_EXTENSION, PersistenceLayer.FOLIO_EXTENSION]

    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', doc_name: str, json_data: str, folder: 'CdmFolderDefinition') -> 'CdmManifestDefinition':
        obj = ManifestContent().decode(json_data)
        return ManifestPersistence.from_object(ctx, doc_name, folder._namespace, folder._folder_path, obj)

    @staticmethod
    def from_object(ctx: CdmCorpusContext, name: str, namespace: str, path: str, data: 'ManifestContent') -> 'CdmManifestDefinition':
        if data is None:
            return None

        if not StringUtils.is_blank_by_cdm_standard(data.manifestName):
            manifest_name = data.manifestName
        elif not StringUtils.is_blank_by_cdm_standard(data.get('folioName')):
            manifest_name = data.get('folioName')
        elif name:
            manifest_name = name.replace(PersistenceLayer.MANIFEST_EXTENSION, '').replace(PersistenceLayer.FOLIO_EXTENSION, '')
        else:
            manifest_name = ''

        manifest = ctx.corpus.make_object(CdmObjectType.MANIFEST_DEF, manifest_name)
        manifest.name = name  # this is the document name which is assumed by constructor to be related to the the manifest name, but may not be
        manifest._folder_path = path
        manifest._namespace = namespace
        manifest.explanation = data.get('explanation')

        if not StringUtils.is_blank_by_cdm_standard(data.schema):
            manifest.schema = data.schema

        # support old model syntax
        if not StringUtils.is_blank_by_cdm_standard(data.schemaVersion):
            manifest.json_schema_semantic_version = data.schemaVersion

        if not StringUtils.is_blank_by_cdm_standard(data.jsonSchemaSemanticVersion):
            manifest.json_schema_semantic_version = data.jsonSchemaSemanticVersion

        if manifest.json_schema_semantic_version != '0.9.0' and manifest.json_schema_semantic_version != '1.0.0':
            # TODO: validate that this is a version we can understand with the OM
            pass

        if not StringUtils.is_blank_by_cdm_standard(data.documentVersion):
            manifest.document_version = data.documentVersion

        utils.add_list_to_cdm_collection(manifest.exhibits_traits,
                                         utils.create_trait_reference_array(ctx, data.exhibitsTraits))

        if data.get('imports'):
            for import_obj in data.imports:
                manifest.imports.append(ImportPersistence.from_data(ctx, import_obj))

        if data.get('definitions'):
            for definition in data.definitions:
                if 'dataTypeName' in definition:
                    manifest.definitions.append(DataTypePersistence.from_data(ctx, definition))
                elif 'purposeName' in definition:
                    manifest.definitions.append(PurposePersistence.from_data(ctx, definition))
                elif 'attributeGroupName' in definition:
                    manifest.definitions.append(AttributeGroupPersistence.from_data(ctx, definition))
                elif 'traitName' in definition:
                    manifest.definitions.append(TraitPersistence.from_data(ctx, definition))
                elif 'entityShape' in definition:
                    manifest.definitions.append(ConstantEntityPersistence.from_data(ctx, definition))
                elif 'entityName' in definition:
                    manifest.definitions.append(EntityPersistence.from_data(ctx, definition))

        if data.get('lastFileStatusCheckTime'):
            manifest.last_file_status_check_time = dateutil.parser.parse(data.lastFileStatusCheckTime)

        if data.get('lastFileModifiedTime'):
            manifest.last_file_modified_time = dateutil.parser.parse(data.lastFileModifiedTime)

        if data.get('lastChildFileModifiedTime'):
            manifest.last_child_file_modified_time = dateutil.parser.parse(data.lastChildFileModifiedTime)

        if data.get('entities'):
            full_path = '{}:{}'.format(namespace, path) if not StringUtils.is_blank_by_cdm_standard(namespace) else path
            for entity_obj in data.entities:
                if entity_obj.get('type') == 'LocalEntity' or 'entitySchema' in entity_obj:
                    manifest.entities.append(LocalEntityDeclarationPersistence.from_data(ctx, full_path, entity_obj))
                elif entity_obj.get('type') == 'ReferencedEntity' or 'entityDeclaration' in entity_obj:
                    manifest.entities.append(ReferencedEntityDeclarationPersistence.from_data(ctx, full_path, entity_obj))
                else:
                    logger.error(ctx, _TAG, ManifestPersistence.from_object.__name__, None, CdmLogCode.ERR_PERSIST_ENTITY_DECLARATION_MISSING, entity_obj.get('entityName'))
                    return None

            # Checks if incremental trait is needed from foundations.cdm.json
            ManifestPersistence._import_foundations_if_incremental_partition_trait_exist(manifest)

        if data.get('relationships'):
            for relationship in data.relationships:
                manifest.relationships.append(E2ERelationshipPersistence.from_data(ctx, relationship))

        if data.get('subManifests'):
            sub_manifests = data.subManifests
        elif data.get('subFolios'):
            sub_manifests = data.subFolios
        else:
            sub_manifests = []

        for sub_manifest in sub_manifests:
            manifest.sub_manifests.append(ManifestDeclarationPersistence.from_data(ctx, sub_manifest))

        return manifest

    @staticmethod
    def to_data(instance: CdmManifestDefinition, res_opt: ResolveOptions, options: CopyOptions) -> ManifestContent:
        # Checks if incremental trait is needed from foundations.cdm.json
        ManifestPersistence._import_foundations_if_incremental_partition_trait_exist(instance)
        manifest = ManifestContent()

        manifest.manifestName = instance.manifest_name
        manifest.schema = instance.schema
        manifest.jsonSchemaSemanticVersion = instance.json_schema_semantic_version
        manifest.documentVersion = instance.document_version
        manifest.lastFileStatusCheckTime = time_utils._get_formatted_date_string(instance.last_file_status_check_time)
        manifest.lastFileModifiedTime = time_utils._get_formatted_date_string(instance.last_file_modified_time)
        manifest.lastChildFileModifiedTime = time_utils._get_formatted_date_string(instance.last_child_file_modified_time)
        manifest.explanation = instance.explanation
        manifest.exhibitsTraits = copy_data_utils._array_copy_data(res_opt, instance.exhibits_traits, options)
        manifest.entities = copy_data_utils._array_copy_data(res_opt, instance.entities, options)
        manifest.subManifests = copy_data_utils._array_copy_data(res_opt, instance.sub_manifests, options)
        manifest.imports = copy_data_utils._array_copy_data(res_opt, instance.imports, options)
        manifest.relationships = copy_data_utils._array_copy_data(res_opt, instance.relationships, options)

        return manifest

    @staticmethod
    def _import_foundations_if_incremental_partition_trait_exist(manifest: CdmManifestDefinition) -> None:
        """
        Checks if incremental trait is needed from foundations.cdm.json
        """
        if manifest.entities == None:
            return

        for ent in manifest.entities:
            if isinstance(ent, CdmLocalEntityDeclarationDefinition):
                if ent.incremental_partitions and len(ent.incremental_partitions) > 0 or ent.incremental_partition_patterns and len(ent.incremental_partition_patterns) > 0:
                    if manifest.imports.item(Constants._FOUNDATIONS_CORPUS_PATH, check_moniker=False) is None:
                        manifest.imports.append(Constants._FOUNDATIONS_CORPUS_PATH)
                        # Find one is enough
                        break
