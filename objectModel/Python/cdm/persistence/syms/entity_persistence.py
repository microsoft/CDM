# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.objectmodel import CdmCorpusContext, CdmEntityDefinition, CdmTraitGroupReference
from cdm.enums import CdmLogCode, CdmObjectType
from cdm.utilities import CopyOptions, ResolveOptions, copy_data_utils, logger
from cdm.enums import CdmLogCode
from . import utils
from .attribute_context_persistence import AttributeContextPersistence
from .attribute_resolution_guidance_persistence import AttributeResolutionGuidancePersistence
from .entity_reference_persistence import EntityReferencePersistence
from .types import Entity
from cdm.persistence.syms.models import ColumnRelationshipInformation, DataColumn, DataSource, DatabaseEntity, DatabaseProperties, FormatInfo, Namespace, PartitionInfo, PartitionInfoNamespace, PartitionInfoProperties, RelationshipEntity, RelationshipProperties, SASEntityType, ScalarTypeInfo, SchemaEntity, StorageDescriptor, TableEntity, TableNamespace, TablePartitioning, TableProperties, TableType, TypeInfo

_TAG = "EntityPersistence"

class EntityPersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, name: str, table: TableEntity) -> CdmEntityDefinition:
        if table == None:
            return None
        te_properties = TableProperties(None, None, None).deserialize(table.properties)
        entity = ctx.corpus.make_object(CdmObjectType.ENTITY_DEF, name)
        entity.display_name = entity.entity_name

        if te_properties.properties is not None:
            if "cdm:explanation" in te_properties.properties:
                entity.explanation = te_properties.properties["cdm:explanation"]
            if "cdm:cdmSchemas" in te_properties.properties:
                entity.cdm_schemas = te_properties.properties["cdm:cdmSchemas"]
            if "cdm:sourceName" in te_properties.properties:
                entity.source_name = te_properties.properties["cdm:sourceName"]
            if "cdm:description" in te_properties.properties:
                entity.description = te_properties.properties["cdm:description"]
            if "cdm:version" in te_properties.properties:
                entity.version = te_properties.properties["cdm:version"]
            if "cdm:traits" in te_properties.properties:
                utils.add_list_to_cdm_collection(entity.exhibits_traits, utils.create_trait_reference_array(ctx,
                                                            te_properties.properties["cdm:traits"]))

        if te_properties.storage_descriptor is not None and te_properties.storage_descriptor.columns is not None:
            for attribute in te_properties.storage_descriptor.columns:
                from cdm.persistence.syms import TypeAttributePersistence
                type_attribute = TypeAttributePersistence.from_data(ctx, attribute, name)
                if type_attribute is not None:
                    entity.attributes.append(type_attribute)
                else:
                   logger.error(ctx, _TAG, 'from_data', None, CdmLogCode.ERR_PERSIST_SYMS_ATTR_CONVERSION_FAILURE, name, attribute.name)
                   return None
        else:
            logger.error(ctx, _TAG, 'from_data', None, CdmLogCode.ERR_PERSIST_SYMS_ATTR_CONVERSION_ERROR, name)
            return None
        return entity

    @staticmethod
    def to_data(instance: CdmEntityDefinition, ctx: CdmCorpusContext, res_opt: ResolveOptions, options: CopyOptions) -> TableEntity:
        properties = EntityPersistence.create_table_propertybags(instance, res_opt, options)
        columns = []

        for attribute in instance.attributes:
            from cdm.persistence.syms import TypeAttributePersistence
            col = TypeAttributePersistence.to_data(attribute, ctx, res_opt, options)
            columns.append(col)

        storage_descriptor = StorageDescriptor(
        source = None,
        format = None,
        columns = columns)

        partitioning = TablePartitioning(None)
        teProperties = TableProperties(
        namespace= None,
        table_type = TableType.managed,
        properties = properties,
        partitioning = partitioning,
        storage_descriptor = storage_descriptor)

        table_entity = TableEntity(
        name = instance.entity_name,
        type = SASEntityType.table,
        properties = teProperties)

        return table_entity

    @staticmethod
    def create_table_propertybags(instance: CdmEntityDefinition, res_opt: ResolveOptions, options: CopyOptions):
        properties = {}

        if instance.explanation is not None:
            properties["cdm:explanation"] = instance.explanation

        if instance.source_name is not None:
            properties["cdm:sourceName"] = instance.source_name

        if instance.display_name is not None:
            properties["cdm:displayName"] = instance.display_name

        if instance.description is not None:
            properties["cdm:description"] = instance.description

        if instance.exhibits_traits is not None and len(instance.exhibits_traits) > 0:
            properties["cdm:traits"] = copy_data_utils._array_copy_data(res_opt, instance.exhibits_traits, options)

        return properties