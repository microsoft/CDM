# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import json
import random
import urllib

from typing import Dict, TYPE_CHECKING

from cdm.utilities.network.cdm_http_request import CdmHttpRequest

if TYPE_CHECKING:
    from cdm.utilities.network.cdm_http_response import CdmHttpResponse


class NetworkAdapter:
    """ Network adapter is an abstract class that contains logic for adapters dealing with data across network.
    Please see GithubAdapter, ADLSAdapter or RemoteAdapter for usage of this class.
    When extending this class a user has to define CdmHttpClient with the specified endpoint and callback function in the constructor
    and can then use the class helper methods to set up Cdm HTTP requests and read data.
    If a user doesn't specify timeout, maximutimeout or number of retries in the config under 'httpConfig' property default values
    will be used as specified in the class.
    """

    DEFAULT_TIMEOUT = 6000

    DEFAULT_NUMBER_OF_RETRIES = 2

    DEFAULT_MAXIMUM_TIMEOUT = 10000

    DEFAULT_SHORTEST_WAIT_TIME = 500

    @property
    def timeout(self) -> int:
        return self._timeout

    @timeout.setter
    def timeout(self, val: int) -> None:
        self._timeout = val if val is not None and val >= 0 else self.DEFAULT_TIMEOUT

    @property
    def maximum_timeout(self) -> int:
        return self._maximum_timeout

    @maximum_timeout.setter
    def maximum_timeout(self, val: int) -> None:
        self._maximum_timeout = val if val is not None and val >= 0 else self.DEFAULT_MAXIMUM_TIMEOUT

    @property
    def number_of_retries(self) -> int:
        return self._number_of_retries

    @number_of_retries.setter
    def number_of_retries(self, val: int) -> None:
        self._number_of_retries = val if val is not None and val >= 0 else self.DEFAULT_NUMBER_OF_RETRIES

    def __init__(self) -> None:
        self.timeout = self.DEFAULT_TIMEOUT  # type: int
        self.maximum_timeout = self.DEFAULT_MAXIMUM_TIMEOUT  # type: int
        self.number_of_retries = self.DEFAULT_NUMBER_OF_RETRIES  # type: int
        self.wait_time_callback = self._default_get_wait_time

    def _set_up_cdm_request(self, path: str, headers: Dict, method: str) -> 'CdmHttpRequest':
        request = CdmHttpRequest(path)

        request.headers = headers or {}
        request.method = method
        request.timeout = self.timeout
        request.maximum_timeout = self.maximum_timeout
        request.number_of_retries = self.number_of_retries

        return request

    async def _read(self, request: 'CdmHttpRequest') -> str:
        result = await self._http_client._send_async(request, self.wait_time_callback, self.ctx)

        if result is None:
            raise Exception('The result of a request is undefined.')

        if result.is_successful is False:
            raise urllib.error.HTTPError(url=request.requested_url, code=result.status_code, msg='Failed to read', hdrs=result.response_headers, fp=None)

        return result.content

    def _default_get_wait_time(self, response: 'CdmHttpResponse', has_failed: bool, retry_number: int) -> int:
        """
        Callback function for a CDM Http client, it does exponential backoff.
        :param response: The response received by system's Http client.
        :param has_failed: Denotes whether the request has failed (usually an exception or 500 error).
        :param retry_number: The current retry number (starts from 1) up to the number of retries specified by CDM request
        :return: The time in milliseconds.
        """
        if response and response.is_successful and not has_failed:
            return None

        return random.randint(0, 2**retry_number) * self.DEFAULT_SHORTEST_WAIT_TIME

    def update_network_config(self, config: str) -> None:
        configs_json = json.loads(config)

        if configs_json.get('timeout') is not None:
            self.timeout = float(configs_json['timeout'])

        if configs_json.get('maximumTimeout') is not None:
            self.maximum_timeout = float(configs_json['maximumTimeout'])

        if configs_json.get('numberOfRetries') is not None:
            self.number_of_retries = int(configs_json['numberOfRetries'])

    def fetch_network_config(self):
        return {
            'timeout': self.timeout,
            'maximumTimeout': self.maximum_timeout,
            'numberOfRetries': self.number_of_retries
        }
