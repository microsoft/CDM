# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import json

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
    def json_object_should_be_equal_as_expected(expected, actual):

        actual = SymsTestHelper.ignore_properties(SymsTestHelper.ignore_null(actual))
        obj1 = SymsTestHelper.ordered(SymsTestHelper.ignore_null(expected))
        obj2 = SymsTestHelper.ordered(SymsTestHelper.ignore_extra_values_in_actual(actual, expected))
        return obj1 == obj2

    @staticmethod
    def ignore_properties(data):
        # remove id
        if 'id' in data:
            del data['id']
        if 'properties' in data:
            if 'ObjectId' in data['properties']:
                data['properties']['ObjectId'] = ''
            if 'StorageDescriptor' in data['properties']:
                if 'ColumnSetEntityName' in data['properties']['StorageDescriptor']:
                    data['properties']['StorageDescriptor']['ColumnSetEntityName'] = ''
            deleteAttr = []
            if 'Properties' in data['properties']:
                for x in data['properties']['Properties']:
                    if not x.startswith('cdm:'):
                        deleteAttr.append(x)
            for rem in deleteAttr:
                del data['properties']['Properties'][rem]

        return data

    @staticmethod
    def ignore_null(data):
        if isinstance(data, dict):
            new_obj = {}
            for key in data:
                new_val = SymsTestHelper.ignore_null(data[key])
                if new_val is not None:
                    new_obj[key] = new_val
            return new_obj
        if isinstance(data, list):
            return [SymsTestHelper.ignore_null(x) for x in data if data is not None]
        if data is not None:
            return data

    @staticmethod
    def ignore_extra_values_in_actual(actual, expected):
        if isinstance(actual, dict):
            new_obj = {}
            for key in actual:
                if key in expected:
                    new_obj[key] = SymsTestHelper.ignore_extra_values_in_actual(actual[key], expected[key])
            return new_obj
        if isinstance(actual, list):
            return [SymsTestHelper.ignore_extra_values_in_actual(actual[i], expected[i]) for i in range(len(expected))]
        if actual is not None:
            return actual

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
