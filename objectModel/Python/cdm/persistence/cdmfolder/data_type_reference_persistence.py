from typing import Union, Optional

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmDataTypeReference

from . import utils
from .cdm_object_ref_persistence import CdmObjectRefPersistence
from .types import DataTypeReference


class DataTypeReferencePersistence(CdmObjectRefPersistence):
    @staticmethod
    def from_data(ctx: CdmCorpusContext, obj: Union[str, DataTypeReference]) -> Optional[CdmDataTypeReference]:
        if not obj:
            return None

        from .data_type_persistence import DataTypePersistence

        simple_reference = True
        data_type = None
        applied_traits = None

        if isinstance(obj, str):
            data_type = obj
        else:
            simple_reference = False
            if isinstance(obj.dataTypeReference, str):
                data_type = obj.dataTypeReference
            else:
                data_type = DataTypePersistence.from_data(ctx, obj.dataTypeReference)

        data_type_reference = ctx.corpus.make_ref(CdmObjectType.DATA_TYPE_REF, data_type, simple_reference)

        if not isinstance(obj, str):
            applied_traits = utils.create_trait_reference_array(ctx, obj.get('appliedTraits'))
            data_type_reference.applied_traits.extend(applied_traits)

        return data_type_reference
