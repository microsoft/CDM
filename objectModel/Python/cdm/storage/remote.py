# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import datetime
import json
from typing import Dict, List, Optional
import uuid

from cdm.storage.network import NetworkAdapter
from cdm.utilities.network.cdm_http_client import CdmHttpClient

from .base import StorageAdapterBase


class RemoteAdapter(NetworkAdapter, StorageAdapterBase):
    """Remote file system storage adapter"""

    def __init__(self, hosts: Optional[Dict[str, str]] = None) -> None:
        super().__init__()
        super(NetworkAdapter, self).__init__()
        super(StorageAdapterBase, self).__init__()

        # --- internal ---
        self._hosts = {}  # type: Dict[str, str]
        self._sources = {}  # type: Dict[str, str]
        self._sources_by_id = {}  # type: Dict[str, Dict[str, str]]
        self._type = 'remote'

        self._http_client = CdmHttpClient()  # type: CdmHttpClient

        if hosts:
            self.hosts = hosts

    @property
    def hosts(self) -> Dict[str, str]:
        return self._hosts

    @hosts.setter
    def hosts(self, hosts: Dict[str, str]) -> None:
        self._hosts = hosts
        for key, value in hosts.items():
            self._fetch_or_register_host_info(value, key)

    def can_read(self) -> bool:
        return True

    async def read_async(self, corpus_path: str) -> str:
        url = self.create_adapter_path(corpus_path)
        request = self._set_up_cdm_request(url, {'User-Agent': 'CDM'}, 'GET')

        return await super()._read(request)

    def create_adapter_path(self, corpus_path: str) -> str:
        if not corpus_path:
            return None

        host_key_end = corpus_path.find('/', 1)
        host_key = corpus_path[1:host_key_end]

        if host_key_end == -1 or host_key not in self._sources_by_id:
            raise ValueError('Host ID not identified by remote adapter. Make sure to use create_corpus_path to get the corpus path.')

        protocol = self._sources_by_id[host_key]['protocol']
        host = self._sources_by_id[host_key]['host']
        path = corpus_path[host_key_end:]

        return protocol + '://' + host + path

    def create_corpus_path(self, adapter_path: str) -> Optional[str]:
        protocol_index = adapter_path.find('://')

        if protocol_index == -1:
            return None

        path_index = adapter_path.find('/', protocol_index + 3)
        path = adapter_path[path_index:] if path_index != -1 else ''

        host_info = self._fetch_or_register_host_info(adapter_path)

        return '/{}{}'.format(host_info['key'], path)

    def clear_cache(self) -> None:
        self._sources = {}
        self._sources_by_id = {}

    def fetch_config(self) -> str:
        result_config = {'type': self._type}
        config_object = {}

        if self.hosts is not None:
            # Go through the hosts dictionary and build a dictionary for each item.
            hosts_array = [{key: value} for key, value in self.hosts.items()]

            config_object['hosts'] = hosts_array

        # Try constructing network configs.
        config_object.update(self.fetch_network_config())

        if self.location_hint:
            config_object['locationHint'] = self.location_hint

        result_config['config'] = config_object

        return json.dumps(result_config)

    def update_config(self, config: str) -> None:
        if not config:
            raise Exception('Remote adapter needs a config.')

        self.update_network_config(config)

        config_json = json.loads(config)

        if config_json.get('locationHint'):
            self.location_hint = config_json['locationHint']

        hosts = config_json['hosts']

        # Create a temporary dictionary.
        hosts_dict = {}

        # Iterate through all of the items in the hosts array.
        for host in hosts:
            # Get the property's key and value and save it to the dictionary.
            for key, value in host.items():
                hosts_dict[key] = value

        # Assign the temporary dictionary to the hosts dictionary.
        self.hosts = hosts_dict

    def _fetch_or_register_host_info(self, adapter_path: str, key: Optional[str] = None) -> Dict[str, str]:
        protocol_index = adapter_path.find('://')

        if protocol_index == -1:
            return None

        path_index = adapter_path.find('/', protocol_index + 3)
        host_index = path_index if path_index != -1 else len(adapter_path)

        protocol = adapter_path[0: protocol_index]
        host = adapter_path[protocol_index + 3: host_index]
        full_host = adapter_path[0: host_index]

        if not self._sources.get(full_host) or (key is not None and self._sources[full_host] != key):
            guid = key if key else str(uuid.uuid4())
            self._sources[full_host] = guid
            self._sources_by_id[guid] = {
                'protocol': protocol,
                'host': host
            }

        return {
            'key': self._sources[full_host],
            'protocol': protocol,
            'host': host
        }
