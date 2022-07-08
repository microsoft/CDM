# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import random
import unittest

from cdm.utilities.network.cdm_http_client import CdmHttpClient
from cdm.utilities.network.cdm_http_request import CdmHttpRequest
from cdm.utilities.network.cdm_http_response import CdmHttpResponse
from cdm.utilities.network.cdm_number_of_retries_exceeded_exception import CdmNumberOfRetriesExceededException

from tests.common import async_test
from typing import Optional


class CdmHttpClientTests(unittest.TestCase):

    def call_back(self, cdm_http_response: 'CdmHttpResponse', has_failed: bool, retry_number: int) -> Optional[int]:
        if cdm_http_response != None and cdm_http_response.status_code == 200 and not has_failed:
            return None
        else:
            return random.randint(0, 2**retry_number - 1) * 500

    @async_test
    async def test_result_returned_successfully(self):
        """Testing for a successful return of a result from Cdm Http Client."""
        github_url = 'https://raw.githubusercontent.com/'
        corpus_path = '/Microsoft/CDM/master/schemaDocuments/foundations.cdm.json'

        cdm_http_client = CdmHttpClient(github_url)
        cdm_http_request = CdmHttpRequest(corpus_path, 1, 'GET')

        cdm_http_request.timeout = 5000
        cdm_http_request.maximum_timeout = 10000
        cdm_http_request.headers = {'User-Agent': 'CDM'}

        cdm_http_response = await cdm_http_client._send_async(cdm_http_request, self.call_back)

        self.assertEqual(200, cdm_http_response.status_code)

    @async_test
    async def test_number_of_retries_exceeded_exception(self):
        """Testing for a failed return of a result back from Cdm Http Client."""
        github_url = 'https://raw.githubusercontent2.com/'
        corpus_path = '/Microsoft/CDM/master/schemaDocuments/foundations.cdm.json'

        cdm_http_client = CdmHttpClient(github_url)
        cdm_http_request = CdmHttpRequest(corpus_path, 1, 'GET')

        cdm_http_request.timeout = 5000
        cdm_http_request.maximum_timeout = 10000
        cdm_http_request.headers = {'User-Agent': 'CDM'}

        try:
            await cdm_http_client._send_async(cdm_http_request, self.call_back)
        except Exception as e:
            self.assertRaises(CdmNumberOfRetriesExceededException)
