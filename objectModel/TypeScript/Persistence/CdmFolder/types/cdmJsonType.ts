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
    EntityReferenceDefinition |
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
