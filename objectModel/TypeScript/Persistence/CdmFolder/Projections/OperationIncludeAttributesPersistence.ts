// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmObjectType,
    CdmOperationIncludeAttributes,
    copyOptions,
    resolveOptions
} from '../../../internal';
import { OperationIncludeAttributes } from '../types';
import { OperationBasePersistence } from './OperationBasePersistence';

/**
 * Operation IncludeAttributes persistence
 */
export class OperationIncludeAttributesPersistence {
    public static fromData(ctx: CdmCorpusContext, object: OperationIncludeAttributes): CdmOperationIncludeAttributes {
        if (!object) {
            return undefined;
        }

        const includeAttributesOp: CdmOperationIncludeAttributes = OperationBasePersistence.fromData(ctx, cdmObjectType.operationIncludeAttributesDef, object);
        includeAttributesOp.includeAttributes = object.includeAttributes;

        return includeAttributesOp;
    }

    public static toData(instance: CdmOperationIncludeAttributes, resOpt: resolveOptions, options: copyOptions): OperationIncludeAttributes {
        if (!instance) {
            return undefined;
        }

        const data: OperationIncludeAttributes = OperationBasePersistence.toData(instance, resOpt, options);
        data.includeAttributes = instance.includeAttributes;

        return data;
    }
}
