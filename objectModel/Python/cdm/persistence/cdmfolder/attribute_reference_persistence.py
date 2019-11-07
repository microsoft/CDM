from typing import Optional

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmAttributeReference, CdmCorpusContext

from .cdm_object_ref_persistence import CdmObjectRefPersistence


class AttributeReferencePersistence(CdmObjectRefPersistence):
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data: str) -> Optional[CdmAttributeReference]:
        if not data:
            return None

        simple_reference = True
        attribute = data

        return ctx.corpus.make_ref(CdmObjectType.ATTRIBUTE_REF, attribute, simple_reference)
