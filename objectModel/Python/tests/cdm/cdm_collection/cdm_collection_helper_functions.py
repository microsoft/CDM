# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.objectmodel import CdmCorpusDefinition, CdmManifestDefinition
from cdm.storage import LocalAdapter
from cdm.enums import CdmObjectType


def generate_manifest(local_root_path: str) -> 'CdmManifestDefinition':
    """
        Creates a manifest used for the tests.
    """
    cdmCorpus = CdmCorpusDefinition()
    cdmCorpus.storage.default_namespace = 'local'
    adapter = LocalAdapter(root=local_root_path)
    cdmCorpus.storage.mount('local', adapter)
    # add cdm namespace
    cdmCorpus.storage.mount('cdm', adapter)

    manifest = CdmManifestDefinition(cdmCorpus.ctx, 'manifest')
    manifest._folder_path = '/'
    manifest._namespace = 'local'

    return manifest


def create_document_for_entity(cdm_corpus: 'CdmCorpusDefinition', entity: 'CdmEntityDefinition', nameSpace: str = 'local'):
    """
        For an entity, it creates a document that will contain the entity.
    """
    cdm_folder_def = cdm_corpus.storage.fetch_root_folder(nameSpace)
    entity_doc = cdm_corpus.ctx.corpus.make_object(CdmObjectType.DOCUMENT_DEF, '{}.cdm.json'.format(entity.entity_name), False)

    cdm_folder_def.documents.append(entity_doc)
    entity_doc.definitions.append(entity)
    return entity_doc
