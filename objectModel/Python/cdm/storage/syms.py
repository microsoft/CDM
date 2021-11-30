# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from http import HTTPStatus
from typing import List, Optional

import json, urllib, urllib.parse
import msal

from cdm.utilities import StorageUtils
from cdm.utilities.string_utils import StringUtils
from cdm.utilities.network.cdm_http_client import CdmHttpClient
from cdm.storage.network import NetworkAdapter
from cdm.enums.azure_cloud_endpoint import AzureCloudEndpoint

from .base import StorageAdapterBase


class SymsAdapter(NetworkAdapter, StorageAdapterBase):
    """SyMS storage adapter"""

    SYMS_DEFAULT_TIMEOUT = 30000
    HTTP_DEFAULT_MAX_RESULTS = 100000
    API_VERSION = 'api-version=2021-04-01'
    DATABASE_MANIFEST = 'databases.manifest.cdm.json'

    def __init__(self, endpoint: Optional[str] = None, **kwargs) -> None:
        super().__init__()
        super(NetworkAdapter, self).__init__()
        super(StorageAdapterBase, self).__init__()

        # --- internal ---
        self._formatted_endpoint = None  # type: Optional[str]
        self._http_authorization = 'Authorization'
        self._http_client = CdmHttpClient()  # type: CdmHttpClient
        self._http_xms_continuation = 'x-ms-continuation'
        self._http_xms_date = 'x-ms-date'
        self._http_xms_version = 'x-ms-version'
        self._scope = ['https://dev.azuresynapse.net/.default']  # type: Optional[List[str]]
        self._type = 'Syms'
        self.http_max_results = self.HTTP_DEFAULT_MAX_RESULTS  # type: int
        self.timeout = self.SYMS_DEFAULT_TIMEOUT  # type: int

        if endpoint:
            self._endpoint = self._format_endpoint(endpoint)  # type: Optional[str]
            self._base_uri = 'https://{}/databases'.format(self._endpoint)
            self.client_id = kwargs.get('client_id', None)  # type: Optional[str]
            self.secret = kwargs.get('secret', None)  # type: Optional[str]
            self.token_provider = kwargs.get('token_provider', None)  # type: Optional[TokenProvider]
            self.azure_endpoint = kwargs.get('azure_endpoint', AzureCloudEndpoint.AZURE_PUBLIC)  # type: AzureCloudEndpoint

            # --- internal ---
            self._tenant = kwargs.get('tenant', None)  # type: Optional[str]
            self._auth_context = None

    @property
    def endpoint(self) -> str:
        return self._endpoint

    @property
    def base_uri(self) -> str:
        return self._base_uri

    @endpoint.setter
    def endpoint(self, value: str):
        self._endpoint = self._format_endpoint(value)

    @property
    def tenant(self) -> str:
        return self._tenant

    def can_read(self) -> bool:
        return True

    def can_write(self) -> bool:
        return True

    def create_adapter_path(self, corpus_path: str) -> str:
        formatted_corpus_path = self._format_corpus_path(corpus_path)
        if formatted_corpus_path is not None:
            if formatted_corpus_path == '/':
                return '{}?{}'.format(self._base_uri, self.API_VERSION)
            if formatted_corpus_path == '/' + self.DATABASE_MANIFEST or formatted_corpus_path == self.DATABASE_MANIFEST:
                return '{}?{}'.format(self._base_uri, self.API_VERSION)

            formatted_corpus_path = StringUtils.trim_start(formatted_corpus_path, '/')
            paths = formatted_corpus_path.split('/')
            if len(paths) == 2: # 2 level is supported currently
                # paths[0]: databasename
                # paths[1]: filename
                if paths[1].endswith('.manifest.cdm.json'):
                     return '{}/{}/?{}'.format(self._base_uri, paths[0], self.API_VERSION)
                if paths[1].endswith('.cdm.json'):
                    return '{}/{}/tables/{}?{}'.format(self._base_uri, paths[0], paths[1].replace('.cdm.json', ''), self.API_VERSION)
                else:
                    raise Exception('Syms adapter: Failed to convert to adapter path from corpus path. Invalid corpus path :' + corpus_path + '. Supported file format are manifest.cdm.json and .cdm.json')
            elif len(paths) == 3: # 3 level is supported for relationship and entitydefinitions
                # paths[0]: database name
                # paths[1]: filename
                if paths[1].endswith('.manifest.cdm.json') and paths[2] == 'relationships':
                    return '{}/{}/relationships?{}'.format(self._base_uri, paths[0], self.API_VERSION)
                elif paths[1].endswith('.manifest.cdm.json') and paths[2] == 'entitydefinition':
                    return '{}/{}/tables?{}'.format(self._base_uri, paths[0], self.API_VERSION)
                else:
                    raise Exception('Syms adapter: Failed to convert to adapter path from corpus path' + corpus_path + '. corpus path must be in following form: /<databasename>/<filename>.manifest.cdm.json/relationships or /<databasename>/<filename>.manifest.cdm.json/entitydefinition.')
            elif len(paths) == 4: # 4 level is supported for relationship
                # paths[0]: databasename
                # paths[1]: filename
                if paths[1].endswith('.manifest.cdm.json') and paths[2] == 'relationships':
                    return '{}/{}/relationships/{}?{}'.format(self._base_uri, paths[0], paths[3], self.API_VERSION)
                else:
                    raise Exception('Syms adapter: Failed to convert to adapter path from corpus path' + corpus_path + '. + Corpus path must be in following form: /<databasename>/<filename>.manifest.cdm.json/relationships/<relationshipname>.')

            else:
                raise Exception('Syms adapter: Failed to convert to adapter path from corpus path' + corpus_path + '. Corpus path must be in following form: /<databasename>/<filename>.manifest.cdm.json/relationships/<relationshipname>, /<databasename>/<filename>.manifest.cdm.json/relationships or /<databasename>/<filename>.manifest.cdm.json/entitydefinition>.')
        return None


    def create_corpus_path(self, adapter_path: str) -> Optional[str]:
        if adapter_path:
            start_index = len('https://')
            if not adapter_path.endswith('/'):
                adapter_path = adapter_path + '/'
            end_index = adapter_path.find('/', start_index + 1)

            if end_index < start_index:
                raise Exception('Unexpected adapter path:', adapter_path)

            endpoint = self._format_endpoint(adapter_path[start_index:end_index])

            if endpoint == self._endpoint:
                corpus_path = self.convert_to_corpus_path(adapter_path[end_index + 1:])
                return corpus_path

        # Signal that we did not recognize path as one for this adapter.
        return None

    def convert_to_corpus_path(self, adapter_sub_path: str) -> Optional[str]:
        unescaped_path = urllib.parse.unquote(adapter_sub_path)

        # The path is of the format databases / tables / [tablename]?[api - version]
        parts = unescaped_path.split('/')
        entity_name = parts[3][0, ''.join(parts[3]).rindex('?') + 1]

        return entity_name + '.cdm.json'

    async def fetch_all_files_async(self, folder_corpus_path: str) -> List[str]:
        formatted_corpus_path = self._format_corpus_path(folder_corpus_path)
        if formatted_corpus_path is None:
            return None

        result = []
        if formatted_corpus_path == '/' :
            result.append(self.DATABASE_MANIFEST)
            return result;

        if not formatted_corpus_path.endswith('/') :
            formatted_corpus_path = formatted_corpus_path + '/'

        formatted_corpus_path = StringUtils.trim_start(formatted_corpus_path, '/')
        paths = formatted_corpus_path.split('/')
        # paths[0]: databasename
        # paths[1]: empty as path ends with /
        if len(paths) != 2:
            raise Exception('Syms adapter: Conversion from corpus path {folderCorpusPath} to adpater is failed. Path must be in format : <databasename>/.')

        url = '{}/{}/tables?{}'.format(self._base_uri, paths[0], self.API_VERSION)
        continuation_token = None
        results = []

        while True:
            if continuation_token is None:
                request = self._build_request('{}'.format(url), 'GET')
            else:
                request = self._build_request('{}?continuation={}'.format(url, continuation_token), 'GET')

            cdm_response = await self._http_client._send_async(request, self.wait_time_callback, self.ctx)

            if cdm_response.status_code == HTTPStatus.OK:
                continuation_token = cdm_response.response_headers.get(self._http_xms_continuation)
                data = json.loads(cdm_response.content)
                for path in data['items']:
                    results.append(path['name'] + '.cdm.json')

            if continuation_token is None:
                break

        return results

    def fetch_config(self) -> str:
        result_config = {'type': self._type}

        config_object = {
            'endpoint': self.endpoint
        }

        # Check for clientId auth, we won't write secrets to JSON.
        if self.client_id and self.tenant:
            config_object['tenant'] = self.tenant
            config_object['clientId'] = self.client_id

        # Try constructing network configs.
        config_object.update(self.fetch_network_config())
        result_config['config'] = config_object

        return json.dumps(result_config)

    async def read_async(self, corpus_path: str) -> str:
        url = self.create_adapter_path(corpus_path)

        request = self._build_request(url, 'GET')

        return await super()._read(request)

    def update_config(self, config: str):
        configs_json = json.loads(config)

        if configs_json.get('endpoint'):
            self._endpoint = configs_json['endpoint']
        else:
            raise Exception('Endpoint has to be set for Syms adapter.')

        self.update_network_config(config)

        if configs_json.get('tenant') and configs_json.get('clientId'):
            self._tenant = configs_json['tenant']
            self.client_id = configs_json['clientId']

    async def write_async(self, corpus_path: str, data: str) -> None:
        url = self.create_adapter_path(corpus_path)

        if data is None:
            request = self._build_request(url, 'DELETE', data, 'application/json')
        else:
            request = self._build_request(url, 'PUT', data, 'application/json')

        await self._http_client._send_async(request, self.wait_time_callback, self.ctx)

    def _build_request(self, url: str, method: str = 'GET', content: Optional[str] = None,
                       content_type: Optional[str] = None):
        if self.tenant is not None and self.client_id is not None and self.secret is not None:
            token = self._generate_bearer_token()
            headers = {'Authorization': token['token_type'] + ' ' + token['access_token']}
            request = self._set_up_cdm_request(url, headers, method)
        elif self.token_provider is not None:
            headers = {'Authorization': self.token_provider.get_token()}
            request = self._set_up_cdm_request(url, headers, method)
        else:
            raise Exception('Syms adapter is not configured with any auth method')

        if content is not None:
            request.content = content
            request.content_type = content_type

        return request

    def _format_corpus_path(self, corpus_path: str) -> Optional[str]:
        path_tuple = StorageUtils.split_namespace_path(corpus_path)
        if not path_tuple:
            return None

        corpus_path = path_tuple[1]

        if corpus_path and corpus_path[0] != '/':
            corpus_path = '/' + corpus_path
        return corpus_path

    def _format_endpoint(self, endpoint: str) -> str:
        if endpoint.startswith('https://'):
            endpoint = endpoint.replace('https://', '');
        return '{}'.format(StringUtils.trim_end(endpoint, '/'))

    def _generate_bearer_token(self) -> Optional[dict]:
        self._build_context()
        result = self._auth_context.acquire_token_for_client(scopes=self._scope)
        if result and 'error' in result:
            error_description = result['error'] + ' error_description: ' + result['error_description'] \
                if 'error_description' in result else result['error']
            raise Exception('There was an error while acquiring Syms Adapter\'s Token with '
                            'client ID/secret authentication. Exception: ' + error_description)

        if result is None or 'access_token' not in result or 'token_type' not in result:
            raise Exception('Received invalid Syms Adapter\'s authentication result. The result may be None, or missing'
                            ' access_toke and/or token_type authorization header from the authentication result.')

        return result

    def _build_context(self):
        """Build context when users make the first call. Also need to ensure client Id, tenant and secret are not null."""
        if self._auth_context is None:
            self._auth_context = msal.ConfidentialClientApplication(
                self.client_id, authority=self.azure_endpoint.value + self.tenant, client_credential=self.secret)
