# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

import base64
from collections import OrderedDict
from datetime import datetime
import hashlib
import hmac
from http import HTTPStatus
from time import mktime
import typing
from typing import List, Optional
from wsgiref.handlers import format_date_time

import json
import urllib
import urllib.parse

import adal
import dateutil.parser

from cdm.utilities.network.cdm_http_client import CdmHttpClient
from cdm.storage.network import NetworkAdapter

from .base import StorageAdapterBase


class ADLSAdapter(NetworkAdapter, StorageAdapterBase):
    """Azure Data Lake Storage Gen2 storage adapter"""

    def __init__(self, hostname: Optional[str] = None, root: Optional[str] = None, **kwargs) -> None:
        super().__init__()

        # --- internal ---
        self._file_system = None  # type: Optional[str]
        self._http_authorization = 'Authorization'
        self._http_client = CdmHttpClient()  # type: CdmHttpClient
        self._http_xms_date = 'x-ms-date'
        self._http_xms_version = 'x-ms-version'
        self._resource = "https://storage.azure.com"  # type: Optional[str]
        self._type = 'adls'
        self._root = None
        self._sub_path = None  # type: Optional[str]

        if root and hostname:
            self.root = root  # type: Optional[str]
            self.hostname = hostname  # type: Optional[str]
            self.tenant = kwargs.get('tenant', None)  # type: Optional[str]
            self.client_id = kwargs.get('client_id', None)  # type: Optional[str]
            self.secret = kwargs.get('secret', None)  # type: Optional[str]
            self.shared_key = kwargs.get('shared_key', None)  # type: Optional[str]
            self.location_hint = None  # type: Optional[str]

            # --- internal ---
            self._auth_context = adal.AuthenticationContext('https://login.windows.net/' + self.tenant) if self.tenant else Non

    @property
    def root(self) -> str:
        return self._root

    @root.setter
    def root(self, value: str):
        self._root = value
        self._extract_filesystem_and_sub_path(self._root)

    def can_read(self) -> bool:
        return True

    def can_write(self) -> bool:
        return True

    def clear_cache(self) -> None:
        pass

    async def compute_last_modified_time_async(self, adapter_path: str) -> Optional[datetime]:
        request = self._build_request(adapter_path, 'HEAD')

        try:
            cdm_response = await self._http_client.send_async(request, self.wait_time_callback)
            if cdm_response.status_code == HTTPStatus.OK:
                return dateutil.parser.parse(typing.cast(str, cdm_response.response_headers['Last-Modified']))
        except Exception:
            pass

        return None

    def create_adapter_path(self, corpus_path: str) -> str:
        if corpus_path.startswith('//'):
            corpus_path = corpus_path[1:]

        return 'https://' + self.hostname + self.root + self._format_corpus_path(corpus_path)

    def create_corpus_path(self, adapter_path: str) -> Optional[str]:
        base = 'https://' + self.hostname + self.root

        if adapter_path and adapter_path.startswith(base):
            return adapter_path[len(base):]

        # Signal that we did not recognize path as one for this adapter.
        return None

    async def fetch_all_files_async(self, folder_corpus_path: str) -> List[str]:
        url = 'https://{}/{}'.format(self.hostname, self._file_system)
        directory = urllib.parse.urljoin(self._sub_path, self._format_corpus_path(folder_corpus_path))
        if directory.startswith('/'):
            directory = directory[1:]

        request = self._build_request('{}?directory={}&recursive=True&resource=filesystem'.format(url, directory), 'GET')
        cdm_response = await self._http_client.send_async(request, self.wait_time_callback)

        if cdm_response.status_code == HTTPStatus.OK:
            results = []
            data = json.loads(cdm_response.content)

            for path in data['paths']:
                if 'isDirectory' not in path or path['isDirectory'] != 'true':
                    name = path['name']  # type: str
                    name_without_sub_path = name[len(self._sub_path) + 1:] if self._sub_path and name.startswith(self._sub_path) else name

                    results.append(self._format_corpus_path(name_without_sub_path))
            return results

        return None

    def fetch_config(self) -> str:
        result_config = {'type': self._type}

        config_object = {
            'hostname': self.hostname,
            'root': self.root
        }

        # Check for clientId auth, we won't write shared key or secrets to JSON.
        if self.client_id and self.tenant:
            config_object['tenant'] = self.tenant
            config_object['clientId'] = self.client_id

        # Try constructing network configs.
        config_object.update(self.fetch_network_config())

        if self.location_hint:
            config_object['locationHint'] = self.location_hint

        result_config['config'] = config_object

        return json.dumps(result_config)

    async def read_async(self, corpus_path: str) -> str:
        url = self.create_adapter_path(corpus_path)
        request = self._build_request(url, 'GET')

        return await super()._read(request)

    def update_config(self, config: str):
        configs_json = json.loads(config)

        if configs_json.get('root'):
            self.root = configs_json['root']
        else:
            raise Exception('Root has to be set for ADLS adapter.')

        if configs_json.get('hostname'):
            self.hostname = configs_json['hostname']
        else:
            raise Exception('Hostname has to be set for ADLS adapter.')

        self.update_network_config(config)

        # Check first for clientId/secret auth.
        if configs_json.get('tenant') and configs_json.get('clientId'):
            self.tenant = configs_json['tenant']
            self.client_id = configs_json['clientId']

            # Check for a secret, we don't really care is it there, but it is nice if it is.
            if configs_json.get('secret'):
                self.secret = configs_json['secret']

        # Check then for shared key auth.
        if configs_json.get('sharedKey'):
            self.shared_key = configs_json['sharedKey']

        if configs_json.get('locationHint'):
            self.location_hint = configs_json['locationHint']

        self._auth_context = adal.AuthenticationContext('https://login.windows.net/' + self.tenant) if self.tenant else None

    async def write_async(self, corpus_path: str, data: str) -> None:
        url = self.create_adapter_path(corpus_path)

        request = self._build_request(url + '?resource=file', 'PUT')

        await self._http_client.send_async(request, self.wait_time_callback)

        request = self._build_request(url + '?action=append&position=0', 'PATCH', data)
        request.content_type = 'application/json'

        await self._http_client.send_async(request, self.wait_time_callback)

        request = self._build_request(url + '?action=flush&position=' + str(len(data)), 'PATCH')

        await self._http_client.send_async(request, self.wait_time_callback)

    def _apply_shared_key(self, shared_key: str, url: str, method: str, content: Optional[str] = None, content_type: Optional[str] = None):
        headers = OrderedDict()
        headers[self._http_xms_date] = format_date_time(mktime(datetime.utcnow().timetuple()))
        headers[self._http_xms_version] = '2018-06-17'

        content_length = 0

        if content is not None:
            content_length = len(content)

        uri = urllib.parse.urlparse(url)
        builder = []
        builder.append(method)  # Verb.
        builder.append('\n')  # Verb.
        builder.append('\n')  # Content-Encoding.
        builder.append('\n')  # Content-Language.
        builder.append(content_length + '\n' if content_length else '\n')  # Content length.
        builder.append('\n')  # Content-md5.
        builder.append(content_type + '; charset=utf-8\n' if content_type else '\n')  # Content-type.
        builder.append('\n')  # Date.
        builder.append('\n')  # If-modified-since.
        builder.append('\n')  # If-match.
        builder.append('\n')  # If-none-match.
        builder.append('\n')  # If-unmodified-since.
        builder.append('\n')  # Range.

        for key, value in headers.items():
            builder.append('{0}:{1}\n'.format(key, value))

        # append canonicalized resource.
        account_name = uri.netloc.split('.')[0]
        builder.append('/')
        builder.append(account_name)
        builder.append(uri.path)

        # append canonicalized queries.
        if uri.query:
            query_parameters = uri.query.split('&')  # type: List[str]

            for parameter in query_parameters:
                key_value_pair = parameter.split('=')
                builder.append('\n{}:{}'.format(key_value_pair[0], key_value_pair[1]))

        # Hash the payload.
        data_to_hash = ''.join(builder).rstrip()
        shared_key_bytes = self._try_from_base64_string(shared_key)
        if not shared_key_bytes:
            raise Exception('Couldn\'t encode the shared key.')

        message = base64.b64encode(hmac.new(shared_key_bytes, msg=data_to_hash.encode('utf-8'), digestmod=hashlib.sha256).digest()).decode('utf-8')
        signed_string = 'SharedKey {}:{}'.format(account_name, message)

        headers[self._http_authorization] = signed_string

        return headers

    def _build_request(self, url: str, method: str = 'GET', content: Optional[str] = None, content_type: Optional[str] = None):
        if self.shared_key is not None:
            request = self._set_up_cdm_request(url, self._apply_shared_key(self.shared_key, url, method, content, content_type), method)
        else:
            token = self._generate_bearer_token()
            headers = {'Authorization': token['tokenType'] + ' ' + token['accessToken']}
            request = self._set_up_cdm_request(url, headers, method)

        if content is not None:
            request.content = content
            request.content_type = content_type

        return request

    def _extract_filesystem_and_sub_path(self, root: str) -> None:
        # No root value was set
        if not root:
            self._file_system = ''
            self._sub_path = ''
            return

        # Remove leading /
        prep_root = root[1:] if root[0] == '/' else root

        # Root contains only the file-system name, e.g. "fs-name"
        if prep_root.find('/') == -1:
            self._file_system = prep_root
            self._sub_path = ''
            return

        # Root contains file-system name and folder, e.g. "fs-name/folder/folder..."
        prep_root_array = prep_root.split('/')
        self._file_system = prep_root_array[0]
        self._sub_path = '/'.join(prep_root_array[1:])

    def _format_corpus_path(self, corpus_path: str) -> str:
        if corpus_path.startswith('adls:'):
            corpus_path = corpus_path[5:]
        elif corpus_path and corpus_path[0] != '/':
            corpus_path = '/' + corpus_path
        return corpus_path

    def _generate_bearer_token(self):
        return self._auth_context.acquire_token_with_client_credentials(self._resource, self.client_id, self.secret)

    def _try_from_base64_string(self, content: str) -> bool:
        try:
            return base64.b64decode(content)
        except Exception:
            return None
