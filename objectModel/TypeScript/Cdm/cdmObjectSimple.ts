// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    CdmObjectBase,
    CdmObjectDefinition,
    CdmObjectReference,
    resolveOptions
} from '../internal';

// some objects are just to structure other obje
export abstract class cdmObjectSimple extends CdmObjectBase {
    public constructor(ctx: CdmCorpusContext) {
        super(ctx);
    }
    public fetchObjectDefinition<T extends CdmObjectDefinition>(resOpt: resolveOptions): T {
        return undefined;
    }
    public createSimpleReference(resOpt: resolveOptions): CdmObjectReference {
        return undefined;
    }
    /**
     * @internal
     */
    public createPortableReference(resOpt: resolveOptions): CdmObjectReference {
        return undefined;
    }
    public isDerivedFrom(baseDef: string, resOpt: resolveOptions): boolean {
        return false;
    }
}
