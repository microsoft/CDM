// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmObjectType,
    CdmOperationRenameAttributes,
    cdmOperationType,
    copyOptions,
    Logger,
    OperationTypeConvertor,
    resolveOptions,
    StringUtils
} from '../../../internal';
import { OperationRenameAttributes } from '../types';

/**
 * Operation RenameAttributes persistence
 */
export class OperationRenameAttributesPersistence {
    public static fromData(ctx: CdmCorpusContext, object: OperationRenameAttributes): CdmOperationRenameAttributes {
        if (!object) {
            return undefined;
        }
        const renameAttributesOp: CdmOperationRenameAttributes = ctx.corpus.MakeObject<CdmOperationRenameAttributes>(cdmObjectType.operationRenameAttributesDef);

        if (object.$type && !StringUtils.equalsWithIgnoreCase(object.$type, OperationTypeConvertor.operationTypeToString(cdmOperationType.renameAttributes))) {
            Logger.error(OperationRenameAttributesPersistence.name, ctx, `$type ${object.$type} is invalid for this operation.`);
        } else {
            renameAttributesOp.type = cdmOperationType.renameAttributes;
        }

        if (object.explanation) {
            renameAttributesOp.explanation = object.explanation;
        }

        renameAttributesOp.renameFormat = object.renameFormat;
        renameAttributesOp.applyTo = object.applyTo;

        return renameAttributesOp;
    }

    public static toData(instance: CdmOperationRenameAttributes, resOpt: resolveOptions, options: copyOptions): OperationRenameAttributes {
        if (!instance) {
            return undefined;
        }

        return {
            $type: OperationTypeConvertor.operationTypeToString(cdmOperationType.renameAttributes),
            explanation: instance.explanation,
            renameFormat: instance.renameFormat,
            applyTo: instance.applyTo
        };
    }
}
