// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    CdmEntityReference,
    cdmObjectType,
    CdmOperationAddAttributeGroup,
    CdmOperationAddCountAttribute,
    CdmOperationAddSupportingAttribute,
    CdmOperationAddTypeAttribute,
    CdmOperationBase,
    CdmOperationExcludeAttributes,
    CdmOperationArrayExpansion,
    CdmOperationCombineAttributes,
    CdmOperationRenameAttributes,
    CdmOperationReplaceAsForeignKey,
    CdmOperationIncludeAttributes,
    cdmOperationType,
    CdmProjection,
    copyOptions,
    OperationTypeConvertor,
    resolveOptions,
    Logger
} from '../../../internal';
import { EntityReferencePersistence } from '../EntityReferencePersistence';
import {
    EntityReferenceDefinition,
    OperationAddAttributeGroup,
    OperationAddCountAttribute,
    OperationAddSupportingAttribute,
    OperationAddTypeAttribute,
    OperationArrayExpansion,
    OperationBase,
    OperationCombineAttributes,
    OperationExcludeAttributes,
    OperationIncludeAttributes,
    OperationRenameAttributes,
    OperationReplaceAsForeignKey,
    Projection
} from '../types';
import { OperationAddAttributeGroupPersistence } from './OperationAddAttributeGroupPersistence';
import { OperationAddCountAttributePersistence } from './OperationAddCountAttributePersistence';
import { OperationAddSupportingAttributePersistence } from './OperationAddSupportingAttributePersistence';
import { OperationAddTypeAttributePersistence } from './OperationAddTypeAttributePersistence';
import { OperationExcludeAttributesPersistence } from './OperationExcludeAttributesPersistence';
import { OperationArrayExpansionPersistence } from './OperationArrayExpansionPersistence';
import { OperationCombineAttributesPersistence } from './OperationCombineAttributesPersistence';
import { OperationRenameAttributesPersistence } from './OperationRenameAttributesPersistence';
import { OperationReplaceAsForeignKeyPersistence } from './OperationReplaceAsForeignKeyPersistence';
import { OperationIncludeAttributesPersistence } from './OperationIncludeAttributesPersistence';

/**
 * Projection persistence
 */
export class ProjectionPersistence {
    public static fromData(ctx: CdmCorpusContext, object: Projection): CdmProjection {
        if (!object) {
            return undefined;
        }

        const projection: CdmProjection = ctx.corpus.MakeObject<CdmProjection>(cdmObjectType.projectionDef);

        const source: CdmEntityReference = EntityReferencePersistence.fromData(ctx, object.source);

        if ('explanation' in object && object.explanation) {
            projection.explanation = object.explanation;
        }

        if ('condition' in object) {
            projection.condition = object.condition;
        }

        if ('operations' in object && object.operations) {
            const operationJsons: OperationBase[] = object.operations;

            operationJsons.forEach((operationJson: OperationBase) => {
                const type: string = operationJson.$type;
                switch (type) {
                    case 'addCountAttribute':
                        const addCountAttributeOp: CdmOperationAddCountAttribute = OperationAddCountAttributePersistence.fromData(ctx, operationJson as OperationAddCountAttribute);
                        projection.operations.push(addCountAttributeOp);
                        break;
                    case 'addSupportingAttribute':
                        const addSupportingAttributeOp: CdmOperationAddSupportingAttribute = OperationAddSupportingAttributePersistence.fromData(ctx, operationJson as OperationAddSupportingAttribute);
                        projection.operations.push(addSupportingAttributeOp);
                        break;
                    case 'addTypeAttribute':
                        const addTypeAttributeOp: CdmOperationAddTypeAttribute = OperationAddTypeAttributePersistence.fromData(ctx, operationJson as OperationAddTypeAttribute);
                        projection.operations.push(addTypeAttributeOp);
                        break;
                    case 'excludeAttributes':
                        const excludeAttributesOp: CdmOperationExcludeAttributes = OperationExcludeAttributesPersistence.fromData(ctx, operationJson as OperationExcludeAttributes);
                        projection.operations.push(excludeAttributesOp);
                        break;
                    case 'arrayExpansion':
                        const arrayExpansionOp: CdmOperationArrayExpansion = OperationArrayExpansionPersistence.fromData(ctx, operationJson as OperationArrayExpansion);
                        projection.operations.push(arrayExpansionOp);
                        break;
                    case 'combineAttributes':
                        const combineAttributesOp: CdmOperationCombineAttributes = OperationCombineAttributesPersistence.fromData(ctx, operationJson as OperationCombineAttributes);
                        projection.operations.push(combineAttributesOp);
                        break;
                    case 'renameAttributes':
                        const renameAttributesOp: CdmOperationRenameAttributes = OperationRenameAttributesPersistence.fromData(ctx, operationJson as OperationRenameAttributes);
                        projection.operations.push(renameAttributesOp);
                        break;
                    case 'replaceAsForeignKey':
                        const replaceAsForeignKeyOp: CdmOperationReplaceAsForeignKey = OperationReplaceAsForeignKeyPersistence.fromData(ctx, operationJson as OperationReplaceAsForeignKey);
                        projection.operations.push(replaceAsForeignKeyOp);
                        break;
                    case 'includeAttributes':
                        const includeAttributesOp: CdmOperationIncludeAttributes = OperationIncludeAttributesPersistence.fromData(ctx, operationJson as OperationIncludeAttributes);
                        projection.operations.push(includeAttributesOp);
                        break;
                    case 'addAttributeGroup':
                        const addAttributeGroupOp: CdmOperationAddAttributeGroup = OperationAddAttributeGroupPersistence.fromData(ctx, operationJson as OperationAddAttributeGroup);
                        projection.operations.push(addAttributeGroupOp);
                        break;
                    default:
                        Logger.error(ProjectionPersistence.name, ctx, `Invalid operation type '${type}'.`, ProjectionPersistence.fromData.name);
                }
            });
        }
        projection.source = source;

        return projection;
    }

    public static toData(instance: CdmProjection, resOpt: resolveOptions, options: copyOptions): Projection {
        if (!instance) {
            return undefined;
        }

        const source: EntityReferenceDefinition = EntityReferencePersistence.toData(instance.source as CdmEntityReference, resOpt, options) as EntityReferenceDefinition;

        let operations: OperationBase[];
        if (instance.operations) {
            operations = [];
            instance.operations.allItems.forEach((operation: CdmOperationBase) => {
                switch (operation.objectType) {
                    case cdmObjectType.operationAddCountAttributeDef:
                        const addCountAttributeOp: OperationAddCountAttribute = OperationAddCountAttributePersistence.toData(operation as CdmOperationAddCountAttribute, resOpt, options);
                        operations.push(addCountAttributeOp);
                        break;
                    case cdmObjectType.operationAddSupportingAttributeDef:
                        const addSupportingAttributeOp: OperationAddSupportingAttribute = OperationAddSupportingAttributePersistence.toData(operation as CdmOperationAddSupportingAttribute, resOpt, options);
                        operations.push(addSupportingAttributeOp);
                        break;
                    case cdmObjectType.operationAddTypeAttributeDef:
                        const addTypeAttributeOp: OperationAddTypeAttribute = OperationAddTypeAttributePersistence.toData(operation as CdmOperationAddTypeAttribute, resOpt, options);
                        operations.push(addTypeAttributeOp);
                        break;
                    case cdmObjectType.operationExcludeAttributesDef:
                        const excludeAttributesOp: OperationExcludeAttributes = OperationExcludeAttributesPersistence.toData(operation as CdmOperationExcludeAttributes, resOpt, options);
                        operations.push(excludeAttributesOp);
                        break;
                    case cdmObjectType.operationArrayExpansionDef:
                        const arrayExpansionOp: OperationArrayExpansion = OperationArrayExpansionPersistence.toData(operation as CdmOperationArrayExpansion, resOpt, options);
                        operations.push(arrayExpansionOp);
                        break;
                    case cdmObjectType.operationCombineAttributesDef:
                        const combineAttributesOp: OperationCombineAttributes = OperationCombineAttributesPersistence.toData(operation as CdmOperationCombineAttributes, resOpt, options);
                        operations.push(combineAttributesOp);
                        break;
                    case cdmObjectType.operationRenameAttributesDef:
                        const renameAttributesOp: OperationRenameAttributes = OperationRenameAttributesPersistence.toData(operation as CdmOperationRenameAttributes, resOpt, options);
                        operations.push(renameAttributesOp);
                        break;
                    case cdmObjectType.operationReplaceAsForeignKeyDef:
                        const replaceAsForeignKeyOp: OperationReplaceAsForeignKey = OperationReplaceAsForeignKeyPersistence.toData(operation as CdmOperationReplaceAsForeignKey, resOpt, options);
                        operations.push(replaceAsForeignKeyOp);
                        break;
                    case cdmObjectType.operationIncludeAttributesDef:
                        const includeAttributesOp: OperationIncludeAttributes = OperationIncludeAttributesPersistence.toData(operation as CdmOperationIncludeAttributes, resOpt, options);
                        operations.push(includeAttributesOp);
                        break;
                    case cdmObjectType.operationAddAttributeGroupDef:
                        const addAttributeGroupOp: OperationAddAttributeGroup = OperationAddAttributeGroupPersistence.toData(operation as CdmOperationAddAttributeGroup, resOpt, options);
                        operations.push(addAttributeGroupOp);
                        break;
                    default:
                        const baseOp: OperationBase = {
                            $type: OperationTypeConvertor.operationTypeToString(cdmOperationType.error),
                            explanation: undefined
                        };
                        operations.push(baseOp);
                }
            });
        }

        return {
            explanation: instance.explanation,
            source: source,
            operations: operations,
            condition: instance.condition
        };
    }
}
