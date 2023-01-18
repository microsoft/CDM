# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import List

from .no_override import NoOverride


class OverrideFetchAllFiles(NoOverride):
    def __init__(self, base_adapter) -> None:
        super().__init__(base_adapter)

    async def fetch_all_files_async(self, folder_corpus_path: str) -> List[str]:
        return await self.local_adapter.fetch_all_files_async(folder_corpus_path)
