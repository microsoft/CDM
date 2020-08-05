# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.objectmodel import CdmCorpusContext, CdmEntityDefinition
from cdm.enums import CdmObjectType
from cdm.utilities import ResolveOptions, CopyOptions, copy_data_utils

from . import utils
from .attribute_context_persistence import AttributeContextPersistence
from .attribute_resolution_guidance_persistence import AttributeResolutionGuidancePersistence
from .entity_reference_persistence import EntityReferencePersistence
from .types import Entity


class EntityPersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data: Entity) -> CdmEntityDefinition:
        if not data:
            return None

        if not data.get('entityName'):
            return None

        entity = ctx.corpus.make_object(CdmObjectType.ENTITY_DEF, data.entityName)

        entity.extends_entity = EntityReferencePersistence.from_data(ctx, data.get('extendsEntity'))
        entity.extends_entity_resolution_guidance = AttributeResolutionGuidancePersistence.from_data(ctx, data.get('extendsEntityResolutionGuidance'))

        entity.explanation = utils._property_from_data_to_string(data.explanation)

        exhibits_traits = utils.create_trait_reference_array(ctx, data.get('exhibitsTraits'))
        entity.exhibits_traits.extend(exhibits_traits)
        
        entity.source_name = utils._property_from_data_to_string(data.sourceName)
        entity.display_name = utils._property_from_data_to_string(data.displayName)
        entity.description = utils._property_from_data_to_string(data.description)
        entity.version = utils._property_from_data_to_string(data.version)
        entity.cdm_schemas = data.cdmSchemas

        entity.attribute_context = AttributeContextPersistence.from_data(ctx, data.attributeContext)

        attributes = utils.create_attribute_array(ctx, data.get('hasAttributes'), entity.entity_name)
        entity.attributes.extend(attributes)

        return entity

    @staticmethod
    def to_data(instance: CdmEntityDefinition, res_opt: ResolveOptions, options: CopyOptions) -> Entity:
        exhibits_traits = [trait for trait in instance.exhibits_traits if not trait.is_from_property]

        data = Entity()
        data.explanation = instance.explanation
        data.entityName = instance.entity_name
        data.extendsEntity = EntityReferencePersistence.to_data(instance.extends_entity, res_opt, options) if instance.extends_entity else None
        data.ExtendsEntityResolutionGuidance = AttributeResolutionGuidancePersistence.to_data(
            instance.extends_entity_resolution_guidance, res_opt, options) if instance.extends_entity_resolution_guidance else None
        data.exhibitsTraits = copy_data_utils._array_copy_data(res_opt, exhibits_traits, options)
        data.sourceName = instance._fetch_property('sourceName')
        data.displayName = instance._fetch_property('displayName')
        data.description = instance._fetch_property('description')
        data.version = instance._fetch_property('version')
        data.cdmSchemas = instance._fetch_property('cdmSchemas')
        data.attributeContext = AttributeContextPersistence.to_data(instance.attribute_context, res_opt, options) if instance.attribute_context else None

        # After the properties so they show up first in doc
        data.hasAttributes = copy_data_utils._array_copy_data(res_opt, instance.attributes, options)

        return data
