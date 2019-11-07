import unittest
import json

from tests.common import async_test, TestHelper
from cdm.persistence.modeljson import ManifestPersistence
from cdm.persistence.cdmfolder import ManifestPersistence as CdmManifestPersistence


class ModelJsonTest(unittest.TestCase):
    test_subpath = 'persistence/modeljson'

    @async_test
    async def test_from_and_to_data(self):
        test_name = 'test_from_and_to_data'
        cdm_corpus = TestHelper.get_local_corpus(self.test_subpath, test_name)
        manifest = await cdm_corpus.fetch_object_async('model.json', cdm_corpus.storage.fetch_root_folder('local'))

        # TODO: explicitly setting output but it should work with just understanding output:/ in the save_as_async call
        manifest.namespace = 'output'
        await manifest.save_as_async('output:/model.json', save_referenced=True)

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
        manifest.namespace = 'output'
        await manifest.save_as_async('output:/model.json', save_referenced=True)

        expected_data = TestHelper.get_expected_output_data(self.test_subpath, test_name, 'model.json')
        actual_data = (await ManifestPersistence.to_data(manifest, None, None)).encode()

        self.maxDiff = None
        self.assertDictEqual(expected_data, json.loads(actual_data))

    @async_test
    async def test_loading_model_json_and_saving_cdm_folder(self):
        test_name = 'test_loading_model_json_and_saving_cdm_folder'
        cdm_corpus = TestHelper.get_local_corpus(self.test_subpath, test_name)
        manifest = await cdm_corpus.fetch_object_async('model.json', cdm_corpus.storage.fetch_root_folder('local'))

        # TODO: explicitly setting output but it should work with just understanding output:/ in the save_as_async call
        manifest.namespace = 'output'
        await manifest.save_as_async('output:/default.manifest.cdm.json', save_referenced=False)

        doc = await cdm_corpus.fetch_object_async('local:/Customers.cdm.json', cdm_corpus.storage.fetch_root_folder('local'))
        doc.namespace = 'output'
        await doc.save_as_async('output:/Customers.cdm.json')

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
        manifest.namespace = 'output'
        await manifest.save_as_async('output:/model.json', save_referenced=True)

        expected_data = TestHelper.get_expected_output_data(self.test_subpath, test_name, 'model.json')
        actual_data = (await ManifestPersistence.to_data(manifest, None, None)).encode()

        self.maxDiff = None
        self.assertDictEqual(expected_data, json.loads(actual_data))


if __name__ == '__main__':
    unittest.main()
