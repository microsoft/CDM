from typing import Optional, Union, TYPE_CHECKING

from cdm.enums import CdmObjectType

from .cdm_collection import CdmCollection, T

if TYPE_CHECKING:
    from .cdm_import import CdmImport


class CdmImportCollection(CdmCollection):
    def __init__(self, ctx: 'CdmCorpusContext', owner: 'CdmObject'):
        super().__init__(ctx, owner, CdmObjectType.IMPORT)

    def append(self, obj: Union[str, 'CdmImport'], moniker: Optional[str] = None) -> None:
        if isinstance(obj, str):
            corpus_path = obj
            obj = self.ctx.corpus.make_object(self.default_type)
            obj.corpus_path = corpus_path

        if moniker is not None:
            obj.moniker = moniker

        return super().append(obj)
