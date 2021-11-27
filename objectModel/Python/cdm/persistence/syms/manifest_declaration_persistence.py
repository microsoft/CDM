# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import dateutil.parser

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmManifestDeclarationDefinition, CdmManifestDefinition
from cdm.utilities import CopyOptions, ResolveOptions, time_utils

from .types import ManifestDeclaration
from cdm.persistence.syms.models import ColumnRelationshipInformation, DataColumn, DataSource, DatabaseEntity, \
    DatabaseProperties, FormatInfo, Namespace, PartitionInfo, PartitionInfoNamespace, PartitionInfoProperties, \
    RelationshipEntity, RelationshipProperties, ScalarTypeInfo, SchemaEntity, StorageDescriptor, TableEntity, \
    TableNamespace, TablePartitioning, TableProperties, TypeInfo


class ManifestDeclarationPersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, obj: DatabaseEntity) -> CdmManifestDeclarationDefinition:
        name = obj.name.replace(".manifest.cdm.json", "")
        new_manifest_doc = ctx.corpus.make_object(CdmObjectType.MANIFEST_DECLARATION_DEF, name)
        new_manifest_doc.definition = name + "/" + name + ".manifest.cdm.json"

        database_properties = DatabaseProperties(None).deserialize(obj.properties)
        if database_properties.properties is not None:
            if "cdm:lastFileStatusCheckTime" in database_properties.properties:
                new_manifest_doc.last_file_status_check_time = dateutil.parser.parse(database_properties.properties["cdm:lastFileStatusCheckTime"])

            if "cdm:lastFileModifiedTime" in database_properties.properties:
                new_manifest_doc.last_file_modified_time = dateutil.parser.parse(database_properties.properties["cdm:lastFileModifiedTime"])

            if "cdm:explanation" in database_properties.properties:
                new_manifest_doc.explanation = database_properties.properties["cdm:explanation"]
        return new_manifest_doc

    @staticmethod
    def to_data(instance: CdmManifestDeclarationDefinition, res_opt: ResolveOptions, options: CopyOptions) -> ManifestDeclaration:
        data = ManifestDeclaration()

        data.manifestName = instance.manifest_name
        data.definition = instance.definition
        data.explanation = instance.explanation
        data.lastFileStatusCheckTime = time_utils._get_formatted_date_string(instance.last_file_status_check_time)
        data.lastFileModifiedTime = time_utils._get_formatted_date_string(instance.last_file_modified_time)

        return data
