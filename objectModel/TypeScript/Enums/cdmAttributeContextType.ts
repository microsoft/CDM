// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export enum cdmAttributeContextType {
    entity,
    entityReferenceExtends,
    attributeDefinition,
    attributeGroup,
    generatedSet,
    generatedRound,
    addedAttributeSupporting,
    addedAttributeIdentity,
    addedAttributeSelectedType,
    addedAttributeExpansionTotal,
    passThrough,
    projection,
    source,
    operations,
    operationAddCountAttribute,
    operationAddSupportingAttribute,
    operationAddTypeAttribute,
    operationExcludeAttributes,
    operationArrayExpansion,
    operationCombineAttributes,
    operationRenameAttributes,
    operationReplaceAsForeignKey,
    operationIncludeAttributes,
    operationAddAttributeGroup
}
