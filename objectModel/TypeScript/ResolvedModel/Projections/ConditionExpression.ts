// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmObject, cdmObjectType, CdmOperationBase, CdmOperationCollection } from '../../internal';

/**
 * A class to manage the conditional directive of the util
 * @internal
 */
export class ConditionExpression {
    /**
     * @internal
     */
    public static getEntityAttributeOverallConditionExpression(owner: CdmObject = null): string {
        let bldr: string = '';

        // if the owner of the projection is an entity attribute
        if (owner?.objectType === cdmObjectType.entityAttributeDef) {
            bldr += ' ( (!normalized) || (cardinality.maximum <= 1) ) ';
        }

        return (bldr.length > 0) ? bldr : undefined;
    }

    /**
     * When no explicit condition is provided, a projection will apply the default condition expression based on the operations
     * This function defined the defaults for each operation and builds the projection's condition expression
     * @internal
     */
    public static getDefaultConditionExpression(operations: CdmOperationCollection, owner: CdmObject = null): string {
        let bldr: string = '';

        // if the owner of the projection is an entity attribute
        if (owner?.objectType === cdmObjectType.entityAttributeDef) {
            bldr += ' ( (!normalized) || (cardinality.maximum <= 1) ) ';
        }

        if (operations.length > 0) {
            if (ConditionExpression.hasForeignKeyOperations(operations)) {
                bldr = ConditionExpression.appendString(bldr, ' (referenceOnly || noMaxDepth || (depth > maxDepth)) ');
            } else if (ConditionExpression.hasNotStructuredOperations(operations)) {
                bldr = ConditionExpression.appendString(bldr, ' (!structured) ');
            } else {
                bldr = ConditionExpression.appendString(bldr, ' (true) '); // do these always
            }
        }

        return (bldr.length > 0) ? bldr : undefined;
    }

    private static appendString(bldr: string, message: string): string {
        if (bldr.length > 0) {
            bldr += ' && ';
        }

        bldr += message;

        return bldr;
    }

    /**
     * Function to find if the operations collection has a foreign key
     */
    private static hasForeignKeyOperations(operations: CdmOperationCollection): boolean {
        const list: CdmOperationBase[] = operations.allItems
            .filter((op: CdmOperationBase) => op.objectType === cdmObjectType.operationReplaceAsForeignKeyDef);

        return (list.length > 0);
    }

    /**
     * Function to find if the operations collection has an operation that is not resolved for structured directive
     */
    private static hasNotStructuredOperations(operations: CdmOperationCollection): boolean {
        const list: CdmOperationBase[] = operations.allItems.filter((op: CdmOperationBase) =>
            op.objectType === cdmObjectType.operationAddCountAttributeDef ||
            op.objectType === cdmObjectType.operationAddTypeAttributeDef ||
            op.objectType === cdmObjectType.operationRenameAttributesDef ||
            op.objectType === cdmObjectType.operationArrayExpansionDef
        );

        return (list.length > 0);
    }
}
