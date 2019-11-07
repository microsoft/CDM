//-----------------------------------------------------------------------
// <copyright file="CdmObjectType.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

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
        E2ERelationshipDef
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
        PassThrough
    }
}
