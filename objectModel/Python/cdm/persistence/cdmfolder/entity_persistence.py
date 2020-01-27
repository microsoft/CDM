from cdm.objectmodel import CdmCorpusContext, CdmEntityDefinition
from cdm.enums import CdmObjectType
from cdm.utilities import ResolveOptions, CopyOptions

from . import utils
from .attribute_context_persistence import AttributeContextPersistence
from .attribute_resolution_guidance_persistence import AttributeResolutionGuidancePersistence
from .entity_reference_persistence import EntityReferencePersistence
from .types import Entity


class EntityPersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data: Entity) -> CdmEntityDefinition:
        if not data.get('entityName'):
            return None

        entity = ctx.corpus.make_object(CdmObjectType.ENTITY_DEF, data.entityName)
        entity.extends_entity = EntityReferencePersistence.from_data(ctx, data.get('extendsEntity'))
        entity.extends_entity_resolution_guidance = AttributeResolutionGuidancePersistence.from_data(ctx, data.get('extendsEntityResolutionGuidance'))

        if data.get('explanation'):
            entity.explanation = data.explanation

        exhibits_traits = utils.create_trait_reference_array(ctx, data.get('exhibitsTraits'))
        entity.exhibits_traits.extend(exhibits_traits)

        if data.get('sourceName'):
            entity.source_name = data.sourceName

        if data.get('displayName'):
            entity.display_name = data.displayName

        if data.get('description'):
            entity.description = data.description

        if data.get('version'):
            entity.version = data.version

        if data.get('cdmSchemas'):
            entity.cdm_schemas = data.cdmSchemas

        if data.get('attributeContext'):
            entity.attribute_context = AttributeContextPersistence.from_data(ctx, data.attributeContext)

        attributes = utils.create_attribute_array(ctx, data.get('hasAttributes'))
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
        data.exhibitsTraits = utils.array_copy_data(res_opt, exhibits_traits, options)
        data.sourceName = instance.fetch_property('sourceName')
        data.displayName = instance.fetch_property('displayName')
        data.description = instance.fetch_property('description')
        data.version = instance.fetch_property('version')
        data.cdmSchemas = instance.fetch_property('cdmSchemas')
        data.attributeContext = AttributeContextPersistence.to_data(instance.attribute_context, res_opt, options) if instance.attribute_context else None

        # After the properties so they show up first in doc
        data.hasAttributes = utils.array_copy_data(res_opt, instance.attributes, options)

        return data
