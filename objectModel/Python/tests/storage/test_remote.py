# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

import json
import unittest
import unittest.mock as mock

from tests.common import async_test
from cdm.storage.remote import RemoteAdapter


class RemoteStorageAdapterTestCase(unittest.TestCase):

    def setUp(self):
        hosts = {
            'contoso': 'http://contoso.com/dir1/dir2',
            'fineart': 'https://fineartschool.net'
        }

        self.adapter = RemoteAdapter(hosts=hosts, http_config={'number_of_retries': 0, 'timeout': 1000})

    def test_make_adapter_path(self):

        # Valid paths.
        self.assertEqual(self.adapter.create_adapter_path('/contoso/'), 'http://contoso.com/')
        self.assertEqual(self.adapter.create_adapter_path('/contoso/dir3/dir4/file.json'), 'http://contoso.com/dir3/dir4/file.json')
        self.assertEqual(self.adapter.create_adapter_path('/fineart/file.json'), 'https://fineartschool.net/file.json')

        # Invalid paths.
        self.assertRaises(ValueError, self.adapter.create_adapter_path, '')
        self.assertRaises(ValueError, self.adapter.create_adapter_path, '/')
        self.assertRaises(ValueError, self.adapter.create_adapter_path, '/contoso')
        self.assertRaises(ValueError, self.adapter.create_adapter_path, '/adapter/file.json')

    @mock.patch('cdm.storage.remote.uuid.uuid4')
    def test_make_corpus_path(self, mock_uuid4):

        mock_uuid4.side_effect = ['guid1', 'guid2']

        # Valid paths.
        self.assertEqual(self.adapter.create_corpus_path('http://contoso.com/'), '/contoso/')
        self.assertEqual(self.adapter.create_corpus_path('http://contoso.com/dir3/dir4/file.json'), '/contoso/dir3/dir4/file.json')
        self.assertEqual(self.adapter.create_corpus_path('https://fineartschool.net/file.json'), '/fineart/file.json')
        self.assertEqual(self.adapter.create_corpus_path('http://fineartschool.net/file.json'), '/guid1/file.json')
        self.assertEqual(self.adapter.create_corpus_path('https://fourthcoffee.com/file1.json'), '/guid2/file1.json')
        self.assertEqual(self.adapter.create_corpus_path('https://fourthcoffee.com/file2.json'), '/guid2/file2.json')

        # Invalid path.
        self.assertIsNone(self.adapter.create_corpus_path('contoso.com/'))

    @mock.patch('cdm.utilities.network.cdm_http_client.urllib.request.urlopen', new_callable=mock.mock_open, read_data=json.dumps({'Ḽơᶉëᶆ': 'ȋṕšᶙṁ'}).encode())
    @async_test
    async def test_read(self, mock_urlopen):

        raw_data = await self.adapter.read_async('/contoso/dir3/dir4/file.json')
        data = json.loads(raw_data)

        self.assertEqual(mock_urlopen.call_args[0][0].full_url, 'http://contoso.com/dir3/dir4/file.json')
        self.assertEqual(data, {'Ḽơᶉëᶆ': 'ȋṕšᶙṁ'})  # Verify data.


if __name__ == '__main__':
    unittest.main()
