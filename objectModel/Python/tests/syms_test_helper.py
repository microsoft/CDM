﻿# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os, json

from cdm.storage import ADLSAdapter, SymsAdapter
from cdm.enums import AzureCloudEndpoint

class SymsTestHelper:
    DATABASE_NAME = 'SymsTestDatabase'
    @staticmethod
    def create_adapter_clientid_with_shared_key(adapter_num: int):
        hostname = os.environ.get('SYMS_TEST_ADLS{}_HOSTNAME'.format(adapter_num))
        root_path = os.environ.get('SYMS_TEST_ADLS{}_ROOTPATH'.format(adapter_num))
        shared_key = os.environ.get('SYMS_TEST_ADLS{}_SHAREDKEY'.format(adapter_num))


        return ADLSAdapter(hostname=hostname, root=root_path, shared_key=shared_key)

    @staticmethod
    def create_adapter_with_clientid():
        endpoint = os.environ.get('SYMS_ENDPOINT')
        tenant = os.environ.get('SYMS_TENANT')
        client_id = os.environ.get('SYMS_CLIENTID')
        client_secret = os.environ.get('SYMS_CLIENTSECRET')

        return SymsAdapter(endpoint=endpoint, tenant=tenant, client_id=client_id, secret=client_secret)

    @staticmethod
    def if_syms_run_tests_flag_not_set():
        return os.environ.get('SYMS_RUNTESTS') is not '1'

    @staticmethod
    def json_object_should_be_equal_as_expected(expected: str, actual: str):

        actual = SymsTestHelper.ignore_properties(actual)
        obj1 = SymsTestHelper.ordered(expected)
        obj2 = SymsTestHelper.ordered(actual)
        return obj1 == obj2

    @staticmethod
    def ignore_properties(data):
        ignore_paths = ['properties.ObjectId', 'properties.StorageDescriptor.ColumnSetEntityName']
        others_path = 'properties.Properties'

        if 'properties' in data:
            if 'ObjectId' in data['properties']:
                data['properties']['ObjectId'] = ''
            if 'StorageDescriptor' in data['properties']:
                if 'ColumnSetEntityName' in data['properties']['StorageDescriptor']:
                    data['properties']['StorageDescriptor']['ColumnSetEntityName'] = ''
            if 'Properties' in data['properties']:
                    if 'spark.sql.sources.schema.part.0' in data['properties']['Properties']:
                        data['properties']['Properties']['spark.sql.sources.schema.part.0'] = ''

        return data

    @staticmethod
    async def clean_database(adapter: 'SymsAdapter', db_name: str):
        try:
            await adapter.write_async('{}/{}.manifest.cdm.json'.format(db_name, db_name), None)
        except Exception as e:
            if e.code != 404:
                raise

    @staticmethod
    def ordered(obj):
        if isinstance(obj, dict):
            return sorted((k, SymsTestHelper.ordered(v)) for k, v in obj.items())
        if isinstance(obj, list):
            return sorted(SymsTestHelper.ordered(x) for x in obj)
        else:
            return obj
