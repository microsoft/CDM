// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmObjectType,
    CdmPurposeDefinition,
    CdmPurposeReference,
    CdmTraitGroupReference,
    CdmTraitReference,
    CdmTraitReferenceBase
} from '../../internal';
import { CdmFolder } from '..';
import { cdmObjectRefPersistence } from './cdmObjectRefPersistence';
import {
    PurposeReference
} from './types';
import * as utils from './utils';

export class PurposeReferencePersistence extends cdmObjectRefPersistence {
    public static fromData(ctx: CdmCorpusContext, object: string | PurposeReference): CdmPurposeReference {
        if (!object) {
            return;
        }

        let simpleReference: boolean = true;
        let optional: boolean | undefined;
        let appliedTraits: (CdmTraitReference | CdmTraitGroupReference)[];
        let purpose: string | CdmPurposeDefinition;
        
        if (typeof (object) === 'string') {
            purpose = object;
        } else {
            simpleReference = false;
            optional = object.optional;

            if (typeof (object.purposeReference) === 'string') {
                purpose = object.purposeReference;
            } else {
                purpose = CdmFolder.PurposePersistence.fromData(ctx, object.purposeReference);
            }
        }

        const purposeReference: CdmPurposeReference = ctx.corpus.MakeRef(cdmObjectType.purposeRef, purpose, simpleReference);

        if (optional !== undefined) {
            purposeReference.optional = optional;
        }

        if (typeof (object) !== 'string') {
            appliedTraits = utils.createTraitReferenceArray(ctx, object.appliedTraits);
        }
        utils.addArrayToCdmCollection<CdmTraitReferenceBase>(purposeReference.appliedTraits, appliedTraits);

        return purposeReference;
    }
}
