// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    CdmObjectReferenceBase,
    cdmObjectType,
    resolveOptions,
    VisitCallback
} from '../internal';

export class CdmAttributeContextReference extends CdmObjectReferenceBase {
    public static get objectType(): cdmObjectType {
        return cdmObjectType.attributeContextRef;
    }

    constructor(ctx: CdmCorpusContext, name: string) {
        super(ctx, name, true);
        this.objectType = cdmObjectType.attributeContextRef;
    }

    public getObjectType(): cdmObjectType {
        return cdmObjectType.attributeContextRef;
    }

    /**
     * @internal
     */
    public copyRefObject(resOpt: resolveOptions, refTo: string, simpleReference: boolean, host?: CdmObjectReferenceBase): CdmObjectReferenceBase {
        if (!host) {
            return new CdmAttributeContextReference(this.ctx, refTo);
        } else {
            return host.copyToHost(this.ctx, refTo, simpleReference);
        }
    }

    /**
     * @internal
     */
    public visitRef(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        return false;
    }
}
