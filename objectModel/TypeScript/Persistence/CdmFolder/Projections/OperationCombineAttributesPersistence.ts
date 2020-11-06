// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmObjectType,
    CdmOperationCombineAttributes,
    cdmOperationType,
    CdmTypeAttributeDefinition,
    copyOptions,
    Logger,
    OperationTypeConvertor,
    resolveOptions,
    StringUtils
} from '../../../internal';
import { TypeAttributePersistence } from '../TypeAttributePersistence';
import { OperationCombineAttributes } from '../types';
import * as utils from '../utils';

/**
 * Operation CombineAttributes persistence
 */
export class OperationCombineAttributesPersistence {
    public static fromData(ctx: CdmCorpusContext, object: OperationCombineAttributes): CdmOperationCombineAttributes {
        if (!object) {
            return undefined;
        }
        const combineAttributesOp: CdmOperationCombineAttributes = ctx.corpus.MakeObject<CdmOperationCombineAttributes>(cdmObjectType.operationCombineAttributesDef);

        if (object.$type && !StringUtils.equalsWithIgnoreCase(object.$type, OperationTypeConvertor.operationTypeToString(cdmOperationType.combineAttributes))) {
            Logger.error(OperationCombineAttributesPersistence.name, ctx, `$type ${object.$type} is invalid for this operation.`);
        } else {
            combineAttributesOp.type = cdmOperationType.combineAttributes;
        }

        if (object.explanation) {
            combineAttributesOp.explanation = object.explanation;
        }

        combineAttributesOp.select = object.select;
        combineAttributesOp.mergeInto = utils.createAttribute(ctx, object.mergeInto) as CdmTypeAttributeDefinition;

        return combineAttributesOp;
    }

    public static toData(instance: CdmOperationCombineAttributes, resOpt: resolveOptions, options: copyOptions): OperationCombineAttributes {
        if (!instance) {
            return undefined;
        }

        return {
            $type: OperationTypeConvertor.operationTypeToString(cdmOperationType.combineAttributes),
            explanation: instance.explanation,
            select: instance.select,
            mergeInto: TypeAttributePersistence.toData(instance.mergeInto, resOpt, options)
        };
    }
}
