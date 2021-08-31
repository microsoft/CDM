# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import datetime
from datetime import timezone
import time
import json
import unittest
import os

from tests.common import async_test, TestHelper
from tests.adls_test_helper import AdlsTestHelper
from cdm.enums import CdmStatusLevel
from cdm.storage.adls import ADLSAdapter
from cdm.enums import AzureCloudEndpoint
from cdm.utilities.network.token_provider import TokenProvider
from cdm.objectmodel import CdmCorpusDefinition

def IfRunTestsFlagNotSet():
    return (os.environ.get("ADLS_RUNTESTS") is None)

class FakeTokenProvider(TokenProvider):
    def get_token(self) -> str:
        return 'TOKEN'

class AdlsStorageAdapterTestCase(unittest.TestCase):
    test_subpath = 'Storage'

    def create_dummy_adapter(self):
        adapter = ADLSAdapter(root='/fs', hostname='dummy.dfs.core.windows.net', tenant='dummyTenant', resource='dummyResource',
            client_id='dummyClientId', secret='dummySecret')
        adapter.number_of_retries = 0
        return adapter

    async def run_write_read_test(self, adapter):
        filename = 'WriteReadTest/' + os.environ.get('USERNAME') + '_' + os.environ.get('COMPUTERNAME') + '_Python.txt'
        write_contents = str(datetime.datetime.now()) + '\n' + filename
        await adapter.write_async(filename, write_contents)
        read_contents = await adapter.read_async(filename)
        self.assertEqual(write_contents, read_contents)
    
    async def run_check_filetime_test(self, adapter):    
        offset1 = await adapter.compute_last_modified_time_async('/FileTimeTest/CheckFileTime.txt')
        offset2 = await adapter.compute_last_modified_time_async('FileTimeTest/CheckFileTime.txt')

        self.assertTrue(offset1)
        self.assertTrue(offset2)
        self.assertTrue(offset1 == offset2)

        utc_now = datetime.datetime.utcnow().replace(tzinfo=timezone.utc)
        self.assertTrue(offset1 < utc_now)    

    async def run_file_enum_test(self, adapter):
        context = adapter.create_file_query_cache_context()
        try:
            files1 = await adapter.fetch_all_files_async('/FileEnumTest/')
            files2 = await adapter.fetch_all_files_async('/FileEnumTest')
            files3 = await adapter.fetch_all_files_async('FileEnumTest/')
            files4 = await adapter.fetch_all_files_async('FileEnumTest')

            # expect 100 files to be enumerated
            self.assertTrue(len(files1) == 100 and len(files2)== 100 and len(files3) == 100 and len(files4) == 100)

            # these calls should be fast due to cache                
            start = time.time()
            for i in range(0,len(files1) - 1):
                self.assertTrue(files1[i] == files2[i] and files1[i] == files3[i] and files1[i] == files4[i])
                await adapter.compute_last_modified_time_async(files1[i]);    
            stop = time.time()

            self.assertLess(stop - start, .1, 'Checking cached file modified times took too long')
        finally:
            context.dispose()
    
    async def run_special_characters_test(self, adapter):
        corpus = CdmCorpusDefinition()
        corpus.storage.mount('adls', adapter)
        corpus.storage.default_namespace = 'adls'
        
        manifest = await corpus.fetch_object_async('default.manifest.cdm.json')
        await manifest.file_status_check_async()
        self.assertEqual(len(manifest.entities), 1)
        self.assertEqual(len(manifest.entities[0].data_partitions), 2)

        self.assertEqual(manifest.entities[0].data_partitions[0].location, 'TestEntity-With=Special Characters/year=2020/TestEntity-partition-With=Special Characters-0.csv')
        self.assertEqual(manifest.entities[0].data_partitions[1].location, 'TestEntity-With=Special Characters/year=2020/TestEntity-partition-With=Special Characters-1.csv')

    @async_test
    @unittest.skipIf(IfRunTestsFlagNotSet(), 'ADLS environment variables not set up')
    async def test_adls_write_read_shared_key(self):
        await self.run_write_read_test(AdlsTestHelper.create_adapter_with_shared_key())

    @async_test
    @unittest.skipIf(IfRunTestsFlagNotSet(), "ADLS environment variables not set up")
    async def test_adls_write_read_client_id(self):
        await self.run_write_read_test(AdlsTestHelper.create_adapter_with_client_id())

    @async_test
    @unittest.skipIf(IfRunTestsFlagNotSet(), "ADLS environment variables not set up")
    async def test_adls_write_read_with_blob_hostname(self):
        await self.run_write_read_test(AdlsTestHelper.create_adapter_with_shared_key('', True))
        await self.run_write_read_test(AdlsTestHelper.create_adapter_with_client_id('', False, True))

    @async_test
    @unittest.skipIf(IfRunTestsFlagNotSet(), 'ADLS environment variables not set up')
    async def test_adls_check_filetime_shared_key(self):
        await self.run_check_filetime_test(AdlsTestHelper.create_adapter_with_shared_key())

    @async_test
    @unittest.skipIf(IfRunTestsFlagNotSet(), 'ADLS environment variables not set up')
    async def test_adls_check_filetime_client_id(self):
        await self.run_check_filetime_test(AdlsTestHelper.create_adapter_with_client_id())

    @async_test
    @unittest.skipIf(IfRunTestsFlagNotSet(), 'ADLS environment variables not set up')
    async def test_adls_file_enum_shared_key(self):
        await self.run_file_enum_test(AdlsTestHelper.create_adapter_with_shared_key())

    @async_test
    @unittest.skipIf(IfRunTestsFlagNotSet(), 'ADLS environment variables not set up')
    async def test_adls_file_enum_client_id(self):
        await self.run_file_enum_test(AdlsTestHelper.create_adapter_with_client_id())

    @async_test
    @unittest.skipIf(IfRunTestsFlagNotSet(), 'ADLS environment variables not set up')
    async def test_adls_special_characters(self):
        await self.run_special_characters_test(AdlsTestHelper.create_adapter_with_client_id('PathWithSpecialCharactersAndUnescapedStringTest/Root-With=Special Characters:'))

    @async_test
    @unittest.skipIf(IfRunTestsFlagNotSet(), 'ADLS environment variables not set up')
    async def test_avoid_retry_codes(self):
        """Tests if the adapter won't retry if a HttpStatusCode response with a code in AvoidRetryCodes is received."""
        adls_adapter = AdlsTestHelper.create_adapter_with_shared_key()
        adls_adapter.number_of_retries = 3

        corpus = CdmCorpusDefinition()
        corpus.storage.mount('adls', adls_adapter)
        count = 0

        def callback(status, message: str):
            nonlocal count
            if message.find('Response for request ') != -1:
                count += 1

        corpus.set_event_callback(callback, CdmStatusLevel.PROGRESS)

        await corpus.fetch_object_async('adls:/inexistentFile.cdm.json')  # type: CdmDocumentDefinition

        self.assertEqual(1, count)

    def test_endpoint_missing_on_config(self):
        """Checks if the endpoint of the adls adapter is set to default if not present in the config parameters.
        This is necessary to support old config files that do not include an "endpoint"."""

        config = {
            'hostname': 'hostname.dfs.core.windows.net',
            'root': 'root',
            'tenant': 'tenant',
            'clientId': 'clientId'
        }

        adls_adapter = ADLSAdapter()
        adls_adapter.update_config(json.dumps(config))
        self.assertEqual(AzureCloudEndpoint.AZURE_PUBLIC, adls_adapter.endpoint)

    def test_formatted_hostname_from_config(self):
        """Test if formatted_hostname is properly set when loading from config."""

        config = {
            'hostname': 'hostname.dfs.core.windows.net',
            'root': 'root',
            'tenant': 'tenant',
            'clientId': 'clientId'
        }

        adls_adapter = ADLSAdapter()
        adls_adapter.update_config(json.dumps(config))

        corpus_path = adls_adapter.create_corpus_path('https://hostname.dfs.core.windows.net/root/partitions/data.csv')
        self.assertEqual('/partitions/data.csv', corpus_path)

    def test_create_corpus_and_adapter_path(self):
        host_1 = 'storageaccount.dfs.core.windows.net'
        root = '/fs'
        adls_adapter = ADLSAdapter(root=root, hostname=host_1, tenant='dummyTenant',
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
        self.assertEqual('https://storageaccount.dfs.core.windows.net/fs/a/path%3Awith%3Acolons/some-file.json', adls_adapter.create_adapter_path(corpus_path_with_colons))
        self.assertEqual('/a/path:with:colons/some-file.json', adls_adapter.create_corpus_path('https://storageaccount.dfs.core.windows.net/fs/a/path%3Awith%3Acolons/some-file.json'))
        self.assertEqual('/a/path:with:colons/some-file.json', adls_adapter.create_corpus_path('https://storageaccount.dfs.core.windows.net/fs/a/path%3awith%3acolons/some-file.json'))

        # Check other special characters
        self.assertEqual('https://storageaccount.dfs.core.windows.net/fs/a/path%20with%3Dspecial%3Dcharacters/some-file.json', adls_adapter.create_adapter_path('namespace:/a/path with=special=characters/some-file.json'))
        self.assertEqual('/a/path with=special=characters/some-file.json', adls_adapter.create_corpus_path('https://storageaccount.dfs.core.windows.net/fs/a/path%20with%3dspecial%3dcharacters/some-file.json'))
        self.assertEqual('/a/path with=special=characters/some-file.json', adls_adapter.create_corpus_path('https://storageaccount.dfs.core.windows.net/fs/a/path%20with%3dspecial%3Dcharacters/some-file.json'))

        # Check that an adapter path is null if the corpus path provided is null
        self.assertIsNone(adls_adapter.create_adapter_path(None))

        host_2 = 'storageaccount.blob.core.windows.net:8888'
        adls_adapter = ADLSAdapter(root=root, hostname=host_2, tenant='11111111-1111-1111-1111-111111111111',
                                   client_id='dummyClientId', secret='dummySecret')
        adapter_path_5 = 'https://storageaccount.blob.core.windows.net:8888/fs/a/5.csv'
        adapter_path_6 = 'https://storageaccount.dfs.core.windows.net:8888/fs/a/6.csv'
        adapter_path_7 = 'https://storageaccount.blob.core.windows.net/fs/a/7.csv'

        self.assertEqual(adls_adapter.create_corpus_path(adapter_path_5), '/a/5.csv')
        self.assertEqual(adls_adapter.create_corpus_path(adapter_path_6), '/a/6.csv')
        self.assertEqual(adls_adapter.create_corpus_path(adapter_path_7), None)

    def test_config_and_update_config_without_secret(self):
        """
        The secret property is not saved to the config.json file for security reasons.
        When constructing and ADLS adapter from config, the user should be able to set the secret after the adapter is constructed.
        """
        config = {
            'root': 'root',
            'hostname': 'hostname',
            'tenant': 'tenant',
            'clientId': 'clientId',
        }

        try:
            adls_adapter1 = ADLSAdapter()
            adls_adapter1.update_config(json.dumps(config))
            adls_adapter1.client_id = 'clientId'
            adls_adapter1.secret = 'secret'
            adls_adapter1.shared_key = 'sharedKey'
            adls_adapter1.token_provider = FakeTokenProvider()
        except Exception:
            self.fail('adls_adapter initialized without secret shouldn\'t throw exception when updating config.')

        try:
            adls_adapter2 = ADLSAdapter()
            adls_adapter2.client_id = 'clientId'
            adls_adapter2.secret = 'secret'
            adls_adapter2.shared_key = 'sharedKey'
            adls_adapter2.token_provider = FakeTokenProvider()
            adls_adapter2.update_config(json.dumps(config))
        except Exception:
            self.fail('adls_adapter initialized without secret shouldn\'t throw exception when updating config.')

    def test_initialize_hostname_and_root(self):
        """
        Test initialize hostname and root for adls adapter.
        """
        host1 = 'storageaccount.dfs.core.windows.net'
        adlsAdapter1 = ADLSAdapter(hostname=host1, root='root-without-slash', shared_key='')
        self.assertEqual(adlsAdapter1.hostname, 'storageaccount.dfs.core.windows.net')
        self.assertEqual(adlsAdapter1.root, '/root-without-slash')

        adapterPath1 = 'https://storageaccount.dfs.core.windows.net/root-without-slash/a/1.csv'
        corpusPath1 = adlsAdapter1.create_corpus_path(adapterPath1)
        self.assertEqual(corpusPath1, '/a/1.csv')
        self.assertEqual(adlsAdapter1.create_adapter_path(corpusPath1), adapterPath1)

        adlsAdapter1WithFolders = ADLSAdapter(hostname=host1, root='root-without-slash/folder1/folder2', shared_key='')
        self.assertEqual(adlsAdapter1WithFolders.root, '/root-without-slash/folder1/folder2')
            
        adapterPath2 = 'https://storageaccount.dfs.core.windows.net/root-without-slash/folder1/folder2/a/1.csv'
        corpusPath2 = adlsAdapter1WithFolders.create_corpus_path(adapterPath2)
        self.assertEqual(corpusPath2, '/a/1.csv')
        self.assertEqual(adlsAdapter1WithFolders.create_adapter_path(corpusPath2), adapterPath2)

        adlsAdapter2 = ADLSAdapter(hostname=host1, root='/root-starts-with-slash', shared_key='')
        self.assertEqual(adlsAdapter2.root, '/root-starts-with-slash') 
        adlsAdapter2WithFolders = ADLSAdapter(hostname=host1, root='/root-starts-with-slash/folder1/folder2', shared_key='')
        self.assertEqual(adlsAdapter2WithFolders.root, '/root-starts-with-slash/folder1/folder2')

        adlsAdapter3 = ADLSAdapter(hostname=host1, root='root-ends-with-slash/', shared_key='')
        self.assertEqual(adlsAdapter3.root, '/root-ends-with-slash')
        adlsAdapter3WithFolders = ADLSAdapter(hostname=host1, root='root-ends-with-slash/folder1/folder2/', shared_key='')
        self.assertEqual(adlsAdapter3WithFolders.root, '/root-ends-with-slash/folder1/folder2')

        adlsAdapter4 = ADLSAdapter(hostname=host1, root='/root-with-slashes/', shared_key='')
        self.assertEqual(adlsAdapter4.root, '/root-with-slashes')
        adlsAdapter4WithFolders = ADLSAdapter(hostname=host1, root='/root-with-slashes/folder1/folder2', shared_key='')
        self.assertEqual(adlsAdapter4WithFolders.root, '/root-with-slashes/folder1/folder2')

        # Mount from config
        config = TestHelper.get_input_file_content(self.test_subpath, 'test_initialize_hostname_and_root', 'config.json')
        corpus = CdmCorpusDefinition()
        corpus.storage.mount_from_config(config)
        self.assertEqual(corpus.storage.fetch_adapter('adlsadapter1').root, '/root-without-slash')
        self.assertEqual(corpus.storage.fetch_adapter('adlsadapter2').root, '/root-without-slash/folder1/folder2')
        self.assertEqual(corpus.storage.fetch_adapter('adlsadapter3').root, '/root-starts-with-slash/folder1/folder2')
        self.assertEqual(corpus.storage.fetch_adapter('adlsadapter4').root, '/root-ends-with-slash/folder1/folder2')
        self.assertEqual(corpus.storage.fetch_adapter('adlsadapter5').root, '/root-with-slashes/folder1/folder2')

    def test_loading_and_saving_endpoint_in_config(self):
        """
        Test azure cloud endpoint in config.
        """
        # Mount from config
        config = TestHelper.get_input_file_content(self.test_subpath, 'test_loading_and_saving_endpoint_in_config',
                                                   'config.json')
        corpus = CdmCorpusDefinition()
        corpus.storage.mount_from_config(config)
        self.assertFalse(hasattr(corpus.storage.fetch_adapter('adlsadapter1'), 'endpoint'))
        self.assertEqual(corpus.storage.fetch_adapter('adlsadapter2').endpoint, AzureCloudEndpoint.AZURE_PUBLIC)
        self.assertEqual(corpus.storage.fetch_adapter('adlsadapter3').endpoint, AzureCloudEndpoint.AZURE_CHINA)
        self.assertEqual(corpus.storage.fetch_adapter('adlsadapter4').endpoint, AzureCloudEndpoint.AZURE_GERMANY)
        self.assertEqual(corpus.storage.fetch_adapter('adlsadapter5').endpoint, AzureCloudEndpoint.AZURE_US_GOVERNMENT)

        try:
            config_snake_case = TestHelper.get_input_file_content(self.test_subpath, 'test_loading_and_saving_endpoint_in_config',
                                                       'config-SnakeCase.json')
            corpus_snake_case = CdmCorpusDefinition()
            corpus_snake_case.storage.mount_from_config(config_snake_case)
            self.fail('Expected RuntimeException for config.json using endpoint value in snake case.')
        except Exception as ex:
            message = 'Endpoint value should be a string of an enumeration value from the class AzureCloudEndpoint in Pascal case.'
            self.assertEqual(ex.args[0], message)

if __name__ == '__main__':
    unittest.main()
