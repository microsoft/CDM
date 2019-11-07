from cdm.objectmodel import CdmCorpusContext, CdmEntityAttributeDefinition
from cdm.enums import CdmObjectType
from cdm.utilities import ResolveOptions, CopyOptions

from . import utils
from .attribute_resolution_guidance_persistence import AttributeResolutionGuidancePersistence
from .entity_reference_persistence import EntityReferencePersistence
from .purpose_reference_persistence import PurposeReferencePersistence
from .types import EntityAttribute


class EntityAttributePersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data: EntityAttribute) -> CdmEntityAttributeDefinition:
        entity_attribute = ctx.corpus.make_object(CdmObjectType.ENTITY_ATTRIBUTE_DEF, data.name)
        entity_attribute.explanation = data.get('explanation')

        entity_attribute.entity = EntityReferencePersistence.from_data(ctx, data.get('entity'))
        entity_attribute.purpose = PurposeReferencePersistence.from_data(ctx, data.get('purpose'))

        applied_traits = utils.create_trait_reference_array(ctx, data.get('appliedTraits'))
        entity_attribute.applied_traits.extend(applied_traits)

        entity_attribute.resolution_guidance = AttributeResolutionGuidancePersistence.from_data(ctx, data.get('resolutionGuidance'))

        return entity_attribute

    @staticmethod
    def to_data(instance: CdmEntityAttributeDefinition, res_opt: ResolveOptions, options: CopyOptions) -> EntityAttribute:
        entity = EntityReferencePersistence.to_data(instance.entity, res_opt, options) if instance.entity else None

        entity_attribute = EntityAttribute()
        entity_attribute.explanation = instance.explanation
        entity_attribute.name = instance.name
        entity_attribute.purpose = PurposeReferencePersistence.to_data(instance.purpose, res_opt, options) if instance.purpose else None
        entity_attribute.entity = entity
        entity_attribute.appliedTraits = utils.array_copy_data(res_opt, instance.applied_traits, options)
        entity_attribute.resolutionGuidance = AttributeResolutionGuidancePersistence.to_data(
            instance.resolution_guidance, res_opt, options) if instance.resolution_guidance else None

        return entity_attribute
