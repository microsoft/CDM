# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING
import warnings

from cdm.utilities import logger, Errors, ResolveOptions
from cdm.enums import CdmObjectType

from .cdm_object_simple import CdmObjectSimple

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmDocumentDefinition
    from cdm.utilities import FriendlyFormatNode, VisitCallback


class CdmImport(CdmObjectSimple):
    def __init__(self, ctx: 'CdmCorpusContext', corpus_path: str, moniker: str) -> None:
        super().__init__(ctx)

        self.corpus_path = corpus_path  # type: str
        self.moniker = moniker  # type: str

        # --- internal ---
        self._document = None  # type: Optional[CdmDocumentDefinition]

        self._TAG = CdmImport.__name__

    @property
    def doc(self) -> Optional['CdmDocumentDefinition']:
        warnings.warn('This property is deprecated and it is likely to be removed soon..', DeprecationWarning)
        return self._document

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.IMPORT

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmImport'] = None) -> 'CdmImport':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        if not host:
            copy = CdmImport(self.ctx, self.corpus_path, self.moniker)
        else:
            copy = host
            copy.ctx = self.ctx
            copy.corpus_path = self.corpus_path
            copy.moniker = self.moniker

        copy._document = self._document

        return copy

    def validate(self) -> bool:
        if not bool(self.corpus_path):
            logger.error(self._TAG, self.ctx, Errors.validate_error_string(self.at_corpus_path, ['corpus_path']))
            return False
        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        # not much to do
        if pre_children and pre_children(self, path_from):
            return False

        if post_children and post_children(self, path_from):
            return True

        return False
