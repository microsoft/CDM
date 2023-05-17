# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest
from tests.common import async_test

from cdm.storage import CdmCustomPackageAdapter
from cdm.storage import CdmStandardsAdapter
import commondatamodel_objectmodel_cdmstandards as cdmstandards


class CdmCustomPackageAdapterTests(unittest.TestCase):
    """Tests if the CdmCustomPackageAdapter functions correctly."""

    RELATIVE_PATH_SCHEMA = './schema_documents/'
    EXTENSION_FILE_PATH = '/extensions/pbi.extension.cdm.json'
    FOUNDATIONS_FILE_PATH = '/cdmfoundation/foundations.cdm.json'
    INVALID_FILE_PATH = 'invalidFile.cdm.json'

    cdmstandards_folder = os.path.join(os.path.dirname(cdmstandards.__file__), 'schema_documents')

    def test_package_not_found(self):
        """Tests if the adapter handles correctly if the package cannot be found."""
        error_called = False
        try:
            CdmCustomPackageAdapter('someInvalidPackage')
        except Exception as e:
            error_called = True
            self.assertTrue('Couldn\'t find package \'someInvalidPackage\'' in str(e))

        self.assertTrue(error_called)

    def test_cdmstandards_create_corpus_path(self):
        """Tests if the corpus path is created correctly."""
        adapter = CdmStandardsAdapter()
        adapter_path = os.path.join(self.cdmstandards_folder, self.EXTENSION_FILE_PATH[1:])
        corpus_path = adapter.create_corpus_path(adapter_path)
        self.assertEqual(self.EXTENSION_FILE_PATH, corpus_path)
        adapter_path = os.path.join(self.cdmstandards_folder, self.FOUNDATIONS_FILE_PATH[1:])
        corpus_path = adapter.create_corpus_path(adapter_path)
        self.assertEqual(self.FOUNDATIONS_FILE_PATH, corpus_path)

    def test_cdmstandards_create_adapter_path(self):
        """Tests if the adapter path is created correctly."""
        adapter = CdmStandardsAdapter()
        adapter_path = adapter.create_adapter_path(self.EXTENSION_FILE_PATH)
        self.assertEqual(adapter_path, os.path.join(self.cdmstandards_folder, self.EXTENSION_FILE_PATH[1:]))
        adapter_path = adapter.create_adapter_path(self.FOUNDATIONS_FILE_PATH)
        self.assertEqual(adapter_path, os.path.join(self.cdmstandards_folder, self.FOUNDATIONS_FILE_PATH[1:]))

    @async_test
    async def test_cdmstandards_read_async(self):
        """Tests if the adapter is able to read correctly."""
        adapter = CdmStandardsAdapter()
        extensions = await adapter.read_async(self.EXTENSION_FILE_PATH)
        primitives = await adapter.read_async(self.FOUNDATIONS_FILE_PATH)
        self.assertIsNotNone(extensions)
        self.assertIsNotNone(primitives)

        try:
            await adapter.read_async(self.INVALID_FILE_PATH)
        except Exception as e:
            error_message_substring = 'No such file or directory:'
            self.assertTrue(error_message_substring in  str(e))
            error_was_thrown = True

        self.assertTrue(error_was_thrown)

    @async_test
    async def test_custom_package_in_constructor(self):
        """Tests if the CdmCustomPackageAdapter works when assembly is passed in the constructor"""
        adapter = CdmCustomPackageAdapter(cdmstandards, 'schema_documents')
        self.assertIsNotNone(await adapter.read_async(self.FOUNDATIONS_FILE_PATH))
