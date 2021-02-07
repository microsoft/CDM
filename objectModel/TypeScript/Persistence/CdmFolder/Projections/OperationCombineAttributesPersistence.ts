// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmObjectType,
    CdmOperationCombineAttributes,
    CdmTypeAttributeDefinition,
    copyOptions,
    resolveOptions,
} from '../../../internal';
import { TypeAttributePersistence } from '../TypeAttributePersistence';
import { OperationCombineAttributes } from '../types';
import * as utils from '../utils';
import { OperationBasePersistence } from './OperationBasePersistence';

/**
 * Operation CombineAttributes persistence
 */
export class OperationCombineAttributesPersistence {
    public static fromData(ctx: CdmCorpusContext, object: OperationCombineAttributes): CdmOperationCombineAttributes {
        if (!object) {
            return undefined;
        }

        const combineAttributesOp: CdmOperationCombineAttributes = OperationBasePersistence.fromData(ctx, cdmObjectType.operationCombineAttributesDef, object);
        combineAttributesOp.select = object.select;
        combineAttributesOp.mergeInto = utils.createAttribute(ctx, object.mergeInto) as CdmTypeAttributeDefinition;

        return combineAttributesOp;
    }

    public static toData(instance: CdmOperationCombineAttributes, resOpt: resolveOptions, options: copyOptions): OperationCombineAttributes {
        if (!instance) {
            return undefined;
        }

        const data: OperationCombineAttributes = OperationBasePersistence.toData(instance, resOpt, options);
        data.select = instance.select;
        data.mergeInto = TypeAttributePersistence.toData(instance.mergeInto, resOpt, options);

        return data;
    }
}
