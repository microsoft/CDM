from typing import Union

from cdm.enums import CdmObjectType

from .cdm_collection import CdmCollection


class CdmFolderCollection(CdmCollection):
    def __init__(self, ctx: 'CdmCorpusContext', owner: 'CdmObject'):
        super().__init__(ctx, owner, CdmObjectType.FOLDER_DEF)

    def append(self, obj: Union[str, 'CdmFolderDefinition']) -> 'CdmFolderDefinition':
        obj = super().append(obj)
        self._add_item_modifications(obj)
        return obj

    def insert(self, index: int, obj: 'CdmFolderDefinition') -> None:
        self._add_item_modifications(obj)
        super().insert(index, obj)

    def _add_item_modifications(self, obj: 'CdmFolderDefinition') -> None:
        obj.corpus = self.owner.corpus
        obj.namespace = self.owner.namespace
        obj.folder_path = '{}{}/'.format(self.owner.folder_path, obj.name)
