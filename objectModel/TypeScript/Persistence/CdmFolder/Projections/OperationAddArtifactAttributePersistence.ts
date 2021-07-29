// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmObjectType,
    CdmOperationAddArtifactAttribute,
    copyOptions,
    resolveOptions,
} from '../../../internal';
import { OperationAddArtifactAttribute } from '../types';
import * as utils from '../utils';
import { OperationBasePersistence } from './OperationBasePersistence';
import { PersistenceLayer } from '../../../Persistence';

/**
 * Operation AddArtifactAttribute persistence
 */
export class OperationAddArtifactAttributePersistence {
    private static TAG: string = OperationAddArtifactAttributePersistence.name;

    public static fromData(ctx: CdmCorpusContext, object: OperationAddArtifactAttribute): CdmOperationAddArtifactAttribute {
        if (!object) {
            return undefined;
        }

        const alterTraitsOp: CdmOperationAddArtifactAttribute = OperationBasePersistence.fromData(ctx, cdmObjectType.operationAddArtifactAttributeDef, object);
        alterTraitsOp.newAttribute = utils.createAttribute(ctx, object.newAttribute);
        alterTraitsOp.insertAtTop = object.insertAtTop;

        return alterTraitsOp;
    }

    public static toData(instance: CdmOperationAddArtifactAttribute, resOpt: resolveOptions, options: copyOptions): OperationAddArtifactAttribute {
        if (!instance) {
            return undefined;
        }

        const data: OperationAddArtifactAttribute = OperationBasePersistence.toData(instance, resOpt, options);
        data.newAttribute = PersistenceLayer.toData(instance.newAttribute, resOpt, options, 'CdmFolder');
        data.insertAtTop = instance.insertAtTop;

        return data;
    }
}
