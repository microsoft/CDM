# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

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

    def test_create_corpus_and_adapter_path(self):
        host_1 = 'storageaccount.dfs.core.windows.net'
        root = '/fs'
        adls_adapter = ADLSAdapter(root=root, hostname=host_1, tenant='dummyTenant', resource='dummyResource',
                                   client_id='dummyClientId', secret='dummySecret')

        adapter_path_1 = 'https://storageaccount.dfs.core.windows.net/fs/a/1.csv'
        adapter_path_2 = 'https://storageaccount.dfs.core.windows.net:443/fs/a/2.csv'
        adapter_path_3 = 'https://storageaccount.blob.core.windows.net/fs/a/3.csv'
        adapter_path_4 = 'https://storageaccount.blob.core.windows.net:443/fs/a/4.csv'

        corpus_path_1 = adls_adapter.create_corpus_path(adapter_path_1)
        corpus_path_2 = adls_adapter.create_corpus_path(adapter_path_2)
        corpus_path_3 = adls_adapter.create_corpus_path(adapter_path_3)
        corpus_path_4 = adls_adapter.create_corpus_path(adapter_path_4)

        self.assertEqual(corpus_path_1, '/a/1.csv')
        self.assertEqual(corpus_path_2, '/a/2.csv')
        self.assertEqual(corpus_path_3, '/a/3.csv')
        self.assertEqual(corpus_path_4, '/a/4.csv')

        self.assertEqual(adls_adapter.create_adapter_path(corpus_path_1), adapter_path_1)
        self.assertEqual(adls_adapter.create_adapter_path(corpus_path_2), adapter_path_2)
        self.assertEqual(adls_adapter.create_adapter_path(corpus_path_3), adapter_path_3)
        self.assertEqual(adls_adapter.create_adapter_path(corpus_path_4), adapter_path_4)

        # Check that an adapter path is correctly created from a corpus path with any namespace
        corpus_path_with_namespace_1 = 'adls:/test.json'
        corpus_path_with_namespace_2 = 'mylake:/test.json'
        expected_adapter_path = 'https://storageaccount.dfs.core.windows.net/fs/test.json'

        self.assertEqual(expected_adapter_path, adls_adapter.create_adapter_path(corpus_path_with_namespace_1))
        self.assertEqual(expected_adapter_path, adls_adapter.create_adapter_path(corpus_path_with_namespace_2))

        # Check that an adapter path is correctly created from a corpus path with colons
        corpus_path_with_colons = 'namespace:/a/path:with:colons/some-file.json'
        self.assertEqual('https://storageaccount.dfs.core.windows.net/fs/a/path:with:colons/some-file.json', adls_adapter.create_adapter_path(corpus_path_with_colons))

        # Check that an adapter path is null if the corpus path provided is null
        self.assertIsNone(adls_adapter.create_adapter_path(None))

        host_2 = 'storageaccount.blob.core.windows.net:8888'
        adls_adapter = ADLSAdapter(root=root, hostname=host_2, tenant='dummyTenant', resource='dummyResource',
                                   client_id='dummyClientId', secret='dummySecret')
        adapter_path_5 = 'https://storageaccount.blob.core.windows.net:8888/fs/a/5.csv'
        adapter_path_6 = 'https://storageaccount.dfs.core.windows.net:8888/fs/a/6.csv'
        adapter_path_7 = 'https://storageaccount.blob.core.windows.net/fs/a/7.csv'

        self.assertEqual(adls_adapter.create_corpus_path(adapter_path_5), '/a/5.csv')
        self.assertEqual(adls_adapter.create_corpus_path(adapter_path_6), '/a/6.csv')
        self.assertEqual(adls_adapter.create_corpus_path(adapter_path_7), None)

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
        #[SuppressMessage("Microsoft.Security", "CS002:SecretInNextLine", Justification="Dummy token used for testing")]
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
        #[SuppressMessage("Microsoft.Security", "CS002:SecretInNextLine", Justification="Dummy token used for testing")]
        self.assertEqual(mock_urlopen.call_args_list[0][0][0].headers, {'Authorization': 'Bearer dummyBearerToken'})

        # Request 2.
        self.assertEqual(mock_urlopen.call_args_list[1][0][0].method, 'PATCH')
        self.assertEqual(mock_urlopen.call_args_list[1][0][0].full_url,
                         'https://dummy.dfs.core.windows.net/fs/dir1/dir2/file.json?action=append&position=0')
        self.assertEqual(mock_urlopen.call_args_list[1][0][0].data, raw_data.encode('utf-8'))
        #[SuppressMessage("Microsoft.Security", "CS002:SecretInNextLine", Justification="Dummy token used for testing")]
        self.assertEqual(mock_urlopen.call_args_list[1][0][0].headers, {'Authorization': 'Bearer dummyBearerToken', 'Content-type': 'application/json'})

        # Request 3.
        self.assertEqual(mock_urlopen.call_args_list[2][0][0].method, 'PATCH')
        self.assertEqual(mock_urlopen.call_args_list[2][0][0].full_url,
                         'https://dummy.dfs.core.windows.net/fs/dir1/dir2/file.json?action=flush&position=68')
        self.assertIsNone(mock_urlopen.call_args_list[2][0][0].data)
        #[SuppressMessage("Microsoft.Security", "CS002:SecretInNextLine", Justification="Dummy token used for testing")]
        self.assertEqual(mock_urlopen.call_args_list[2][0][0].headers, {'Authorization': 'Bearer dummyBearerToken'})

    @mock.patch('cdm.utilities.network.cdm_http_client.urllib.request.urlopen', new_callable=mock.mock_open)
    @mock.patch('cdm.storage.adls.adal.AuthenticationContext.acquire_token_with_client_credentials')
    @async_test
    async def test_fetch_last_modified_time(self, mock_credentials, mock_urlopen):

        mock_credentials.return_value = {'tokenType': 'Bearer', 'accessToken': 'dummyBearerToken'}

        mock_urlopen.return_value.status = 200
        mock_urlopen.return_value.reason = 'OK'
        mock_urlopen.return_value.getheaders = mock.MagicMock(side_effect=lambda: {'Last-Modified': 'Mon, 31 Dec 2018 23:59:59 GMT'})

        time = await self.adapter.compute_last_modified_time_async('dir1/dir2/file.json')

        self.assertEqual(mock_urlopen.call_args[0][0].method, 'HEAD')
        self.assertEqual(mock_urlopen.call_args[0][0].full_url, 'https://dummy.dfs.core.windows.net/fs/dir1/dir2/file.json')
        #[SuppressMessage("Microsoft.Security", "CS002:SecretInNextLine", Justification="Dummy token used for testing")]
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
                #[SuppressMessage("Microsoft.Security", "CS002:SecretInNextLine", Justification="Dummy token used for testing")]
                self.assertEqual(mock_urlopen.call_args[0][0].headers, {'Authorization': 'Bearer dummyBearerToken'})
                self.assertEqual(all_files, ['/dir1/dir2/file1.json', '/dir1/dir2/file2.json'])  # Verify data.

            # Root path.
            with mock.patch('cdm.utilities.network.cdm_http_client.urllib.request.urlopen', mock.mock_open(read_data=list_response)) as mock_urlopen:
                all_files = await self.adapter.fetch_all_files_async('/')

                self.assertEqual(mock_urlopen.call_args[0][0].full_url,
                                 'https://dummy.dfs.core.windows.net/fs?directory=&recursive=True&resource=filesystem')

    def test_config_and_update_config_without_secret(self):
        """
        The secret property is not saved to the config.json file for security reasons.
        When constructing and ADLS adapter from config, the user should be able to set the secret after the adapter is constructed.
        """
        adls_adapter = ADLSAdapter()

        try:
            config = {
                'root': 'root',
                'hostname': 'hostname',
                'tenant': 'tenant',
                'clientId': 'clientId',
            }
            adls_adapter.update_config(json.dumps(config))
            adls_adapter.secret = 'secret'
            adls_adapter.shared_key = 'sharedKey'
        except Exception:
            self.fail('adls_adapter initialized without secret shouldn\'t throw exception when updating config.')


if __name__ == '__main__':
    unittest.main()
