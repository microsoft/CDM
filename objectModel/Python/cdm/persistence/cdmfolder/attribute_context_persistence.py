from typing import Optional

from cdm.enums import CdmObjectType, CdmAttributeContextType
from cdm.objectmodel import CdmCorpusContext, CdmAttributeContext
from cdm.persistence import persistence_layer
from cdm.utilities import CopyOptions, ResolveOptions

from . import utils
from .attribute_context_reference_persistence import AttributeContextReferencePersistence
from .attribute_group_reference_persistence import AttributeGroupReferencePersistence
from .attribute_reference_persistence import AttributeReferencePersistence
from .entity_reference_persistence import EntityReferencePersistence
from .types import AttributeContext


map_type_name_to_enum = {
    'entity': CdmAttributeContextType.ENTITY,
    'entityReferenceExtends': CdmAttributeContextType.ENTITY_REFERENCE_EXTENDS,
    'attributeGroup': CdmAttributeContextType.ATTRIBUTE_GROUP,
    'attributeDefinition': CdmAttributeContextType.ATTRIBUTE_DEFINITION,
    'addedAttributeSupporting': CdmAttributeContextType.ADDED_ATTRIBUTE_SUPPORTING,
    'addedAttributeIdentity': CdmAttributeContextType.ADDED_ATTRIBUTE_IDENTITY,
    'addedAttributeExpansionTotal': CdmAttributeContextType.ADDED_ATTRIBUTE_EXPANSION_TOTAL,
    'addedAttributeSelectedType': CdmAttributeContextType.ADDED_ATTRIBUTE_SELECTED_TYPE,
    'generatedRound': CdmAttributeContextType.GENERATED_ROUND,
    'generatedSet': CdmAttributeContextType.GENERATED_SET
}

map_enum_to_type_name = {
    CdmAttributeContextType.ENTITY: 'entity',
    CdmAttributeContextType.ENTITY_REFERENCE_EXTENDS: 'entityReferenceExtends',
    CdmAttributeContextType.ATTRIBUTE_GROUP: 'attributeGroup',
    CdmAttributeContextType.ATTRIBUTE_DEFINITION: 'attributeDefinition',
    CdmAttributeContextType.ADDED_ATTRIBUTE_SUPPORTING: 'addedAttributeSupporting',
    CdmAttributeContextType.ADDED_ATTRIBUTE_IDENTITY: 'addedAttributeIdentity',
    CdmAttributeContextType.ADDED_ATTRIBUTE_EXPANSION_TOTAL: 'addedAttributeExpansionTotal',
    CdmAttributeContextType.ADDED_ATTRIBUTE_SELECTED_TYPE: 'addedAttributeSelectedType',
    CdmAttributeContextType.GENERATED_ROUND: 'generatedRound',
    CdmAttributeContextType.GENERATED_SET: 'generatedSet'
}


class AttributeContextPersistence:
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data: AttributeContext) -> Optional[CdmAttributeContext]:
        if data is None:
            return None

        attribute_context = ctx.corpus.make_object(CdmObjectType.ATTRIBUTE_CONTEXT_DEF, data.name)
        attribute_context.type = map_type_name_to_enum[data.type]

        if data.get('parent'):
            attribute_context.parent = AttributeContextReferencePersistence.from_data(ctx, data.get('parent'))

        if data.get('explanation'):
            attribute_context.explanation = data.get('explanation')

        if data.get('definition'):
            if attribute_context.type == CdmAttributeContextType.ENTITY or attribute_context.type == CdmAttributeContextType.ENTITY_REFERENCE_EXTENDS:
                attribute_context.definition = EntityReferencePersistence.from_data(ctx, data.definition)
            elif attribute_context.type == CdmAttributeContextType.ATTRIBUTE_GROUP:
                attribute_context.definition = AttributeGroupReferencePersistence.from_data(ctx, data.definition)
            elif attribute_context.type == CdmAttributeContextType.ADDED_ATTRIBUTE_SUPPORTING \
                    or attribute_context.type == CdmAttributeContextType.ADDED_ATTRIBUTE_IDENTITY \
                    or attribute_context.type == CdmAttributeContextType.ADDED_ATTRIBUTE_EXPANSION_TOTAL \
                    or attribute_context.type == CdmAttributeContextType.ADDED_ATTRIBUTE_SELECTED_TYPE \
                    or attribute_context.type == CdmAttributeContextType.ATTRIBUTE_DEFINITION:
                attribute_context.definition = AttributeReferencePersistence.from_data(ctx, data.definition)

        # I know the trait collection names look wrong. but I wanted to use the def baseclass
        applied_traits = utils.create_trait_reference_array(ctx, data.get('appliedTraits'))
        attribute_context.exhibits_traits.extend(applied_traits)

        if data.get('contents'):
            if attribute_context.contents is None:
                attribute_context.contents = []

            for elem in data.contents:
                if isinstance(elem, str):
                    attribute_context.contents.append(AttributeReferencePersistence.from_data(ctx, elem))
                else:
                    attribute_context.contents.append(AttributeContextPersistence.from_data(ctx, elem))

        return attribute_context

    @staticmethod
    def to_data(instance: CdmAttributeContext, res_opt: ResolveOptions, options: CopyOptions) -> AttributeContext:
        result = AttributeContext()

        result.explanation = instance.explanation
        result.name = instance.name
        result.type = map_enum_to_type_name[instance.type]
        result.parent = AttributeContextReferencePersistence.to_data(instance.parent, res_opt, options) if instance.parent is not None else None
        result.definition = persistence_layer.to_data(instance.definition, res_opt, 'CdmFolder', options) if instance.definition is not None else None
        # I know the trait collection names look wrong. but I wanted to use the def baseclass
        result.appliedTraits = utils.array_copy_data(res_opt, instance.exhibits_traits, options)
        result.contents = utils.array_copy_data(res_opt, instance.contents, options)

        return result
