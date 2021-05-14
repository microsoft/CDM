# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmPurposeDefinition
from cdm.utilities import ResolveOptions, CopyOptions, copy_data_utils

from . import utils
from .types import Purpose


class PurposePersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data: Purpose) -> CdmPurposeDefinition:
        from .purpose_reference_persistence import PurposeReferencePersistence

        purpose = ctx.corpus.make_object(CdmObjectType.PURPOSE_DEF, data.purposeName)
        purpose.extends_purpose = PurposeReferencePersistence.from_data(ctx, data.get('extendsPurpose'))

        if data.get('explanation'):
            purpose.explanation = data.explanation

        utils.add_list_to_cdm_collection(purpose.exhibits_traits,
                                         utils.create_trait_reference_array(ctx, data.get('exhibitsTraits')))

        return purpose

    @staticmethod
    def to_data(instance: CdmPurposeDefinition, res_opt: ResolveOptions, options: CopyOptions) -> Purpose:
        from .purpose_reference_persistence import PurposeReferencePersistence

        result = Purpose()
        result.explanation = instance.explanation
        result.purposeName = instance.purpose_name
        result.extendsPurpose = PurposeReferencePersistence.to_data(instance.extends_purpose, res_opt, options) if instance.extends_purpose else None
        result.exhibitsTraits = copy_data_utils._array_copy_data(res_opt, instance.exhibits_traits, options)
        return result
