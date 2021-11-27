# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

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

import msal
import dateutil.parser

from cdm.utilities import StorageUtils
from cdm.utilities.network.cdm_http_client import CdmHttpClient
from cdm.utilities.string_utils import StringUtils
from cdm.storage.network import NetworkAdapter
from cdm.enums.azure_cloud_endpoint import AzureCloudEndpoint

from .base import StorageAdapterBase


class ADLSAdapter(NetworkAdapter, StorageAdapterBase):
    """Azure Data Lake Storage Gen2 storage adapter"""

    ADLS_DEFAULT_TIMEOUT = 9000
    HTTP_DEFAULT_MAX_RESULTS = 5000

    def __init__(self, hostname: Optional[str] = None, root: Optional[str] = None, **kwargs) -> None:
        super().__init__()
        super(NetworkAdapter, self).__init__()
        super(StorageAdapterBase, self).__init__()

        # --- internal ---
        self._adapter_paths = {}  # type: Dict[str, str]
        self._root_blob_contrainer = None  # type: Optional[str]
        self._http_authorization = 'Authorization'
        self._http_client = CdmHttpClient()  # type: CdmHttpClient
        self._http_xms_continuation = 'x-ms-continuation'
        self._http_xms_date = 'x-ms-date'
        self._http_xms_version = 'x-ms-version'
        self._http_xms_version = 'x-ms-version'
        self._scope = ['https://storage.azure.com/.default']  # type: Optional[List[str]]
        self._type = 'adls'
        self._root = None
        self._sas_token = None
        self._unescaped_root_sub_path = None  # type: Optional[str]
        self._escaped_root_sub_path = None  # type: Optional[str]
        self._file_modified_time_cache = {}  # type: Dict[str, datetime]
        self.http_max_results = self.HTTP_DEFAULT_MAX_RESULTS  # type: int
        self.timeout = self.ADLS_DEFAULT_TIMEOUT  # type: int

        if root and hostname:
            self.root = root  # type: Optional[str]
            self.hostname = hostname  # type: Optional[str]
            self.client_id = kwargs.get('client_id', None)  # type: Optional[str]
            self.secret = kwargs.get('secret', None)  # type: Optional[str]
            self.shared_key = kwargs.get('shared_key', None)  # type: Optional[str]
            self.sas_token = kwargs.get('sas_token', None)  # type: Optional[str]
            self.token_provider = kwargs.get('token_provider', None)  # type: Optional[TokenProvider]
            self.endpoint = kwargs.get('endpoint', AzureCloudEndpoint.AZURE_PUBLIC)  # type: AzureCloudEndpoint

            # --- internal ---
            self._tenant = kwargs.get('tenant', None)  # type: Optional[str]
            self._auth_context = None

    @property
    def hostname(self) -> str:
        return self._hostname

    @hostname.setter
    def hostname(self, value: str):
        if StringUtils.is_null_or_white_space(value):
            raise ValueError('Hostname cannot be null or whitespace.')

        self._hostname = value
        self._formatted_hostname = self._format_hostname(self._remove_protocol_from_hostname(self._hostname))

    @property
    def root(self) -> str:
        return self._root

    @root.setter
    def root(self, value: str):
        self._root = self._extract_root_blob_container_and_sub_path(value)

    @property
    def tenant(self) -> str:
        return self._tenant

    @property
    def sas_token(self) -> str:
        return self._sas_token

    @sas_token.setter
    def sas_token(self, value: str):
        """
         The SAS token. If supplied string begins with '?' symbol, the symbol gets stripped away.
        :param value: SAS token
        """
        if value:
            # Remove the leading question mark, so we can append this token to URLs that already have it
            self._sas_token = value[1:] if value.startswith('?') else value
        else:
            self._sas_token = None

    def can_read(self) -> bool:
        return True

    def can_write(self) -> bool:
        return True

    def clear_cache(self) -> None:
        self._file_modified_time_cache.clear()

    async def compute_last_modified_time_async(self, corpus_path: str) -> Optional[datetime]:
        cachedValue = None
        if self._is_cache_enabled:
            cachedValue = self._file_modified_time_cache.get(corpus_path)

        if cachedValue is not None:
            return cachedValue
        else:
            adapter_path = self._create_formatted_adapter_path(corpus_path)

            request = self._build_request(adapter_path, 'HEAD')

            cdm_response = await self._http_client._send_async(request, self.wait_time_callback, self.ctx)
            if cdm_response.status_code == HTTPStatus.OK:
                lastTime = dateutil.parser.parse(typing.cast(str, cdm_response.response_headers['Last-Modified']))
                if lastTime is not None and self._is_cache_enabled:
                    self._file_modified_time_cache[corpus_path] = lastTime
                return lastTime

            return None

    def create_adapter_path(self, corpus_path: str) -> str:
        if corpus_path is None:
            return None

        if corpus_path.startswith('//'):
            corpus_path = corpus_path[1:]

        formatted_corpus_path = self._format_corpus_path(corpus_path)
        if formatted_corpus_path is None:
            return None

        if formatted_corpus_path in self._adapter_paths:
            return self._adapter_paths[formatted_corpus_path]
        else:
            return 'https://' + self._remove_protocol_from_hostname(self.hostname) + self._get_escaped_root() + self._escape_path(formatted_corpus_path)

    def create_corpus_path(self, adapter_path: str) -> Optional[str]:
        if adapter_path:
            start_index = len('https://')
            end_index = adapter_path.find('/', start_index + 1)

            if end_index < start_index:
                raise Exception('Unexpected adapter path:', adapter_path)

            hostname = self._format_hostname(adapter_path[start_index:end_index])

            if hostname == self._formatted_hostname and adapter_path[end_index:].startswith(self._get_escaped_root()):
                escaped_corpus_path = adapter_path[end_index + len(self._get_escaped_root()):]
                corpus_path = urllib.parse.unquote(escaped_corpus_path)

                if corpus_path not in self._adapter_paths:
                    self._adapter_paths[corpus_path] = adapter_path

                return corpus_path

        # Signal that we did not recognize path as one for this adapter.
        return None

    async def fetch_all_files_async(self, folder_corpus_path: str) -> List[str]:
        if folder_corpus_path is None:
            return None

        url = 'https://{}/{}'.format(self._formatted_hostname, self._root_blob_contrainer)
        escaped_folder_corpus_path = self._escape_path(folder_corpus_path)
        directory = self._escaped_root_sub_path + self._format_corpus_path(escaped_folder_corpus_path)
        if directory.startswith('/'):
            directory = directory[1:]

        continuation_token = None
        results = []

        while True:
            if continuation_token is None:
                request = self._build_request(
                    '{}?directory={}&maxResults={}&recursive=True&resource=filesystem'.format(url, directory,
                                                                                              self.http_max_results),
                    'GET')
            else:
                request = self._build_request(
                    '{}?continuation={}&directory={}&maxResults={}&recursive=True&resource=filesystem'.format(url,
                                                                                                              urllib.parse.quote(
                                                                                                                  continuation_token),
                                                                                                              directory,
                                                                                                              self.http_max_results),
                    'GET')

            cdm_response = await self._http_client._send_async(request, self.wait_time_callback, self.ctx)

            if cdm_response.status_code == HTTPStatus.OK:
                continuation_token = cdm_response.response_headers.get(self._http_xms_continuation)
                data = json.loads(cdm_response.content)

                for path in data['paths']:
                    if 'isDirectory' not in path or path['isDirectory'] != 'true':
                        name = path['name']  # type: str
                        name_without_root_sub_path = name[len(
                            self._unescaped_root_sub_path) + 1:] if self._unescaped_root_sub_path and name.startswith(
                            self._unescaped_root_sub_path) else name

                        filepath = self._format_corpus_path(name_without_root_sub_path)
                        results.append(filepath)

                        lastTimeString = path.get('lastModified')
                        if lastTimeString is not None and self._is_cache_enabled:
                            self._file_modified_time_cache[filepath] = dateutil.parser.parse(lastTimeString)

            if continuation_token is None:
                break

        return results

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

        if self.endpoint:
            config_object['endpoint'] = StringUtils.snake_case_to_pascal_case(self.endpoint.name)

        result_config['config'] = config_object

        return json.dumps(result_config)

    async def read_async(self, corpus_path: str) -> str:
        url = self._create_formatted_adapter_path(corpus_path)

        request = self._build_request(url, 'GET')

        return await super()._read(request)

    def update_config(self, config: str):
        configs_json = json.loads(config)

        if configs_json.get('root'):
            self.root = configs_json['root']
        else:
            raise ValueError('Root has to be set for ADLS adapter.')

        if configs_json.get('hostname'):
            self.hostname = configs_json['hostname']
        else:
            raise ValueError('Hostname has to be set for ADLS adapter.')

        self.update_network_config(config)

        if configs_json.get('tenant') and configs_json.get('clientId'):
            self._tenant = configs_json['tenant']
            self.client_id = configs_json['clientId']

            # To keep backwards compatibility with config files that were generated before the introduction of the `endpoint` property.
            if not hasattr(self, 'endpoint') or not self.endpoint:
                self.endpoint = AzureCloudEndpoint.AZURE_PUBLIC

        if configs_json.get('locationHint'):
            self.location_hint = configs_json['locationHint']

        if configs_json.get('endpoint'):
            endpoint_from_config = StringUtils.pascal_case_to_snake_case(configs_json['endpoint'])
            if endpoint_from_config in AzureCloudEndpoint.__members__.keys():
                self.endpoint = AzureCloudEndpoint[endpoint_from_config]
            else:
                raise ValueError('Endpoint value should be a string of an enumeration value from the class AzureCloudEndpoint in Pascal case.')

    async def write_async(self, corpus_path: str, data: str) -> None:
        url = self._create_formatted_adapter_path(corpus_path)

        request = self._build_request(url + '?resource=file', 'PUT')

        await self._http_client._send_async(request, self.wait_time_callback, self.ctx)

        request = self._build_request(url + '?action=append&position=0', 'PATCH', data,
                                      'application/json; charset=utf-8')

        await self._http_client._send_async(request, self.wait_time_callback, self.ctx)

        request = self._build_request(url + '?action=flush&position=' + str(len(data)), 'PATCH')

        await self._http_client._send_async(request, self.wait_time_callback, self.ctx)

    def _apply_shared_key(self, shared_key: str, url: str, method: str, content: Optional[str] = None,
                          content_type: Optional[str] = None):
        headers = OrderedDict()
        headers[self._http_xms_date] = format_date_time(mktime(datetime.now().timetuple()))
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
        builder.append(str(content_length) + '\n' if content_length else '\n')  # Content length.
        builder.append('\n')  # Content-md5.
        builder.append(content_type + '\n' if content_type else '\n')  # Content-type.
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
                builder.append('\n{}:{}'.format(key_value_pair[0].lower(), urllib.parse.unquote(key_value_pair[1])))

        # Hash the payload.
        data_to_hash = ''.join(builder).rstrip()
        shared_key_bytes = self._try_from_base64_string(shared_key)
        if not shared_key_bytes:
            raise Exception('Couldn\'t encode the shared key.')

        message = base64.b64encode(
            hmac.new(shared_key_bytes, msg=data_to_hash.encode('utf-8'), digestmod=hashlib.sha256).digest()).decode(
            'utf-8')
        signed_string = 'SharedKey {}:{}'.format(account_name, message)

        headers[self._http_authorization] = signed_string

        return headers

    def _apply_sas_token(self, url: str) -> str:
        """
        Appends SAS token to the given URL.
        :param url: URL to be appended with the SAS token
        :return: URL with the SAS token appended
        """
        return '{}{}{}'.format(url, '?' if '?' not in url else '&', self.sas_token)

    def _build_request(self, url: str, method: str = 'GET', content: Optional[str] = None,
                       content_type: Optional[str] = None):
        if self.shared_key is not None:
            request = self._set_up_cdm_request(url, self._apply_shared_key(self.shared_key, url, method, content,
                                                                           content_type), method)
        elif self.sas_token is not None:
            request = self._set_up_cdm_request(self._apply_sas_token(url), None, method)
        elif self.tenant is not None and self.client_id is not None and self.secret is not None:
            token = self._generate_bearer_token()
            headers = {'Authorization': token['token_type'] + ' ' + token['access_token']}
            request = self._set_up_cdm_request(url, headers, method)
        elif self.token_provider is not None:
            headers = {'Authorization': self.token_provider.get_token()}
            request = self._set_up_cdm_request(url, headers, method)
        else:
            raise Exception('ADLS adapter is not configured with any auth method')

        if content is not None:
            request.content = content
            request.content_type = content_type

        return request

    def _create_formatted_adapter_path(self, corpus_path: str) -> str:
        adapter_path = self.create_adapter_path(corpus_path)

        if adapter_path is None:
            return None

        return adapter_path.replace(self.hostname, self._formatted_hostname)

    def _escape_path(self, unescaped_path: str):
        return urllib.parse.quote(unescaped_path).replace('%2F', '/')

    def _extract_root_blob_container_and_sub_path(self, root: str) -> str:
        # No root value was set
        if not root:
            self._root_blob_contrainer = ''
            self._update_root_sub_path('')
            return ''

        # Remove leading and trailing /
        prep_root = root[1:] if root[0] == '/' else root
        prep_root = prep_root[0: len(prep_root) - 1] if prep_root[len(prep_root) - 1] == '/' else prep_root

        # Root contains only the file-system name, e.g. "fs-name"
        if prep_root.find('/') == -1:
            self._root_blob_contrainer = prep_root
            self._update_root_sub_path('')
            return '/{}'.format(self._root_blob_contrainer)

        # Root contains file-system name and folder, e.g. "fs-name/folder/folder..."
        prep_root_array = prep_root.split('/')
        self._root_blob_contrainer = prep_root_array[0]
        self._update_root_sub_path('/'.join(prep_root_array[1:]))
        return '/{}/{}'.format(self._root_blob_contrainer, self._unescaped_root_sub_path)

    def _format_corpus_path(self, corpus_path: str) -> Optional[str]:
        path_tuple = StorageUtils.split_namespace_path(corpus_path)
        if not path_tuple:
            return None

        corpus_path = path_tuple[1]

        if corpus_path and corpus_path[0] != '/':
            corpus_path = '/' + corpus_path
        return corpus_path

    def _format_hostname(self, hostname: str) -> str:
        hostname = hostname.replace('.blob.', '.dfs.')
        port = ':443'
        if port in hostname:
            hostname = hostname[0:-len(port)]
        return hostname

    def _generate_bearer_token(self) -> Optional[dict]:
        self._build_context()
        result = self._auth_context.acquire_token_for_client(scopes=self._scope)
        if result and 'error' in result:
            error_description = result['error'] + ' error_description: ' + result['error_description'] \
                if 'error_description' in result else result['error']
            raise Exception('There was an error while acquiring ADLS Adapter\'s Token with '
                            'client ID/secret authentication. Exception: ' + error_description)

        if result is None or 'access_token' not in result or 'token_type' not in result:
            raise Exception('Received invalid ADLS Adapter\'s authentication result. The result may be None, or missing'
                            ' access_toke and/or token_type authorization header from the authentication result.')

        return result

    def _get_escaped_root(self):
        return '/' + self._root_blob_contrainer + '/' + self._escaped_root_sub_path if self._escaped_root_sub_path else '/' + self._root_blob_contrainer

    def _try_from_base64_string(self, content: str) -> Optional[bytes]:
        try:
            return base64.b64decode(content)
        except Exception:
            return None

    def _update_root_sub_path(self, value: str):
        self._unescaped_root_sub_path = value
        self._escaped_root_sub_path = self._escape_path(value)

    def _build_context(self):
        """Build context when users make the first call. Also need to ensure client Id, tenant and secret are not null."""
        if self._auth_context is None:
            self._auth_context = msal.ConfidentialClientApplication(
                self.client_id, authority=self.endpoint.value + self.tenant, client_credential=self.secret)

    def _remove_protocol_from_hostname(self, hostname: str) -> str:
        """
        Check if the hostname has a leading protocol.
        if it doesn't have, return the hostname
        if the leading protocol is not "https://", throw an error
        otherwise, return the hostname with no leading protocol.
        """
        if hostname.find('://') == -1:
            return hostname

        try:
            url = urllib.parse.urlsplit(hostname)
            if url.scheme == 'https':
                return hostname[len('https://'):]
        except Exception:
            raise ValueError('Please provide a valid hostname.')

        raise ValueError('ADLS Adapter only supports HTTPS, please provide a leading \"https://\" hostname or a non-protocol-relative hostname.')

