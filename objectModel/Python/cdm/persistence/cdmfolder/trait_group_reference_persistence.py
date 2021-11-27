# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, Optional

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmTraitGroupReference

from .cdm_object_ref_persistence import CdmObjectRefPersistence
from .trait_group_persistence import TraitGroupPersistence
from .types import TraitGroupReference


class TraitGroupReferencePersistence(CdmObjectRefPersistence):
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data: TraitGroupReference) -> Optional[CdmTraitGroupReference]:
        # Note: Trait group reference by definition cannot be specified as a simple named reference
        
        if not data or not data.traitGroupReference:
            return None

        trait_group = None
        optional = data.optional  # type: bool

        if isinstance(data.traitGroupReference, str):
            trait_group = data.traitGroupReference
        else:
            trait_group = TraitGroupPersistence.from_data(ctx, data.traitGroupReference)

        trait_group_reference = ctx.corpus.make_ref(CdmObjectType.TRAIT_GROUP_REF, trait_group, False)

        if optional is not None:
            trait_group_reference.optional = optional

        return trait_group_reference
