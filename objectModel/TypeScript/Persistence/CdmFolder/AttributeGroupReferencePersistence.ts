import {
    CdmAttributeGroupDefinition,
    CdmAttributeGroupReference,
    CdmCorpusContext,
    cdmObjectType
} from '../../internal';
import { CdmFolder } from '..';
import { cdmObjectRefPersistence } from './cdmObjectRefPersistence';
import { AttributeGroupReference } from './types';

export class AttributeGroupReferencePersistence extends cdmObjectRefPersistence {
    public static fromData(ctx: CdmCorpusContext, object: string | AttributeGroupReference): CdmAttributeGroupReference {
        if (!object) { return; }
        let simpleReference: boolean = true;
        let attributeGroup: string | CdmAttributeGroupDefinition;
        if (typeof (object) === 'string') {
            attributeGroup = object;
        } else {
            simpleReference = false;
            if (typeof (object.attributeGroupReference) === 'string') {
                attributeGroup = object.attributeGroupReference;
            } else {
                attributeGroup = CdmFolder.AttributeGroupPersistence.fromData(ctx, object.attributeGroupReference);
            }
        }

        return ctx.corpus.MakeRef(cdmObjectType.attributeGroupRef, attributeGroup, simpleReference);
    }
}
