from typing import List, Optional, TYPE_CHECKING
import uuid
import dateutil.parser

from cdm.enums import CdmObjectType
from cdm.persistence.cdmfolder import ImportPersistence
from cdm.utilities import TraitToPropertyMap

from . import extension_helper, utils
from .types import Model, ReferenceModel
from .local_entity_declaration_persistence import LocalEntityDeclarationPersistence
from .referenced_entity_declaration_persistence import ReferencedEntityDeclarationPersistence
from .relationship_persistence import RelationshipPersistence

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmDocumentDefinition, CdmFolderDefinition, CdmManifestDefinition, CdmImport, CdmTraitDefinition
    from cdm.utilities import CopyOptions, ResolveOptions


class ManifestPersistence:
    @staticmethod
    async def from_data(ctx: 'CdmCorpusContext', obj: 'Model', folder: 'CdmFolderDefinition') -> Optional['CdmManifestDefinition']:
        extension_trait_def_list = []
        extension_doc = ctx.corpus.make_object(
            CdmObjectType.DOCUMENT_DEF,
            '{}.extension.cdm.json'.format(folder.name or folder.namespace))

        manifest = ctx.corpus.make_object(CdmObjectType.MANIFEST_DEF, obj.name)

        # We need to set up folder path and namespace of a manifest to be able to retrieve that object.
        manifest.folder_path = folder.folder_path
        manifest.namespace = folder.namespace
        manifest.explanation = obj.description

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
            version_trait = ctx.corpus.make_object(CdmObjectType.TRAIT_REF, 'means.measurement.version', False)
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
                entity = await LocalEntityDeclarationPersistence.from_data(ctx, folder, element, extension_trait_def_list)
            elif element.type == 'ReferenceEntity':
                reference_entity = element
                location = reference_models.get(reference_entity.modelId)

                if not location:
                    ctx.logger.error('Model Id %s from %s not found in reference_models.', reference_entity.modelId, reference_entity.name)
                    return

                entity = await ReferencedEntityDeclarationPersistence.from_data(ctx, reference_entity, location, extension_trait_def_list)
            else:
                ctx.logger.error('There was an error while trying to parse entity type.')
                return

            if entity:
                # make path relative for entities created here
                entity.entity_path = ctx.corpus.storage.create_relative_corpus_path(entity.entity_path, manifest)
                manifest.entities.append(entity)
                entity_schema_by_name[entity.entity_name] = entity.entity_path
            else:
                ctx.logger.error('There was an error while trying to parse entity type.')
                return

        if obj.get('relationships'):
            for relationship in obj.get('relationships'):
                relationship = await RelationshipPersistence.from_data(ctx, relationship, entity_schema_by_name)

                if relationship:
                    manifest.relationships.append(relationship)
                else:
                    ctx.logger.error('There was an error while trying to convert model.json local entity to cdm local entity declaration.')
                    return None

        imports = obj.get('imports')
        if imports:
            for an_import in imports:
                import_obj = ImportPersistence.from_data(ctx, an_import)
                manifest.imports.append(import_obj)

        await utils.process_annotations_from_data(ctx, obj, manifest.exhibits_traits)
        await extension_helper.process_extension_from_json(ctx, obj, manifest.exhibits_traits, extension_trait_def_list)

        import_docs = await extension_helper.standard_import_detection(ctx, extension_trait_def_list)  # type: List[CdmImport]
        ManifestPersistence.create_extension_doc_and_add_to_folder_and_imports(ctx, extension_doc, extension_trait_def_list, folder, import_docs)
        await ManifestPersistence.add_import_docs_to_manifest(ctx, import_docs, manifest)

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

        version_trait = t2pm.fetch_trait_reference('means.measurement.version')
        if version_trait:
            result.version = version_trait.arguments[0].value
        else:
            result.version = '1.0'

        culture_trait = t2pm.fetch_trait_reference('is.partition.culture')
        if culture_trait:
            result.culture = culture_trait.arguments[0].value

        reference_entity_locations = {}
        reference_models = {}

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
                    element = await LocalEntityDeclarationPersistence.to_data(entity, res_opt, options, instance.ctx)
                elif entity.object_type == CdmObjectType.REFERENCED_ENTITY_DECLARATION_DEF:
                    element = await ReferencedEntityDeclarationPersistence.to_data(entity, res_opt, options)

                    reference_entity = element
                    location = instance.ctx.corpus.storage.corpus_path_to_adapter_path(entity.entity_path)
                    entity_index = location.rfind('/')
                    location = location[:entity_index]

                    if reference_entity.modelId:
                        if reference_entity.modelId not in reference_models:
                            reference_models[reference_entity.modelId] = location
                            reference_entity_locations[location] = reference_entity.modelId
                    elif location in reference_entity_locations:
                        reference_entity.modelId = reference_entity_locations[location]
                    else:
                        reference_entity.modelId = str(uuid.uuid4())
                        reference_models[reference_entity.modelId] = location
                        reference_entity_locations[location] = reference_entity.modelId

                if element:
                    result.entities.append(element)
                else:
                    instance.ctx.logger.error('There was an error while trying to convert entity declaration to model json format.')

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
                instance.ctx.logger.error('There was an error while trying to convert cdm relationship to model.json relationship.')
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
            extension_doc: 'CdmDocumentDefinition',
            extension_trait_def_list: List['CdmTraitDefinition'],
            folder: 'CdmFolderDefinition',
            import_docs: List['CdmImport']):

        if extension_trait_def_list:
            extension_doc.definitions.extend(extension_trait_def_list)
            extension_doc.folder = folder

            base_extension_import = ctx.corpus.make_object(CdmObjectType.IMPORT)
            base_extension_import.corpus_path = 'cdm:/extensions/base.extension.cdm.json'
            extension_doc.imports.append(base_extension_import)

            extension_doc.json_schema_semantic_version = '0.9.0'  # TODO: Hard-coded everywhere??
            extension_doc.folder_path = folder.folder_path
            extension_doc.namespace = folder.namespace
            folder.documents.append(extension_doc)

            extension_import = ctx.corpus.make_object(CdmObjectType.IMPORT)
            extension_import.corpus_path = ctx.corpus.storage.create_relative_corpus_path(extension_doc.at_corpus_path, extension_doc)
            import_docs.append(extension_import)

    @staticmethod
    async def add_import_docs_to_manifest(ctx: 'CdmCorpusContext', import_docs: List['CdmImport'], manifest: 'CdmManifestDefinition'):
        for import_doc in import_docs:
            for entity_def in manifest.entities:
                if entity_def.object_type == CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF:
                    entity_path = entity_def.entity_path
                    doc_path = entity_path[:entity_path.rfind('/')]
                    cdm_document = await ctx.corpus.fetch_object_async(doc_path)

                    if not list(filter(lambda import_present: import_present.corpus_path == import_doc.corpus_path, cdm_document.imports)):
                        cdm_document.imports.append(import_doc)

            if not list(filter(lambda importPresent: importPresent.corpus_path == import_doc.corpus_path, manifest.imports)):
                manifest.imports.append(import_doc)
