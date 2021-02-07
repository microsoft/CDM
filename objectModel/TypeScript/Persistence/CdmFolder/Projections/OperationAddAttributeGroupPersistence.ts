// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { 
    CdmCorpusContext,
    cdmObjectType,
    CdmOperationAddAttributeGroup,
    copyOptions,
    resolveOptions } from '../../../internal';
import { OperationAddAttributeGroup } from '../types';
import { OperationBasePersistence } from './OperationBasePersistence';

/**
 * Operation AddAttributeGroup persistence
 */
export class OperationAddAttributeGroupPersistence {
    public static fromData(ctx: CdmCorpusContext, object: OperationAddAttributeGroup): CdmOperationAddAttributeGroup {
        if (!object) {
            return undefined;
        }

        const addAttributeGroupOp: CdmOperationAddAttributeGroup = OperationBasePersistence.fromData(ctx, cdmObjectType.operationAddAttributeGroupDef, object);
        addAttributeGroupOp.attributeGroupName = object.attributeGroupName;

        return addAttributeGroupOp;
    }

    public static toData(instance: CdmOperationAddAttributeGroup, resOpt: resolveOptions, options: copyOptions): OperationAddAttributeGroup {
        if (!instance) {
            return undefined;
        }

        const data: OperationAddAttributeGroup = OperationBasePersistence.toData(instance, resOpt, options);
        data.attributeGroupName = instance.attributeGroupName;

        return data;
    }
}
