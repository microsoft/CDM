# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import dateutil.parser

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmManifestDefinition
from cdm.persistence import PersistenceLayer
from cdm.utilities import logger, CopyOptions, ResolveOptions, time_utils, copy_data_utils

from . import utils
from .attribute_group_persistence import AttributeGroupPersistence
from .constant_entity_persistence import ConstantEntityPersistence
from .data_type_persistence import DataTypePersistence
from .entity_persistence import EntityPersistence
from .e2e_relationship_persistence import E2ERelationshipPersistence
from .manifest_declaration_persistence import ManifestDeclarationPersistence
from .import_persistence import ImportPersistence
from .local_entity_declaration_persistence import LocalEntityDeclarationPersistence
from .purpose_persistence import PurposePersistence
from .referenced_entity_declaration_persistence import ReferencedEntityDeclarationPersistence
from .trait_persistence import TraitPersistence
from .types import ManifestContent
from cdm.persistence.syms.models import ColumnRelationshipInformation, DataColumn, DataSource, DatabaseEntity, DatabaseProperties, FormatInfo, Namespace, PartitionInfo, PartitionInfoNamespace, PartitionInfoProperties, RelationshipEntity, RelationshipProperties, SASEntityType, ScalarTypeInfo, SchemaEntity, StorageDescriptor, TableEntity, TableNamespace, TablePartitioning, TableProperties, TypeInfo


_TAG = 'ManifestDatabasesPersistence'


class ManifestDatabasesPersistence:
    is_persistence_async = False

    formats = [PersistenceLayer.MANIFEST_EXTENSION]

    @staticmethod
    def from_object(ctx: CdmCorpusContext, name: str, namespace: str, path: str,
                    data_objs: 'SymsDatabasesResponse') -> 'CdmManifestDefinition':
        manifest = ctx.corpus.make_object(CdmObjectType.MANIFEST_DEF, name)

        manifest.name = name
        manifest._folder_path = path
        manifest._namespace = namespace
        manifest.explanation = "This manifest contains list of SyMS databases represented as sub-manifests."

        if len(manifest.imports) == 0  or not (x for x in manifest.imports if x.corpus_path == "cdm:/foundations.cdm.json"):
            manifest.imports.append("cdm:/foundations.cdm.json")

        if data_objs is not None and data_objs.items is not None:
            for item in data_objs.items:
                database = DatabaseEntity().deserialize(item)
                if database.type == SASEntityType.database:
                    manifest.sub_manifests.append(ManifestDeclarationPersistence.from_data(ctx, database))

        return manifest
