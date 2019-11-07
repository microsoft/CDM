# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

import datetime
from typing import Any, Dict, List, Optional
import uuid

from cdm.storage.network import NetworkAdapter
from cdm.utilities.network.cdm_http_client import CdmHttpClient

from .base import StorageAdapterBase


class RemoteAdapter(NetworkAdapter, StorageAdapterBase):
    """Remote file system storage adapter"""

    def __init__(self, hosts: Dict[str, str], **kwargs) -> None:
        super().__init__(kwargs.get('http_config', {}))
        self._sources = {}  # type: Dict[str, str]
        self._sources_by_id = {}  # type: Dict[str, Dict[str, str]]

        for key, value in hosts.items():
            self._fetch_or_register_host_info(value, key)

        self.http_client = CdmHttpClient()  # type: CdmHttpClient

    def can_read(self) -> bool:
        return True

    def can_write(self) -> bool:
        return False

    async def read_async(self, corpus_path: str) -> str:
        url = self.create_adapter_path(corpus_path)
        request = self.set_up_cdm_request(url, {'User-Agent': 'CDM'}, 'GET')

        return await super().read(request)

    async def write_async(self, corpus_path: str, data: str) -> None:
        raise NotImplementedError()

    def create_adapter_path(self, corpus_path: str) -> str:
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

    async def compute_last_modified_time_async(self, adapter_path: str) -> Optional[datetime.datetime]:
        return datetime.datetime.now()

    async def fetch_all_files_async(self, folder_corpus_path: str) -> List[str]:
        # TODO: implement
        return []

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
