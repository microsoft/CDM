// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmObjectType,
    CdmOperationAddTypeAttribute,
    cdmOperationType,
    CdmTypeAttributeDefinition,
    copyOptions,
    Logger,
    OperationTypeConvertor,
    resolveOptions,
    StringUtils
} from '../../../internal';
import { TypeAttributePersistence } from '../TypeAttributePersistence';
import { OperationAddTypeAttribute } from '../types';
import * as utils from '../utils';

/**
 * Operation AddTypeAttribute persistence
 */
export class OperationAddTypeAttributePersistence {
    public static fromData(ctx: CdmCorpusContext, object: OperationAddTypeAttribute): CdmOperationAddTypeAttribute {
        if (!object) {
            return undefined;
        }
        const addTypeAttributeOp: CdmOperationAddTypeAttribute = ctx.corpus.MakeObject<CdmOperationAddTypeAttribute>(cdmObjectType.operationAddTypeAttributeDef);

        if (object.$type && !StringUtils.equalsWithIgnoreCase(object.$type, OperationTypeConvertor.operationTypeToString(cdmOperationType.addTypeAttribute))) {
            Logger.error(OperationAddTypeAttributePersistence.name, ctx, `$type ${object.$type} is invalid for this operation.`);
        } else {
            addTypeAttributeOp.type = cdmOperationType.addTypeAttribute;
        }

        if (object.explanation) {
            addTypeAttributeOp.explanation = object.explanation;
        }

        if (object.typeAttribute) {
            addTypeAttributeOp.typeAttribute = utils.createAttribute(ctx, object.typeAttribute) as CdmTypeAttributeDefinition;
        }

        return addTypeAttributeOp;
    }

    public static toData(instance: CdmOperationAddTypeAttribute, resOpt: resolveOptions, options: copyOptions): OperationAddTypeAttribute {
        if (!instance) {
            return undefined;
        }

        return {
            $type: OperationTypeConvertor.operationTypeToString(cdmOperationType.addTypeAttribute),
            explanation: instance.explanation,
            typeAttribute: TypeAttributePersistence.toData(instance.typeAttribute, resOpt, options)
        };
    }
}
