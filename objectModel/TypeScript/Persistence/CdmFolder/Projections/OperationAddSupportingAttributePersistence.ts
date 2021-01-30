// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmObjectType,
    CdmOperationAddSupportingAttribute,
    CdmTypeAttributeDefinition,
    copyOptions,
    resolveOptions
} from '../../../internal';
import { TypeAttributePersistence } from '../TypeAttributePersistence';
import { OperationAddSupportingAttribute } from '../types';
import * as utils from '../utils';
import { OperationBasePersistence } from './OperationBasePersistence';

/**
 * Operation AddSupportingAttribute persistence
 */
export class OperationAddSupportingAttributePersistence {
    public static fromData(ctx: CdmCorpusContext, object: OperationAddSupportingAttribute): CdmOperationAddSupportingAttribute {
        if (!object) {
            return undefined;
        }

        const addSupportingAttributeOp: CdmOperationAddSupportingAttribute = OperationBasePersistence.fromData(ctx, cdmObjectType.operationAddSupportingAttributeDef, object);
        addSupportingAttributeOp.supportingAttribute = utils.createAttribute(ctx, object.supportingAttribute) as CdmTypeAttributeDefinition;

        return addSupportingAttributeOp;
    }

    public static toData(instance: CdmOperationAddSupportingAttribute, resOpt: resolveOptions, options: copyOptions): OperationAddSupportingAttribute {
        if (!instance) {
            return undefined;
        }

        const data: OperationAddSupportingAttribute = OperationBasePersistence.toData(instance, resOpt, options);
        data.supportingAttribute = TypeAttributePersistence.toData(instance.supportingAttribute, resOpt, options)

        return data;
    }
}
