// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmAttributeContextReference,
    CdmCorpusContext,
    cdmObjectType
} from '../../internal';
import { cdmObjectRefPersistence } from './cdmObjectRefPersistence';

export class AttributeContextReferencePersistence extends cdmObjectRefPersistence {
    public static fromData(ctx: CdmCorpusContext, object: any): CdmAttributeContextReference {
        if (!(typeof object === 'string')) { return; }

        return ctx.corpus.MakeRef(cdmObjectType.attributeContextRef, object, undefined);
    }
}
