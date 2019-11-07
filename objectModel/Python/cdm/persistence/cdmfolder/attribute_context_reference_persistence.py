from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType

from .cdm_object_ref_persistence import CdmObjectRefPersistence

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmAttributeContextReference


class AttributeContextReferencePersistence(CdmObjectRefPersistence):
    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', obj: str) -> Optional['CdmAttributeContextReference']:
        if not obj:
            return
        return ctx.corpus.make_ref(CdmObjectType.ATTRIBUTE_CONTEXT_REF, obj, None)
