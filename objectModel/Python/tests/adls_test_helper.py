# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os

from cdm.storage import ADLSAdapter
from cdm.utilities.string_utils import StringUtils

class AdlsTestHelper:
    @staticmethod
    def create_adapter_with_shared_key(root_relative_path: str = None):
        hostname = os.environ.get("ADLS_HOSTNAME")
        root_path = os.environ.get("ADLS_ROOTPATH")
        shared_key = os.environ.get("ADLS_SHAREDKEY")

        adapter = ADLSAdapter(hostname=hostname, root=AdlsTestHelper.get_full_root_path(root_path, root_relative_path), shared_key=shared_key)

        return adapter
        
    @staticmethod
    def create_adapter_with_client_id(root_relative_path: str = None):
        hostname = os.environ.get("ADLS_HOSTNAME")
        root_path = os.environ.get("ADLS_ROOTPATH")
        tenant = os.environ.get("ADLS_TENANT")
        client_id = os.environ.get("ADLS_CLIENTID")
        client_secret = os.environ.get("ADLS_CLIENTSECRET")

        adapter = ADLSAdapter(hostname=hostname, root=AdlsTestHelper.get_full_root_path(root_path, root_relative_path), tenant=tenant, client_id=client_id, secret=client_secret)

        return adapter

    @staticmethod
    def get_full_root_path(first: str, second: str) -> str:
        if second is None or second == '':
            return first
        if first.endswith('/'):
            first = first[0:len(first) - 1]
        if second.startswith('/'):
            second = second[1:]
        return first + '/' + second
