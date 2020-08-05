// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

/**
 * Enumeration of operation types
 */
export enum cdmOperationType {
    error,
    addCountAttribute,
    addSupportingAttribute,
    addTypeAttribute,
    excludeAttributes,
    arrayExpansion,
    combineAttributes,
    renameAttributes,
    replaceAsForeignKey,
    includeAttributes,
    addAttributeGroup
}

/**
 * @internal
 */
export class OperationTypeConvertor {
    /**
     * @internal
     */
    public static operationTypeToString(opType: cdmOperationType) : string {
        switch (opType)
        {
            case cdmOperationType.addCountAttribute:
                return 'addCountAttribute';
            case cdmOperationType.addSupportingAttribute:
                return 'addSupportingAttribute';
            case cdmOperationType.addTypeAttribute:
                return 'addTypeAttribute';
            case cdmOperationType.excludeAttributes:
                return 'excludeAttributes';
            case cdmOperationType.arrayExpansion:
                return 'arrayExpansion';
            case cdmOperationType.combineAttributes:
                return 'combineAttributes';
            case cdmOperationType.renameAttributes:
                return 'renameAttributes';
            case cdmOperationType.replaceAsForeignKey:
                return 'replaceAsForeignKey';
            case cdmOperationType.includeAttributes:
                return 'includeAttributes';
            case cdmOperationType.addAttributeGroup:
                return 'addAttributeGroup';
            case cdmOperationType.error:
            default:
                throw new Error('Invalid operation.');
        }
    }
}
