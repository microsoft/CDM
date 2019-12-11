import unittest
import json

from cdm.objectmodel import CdmDocumentDefinition, CdmManifestDefinition

from cdm.persistence.modeljson import ManifestPersistence
from cdm.persistence.cdmfolder import ManifestPersistence as CdmManifestPersistence

from tests.common import async_test, TestHelper


class ModelJsonTest(unittest.TestCase):
    test_subpath = 'persistence/modeljson'

    @async_test
    async def test_from_and_to_data(self):
        test_name = 'test_from_and_to_data'
        cdm_corpus = TestHelper.get_local_corpus(self.test_subpath, test_name)
        manifest = await cdm_corpus.fetch_object_async('model.json', cdm_corpus.storage.fetch_root_folder('local'))

        # TODO: explicitly setting output but it should work with just understanding output:/ in the save_as_async call
        # cdm_corpus.storage.fetch_root_folder('output').documents.append(manifest)
        # await manifest.save_as_async('model.json', save_referenced=True)

        expected_data = TestHelper.get_expected_output_data(self.test_subpath, test_name, 'model.json')
        actual_data = (await ManifestPersistence.to_data(manifest, None, None)).encode()

        self.maxDiff = None
        self.assertDictEqual(expected_data, json.loads(actual_data))

    @async_test
    async def test_loading_cdm_folder_and_saving_model_json(self):
        test_name = 'test_loading_cdm_folder_and_saving_model_json'
        cdm_corpus = TestHelper.get_local_corpus(self.test_subpath, test_name)
        manifest = await cdm_corpus.fetch_object_async('default.manifest.cdm.json', cdm_corpus.storage.fetch_root_folder('local'))

        # TODO: explicitly setting output but it should work with just understanding output:/ in the save_as_async call
        # await manifest.save_as_async('model.json', save_referenced=True)

        expected_data = TestHelper.get_expected_output_data(self.test_subpath, test_name, 'model.json')
        actual_data = (await ManifestPersistence.to_data(manifest, None, None)).encode()

        self.maxDiff = None
        self.assertDictEqual(expected_data, json.loads(actual_data))

    @async_test
    async def test_loading_model_json_result_and_saving_cdm_folder(self):
        test_name = 'test_loading_model_json_result_and_saving_cdm_folder'
        test_input_dir = TestHelper.get_expected_output_folder_path(self.test_subpath, 'test_loading_cdm_folder_and_saving_model_json')
        cdm_corpus = TestHelper.get_local_corpus(self.test_subpath, test_name, test_input_dir)

        manifest = await cdm_corpus.fetch_object_async('model.json', cdm_corpus.storage.fetch_root_folder('local'))

        # TODO: explicitly setting output but it should work with just understanding output:/ in the save_as_async call
        # await manifest.save_as_async('default.manifest.cdm.json', save_referenced=True)

        expected_data = TestHelper.get_expected_output_data(self.test_subpath, test_name, 'default.manifest.cdm.json')
        actual_data = (await CdmManifestPersistence.to_data(manifest, None, None)).encode()

        self.maxDiff = None
        self.assertDictEqual(expected_data, json.loads(actual_data))

    @async_test
    async def test_loading_model_json_and_saving_cdm_folder(self):
        test_name = 'test_loading_model_json_and_saving_cdm_folder'
        cdm_corpus = TestHelper.get_local_corpus(self.test_subpath, test_name)
        manifest = await cdm_corpus.fetch_object_async('model.json', cdm_corpus.storage.fetch_root_folder('local'))

        # TODO: explicitly setting output but it should work with just understanding output:/ in the save_as_async call
        # await manifest.save_as_async('default.manifest.cdm.json', save_referenced=False)

        doc = await cdm_corpus.fetch_object_async('local:/Customers.cdm.json', cdm_corpus.storage.fetch_root_folder('local'))
        doc.namespace = 'output'
        await doc.save_as_async('Customers.cdm.json')

        expected_data = TestHelper.get_expected_output_data(self.test_subpath, test_name, 'default.manifest.cdm.json')
        actual_data = (await CdmManifestPersistence.to_data(manifest, None, None)).encode()

        self.maxDiff = None
        self.assertDictEqual(expected_data, json.loads(actual_data))

    @async_test
    async def test_loading_cdm_folder_result_and_saving_model_json(self):
        test_name = 'test_loading_cdm_folder_result_and_saving_model_json'
        test_input_dir = TestHelper.get_expected_output_folder_path(self.test_subpath, 'test_loading_model_json_and_saving_cdm_folder')
        cdm_corpus = TestHelper.get_local_corpus(self.test_subpath, test_name, test_input_dir)

        manifest = await cdm_corpus.fetch_object_async('default.manifest.cdm.json', cdm_corpus.storage.fetch_root_folder('local'))

        # TODO: explicitly setting output but it should work with just understanding output:/ in the save_as_async call
        # await manifest.save_as_async('model.json', save_referenced=True)

        expected_data = TestHelper.get_expected_output_data(self.test_subpath, test_name, 'model.json')
        actual_data = (await ManifestPersistence.to_data(manifest, None, None)).encode()

        self.maxDiff = None
        self.assertDictEqual(expected_data, json.loads(actual_data))

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

        document = CdmDocumentDefinition(corpus.ctx, 'EntityName.cdm.json')
        document.imports.append('subfolder/EntityName.cdm.json')
        document.definitions.append('EntityName')
        entity_folder.documents.append(document)

        sub_folder = entity_folder.child_folders.append('subfolder')
        sub_folder.documents.append('EntityName.cdm.json')

        data = await ManifestPersistence.to_data(manifest, None, None)

        self.assertEqual(1, len(data.entities))
        imports = data.entities[0].get('imports', [])
        self.assertEqual(1, len(imports))
        self.assertEqual('EntityName/subfolder/EntityName.cdm.json', imports[0].corpusPath)


if __name__ == '__main__':
    unittest.main()
