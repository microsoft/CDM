// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmObjectType,
    CdmOperationAddCountAttribute,
    cdmOperationType,
    CdmTypeAttributeDefinition,
    copyOptions,
    Logger,
    OperationTypeConvertor,
    resolveOptions,
    StringUtils
} from '../../../internal';
import { TypeAttributePersistence } from '../TypeAttributePersistence';
import { OperationAddCountAttribute } from '../types';
import * as utils from '../utils';

/**
 * Operation AddCountAttribute persistence
 */
export class OperationAddCountAttributePersistence {
    public static fromData(ctx: CdmCorpusContext, object: OperationAddCountAttribute): CdmOperationAddCountAttribute {
        if (!object) {
            return undefined;
        }
        const addCountAttributeOp: CdmOperationAddCountAttribute = ctx.corpus.MakeObject<CdmOperationAddCountAttribute>(cdmObjectType.operationAddCountAttributeDef);

        if (object.$type && !StringUtils.equalsWithIgnoreCase(object.$type, OperationTypeConvertor.operationTypeToString(cdmOperationType.addCountAttribute))) {
            Logger.error(OperationAddCountAttributePersistence.name, ctx, `$type ${object.$type} is invalid for this operation.`);
        } else {
            addCountAttributeOp.type = cdmOperationType.addCountAttribute;
        }

        if (object.explanation) {
            addCountAttributeOp.explanation = object.explanation;
        }

        if (object.countAttribute) {
            addCountAttributeOp.countAttribute = utils.createAttribute(ctx, object.countAttribute) as CdmTypeAttributeDefinition;
        }

        return addCountAttributeOp;
    }

    public static toData(instance: CdmOperationAddCountAttribute, resOpt: resolveOptions, options: copyOptions): OperationAddCountAttribute {
        if (!instance) {
            return undefined;
        }

        return {
            $type: OperationTypeConvertor.operationTypeToString(cdmOperationType.addCountAttribute),
            explanation: instance.explanation,
            countAttribute: TypeAttributePersistence.toData(instance.countAttribute, resOpt, options)
        };
    }
}
