# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
import json
from typing import List

from cdm.enums import CdmObjectType
from cdm.persistence import PersistenceLayer
from cdm.objectmodel import CdmCorpusContext, CdmDocumentDefinition, CdmEntityDefinition, CdmManifestDefinition
from cdm.utilities import CopyOptions, ResolveOptions, copy_data_utils, logger

from cdm.enums import CdmLogCode
from .attribute_group_persistence import AttributeGroupPersistence
from .constant_entity_persistence import ConstantEntityPersistence
from .data_type_persistence import DataTypePersistence
from .entity_persistence import EntityPersistence
from .import_persistence import ImportPersistence
from .purpose_persistence import PurposePersistence
from .trait_persistence import TraitPersistence
from .trait_group_persistence import TraitGroupPersistence
from .types import DocumentContent
from cdm.persistence.syms.models import ColumnRelationshipInformation, DataColumn, DataSource, DatabaseEntity, DatabaseProperties, FormatInfo, Namespace, PartitionInfo, PartitionInfoNamespace, PartitionInfoProperties, RelationshipEntity, RelationshipProperties, SASEntityType, ScalarTypeInfo, SchemaEntity, StorageDescriptor, TableEntity, TableNamespace, TablePartitioning, TableProperties, TypeInfo

_TAG = 'DocumentPersistence'

class DocumentPersistence:
    @staticmethod
    def from_object(ctx: CdmCorpusContext, name: str, namespace: str, path: str,
                    table: 'TableEntity') -> 'CdmDocumentDefinition':
        if table == None or table.type != SASEntityType.table:
            return None

        te_properties = TableProperties(None, None, None).deserialize(table.properties)
        doc = ctx.corpus.make_object(CdmObjectType.DOCUMENT_DEF, table.name)
        doc._folder_path = path
        doc._namespace = namespace

        if te_properties.properties is not None:
            if "cdm:imports" in te_properties.properties:
                for import_obj in te_properties.properties["cdm:imports"]:
                    doc.imports.append(ImportPersistence.from_data(ctx, json.loads(import_obj)))

        doc.definitions.append(EntityPersistence.from_data(ctx, table.name, table))
        return doc

    @staticmethod
    def to_data(ctx: CdmCorpusContext, doc: CdmDocumentDefinition, current_table_properties: TableProperties, res_opt: ResolveOptions, options: CopyOptions) -> TableEntity:
        if current_table_properties == None:
            return None

        if len(doc.definitions) == 0 or len(doc.definitions) > 1:
            logger.error(ctx, _TAG, 'to_data', doc.at_corpus_path, CdmLogCode.ERR_PERSIST_SYMS_MULTIPLE_OR_ZERO_TABLE_DEFINITION, doc.name)
            return None
        if isinstance(doc.definitions[0], CdmEntityDefinition):
            cdm_entity = doc.definitions[0]
            table_entity = EntityPersistence.to_data(cdm_entity, ctx, res_opt, options)
            te_properties = table_entity.properties
            if cdm_entity.owner is not None and isinstance(cdm_entity.owner, CdmDocumentDefinition):
                document = cdm_entity.owner
                if len(document.imports) > 0:
                   imports = copy_data_utils._array_copy_data(res_opt, document.imports, options)
                   te_properties.properties["cdm:imports"] = imports

            te_properties.namespace = current_table_properties.namespace
            te_properties.storage_descriptor.source = current_table_properties.storage_descriptor.source
            te_properties.storage_descriptor.format = current_table_properties.storage_descriptor.format
            te_properties.partitioning = current_table_properties.partitioning

            table_entity.properties = te_properties
            return table_entity
        return None

    @staticmethod
    async def to_data_async(document_object_or_path, manifest: CdmManifestDefinition, ctx: CdmCorpusContext, res_opt: ResolveOptions, options: CopyOptions) -> TableEntity:
        if isinstance(document_object_or_path, str):
            obje = await ctx.corpus.fetch_object_async(document_object_or_path, manifest)
            if isinstance(obje, CdmEntityDefinition):
                cdm_entity = obje
                table_entity = EntityPersistence.to_data(cdm_entity, ctx, res_opt, options)
                te_properties = table_entity.properties
                te_properties.namespace = TableNamespace(manifest.manifest_name)

                if cdm_entity.owner is not None and isinstance(cdm_entity.owner, CdmDocumentDefinition):
                    document = cdm_entity.owner
                    if len(document.imports) > 0:
                       imports = copy_data_utils._array_copy_data(res_opt, document.imports, options)
                       te_properties.properties["cdm:imports"] = imports
                else:
                    logger.warning(ctx, _TAG, 'to_data_async', manifest.at_corpus_path,
                                 CdmLogCode.WARN_PERSIST_SYMS_ENTITY_MISIING, cdm_entity.name)

                return table_entity
            else:
                logger.error(ctx, _TAG, 'to_data_async', manifest.at_corpus_path,
                               CdmLogCode.ERR_PERSIST_SYMS_ENTITY_FETCH_ERROR, document_object_or_path)
                return None
        return None

    @staticmethod
    async def convert_doc_to_syms_table(ctx: 'CdmCorpusContext', doc: 'CdmDocumentDefinition', adapter: 'StorageAdapte', name: str, res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'TableEntity':
        existing_table_entity = TableEntity().decode(await adapter.read_async(name))
        return DocumentPersistence.to_data(ctx, doc, existing_table_entity.Properties, res_opt, options)