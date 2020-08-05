// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmObjectType,
    CdmOperationIncludeAttributes,
    cdmOperationType,
    copyOptions,
    Logger,
    OperationTypeConvertor,
    resolveOptions,
    StringUtils
} from '../../../internal';
import { OperationIncludeAttributes } from '../types';

/**
 * Operation IncludeAttributes persistence
 */
export class OperationIncludeAttributesPersistence {
    public static fromData(ctx: CdmCorpusContext, object: OperationIncludeAttributes): CdmOperationIncludeAttributes {
        if (!object) {
            return undefined;
        }
        const includeAttributesOp: CdmOperationIncludeAttributes = ctx.corpus.MakeObject<CdmOperationIncludeAttributes>(cdmObjectType.operationIncludeAttributesDef);

        if (object.$type && !StringUtils.equalsWithIgnoreCase(object.$type, OperationTypeConvertor.operationTypeToString(cdmOperationType.includeAttributes))) {
            Logger.error(OperationIncludeAttributesPersistence.name, ctx, `$type ${object.$type} is invalid for this operation.`);
        } else {
            includeAttributesOp.type = cdmOperationType.includeAttributes;
        }

        if (object.explanation) {
            includeAttributesOp.explanation = object.explanation;
        }

        includeAttributesOp.includeAttributes = object.includeAttributes;

        return includeAttributesOp;
    }

    public static toData(instance: CdmOperationIncludeAttributes, resOpt: resolveOptions, options: copyOptions): OperationIncludeAttributes {
        if (!instance) {
            return undefined;
        }

        return {
            $type: OperationTypeConvertor.operationTypeToString(cdmOperationType.includeAttributes),
            explanation: instance.explanation,
            includeAttributes: instance.includeAttributes
        };
    }
}
