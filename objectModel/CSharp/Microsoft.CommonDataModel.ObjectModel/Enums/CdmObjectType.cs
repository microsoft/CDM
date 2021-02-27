// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Enums
{
    public enum CdmObjectType
    {
        Error,
        Import,
        ArgumentDef,
        ParameterDef,
        TraitDef,
        TraitRef,
        PurposeDef,
        PurposeRef,
        DataTypeDef,
        DataTypeRef,
        AttributeRef,
        TypeAttributeDef,
        EntityAttributeDef,
        AttributeGroupDef,
        AttributeGroupRef,
        ConstantEntityDef,
        EntityDef,
        EntityRef,
        DocumentDef,
        ManifestDeclarationDef,
        ManifestDef,
        FolderDef,
        AttributeContextDef,
        AttributeContextRef,
        ReferencedEntityDeclarationDef,
        DataPartitionDef,
        DataPartitionPatternDef,
        LocalEntityDeclarationDef,
        AttributeResolutionGuidanceDef,
        E2ERelationshipDef,
        OperationAddCountAttributeDef,
        OperationAddSupportingAttributeDef,
        OperationAddTypeAttributeDef,
        OperationExcludeAttributesDef,
        OperationArrayExpansionDef,
        OperationCombineAttributesDef,
        OperationRenameAttributesDef,
        OperationReplaceAsForeignKeyDef,
        OperationIncludeAttributesDef,
        OperationAddAttributeGroupDef,
        ProjectionDef
    }

    public enum CdmValidationStep
    {
        Start,
        Imports,
        Integrity,
        Declarations,
        References,
        Parameters,
        TraitAppliers,
        MinimumForResolving,
        Traits,
        Attributes,
        EntityReferences,
        Cleanup,
        Finished,
        Error
    }

    public enum CdmAttributeContextType
    {
        Entity,
        EntityReferenceExtends,
        AttributeDefinition,
        EntityReferenceAsAttribute,
        AttributeGroup,
        GeneratedSet,
        GeneratedRound,
        AddedAttributeSupporting,
        AddedAttributeIdentity,
        AddedAttributeSelectedType,
        AddedAttributeExpansionTotal,
        PassThrough,
        Projection,
        Source,
        Operations,
        OperationAddCountAttribute,
        OperationAddSupportingAttribute,
        OperationAddTypeAttribute,
        OperationExcludeAttributes,
        OperationArrayExpansion,
        OperationCombineAttributes,
        OperationRenameAttributes,
        OperationReplaceAsForeignKey,
        OperationIncludeAttributes,
        OperationAddAttributeGroup,
        Unknown
    }
}
