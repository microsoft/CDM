# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmTraitReference

from .cdm_object_ref_persistence import CdmObjectRefPersistence
from .trait_persistence import TraitPersistence
from .types import TraitReference


class TraitReferencePersistence(CdmObjectRefPersistence):
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data: Union[str, TraitReference]) -> CdmTraitReference:
        if not data:
            return None

        from .argument_persistence import ArgumentPersistence

        simple_reference = True
        trait = None
        args = None

        if isinstance(data, str):
            trait = data
        else:
            simple_reference = False
            args = data.get('arguments')

            if isinstance(data.traitReference, str):
                trait = data.traitReference
            else:
                trait = TraitPersistence.from_data(ctx, data.traitReference)

        trait_reference = ctx.corpus.make_ref(CdmObjectType.TRAIT_REF, trait, simple_reference)

        if args:
            trait_reference.arguments.extend([ArgumentPersistence.from_data(ctx, arg) for arg in args])

        return trait_reference
