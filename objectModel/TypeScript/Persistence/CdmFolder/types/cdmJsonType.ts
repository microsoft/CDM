import {
    Argument,
    AttributeContext,
    AttributeGroup,
    AttributeGroupReference,
    AttributeResolutionGuidance,
    ConstantEntity,
    DataPartition,
    DataPartitionPattern,
    DataType,
    DataTypeReference,
    DocumentContent,
    Entity,
    EntityAttribute,
    EntityDeclarationDefinition,
    EntityReference,
    Folder,
    Import,
    ManifestDeclaration,
    Parameter,
    Purpose,
    PurposeReference,
    Trait,
    TraitReference,
    TypeAttribute
} from '.';

export type CdmJsonType = (
    string |
    object |
    Argument |
    AttributeContext |
    AttributeGroup |
    AttributeGroupReference |
    AttributeResolutionGuidance |
    ConstantEntity |
    DataPartition |
    DataPartitionPattern |
    DataType |
    DataTypeReference |
    DocumentContent |
    Entity |
    EntityAttribute |
    EntityReference |
    ManifestDeclaration |
    Folder |
    ManifestDeclaration |
    Import |
    EntityDeclarationDefinition |
    Parameter |
    Purpose |
    PurposeReference |
    Trait |
    TraitReference |
    TypeAttribute);
