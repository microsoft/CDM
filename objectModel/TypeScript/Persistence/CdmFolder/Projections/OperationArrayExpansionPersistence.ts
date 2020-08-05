// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmObjectType,
    CdmOperationArrayExpansion,
    cdmOperationType,
    copyOptions,
    Logger,
    OperationTypeConvertor,
    resolveOptions,
    StringUtils
} from '../../../internal';
import { OperationArrayExpansion } from '../types';

/**
 * Operation ArrayExpansion persistence
 */
export class OperationArrayExpansionPersistence {
    public static fromData(ctx: CdmCorpusContext, object: OperationArrayExpansion): CdmOperationArrayExpansion {
        if (!object) {
            return undefined;
        }
        const arrayExpansionOp: CdmOperationArrayExpansion = ctx.corpus.MakeObject<CdmOperationArrayExpansion>(cdmObjectType.operationArrayExpansionDef);

        if (object.$type && !StringUtils.equalsWithIgnoreCase(object.$type, OperationTypeConvertor.operationTypeToString(cdmOperationType.arrayExpansion))) {
            Logger.error(OperationArrayExpansionPersistence.name, ctx, `$type ${object.$type} is invalid for this operation.`);
        } else {
            arrayExpansionOp.type = cdmOperationType.arrayExpansion;
        }

        if (object.explanation) {
            arrayExpansionOp.explanation = object.explanation;
        }

        arrayExpansionOp.startOrdinal = object.startOrdinal;
        arrayExpansionOp.endOrdinal = object.endOrdinal;

        return arrayExpansionOp;
    }

    public static toData(instance: CdmOperationArrayExpansion, resOpt: resolveOptions, options: copyOptions): OperationArrayExpansion {
        if (!instance) {
            return undefined;
        }

        return {
            $type: OperationTypeConvertor.operationTypeToString(cdmOperationType.arrayExpansion),
            explanation: instance.explanation,
            startOrdinal: instance.startOrdinal,
            endOrdinal: instance.endOrdinal
        };
    }
}
