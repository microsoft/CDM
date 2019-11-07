from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType

from .cdm_object_simple import CdmObjectSimple

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmDocumentDefinition
    from cdm.utilities import FriendlyFormatNode, ResolveOptions, VisitCallback


class CdmImport(CdmObjectSimple):
    def __init__(self, ctx: 'CdmCorpusContext', corpus_path: str, moniker: str) -> None:
        super().__init__(ctx)

        self.corpus_path = corpus_path  # type: str
        self.moniker = moniker  # type: str

        # internal
        self.doc = None  # type: Optional[CdmDocumentDefinition]

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.IMPORT

    @property
    def _resolved_document(self) -> Optional['CdmDocumentDefinition']:
        """returns the document that has been resolved for this import"""
        return self.doc

    def copy(self, res_opt: Optional['ResolveOptions'] = None) -> 'CdmImport':
        copy = CdmImport(self.ctx, self.corpus_path, self.moniker)
        copy.doc = self.doc

        return copy

    def validate(self) -> bool:
        return bool(self.corpus_path)

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        # not much to do
        if pre_children and pre_children(self, path_from):
            return False

        if post_children and post_children(self, path_from):
            return True

        return False
