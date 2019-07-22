import {
    CdmCorpusContext,
    CdmJsonType,
    cdmObject,
    cdmObjectRef,
    cdmObjectType,
    copyOptions,
    DataType,
    DataTypeImpl,
    DataTypeReference,
    resolveOptions,
    TraitReference,
    VisitCallback
} from '../internal';

export class DataTypeReferenceImpl extends cdmObjectRef {
    constructor(ctx: CdmCorpusContext, dataType: string | DataTypeImpl, simpleReference: boolean, appliedTraits: boolean) {
        super(ctx, dataType, simpleReference, appliedTraits);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.dataTypeRef;
        }
        // return p.measure(bodyCode);
    }

    public static instanceFromData(ctx: CdmCorpusContext, object: string | DataTypeReference): DataTypeReferenceImpl {
        // let bodyCode = () =>
        {
            let simpleReference: boolean = true;
            let dataType: string | DataTypeImpl;
            let appliedTraits: (string | TraitReference)[];
            if (typeof (object) === 'string') {
                dataType = object;
            } else {
                simpleReference = false;
                appliedTraits = object.appliedTraits;
                if (typeof (object.dataTypeReference) === 'string') {
                    dataType = object.dataTypeReference;
                } else {
                    dataType = DataTypeImpl.instanceFromData(ctx, object.dataTypeReference);
                }
            }

            const c: DataTypeReferenceImpl = new DataTypeReferenceImpl(ctx, dataType, simpleReference, !!appliedTraits);
            c.appliedTraits = cdmObject.createTraitReferenceArray(ctx, appliedTraits);

            return c;
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
    public copyRefData(resOpt: resolveOptions, copy: DataTypeReference, refTo: string | DataType, options: copyOptions): CdmJsonType {
        // let bodyCode = () =>
        {
            copy.dataTypeReference = refTo;

            return undefined;
        }
        // return p.measure(bodyCode);
    }
    public copyRefObject(resOpt: resolveOptions, refTo: string | DataTypeImpl, simpleReference: boolean): cdmObjectRef {
        // let bodyCode = () =>
        {
            return new DataTypeReferenceImpl(this.ctx, refTo, simpleReference, (this.appliedTraits && this.appliedTraits.length > 0));
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
}
