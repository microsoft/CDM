# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, Optional, List

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmPurposeReference

from . import utils
from .cdm_object_ref_persistence import CdmObjectRefPersistence
from .purpose_persistence import PurposePersistence
from .types import PurposeReference


class PurposeReferencePersistence(CdmObjectRefPersistence):
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data: Union[str, PurposeReference]) -> Optional[CdmPurposeReference]:
        if not data:
            return None

        simple_reference = True
        applied_traits = None
        purpose = None

        if isinstance(data, str):
            purpose = data
        else:
            simple_reference = False
            if isinstance(data.purposeReference, str):
                purpose = data.purposeReference
            else:
                purpose = PurposePersistence.from_data(ctx, data.purposeReference)

        purpose_reference = ctx.corpus.make_ref(CdmObjectType.PURPOSE_REF, purpose, simple_reference)

        if not isinstance(data, str):
            applied_traits = utils.create_trait_reference_array(ctx, data.get('appliedTraits'))
            purpose_reference.applied_traits.extend(applied_traits)

        return purpose_reference
