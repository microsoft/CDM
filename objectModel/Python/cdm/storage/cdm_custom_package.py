# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import importlib
import os
import sys
from typing import Optional
from .base import StorageAdapterBase


def remove_starting_slash(path: str) -> str:
    if path[0] == '/' or path[0] == '\\':
        return path[1:]
    return path


class CdmCustomPackageAdapter(StorageAdapterBase):
    """An adapter pre-configured to read schema files from a package."""

    def __init__(self, package_or_name, root: str = '') -> None:
        """Constructs a CdmStandardsAdapter.
            # Parameters:
            #   root: The root path specifies either to read the standard files in logical or resolved form.
        """
        super().__init__()

        if not package_or_name:
            raise Exception('No package passed in, please pass in a package name or package when constructing the CdmCustomPackageAdapter.')

        if isinstance(package_or_name, str):
            try:
                package = importlib.import_module(package_or_name)
            except Exception as e:
                raise Exception('Couldn\'t find package \'{}\', please install the package, and add it as dependency of the project.'.format(package_or_name))
        else:
            package = package_or_name

        if package.__package__ not in sys.modules:
            raise Exception('Couldn\'t find package \'{}\', please install the package, and add it as dependency of the project.'.format(package.__package__))

        self.root = os.path.join(os.path.dirname(package.__file__), root)

    def can_read(self) -> bool:
        return True

    def can_write(self) -> bool:
        return False

    def create_adapter_path(self, corpus_path: str) -> str:
        return os.path.join(self.root, remove_starting_slash(corpus_path))

    def create_corpus_path(self, adapter_path: str) -> Optional[str]:
        formatted_adapter_path = os.path.abspath(remove_starting_slash(adapter_path)).replace('\\', '/')
        formatted_root = self.root.replace('\\', '/')

        if formatted_adapter_path.startswith(formatted_root):
            return formatted_adapter_path[len(formatted_root):]

    async def read_async(self, corpus_path: str) -> str:
        adapter_path = self.create_adapter_path(corpus_path)
        with open(adapter_path, 'r', encoding='utf-8') as file:
            return file.read()
