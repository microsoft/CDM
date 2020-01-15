import {
    CdmCorpusContext,
    cdmObjectType,
    CdmPurposeDefinition,
    CdmPurposeReference,
    CdmTraitReference
} from '../../internal';
import { CdmFolder } from '..';
import { cdmObjectRefPersistence } from './cdmObjectRefPersistence';
import {
    PurposeReference
} from './types';
import * as utils from './utils';

export class PurposeReferencePersistence extends cdmObjectRefPersistence {
    public static fromData(ctx: CdmCorpusContext, object: string | PurposeReference): CdmPurposeReference {
        if (!object) { return; }
        let simpleReference: boolean = true;
        let appliedTraits: CdmTraitReference[];
        let purpose: string | CdmPurposeDefinition;
        if (typeof (object) === 'string') {
            purpose = object;
        } else {
            simpleReference = false;
            if (typeof (object.purposeReference) === 'string') {
                purpose = object.purposeReference;
            } else {
                purpose = CdmFolder.PurposePersistence.fromData(ctx, object.purposeReference);
            }
        }

        const purposeReference: CdmPurposeReference = ctx.corpus.MakeRef(cdmObjectType.purposeRef, purpose, simpleReference);
        if (typeof (object) !== 'string') {
            appliedTraits = utils.createTraitReferenceArray(ctx, object.appliedTraits);
        }
        utils.addArrayToCdmCollection<CdmTraitReference>(purposeReference.appliedTraits, appliedTraits);

        return purposeReference;
    }
}
