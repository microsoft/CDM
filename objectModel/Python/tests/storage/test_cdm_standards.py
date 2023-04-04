# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from tests.common import async_test
from cdm.storage import CdmStandardsAdapter


class CdmStandardsAdapterTests(unittest.TestCase):
    """Tests if the CdmStandardsAdapter functions correctly."""

    ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../commondatamodel_objectmodel_cdmstandards/schema_documents'))
    RELATIVE_PATH_SCHEMA = './schema_documents/'
    EXTENSION_FILE_PATH = '/extensions/pbi.extension.cdm.json'
    EXTENSION_FILE_PATH_BACKSLASH = '\extensions\pbi.extension.cdm.json'
    EXTENSION_FILE_PATH_RELATIVE = 'extensions\pbi.extension.cdm.json'
    PRIMITIVES_FILE_PATH = '/cdmfoundation/foundations.cdm.json'
    INVALID_FILE_PATH = 'invalidFile.cdm.json'

    def test_create_corpus_path(self):
        """Tests if the corpus path is created correctly."""
        adapter = CdmStandardsAdapter()
        adapter_path = os.path.join(self.ROOT, self.EXTENSION_FILE_PATH[1:])
        corpus_path = adapter.create_corpus_path(adapter_path)
        self.assertEqual(self.EXTENSION_FILE_PATH, corpus_path)
        adapter_path = os.path.join(self.ROOT, self.PRIMITIVES_FILE_PATH[1:])
        corpus_path = adapter.create_corpus_path(adapter_path)
        self.assertEqual(self.PRIMITIVES_FILE_PATH, corpus_path)

    def test_create_adapter_path(self):
        """Tests if the adapter path is created correctly."""
        adapter = CdmStandardsAdapter()
        adapter_path = adapter.create_adapter_path(self.EXTENSION_FILE_PATH)
        self.assertEqual(adapter_path, os.path.join(self.ROOT, self.EXTENSION_FILE_PATH[1:]))
        adapter_path = adapter.create_adapter_path(self.EXTENSION_FILE_PATH_BACKSLASH)
        self.assertEqual(adapter_path, os.path.join(self.ROOT, self.EXTENSION_FILE_PATH_BACKSLASH[1:]))
        adapter_path = adapter.create_adapter_path(self.EXTENSION_FILE_PATH_RELATIVE)
        self.assertEqual(adapter_path, os.path.join(self.ROOT, self.EXTENSION_FILE_PATH_RELATIVE))
        adapter_path = adapter.create_adapter_path(self.PRIMITIVES_FILE_PATH)
        self.assertEqual(adapter_path, os.path.join(self.ROOT, self.PRIMITIVES_FILE_PATH[1:]))

    @async_test
    async def test_read_async(self):
        """Tests if the adapter is able to read correctly."""
        adapter = CdmStandardsAdapter()
        extensions = await adapter.read_async(self.EXTENSION_FILE_PATH)
        extensions_backslash = await adapter.read_async(self.EXTENSION_FILE_PATH_BACKSLASH)
        extensions_relative = await adapter.read_async(self.EXTENSION_FILE_PATH_RELATIVE)
        primitives = await adapter.read_async(self.PRIMITIVES_FILE_PATH)
        self.assertIsNotNone(extensions)
        self.assertIsNotNone(extensions_backslash)
        self.assertIsNotNone(extensions_relative)
        self.assertIsNotNone(primitives)
