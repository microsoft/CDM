# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, Union, TYPE_CHECKING

from cdm.enums import CdmObjectType

from .cdm_collection import CdmCollection

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmImport, CdmObject


class CdmImportCollection(CdmCollection):
    def __init__(self, ctx: 'CdmCorpusContext', owner: 'CdmObject'):
        super().__init__(ctx, owner, CdmObjectType.IMPORT)

    def append(self, obj: Union[str, 'CdmImport'], moniker: Optional[str] = None) -> 'CdmImport':
        if not isinstance(obj, str):
            if obj._previous_owner is not None:
                absolute_path = self.ctx.corpus.storage.create_absolute_corpus_path(obj.corpus_path, obj._previous_owner)
                    
                # Need to make the import path relative to the resolved manifest instead of the original manifest.
                obj.corpus_path = self.ctx.corpus.storage.create_relative_corpus_path(absolute_path, self.owner)

            return super().append(obj)

        import_value = super().append(obj)
        if moniker is not None:
            import_value.moniker = moniker

        return import_value

    def item(self, corpus_path: str, moniker: Optional[str] = None, check_moniker: Optional[bool] = True) -> 'CdmImport':
        for x in self:
            if check_moniker:
                if x.corpus_path == corpus_path and x.moniker == moniker:
                    return x
            else:
                if x.corpus_path == corpus_path:
                    return x
        return None

