// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    CdmDataTypeDefinition,
    CdmObjectReferenceBase,
    cdmObjectType,
    resolveOptions,
    VisitCallback
} from '../internal';

export class CdmDataTypeReference extends CdmObjectReferenceBase implements CdmDataTypeReference {
    public static get objectType(): cdmObjectType {
        return cdmObjectType.dataTypeRef;
    }

    constructor(ctx: CdmCorpusContext, dataType: string | CdmDataTypeDefinition, simpleReference: boolean) {
        super(ctx, dataType, simpleReference);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.dataTypeRef;
        }
        // return p.measure(bodyCode);
    }

    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.dataTypeRef;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public copyRefObject(resOpt: resolveOptions, refTo: string | CdmDataTypeDefinition, simpleReference: boolean, host?: CdmObjectReferenceBase): CdmObjectReferenceBase {
        // let bodyCode = () =>
        {
            if (!host) {
                return new CdmDataTypeReference(this.ctx, refTo, simpleReference);
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
