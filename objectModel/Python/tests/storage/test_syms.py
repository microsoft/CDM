# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import json
import unittest

from tests.common import async_test, TestHelper
from tests.syms_test_helper import SymsTestHelper
from cdm.storage.syms import SymsAdapter
from cdm.utilities.network.token_provider import TokenProvider


class FakeTokenProvider(TokenProvider):
    def get_token(self) -> str:
        return 'TOKEN'

class SymsStorageAdapterTestCase(unittest.TestCase):
    test_subpath = 'Storage'
    api_version = 'api-version=2021-04-01'
    databases_manifest = 'databases.manifest.cdm.json'
    test_name = 'TestSymsAdapter'
    database_name = 'SymsTestDatabase'

    async def run_create_database(self, adapter: SymsAdapter, request: str, expected_response: str):
        await adapter.write_async('{}/{}.manifest.cdm.json'.format(self.database_name, self.database_name), request)
        actual_response = await adapter.read_async('{}/{}.manifest.cdm.json'.format(self.database_name, self.database_name))
        self.assertTrue(SymsTestHelper.json_object_should_be_equal_as_expected(expected_response, json.loads(actual_response)))

    async def run_create_or_update_table(self, adapter: SymsAdapter, table_name:str, request: str, expected_response: str):
        await adapter.write_async('{}/{}.cdm.json'.format(self.database_name, table_name), request)
        actual_response = await adapter.read_async('{}/{}.cdm.json'.format(self.database_name, table_name))
        self.assertTrue(SymsTestHelper.json_object_should_be_equal_as_expected(expected_response, json.loads(actual_response)))

    async def run_remove_table(self, adapter: SymsAdapter, table_name: str):
        await adapter.write_async('{}/{}.cdm.json'.format(self.database_name,table_name), None)
        try:
            await adapter.read_async('{}/{}.cdm.json'.format(self.database_name,table_name))
            self.fail()
        except Exception as e:
            if  e.code != 404:
                raise

    async def run_create_or_update_relationship_table(self, adapter: SymsAdapter, relationship_name:str, request: str, expected_response: str):
        await adapter.write_async('{}/{}.manifest.cdm.json/relationships/{}'.format(self.database_name, self.database_name, relationship_name), request)
        actual_response = await adapter.read_async('{}/{}.manifest.cdm.json/relationships/{}'.format(self.database_name, self.database_name, relationship_name))
        self.assertTrue(SymsTestHelper.json_object_should_be_equal_as_expected(expected_response, json.loads(actual_response)))

    async def run_remove_relationship(self, adapter: SymsAdapter, relationship_name: str):
        await adapter.write_async('{}/{}.manifest.cdm.json/relationships/{}'.format(self.database_name, self.database_name, relationship_name), None)
        try:
            await adapter.read_async('{}/{}.manifest.cdm.json/relationships/{}'.format(self.database_name, self.database_name, relationship_name))
            self.fail()
        except Exception as e:
            if e.code != 404:
                raise

    async  def run_write_read_test(self, adapter: SymsAdapter):
        await SymsTestHelper.clean_database(adapter, SymsTestHelper.DATABASE_NAME)

        create_database_request = TestHelper.get_input_file_content(self.test_subpath, self.test_name, 'createDatabase.json')
        get_database_expected_response = TestHelper.get_expected_output_data(self.test_subpath, self.test_name,
                                                                              'expectedDatabaseResponse.json')
        await self.run_create_database(adapter, create_database_request, get_database_expected_response)
        table_name = 'symsTestTable'
        create_table_request = TestHelper.get_input_file_content(self.test_subpath, self.test_name, 'createTableRequest.json')
        get_table_expected_response = TestHelper.get_expected_output_data(self.test_subpath, self.test_name,
                                                                           'expectedTableResponse.json')
        await self.run_create_or_update_table(adapter, table_name, create_table_request, get_table_expected_response)

        updated_table_request = TestHelper.get_input_file_content(self.test_subpath, self.test_name, 'updatedTableRequest.json')
        updated_table_expected_response = TestHelper.get_expected_output_data(self.test_subpath, self.test_name,
                                                                               'expectedUpdatedTableResponse.json')
        await self.run_create_or_update_table(adapter, table_name, updated_table_request, updated_table_expected_response)
        await self.run_remove_table(adapter, table_name)

        relationship_table_name = 'E1_E2_relationship'
        create_relationship_table_request = TestHelper.get_input_file_content(self.test_subpath, self.test_name,
                                                                        'createRelationship.json')
        get_relationship_table_expected_response = TestHelper.get_expected_output_data(self.test_subpath, self.test_name,
                                                                                       'expectedRelationshipResponse.json')
        await self.run_create_or_update_relationship_table(adapter, relationship_table_name, create_relationship_table_request,
                                                  get_relationship_table_expected_response)

        updatedRelationshipTableRequest = TestHelper.get_input_file_content(self.test_subpath, self.test_name,
                                                                         'updateRelationship.json')
        updated_relationship_table_expected_response = TestHelper.get_expected_output_data(self.test_subpath, self.test_name,
                                                                                           'expectedUpdatedRelationshipResponse.json')
        await self.run_create_or_update_relationship_table(adapter, relationship_table_name, updatedRelationshipTableRequest,
                                                  updated_relationship_table_expected_response)
        await self.run_remove_relationship(adapter, relationship_table_name)

        await SymsTestHelper.clean_database(adapter, self.database_name)

    def run_syms_create_adapter_path_test(self, adapter: SymsAdapter):
        database_name = 'testDB'
        corpus_path_databases1 = '/'
        corpus_path_databases2 = self.databases_manifest
        corpus_path_databases3 = '/{}'.format(self.databases_manifest)
        adapter_path_databases = 'https://{}/databases?{}'.format(adapter.endpoint, self.api_version)
        self.assertTrue(adapter_path_databases == adapter.create_adapter_path(corpus_path_databases1))
        self.assertTrue(adapter_path_databases == adapter.create_adapter_path(corpus_path_databases2))
        self.assertTrue(adapter_path_databases == adapter.create_adapter_path(corpus_path_databases3))

        entity_name = 'testEntityName'
        corpus_path_entity = '{}/{}.cdm.json'.format(database_name, entity_name)
        adapter_path_entity = 'https://{}/databases/{}/tables/{}?{}'.format(adapter.endpoint, database_name, entity_name,
                                                                  self.api_version)
        self.assertTrue(adapter_path_entity == adapter.create_adapter_path(corpus_path_entity))

        corpus_path_entities = '{}/{}.manifest.cdm.json/entitydefinition'.format(database_name, database_name)
        adapter_path_entities = 'https://{}/databases/{}/tables?{}'.format(adapter.endpoint, database_name, self.api_version)
        self.assertTrue(adapter_path_entities == adapter.create_adapter_path(corpus_path_entities))

        relationship_name = 'testRelationshipName'
        corpus_path_relationship = '{}/{}.manifest.cdm.json/relationships/{}'.format(database_name, database_name,
                                                                                     relationship_name)
        adapter_path_relationship = 'https://{}/databases/{}/relationships/{}?{}'.format(adapter.endpoint, database_name,
                                                                               relationship_name, self.api_version)
        self.assertTrue(adapter_path_relationship == adapter.create_adapter_path(corpus_path_relationship))

        corpus_path_relationships = '{}/{}.manifest.cdm.json/relationships'.format(database_name, database_name)
        adapter_path_relationships = 'https://{}/databases/{}/relationships?{}'.format(adapter.endpoint, database_name,
                                                                             self.api_version)
        self.assertTrue(adapter_path_relationships == adapter.create_adapter_path(corpus_path_relationships))

    async def run_fetch_all_files_async_test(self, adapter: SymsAdapter):
        await SymsTestHelper.clean_database(adapter, self.database_name)

        create_database_request = TestHelper.get_input_file_content(self.test_subpath, self.test_name, 'createDatabase.json')
        temp = await adapter.write_async('{}/{}.manifest.cdm.json'.format(self.database_name, self.database_name), create_database_request)
    
        table_name1 = 'symsTestTable1'
        create_table_request1 = TestHelper.get_input_file_content(self.test_subpath, self.test_name, 'createTable1Request.json')
        temp2 = await adapter.write_async('{}/{}.cdm.json'.format(self.database_name, table_name1), create_table_request1)
    
        table_name2 = 'symsTestTable2'
        create_table_request2 = TestHelper.get_input_file_content(self.test_subpath, self.test_name, 'createTable2Request.json')
        await adapter.write_async('{}/{}.cdm.json'.format(self.database_name, table_name2), create_table_request2)
    
        databases = await adapter.fetch_all_files_async('/')
        self.assertTrue(self.databases_manifest == databases[0])
    
        entities = await adapter.fetch_all_files_async('{}/'.format(self.database_name))
        self.assertTrue(len(entities) == 2)
        self.assertTrue(entities[0] == '{}.cdm.json'.format(table_name1))
        self.assertTrue(entities[1] == '{}.cdm.json'.format(table_name2))
    
        await SymsTestHelper.clean_database(adapter, self.database_name)

    @async_test
    @unittest.skipIf(SymsTestHelper.if_syms_run_tests_flag_not_set(), 'SYMS environment variables not set up')
    async def test_write_read_clientid(self):
        await self.run_write_read_test(SymsTestHelper.create_adapter_with_clientid())

    @async_test
    @unittest.skipIf(SymsTestHelper.if_syms_run_tests_flag_not_set(), 'SYMS environment variables not set up')
    def test_create_adapter_path_clientid(self):
        self.run_syms_create_adapter_path_test(SymsTestHelper.create_adapter_with_clientid())

    @async_test
    @unittest.skipIf(SymsTestHelper.if_syms_run_tests_flag_not_set(), 'SYMS environment variables not set up')
    async def test_run_fetch_all_files_async_clientid(self):
        await self.run_fetch_all_files_async_test(SymsTestHelper.create_adapter_with_clientid())

    @unittest.skipIf(SymsTestHelper.if_syms_run_tests_flag_not_set(), 'SYMS environment variables not set up')
    def test_config_and_update_config_without_secret(self):
        """
        The secret property is not saved to the config.json file for security reasons.
        When constructing and SYMS adapter from config, the user should be able to set the secret after the adapter is constructed.
        """
        config = {
            'endpoint': 'endpoint',
            'tenant': 'tenant',
            'clientId': 'clientId',
        }

        try:
            syms_adapter1 = SymsAdapter()
            syms_adapter1.update_config(json.dumps(config))
            syms_adapter1.client_id = 'clientId'
            syms_adapter1.secret = 'secret'
            syms_adapter1.token_provider = FakeTokenProvider()
        except Exception:
            self.fail('syms_adapter initialized without secret shouldn\'t throw exception when updating config.')

        try:
            syms_adapter2 = SymsAdapter()
            syms_adapter2.client_id = 'clientId'
            syms_adapter2.secret = 'secret'
            syms_adapter2.token_provider = FakeTokenProvider()
            syms_adapter2.update_config(json.dumps(config))
        except Exception:
            self.fail('syms_adapter initialized without secret shouldn\'t throw exception when updating config.')

if __name__ == '__main__':
    unittest.main()
