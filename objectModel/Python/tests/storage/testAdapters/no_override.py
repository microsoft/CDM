# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.storage.base import StorageAdapterBase


class NoOverride(StorageAdapterBase):
    def __init__(self, base_adapter) -> None:
        super().__init__()
        self.local_adapter = base_adapter

    def can_read(self) -> bool:
        return True

    async def read_async(self, corpus_path: str) -> str:
        return await self.local_adapter.read_async(corpus_path)

