import {
    AttributeGroup,
    AttributeGroupImpl,
    AttributeGroupReference,
    CdmCorpusContext,
    CdmJsonType,
    cdmObjectDef,
    cdmObjectRef,
    cdmObjectType,
    copyOptions,
    ICdmAttributeGroupRef,
    ICdmTraitRef,
    ResolvedEntityReferenceSet,
    resolveOptions,
    VisitCallback
} from '../internal';

export class AttributeGroupReferenceImpl extends cdmObjectRef implements ICdmAttributeGroupRef {
    constructor(ctx: CdmCorpusContext, attributeGroup: string | AttributeGroupImpl, simpleReference: boolean) {
        super(ctx, attributeGroup, simpleReference, false);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.attributeGroupRef;
        }
        // return p.measure(bodyCode);
    }

    public static instanceFromData(ctx: CdmCorpusContext, object: string | AttributeGroupReference): AttributeGroupReferenceImpl {
        // let bodyCode = () =>
        {
            let simpleReference: boolean = true;
            let attributeGroup: string | AttributeGroupImpl;
            if (typeof (object) === 'string') {
                attributeGroup = object;
            } else {
                simpleReference = false;
                if (typeof (object.attributeGroupReference) === 'string') {
                    attributeGroup = object.attributeGroupReference;
                } else {
                    attributeGroup = AttributeGroupImpl.instanceFromData(ctx, object.attributeGroupReference);
                }
            }

            return new AttributeGroupReferenceImpl(ctx, attributeGroup, simpleReference);
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

    public copyRefData(resOpt: resolveOptions, copy: AttributeGroupReference,
                       refTo: string | AttributeGroup, options: copyOptions): CdmJsonType {
        // let bodyCode = () =>
        {
            copy.attributeGroupReference = refTo;

            return undefined;
        }
        // return p.measure(bodyCode);
    }

    public copyRefObject(resOpt: resolveOptions, refTo: string | AttributeGroupImpl, simpleReference: boolean): cdmObjectRef {
        // let bodyCode = () =>
        {
            return new AttributeGroupReferenceImpl(this.ctx, refTo, simpleReference);
        }
        // return p.measure(bodyCode);
    }

    public getAppliedTraitRefs(): ICdmTraitRef[] {
        // let bodyCode = () =>
        {
            return undefined;
        }
        // return p.measure(bodyCode);
    }

    public visitRef(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            return false;
        }
        // return p.measure(bodyCode);
    }

    public getResolvedEntityReferences(resOpt: resolveOptions): ResolvedEntityReferenceSet {
        // let bodyCode = () =>
        {
            const ref: cdmObjectDef = this.getResolvedReference(resOpt);
            if (ref) {
                return (ref as AttributeGroupImpl).getResolvedEntityReferences(resOpt);
            }
            if (this.explicitReference) {
                return (this.explicitReference as AttributeGroupImpl).getResolvedEntityReferences(resOpt);
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }

}
