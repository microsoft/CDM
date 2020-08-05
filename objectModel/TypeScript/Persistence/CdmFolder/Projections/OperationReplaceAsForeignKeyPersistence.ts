// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmObjectType,
    CdmOperationReplaceAsForeignKey,
    cdmOperationType,
    CdmTypeAttributeDefinition,
    copyOptions,
    Logger,
    OperationTypeConvertor,
    resolveOptions,
    StringUtils
} from '../../../internal';
import { TypeAttributePersistence } from '../TypeAttributePersistence';
import { OperationReplaceAsForeignKey } from '../types';
import * as utils from '../utils';

/**
 * Operation ReplaceAsForeignKey persistence
 */
export class OperationReplaceAsForeignKeyPersistence {
    public static fromData(ctx: CdmCorpusContext, object: OperationReplaceAsForeignKey): CdmOperationReplaceAsForeignKey {
        if (!object) {
            return undefined;
        }
        const replaceAsForeignKeyOp: CdmOperationReplaceAsForeignKey = ctx.corpus.MakeObject<CdmOperationReplaceAsForeignKey>(cdmObjectType.operationReplaceAsForeignKeyDef);

        if (object.$type && !StringUtils.equalsWithIgnoreCase(object.$type, OperationTypeConvertor.operationTypeToString(cdmOperationType.replaceAsForeignKey))) {
            Logger.error(OperationReplaceAsForeignKeyPersistence.name, ctx, `$type ${object.$type} is invalid for this operation.`);
        } else {
            replaceAsForeignKeyOp.type = cdmOperationType.replaceAsForeignKey;
        }

        if (object.explanation) {
            replaceAsForeignKeyOp.explanation = object.explanation;
        }

        replaceAsForeignKeyOp.reference = object.reference;

        if (object.replaceWith) {
            replaceAsForeignKeyOp.replaceWith = utils.createAttribute(ctx, object.replaceWith) as CdmTypeAttributeDefinition;
        }

        return replaceAsForeignKeyOp;
    }

    public static toData(instance: CdmOperationReplaceAsForeignKey, resOpt: resolveOptions, options: copyOptions): OperationReplaceAsForeignKey {
        if (!instance) {
            return undefined;
        }

        return {
            $type: OperationTypeConvertor.operationTypeToString(cdmOperationType.replaceAsForeignKey),
            explanation: instance.explanation,
            reference: instance.reference,
            replaceWith: TypeAttributePersistence.toData(instance.replaceWith, resOpt, options)
        };
    }
}
