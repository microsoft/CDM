import {
    CdmConstantEntityDefinition,
    CdmCorpusContext,
    CdmEntityDefinition,
    CdmEntityReference,
    cdmObjectType,
    CdmTraitReference
} from '../../internal';
import { CdmFolder } from '..';
import { cdmObjectRefPersistence } from './cdmObjectRefPersistence';
import {
    ConstantEntity,
    Entity,
    EntityReference
} from './types';
import * as utils from './utils';

function isConstantEntity(object: Entity | ConstantEntity): object is ConstantEntity {
    return 'entityShape' in object;
}

export class EntityReferencePersistence extends cdmObjectRefPersistence {
    public static fromData(ctx: CdmCorpusContext, object: string | EntityReference): CdmEntityReference {
        if (!object) { return; }
        let simpleReference: boolean = true;
        let entity: string | CdmEntityDefinition | CdmConstantEntityDefinition;
        let appliedTraits: CdmTraitReference[];
        if (typeof (object) === 'string') {
            entity = object;
        } else {
            simpleReference = false;
            if (typeof (object.entityReference) === 'string') {
                entity = object.entityReference;
            } else if (isConstantEntity(object.entityReference)) {
                entity = CdmFolder.ConstantEntityPersistence.fromData(ctx, object.entityReference);
            } else {
                entity = CdmFolder.EntityPersistence.fromData(ctx, object.entityReference);
            }
        }

        const entityReference: CdmEntityReference = ctx.corpus.MakeRef(cdmObjectType.entityRef, entity, simpleReference);

        if (typeof (object) !== 'string') {
            appliedTraits = utils.createTraitReferenceArray(ctx, object.appliedTraits);
        }
        utils.addArrayToCdmCollection<CdmTraitReference>(entityReference.appliedTraits, appliedTraits);

        return entityReference;
    }
}
