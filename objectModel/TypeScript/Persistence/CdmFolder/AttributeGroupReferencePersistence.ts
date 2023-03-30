// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmAttributeGroupDefinition,
    CdmAttributeGroupReference,
    CdmCorpusContext,
    cdmObjectType,
    CdmTraitReferenceBase
} from '../../internal';
import { CdmFolder } from '..';
import { cdmObjectRefPersistence } from './cdmObjectRefPersistence';
import { AttributeGroupReference } from './types';
import * as utils from './utils';

export class AttributeGroupReferencePersistence extends cdmObjectRefPersistence {
    public static fromData(ctx: CdmCorpusContext, object: string | AttributeGroupReference, entityName?: string): CdmAttributeGroupReference {
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
                attributeGroup = CdmFolder.AttributeGroupPersistence.fromData(ctx, object.attributeGroupReference, entityName);
            }
        }

        const attGroupReference: CdmAttributeGroupReference = ctx.corpus.MakeRef<CdmAttributeGroupReference>(cdmObjectType.attributeGroupRef, attributeGroup, simpleReference);

        // now with applied traits!
        let appliedTraits: Array<CdmTraitReferenceBase> = undefined;
        if (typeof (object) !== 'string') {
            appliedTraits = utils.createTraitReferenceArray(ctx, object.appliedTraits);
        }
        utils.addArrayToCdmCollection<CdmTraitReferenceBase>(attGroupReference.appliedTraits, appliedTraits);

        return attGroupReference;
    }
}
