from collections import OrderedDict
import dateutil.parser
from typing import List, Optional, TYPE_CHECKING
import uuid

from cdm.enums import CdmObjectType
from cdm.persistence import PersistenceLayer
from cdm.persistence.cdmfolder import ImportPersistence
from cdm.utilities import logger, TraitToPropertyMap

from . import extension_helper, utils
from .types import Model, ReferenceModel
from .local_entity_declaration_persistence import LocalEntityDeclarationPersistence
from .referenced_entity_declaration_persistence import ReferencedEntityDeclarationPersistence
from .relationship_persistence import RelationshipPersistence

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmDocumentDefinition, CdmFolderDefinition, CdmManifestDefinition, CdmImport, CdmTraitDefinition
    from cdm.utilities import CopyOptions, ResolveOptions

_TAG = 'ManifestPersistence'


class ManifestPersistence:
    is_persistence_async = True

    formats = [PersistenceLayer._MODEL_JSON_EXTENSION]

    @staticmethod
    async def from_data(ctx: 'CdmCorpusContext', doc_name: str, json_data: str, folder: 'CdmFolderDefinition') -> 'CdmManifestDefinition':
        obj = Model().decode(json_data)
        return await ManifestPersistence.from_object(ctx, obj, folder)

    @staticmethod
    async def from_object(ctx: 'CdmCorpusContext', obj: 'Model', folder: 'CdmFolderDefinition') -> Optional['CdmManifestDefinition']:
        extension_trait_def_list = []

        manifest = ctx.corpus.make_object(CdmObjectType.MANIFEST_DEF, obj.name)
        # we need to set up folder path and namespace of a folio to be able to retrieve that object.
        folder.documents.append(manifest, manifest.name)

        imports = obj.get('imports')
        if imports:
            for an_import in imports:
                import_obj = ImportPersistence.from_data(ctx, an_import)
                manifest.imports.append(import_obj)

        if not any((import_present.corpus_path == 'cdm:/foundations.cdm.json' for import_present in manifest.imports)):
            manifest.imports.append('cdm:/foundations.cdm.json')

        if obj.get('modifiedTime'):
            manifest.last_file_modified_time = dateutil.parser.parse(obj.get('modifiedTime'))

        if obj.get('lastChildFileModifiedTime'):
            manifest.last_child_file_modified_time = dateutil.parser.parse(obj.get('lastChildFileModifiedTime'))

        if obj.get('lastFileStatusCheckTime'):
            manifest.last_file_status_check_time = dateutil.parser.parse(obj.get('lastFileStatusCheckTime'))

        if obj.get('application'):
            application_trait = ctx.corpus.make_object(CdmObjectType.TRAIT_REF, 'is.managedBy', False)
            arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'application')
            arg.value = obj.application
            application_trait.arguments.append(arg)
            manifest.exhibits_traits.append(application_trait)

        if obj.get('version'):
            version_trait = ctx.corpus.make_object(CdmObjectType.TRAIT_REF, 'is.modelConversion.modelVersion', False)
            arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'version')
            arg.value = obj.version
            version_trait.arguments.append(arg)
            manifest.exhibits_traits.append(version_trait)

        if obj.get('culture'):
            culture_trait = ctx.corpus.make_object(CdmObjectType.TRAIT_REF, 'is.partition.culture', False)
            arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'culture')
            arg.value = obj.culture
            culture_trait.arguments.append(arg)
            manifest.exhibits_traits.append(culture_trait)

        isHidden = obj.get('isHidden')
        if isHidden:
            is_hidden_trait = ctx.corpus.make_object(CdmObjectType.TRAIT_REF, 'is.hidden', True)
            is_hidden_trait.is_from_property = True
            manifest.exhibits_traits.append(is_hidden_trait)

        reference_models = {}
        if obj.get('referenceModels'):
            # Create a trait and put reference models inside an argument that goes inside the trait.
            reference_models_trait = ctx.corpus.make_object(CdmObjectType.TRAIT_REF, 'is.modelConversion.referenceModelMap', False)

            reference_model_arg = ctx.corpus.make_object(CdmObjectType.ARGUMENT_DEF, 'referenceModelMap')
            reference_model_arg.value = obj.referenceModels

            reference_models_trait.arguments.append(reference_model_arg)
            manifest.exhibits_traits.append(reference_models_trait)

            for element in obj.referenceModels:
                reference_models[element.id] = element.location

        entity_schema_by_name = {}
        for element in (obj.entities or []):
            entity = None

            if element.type == 'LocalEntity':
                entity = await LocalEntityDeclarationPersistence.from_data(ctx, folder, element, extension_trait_def_list, manifest)
            elif element.type == 'ReferenceEntity':
                reference_entity = element
                location = reference_models.get(reference_entity.modelId)

                if not location:
                    logger.error(_TAG, ctx, 'Model Id {} from {} not found in reference_models.'.format(reference_entity.modelId, reference_entity.name))
                    return None

                entity = await ReferencedEntityDeclarationPersistence.from_data(ctx, reference_entity, location)
            else:
                logger.error(_TAG, ctx, 'There was an error while trying to parse entity type.')

            if entity:
                manifest.entities.append(entity)
                entity_schema_by_name[entity.entity_name] = entity.entity_path
            else:
                logger.error(_TAG, ctx, 'There was an error while trying to parse entity type.')

        if obj.get('relationships'):
            for relationship in obj.get('relationships'):
                relationship = await RelationshipPersistence.from_data(ctx, relationship, entity_schema_by_name)

                if relationship:
                    manifest.relationships.append(relationship)
                else:
                    logger.warning(_TAG, ctx, 'There was an error while trying to convert model.json local entity to cdm local entity declaration.')

        await utils.process_annotations_from_data(ctx, obj, manifest.exhibits_traits)

        local_extension_trait_def_list = []  # type: List['CdmTraitDefinition']
        extension_helper.process_extension_from_json(ctx, obj, manifest.exhibits_traits, extension_trait_def_list, local_extension_trait_def_list)

        import_docs = await extension_helper.standard_import_detection(ctx, extension_trait_def_list, local_extension_trait_def_list)  # type: List[CdmImport]
        extension_helper.add_import_docs_to_manifest(ctx, import_docs, manifest)

        ManifestPersistence.create_extension_doc_and_add_to_folder_and_imports(ctx, extension_trait_def_list, folder)

        return manifest

    @staticmethod
    async def to_data(instance: 'CdmManifestDefinition', res_opt: 'ResolveOptions', options: 'CopyOptions') -> Optional['Model']:
        result = Model()

        # process_annotations_to_data also processes extensions.
        await utils.process_annotations_to_data(instance.ctx, result, instance.exhibits_traits)

        result.name = instance.manifest_name
        result.description = instance.explanation
        result.modifiedTime = utils.get_formatted_date_string(instance.last_file_modified_time)
        result.lastChildFileModifiedTime = utils.get_formatted_date_string(instance.last_child_file_modified_time)
        result.lastFileStatusCheckTime = utils.get_formatted_date_string(instance.last_file_status_check_time)

        t2pm = TraitToPropertyMap(instance)

        result.isHidden = bool(t2pm.fetch_trait_reference('is.hidden')) or None

        application_trait = t2pm.fetch_trait_reference('is.managedBy')
        if application_trait:
            result.application = application_trait.arguments[0].value

        version_trait = t2pm.fetch_trait_reference('is.modelConversion.modelVersion')
        if version_trait:
            result.version = version_trait.arguments[0].value
        else:
            result.version = '1.0'

        culture_trait = t2pm.fetch_trait_reference('is.partition.culture')
        if culture_trait:
            result.culture = culture_trait.arguments[0].value

        reference_entity_locations = {}
        reference_models = OrderedDict()

        reference_models_trait = t2pm.fetch_trait_reference('is.modelConversion.referenceModelMap')

        if reference_models_trait:
            ref_models = reference_models_trait.arguments[0].value

            for element in ref_models:
                reference_models[element.id] = element.location
                reference_entity_locations[element.location] = element.id

        if instance.entities:
            result.entities = []
            # Schedule processing of each entity to be added to the manifest
            for entity in instance.entities:
                element = None
                if entity.object_type == CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF:
                    element = await LocalEntityDeclarationPersistence.to_data(entity, instance, res_opt, options)
                elif entity.object_type == CdmObjectType.REFERENCED_ENTITY_DECLARATION_DEF:
                    element = await ReferencedEntityDeclarationPersistence.to_data(entity, res_opt, options)

                    location = instance.ctx.corpus.storage.corpus_path_to_adapter_path(entity.entity_path)

                    if not location:
                        logger.error(_TAG, instance.ctx, 'Invalid entity path set in entity {}'.format(entity.entity_name))
                        element = None

                    reference_entity = element  # type: ReferenceEntity
                    if reference_entity:
                        location = location[:location.rfind('/')]

                        if reference_entity.modelId:
                            saved_location = reference_models.get(reference_entity.modelId)
                            if saved_location is not None and saved_location != location:
                                logger.error(_TAG, instance.ctx, 'Same ModelId pointing to different locations')
                                element = None
                            elif saved_location is None:
                                reference_models[reference_entity.modelId] = location
                                reference_entity_locations[location] = reference_entity.modelId
                        elif not reference_entity.modelId and location in reference_entity_locations:
                            reference_entity.modelId = reference_entity_locations[location]
                        else:
                            reference_entity.modelId = str(uuid.uuid4())
                            reference_models[reference_entity.modelId] = location
                            reference_entity_locations[location] = reference_entity.modelId

                if element:
                    result.entities.append(element)
                else:
                    logger.error(_TAG, instance.ctx,
                                 'There was an error while trying to convert {}\'s entity declaration to model json format.'.format(entity.entity_name))

        if reference_models:
            for value, key in reference_models.items():
                model = ReferenceModel()
                model.id = value
                model.location = key
                result.referenceModels.append(model)

        for cdm_relationship in instance.relationships:
            relationship = await RelationshipPersistence.to_data(cdm_relationship, res_opt, options, instance.ctx)

            if relationship:
                result.relationships.append(relationship)
            else:
                logger.error(_TAG, instance.ctx, 'There was an error while trying to convert cdm relationship to model.json relationship.')
                return None

        if instance.imports:
            result.imports = []
            for element in instance.imports:
                import_obj = ImportPersistence.to_data(element, res_opt, options)
                if import_obj:
                    result.imports.append(import_obj)

        return result

    @staticmethod
    def create_extension_doc_and_add_to_folder_and_imports(
            ctx: 'CdmCorpusContext',
            extension_trait_def_list: List['CdmTraitDefinition'],
            folder: 'CdmFolderDefinition'):

        if extension_trait_def_list:
            extension_doc = ctx.corpus.make_object(CdmObjectType.DOCUMENT_DEF, extension_helper.EXTENSION_DOC_NAME)
            # pull out the extension trait definitions into a new custom extension document
            extension_doc.definitions.extend(extension_trait_def_list)

            extension_doc.imports.append('cdm:/extensions/base.extension.cdm.json')

            # add the extension doc to the folder, will wire everything together as needed
            folder.documents.append(extension_doc)
