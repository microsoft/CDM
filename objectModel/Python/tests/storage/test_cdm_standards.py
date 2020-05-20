# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import unittest

from tests.common import async_test
from cdm.storage import CdmStandardsAdapter

class CdmStandardsAdapterTests(unittest.TestCase):
    """Tests if the CdmStandardsAdapter functions correctly."""

    ENDPOINT = 'https://cdm-schema.microsoft.com/logical'
    TEST_FILE_PATH = '/foundations.cdm.json'

    def test_create_adapter_path(self):
        """Tests if the adapter path is created correctly."""
        adapter = CdmStandardsAdapter()
        corpus_path = self.TEST_FILE_PATH
        adapter_path = adapter.create_adapter_path(corpus_path)
        self.assertEqual(self.ENDPOINT + corpus_path, adapter_path)

    def test_create_corpus_path(self):
        """Tests if the corpus path is created correctly."""
        adapter = CdmStandardsAdapter()
        adapter_path = self.ENDPOINT + self.TEST_FILE_PATH
        corpus_path = adapter.create_corpus_path(adapter_path)
        self.assertEqual(self.TEST_FILE_PATH, corpus_path)

    @async_test
    async def test_read_async(self):
        """Tests if the adapter is able to read correctly."""
        adapter = CdmStandardsAdapter()
        foundations = await adapter.read_async(self.TEST_FILE_PATH)
        self.assertIsNotNone(foundations)
