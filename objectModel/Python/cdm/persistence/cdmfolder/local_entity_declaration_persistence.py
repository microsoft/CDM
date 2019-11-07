from typing import TYPE_CHECKING
import dateutil.parser

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmLocalEntityDeclarationDefinition
from cdm.utilities import time_utils

from . import utils
from .data_partition_persistence import DataPartitionPersistence
from .data_partition_pattern_persistence import DataPartitionPatternPersistence
from .types import LocalEntityDeclaration


if TYPE_CHECKING:
    from cdm.utilities import CopyOptions, ResolveOptions


class LocalEntityDeclarationPersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, prefix_path: str, data: LocalEntityDeclaration) -> CdmLocalEntityDeclarationDefinition:
        local_entity = ctx.corpus.make_object(CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF, data.entityName)
        local_entity.explanation = data.get('explanation')

        entity_path = data.get('entitySchema') or data.get('entityPath')

        if entity_path.find(':') == -1:
            local_entity.entity_path = '{}{}'.format(prefix_path, entity_path[1:] if entity_path.startswith('/') else entity_path)
        else:
            local_entity.entity_path = entity_path

        if data.get('lastFileStatusCheckTime'):
            local_entity.last_file_status_check_time = dateutil.parser.parse(data.lastFileStatusCheckTime)

        if data.get('lastFileModifiedTime'):
            local_entity.last_file_modified_time = dateutil.parser.parse(data.lastFileModifiedTime)

        if data.get('lastChildFileModifiedTime'):
            local_entity.last_child_file_modified_time = dateutil.parser.parse(data.lastChildFileModifiedTime)

        if data.get('exhibitsTraits'):
            exhibits_traits = utils.create_trait_reference_array(ctx, data.exhibitsTraits)
            local_entity.exhibits_traits.extend(exhibits_traits)

        if data.get('dataPartitions'):
            for data_partition in data.dataPartitions:
                local_entity.data_partitions.append(DataPartitionPersistence.from_data(ctx, data_partition))

        if data.get('dataPartitionPatterns'):
            for pattern in data.dataPartitionPatterns:
                local_entity.data_partition_patterns.append(DataPartitionPatternPersistence.from_data(ctx, pattern))

        return local_entity

    @staticmethod
    def to_data(instance: CdmLocalEntityDeclarationDefinition, res_opt: 'ResolveOptions', options: 'CopyOptions'):
        local_entity = LocalEntityDeclaration()

        local_entity.entityName = instance.entity_name
        local_entity.explanation = instance.explanation
        local_entity.entityPath = instance.entity_path
        local_entity.lastFileStatusCheckTime = time_utils.get_formatted_date_string(instance.last_file_status_check_time)
        local_entity.lastFileModifiedTime = time_utils.get_formatted_date_string(instance.last_file_modified_time)
        local_entity.lastChildFileModifiedTime = time_utils.get_formatted_date_string(instance.last_child_file_modified_time)
        local_entity.exhibitsTraits = utils.array_copy_data(res_opt, instance.exhibits_traits, options)
        local_entity.dataPartitions = utils.array_copy_data(res_opt, instance.data_partitions, options)
        local_entity.dataPartitionPatterns = utils.array_copy_data(res_opt, instance.data_partition_patterns, options)

        return local_entity
