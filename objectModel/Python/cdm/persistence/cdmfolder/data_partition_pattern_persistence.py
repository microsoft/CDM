# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import dateutil.parser

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmDataPartitionPatternDefinition
from cdm.utilities import CopyOptions, ResolveOptions, time_utils, copy_data_utils

from . import utils
from .types import DataPartitionPattern


class DataPartitionPatternPersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data: DataPartitionPattern) -> CdmDataPartitionPatternDefinition:
        pattern = ctx.corpus.make_object(CdmObjectType.DATA_PARTITION_PATTERN_DEF, data.name if data.get('name') else None)

        pattern.root_location = data.rootLocation
        if data.globPattern:
            pattern.glob_pattern = data.globPattern
        if data.regularExpression:
            pattern.regular_expression = data.regularExpression
        pattern.parameters = data.get('parameters')
        pattern.explanation = data.explanation
        pattern.specialized_schema = data.specializedSchema

        if data.get('lastFileStatusCheckTime'):
            pattern.lastFileStatusCheckTime = dateutil.parser.parse(data.lastFileStatusCheckTime)

        if data.get('lastFileModifiedTime'):
            pattern.lastFileModifiedTime = dateutil.parser.parse(data.lastFileModifiedTime)

        if data.get('exhibitsTraits'):
            exhibits_traits = utils.create_trait_reference_array(ctx, data.exhibitsTraits)
            pattern.exhibits_traits.extend(exhibits_traits)

        return pattern

    @staticmethod
    def to_data(instance: CdmDataPartitionPatternDefinition, res_opt: ResolveOptions, options: CopyOptions) -> DataPartitionPattern:
        data = DataPartitionPattern()

        data.name = instance.name
        data.lastFileStatusCheckTime = time_utils._get_formatted_date_string(instance.last_file_status_check_time)
        data.lastFileModifiedTime = time_utils._get_formatted_date_string(instance.last_file_modified_time)
        data.explanation = instance.explanation
        data.rootLocation = instance.root_location
        data.globPattern = instance.glob_pattern
        data.regularExpression = instance.regular_expression
        data.parameters = instance.parameters
        data.specializedSchema = instance.specialized_schema
        data.exhibitsTraits = copy_data_utils._array_copy_data(res_opt, instance.exhibits_traits, options)

        return data
