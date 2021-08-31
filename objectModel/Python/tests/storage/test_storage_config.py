# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional
import json
import unittest

from cdm.storage import LocalAdapter
from cdm.objectmodel import CdmCorpusDefinition

from tests.common import async_test, TestHelper


class StorageConfigTest(unittest.TestCase):
    tests_subpath = 'Storage'

    def get_local_corpus(self, test_files_input_root: str, test_files_output_root: Optional[str] = None):
        """Gets local corpus."""

        cdm_corpus = CdmCorpusDefinition()
        cdm_corpus.storage.default_namespace = 'local'

        cdm_corpus.storage.mount('local', LocalAdapter(test_files_input_root))

        if test_files_output_root:
            cdm_corpus.storage.mount('target', LocalAdapter(test_files_output_root))

        return cdm_corpus

    @async_test
    async def test_loading_and_saving_config(self):
        """Testing loading and saving config."""
        test_name = 'test_loading_and_saving_config'
        test_input_path = TestHelper.get_input_folder_path(self.tests_subpath, test_name)

        test_output_path = TestHelper.get_expected_output_folder_path(self.tests_subpath, test_name)

        # Create a corpus to load the config.
        cdm_corpus = self.get_local_corpus(test_input_path, test_output_path)

        config = await cdm_corpus.storage.fetch_adapter('local').read_async('/config.json')

        different_corpus = CdmCorpusDefinition()
        different_corpus.storage.mount_from_config(config)

        result_config = different_corpus.storage.fetch_config()
        output_config = await cdm_corpus.storage.fetch_adapter('target').read_async('/config.json')

        self.maxDiff = None
        self.assertDictEqual(json.loads(output_config), json.loads(result_config))

    @async_test
    async def test_loading_config_and_trying_to_fetch_manifest(self):
        """Testing loading config and fetching a manifest with the defined adapters."""
        test_name = 'test_loading_config_and_trying_to_fetch_manifest'
        test_input_path = TestHelper.get_input_folder_path(self.tests_subpath, test_name)

        # Create a corpus to load the config.
        cdm_corpus = self.get_local_corpus(test_input_path)

        config = await cdm_corpus.storage.fetch_adapter('local').read_async('/config-Python.json')

        different_corpus = CdmCorpusDefinition()
        unrecognized_adapters = different_corpus.storage.mount_from_config(config, True)

        cdm_manifest = await different_corpus.fetch_object_async('model.json', cdm_corpus.storage.fetch_root_folder('local'))

        self.assertIsNotNone(cdm_manifest)
        self.assertEqual(1, len(unrecognized_adapters))
