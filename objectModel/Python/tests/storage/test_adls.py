# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

import datetime
import json
import unittest
import unittest.mock as mock

import dateutil.tz

from tests.common import async_test
from cdm.storage.adls import ADLSAdapter


class AdlsStorageAdapterTestCase(unittest.TestCase):

    def setUp(self):
        self.adapter = ADLSAdapter(root='/fs', hostname='dummy.dfs.core.windows.net', tenant='dummyTenant', resource='dummyResource',
                                   client_id='dummyClientId', secret='dummySecret')
        self.adapter.number_of_retries = 0

    @mock.patch('cdm.utilities.network.cdm_http_client.urllib.request.urlopen', new_callable=mock.mock_open, read_data=json.dumps({'Ḽơᶉëᶆ': 'ȋṕšᶙṁ'}).encode())
    @mock.patch('cdm.storage.adls.adal.AuthenticationContext.acquire_token_with_client_credentials')
    @async_test
    async def test_read(self, mock_credentials, mock_urlopen):

        mock_credentials.return_value = {'tokenType': 'Bearer', 'accessToken': 'dummyBearerToken'}

        raw_data = await self.adapter.read_async('/dir1/dir2/file.json')
        data = json.loads(raw_data)

        mock_credentials.assert_called_once_with('https://storage.azure.com', 'dummyClientId', 'dummySecret')

        self.assertEqual(mock_urlopen.call_args[0][0].method, 'GET')
        self.assertEqual(mock_urlopen.call_args[0][0].full_url, 'https://dummy.dfs.core.windows.net/fs/dir1/dir2/file.json')
        self.assertEqual(mock_urlopen.call_args[0][0].headers, {'Authorization': 'Bearer dummyBearerToken'})
        self.assertEqual(data, {'Ḽơᶉëᶆ': 'ȋṕšᶙṁ'})  # Verify data.

    @mock.patch('cdm.utilities.network.cdm_http_client.urllib.request.urlopen', new_callable=mock.mock_open)
    @mock.patch('cdm.storage.adls.adal.AuthenticationContext.acquire_token_with_client_credentials')
    @async_test
    async def test_write(self, mock_credentials, mock_urlopen):

        mock_credentials.return_value = {'tokenType': 'Bearer', 'accessToken': 'dummyBearerToken'}

        raw_data = json.dumps({'Ḽơᶉëᶆ': 'ȋṕšᶙṁ'})
        await self.adapter.write_async('/dir1/dir2/file.json', raw_data)

        self.assertEqual(len(mock_urlopen.call_args_list), 3)

        # Request 1.
        self.assertEqual(mock_urlopen.call_args_list[0][0][0].method, 'PUT')
        self.assertEqual(mock_urlopen.call_args_list[0][0][0].full_url, 'https://dummy.dfs.core.windows.net/fs/dir1/dir2/file.json?resource=file')
        self.assertEqual(mock_urlopen.call_args_list[0][0][0].headers, {'Authorization': 'Bearer dummyBearerToken'})

        # Request 2.
        self.assertEqual(mock_urlopen.call_args_list[1][0][0].method, 'PATCH')
        self.assertEqual(mock_urlopen.call_args_list[1][0][0].full_url,
                         'https://dummy.dfs.core.windows.net/fs/dir1/dir2/file.json?action=append&position=0')
        self.assertEqual(mock_urlopen.call_args_list[1][0][0].data, raw_data)
        self.assertEqual(mock_urlopen.call_args_list[1][0][0].headers, {'Authorization': 'Bearer dummyBearerToken', 'Content-type': 'application/json'})

        # Request 3.
        self.assertEqual(mock_urlopen.call_args_list[2][0][0].method, 'PATCH')
        self.assertEqual(mock_urlopen.call_args_list[2][0][0].full_url,
                         'https://dummy.dfs.core.windows.net/fs/dir1/dir2/file.json?action=flush&position=68')
        self.assertIsNone(mock_urlopen.call_args_list[2][0][0].data)
        self.assertEqual(mock_urlopen.call_args_list[2][0][0].headers, {'Authorization': 'Bearer dummyBearerToken'})

    @mock.patch('cdm.utilities.network.cdm_http_client.urllib.request.urlopen', new_callable=mock.mock_open)
    @mock.patch('cdm.storage.adls.adal.AuthenticationContext.acquire_token_with_client_credentials')
    @async_test
    async def test_fetch_last_modified_time(self, mock_credentials, mock_urlopen):

        mock_credentials.return_value = {'tokenType': 'Bearer', 'accessToken': 'dummyBearerToken'}

        mock_urlopen.return_value.status = 200
        mock_urlopen.return_value.reason = 'OK'
        mock_urlopen.return_value.getheaders = mock.MagicMock(side_effect=lambda: {'Last-Modified': 'Mon, 31 Dec 2018 23:59:59 GMT'})

        time = await self.adapter.compute_last_modified_time_async('https://dummy.dfs.core.windows.net/fs/dir1/dir2/file.json')

        self.assertEqual(mock_urlopen.call_args[0][0].method, 'HEAD')
        self.assertEqual(mock_urlopen.call_args[0][0].full_url, 'https://dummy.dfs.core.windows.net/fs/dir1/dir2/file.json')
        self.assertEqual(mock_urlopen.call_args[0][0].headers, {'Authorization': 'Bearer dummyBearerToken'})
        self.assertEqual(time, datetime.datetime(2018, 12, 31, 23, 59, 59, tzinfo=dateutil.tz.tzutc()))  # Verify modified time.

    @async_test
    async def test_fetch_all_files(self):

        with mock.patch('cdm.storage.adls.adal.AuthenticationContext.acquire_token_with_client_credentials') as mock_credentials:

            mock_credentials.return_value = {'tokenType': 'Bearer', 'accessToken': 'dummyBearerToken'}

            list_response = json.dumps({
                'paths': [
                    {'name': 'dir1/dir2', 'isDirectory': 'true'},
                    {'name': 'dir1/dir2/file1.json', 'isDirectory': 'false'},
                    {'name': 'dir1/dir2/file2.json'}
                ]}).encode()

            # Folder path.
            with mock.patch('cdm.utilities.network.cdm_http_client.urllib.request.urlopen', mock.mock_open(read_data=list_response)) as mock_urlopen:
                mock_urlopen.return_value.status = 200
                mock_urlopen.return_value.reason = 'OK'
                all_files = await self.adapter.fetch_all_files_async('/dir1/dir2')

                self.assertEqual(mock_urlopen.call_args[0][0].method, 'GET')
                self.assertEqual(mock_urlopen.call_args[0][0].full_url,
                                 'https://dummy.dfs.core.windows.net/fs?directory=dir1/dir2&recursive=True&resource=filesystem')
                self.assertEqual(mock_urlopen.call_args[0][0].headers, {'Authorization': 'Bearer dummyBearerToken'})
                self.assertEqual(all_files, ['/dir1/dir2/file1.json', '/dir1/dir2/file2.json'])  # Verify data.

            # Root path.
            with mock.patch('cdm.utilities.network.cdm_http_client.urllib.request.urlopen', mock.mock_open(read_data=list_response)) as mock_urlopen:
                all_files = await self.adapter.fetch_all_files_async('/')

                self.assertEqual(mock_urlopen.call_args[0][0].full_url,
                                 'https://dummy.dfs.core.windows.net/fs?directory=&recursive=True&resource=filesystem')


if __name__ == '__main__':
    unittest.main()
