# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import sys
from typing import Optional
from commondatamodel_objectmodel_cdmstandards import root
from .base import StorageAdapterBase


def remove_starting_slash(path: str) -> str:
    if path[0] == '/' or path[0] == '\\':
        return path[1:]
    return path


class CdmStandardsAdapter(StorageAdapterBase):
    """An adapter pre-configured to read the standard schema files published by CDM."""

    def __init__(self) -> None:
        """Constructs a CdmStandardsAdapter.
            # Parameters:
            #   root: The root path specifies either to read the standard files in logical or resolved form.
        """
        super().__init__()

        if 'commondatamodel_objectmodel_cdmstandards' not in sys.modules:
            raise Exception('Couldn\'t find the package \'commondatamodel-objectmodel-cdmstandards\', please install the package, and add it as dependency of the project.')

        # --- internal ---
        self._type = 'cdm-standards'

    def can_read(self) -> bool:
        return True

    def can_write(self) -> bool:
        return False

    def create_adapter_path(self, corpus_path: str) -> str:
        return os.path.join(root, remove_starting_slash(corpus_path))

    def create_corpus_path(self, adapter_path: str) -> Optional[str]:
        formatted_adapter_path = os.path.abspath(remove_starting_slash(adapter_path)).replace('\\', '/')
        formatted_root = root.replace('\\', '/')

        if formatted_adapter_path.startswith(formatted_root):
            return formatted_adapter_path[len(formatted_root):]

    async def read_async(self, corpus_path: str) -> str:
        adapter_path = self.create_adapter_path(corpus_path)
        with open(adapter_path, 'r', encoding='utf-8') as file:
            return file.read()
