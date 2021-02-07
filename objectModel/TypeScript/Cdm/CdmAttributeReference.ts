// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmAttribute,
    CdmCorpusContext,
    CdmObjectReferenceBase,
    cdmObjectType,
    resolveOptions,
    VisitCallback
} from '../internal';

export class CdmAttributeReference extends CdmObjectReferenceBase {
    public static get objectType(): cdmObjectType {
        return CdmAttributeReference.objectType;
    }

    constructor(ctx: CdmCorpusContext, attribute: string | CdmAttribute, simpleReference: boolean) {
        super(ctx, attribute, simpleReference);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.attributeRef;
        }
        // return p.measure(bodyCode);
    }

    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.attributeRef;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public copyRefObject(resOpt: resolveOptions, refTo: string | CdmAttribute, simpleReference: boolean, host?: CdmObjectReferenceBase): CdmObjectReferenceBase {
        // let bodyCode = () =>
        {
            if (!host) {
                return new CdmAttributeReference(this.ctx, refTo, simpleReference);
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
