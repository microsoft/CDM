# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import unittest

from tests.common import async_test
from cdm.storage import ResourceAdapter


class ResourceAdapterTests(unittest.TestCase):
    _ROOT = 'Microsoft.CommonDataModel.ObjectModel.Resources'

    def test_create_corpus_path(self):
        """Tests if the calls to CreateCorpusPath return the expected corpus path."""

        adapter = ResourceAdapter()
        path = adapter.create_corpus_path('{}/extensions/pbi.extension.cdm.json'.format(self._ROOT))
        self.assertEqual('/extensions/pbi.extension.cdm.json', path)

        path = adapter.create_corpus_path('{}/primitives.cdm.json'.format(self._ROOT))
        self.assertEqual('/primitives.cdm.json', path)

    def test_create_adapter_path(self):
        """Tests if the calls to CreateAdapterPath return the expected adapter path."""

        adapter = ResourceAdapter()

        path = adapter.create_adapter_path('/extensions/pbi.extension.cdm.json')
        self.assertEqual('{}/extensions/pbi.extension.cdm.json'.format(self._ROOT), path)

        path = adapter.create_adapter_path('/primitives.cdm.json')
        self.assertEqual('{}/primitives.cdm.json'.format(self._ROOT), path)

    @async_test
    async def test_read_async(self):
        """Tests if the files from the resource adapter can be read correctly."""

        adapter = ResourceAdapter()

        self.assertIsNotNone(await adapter.read_async('/extensions/pbi.extension.cdm.json'))
        self.assertIsNotNone(await adapter.read_async('/primitives.cdm.json'))


if __name__ == '__main__':
    unittest.main()
