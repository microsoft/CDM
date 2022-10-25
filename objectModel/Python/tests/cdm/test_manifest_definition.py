# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest
from datetime import datetime, timezone
import time
from typing import cast

from cdm.objectmodel import CdmDocumentDefinition, CdmManifestDefinition, CdmReferencedEntityDeclarationDefinition, \
    CdmLocalEntityDeclarationDefinition
from cdm.persistence import PersistenceLayer
from tests.common import async_test, TestHelper
from tests.model_json_unit_test_local_adapter import ModelJsonUnitTestLocalAdapter


class ManifestDefinitionTests(unittest.TestCase):
    tests_subpath = os.path.join('Cdm', 'ManifestDefinition')

    @async_test
    async def test_resolved_manifest_import(self):
        """Tests if the imports on the resolved manifest are relative to the resolved manifest location."""

        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_resolved_manifest_import')
        # Make sure that we are not picking up the default namespace while testing.
        corpus.storage.default_namespace = 'remote'

        document_name = 'localImport.cdm.json'
        local_folder = corpus.storage.fetch_root_folder('local')

        # Create a manifest that imports a document on the same folder.
        manifest = CdmManifestDefinition(corpus.ctx, 'default')
        manifest.imports.append(document_name)
        local_folder.documents.append(manifest)

        document = CdmDocumentDefinition(corpus.ctx, document_name)
        local_folder.documents.append(document)

        # Resolve the manifest into a different folder.
        resolved_manifest = await manifest.create_resolved_manifest_async('output:/default.manifest.cdm.json', None)

        # Checks if the import path on the resolved manifest points to the original location.
        self.assertEqual(1, len(resolved_manifest.imports))
        self.assertEqual(f'local:/{document_name}', resolved_manifest.imports[0].corpus_path)

    def test_manifest_copy(self):
        """Tests if the copy function creates copies of the sub objects"""

        corpus = TestHelper.get_local_corpus('', 'test_manifest_copy', no_input_and_output_folder=True)
        manifest = CdmManifestDefinition(corpus.ctx, 'name')

        entity_name = 'entity'
        sub_manifest_name = 'sub_manifest'
        relationship_name = 'relName'
        trait_name = 'traitName'

        entity_dec = manifest.entities.append(entity_name)
        sub_manifest = manifest.sub_manifests.append(sub_manifest_name)
        relationship = manifest.relationships.append(relationship_name)
        trait = manifest.exhibits_traits.append(trait_name)

        copy = manifest.copy()  # type: CdmManifestDefinition
        copy.entities[0].entity_name = 'newEntity'
        copy.sub_manifests[0].manifest_name = 'newSubManifest'
        copy.relationships[0].name = 'newRelName'
        copy.exhibits_traits[0].named_reference = 'newTraitName'

        self.assertEqual(entity_name, entity_dec.entity_name)
        self.assertEqual(sub_manifest_name, sub_manifest.manifest_name)
        self.assertEqual(relationship_name, relationship.name)
        self.assertEqual(trait_name, trait.named_reference)

    @async_test
    async def test_model_json_manifest_file_status_check_async(self):
        """Tests if FileStatusCheckAsync() works properly for manifest loaded from model.json"""
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_model_json_manifest_file_status_check_async')
        modeljson_adapter = ModelJsonUnitTestLocalAdapter(corpus.storage.namespace_adapters['local'].root)
        corpus.storage.mount('modeljson', modeljson_adapter)
        corpus.storage.default_namespace = 'modeljson'

        manifest = await corpus.fetch_object_async(f'modeljson:/{PersistenceLayer.MODEL_JSON_EXTENSION}')   # type: CdmManifestDefinition

        self.assertTrue(manifest._is_virtual)
        self.assertTrue(isinstance(manifest.entities[0], CdmReferencedEntityDeclarationDefinition))
        self.assertTrue(cast(CdmReferencedEntityDeclarationDefinition, manifest.entities[0])._is_virtual)
        self.assertTrue(isinstance(manifest.entities[1], CdmLocalEntityDeclarationDefinition))
        self.assertTrue(cast(CdmReferencedEntityDeclarationDefinition, manifest.entities[1])._is_virtual)

        time_before_load = datetime.now(timezone.utc)
        old_manifest_last_file_modified_time = manifest._file_system_modified_time
        self.assertIsNone(manifest.last_file_status_check_time)
        self.assertIsNone(manifest.entities[0].last_file_status_check_time)
        self.assertIsNone(manifest.entities[1].last_file_status_check_time)
        self.assertIsNone(manifest.last_file_modified_time)
        self.assertIsNone(manifest.entities[0].last_file_modified_time)
        self.assertIsNone(manifest.entities[1].last_file_modified_time)

        self.assertTrue(old_manifest_last_file_modified_time < time_before_load)

        time.sleep(1)

        await manifest.file_status_check_async()
        new_manifest_last_file_status_check_time = manifest.last_file_status_check_time
        new_ref_entity_last_file_status_check_time = manifest.entities[0].last_file_status_check_time
        new_local_entity_last_file_status_check_time = manifest.entities[1].last_file_status_check_time

        self.assertIsNotNone(manifest.last_file_modified_time)
        self.assertIsNotNone(manifest.entities[0].last_file_modified_time)
        self.assertIsNotNone(manifest.entities[1].last_file_modified_time)

        self.assertTrue(new_manifest_last_file_status_check_time > time_before_load)
        self.assertTrue(new_ref_entity_last_file_status_check_time > time_before_load)
        self.assertTrue(new_local_entity_last_file_status_check_time > time_before_load)



