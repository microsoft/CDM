// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmObjectType,
    CdmOperationReplaceAsForeignKey,
    CdmTypeAttributeDefinition,
    copyOptions,
    resolveOptions
} from '../../../internal';
import { TypeAttributePersistence } from '../TypeAttributePersistence';
import { OperationReplaceAsForeignKey } from '../types';
import * as utils from '../utils';
import { OperationBasePersistence } from './OperationBasePersistence';

/**
 * Operation ReplaceAsForeignKey persistence
 */
export class OperationReplaceAsForeignKeyPersistence {
    public static fromData(ctx: CdmCorpusContext, object: OperationReplaceAsForeignKey): CdmOperationReplaceAsForeignKey {
        if (!object) {
            return undefined;
        }

        const replaceAsForeignKeyOp: CdmOperationReplaceAsForeignKey = OperationBasePersistence.fromData(ctx, cdmObjectType.operationReplaceAsForeignKeyDef, object);
        replaceAsForeignKeyOp.reference = object.reference;
        replaceAsForeignKeyOp.replaceWith = utils.createAttribute(ctx, object.replaceWith) as CdmTypeAttributeDefinition;

        return replaceAsForeignKeyOp;
    }

    public static toData(instance: CdmOperationReplaceAsForeignKey, resOpt: resolveOptions, options: copyOptions): OperationReplaceAsForeignKey {
        if (!instance) {
            return undefined;
        }

        const data: OperationReplaceAsForeignKey = OperationBasePersistence.toData(instance, resOpt, options);
        data.reference = instance.reference;
        data.replaceWith = TypeAttributePersistence.toData(instance.replaceWith, resOpt, options);

        return data;
    }
}
