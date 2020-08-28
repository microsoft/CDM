# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import datetime
from .cache_context import StorageAdapterCacheContext
from typing import List, Optional

class StorageAdapterBase:
    """Abstract base class of all storage adapters that can read and write documents to and from
    data sources. It offers the flexibility to interact with data from multiple sources, and can be
    used to create new custom storage adapters.
    """

    def __init__(self):
        self.location_hint = None  # type: Optional[str]

        # --- internal ---
        self._active_cache_context = set() # type: Set[CacheContext] 

    @property
    def location_hint(self) -> str:
        return self._location_hint

    @location_hint.setter
    def location_hint(self, value: str):
        self._location_hint = value

    def can_read(self) -> bool:
        """Return true if adapter can read data from its source, false otherwise."""
        return False

    def can_write(self) -> bool:
        """Return true if adapter can write data to its source, false otherwise."""
        return False

    async def read_async(self, corpus_path: str) -> str:
        """Return data read from the specified document path."""
        raise NotImplementedError('Read operation not supported by this adapter') 

    async def write_async(self, corpus_path: str, data: str) -> None:
        """Write data to the specified document path."""
        raise NotImplementedError('Write operation not supported by this adapter') 

    def create_adapter_path(self, corpus_path: str) -> str:
        """Convert the corpus path to a path in domain of this adapter."""
        return corpus_path

    def create_corpus_path(self, adapter_path: str) -> Optional[str]:
        """Convert the path in domain of this adapter to a corpus path."""
        return adapter_path

    async def compute_last_modified_time_async(self, corpus_path: str) -> Optional[datetime.datetime]:
        """Return last modified time of specified document."""
        return datetime.datetime.now()

    async def fetch_all_files_async(self, folder_corpus_path: str) -> List[str]:
        """Return list of corpus paths to all files and folders under the specified corpus path to
        a folder.
        """
        return None

    def clear_cache(self) -> None:
        """Clear the cache of files and folders (if storage adapter uses a cache)."""        

    @property
    def _is_cache_enabled(self) -> bool:
        """If true inherited classes should cache and reuse file query results if they support this"""
        return len(self._active_cache_context) > 0

    def create_file_query_cache_context(self):
        """Calling this function tells the adapter it may cache and reuse file query results, as opposed to
        reissuing queries to the underlying file storage, which may be a costly operation. This adapter is 
        allowed to cache and reuse queries until the object returned by this function has its dispose 
        function called. If createFileQueryCacheContext is called multiple times, caching is allowed until 
        all objects returned have thier dispose function called. Intended usage is for callers to wrap a 
        set of operations that should use caching with a try-finally block and call dispose inside finally.
        """
        cache_context = StorageAdapterCacheContext()
        self._active_cache_context.add(cache_context)
        # set the body of the dispose function here to avoid circular references
        def dispose():
            self._active_cache_context.remove(cache_context)
            if not self._is_cache_enabled:
                self.clear_cache()
        cache_context.dispose = dispose
        return cache_context

