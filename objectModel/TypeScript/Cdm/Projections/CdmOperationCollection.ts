// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCollection,
    CdmCorpusContext,
    CdmObject,
    cdmObjectType,
    CdmOperationBase
} from '../../internal';

export class CdmOperationCollection extends CdmCollection<CdmOperationBase> {
    constructor(ctx: CdmCorpusContext, owner: CdmObject) {
        super(ctx, owner, cdmObjectType.error);
    }

    public push(operation: CdmOperationBase): CdmOperationBase {
        return super.push(operation);
    }

    public remove(operation: CdmOperationBase): boolean {
        return super.remove(operation);
    }
}
