# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

import datetime
from typing import Any, Dict, List, Optional

from cdm.storage.network import NetworkAdapter
from cdm.utilities.network.cdm_http_client import CdmHttpClient

from .base import StorageAdapterBase


class GithubAdapter(NetworkAdapter, StorageAdapterBase):
    """Github storage adapter"""

    _api_root = 'https://api.github.com/repos/microsoft/CDM/contents/schemaDocuments'  # type: str
    _raw_root = 'https://raw.githubusercontent.com/Microsoft/CDM/master/schemaDocuments'  # type: str

    def __init__(self, **kwargs) -> None:
        super().__init__(kwargs.get('http_config', {}))
        self._is_folder = {}  # type: Dict[str, bool]
        self.http_client = CdmHttpClient(self._raw_root)  # type: CdmHttpClient

    def can_read(self) -> bool:
        return True

    def can_write(self) -> bool:
        return False

    async def read_async(self, corpus_path: str) -> str:
        request = self.set_up_cdm_request(corpus_path, {'User-Agent': 'CDM'}, 'GET')
        return await super().read(request)

    async def write_async(self, corpus_path: str, data: str) -> None:
        raise NotImplementedError()

    def create_adapter_path(self, corpus_path: str) -> str:
        return self._raw_root + corpus_path

    def create_corpus_path(self, adapter_path: str) -> Optional[str]:
        if adapter_path.startswith(self._raw_root):
            return adapter_path[len(self._raw_root):]

        # Signal that we did not recognize path as one for this adapter.
        return None

    def clear_cache(self) -> None:
        self._is_folder = {}

    async def compute_last_modified_time_async(self, adapter_path: str) -> Optional[datetime.datetime]:
        return datetime.datetime.now()

    async def fetch_all_files_async(self, folder_corpus_path: str) -> List[str]:
        # Implement later.
        return []
