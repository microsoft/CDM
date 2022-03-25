# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING
import dateutil.parser

from cdm.enums import CdmObjectType, CdmLogCode
from cdm.objectmodel import CdmDataPartitionDefinition
from cdm.utilities import time_utils, copy_data_utils, TraitToPropertyMap, logger

from . import utils
from cdm.persistence.syms.models import FormatInfo, SerializeLib, StorageDescriptor, FormatType


if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext
    from cdm.utilities import CopyOptions, ResolveOptions

_TAG = 'DataPartitionPersistence'

class DataPartitionPersistence:
    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', obj: StorageDescriptor, syms_root_path: str, format_type: FormatType) -> CdmDataPartitionDefinition:
        new_partition = ctx.corpus.make_object(CdmObjectType.DATA_PARTITION_DEF)  # type: CdmDataPartitionDefinition
        syms_path = utils.create_syms_absolute_path(syms_root_path, obj.source.location)
        new_partition.location = utils.syms_path_to_corpus_path(syms_path, ctx.corpus.storage)

        trait = utils.create_partition_trait(obj.format.properties, ctx, format_type)
        if trait is not None:
            new_partition.exhibits_traits.append(trait)
        else:
            logger.error(ctx, _TAG, DataPartitionPersistence.from_data.__name__, None, CdmLogCode.ERR_PERSIST_SYMS_UNSUPPORTED_TABLE_FORMAT)
            return None

        properties = obj.properties
        if properties is not None:
            if 'cdm:name' in properties:
                new_partition.name = properties['cdm:name']
            if 'cdm:lastFileStatusCheckTime' in properties:
                new_partition.last_file_status_check_time = dateutil.parser.parse(properties['cdm:lastFileStatusCheckTime'])
            if 'cdm:lastFileModifiedTime' in properties:
                new_partition.last_file_modified_time = dateutil.parser.parse(properties['cdm:lastFileModifiedTime'])
            if 'cdm:traits' in properties:
                utils.add_list_to_cdm_collection(new_partition.exhibits_traits, utils.create_trait_reference_array(ctx, properties['cdm:traits']))

        return new_partition

    @staticmethod
    def to_data(instance: 'CdmDataPartitionDefinition', obj: 'StorageDescriptor', res_opt: 'ResolveOptions',
                options: 'CopyOptions') -> 'StorageDescriptor':
        obj.properties = {}

        if instance.name is not None:
            obj.properties['cdm:name'] = instance.name
        if instance.last_file_status_check_time is not None:
            obj.properties['cdm:lastFileStatusCheckTime'] = time_utils._get_formatted_date_string(instance.last_file_status_check_time)
        if instance.last_file_modified_time is not None:
            obj.properties['cdm:lastFileModifiedTime'] = time_utils._get_formatted_date_string(instance.last_file_modified_time)
        if instance.exhibits_traits is not None:
            tpm = TraitToPropertyMap(instance)
            csv_trait = tpm._fetch_trait_reference('is.partition.format.CSV')
            if csv_trait is not None:
                instance.exhibits_traits.remove('is.partition.format.CSV')
            if len(instance.exhibits_traits) > 0:
                obj.properties['cdm:traits'] = copy_data_utils._array_copy_data(res_opt, instance.exhibits_traits, options)
            if csv_trait is not None:
                instance.exhibits_traits.append(csv_trait)

        properties = DataPartitionPersistence.fill_property_bag_from_csv_trait(instance)

        if properties is not None:
            obj.format = FormatInfo(
            input_format = 'OrgapachehadoopmapredSequenceFileInputFormat',
            output_format = 'OrgapachehadoophiveqlioHiveSequenceFileOutputFormat',
            serialize_lib = SerializeLib.orgapachehadoophiveserde2lazy_lazy_simple_ser_de,
            format_type = FormatType.csv,
            properties = properties)
        else:
            #error
            return None

        return obj

    @staticmethod
    def fill_property_bag_from_csv_trait(instance: 'CdmDataPartitionDefinition', properties = None):
        tpm = TraitToPropertyMap(instance)
        csv_trait = tpm._fetch_trait_reference('is.partition.format.CSV')
        if csv_trait is not None:
            if properties == None:
                properties = {}
                for csv_trait_arg in csv_trait.arguments:
                    key = None
                    # map to syms define properties
                    if csv_trait_arg.name == 'columnHeaders':
                        key = 'header'
                    elif csv_trait_arg.name == 'delimiter':
                        key = 'field.delim'
                    else:
                        key = csv_trait_arg.value
                    properties[key] = csv_trait_arg.value
        return properties