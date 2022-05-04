# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.persistence.syms.types import SymsDatabasesResponse

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmManifestDefinition
from cdm.persistence import PersistenceLayer
from cdm.utilities import Constants

from .manifest_declaration_persistence import ManifestDeclarationPersistence
from cdm.persistence.syms.models import DatabaseEntity, SASEntityType


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
        manifest.explanation = 'This manifest contains list of SyMS databases represented as sub-manifests.'

        if len(manifest.imports) == 0 or not (x for x in manifest.imports if x.corpus_path == Constants._FOUNDATIONS_CORPUS_PATH):
            manifest.imports.append(Constants._FOUNDATIONS_CORPUS_PATH)

        if data_objs is not None and data_objs.items is not None:
            for item in data_objs.items:
                database = DatabaseEntity().deserialize(item)
                if database.type == SASEntityType.database:
                    manifest.sub_manifests.append(ManifestDeclarationPersistence.from_data(ctx, database))

        return manifest
