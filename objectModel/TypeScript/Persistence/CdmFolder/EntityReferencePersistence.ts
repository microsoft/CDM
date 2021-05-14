// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmFolder } from '..';
import {
    CdmConstantEntityDefinition,
    CdmCorpusContext,
    CdmEntityDefinition,
    CdmEntityReference,
    cdmObjectType,
    CdmProjection,
    CdmTraitReferenceBase,
    copyOptions,
    resolveOptions
} from '../../internal';
import { cdmObjectRefPersistence } from './cdmObjectRefPersistence';
import { ProjectionPersistence } from './Projections/ProjectionPersistence';
import {
    ConstantEntity,
    Entity,
    EntityReferenceDefinition,
    Projection
} from './types';
import * as utils from './utils';

function isConstantEntity(object: Entity | ConstantEntity): object is ConstantEntity {
    return 'entityShape' in object;
}

export class EntityReferencePersistence extends cdmObjectRefPersistence {
    public static fromData(ctx: CdmCorpusContext, object: string | EntityReferenceDefinition | Projection): CdmEntityReference {
        if (!object) {
            return;
        }

        let simpleReference: boolean = true;
        let entity: string | CdmEntityDefinition | CdmConstantEntityDefinition | CdmProjection;
        let appliedTraits: CdmTraitReferenceBase[];
        
        if (typeof (object) === 'string') {
            entity = object;
        } else {
            simpleReference = false;
            entity = this.getEntityReference(ctx, object);
        }

        const entityReference: CdmEntityReference = ctx.corpus.MakeRef(cdmObjectType.entityRef, entity, simpleReference);

        if (typeof (object) !== 'string' && 'appliedTraits' in object) {
            appliedTraits = utils.createTraitReferenceArray(ctx, object.appliedTraits);
        }
        if (appliedTraits) {
            utils.addArrayToCdmCollection<CdmTraitReferenceBase>(entityReference.appliedTraits, appliedTraits);
        }

        return entityReference;
    }

    public static toData(instance: CdmEntityReference, resOpt: resolveOptions, options: copyOptions): any {
        if (instance.explicitReference !== undefined && instance.explicitReference instanceof CdmProjection) {
            return ProjectionPersistence.toData(instance.explicitReference as CdmProjection, resOpt, options) as Projection;
        }
        else {
            return cdmObjectRefPersistence.toData(instance, resOpt, options);
        }
    }

    private static getEntityReference(ctx: CdmCorpusContext, object: any): string | CdmEntityDefinition | CdmConstantEntityDefinition | CdmProjection {
        let entity: any = undefined;
        if ('entityReference' in object) {
            if (typeof (object.entityReference) === 'string') {
                entity = object.entityReference;
            } else if (isConstantEntity(object.entityReference)) {
                entity = CdmFolder.ConstantEntityPersistence.fromData(ctx, object.entityReference);
            } else {
                entity = CdmFolder.EntityPersistence.fromData(ctx, object.entityReference);
            }
        } else if ('source' in object || 'operations' in object) {
            entity = ProjectionPersistence.fromData(ctx, object);
        }

        return entity;
    }
}
