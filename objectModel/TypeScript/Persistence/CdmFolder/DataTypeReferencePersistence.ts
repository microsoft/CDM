import {
    CdmCorpusContext,
    CdmDataTypeDefinition,
    CdmDataTypeReference,
    cdmObjectType,
    CdmTraitReference
} from '../../internal';
import { CdmFolder } from '..';
import { cdmObjectRefPersistence } from './cdmObjectRefPersistence';
import {
    DataTypeReference
} from './types';
import * as utils from './utils';

export class DataTypeReferencePersistence extends cdmObjectRefPersistence {
    public static fromData(ctx: CdmCorpusContext, object: string | DataTypeReference): CdmDataTypeReference {
        if (!object) { return; }
        let simpleReference: boolean = true;
        let dataType: string | CdmDataTypeDefinition;
        let appliedTraits: CdmTraitReference[];
        if (typeof (object) === 'string') {
            dataType = object;
        } else {
            simpleReference = false;
            if (typeof (object.dataTypeReference) === 'string') {
                dataType = object.dataTypeReference;
            } else {
                dataType = CdmFolder.DataTypePersistence.fromData(ctx, object.dataTypeReference);
            }
        }

        const dataTypeReference: CdmDataTypeReference = ctx.corpus.MakeRef(cdmObjectType.dataTypeRef, dataType, simpleReference);

        if (typeof (object) !== 'string') {
            appliedTraits = utils.createTraitReferenceArray(ctx, object.appliedTraits);
        }
        utils.addArrayToCdmCollection<CdmTraitReference>(dataTypeReference.appliedTraits, appliedTraits);

        return dataTypeReference;
    }
}
