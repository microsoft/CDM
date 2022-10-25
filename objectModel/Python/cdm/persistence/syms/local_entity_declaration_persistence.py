# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING
import dateutil.parser
from itertools import takewhile
from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmLocalEntityDeclarationDefinition, CdmManifestDefinition
from cdm.utilities import CopyOptions, ResolveOptions, StorageUtils, TraitToPropertyMap, copy_data_utils, logger
from cdm.enums import CdmLogCode

from . import utils
from cdm.persistence.syms.models import DataSource, TableEntity, TableProperties
from cdm.persistence.syms.data_partition_persistence import DataPartitionPersistence
from cdm.persistence.syms.data_partition_pattern_persistence import DataPartitionPatternPersistence
from cdm.persistence.syms import DocumentPersistence
import os

_TAG = 'LocalEntityDeclarationPersistence'
class LocalEntityDeclarationPersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, table: TableEntity,
                  manifest: CdmManifestDefinition, syms_root_path: str) -> CdmLocalEntityDeclarationDefinition:
        table_name = str(table.name)
        local_dec = ctx.corpus.make_object(CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF, table_name)
        local_dec.entity_path = ctx.corpus.storage.create_relative_corpus_path(table_name + '.cdm.json/' + table_name, manifest)

        table_properties = TableProperties(None, None, None).deserialize(table.properties)
        properties = table_properties.properties

        if properties is not None:
            if 'cdm:isHidden' in properties:
                is_hidden_trait = ctx.corpus.make_ref(CdmObjectType.TRAIT_REF, 'is.hidden', True)
                is_hidden_trait.is_from_property = True
                local_dec.exhibits_traits.append(is_hidden_trait)
            if 'cdm:lastChildFileModifiedTime' in properties:
                local_dec.last_child_file_modified_time = dateutil.parser.parse(properties['cdm:lastChildFileModifiedTime'])
            if 'cdm:lastFileModifiedTime' in properties:
                local_dec.last_file_modified_time = dateutil.parser.parse(properties['cdm:lastFileModifiedTime'])
            if 'cdm:lastFileStatusCheckTime' in properties:
                local_dec.last_file_status_check_time = dateutil.parser.parse(properties['cdm:lastFileStatusCheckTime'])
            if 'cdm:explanation' in properties:
                local_dec.explanation = properties['cdm:explanation']
            if 'cdm:entityDecTraits' in properties:
                utils.add_list_to_cdm_collection(local_dec.exhibits_traits, utils.create_trait_reference_array(ctx, properties['cdm:entityDecTraits']))

        format_type = table_properties.storage_descriptor.format.format_type.lower() if table_properties.storage_descriptor and table_properties.storage_descriptor.format else None
        if format_type != utils.csv and format_type != utils.parquet:
            logger.error(ctx, _TAG, LocalEntityDeclarationPersistence.from_data.__name__, local_dec.at_corpus_path, CdmLogCode.ERR_PERSIST_SYMS_TABLE_FORMAT_TYPE_NOT_SUPPORTED, table_name)
            return None

        if table_properties.storage_descriptor.source.location == '':
            logger.error(ctx, _TAG, LocalEntityDeclarationPersistence.from_data.__name__, local_dec.at_corpus_path, CdmLogCode.ERR_PERSIST_SYMS_TABLE_MISSING_DATA_LOCATION, table_name)
            return None

        # check and get list of wildcards matches in path if any.
        syms_table_path = utils.create_syms_absolute_path(syms_root_path, table_properties.storage_descriptor.source.location)
        corpus_path = utils.syms_path_to_corpus_path(syms_table_path, ctx.corpus.storage)
        matches = utils.get_wildcards_matches(corpus_path)

        if os.path.splitext(table_properties.storage_descriptor.source.location)[1] == '' or matches is not None:
            data_partition_pattern = DataPartitionPatternPersistence.from_data(ctx, table_properties.storage_descriptor, table.name + 'PartitionPattern',  syms_root_path, format_type, matches)
            local_dec.data_partition_patterns.append(data_partition_pattern)
        elif table_properties.storage_descriptor.source.location.lower().endswith('.csv'):
            if format_type == utils.parquet:
                logger.error(ctx, _TAG, LocalEntityDeclarationPersistence.from_data.__name__, local_dec.at_corpus_path, CdmLogCode.ERR_PERSIST_SYMS_INCOMPATIBLE_FILE_TO_TYPE, 'csv', format_type)
                return None
            # location points to file.create data partition.
            data_partition = DataPartitionPersistence.from_data(ctx, table_properties.storage_descriptor, syms_root_path, format_type)
            local_dec.data_partitions.append(data_partition)
        elif table_properties.storage_descriptor.source.location.lower().endswith('.parquet'):
            if format_type == utils.csv:
                logger.error(ctx, _TAG, LocalEntityDeclarationPersistence.from_data.__name__, local_dec.at_corpus_pathCdmLogCode.ERR_PERSIST_SYMS_INCOMPATIBLE_FILE_TO_TYPE, 'parquet', format_type)
                return None
            #Location points to file. Create data partition.
            data_partition = DataPartitionPersistence.from_data(ctx, table_properties.storage_descriptor,
                                                                    syms_root_path, format_type)
            local_dec.data_partitions.append(data_partition)
        else:
            # restore data partition pattern if exist
            if properties is not None and 'cdm:data_partition_patterns' in properties:
                data_partition_pattern = DataPartitionPatternPersistence.from_data(ctx, properties['cdm:data_partition_patterns'], table.name + 'PartitionPattern',  syms_root_path, format_type)
                local_dec.data_partition_patterns.append(data_partition_pattern)
            else:
                logger.error(ctx, _TAG, LocalEntityDeclarationPersistence.from_data.__name__, local_dec.at_corpus_path, CdmLogCode.ERR_PERSIST_SYMS_TABLE_INVALID_DATA_LOCATION, table_name)
                return None

        return local_dec


    @staticmethod
    async def to_data_async(instance: CdmLocalEntityDeclarationDefinition, manifest: CdmManifestDefinition, syms_root_path: str, res_opt: 'ResolveOptions', options: 'CopyOptions') -> TableEntity:
        table_entity = await DocumentPersistence.to_data_async(instance.entity_path, manifest, instance.ctx, res_opt,
                                                                options)
        if table_entity is not None:
            te_properties = table_entity.properties
            properties = LocalEntityDeclarationPersistence.create_table_propertybags(instance, res_opt, options, te_properties.properties)
            if instance.data_partitions is not None and len(instance.data_partitions) > 0:
                paths = []
                for element in instance.data_partitions:
                    if element.location is not None:
                        adls_path = instance.ctx.corpus.storage.corpus_path_to_adapter_path(element.location)
                        location = element.location
                        if adls_path == None:
                            logger.error(instance.ctx, _TAG, 'to_data_async', instance.at_corpus_path, CdmLogCode.ERR_PERSIST_SYMS_ADLS_ADAPTER_MISSING, element.location)
                            return None
                        syms_path = utils.adls_adapter_path_to_syms_path(adls_path)

                        if syms_path is not None:
                            location = syms_path
                        else:
                            path_tuple = StorageUtils.split_namespace_path(element.location)
                            location = utils.create_syms_absolute_path(syms_root_path, path_tuple[1])
                        paths.append(location)

                    te_properties.storage_descriptor = DataPartitionPersistence.to_data(element, te_properties.storage_descriptor,
                                                                             res_opt, options)
                # Logic to find common root folder.
                source = DataSource(''.join(c[0] for c in takewhile(lambda x:all(x[0] == y for y in x), zip(*paths))))
                te_properties.storage_descriptor.source = source
            else:
                # location and format is mandatory for syms.
                source = DataSource(utils.create_syms_absolute_path(syms_root_path, instance.entity_name))
                te_properties.storage_descriptor.source = source
            te_properties.properties = properties

        return table_entity


    @staticmethod
    def create_table_propertybags(instance: CdmLocalEntityDeclarationDefinition, res_opt: ResolveOptions, options: CopyOptions, properties):
        if properties == None:
            properties = {}

        if instance.entity_path is not None:
            path_tuple = StorageUtils.split_namespace_path(instance.entity_path)
            if path_tuple == None:
                logger.error(instance.ctx, _TAG, LocalEntityDeclarationPersistence.create_table_propertybags.__name__, instance.at_corpus_path, CdmLogCode.ERR_PERSIST_SYMS_ENTITY_PATH_NULL, instance.entity_name)
                return None
            properties['cdm:entityPath'] = path_tuple[1]

        t2pm = TraitToPropertyMap(instance)
        is_hidden_trait = t2pm._fetch_trait_reference('is.hidden')

        if not 'cdm:description' in properties:
            properties['cdm:description'] = instance.explanation

        if instance.last_child_file_modified_time is not None:
            properties['cdm:lastChildFileModifiedTime'] = instance.last_child_file_modified_time

        if instance.last_file_modified_time is not None:
            properties['cdm:lastFileModifiedTime'] = instance.last_file_modified_time

        if instance.last_file_status_check_time is not None:
            properties['cdm:lastFileStatusCheckTime'] = instance.last_file_status_check_time

        if is_hidden_trait is not None:
            properties['cdm:isHidden'] = True

        if instance.exhibits_traits is not None and len(instance.exhibits_traits) > 0:
            properties['cdm:entityDecTraits'] = copy_data_utils._array_copy_data(res_opt, instance.exhibits_traits, options)
           
        return properties
