// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmFolder } from '..';
import {
    CdmCorpusContext,
    cdmObjectType,
    CdmTraitDefinition,
    CdmTraitReference
} from '../../internal';
import { cdmObjectRefPersistence } from './cdmObjectRefPersistence';
import {
    Argument,
    TraitReference
} from './types';

export class TraitReferencePersistence extends cdmObjectRefPersistence {
    public static fromData(ctx: CdmCorpusContext, object: string | TraitReference): CdmTraitReference {
        if (!object) { return; }
        let simpleReference: boolean = true;
        let trait: string | CdmTraitDefinition;
        let args: (string | Argument)[];
        if (typeof (object) === 'string') {
            trait = object;
        } else {
            simpleReference = false;
            args = object.arguments;
            if (typeof (object.traitReference) === 'string') {
                trait = object.traitReference;
            } else {
                trait = CdmFolder.TraitPersistence.fromData(ctx, object.traitReference);
            }
        }

        const traitReference: CdmTraitReference = ctx.corpus.MakeRef(cdmObjectType.traitRef, trait, simpleReference);
        if (args) {
            args.forEach((a: (string | Argument)) => {
                traitReference.arguments.push(CdmFolder.ArgumentPersistence.fromData(ctx, a));
            });
        }

        return traitReference;
    }
}
