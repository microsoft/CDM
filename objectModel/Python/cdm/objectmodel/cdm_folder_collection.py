# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import threading
from typing import Union, List, TYPE_CHECKING

from cdm.enums import CdmObjectType

from .cdm_collection import CdmCollection

if TYPE_CHECKING:
    from .cdm_folder_def import CdmFolderDefinition


class CdmFolderCollection(CdmCollection):
    def __init__(self, ctx: 'CdmCorpusContext', owner: 'CdmObject'):
        super().__init__(ctx, owner, CdmObjectType.FOLDER_DEF)

        self._folder_lock = threading.RLock()

    def append(self, obj: Union[str, 'CdmFolderDefinition']) -> 'CdmFolderDefinition':
        with self._folder_lock:
            if isinstance(obj, str):
                obj = self.ctx.corpus.make_object(self.default_type, obj)

            self._add_item_modifications(obj)

            return super().append(obj) 

    def insert(self, index: int, obj: 'CdmFolderDefinition') -> None:
        self._add_item_modifications(obj)
        super().insert(index, obj)

    def extend(self, folder_list: List['CdmFolderDefinition']) -> None:
        for folder in folder_list:
            self.append(folder)

    def _add_item_modifications(self, obj: 'CdmFolderDefinition') -> None:
        obj._corpus = self.owner._corpus
        obj._namespace = self.owner._namespace
        obj._folder_path = '{}{}/'.format(self.owner._folder_path, obj.name)
        # TODO: At this point we should also propagate the root adapter into the child folder
        # and all its sub-folders and contained documents. For now, don't add things to the
        # folder unless it's tied to an adapter root.

    def _get_or_create(self, name: str) -> 'CdmFolderDefinition':
        result = None  # type: Optional[CdmFolderDefinition]
        with self._folder_lock:
            for folder in self:
                if name == folder.name:
                    result = folder
                    break
            if not result:
                result = self.append(name)

            return result

    @property
    def _owner(self) -> 'CdmFolderDefinition':
        return super().owner
