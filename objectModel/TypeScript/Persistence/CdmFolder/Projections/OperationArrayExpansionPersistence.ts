// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmObjectType,
    CdmOperationArrayExpansion,
    copyOptions,
    resolveOptions,
} from '../../../internal';
import { OperationArrayExpansion } from '../types';
import { OperationBasePersistence } from './OperationBasePersistence';

/**
 * Operation ArrayExpansion persistence
 */
export class OperationArrayExpansionPersistence {
    public static fromData(ctx: CdmCorpusContext, object: OperationArrayExpansion): CdmOperationArrayExpansion {
        if (!object) {
            return undefined;
        }

        const arrayExpansionOp: CdmOperationArrayExpansion = OperationBasePersistence.fromData(ctx, cdmObjectType.operationArrayExpansionDef, object);
        arrayExpansionOp.startOrdinal = object.startOrdinal;
        arrayExpansionOp.endOrdinal = object.endOrdinal;

        return arrayExpansionOp;
    }

    public static toData(instance: CdmOperationArrayExpansion, resOpt: resolveOptions, options: copyOptions): OperationArrayExpansion {
        if (!instance) {
            return undefined;
        }

        const data: OperationArrayExpansion = OperationBasePersistence.toData(instance, resOpt, options);
        data.startOrdinal = instance.startOrdinal;
        data.endOrdinal = instance.endOrdinal;

        return data;
    }
}
