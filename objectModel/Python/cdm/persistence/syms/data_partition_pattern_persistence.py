# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import dateutil.parser

from cdm.enums import CdmObjectType, CdmLogCode
from cdm.objectmodel import CdmCorpusContext, CdmDataPartitionPatternDefinition
from cdm.utilities import logger

from . import utils
from cdm.persistence.syms.models import StorageDescriptor

_TAG = 'DataPartitionPatternPersistence'

class DataPartitionPatternPersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data, name: str, syms_root_path: str, format_type: str, matches = None) -> CdmDataPartitionPatternDefinition:
        data_partition_pattern = ctx.corpus.make_object(CdmObjectType.DATA_PARTITION_PATTERN_DEF, name)
        if isinstance(data, StorageDescriptor):
            sd = data
            properties = sd.properties
            syms_path = utils.create_syms_absolute_path(syms_root_path, sd.source.location)
            corpus_path = utils.syms_path_to_corpus_path(syms_path, ctx.corpus.storage)

            if matches is not None and len(matches) > 0:
                split_corpus_path = utils.split_root_location_regex_from_path(corpus_path, matches)
                data_partition_pattern.root_location = split_corpus_path[0]
                data_partition_pattern.glob_pattern = split_corpus_path[1]
            else:
                data_partition_pattern.root_location = corpus_path
                if format_type == utils.csv:
                    data_partition_pattern.glob_pattern = '/**/*.csv'
                elif format_type == utils.parquet:
                    data_partition_pattern.glob_pattern = '/**/*.parquet'
                else:
                    logger.error(ctx, _TAG, DataPartitionPatternPersistence.from_data.__name__, None, CdmLogCode.ERR_PERSIST_SYMS_UNSUPPORTED_TABLE_FORMAT)
                    return None

            trait = utils.create_partition_trait(sd.format.properties, ctx, format_type)
            if trait is not None:
                data_partition_pattern.exhibits_traits.append(trait)
            else:
                logger.error(ctx, _TAG, DataPartitionPatternPersistence.from_data.__name__, None, CdmLogCode.ERR_PERSIST_SYMS_UNSUPPORTED_TABLE_FORMAT)
                return None

            if properties is not None:
                if 'cdm:name' in properties:
                    data_partition_pattern.Name = data.properties['cdm:name']
                if 'cdm:lastFileStatusCheckTime' in properties:
                    data_partition_pattern.LastFileStatusCheckTime = dateutil.parser.parse(data.properties['cdm:lastFileStatusCheckTime'].ToString())
                if 'cdm:lastFileModifiedTime' in properties:
                    data_partition_pattern.LastFileModifiedTime = dateutil.parser.parse(data.properties['cdm:lastFileModifiedTime'].ToString())
                if 'cdm:traits' in properties:
                    utils.add_list_to_cdm_collection(data_partition_pattern.exhibits_traits,
                                                     utils.create_trait_reference_array(ctx, data.properties['cdm:traits']))
        else:
            data_partition_pattern.name = data.name
            data_partition_pattern.root_location = data.rootLocation
            if data.globPattern:
                data_partition_pattern.glob_pattern = data.globPattern
            if data.regularExpression:
                data_partition_pattern.regular_expression = data.regularExpression
            data_partition_pattern.parameters = data.get('parameters')
            data_partition_pattern.explanation = data.explanation
            data_partition_pattern.specialized_schema = data.specializedSchema

            if data.get('lastFileStatusCheckTime'):
                data_partition_pattern.lastFileStatusCheckTime = dateutil.parser.parse(data.lastFileStatusCheckTime)

            if data.get('lastFileModifiedTime'):
                data_partition_pattern.lastFileModifiedTime = dateutil.parser.parse(data.lastFileModifiedTime)

            utils.add_list_to_cdm_collection(data_partition_pattern.exhibits_traits,
                                             utils.create_trait_reference_array(ctx, data.exhibitsTraits))

        return data_partition_pattern