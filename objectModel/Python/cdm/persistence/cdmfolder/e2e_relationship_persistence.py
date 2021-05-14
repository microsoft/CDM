# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmE2ERelationship
from cdm.utilities import CopyOptions, ResolveOptions, copy_data_utils
from cdm.utilities.string_utils import StringUtils

from . import utils
from .types import E2ERelationship


class E2ERelationshipPersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data: E2ERelationship) -> CdmE2ERelationship:
        relationship = ctx.corpus.make_object(CdmObjectType.E2E_RELATIONSHIP_DEF)
        if not StringUtils.is_null_or_white_space(data.name):
            relationship.relationship_name = data.name
        relationship.from_entity = data.fromEntity
        relationship.from_entity_attribute = data.fromEntityAttribute
        relationship.to_entity = data.toEntity
        relationship.to_entity_attribute = data.toEntityAttribute
        utils.add_list_to_cdm_collection(relationship.exhibits_traits,
                                         utils.create_trait_reference_array(ctx, data.exhibitsTraits))

        return relationship

    @staticmethod
    def to_data(instance: 'CdmE2ERelationship', res_opt: ResolveOptions, options: CopyOptions) -> E2ERelationship:
        relationship = E2ERelationship()
        if not StringUtils.is_null_or_white_space(instance.relationship_name):
            relationship.name = instance.relationship_name
        relationship.fromEntity = instance.from_entity
        relationship.fromEntityAttribute = instance.from_entity_attribute
        relationship.toEntity = instance.to_entity
        relationship.toEntityAttribute = instance.to_entity_attribute
        relationship.exhibitsTraits = copy_data_utils._array_copy_data(res_opt, instance.exhibits_traits, options)

        return relationship
