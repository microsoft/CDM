# ----------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ----------------------------------------------------------------------

import abc
import datetime
from typing import Any, List, Optional


class StorageAdapterBase(abc.ABC):
    """Abstract base class of all storage adapters that can read and write documents to and from
    data sources. It offers the flexibility to interact with data from multiple sources, and can be
    used to create new custom storage adapters.
    """

    @abc.abstractmethod
    def can_read(self) -> bool:
        """Return true if adapter can read data from its source, false otherwise."""

    @abc.abstractmethod
    def can_write(self) -> bool:
        """Return true if adapter can write data to its source, false otherwise."""

    @abc.abstractmethod
    async def read_async(self, corpus_path: str) -> str:
        """Return data read from the specified document path."""

    @abc.abstractmethod
    async def write_async(self, corpus_path: str, data: str) -> None:
        """Write data to the specified document path."""

    @abc.abstractmethod
    def create_adapter_path(self, corpus_path: str) -> str:
        """Convert the corpus path to a path in domain of this adapter."""

    @abc.abstractmethod
    def create_corpus_path(self, adapter_path: str) -> Optional[str]:
        """Convert the path in domain of this adapter to a corpus path."""

    @abc.abstractmethod
    def clear_cache(self) -> None:
        """Clear the cache of files and folders (if storage adapter uses a cache)."""

    @abc.abstractmethod
    async def compute_last_modified_time_async(self, adapter_path: str) -> Optional[datetime.datetime]:
        """Return last modified time of specified document."""

    @abc.abstractmethod
    async def fetch_all_files_async(self, folder_corpus_path: str) -> List[str]:
        """Return list of corpus paths to all files and folders under the specified corpus path to
        a folder.
        """
