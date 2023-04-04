# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, Union, TYPE_CHECKING

from cdm.enums import CdmObjectType

from .attribute_group_persistence import AttributeGroupPersistence
from .cdm_object_ref_persistence import CdmObjectRefPersistence
from cdm.persistence.cdmfolder import utils

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmAttributeGroupReference
    from .types import AttributeGroupReference


class AttributeGroupReferencePersistence(CdmObjectRefPersistence):
    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', data: Union[str, 'AttributeGroupReference'], entity_name: Optional[str] = None) -> Optional['CdmAttributeGroupReference']:
        if not data:
            return None

        simple_reference = True
        attribute_group = None

        if isinstance(data, str):
            attribute_group = data
        else:
            simple_reference = False
            if isinstance(data.attributeGroupReference, str):
                attribute_group = data.attributeGroupReference
            else:
                attribute_group = AttributeGroupPersistence.from_data(ctx, data.attributeGroupReference, entity_name)

        att_group_reference = ctx.corpus.make_ref(CdmObjectType.ATTRIBUTE_GROUP_REF, attribute_group, simple_reference) # type : CdmAttributeGroupReference

        # now with applied traits!
        applied_traits = None # type : List[CdmTraitReferenceBase]
        if not isinstance(data, str):
            applied_traits = utils.create_trait_reference_array(ctx, data.get('appliedTraits'))
        utils.add_list_to_cdm_collection(att_group_reference.applied_traits, applied_traits)

        return att_group_reference

