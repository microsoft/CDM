# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import dateutil.parser

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmDataPartitionPatternDefinition
from cdm.utilities import CopyOptions, ResolveOptions, time_utils, copy_data_utils

from . import utils
from cdm.persistence.syms.models import ColumnRelationshipInformation, DataColumn, DataSource, DatabaseEntity, \
    DatabaseProperties, FormatInfo, Namespace, PartitionInfo, PartitionInfoNamespace, PartitionInfoProperties, \
    RelationshipEntity, RelationshipProperties, ScalarTypeInfo, SchemaEntity, StorageDescriptor, TableEntity, \
    TableNamespace, TablePartitioning, TableProperties, TypeInfo

class DataPartitionPatternPersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data, name: str, syms_root_path: str) -> CdmDataPartitionPatternDefinition:
        data_partition_pattern = ctx.corpus.make_object(CdmObjectType.DATA_PARTITION_PATTERN_DEF, name)
        if isinstance(data, StorageDescriptor):
            sd = data
            properties = sd.properties
            syms_path = utils.create_syms_absolute_path(syms_root_path, sd.source.location)
            data_partition_pattern.root_location = utils.syms_path_to_corpus_path(syms_path, ctx.corpus.storage)

            data_partition_pattern.glob_pattern = "/**/*.csv"
            data_partition_pattern.exhibits_traits.append(utils.create_csv_trait(sd.format.properties, ctx))

            if properties is not None:
                if "cdm:name"in properties:
                    data_partition_pattern.Name = data.properties["cdm:name"]
                if "cdm:lastFileStatusCheckTime"in properties:
                    data_partition_pattern.LastFileStatusCheckTime = dateutil.parser.parse(data.properties["cdm:lastFileStatusCheckTime"].ToString())
                if "cdm:lastFileModifiedTime"in properties:
                    data_partition_pattern.LastFileModifiedTime = dateutil.parser.parse(data.properties["cdm:lastFileModifiedTime"].ToString())
                if "cdm:traits"in properties:
                    utils.add_list_to_cdm_collection(data_partition_pattern.exhibits_traits,
                                                     utils.create_trait_reference_array(ctx, data.properties["cdm:traits"]))
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