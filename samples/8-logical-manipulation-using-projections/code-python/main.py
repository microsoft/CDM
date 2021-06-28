# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import asyncio, sys, os
from cdm.enums import CdmStatusLevel
from typing import Optional, TYPE_CHECKING

sys.path.append('../../../objectModel/Python')

from cdm.objectmodel import CdmCorpusDefinition, CdmDataTypeReference, CdmEntityAttributeDefinition, CdmEntityDefinition, CdmEntityReference, \
    CdmOperationAddAttributeGroup, CdmOperationAddCountAttribute, CdmOperationArrayExpansion, CdmOperationRenameAttributes, CdmOperationReplaceAsForeignKey, \
    CdmProjection, CdmTypeAttributeDefinition
from cdm.storage import LocalAdapter
from cdm.utilities import AttributeResolutionDirectiveSet, ResolveOptions

def event_callback(status_level: 'CdmStatusLevel', message: str):
    # Print log messages from SDK.
    print(message)

async def logical_manipulation_using_projections():
    '''This sample demonstrates how to model a set of common scenarios using projections. 
    The projections feature provides a way to customize the definition of a logical entity by influencing how the entity is resolved by the object model.
    Here we will model three common use cases for using projections that are associated with the directives 'referenceOnly', 'structured' and 'normalized'.
    A single logical definition can be resolved into multiple physical layouts. The directives are used to instruct the ObjectModel about how it should to
    resolve the logical definition provided. To achieve this, we define projections that run conditionally, depending on the directives provided when
    calling create_resolved_entity_async.
    To get an overview of the projections feature as well as all of the supported operations refer to the link below.
    https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#projection-overview
    '''

    # Make a corpus, the corpus is the collection of all documents and folders created or discovered while navigating objects and paths
    corpus = CdmCorpusDefinition()

    # set callback to receive error and warning logs.
    corpus.set_event_callback(event_callback, CdmStatusLevel.WARNING)

    print('Configure storage adapters')

    # Configure storage adapters to point at the target local manifest location and at the fake public standards
    path_from_exe_to_example_root = '../../'

    corpus.storage.mount('local', LocalAdapter(path_from_exe_to_example_root + '8-logical-manipulation-using-projections/sample-data'))
    corpus.storage.default_namespace = 'local' # local is our default. so any paths that start out navigating without a device tag will assume local

    # Fake cdm, normaly use the CDM Standards adapter
    # Mount it as the 'cdm' device, not the default so must use 'cdm:/folder' to get there
    corpus.storage.mount('cdm', LocalAdapter(path_from_exe_to_example_root + 'example-public-standards'))

    print('Create logical entity definition.')

    logical_folder = await corpus.fetch_object_async('local:/')  # type: CdmFolderDefinition
    
    logical_doc = logical_folder.documents.append('Person.cdm.json')
    logical_doc.imports.append('Address.cdm.json')

    entity = logical_doc.definitions.append('Person')  # type: CdmEntityDefinition

    # Add 'name' data typed attribute.
    name_attr = entity.attributes.append('name')  # type: CdmTypeAttributeDefinition
    name_attr.data_type = CdmDataTypeReference(corpus.ctx, 'string', True)

    # Add 'age' data typed attribute.
    age_attr = entity.attributes.append('age')  # type: CdmTypeAttributeDefinition
    age_attr.data_type = CdmDataTypeReference(corpus.ctx, 'string', True)

    # Add 'address' entity typed attribute.
    entity_attr = CdmEntityAttributeDefinition(corpus.ctx, 'address')
    entity_attr.entity = CdmEntityReference(corpus.ctx, 'Address', True)
    apply_array_expansion(entity_attr, 1, 3, '{m}{A}{o}', 'countAttribute')
    apply_default_behavior(entity_attr, 'addressFK', 'address')

    entity.attributes.append(entity_attr)

    # Add 'email' data typed attribute.
    email_attr = entity.attributes.append('email')  # type: CdmTypeAttributeDefinition
    email_attr.data_type = CdmDataTypeReference(corpus.ctx, 'string', True)

    # Save the logical definition of Person.
    await entity.in_document.save_as_async('Person.cdm.json')

    print('Get \'resolved\' folder where the resolved entities will be saved.')

    resolved_folder = await corpus.fetch_object_async('local:/resolved/')  # type: CdmFolderDefinition

    res_opt = ResolveOptions(entity)

    # To get more information about directives and their meaning refer to 
    # https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#directives-guidance-and-the-resulting-resolved-shapes

    # We will start by resolving this entity with the 'normalized' direcitve. 
    # This directive will be used on this and the next two examples so we can analize the resolved entity
    # without the array expansion.
    print('Resolving logical entity with normalized directive.')
    res_opt.directives = AttributeResolutionDirectiveSet({ 'normalized' })
    res_normalized_entity = await entity.create_resolved_entity_async(f'normalized_{entity.entity_name}', res_opt, resolved_folder)
    await res_normalized_entity.in_document.save_as_async(f'{res_normalized_entity.entity_name}.cdm.json')

    # Another common scenario is to resolve an entity using the 'referenceOnly' directive. 
    # This directives is used to replace the relationships with a foreign key.
    print('Resolving logical entity with referenceOnly directive.')
    res_opt.directives = AttributeResolutionDirectiveSet({ 'normalized', 'referenceOnly' })
    res_reference_only_entity = await entity.create_resolved_entity_async(f'referenceOnly_{entity.entity_name}', res_opt, resolved_folder)
    await res_reference_only_entity.in_document.save_as_async(f'{res_reference_only_entity.entity_name}.cdm.json')

    # When dealing with structured data, like Json or parquet, it sometimes necessary to represent the idea that 
    # a property can hold a complex object. The shape of the complex object is defined by the source entity pointed by the 
    # entity attribute and we use the 'structured' directive to resolve the entity attribute as an attribute group.
    print('Resolving logical entity with structured directive.')
    res_opt.directives = AttributeResolutionDirectiveSet({ 'normalized', 'structured' })
    res_structured_entity = await entity.create_resolved_entity_async(f'structured_{entity.entity_name}', res_opt, resolved_folder)
    await res_structured_entity.in_document.save_as_async(f'{res_structured_entity.entity_name}.cdm.json')

    # Now let us remove the 'normalized' directive so the array expansion operation can run.
    print('Resolving logical entity without directives (array expansion).')
    res_opt.directives = AttributeResolutionDirectiveSet({ })
    res_array_entity = await entity.create_resolved_entity_async(f'array_expansion_{entity.entity_name}', res_opt, resolved_folder)
    await res_array_entity.in_document.save_as_async(f'{res_array_entity.entity_name}.cdm.json')

def apply_default_behavior(entity_attr: 'CdmEntityAttributeDefinition', fk_attr_name: Optional[str], attr_group_name: Optional[str]):
    '''Applies the replaceAsForeignKey and addAttributeGroup operations to the entity attribute provided.'''
    ctx = entity_attr.ctx
    projection = CdmProjection(ctx)
    # Link for the Source property documentation.
    # https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#source
    projection.source = entity_attr.entity
    # Link for the RunSequentially property documentation.
    # https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#run-sequentially
    projection.run_sequentially = True

    entity_attr.entity = CdmEntityReference(ctx, projection, False)

    if fk_attr_name:
        foreign_key_attr = CdmTypeAttributeDefinition(ctx, fk_attr_name)
        foreign_key_attr.data_type = CdmDataTypeReference(ctx, 'entityId', True)

        # Link for the ReplaceAsForeignKey operation documentation.
        # https://docs.microsoft.com/en-us/common-data-model/sdk/projections/replaceasforeignkey
        replace_as_fk_operation = CdmOperationReplaceAsForeignKey(ctx)
        replace_as_fk_operation.condition = 'referenceOnly'
        replace_as_fk_operation.reference = 'addressLine'
        replace_as_fk_operation.replace_with = foreign_key_attr
        
        projection.operations.append(replace_as_fk_operation)

    if attr_group_name:
        # Link for the AddAttributeGroup operation documentation.
        # https://docs.microsoft.com/en-us/common-data-model/sdk/projections/addattributegroup
        add_attr_group_operation = CdmOperationAddAttributeGroup(ctx)
        add_attr_group_operation.condition = 'structured'
        add_attr_group_operation.attribute_group_name = attr_group_name

        projection.operations.append(add_attr_group_operation)

def apply_array_expansion(entity_attr: 'CdmEntityAttributeDefinition', start_ordinal: int, end_ordinal: int, rename_format: str, count_att_name: Optional[str]):
    '''Applies the arrayExpansion operation to the entity attribute provided.
    It also takes care of applying a renameattributes operation and optionally applying a addCountAttribute operation.'''
    ctx = entity_attr.ctx

    projection = CdmProjection(ctx)
    projection.source = entity_attr.entity
    projection.run_sequentially = True
    # Link for the Condition property documentation.
    # https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#condition
    projection.condition = '!normalized'

    entity_attr.entity = CdmEntityReference(ctx, projection, False)

    # Link for the ArrayExpansion operation documentation.
    # https://docs.microsoft.com/en-us/common-data-model/sdk/projections/arrayexpansion
    arr_expansion_operation = CdmOperationArrayExpansion(ctx)
    arr_expansion_operation.start_ordinal = start_ordinal
    arr_expansion_operation.end_ordinal = end_ordinal
    projection.operations.append(arr_expansion_operation)

    # Link for the Renameattributes operation documentation.
    # https://docs.microsoft.com/en-us/common-data-model/sdk/projections/renameattributes
    # Doing an ArrayExpansion without a RenameAttributes afterwards will result in the expanded attributes being merged in the final resolved entity.
    # This is because ArrayExpansion does not rename the attributes it expands by default. The expanded attributes end up with the same name and gets merged.
    # Example: We expand A to A[1], A[2], A[3], but A[1], A[2], A[3] are still named "A".
    rename_attrs_operation = CdmOperationRenameAttributes(ctx)
    rename_attrs_operation.rename_format = rename_format
    projection.operations.append(rename_attrs_operation)

    if count_att_name:
        count_attribute = CdmTypeAttributeDefinition(ctx, count_att_name)
        count_attribute.data_type = CdmDataTypeReference(ctx, 'integer', True)

        # Link for the AddCountAttribute operation documentation.
        # https://docs.microsoft.com/en-us/common-data-model/sdk/projections/addcountattribute
        # It is recommended, but not mandated, to be used with the ArrayExpansion operation to provide an ArrayExpansion a count attribute that
        # represents the total number of expanded elements. AddCountAttribute can also be used by itself.
        add_count_attr_operation = CdmOperationAddCountAttribute(ctx)
        add_count_attr_operation.count_attribute = count_attribute
        projection.operations.append(add_count_attr_operation)

loop = asyncio.get_event_loop()
task = loop.create_task(logical_manipulation_using_projections())
manifest = loop.run_until_complete(task)