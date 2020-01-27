import os
import unittest

from cdm.enums import CdmStatusLevel
from cdm.objectmodel import CdmCorpusDefinition, CdmManifestDefinition
from cdm.storage import LocalAdapter

from tests.common import async_test, TestHelper
from tests.test_storage_adapter import TestStorageAdapter


class PersistenceLayerTest(unittest.TestCase):
    tests_subpath = os.path.join('Persistence', 'PersistenceLayer')

    @async_test
    async def test_invalid_json(self):
        test_input_path = TestHelper.get_input_folder_path(self.tests_subpath, 'test_invalid_json')

        corpus = CdmCorpusDefinition()
        corpus.storage.mount('local', LocalAdapter(test_input_path))
        corpus.storage.default_namespace = 'local'

        invalid_manifest = None
        try:
            invalid_manifest = await corpus.fetch_object_async('local:/invalidManifest.manifest.cdm.json')
        except Exception as e:
            self.fail('Error should not be thrown when input json is invalid.')

        self.assertIsNone(invalid_manifest)

    @async_test
    async def test_loading_invalid_model_json_name(self):
        test_input_path = TestHelper.get_input_folder_path(self.tests_subpath, 'test_loading_invalid_model_json_name')

        corpus = CdmCorpusDefinition()
        corpus.storage.mount('local', LocalAdapter(test_input_path))
        corpus.storage.default_namespace = 'local'

        # We are trying to load a file with an invalid name, so fetch_object_async should just return null.
        invalid_model_json = await corpus.fetch_object_async('test.model.json')
        self.assertIsNone(invalid_model_json)

    @async_test
    async def test_saving_invalid_model_json_name(self):
        corpus = CdmCorpusDefinition()
        corpus.ctx.report_at_level = CdmStatusLevel.WARNING
        corpus.storage.unmount('cdm')
        corpus.storage.default_namespace = 'local'
        manifest = CdmManifestDefinition(corpus.ctx, 'manifest')
        corpus.storage.fetch_root_folder('local').documents.append(manifest)

        all_docs = {}  # type: Dict[str, str]
        test_adapter = TestStorageAdapter(all_docs)
        corpus.storage._set_adapter('local', test_adapter)

        new_manifest_from_model_json_name = 'my.model.json'
        await manifest.save_as_async(new_manifest_from_model_json_name, True)
        # TODO: because we can load documents properly now, SaveAsAsync returns false. Will check the value returned from SaveAsAsync() when the problem is solved
        self.assertFalse('/' + new_manifest_from_model_json_name in all_docs)
