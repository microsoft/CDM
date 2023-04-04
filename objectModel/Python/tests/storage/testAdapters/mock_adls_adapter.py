# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
from cdm.storage.adls import ADLSAdapter


class MockADLSAdapter(ADLSAdapter):
    def __init__(self, cdm_http_client) -> None:
        super().__init__(hostname='hostname', root='root', shared_key=os.environ.get("ADLS_SHAREDKEY"))
        self._http_client = cdm_http_client
