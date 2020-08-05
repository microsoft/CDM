// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmAttributeGroupDefinition,
    CdmAttributeItem,
    CdmCorpusContext,
    CdmObject,
    CdmObjectReferenceBase,
    cdmObjectType,
    ResolvedEntityReferenceSet,
    resolveOptions,
    VisitCallback
} from '../internal';

export class CdmAttributeGroupReference extends CdmObjectReferenceBase implements CdmAttributeItem {
    public static get objectType(): cdmObjectType {
        return cdmObjectType.attributeGroupRef;
    }

    constructor(ctx: CdmCorpusContext, attributeGroup: string | CdmAttributeGroupDefinition, simpleReference: boolean) {
        super(ctx, attributeGroup, simpleReference);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.attributeGroupRef;
        }
        // return p.measure(bodyCode);
    }

    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.attributeGroupRef;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public copyRefObject(resOpt: resolveOptions, refTo: string | CdmAttributeGroupDefinition, simpleReference: boolean, host?: CdmObjectReferenceBase): CdmObjectReferenceBase {
        // let bodyCode = () =>
        {
            if (!host) {
                // for inline attribute group definition, the owner information is lost here when a ref object created
                // updating it here
                if (this.explicitReference && this.explicitReference.objectType === cdmObjectType.attributeGroupDef && !this.explicitReference.owner) {
                    this.explicitReference.owner = this.owner;
                }

                return new CdmAttributeGroupReference(this.ctx, refTo, simpleReference);
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

    public fetchResolvedEntityReference(resOpt?: resolveOptions): ResolvedEntityReferenceSet {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
            }

            const ref: CdmObject = this.fetchResolvedReference(resOpt);
            if (ref) {
                return (ref as CdmAttributeGroupDefinition).fetchResolvedEntityReference(resOpt);
            }
            if (this.explicitReference) {
                return (this.explicitReference as CdmAttributeGroupDefinition).fetchResolvedEntityReference(resOpt);
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }

}
