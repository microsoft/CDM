# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import json
import os
import unittest
import unittest.mock as mock

from tests.common import async_test
from cdm.storage.local import LocalAdapter


class LocalStorageAdapterTestCase(unittest.TestCase):

    @mock.patch('cdm.storage.local.os.path.abspath')
    def test_make_adapter_path(self, mock_abspath):

        mock_abspath.side_effect = lambda path: os.path.normpath(os.path.join('C:\\dir1\\dir2', path))  # Copied from ntpath.abspath.

        # Absolute root path.
        adapter = LocalAdapter(root='C:\\dir3\\dir4')
        self.assertEqual(adapter.create_adapter_path('local:/dir5/dir6/file.json'), 'C:\\dir3\\dir4\\dir5\\dir6\\file.json')
        self.assertEqual(adapter.create_adapter_path('local:dir5/dir6/file.json'), 'C:\\dir3\\dir4\\dir5\\dir6\\file.json')
        self.assertEqual(adapter.create_adapter_path('local:file.json'), 'C:\\dir3\\dir4\\file.json')
        self.assertEqual(adapter.create_adapter_path('/dir5/dir6/file.json'), 'C:\\dir3\\dir4\\dir5\\dir6\\file.json')
        self.assertEqual(adapter.create_adapter_path('file.json'), 'C:\\dir3\\dir4\\file.json')

        # Non-absolute root path.
        adapter = LocalAdapter(root='dir3/dir4')
        self.assertEqual(adapter.create_adapter_path('local:/dir5/dir6/file.json'), 'C:\\dir1\\dir2\\dir3\\dir4\\dir5\\dir6\\file.json')
        self.assertEqual(adapter.create_adapter_path('file.json'), 'C:\\dir1\\dir2\\dir3\\dir4\\file.json')

        # No root path.
        adapter = LocalAdapter()
        self.assertEqual(adapter.create_adapter_path('local:/dir5/dir6/file.json'), 'C:\\dir1\\dir2\\dir5\\dir6\\file.json')
        self.assertEqual(adapter.create_adapter_path('file.json'), 'C:\\dir1\\dir2\\file.json')

        # Test that path with or without a leading slash returns the same result.
        adapter = LocalAdapter(root='C:/some/dir')
        path_with_leading_slash = adapter.create_adapter_path('/folder')
        path_without_leading_slash = adapter.create_adapter_path('folder')
        self.assertEqual(path_with_leading_slash, 'C:\\some\\dir\\folder')
        self.assertEqual(path_with_leading_slash, path_without_leading_slash)

    @mock.patch('cdm.storage.local.os.path.abspath')
    def test_make_corpus_path(self, mock_abspath):

        mock_abspath.side_effect = lambda path: os.path.normpath(os.path.join('C:\\dir1\\dir2', path))  # Copied from ntpath.abspath.

        # Absolute root path.
        adapter = LocalAdapter(root='C:\\dir1')
        self.assertEqual(adapter.create_corpus_path('C:\\dir1\\dir2\\dir3\\file.json'), '/dir2/dir3/file.json')  # Absolute path.
        self.assertEqual(adapter.create_corpus_path('dir3\\file.json'), '/dir2/dir3/file.json')  # Relative path.
        self.assertIsNone(adapter.create_corpus_path('C:\\dir4\\dir5\\file.json'))  # Unrecognized path.

        # Non-absolute root path.
        adapter = LocalAdapter(root='dir3')
        self.assertEqual(adapter.create_corpus_path('C:\\dir1\\dir2\\dir3\\dir4\\file.json'), '/dir4/file.json')  # Absolute path.
        self.assertEqual(adapter.create_corpus_path('dir3\\dir4\\file.json'), '/dir4/file.json')  # Relative path.
        self.assertIsNone(adapter.create_corpus_path('dir5\\dir6\\file.json'))  # Unrecognized path.

        # No root path.
        adapter = LocalAdapter()
        self.assertEqual(adapter.create_corpus_path('C:\\dir1\\dir2\\dir5\\dir6\\file.json'), '/dir5/dir6/file.json')
        self.assertEqual(adapter.create_corpus_path('C:\\dir1\\dir2\\file.json'), '/file.json')

    @mock.patch('cdm.storage.local.open', new_callable=mock.mock_open, read_data=json.dumps({'Ḽơᶉëᶆ': 'ȋṕšᶙṁ'}))
    @mock.patch('cdm.storage.local.os.path.abspath')
    @async_test
    async def test_read(self, mock_abspath, mock_open):

        mock_abspath.side_effect = lambda path: os.path.normpath(os.path.join('C:\\dir1\\dir2', path))  # Copied from ntpath.abspath.

        adapter = LocalAdapter(root='dir3/dir4')
        raw_data = await adapter.read_async('local:/dir5/dir6/file.json')
        data = json.loads(raw_data)

        mock_open.assert_called_once_with('C:\\dir1\\dir2\\dir3\\dir4\\dir5\\dir6\\file.json', 'r', encoding='utf-8')  # Verify file path.
        self.assertEqual(data, {'Ḽơᶉëᶆ': 'ȋṕšᶙṁ'})  # Verify data.

    @mock.patch('cdm.storage.local.open', new_callable=mock.mock_open)
    @mock.patch('cdm.storage.local.os.path.abspath')
    @async_test
    async def test_write(self, mock_abspath, mock_open):

        mock_abspath.side_effect = lambda path: os.path.normpath(os.path.join('C:\\dir1\\dir2', path))  # Copied from ntpath.abspath.

        adapter = LocalAdapter(root='dir3/dir4')
        await adapter.write_async('local:/dir5/dir6/file.json', json.dumps({'Ḽơᶉëᶆ': 'ȋṕšᶙṁ'}))

        mock_open.assert_called_once_with('C:\\dir1\\dir2\\dir3\\dir4\\dir5\\dir6\\file.json', 'w', encoding='utf-8')  # Verify file path.


if __name__ == '__main__':
    unittest.main()
