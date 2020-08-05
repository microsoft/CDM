# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from cdm.enums import CdmObjectType

from .cdm_attribute_context import CdmAttributeContext
from .cdm_attribute_context_ref import CdmAttributeContextReference
from .cdm_attribute_group_def import CdmAttributeGroupDefinition
from .cdm_attribute_group_ref import CdmAttributeGroupReference
from .cdm_attribute_ref import CdmAttributeReference
from .cdm_attribute_resolution_guidance_def import CdmAttributeResolutionGuidanceDefinition
from .cdm_constant_entity_def import CdmConstantEntityDefinition
from .cdm_data_partition_def import CdmDataPartitionDefinition
from .cdm_data_partition_pattern_def import CdmDataPartitionPatternDefinition
from .cdm_data_type_def import CdmDataTypeDefinition
from .cdm_data_type_ref import CdmDataTypeReference
from .cdm_document_def import CdmDocumentDefinition
from .cdm_entity_attribute_def import CdmEntityAttributeDefinition
from .cdm_entity_def import CdmEntityDefinition
from .cdm_entity_ref import CdmEntityReference
from .cdm_e2e_relationship import CdmE2ERelationship
from .cdm_import import CdmImport
from .cdm_folder_def import CdmFolderDefinition
from .cdm_local_entity_declaration_def import CdmLocalEntityDeclarationDefinition
from .cdm_manifest_declaration_def import CdmManifestDeclarationDefinition
from .cdm_manifest_def import CdmManifestDefinition
from .cdm_referenced_entity_declaration_def import CdmReferencedEntityDeclarationDefinition
from .cdm_type_attribute_def import CdmTypeAttributeDefinition
from .cdm_trait_ref import CdmTraitReference
from .cdm_trait_def import CdmTraitDefinition
from .cdm_argument_def import CdmArgumentDefinition
from .cdm_parameter_def import CdmParameterDefinition
from .cdm_purpose_def import CdmPurposeDefinition
from .cdm_purpose_ref import CdmPurposeReference
from cdm.objectmodel.projections.cdm_projection import CdmProjection
from cdm.objectmodel.projections.cdm_operation_add_count_attribute import CdmOperationAddCountAttribute
from cdm.objectmodel.projections.cdm_operation_add_supporting_attribute import CdmOperationAddSupportingAttribute
from cdm.objectmodel.projections.cdm_operation_add_type_attribute import CdmOperationAddTypeAttribute
from cdm.objectmodel.projections.cdm_operation_exclude_attributes import CdmOperationExcludeAttributes
from cdm.objectmodel.projections.cdm_operation_array_expansion import CdmOperationArrayExpansion
from cdm.objectmodel.projections.cdm_operation_combine_attributes import CdmOperationCombineAttributes
from cdm.objectmodel.projections.cdm_operation_rename_attributes import CdmOperationRenameAttributes
from cdm.objectmodel.projections.cdm_operation_replace_as_foreign_key import CdmOperationReplaceAsForeignKey
from cdm.objectmodel.projections.cdm_operation_include_attributes import CdmOperationIncludeAttributes
from cdm.objectmodel.projections.cdm_operation_add_attribute_group import CdmOperationAddAttributeGroup

switcher = {
    CdmObjectType.ARGUMENT_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmArgumentDefinition(ctx, name_or_ref),
    CdmObjectType.ATTRIBUTE_CONTEXT_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmAttributeContext(ctx, name_or_ref),
    CdmObjectType.ATTRIBUTE_CONTEXT_REF: lambda ctx, name_or_ref, simple_name_ref: CdmAttributeContextReference(ctx, name_or_ref),
    CdmObjectType.ATTRIBUTE_GROUP_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmAttributeGroupDefinition(ctx, name_or_ref),
    CdmObjectType.ATTRIBUTE_GROUP_REF: lambda ctx, name_or_ref, simple_name_ref: CdmAttributeGroupReference(ctx, name_or_ref, simple_name_ref),
    CdmObjectType.ATTRIBUTE_REF: lambda ctx, name_or_ref, simple_name_ref: CdmAttributeReference(ctx, name_or_ref, simple_name_ref),
    CdmObjectType.ATTRIBUTE_RESOLUTION_GUIDANCE_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmAttributeResolutionGuidanceDefinition(ctx),
    CdmObjectType.CONSTANT_ENTITY_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmConstantEntityDefinition(ctx, name_or_ref),
    CdmObjectType.DATA_PARTITION_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmDataPartitionDefinition(ctx, name_or_ref),
    CdmObjectType.DATA_PARTITION_PATTERN_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmDataPartitionPatternDefinition(ctx, name_or_ref),
    CdmObjectType.DATA_TYPE_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmDataTypeDefinition(ctx, name_or_ref, None),
    CdmObjectType.DATA_TYPE_REF: lambda ctx, name_or_ref, simple_name_ref: CdmDataTypeReference(ctx, name_or_ref, simple_name_ref),
    CdmObjectType.DOCUMENT_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmDocumentDefinition(ctx, name_or_ref),
    CdmObjectType.ENTITY_ATTRIBUTE_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmEntityAttributeDefinition(ctx, name_or_ref),
    CdmObjectType.ENTITY_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmEntityDefinition(ctx, name_or_ref, None),
    CdmObjectType.ENTITY_REF: lambda ctx, name_or_ref, simple_name_ref: CdmEntityReference(ctx, name_or_ref, simple_name_ref),
    CdmObjectType.E2E_RELATIONSHIP_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmE2ERelationship(ctx, name_or_ref),
    CdmObjectType.IMPORT: lambda ctx, name_or_ref, simple_name_ref: CdmImport(ctx, name_or_ref, None),
    CdmObjectType.FOLDER_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmFolderDefinition(ctx, name_or_ref),
    CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmLocalEntityDeclarationDefinition(ctx, name_or_ref),
    CdmObjectType.MANIFEST_DECLARATION_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmManifestDeclarationDefinition(ctx, name_or_ref),
    CdmObjectType.MANIFEST_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmManifestDefinition(ctx, name_or_ref),
    CdmObjectType.REFERENCED_ENTITY_DECLARATION_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmReferencedEntityDeclarationDefinition(ctx, name_or_ref),
    CdmObjectType.TYPE_ATTRIBUTE_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmTypeAttributeDefinition(ctx, name_or_ref),
    CdmObjectType.TRAIT_REF: lambda ctx, name_or_ref, simple_name_ref: CdmTraitReference(ctx, name_or_ref, simple_name_ref),
    CdmObjectType.TRAIT_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmTraitDefinition(ctx, name_or_ref, None),
    CdmObjectType.ARGUMENT_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmArgumentDefinition(ctx, name_or_ref),
    CdmObjectType.PARAMETER_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmParameterDefinition(ctx, name_or_ref),
    CdmObjectType.PURPOSE_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmPurposeDefinition(ctx, name_or_ref, None),
    CdmObjectType.PURPOSE_REF: lambda ctx, name_or_ref, simple_name_ref: CdmPurposeReference(ctx, name_or_ref, simple_name_ref),
    CdmObjectType.PROJECTION_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmProjection(ctx),
    CdmObjectType.OPERATION_ADD_COUNT_ATTRIBUTE_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmOperationAddCountAttribute(ctx),
    CdmObjectType.OPERATION_ADD_SUPPORTING_ATTRIBUTE_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmOperationAddSupportingAttribute(ctx),
    CdmObjectType.OPERATION_ADD_TYPE_ATTRIBUTE_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmOperationAddTypeAttribute(ctx),
    CdmObjectType.OPERATION_EXCLUDE_ATTRIBUTES_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmOperationExcludeAttributes(ctx),
    CdmObjectType.OPERATION_ARRAY_EXPANSION_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmOperationArrayExpansion(ctx),
    CdmObjectType.OPERATION_COMBINE_ATTRIBUTES_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmOperationCombineAttributes(ctx),
    CdmObjectType.OPERATION_RENAME_ATTRIBUTES_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmOperationRenameAttributes(ctx),
    CdmObjectType.OPERATION_REPLACE_AS_FOREIGN_KEY_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmOperationReplaceAsForeignKey(ctx),
    CdmObjectType.OPERATION_INCLUDE_ATTRIBUTES_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmOperationIncludeAttributes(ctx),
    CdmObjectType.OPERATION_ADD_ATTRIBUTE_GROUP_DEF: lambda ctx, name_or_ref, simple_name_ref: CdmOperationAddAttributeGroup(ctx)
}


def make_object(ctx, of_type: 'CdmObjectType', name_or_ref: str, simple_name_ref: bool) -> 'TObject':
    """instantiates a OM class based on the object type passed as first parameter."""

    return switcher[of_type](ctx, name_or_ref, simple_name_ref)
