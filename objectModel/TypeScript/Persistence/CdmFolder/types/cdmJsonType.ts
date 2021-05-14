// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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
    EntityReferenceDefinition,
    Folder,
    Import,
    ManifestDeclaration,
    OperationAddAttributeGroup,
    OperationAddCountAttribute,
    OperationAddSupportingAttribute,
    OperationAddTypeAttribute,
    OperationArrayExpansion,
    OperationCombineAttributes,
    OperationExcludeAttributes,
    OperationIncludeAttributes,
    OperationRenameAttributes,
    OperationReplaceAsForeignKey,
    Parameter,
    Projection,
    Purpose,
    PurposeReference,
    Trait,
    TraitReference,
    TraitGroup,
    TraitGroupReference,
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
    EntityReferenceDefinition |
    ManifestDeclaration |
    OperationAddCountAttribute |
    OperationAddSupportingAttribute |
    OperationAddTypeAttribute |
    OperationExcludeAttributes |
    OperationArrayExpansion |
    OperationCombineAttributes |
    OperationRenameAttributes |
    OperationReplaceAsForeignKey |
    OperationIncludeAttributes |
    OperationAddAttributeGroup |
    Folder |
    ManifestDeclaration |
    Import |
    EntityDeclarationDefinition |
    Parameter |
    Projection |
    Purpose |
    PurposeReference |
    Trait |
    TraitReference |
    TraitGroup |
    TraitGroupReference |
    TypeAttribute);
