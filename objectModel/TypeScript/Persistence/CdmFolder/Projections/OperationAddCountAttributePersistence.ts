// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmObjectType,
    CdmOperationAddCountAttribute,
    CdmTypeAttributeDefinition,
    copyOptions,
    resolveOptions
} from '../../../internal';
import { TypeAttributePersistence } from '../TypeAttributePersistence';
import { OperationAddCountAttribute } from '../types';
import * as utils from '../utils';
import { OperationBasePersistence } from './OperationBasePersistence';

/**
 * Operation AddCountAttribute persistence
 */
export class OperationAddCountAttributePersistence {
    public static fromData(ctx: CdmCorpusContext, object: OperationAddCountAttribute): CdmOperationAddCountAttribute {
        if (!object) {
            return undefined;
        }

        const addCountAttributeOp: CdmOperationAddCountAttribute = OperationBasePersistence.fromData(ctx, cdmObjectType.operationAddCountAttributeDef, object);
        addCountAttributeOp.countAttribute = utils.createAttribute(ctx, object.countAttribute) as CdmTypeAttributeDefinition;

        return addCountAttributeOp;
    }

    public static toData(instance: CdmOperationAddCountAttribute, resOpt: resolveOptions, options: copyOptions): OperationAddCountAttribute {
        if (!instance) {
            return undefined;
        }

        const data: OperationAddCountAttribute = OperationBasePersistence.toData(instance, resOpt, options);
        data.countAttribute = TypeAttributePersistence.toData(instance.countAttribute, resOpt, options);

        return data;
    }
}
