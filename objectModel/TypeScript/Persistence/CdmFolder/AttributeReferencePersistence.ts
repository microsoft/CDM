// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmAttributeReference,
    CdmCorpusContext,
    cdmObjectType
} from '../../internal';
import { cdmObjectRefPersistence } from './cdmObjectRefPersistence';

export class AttributeReferencePersistence extends cdmObjectRefPersistence {
    public static fromData(ctx: CdmCorpusContext, object: string): CdmAttributeReference {
        if (!object) { return; }
        const simpleReference: boolean = true;
        const attribute: string  = object;

        return ctx.corpus.MakeRef(cdmObjectType.attributeRef, attribute, simpleReference);
    }
}
