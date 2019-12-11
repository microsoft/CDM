import unittest

from cdm.objectmodel import CdmCorpusDefinition, CdmManifestDefinition
from cdm.storage import LocalAdapter

from tests.common import async_test, TestHelper


class PersistenceLayerTest(unittest.TestCase):
    test_subpath = 'persistence/persistence_layer'

    @async_test
    async def test_invalid_json(self):
        test_input_path = TestHelper.get_input_folder_path(self.test_subpath, 'test_invalid_json')

        corpus = CdmCorpusDefinition()
        corpus.storage.mount('local', LocalAdapter(test_input_path))
        corpus.storage.default_namespace = 'local'

        failed = False
        invalid_manifest = None
        try:
            invalid_manifest = await corpus.fetch_object_async('local:/invalidManifest.manifest.cdm.json')
        except Exception as e:
            failed = True

        self.assertFalse(failed)
        self.assertIsNone(invalid_manifest)

    @async_test
    async def test_loading_invalid_model_json_and_odi_json_name(self):
        test_input_path = TestHelper.get_input_folder_path(self.test_subpath, 'test_loading_invalid_model_json_and_odi_json_name')

        corpus = CdmCorpusDefinition()
        corpus.storage.mount('local', LocalAdapter(test_input_path))
        corpus.storage.default_namespace = 'local'

        # We are trying to load a file with an invalid name, so fetch_object_async should just return null.
        invalid_model_json = await corpus.fetch_object_async('test.model.json')
        self.assertIsNone(invalid_model_json)

        # TODO: Do the same check for ODI.json files here once ODI is ported.
