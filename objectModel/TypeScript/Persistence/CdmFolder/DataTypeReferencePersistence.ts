// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    CdmDataTypeDefinition,
    CdmDataTypeReference,
    cdmObjectType,
    CdmTraitReferenceBase
} from '../../internal';
import { CdmFolder } from '..';
import { cdmObjectRefPersistence } from './cdmObjectRefPersistence';
import {
    DataTypeReference
} from './types';
import * as utils from './utils';

export class DataTypeReferencePersistence extends cdmObjectRefPersistence {
    public static fromData(ctx: CdmCorpusContext, object: string | DataTypeReference): CdmDataTypeReference {
        if (!object) {
            return;
        }

        let simpleReference: boolean = true;
        let optional: boolean | undefined;
        let dataType: string | CdmDataTypeDefinition;
        let appliedTraits: CdmTraitReferenceBase[];

        if (typeof (object) === 'string') {
            dataType = object;
        } else {
            simpleReference = false;
            optional = object.optional;

            if (typeof (object.dataTypeReference) === 'string') {
                dataType = object.dataTypeReference;
            } else {
                dataType = CdmFolder.DataTypePersistence.fromData(ctx, object.dataTypeReference);
            }
        }

        const dataTypeReference: CdmDataTypeReference = ctx.corpus.MakeRef(cdmObjectType.dataTypeRef, dataType, simpleReference);

        if (optional !== undefined) {
            dataTypeReference.optional = optional; 
        }

        if (typeof (object) !== 'string') {
            appliedTraits = utils.createTraitReferenceArray(ctx, object.appliedTraits);
        }
        utils.addArrayToCdmCollection<CdmTraitReferenceBase>(dataTypeReference.appliedTraits, appliedTraits);

        return dataTypeReference;
    }
}
