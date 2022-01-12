# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmTraitGroupDefinition
from cdm.utilities import ResolveOptions, CopyOptions, copy_data_utils

from .types import TraitGroup
from . import utils


class TraitGroupPersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data: TraitGroup) -> CdmTraitGroupDefinition:
        trait_group = ctx.corpus.make_object(CdmObjectType.TRAIT_GROUP_DEF, data.traitGroupName)

        if data.get('explanation'):
            trait_group.explanation = data.explanation

        utils.add_list_to_cdm_collection(trait_group.exhibits_traits,
                                         utils.create_trait_reference_array(ctx, data.get('exhibitsTraits')))

        return trait_group

    @staticmethod
    def to_data(instance: CdmTraitGroupDefinition, res_opt: ResolveOptions, options: CopyOptions) -> TraitGroup:
        result = TraitGroup()
        result.traitName = instance.trait_group_name

        if instance.explanation:
            result.explanation = instance.explanation

        result.exhibitsTraits = copy_data_utils._array_copy_data(res_opt, instance.exhibits_traits, options)

        return result
