# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

from datetime import datetime
import json
import os
from typing import List, Optional

from .base import StorageAdapterBase


class LocalAdapter(StorageAdapterBase):
    """Local file system storage adapter"""

    def __init__(self, root: Optional[str] = '') -> None:
        self.root = root  # type: str
        self.location_hint = None  # type: Optional[str]

        # --- internal ---
        self._full_root = os.path.abspath(self.root)
        self._type = 'local'

    def can_read(self) -> bool:
        return True

    def can_write(self) -> bool:
        return True

    async def read_async(self, corpus_path: str) -> str:
        adapter_path = self.create_adapter_path(corpus_path)

        with open(adapter_path, 'r', encoding='utf-8') as file:
            return file.read()

    async def write_async(self, corpus_path: str, data: str) -> None:
        adapter_path = self.create_adapter_path(corpus_path)
        parent_dir = os.path.abspath(os.path.join(adapter_path, os.pardir))
        os.makedirs(parent_dir, exist_ok=True)

        with open(adapter_path, 'w', encoding='utf-8') as file:
            file.write(data)

    def create_adapter_path(self, corpus_path: str) -> str:
        corpus_path = corpus_path[(corpus_path.find(':') + 1):].lstrip('\\/')
        return os.path.normpath(os.path.join(self._full_root, corpus_path))

    def create_corpus_path(self, adapter_path: str) -> Optional[str]:
        if not adapter_path.startswith('http'):
            normalized_adapter_path = os.path.abspath(adapter_path).replace('\\', '/')
            normalized_root = self._full_root.replace('\\', '/')

            if normalized_adapter_path.startswith(normalized_root):
                return normalized_adapter_path[len(normalized_root):]

        # Signal that we did not recognize path as one for self adapter.
        return None

    def clear_cache(self) -> None:
        pass

    async def compute_last_modified_time_async(self, adapter_path: str) -> Optional[datetime]:
        if os.path.exists(adapter_path):
            return datetime.fromtimestamp(os.path.getmtime(adapter_path))
        return None

    async def fetch_all_files_async(self, folder_corpus_path: str) -> List[str]:
        adapter_folder = self.create_adapter_path(folder_corpus_path)
        adapter_files = [os.path.join(dp, fn) for dp, dn, fns in os.walk(adapter_folder) for fn in fns]
        return [self.create_corpus_path(file) for file in adapter_files]

    def fetch_config(self) -> str:
        result_config = {'type': self._type}

        config_object = {'root': self.root}

        if self.location_hint:
            config_object['locationHint'] = self.location_hint

        result_config['config'] = config_object

        return json.dumps(result_config)

    def update_config(self, config: str) -> None:
        if not config:
            raise Exception('Local adapter needs a config.')

        config_json = json.loads(config)

        if not config_json.get('root'):
            raise Exception('The root has to be specified and cannot be null.')

        self.root = config_json['root']

        if config_json.get('locationHint'):
            self.location_hint = config_json['locationHint']

        self._full_root = os.path.abspath(self.root)
