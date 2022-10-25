# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Dict

from cdm.storage import StorageAdapterBase


class MockStorageAdapter(StorageAdapterBase):
    def __init__(self, target: Dict[str, str]):
        super().__init__()
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

