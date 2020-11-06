// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmObjectType,
    CdmOperationAddAttributeGroup,
    cdmOperationType,
    copyOptions,
    Logger,
    OperationTypeConvertor,
    resolveOptions,
    StringUtils
} from '../../../internal';
import { OperationAddAttributeGroup } from '../types';

/**
 * Operation AddAttributeGroup persistence
 */
export class OperationAddAttributeGroupPersistence {
    public static fromData(ctx: CdmCorpusContext, object: OperationAddAttributeGroup): CdmOperationAddAttributeGroup {
        if (!object) {
            return undefined;
        }
        const addAttributeGroupOp: CdmOperationAddAttributeGroup = ctx.corpus.MakeObject<CdmOperationAddAttributeGroup>(cdmObjectType.operationAddAttributeGroupDef);

        if (object.$type && !StringUtils.equalsWithIgnoreCase(object.$type, OperationTypeConvertor.operationTypeToString(cdmOperationType.addAttributeGroup))) {
            Logger.error(OperationAddAttributeGroupPersistence.name, ctx, `$type ${object.$type} is invalid for this operation.`);
        } else {
            addAttributeGroupOp.type = cdmOperationType.addAttributeGroup;
        }

        addAttributeGroupOp.attributeGroupName = object.attributeGroupName;
        addAttributeGroupOp.explanation = object.explanation;

        return addAttributeGroupOp;
    }

    public static toData(instance: CdmOperationAddAttributeGroup, resOpt: resolveOptions, options: copyOptions): OperationAddAttributeGroup {
        if (!instance) {
            return undefined;
        }

        return {
            $type: OperationTypeConvertor.operationTypeToString(cdmOperationType.addAttributeGroup),
            attributeGroupName: instance.attributeGroupName,
            explanation: instance.explanation
        };
    }
}
