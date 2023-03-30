// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmFolder } from '..';
import {
    CdmCorpusContext,
    cdmObjectType,
    CdmTraitDefinition,
    CdmTraitReference,
    CdmTraitReferenceBase
} from '../../internal';
import { cdmObjectRefPersistence } from './cdmObjectRefPersistence';
import {
    Argument,
    TraitReference
} from './types';
import * as utils from './utils';

export class TraitReferencePersistence extends cdmObjectRefPersistence {
    public static fromData(ctx: CdmCorpusContext, object: string | TraitReference): CdmTraitReference {
        if (!object) {
            return;
        }

        let simpleReference: boolean = true;
        let optional: boolean | undefined;
        let trait: string | CdmTraitDefinition;
        let args: (string | Argument)[];
        let trVerb: CdmTraitReference = undefined;
        let appliedTraits: Array<CdmTraitReferenceBase> = undefined;
        
        if (typeof (object) === 'string') {
            trait = object;
        } else {
            simpleReference = false;
            optional = object.optional;
            args = object.arguments;

            if (typeof (object.traitReference) === 'string') {
                trait = object.traitReference;
            } else {
                trait = CdmFolder.TraitPersistence.fromData(ctx, object.traitReference);
            }

            trVerb = TraitReferencePersistence.fromData(ctx, object.verb);
            appliedTraits = utils.createTraitReferenceArray(ctx, object.appliedTraits);
        }

        const traitReference: CdmTraitReference = ctx.corpus.MakeRef(cdmObjectType.traitRef, trait, simpleReference);

        if (optional !== undefined) {
            traitReference.optional = optional;
        }

        if (args) {
            args.forEach((a: (string | Argument)) => {
                traitReference.arguments.push(CdmFolder.ArgumentPersistence.fromData(ctx, a));
            });
        }
        
        traitReference.verb = trVerb;
        utils.addArrayToCdmCollection<CdmTraitReferenceBase>(traitReference.appliedTraits, appliedTraits);

        return traitReference;
    }
}
