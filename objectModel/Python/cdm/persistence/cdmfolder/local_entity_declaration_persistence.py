# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING, Union, Callable
import dateutil.parser

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmLocalEntityDeclarationDefinition, CdmObject
from cdm.utilities import logger, time_utils, copy_data_utils, Constants
from cdm.enums import CdmLogCode

from . import utils
from .data_partition_persistence import DataPartitionPersistence
from .data_partition_pattern_persistence import DataPartitionPatternPersistence
from .types import LocalEntityDeclaration

if TYPE_CHECKING:
    from cdm.utilities import CopyOptions, ResolveOptions
    from cdm.objectmodel import CdmObject, CdmDataPartitionDefinition, CdmDataPartitionPatternDefinition

_TAG = 'LocalEntityDeclarationPersistence'


class LocalEntityDeclarationPersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, prefix_path: str, data: LocalEntityDeclaration) -> CdmLocalEntityDeclarationDefinition:
        local_entity = ctx.corpus.make_object(CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF, data.entityName)
        local_entity.explanation = data.get('explanation')

        entity_path = data.get('entityPath') or data.get('entitySchema')

        if entity_path is None:
            logger.error(ctx, LocalEntityDeclarationPersistence.__name__, LocalEntityDeclarationPersistence.from_data.__name__, None, CdmLogCode.ERR_PERSIST_ENTITY_PATH_NOT_FOUND, data.get('entityName'))

        local_entity.entity_path = entity_path

        if data.get('lastFileStatusCheckTime'):
            local_entity.last_file_status_check_time = dateutil.parser.parse(data.lastFileStatusCheckTime)

        if data.get('lastFileModifiedTime'):
            local_entity.last_file_modified_time = dateutil.parser.parse(data.lastFileModifiedTime)

        if data.get('lastChildFileModifiedTime'):
            local_entity.last_child_file_modified_time = dateutil.parser.parse(data.lastChildFileModifiedTime)

        utils.add_list_to_cdm_collection(local_entity.exhibits_traits,
                                         utils.create_trait_reference_array(ctx, data.exhibitsTraits))

        if data.get('dataPartitions'):
            for data_partition in data.dataPartitions:
                data_partition_def = DataPartitionPersistence.from_data(ctx, data_partition)
                if data_partition_def.is_incremental:
                    LocalEntityDeclarationPersistence._error_message(ctx, LocalEntityDeclarationPersistence.from_data.__name__, None, data_partition_def, True)
                else:
                    local_entity.data_partitions.append(data_partition_def)

        if data.get('dataPartitionPatterns'):
            for pattern in data.dataPartitionPatterns:
                data_partition_pattern_def = DataPartitionPatternPersistence.from_data(ctx, pattern)
                if data_partition_pattern_def.is_incremental:
                    LocalEntityDeclarationPersistence._error_message(ctx, LocalEntityDeclarationPersistence.from_data.__name__, None, data_partition_pattern_def, True)
                else:
                    local_entity.data_partition_patterns.append(data_partition_pattern_def)

        if data.get('incrementalPartitions'):
            for incremental_partition in data.incrementalPartitions:
                incremental_partition_def = DataPartitionPersistence.from_data(ctx, incremental_partition)
                if not incremental_partition_def.is_incremental:
                    LocalEntityDeclarationPersistence._error_message(ctx, LocalEntityDeclarationPersistence.from_data.__name__, None, incremental_partition_def, False)
                else:
                    local_entity.incremental_partitions.append(incremental_partition_def)

        if data.get('incrementalPartitionPatterns'):
            for incremental_partition_pattern in data.incrementalPartitionPatterns:
                incremental_partition_pattern_def = DataPartitionPatternPersistence.from_data(ctx, incremental_partition_pattern)
                if not incremental_partition_pattern_def.is_incremental:
                    LocalEntityDeclarationPersistence._error_message(ctx, LocalEntityDeclarationPersistence.from_data.__name__, None, incremental_partition_pattern_def, False)
                else:
                    local_entity.incremental_partition_patterns.append(incremental_partition_pattern_def)

        return local_entity

    @staticmethod
    def to_data(instance: CdmLocalEntityDeclarationDefinition, res_opt: 'ResolveOptions', options: 'CopyOptions'):
        local_entity = LocalEntityDeclaration()

        local_entity.entityName = instance.entity_name
        local_entity.explanation = instance.explanation
        local_entity.entityPath = instance.entity_path
        local_entity.lastFileStatusCheckTime = time_utils._get_formatted_date_string(instance.last_file_status_check_time)
        local_entity.lastFileModifiedTime = time_utils._get_formatted_date_string(instance.last_file_modified_time)
        local_entity.lastChildFileModifiedTime = time_utils._get_formatted_date_string(instance.last_child_file_modified_time)
        local_entity.exhibitsTraits = copy_data_utils._array_copy_data(res_opt, instance.exhibits_traits, options)
        local_entity.dataPartitions = copy_data_utils._array_copy_data(res_opt, instance.data_partitions, options, LocalEntityDeclarationPersistence.ensure_non_incremental(instance))
        local_entity.dataPartitionPatterns = copy_data_utils._array_copy_data(res_opt, instance.data_partition_patterns, options, LocalEntityDeclarationPersistence.ensure_non_incremental(instance))
        local_entity.incrementalPartitions = copy_data_utils._array_copy_data(res_opt, instance.incremental_partitions, options, LocalEntityDeclarationPersistence.ensure_incremental(instance))
        local_entity.incrementalPartitionPatterns = copy_data_utils._array_copy_data(res_opt, instance.incremental_partition_patterns, options, LocalEntityDeclarationPersistence.ensure_incremental(instance))

        return local_entity

    @staticmethod
    def _error_message(ctx: 'CdmCorpusContext', method_name: str, corpus_path: 'str', obj: Union['CdmDataPartitionDefinition', 'CdmDataPartitionPatternDefinition'], is_incremental: bool) -> None:
       from cdm.objectmodel import CdmDataPartitionDefinition

       property_name = (CdmLocalEntityDeclarationDefinition.data_partitions.fget.__name__ if is_incremental else CdmLocalEntityDeclarationDefinition.incremental_partitions.fget.__name__) \
                                    if isinstance(obj, CdmDataPartitionDefinition) else \
                        (CdmLocalEntityDeclarationDefinition.data_partition_patterns.fget.__name__ if is_incremental else CdmLocalEntityDeclarationDefinition.incremental_partition_patterns.fget.__name__)
       if is_incremental:
            logger.error(ctx, _TAG, method_name, corpus_path, CdmLogCode.ERR_PERSIST_INCREMENTAL_CONVERSION_ERROR, obj.name, Constants._INCREMENTAL_TRAIT_NAME, property_name)
       else:
           logger.error(ctx, _TAG, method_name, corpus_path, CdmLogCode.ERR_PERSIST_NON_INCREMENTAL_CONVERSION_ERROR, obj.name, Constants._INCREMENTAL_TRAIT_NAME, property_name)

    @staticmethod
    def ensure_non_incremental(instance: 'CdmLocalEntityDeclarationDefinition') -> Callable[['CdmObject'], bool]:
        def compare(obj: CdmObject) -> bool:
            from cdm.objectmodel import CdmDataPartitionDefinition, CdmDataPartitionPatternDefinition
            if (isinstance(obj, CdmDataPartitionDefinition) or isinstance(obj,
                                                                          CdmDataPartitionPatternDefinition)) and obj.is_incremental:
                LocalEntityDeclarationPersistence._error_message(instance.ctx,
                                                                 LocalEntityDeclarationPersistence.to_data.__name__,
                                                                 instance.at_corpus_path, obj, True)
                return False
            return True
        return compare

    def ensure_incremental(instance: 'CdmLocalEntityDeclarationDefinition') -> Callable[['CdmObject'], bool]:
        def compare(obj: CdmObject) -> bool:
            from cdm.objectmodel import CdmDataPartitionDefinition, CdmDataPartitionPatternDefinition
            if (isinstance(obj, CdmDataPartitionDefinition) or isinstance(obj,
                                                                          CdmDataPartitionPatternDefinition)) and not obj.is_incremental:
                LocalEntityDeclarationPersistence._error_message(instance.ctx,
                                                                 LocalEntityDeclarationPersistence.to_data.__name__,
                                                                 instance.at_corpus_path, obj, False)
                return False
            return True
        return compare