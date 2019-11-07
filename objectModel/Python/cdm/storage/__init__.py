# ------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ------------------------------------------------------------------------------

from .adls import AdlsAdapter
from .github import GithubAdapter
from .base import StorageAdapterBase
from .local import LocalAdapter
from .remote import RemoteAdapter
from .storage_manager import StorageManager

__all__ = [
    'AdlsAdapter',
    'GithubAdapter',
    'StorageAdapterBase',
    'LocalAdapter',
    'RemoteAdapter',
    'StorageAdapterBase',
    'StorageManager'
]
