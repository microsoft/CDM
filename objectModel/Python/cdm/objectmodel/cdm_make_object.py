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
}


def make_object(ctx, of_type: 'CdmObjectType', name_or_ref: str, simple_name_ref: bool) -> 'TObject':
    """instantiates a OM class based on the object type passed as first parameter."""

    return switcher[of_type](ctx, name_or_ref, simple_name_ref)
