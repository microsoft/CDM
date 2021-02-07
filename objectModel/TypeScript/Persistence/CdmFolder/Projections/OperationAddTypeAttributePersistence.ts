// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmObjectType,
    CdmOperationAddTypeAttribute,
    CdmTypeAttributeDefinition,
    copyOptions,
    resolveOptions
} from '../../../internal';
import { TypeAttributePersistence } from '../TypeAttributePersistence';
import { OperationAddTypeAttribute } from '../types';
import * as utils from '../utils';
import { OperationBasePersistence } from './OperationBasePersistence';

/**
 * Operation AddTypeAttribute persistence
 */
export class OperationAddTypeAttributePersistence {
    public static fromData(ctx: CdmCorpusContext, object: OperationAddTypeAttribute): CdmOperationAddTypeAttribute {
        if (!object) {
            return undefined;
        }

        const addTypeAttributeOp: CdmOperationAddTypeAttribute = OperationBasePersistence.fromData(ctx, cdmObjectType.operationAddTypeAttributeDef, object);
        addTypeAttributeOp.typeAttribute = utils.createAttribute(ctx, object.typeAttribute) as CdmTypeAttributeDefinition;

        return addTypeAttributeOp;
    }

    public static toData(instance: CdmOperationAddTypeAttribute, resOpt: resolveOptions, options: copyOptions): OperationAddTypeAttribute {
        if (!instance) {
            return undefined;
        }

        const data: OperationAddTypeAttribute = OperationBasePersistence.toData(instance, resOpt, options);
        data.typeAttribute = TypeAttributePersistence.toData(instance.typeAttribute, resOpt, options)

        return data;
    }
}
