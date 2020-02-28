# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List, TYPE_CHECKING
import dateutil.parser

from cdm.enums import CdmObjectType
from cdm.utilities import logger, TraitToPropertyMap

from . import extension_helper, utils
from .data_partition_persistence import DataPartitionPersistence
from .document_persistence import DocumentPersistence


if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmFolderDefinition, CdmLocalEntityDeclarationDefinition, CdmTraitDefinition
    from cdm.utilities import CopyOptions, ResolveOptions


_TAG = 'LocalEntityDeclarationPersistence'


class LocalEntityDeclarationPersistence:
    @staticmethod
    async def from_data(ctx: 'CdmCorpusContext', document_folder: 'CdmFolderDefinition', data: 'LocalEntity',
                        extension_trait_def_list: List['CdmTraitDefinition'], manifest: 'CdmManifestDefinition') -> 'CdmLocalEntityDeclarationDefinition':
        local_entity_dec = ctx.corpus.make_object(CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF, data.name)

        local_extension_trait_def_list = []  # type: List[CdmTraitDefinition]
        entity_doc = await DocumentPersistence.from_data(ctx, data, extension_trait_def_list, local_extension_trait_def_list)

        if not entity_doc:
            logger.error(_TAG, ctx, 'There was an error while trying to fetch the entity doc from local entity declaration persistence.')
            return None

        document_folder.documents.append(entity_doc)

        # Entity schema path is the path to the doc containing the entity definition.
        local_entity_dec.entity_path = ctx.corpus.storage.create_relative_corpus_path('{}/{}'.format(entity_doc.at_corpus_path, data.name), manifest)

        local_entity_dec.explanation = data.get('description')

        if data.get('lastFileStatusCheckTime'):
            local_entity_dec.last_file_status_check_time = dateutil.parser.parse(data.get('lastFileStatusCheckTime'))

        if data.get('lastFileModifiedTime'):
            local_entity_dec.last_file_modified_time = dateutil.parser.parse(data.get('lastFileModifiedTime'))

        if data.get('lastChildFileModifiedTime'):
            local_entity_dec.last_child_file_modified_time = dateutil.parser.parse(data.get('lastChildFileModifiedTime'))

        if data.get('isHidden'):
            is_hidden_trait = ctx.corpus.make_object(CdmObjectType.TRAIT_REF, 'is.hidden', True)
            local_entity_dec.exhibits_traits.append(is_hidden_trait)

        # Add traits for schema entity info.
        if data.get('schemas'):
            t2pm = TraitToPropertyMap(local_entity_dec)
            t2pm._update_property_value('cdmSchemas', data.get('schemas'))

        # Data partitions are part of the local entity, add them here.
        for element in (data.get('partitions') or []):
            data_partition = await DataPartitionPersistence.from_data(ctx, element, extension_trait_def_list, local_extension_trait_def_list, document_folder)
            if data_partition is not None:
                local_entity_dec.data_partitions.append(data_partition)
            else:
                logger.error(_TAG, ctx, 'There was an error while trying to convert model.json partition to cdm local data partition.')
                return None

        import_docs = await extension_helper.standard_import_detection(ctx, extension_trait_def_list, local_extension_trait_def_list)  # type: List[CdmImport]
        extension_helper.add_import_docs_to_manifest(ctx, import_docs, entity_doc)

        return local_entity_dec

    @staticmethod
    async def to_data(instance: 'CdmLocalEntityDeclarationDefinition', manifest: 'CdmManifestDefinition', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'LocalEntity':
        # Fetch the document from entity schema.
        entity = await DocumentPersistence.to_data(instance.entity_path, manifest, res_opt, options, instance.ctx)

        if not entity:
            return None

        entity.description = instance.explanation
        entity.lastFileStatusCheckTime = utils.get_formatted_date_string(instance.last_file_status_check_time)
        entity.lastFileModifiedTime = utils.get_formatted_date_string(instance.last_file_modified_time)
        entity.lastChildFileModifiedTime = utils.get_formatted_date_string(instance.last_child_file_modified_time)

        t2pm = TraitToPropertyMap(instance)

        # Find the trait containing the schema info.
        schemas = t2pm._fetch_property_value('cdmSchemas')
        if schemas:
            entity.schemas = schemas

        entity.isHidden = bool(t2pm._fetch_trait_reference('is.hidden')) or None

        if instance.data_partitions:
            entity.partitions = []
            for partition in instance.data_partitions:
                partiton = await DataPartitionPersistence.to_data(partition, res_opt, options)
                if partition:
                    entity.partitions.append(partiton)
                else:
                    logger.error(_TAG, instance.ctx, 'There was an error while trying to convert cdm data partition to model.json partition.')
                    return None

        return entity
