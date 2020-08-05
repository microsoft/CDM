// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmObjectType,
    CdmOperationAddSupportingAttribute,
    cdmOperationType,
    CdmTypeAttributeDefinition,
    copyOptions,
    Logger,
    OperationTypeConvertor,
    resolveOptions,
    StringUtils
} from '../../../internal';
import { TypeAttributePersistence } from '../TypeAttributePersistence';
import { OperationAddSupportingAttribute } from '../types';
import * as utils from '../utils';

/**
 * Operation AddSupportingAttribute persistence
 */
export class OperationAddSupportingAttributePersistence {
    public static fromData(ctx: CdmCorpusContext, object: OperationAddSupportingAttribute): CdmOperationAddSupportingAttribute {
        if (!object) {
            return undefined;
        }
        const addSupportingAttributeOp: CdmOperationAddSupportingAttribute = ctx.corpus.MakeObject<CdmOperationAddSupportingAttribute>(cdmObjectType.operationAddSupportingAttributeDef);

        if (object.$type && !StringUtils.equalsWithIgnoreCase(object.$type, OperationTypeConvertor.operationTypeToString(cdmOperationType.addSupportingAttribute))) {
            Logger.error(OperationAddSupportingAttributePersistence.name, ctx, `$type ${object.$type} is invalid for this operation.`);
        } else {
            addSupportingAttributeOp.type = cdmOperationType.addSupportingAttribute;
        }

        if (object.explanation) {
            addSupportingAttributeOp.explanation = object.explanation;
        }

        if (object.supportingAttribute) {
            addSupportingAttributeOp.supportingAttribute = utils.createAttribute(ctx, object.supportingAttribute) as CdmTypeAttributeDefinition;
        }

        return addSupportingAttributeOp;
    }

    public static toData(instance: CdmOperationAddSupportingAttribute, resOpt: resolveOptions, options: copyOptions): OperationAddSupportingAttribute {
        if (!instance) {
            return undefined;
        }

        return {
            $type: OperationTypeConvertor.operationTypeToString(cdmOperationType.addSupportingAttribute),
            explanation: instance.explanation,
            supportingAttribute: TypeAttributePersistence.toData(instance.supportingAttribute, resOpt, options)
        };
    }
}
