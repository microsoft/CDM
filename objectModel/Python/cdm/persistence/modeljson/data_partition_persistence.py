# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, List, TYPE_CHECKING
import dateutil.parser

from cdm.enums import CdmObjectType
from cdm.utilities import logger, TraitToPropertyMap

from . import extension_helper, utils
from .types import Partition

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmDataPartitionDefinition, CdmFolderDefinition, CdmTraitDefinition, CdmTraitReference
    from cdm.utilities import CopyOptions, ResolveOptions

    from .types import CsvFormatSettings


class DataPartitionPersistence:
    @staticmethod
    async def from_data(ctx: 'CdmCorpusContext', data: 'Partition', extension_trait_def_list: List['CdmTraitDefinition'],
                        local_extension_trait_def_list: List['CdmTraitDefinition'], document_folder: 'CdmFolderDefinition') \
            -> Optional['CdmDataPartitionDefinition']:
        data_partition = ctx.corpus.make_object(CdmObjectType.DATA_PARTITION_DEF, data.name if data.get('name') else None)
        if data.get('description') and not data.get('description').isspace():
            data_partition.description = data.get('description')
        data_partition.location = ctx.corpus.storage.create_relative_corpus_path(ctx.corpus.storage.adapter_path_to_corpus_path(data.location), document_folder)

        if not data_partition.location:
            logger.warning(DataPartitionPersistence.__name__, ctx,
                           'Couldn\'t find data partition\'s location for partition {}.'.format(data_partition.name), DataPartitionPersistence.from_data.__name__)

        if data.get('refreshTime'):
            data_partition.refresh_time = data.refreshTime

        if data.get('lastFileModifiedTime'):
            data_partition.last_file_modified_time = dateutil.parser.parse(data.get('lastFileModifiedTime'))

        if data.get('lastFileStatusCheckTime'):
            data_partition.last_file_status_check_time = dateutil.parser.parse(data.get('lastFileStatusCheckTime'))

        if data.get('isHidden'):
            is_hidden_trait = ctx.corpus.make_ref(CdmObjectType.TRAIT_REF, 'is.hidden', True)
            is_hidden_trait.is_from_property = True
            data_partition.exhibits_traits.append(is_hidden_trait)

        await utils.process_annotations_from_data(ctx, data, data_partition.exhibits_traits)

        file_format_settings = data.get('fileFormatSettings')

        if file_format_settings and file_format_settings.type == 'CsvFormatSettings':
            csv_format_trait = utils.create_csv_trait(file_format_settings, ctx)

            if csv_format_trait:
                data_partition.exhibits_traits.append(csv_format_trait)
            else:
                logger.error(DataPartitionPersistence.__name__, ctx, 'There was a problem while processing csv format settings inside data partition.')
                return

        extension_helper.process_extension_from_json(ctx, data, data_partition.exhibits_traits, extension_trait_def_list, local_extension_trait_def_list)

        return data_partition

    @staticmethod
    async def to_data(instance: 'CdmDataPartitionDefinition', res_opt: 'ResolveOptions', options: 'CopyOptions') -> Optional['Partition']:
        result = Partition()
        result.name = instance.name
        result.description = instance.description
        result.location = instance.ctx.corpus.storage.corpus_path_to_adapter_path(
            instance.ctx.corpus.storage.create_absolute_corpus_path(instance.location, instance.in_document))
        result.refreshTime = instance.refresh_time
        result.lastFileModifiedTime = utils.get_formatted_date_string(instance.last_file_modified_time)
        result.lastFileStatusCheckTime = utils.get_formatted_date_string(instance.last_file_status_check_time)

        if not result.location:
            logger.warning(DataPartitionPersistence.__name__, instance.ctx,
                           'Couldn\'t find data partition\'s location for partition {}.'.format(result.name), DataPartitionPersistence.to_data.__name__)

        # filter description since it is mapped to a property
        exhibits_traits = filter(lambda t: t.named_reference != 'is.localized.describedAs', instance.exhibits_traits)
        await utils.process_traits_and_annotations_to_data(instance.ctx, result, exhibits_traits)

        t2pm = TraitToPropertyMap(instance)

        is_hidden_trait = t2pm._fetch_trait_reference('is.hidden')
        result.isHidden = bool(is_hidden_trait) or None

        csv_trait = t2pm._fetch_trait_reference('is.partition.format.CSV')
        if csv_trait:
            csv_format_settings = utils.create_csv_format_settings(csv_trait)

            if csv_format_settings:
                result.fileFormatSettings = csv_format_settings
                result.fileFormatSettings.type = 'CsvFormatSettings'
            else:
                logger.error(DataPartitionPersistence.__name__, instance.ctx, 'There was a problem while processing csv format trait inside data partition.')
                return

        return result
