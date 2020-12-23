# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional

from cdm.enums import CdmObjectType, CdmAttributeContextType
from cdm.objectmodel import CdmCorpusContext, CdmAttributeContext
from cdm.persistence import PersistenceLayer
from cdm.utilities import CopyOptions, ResolveOptions, copy_data_utils

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
    'generatedSet': CdmAttributeContextType.GENERATED_SET,
    'projection': CdmAttributeContextType.PROJECTION,
    'source': CdmAttributeContextType.SOURCE,
    'operations': CdmAttributeContextType.OPERATIONS,
    'operationAddCountAttribute': CdmAttributeContextType.OPERATION_ADD_COUNT_ATTRIBUTE,
    'operationAddSupportingAttribute': CdmAttributeContextType.OPERATION_ADD_SUPPORTING_ATTRIBUTE,
    'operationAddTypeAttribute': CdmAttributeContextType.OPERATION_ADD_TYPE_ATTRIBUTE,
    'operationExcludeAttributes': CdmAttributeContextType.OPERATION_EXCLUDE_ATTRIBUTES,
    'operationArrayExpansion': CdmAttributeContextType.OPERATION_ARRAY_EXPANSION,
    'operationCombineAttributes': CdmAttributeContextType.OPERATION_COMBINE_ATTRIBUTES,
    'operationRenameAttributes': CdmAttributeContextType.OPERATION_RENAME_ATTRIBUTES,
    'operationReplaceAsForeignKey': CdmAttributeContextType.OPERATION_REPLACE_AS_FOREIGN_KEY,
    'operationIncludeAttributes': CdmAttributeContextType.OPERATION_INCLUDE_ATTRIBUTES,
    'operationAddAttributeGroup': CdmAttributeContextType.OPERATION_ADD_ATTRIBUTE_GROUP,
    'unknown': CdmAttributeContextType.UNKNOWN
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
    CdmAttributeContextType.GENERATED_SET: 'generatedSet',
    CdmAttributeContextType.PROJECTION: 'projection',
    CdmAttributeContextType.SOURCE: 'source',
    CdmAttributeContextType.OPERATIONS: 'operations',
    CdmAttributeContextType.OPERATION_ADD_COUNT_ATTRIBUTE: 'operationAddCountAttribute',
    CdmAttributeContextType.OPERATION_ADD_SUPPORTING_ATTRIBUTE: 'operationAddSupportingAttribute',
    CdmAttributeContextType.OPERATION_ADD_TYPE_ATTRIBUTE: 'operationAddTypeAttribute',
    CdmAttributeContextType.OPERATION_EXCLUDE_ATTRIBUTES: 'operationExcludeAttributes',
    CdmAttributeContextType.OPERATION_ARRAY_EXPANSION: 'operationArrayExpansion',
    CdmAttributeContextType.OPERATION_COMBINE_ATTRIBUTES: 'operationCombineAttributes',
    CdmAttributeContextType.OPERATION_RENAME_ATTRIBUTES: 'operationRenameAttributes',
    CdmAttributeContextType.OPERATION_REPLACE_AS_FOREIGN_KEY: 'operationReplaceAsForeignKey',
    CdmAttributeContextType.OPERATION_INCLUDE_ATTRIBUTES: 'operationIncludeAttributes',
    CdmAttributeContextType.OPERATION_ADD_ATTRIBUTE_GROUP: 'operationAddAttributeGroup',
    CdmAttributeContextType.UNKNOWN: 'unknown'
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

        exhibits_traits = [trait for trait in instance.exhibits_traits if not trait.is_from_property]

        result.explanation = instance.explanation
        result.name = instance.name
        result.type = map_enum_to_type_name[instance.type]
        result.parent = AttributeContextReferencePersistence.to_data(instance.parent, res_opt, options) if instance.parent is not None else None
        result.definition = PersistenceLayer.to_data(instance.definition, res_opt, options, PersistenceLayer.CDM_FOLDER) if instance.definition is not None else None
        # I know the trait collection names look wrong. but I wanted to use the def baseclass
        result.appliedTraits = copy_data_utils._array_copy_data(res_opt, exhibits_traits, options)
        result.contents = copy_data_utils._array_copy_data(res_opt, instance.contents, options)

        return result
