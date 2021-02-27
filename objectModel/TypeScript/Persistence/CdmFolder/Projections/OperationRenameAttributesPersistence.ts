// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmObjectType,
    CdmOperationRenameAttributes,
    copyOptions,
    Logger,
    resolveOptions,
} from '../../../internal';
import { OperationRenameAttributes } from '../types';
import { OperationBasePersistence } from './OperationBasePersistence';

/**
 * Operation RenameAttributes persistence
 */
export class OperationRenameAttributesPersistence {
    public static fromData(ctx: CdmCorpusContext, object: OperationRenameAttributes): CdmOperationRenameAttributes {
        if (!object) {
            return undefined;
        }

        const renameAttributesOp: CdmOperationRenameAttributes = OperationBasePersistence.fromData(ctx, cdmObjectType.operationRenameAttributesDef, object);
        renameAttributesOp.renameFormat = object.renameFormat;

        if (typeof (object.applyTo) === 'string') {
            renameAttributesOp.applyTo = [object.applyTo]
        } else if (Array.isArray(object.applyTo)) {
            renameAttributesOp.applyTo = object.applyTo;
        } else if (object.applyTo !== undefined) {
            Logger.error(OperationRenameAttributes.name, ctx, 'Unsupported: applyTo property type should be string or List<string>.');
        }

        return renameAttributesOp;
    }

    public static toData(instance: CdmOperationRenameAttributes, resOpt: resolveOptions, options: copyOptions): OperationRenameAttributes {
        if (!instance) {
            return undefined;
        }

        const data: OperationRenameAttributes = OperationBasePersistence.toData(instance, resOpt, options);
        data.renameFormat = instance.renameFormat;
        data.applyTo = instance.applyTo;

        return data;
    }
}
