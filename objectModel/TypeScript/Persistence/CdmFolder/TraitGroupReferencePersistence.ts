// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmFolder } from '..';
import {
    CdmCorpusContext,
    cdmObjectType,
    CdmTraitGroupDefinition,
    CdmTraitGroupReference
} from '../../internal';
import { cdmObjectRefPersistence } from './cdmObjectRefPersistence';
import {
    TraitGroupReference,
} from './types';

export class TraitGroupReferencePersistence extends cdmObjectRefPersistence {
    public static fromData(ctx: CdmCorpusContext, object: TraitGroupReference): CdmTraitGroupReference {
        // Note: Trait group reference by definition cannot be specified as a simple named reference
        
        if (!object || !object.traitGroupReference) {
            return;
        }

        let optional: boolean | undefined;
        let traitGroup: string | CdmTraitGroupDefinition;
        
        optional = object.optional;

        if (typeof (object.traitGroupReference) === 'string') {
            traitGroup = object.traitGroupReference;
        } else {
            traitGroup = CdmFolder.TraitGroupPersistence.fromData(ctx, object.traitGroupReference);
        }

        const traitGroupReference: CdmTraitGroupReference = ctx.corpus.MakeRef(cdmObjectType.traitGroupRef, traitGroup, false);

        if (optional !== undefined) {
            traitGroupReference.optional = optional;
        }

        return traitGroupReference;
    }
}
