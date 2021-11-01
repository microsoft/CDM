# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

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
        optional = None  # type: Optional[bool]
        data_type = None
        applied_traits = None

        if isinstance(obj, str):
            data_type = obj
        else:
            simple_reference = False
            optional = obj.optional

            if isinstance(obj.dataTypeReference, str):
                data_type = obj.dataTypeReference
            else:
                data_type = DataTypePersistence.from_data(ctx, obj.dataTypeReference)

        data_type_reference = ctx.corpus.make_ref(CdmObjectType.DATA_TYPE_REF, data_type, simple_reference)

        if optional is not None:
            data_type_reference.optional = optional

        if not isinstance(obj, str):
            applied_traits = utils.create_trait_reference_array(ctx, obj.get('appliedTraits'))

        utils.add_list_to_cdm_collection(data_type_reference.applied_traits, applied_traits)

        return data_type_reference
