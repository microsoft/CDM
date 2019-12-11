import dateutil.parser

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmManifestDefinition
from cdm.utilities import CopyOptions, ResolveOptions, time_utils

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


class ManifestPersistence:
    @staticmethod
    async def from_data(ctx: CdmCorpusContext, name: str, namespace: str, path: str, data: ManifestContent) -> CdmManifestDefinition:
        if data is None:
            return None

        if data.get('manifestName'):
            manifest_name = data.manifestName
        elif data.get('folioName'):
            manifest_name = data.folioName
        elif name:
            manifest_name = name.replace('.manifest.cdm.json', '').replace('.folio.cdm.json', '')
        else:
            manifest_name = ''

        manifest = ctx.corpus.make_object(CdmObjectType.MANIFEST_DEF, manifest_name)
        manifest.name = name  # this is the document name which is assumed by constructor to be related to the the manifest name, but may not be
        manifest.folder_path = path
        manifest.namespace = namespace
        manifest.explanation = data.get('explanation')

        if data.schema:
            manifest.schema = data.schema

        # support old model syntax
        if data.get('schemaVersion'):
            manifest.json_schema_semantic_version = data.schema_version

        manifest.json_schema_semantic_version = data.get('jsonSchemaSemanticVersion')

        if manifest.json_schema_semantic_version != '0.9.0':
            # TODO: validate that this is a version we can understand with the OM
            pass

        if data.get('exhibitsTraits'):
            exhibits_traits = utils.create_trait_reference_array(ctx, data.exhibitsTraits)
            manifest.exhibits_traits.extend(exhibits_traits)

        if data.get('imports'):
            for import_obj in data.imports:
                manifest.imports.append(ImportPersistence.from_data(ctx, import_obj))

        if data.get('definitions'):
            for definition in data.definitions:
                if 'dataTypeName' in definition:
                    manifest.definitions.append(DataTypePersistence.fromData(ctx, definition))
                elif 'purposeName' in definition:
                    manifest.definitions.append(PurposePersistence.fromData(ctx, definition))
                elif 'attributeGroupName' in definition:
                    manifest.definitions.append(AttributeGroupPersistence.fromData(ctx, definition))
                elif 'traitName' in definition:
                    manifest.definitions.append(TraitPersistence.fromData(ctx, definition))
                elif 'entityShape' in definition:
                    manifest.definitions.append(ConstantEntityPersistence.fromData(ctx, definition))
                elif 'entityName' in definition:
                    manifest.definitions.append(EntityPersistence.fromData(ctx, definition))

        if data.get('lastFileStatusCheckTime'):
            manifest.last_file_status_check_time = dateutil.parser.parse(data.lastFileStatusCheckTime)

        if data.get('lastFileModifiedTime'):
            manifest.last_file_modified_time = dateutil.parser.parse(data.lastFileModifiedTime)

        if data.get('lastChildFileModifiedTime'):
            manifest.last_child_file_modified_time = dateutil.parser.parse(data.lastChildFileModifiedTime)

        if data.get('entities'):
            full_path = '{}:{}'.format(namespace, path) if namespace else path
            for entity_obj in data.entities:
                if entity_obj.get('type') == 'LocalEntity' or 'entitySchema' in entity_obj:
                    manifest.entities.append(LocalEntityDeclarationPersistence.from_data(ctx, full_path, entity_obj))
                elif entity_obj.get('type') == 'ReferencedEntity' or 'entityDeclaration' in entity_obj:
                    manifest.entities.append(ReferencedEntityDeclarationPersistence.from_data(ctx, full_path, entity_obj))
                else:
                    ctx.logger.error('Folio entity type should be either LocalEntity or Referenced entity.', entity_obj.entityName)
                    return None

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
    async def to_data(instance: CdmManifestDefinition, res_opt: ResolveOptions, options: CopyOptions) -> ManifestContent:
        manifest = ManifestContent()

        manifest.manifestName = instance.manifest_name
        manifest.jsonSchemaSemanticVersion = instance.json_schema_semantic_version
        manifest.lastFileStatusCheckTime = time_utils.get_formatted_date_string(instance.last_file_status_check_time)
        manifest.lastFileModifiedTime = time_utils.get_formatted_date_string(instance.last_file_modified_time)
        manifest.lastChildFileModifiedTime = time_utils.get_formatted_date_string(instance.last_child_file_modified_time)
        manifest.explanation = instance.explanation
        manifest.exhibitsTraits = utils.array_copy_data(res_opt, instance.exhibits_traits, options)
        manifest.entities = utils.array_copy_data(res_opt, instance.entities, options)
        manifest.subManifests = utils.array_copy_data(res_opt, instance.sub_manifests, options)
        manifest.imports = [ImportPersistence.to_data(importDoc, res_opt, options) for importDoc in instance.imports]
        manifest.relationships = [E2ERelationshipPersistence.to_data(relationship, res_opt, options) for relationship in instance.relationships]

        return manifest
