import {
    AttributeGroupReference,
    CdmCorpusContext,
    CdmJsonType,
    cdmObjectRef,
    cdmObjectType,
    copyOptions,
    ICdmTraitRef,
    resolveOptions,
    VisitCallback
} from '../internal';

export class AttributeContextReferenceImpl extends cdmObjectRef {
    constructor(ctx: CdmCorpusContext, name: string) {
        super(ctx, name, true, false);
        this.objectType = cdmObjectType.attributeContextRef;
    }
    public static instanceFromData(ctx: CdmCorpusContext, object: string): AttributeContextReferenceImpl {
        if (typeof (object) === 'string') {
            return new AttributeContextReferenceImpl(ctx, object);
        }

        return undefined;
    }
    public getObjectType(): cdmObjectType {
        return cdmObjectType.attributeContextRef;
    }
    public copyRefData(resOpt: resolveOptions, copy: AttributeGroupReference, refTo: CdmJsonType, options: copyOptions): CdmJsonType {
        return undefined;
    }

    public copyRefObject(resOpt: resolveOptions, refTo: string, simpleReference: boolean): cdmObjectRef {
        return new AttributeContextReferenceImpl(this.ctx, refTo);
    }
    public getAppliedTraitRefs(): ICdmTraitRef[] {
        return undefined;
    }
    public visitRef(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        return false;
    }
}
