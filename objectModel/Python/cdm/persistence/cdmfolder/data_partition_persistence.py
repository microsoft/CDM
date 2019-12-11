from typing import TYPE_CHECKING
import dateutil.parser

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmDataPartitionDefinition
from cdm.utilities import time_utils

from . import utils
from .types import DataPartition


if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext
    from cdm.utilities import CopyOptions, ResolveOptions


class DataPartitionPersistence:
    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', data: DataPartition) -> CdmDataPartitionDefinition:
        data_partition = ctx.corpus.make_object(CdmObjectType.DATA_PARTITION_DEF, data.get('name'))  # type: CdmDataPartitionDefinition
        data_partition.location = data.get('location')

        if data.get('specializedSchema'):
            data_partition.specialized_schema = data.specializedSchema

        if data.get('lastFileStatusCheckTime'):
            data_partition.last_file_status_check_time = dateutil.parser.parse(data.lastFileStatusCheckTime)

        if data.get('lastFileModifiedTime'):
            data_partition.last_file_modified_time = dateutil.parser.parse(data.lastFileModifiedTime)

        if data.get('exhibitsTraits'):
            exhibits_traits = utils.create_trait_reference_array(ctx, data.exhibitsTraits)
            data_partition.exhibits_traits.extend(exhibits_traits)

        if data.get('arguments'):
            for argument in data.arguments:
                key = None
                value = None

                if len(argument) == 1:
                    key, value = list(argument.items())[0]
                else:
                    key = argument.get('key') or argument.get('name')
                    value = argument.get('value')

                if key is None or value is None:
                    ctx.logger.warning('invalid set of arguments provided for data partition corresponding to location: %s', data.location)
                    continue

                if key in data_partition.arguments:
                    data_partition.arguments[key].append(value)
                else:
                    data_partition.arguments[key] = [value]

        return data_partition

    @staticmethod
    def to_data(instance: 'CdmDataPartitionDefinition', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'DataPartition':
        data_partition = DataPartition()

        data_partition.location = instance.location
        data_partition.specializedSchema = instance.specialized_schema
        data_partition.lastFileStatusCheckTime = time_utils.get_formatted_date_string(instance.last_file_status_check_time)
        data_partition.lastFileModifiedTime = time_utils.get_formatted_date_string(instance.last_file_modified_time)
        data_partition.exhibitsTraits = utils.array_copy_data(res_opt, instance.exhibits_traits, options)

        if instance.arguments:
            data_partition.arguments = []
            for argument_list in instance.arguments:
                for argument_value in argument_list['1']:
                    argument = {}
                    argument[argument_list['0']] = argument_value
                    data_partition.arguments.append(argument)

        return data_partition
