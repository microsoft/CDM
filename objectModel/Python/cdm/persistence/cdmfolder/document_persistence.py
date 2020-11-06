# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List

from cdm.enums import CdmObjectType
from cdm.persistence import PersistenceLayer
from cdm.objectmodel import CdmCorpusContext, CdmDocumentDefinition
from cdm.utilities import CopyOptions, ResolveOptions, copy_data_utils

from .attribute_group_persistence import AttributeGroupPersistence
from .constant_entity_persistence import ConstantEntityPersistence
from .data_type_persistence import DataTypePersistence
from .entity_persistence import EntityPersistence
from .import_persistence import ImportPersistence
from .purpose_persistence import PurposePersistence
from .trait_persistence import TraitPersistence
from .types import DocumentContent


class DocumentPersistence:
    is_persistence_async = False

    formats = [PersistenceLayer.CDM_EXTENSION]

    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', doc_name: str, json_data: str, folder: 'CdmFolderDefinition') -> 'CdmDocumentDefinition':
        obj = DocumentContent().decode(json_data)
        return DocumentPersistence.from_object(ctx, doc_name, folder.namespace, folder.folder_path, obj)

    @staticmethod
    def from_object(ctx: CdmCorpusContext, name: str, namespace: str, path: str, data: 'DocumentContent') -> 'CdmDocumentDefinition':
        document = ctx.corpus.make_object(CdmObjectType.DOCUMENT_DEF, name)
        document.folder_path = path
        document.namespace = namespace

        if data:
            if data.get('schema'):
                document.schema = data.schema

            # support old model syntax
            if data.get('schemaVersion'):
                document.json_schema_semantic_version = data.schemaVersion

            if data.get('jsonSchemaSemanticVersion'):
                document.json_schema_semantic_version = data.jsonSchemaSemanticVersion

            if document.json_schema_semantic_version not in ['0.9.0', '1.0.0']:
                # TODO: validate that this is a version we can understand with the OM
                pass

            if data.get('documentVersion'):
                document.document_version = data.documentVersion

            if data.get('imports'):
                for import_obj in data.imports:
                    document.imports.append(ImportPersistence.from_data(ctx, import_obj))

            if data.get('definitions') and isinstance(data.definitions, List):
                for definition in data.definitions:
                    if definition.get('dataTypeName'):
                        document.definitions.append(DataTypePersistence.from_data(ctx, definition))
                    elif definition.get('purposeName'):
                        document.definitions.append(PurposePersistence.from_data(ctx, definition))
                    elif definition.get('attributeGroupName'):
                        document.definitions.append(AttributeGroupPersistence.from_data(ctx, definition))
                    elif definition.get('traitName'):
                        document.definitions.append(TraitPersistence.from_data(ctx, definition))
                    elif definition.get('entityShape'):
                        document.definitions.append(ConstantEntityPersistence.from_data(ctx, definition))
                    elif definition.get('entityName'):
                        document.definitions.append(EntityPersistence.from_data(ctx, definition))

        return document

    @staticmethod
    def to_data(instance: CdmDocumentDefinition, res_opt: ResolveOptions, options: CopyOptions) -> DocumentContent:
        result = DocumentContent()
        result.schema = instance.schema
        result.jsonSchemaSemanticVersion = instance.json_schema_semantic_version
        result.imports = copy_data_utils._array_copy_data(res_opt, instance.imports, options)
        result.definitions = copy_data_utils._array_copy_data(res_opt, instance.definitions, options)
        result.documentVersion = instance.document_version
        return result
