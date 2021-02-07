// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmObjectType,
    CdmOperationExcludeAttributes,
    copyOptions,
    resolveOptions
} from '../../../internal';
import { OperationExcludeAttributes } from '../types';
import { OperationBasePersistence } from './OperationBasePersistence';

/**
 * Operation ExcludeAttributes persistence
 */
export class OperationExcludeAttributesPersistence {
    public static fromData(ctx: CdmCorpusContext, object: OperationExcludeAttributes): CdmOperationExcludeAttributes {
        if (!object) {
            return undefined;
        }

        const excludeAttributesOp: CdmOperationExcludeAttributes = OperationBasePersistence.fromData(ctx, cdmObjectType.operationExcludeAttributesDef, object);
        excludeAttributesOp.excludeAttributes = object.excludeAttributes;

        return excludeAttributesOp;
    }

    public static toData(instance: CdmOperationExcludeAttributes, resOpt: resolveOptions, options: copyOptions): OperationExcludeAttributes {
        if (!instance) {
            return undefined;
        }

        const data: OperationExcludeAttributes = OperationBasePersistence.toData(instance, resOpt, options);
        data.excludeAttributes = instance.excludeAttributes;

        return data;
    }
}
