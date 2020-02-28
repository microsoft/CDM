# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, List

from cdm.enums import CdmObjectType

from .cdm_collection import CdmCollection


class CdmFolderCollection(CdmCollection):
    def __init__(self, ctx: 'CdmCorpusContext', owner: 'CdmObject'):
        super().__init__(ctx, owner, CdmObjectType.FOLDER_DEF)

    def append(self, obj: Union[str, 'CdmFolderDefinition']) -> 'CdmFolderDefinition':
        if isinstance(obj, str):
            return self.append(self.ctx.corpus.make_object(self.default_type, obj))

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
        obj.namespace = self.owner.namespace
        obj.folder_path = '{}{}/'.format(self.owner.folder_path, obj.name)
        # TODO: At this point we should also propagate the root adapter into the child folder
        # and all its sub-folders and contained documents. For now, don't add things to the
        # folder unless it's tied to an adapter root.

    @property
    def _owner(self) -> 'CdmFolderDefinition':
        return super().owner
