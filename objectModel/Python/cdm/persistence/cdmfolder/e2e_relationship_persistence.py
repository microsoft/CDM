
from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmE2ERelationship
from cdm.utilities import CopyOptions, ResolveOptions

from .types import E2ERelationship


class E2ERelationshipPersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data: E2ERelationship) -> CdmE2ERelationship:
        relationship = ctx.corpus.make_object(CdmObjectType.E2E_RELATIONSHIP_DEF)
        relationship.from_entity = data.fromEntity
        relationship.from_entity_attribute = data.fromEntityAttribute
        relationship.to_entity = data.toEntity
        relationship.to_entity_attribute = data.toEntityAttribute

        return relationship

    @staticmethod
    def to_data(instance: 'CdmE2ERelationship', res_opt: ResolveOptions, options: CopyOptions) -> E2ERelationship:
        relationship = E2ERelationship()

        relationship.fromEntity = instance.from_entity
        relationship.fromEntityAttribute = instance.from_entity_attribute
        relationship.toEntity = instance.to_entity
        relationship.toEntityAttribute = instance.to_entity_attribute

        return relationship
