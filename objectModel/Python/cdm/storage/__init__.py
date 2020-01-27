# ------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation.
# All rights reserved.
# ------------------------------------------------------------------------------

from .adls import ADLSAdapter
from .github import GithubAdapter
from .base import StorageAdapterBase
from .local import LocalAdapter
from .remote import RemoteAdapter
from .resource import ResourceAdapter
from .storage_manager import StorageManager

__all__ = [
    'ADLSAdapter',
    'GithubAdapter',
    'StorageAdapterBase',
    'LocalAdapter',
    'RemoteAdapter',
    'ResourceAdapter',
    'StorageAdapterBase',
    'StorageManager'
]
