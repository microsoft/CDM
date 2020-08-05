// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmObjectType,
    CdmOperationExcludeAttributes,
    cdmOperationType,
    copyOptions,
    Logger,
    OperationTypeConvertor,
    resolveOptions,
    StringUtils
} from '../../../internal';
import { OperationExcludeAttributes } from '../types';

/**
 * Operation ExcludeAttributes persistence
 */
export class OperationExcludeAttributesPersistence {
    public static fromData(ctx: CdmCorpusContext, object: OperationExcludeAttributes): CdmOperationExcludeAttributes {
        if (!object) {
            return undefined;
        }
        const excludeAttributesOp: CdmOperationExcludeAttributes = ctx.corpus.MakeObject<CdmOperationExcludeAttributes>(cdmObjectType.operationExcludeAttributesDef);

        if (object.$type && !StringUtils.equalsWithIgnoreCase(object.$type, OperationTypeConvertor.operationTypeToString(cdmOperationType.excludeAttributes))) {
            Logger.error(OperationExcludeAttributesPersistence.name, ctx, `$type ${object.$type} is invalid for this operation.`);
        } else {
            excludeAttributesOp.type = cdmOperationType.excludeAttributes;
        }

        if (object.explanation) {
            excludeAttributesOp.explanation = object.explanation;
        }

        excludeAttributesOp.excludeAttributes = object.excludeAttributes;

        return excludeAttributesOp;
    }

    public static toData(instance: CdmOperationExcludeAttributes, resOpt: resolveOptions, options: copyOptions): OperationExcludeAttributes {
        if (!instance) {
            return undefined;
        }

        return {
            $type: OperationTypeConvertor.operationTypeToString(cdmOperationType.excludeAttributes),
            explanation: instance.explanation,
            excludeAttributes: instance.excludeAttributes
        };
    }
}
