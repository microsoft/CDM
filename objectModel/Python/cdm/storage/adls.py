# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

import datetime
import json
import typing
from typing import Any, List, Optional
import urllib
import urllib.parse

import adal
import dateutil.parser

from cdm.utilities.network.cdm_http_client import CdmHttpClient
from cdm.storage.network import NetworkAdapter

from .base import StorageAdapterBase


class AdlsAdapter(NetworkAdapter, StorageAdapterBase):
    """Azure Data Lake Storage Gen2 storage adapter"""

    def __init__(self, root: str, hostname: str, resource: str, client_id: str, secret: str, tenant: str, **kwargs) -> None:
        super().__init__(kwargs.get('http_config', {}))

        self._root = root  # type: str
        self._hostname = hostname  # type: str
        self._resource = resource  # type: str
        self._client_id = client_id  # type: str
        self._client_secret = secret  # type: str
        self._auth_context = adal.AuthenticationContext('https://login.windows.net/' + tenant)
        self.http_client = CdmHttpClient()  # type: CdmHttpClient

    def can_read(self) -> bool:
        return True

    def can_write(self) -> bool:
        return True

    async def read_async(self, corpus_path: str) -> str:
        url = self.create_adapter_path(corpus_path)
        request = self._create_request(url, 'GET')

        return await super().read(request)

    async def write_async(self, corpus_path: str, data: str) -> None:
        url = self.create_adapter_path(corpus_path)

        request = self._create_request(url + '?resource=file', 'PUT')

        await self.http_client.send_async(request, self.wait_time_callback)

        request = self._create_request(url + '?action=append&position=0', 'PATCH', data)
        request.content_type = 'application/json'

        await self.http_client.send_async(request, self.wait_time_callback)

        request = self._create_request(url + '?action=flush&position=' + str(len(data)), 'PATCH')

        await self.http_client.send_async(request, self.wait_time_callback)

    def create_adapter_path(self, corpus_path: str) -> str:
        if corpus_path.startswith('//'):
            corpus_path = corpus_path[1:]

        return 'https://' + self._hostname + self._root + corpus_path

    def create_corpus_path(self, adapter_path: str) -> Optional[str]:
        base = 'https://' + self._hostname + self._root

        if adapter_path.startswith(base):
            return adapter_path[len(base):]

        # Signal that we did not recognize path as one for this adapter.
        return None

    def clear_cache(self) -> None:
        pass

    async def compute_last_modified_time_async(self, adapter_path: str) -> Optional[datetime.datetime]:
        request = self._create_request(adapter_path, 'HEAD')

        cdm_response = await self.http_client.send_async(request, self.wait_time_callback)

        return dateutil.parser.parse(typing.cast(str, cdm_response.response_headers['Last-Modified']))

    async def fetch_all_files_async(self, folder_corpus_path: str) -> List[str]:
        adapter_folder = self.create_adapter_path(folder_corpus_path)
        split_result = urllib.parse.urlsplit(adapter_folder)
        parts = split_result.path.strip('/').split('/', 1)
        filesystem_url = urllib.parse.urlunsplit(split_result._replace(path=parts[0]))
        directory = '/' + (parts[1] if len(parts) > 1 else '')
        list_url = filesystem_url + '?directory=' + directory + '&recursive=true&resource=filesystem'

        request = self._create_request(list_url, 'GET')

        cdm_response = await self.http_client.send_async(request, self.wait_time_callback)

        data = json.loads(cdm_response.content)

        adapter_files = [filesystem_url + '/' + path['name']
                         for path in data['paths']
                         if 'isDirectory' not in path or path['isDirectory'] != 'true']

        return list(filter(lambda path: path is not None, [self.create_corpus_path(file) for file in adapter_files]))

    def _create_request(self, url: str, method: str = 'GET', data: str = None):
        credentials = self._auth_context.acquire_token_with_client_credentials(self._resource, self._client_id, self._client_secret)
        headers = {'Authorization': credentials['tokenType'] + ' ' + credentials['accessToken']}
        request = self.set_up_cdm_request(url, headers, method)
        request.content = data
        return request
