// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { cdmObjectType } from '../internal';

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
    public static operationTypeToString(opType: cdmOperationType): string {
        switch (opType) {
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

    /**
     * @internal
     * Gets the operation type from the object type.
     */
    public static fromObjectType(objectType: cdmObjectType): cdmOperationType {
        switch (objectType) {
            case cdmObjectType.operationAddAttributeGroupDef:
                return cdmOperationType.addAttributeGroup;
            case cdmObjectType.operationAddCountAttributeDef:
                return cdmOperationType.addCountAttribute;
            case cdmObjectType.operationAddSupportingAttributeDef:
                return cdmOperationType.addSupportingAttribute;
            case cdmObjectType.operationAddTypeAttributeDef:
                return cdmOperationType.addTypeAttribute;
            case cdmObjectType.operationArrayExpansionDef:
                return cdmOperationType.arrayExpansion;
            case cdmObjectType.operationCombineAttributesDef:
                return cdmOperationType.combineAttributes;
            case cdmObjectType.operationExcludeAttributesDef:
                return cdmOperationType.excludeAttributes;
            case cdmObjectType.operationIncludeAttributesDef:
                return cdmOperationType.includeAttributes;
            case cdmObjectType.operationRenameAttributesDef:
                return cdmOperationType.renameAttributes;
            case cdmObjectType.operationReplaceAsForeignKeyDef:
                return cdmOperationType.replaceAsForeignKey;
        }
    }
}
