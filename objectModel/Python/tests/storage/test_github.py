# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

import json
import unittest
import unittest.mock as mock
import random

from tests.common import async_test
from cdm.storage.github import GithubAdapter


class GithubStorageAdapterTestCase(unittest.TestCase):

    def test_make_corpus_path(self):
        adapter = GithubAdapter()
        adapter.timeout = 2000
        adapter.maximum_timeout = 5000
        adapter.number_of_retries = 0

        # Valid path.
        self.assertEqual(adapter.create_corpus_path(
            'https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/dir1/dir2/file.json'), '/dir1/dir2/file.json')

        # Invalid path.
        self.assertIsNone(adapter.create_corpus_path('https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocument/dir1/dir2/file.json'))

    @mock.patch('cdm.utilities.network.cdm_http_client.urllib.request.urlopen', new_callable=mock.mock_open, read_data=json.dumps({'Ḽơᶉëᶆ': 'ȋṕšᶙṁ'}).encode())
    @async_test
    async def test_read(self, mock_urlopen):
        adapter = GithubAdapter()
        adapter.timeout = 2000
        adapter.maximum_timeout = 5000
        raw_data = await adapter.read_async('/dir1/dir2/file.json')
        data = json.loads(raw_data)

        # Verify URL.
        self.assertEqual(mock_urlopen.call_args[0][0].full_url, 'https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments/dir1/dir2/file.json')
        self.assertEqual(data, {'Ḽơᶉëᶆ': 'ȋṕšᶙṁ'})  # Verify data.


if __name__ == '__main__':
    unittest.main()
