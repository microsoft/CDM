# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.objectmodel import CdmCorpusContext, CdmEntityAttributeDefinition, CdmTraitGroupReference
from cdm.enums import CdmObjectType
from cdm.utilities import ResolveOptions, CopyOptions, copy_data_utils, logger
from cdm.enums import CdmLogCode

from . import utils
from .attribute_resolution_guidance_persistence import AttributeResolutionGuidancePersistence
from .entity_reference_persistence import EntityReferencePersistence
from .purpose_reference_persistence import PurposeReferencePersistence
from .types import EntityAttribute

_TAG = 'EntityAttributePersistence'


class EntityAttributePersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data: EntityAttribute) -> CdmEntityAttributeDefinition:
        entity_attribute = ctx.corpus.make_object(CdmObjectType.ENTITY_ATTRIBUTE_DEF, data.name)

        entity_attribute.description = data.description
        entity_attribute.display_name = data.displayName
        entity_attribute.explanation = data.explanation

        entity_attribute.cardinality = utils.cardinality_settings_from_data(data.get('cardinality'), entity_attribute)

        entity_attribute.is_polymorphic_source = data.get('isPolymorphicSource')

        is_projection = data.get('entity') and not isinstance(data.get('entity'), str) and data.get('entity').get('source')

        if is_projection:
            logger.warning(ctx, _TAG, EntityAttributePersistence.from_data, None, CdmLogCode.WarnPersistSymsProjNotExist)
        else:
            entity_attribute.entity = EntityReferencePersistence.from_data(ctx, data.get('entity'))

        entity_attribute.purpose = PurposeReferencePersistence.from_data(ctx, data.get('purpose'))
        utils.add_list_to_cdm_collection(entity_attribute.applied_traits,
                                         utils.create_trait_reference_array(ctx, data.get('appliedTraits')))

        # Ignore resolution guidance if the entity is a projection
        if data.get('resolutionGuidance') and is_projection:
            logger.error(ctx, _TAG, 'from_data', None, CdmLogCode.ERR_PERSIST_ENTITY_ATTR_UNSUPPORTED, entity_attribute.name)
        else:
            entity_attribute.resolution_guidance = AttributeResolutionGuidancePersistence.from_data(ctx, data.get('resolutionGuidance'))

        return entity_attribute

    @staticmethod
    def to_data(instance: CdmEntityAttributeDefinition, res_opt: ResolveOptions, options: CopyOptions) -> EntityAttribute:
        entity = EntityReferencePersistence.to_data(instance.entity, res_opt, options) if instance.entity else None

        applied_traits = [trait for trait in instance.applied_traits
                          if isinstance(trait, CdmTraitGroupReference) or not trait.is_from_property]

        entity_attribute = EntityAttribute()
        entity_attribute.name = instance.name
        entity_attribute.description = instance.description
        entity_attribute.displayName = instance.display_name
        entity_attribute.explanation = instance.explanation
        entity_attribute.isPolymorphicSource = instance.is_polymorphic_source
        entity_attribute.purpose = PurposeReferencePersistence.to_data(instance.purpose, res_opt, options) if instance.purpose else None
        entity_attribute.entity = entity
        entity_attribute.appliedTraits = copy_data_utils._array_copy_data(res_opt, applied_traits, options)
        entity_attribute.resolutionGuidance = AttributeResolutionGuidancePersistence.to_data(
            instance.resolution_guidance, res_opt, options) if instance.resolution_guidance else None
        entity_attribute.cardinality = utils.cardinality_settings_to_data(instance.cardinality)

        return entity_attribute
