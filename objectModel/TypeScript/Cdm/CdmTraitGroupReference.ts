// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    CdmObjectReferenceBase,
    cdmObjectType,
    resolveOptions,
    VisitCallback,
    CdmTraitReferenceBase,
    CdmTraitGroupDefinition
} from '../internal';

export class CdmTraitGroupReference extends CdmTraitReferenceBase {

    constructor(ctx: CdmCorpusContext, traitGroup: string | CdmTraitGroupDefinition, simpleReference: boolean) {
        super(ctx, traitGroup, simpleReference);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.traitGroupRef;
        }
        // return p.measure(bodyCode);
    }

    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.traitGroupRef;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public copyRefObject(resOpt: resolveOptions, refTo: string | CdmTraitGroupDefinition, simpleReference: boolean, host?: CdmObjectReferenceBase): CdmObjectReferenceBase {
        // let bodyCode = () =>
        {
            if (host === undefined)
                return new CdmTraitGroupReference(this.ctx, refTo, simpleReference);
            else
                return host.copyToHost(this.ctx, refTo, simpleReference);
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
     public visitRef(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean
        // let bodyCode = () =>
        {
            return false;
        }
        // return p.measure(bodyCode);
    }
