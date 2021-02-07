// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    CdmObjectReferenceBase,
    cdmObjectType,
    CdmPurposeDefinition,
    resolveOptions,
    VisitCallback
} from '../internal';

export class CdmPurposeReference extends CdmObjectReferenceBase {
    public static get objectType(): cdmObjectType {
        return cdmObjectType.purposeRef;
    }

    constructor(ctx: CdmCorpusContext, purpose: string | CdmPurposeDefinition, simpleReference: boolean) {
        super(ctx, purpose, simpleReference);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.purposeRef;
        }
        // return p.measure(bodyCode);
    }

    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.purposeRef;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public copyRefObject(resOpt: resolveOptions, refTo: string | CdmPurposeDefinition, simpleReference: boolean, host?: CdmObjectReferenceBase): CdmObjectReferenceBase {
        // let bodyCode = () =>
        {
            if (!host) {
                return new CdmPurposeReference(this.ctx, refTo, simpleReference);
            } else {
                return host.copyToHost(this.ctx, refTo, simpleReference);
            }
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public visitRef(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            return false;
        }
        // return p.measure(bodyCode);
    }
}
