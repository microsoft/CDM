# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import unittest
import json
import os

from cdm.enums import CdmStatusLevel, CdmObjectType
from cdm.objectmodel import CdmDocumentDefinition, CdmManifestDefinition, CdmReferencedEntityDeclarationDefinition, \
    CdmCorpusDefinition
from cdm.persistence import PersistenceLayer
from cdm.persistence.modeljson import ManifestPersistence
from cdm.persistence.cdmfolder import ManifestPersistence as CdmManifestPersistence

from tests.common import async_test, TestHelper


class ModelJsonTest(unittest.TestCase):
    tests_subpath = os.path.join('Persistence', 'ModelJson', 'ModelJson')

    @async_test
    async def test_model_json_from_and_to_data(self):
        test_name = 'test_model_json_from_and_to_data'
        cdm_corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        manifest = await cdm_corpus.fetch_object_async(PersistenceLayer.MODEL_JSON_EXTENSION, cdm_corpus.storage.fetch_root_folder('local'))

        expected_data = TestHelper.get_expected_output_data(self.tests_subpath, test_name, PersistenceLayer.MODEL_JSON_EXTENSION)
        actual_data = json.loads((await ManifestPersistence.to_data(manifest, None, None)).encode())
        error_msg = TestHelper.compare_same_object(expected_data, actual_data)
        self.assertEqual('', error_msg, error_msg)

    @async_test
    async def test_loading_cdm_folder_and_model_json_to_data(self):
        test_name = 'test_loading_cdm_folder_and_model_json_to_data'
        cdm_corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        manifest = await cdm_corpus.fetch_object_async('default.manifest{}'.format(PersistenceLayer.CDM_EXTENSION), cdm_corpus.storage.fetch_root_folder('local'))

        expected_data = TestHelper.get_expected_output_data(self.tests_subpath, test_name, PersistenceLayer.MODEL_JSON_EXTENSION)
        actual_data = json.loads((await ManifestPersistence.to_data(manifest, None, None)).encode())
        error_msg = TestHelper.compare_same_object(expected_data, actual_data)

        self.assertEqual('', error_msg, error_msg)

    @async_test
    async def test_loading_model_json_result_and_cdm_folder_to_data(self):
        test_name = 'test_loading_model_json_result_and_cdm_folder_to_data'
        cdm_corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        manifest = await cdm_corpus.fetch_object_async(PersistenceLayer.MODEL_JSON_EXTENSION, cdm_corpus.storage.fetch_root_folder('local'))

        expected_data = TestHelper.get_expected_output_data(self.tests_subpath, test_name, 'cdmFolder{}'.format(PersistenceLayer.CDM_EXTENSION))
        actual_data = json.loads((CdmManifestPersistence.to_data(manifest, None, None)).encode())
        error_msg = TestHelper.compare_same_object(expected_data, actual_data)

        self.assertEqual('', error_msg, error_msg)

    @async_test
    async def test_loading_model_json_and_cdm_folder_to_data(self):
        test_name = 'test_loading_model_json_and_cdm_folder_to_data'
        cdm_corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)
        manifest = await cdm_corpus.fetch_object_async(PersistenceLayer.MODEL_JSON_EXTENSION, cdm_corpus.storage.fetch_root_folder('local'))

        cdm_corpus.storage.fetch_root_folder('output').documents.append(manifest)
        await manifest.save_as_async('cdm.json', save_referenced=True)

        expected_data = TestHelper.get_expected_output_data(self.tests_subpath, test_name, 'cdmFolder{}'.format(PersistenceLayer.CDM_EXTENSION))
        actual_data = json.loads((CdmManifestPersistence.to_data(manifest, None, None)).encode())
        error_msg = TestHelper.compare_same_object(expected_data, actual_data)

        self.assertEqual('', error_msg, error_msg)

    @async_test
    async def test_loading_cdm_folder_result_and_model_json_to_data(self):
        test_name = 'test_loading_cdm_folder_result_and_model_json_to_data'
        cdm_corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)

        manifest = await cdm_corpus.fetch_object_async('result.model.manifest{}'.format(PersistenceLayer.CDM_EXTENSION), cdm_corpus.storage.fetch_root_folder('local'))

        expected_data = TestHelper.get_expected_output_data(self.tests_subpath, test_name, PersistenceLayer.MODEL_JSON_EXTENSION)
        actual_data = json.loads((await ManifestPersistence.to_data(manifest, None, None)).encode())
        error_msg = TestHelper.compare_same_object(expected_data, actual_data)

        self.assertEqual('', error_msg, error_msg)

    @async_test
    async def test_imports_relative_path(self):
        # the corpus path in the imports are relative to the document where it was defined.
        # when saving in model.json the documents are flattened to the manifest level
        # so it is necessary to recalculate the path to be relative to the manifest.
        corpus = TestHelper.get_local_corpus('notImportant', 'notImportantLocation')
        folder = corpus.storage.fetch_root_folder('local')

        manifest = CdmManifestDefinition(corpus.ctx, 'manifest')
        manifest.entities.append('EntityName', 'EntityName/EntityName.cdm.json/EntityName')
        folder.documents.append(manifest)

        entity_folder = folder.child_folders.append('EntityName')

        document = CdmDocumentDefinition(corpus.ctx, 'EntityName{}'.format(PersistenceLayer.CDM_EXTENSION))
        document.imports.append('subfolder/EntityName{}'.format(PersistenceLayer.CDM_EXTENSION))
        document.definitions.append('EntityName')
        entity_folder.documents.append(document)

        sub_folder = entity_folder.child_folders.append('subfolder')
        sub_folder.documents.append('EntityName{}'.format(PersistenceLayer.CDM_EXTENSION))

        corpus.storage.fetch_root_folder('remote').documents.append(manifest)

        data = await ManifestPersistence.to_data(manifest, None, None)

        self.assertEqual(1, len(data.entities))
        imports = data.entities[0].get('imports', [])
        self.assertEqual(1, len(imports))
        self.assertEqual('EntityName/subfolder/EntityName{}'.format(PersistenceLayer.CDM_EXTENSION), imports[0].corpusPath)

    @async_test
    async def test_manifest_foundation_import(self):
        """test if when loading a model.json file the foundations is imported correctly."""

        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'TestManifestFoundationImport')

        def callback(status_level: 'CdmStatusLevel', message: str):
            if status_level >= CdmStatusLevel.ERROR:
                self.fail(message)

        corpus.set_event_callback(callback)

        await corpus.fetch_object_async(PersistenceLayer.MODEL_JSON_EXTENSION, corpus.storage.fetch_root_folder('local'))

    @async_test
    async def test_reference_models(self):
        """Test if the referenceModels is generated correctly."""
        test_name = 'TestReferenceModels'

        corpus = TestHelper.get_local_corpus(self.tests_subpath, test_name)

        manifest = await corpus.fetch_object_async(PersistenceLayer.MODEL_JSON_EXTENSION, corpus.storage.fetch_root_folder('local'))

        # entity with same modelId but different location
        reference_entity1 = CdmReferencedEntityDeclarationDefinition(corpus.ctx, 'ReferenceEntity1')
        reference_entity1.entity_path = 'remote:/contoso/entity1.model.json/Entity1'
        model_id_trait1 = reference_entity1.exhibits_traits.append('is.propertyContent.multiTrait')
        model_id_trait1.is_from_property = True
        model_id_trait1.arguments.append('modelId', 'f19bbb97-c031-441a-8bd1-61b9181c0b83/1a7ef9c8-c7e8-45f8-9d8a-b80f8ffe4612')
        manifest.entities.append(reference_entity1)

        # entity without modelId but same location
        reference_entity2 = CdmReferencedEntityDeclarationDefinition(corpus.ctx, 'ReferenceEntity2')
        reference_entity2.entity_path = 'remote:/contoso/entity.model.json/Entity2'
        manifest.entities.append(reference_entity2)

        # entity with modelId and new location
        reference_entity3 = CdmReferencedEntityDeclarationDefinition(corpus.ctx, 'ReferenceEntity3')
        reference_entity3.entity_path = 'remote:/contoso/entity3.model.json/Entity3'
        model_id_trait3 = reference_entity3.exhibits_traits.append('is.propertyContent.multiTrait')
        model_id_trait3.is_from_property = True
        model_id_trait3.arguments.append('modelId', '3b2e040a-c8c5-4508-bb42-09952eb04a50')
        manifest.entities.append(reference_entity3)

        # entity with same modelId and same location
        reference_entity4 = CdmReferencedEntityDeclarationDefinition(corpus.ctx, 'ReferenceEntity4')
        reference_entity4.entity_path = 'remote:/contoso/entity.model.json/Entity4'
        model_id_trait4 = reference_entity4.exhibits_traits.append('is.propertyContent.multiTrait')
        model_id_trait4.is_from_property = True
        model_id_trait4.arguments.append('modelId', 'f19bbb97-c031-441a-8bd1-61b9181c0b83/1a7ef9c8-c7e8-45f8-9d8a-b80f8ffe4612')
        manifest.entities.append(reference_entity4)

        expected_data = TestHelper.get_expected_output_data(self.tests_subpath, test_name, PersistenceLayer.MODEL_JSON_EXTENSION)
        obtained_model_json = json.loads((await ManifestPersistence.to_data(manifest, None, None)).encode())
        error_msg = TestHelper.compare_same_object(expected_data, obtained_model_json)

        self.assertEqual('', error_msg, error_msg)

    @async_test
    async def test_setting_model_json_entity_description(self):
        """Tests that a description on a CdmFolder entity sets the description on the ModelJson entity."""
        corpus = CdmCorpusDefinition()
        manifest = corpus.make_object(CdmObjectType.MANIFEST_DEF, 'test')
        document = corpus.make_object(CdmObjectType.DOCUMENT_DEF, 'entity{}'.format(PersistenceLayer.CDM_EXTENSION))

        folder = corpus.storage.fetch_root_folder('local')
        folder.documents.append(document)

        entity = document.definitions.append(CdmObjectType.ENTITY_DEF.name, 'entity')
        entity.description = 'test description'

        manifest.entities.append(entity)
        folder.documents.append(manifest)

        obtained_model_json = await ManifestPersistence.to_data(manifest, None, None)

        self.assertEqual('test description', obtained_model_json.entities[0].get('description'))


if __name__ == '__main__':
    unittest.main()
