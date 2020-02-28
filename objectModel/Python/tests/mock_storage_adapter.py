# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from datetime import datetime
from typing import Dict, List, Optional

from cdm.storage import StorageAdapterBase


class MockStorageAdapter(StorageAdapterBase):
    def __init__(self, target: Dict[str, str]):
        self.target = target  # type:  Dict[str, str]

    def can_write(self) -> bool:
        return True

    async def write_async(self, corpus_path: str, data: str) -> None:
        path = self.create_adapter_path(corpus_path)
        self.target[path] = data

    def create_adapter_path(self, corpus_path: str) -> str:
        if corpus_path.find(':') != -1:
            corpus_path = corpus_path[corpus_path.find(':') + 1:]
        return corpus_path

    def can_read(self) -> bool:
        raise NotImplementedError()

    def clear_cache(self) -> None:
        raise NotImplementedError()

    async def fetch_all_files_async(self, folder_corpus_path: str) -> List[str]:
        raise NotImplementedError()

    def create_corpus_path(self, adapter_path: str) -> Optional[str]:
        raise NotImplementedError()

    async def read_async(self, corpus_path: str) -> str:
        raise NotImplementedError()

    async def compute_last_modified_time_async(self, adapter_path: str) -> Optional[datetime]:
        raise NotImplementedError()
