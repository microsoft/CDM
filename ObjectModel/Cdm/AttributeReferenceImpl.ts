import {
    AttributeImpl,
    CdmCorpusContext,
    CdmJsonType,
    cdmObject,
    cdmObjectRef,
    cdmObjectType,
    copyOptions,
    resolveOptions,
    VisitCallback
} from '../internal';

export class AttributeReferenceImpl extends cdmObjectRef {
    constructor(ctx: CdmCorpusContext, attribute: string | AttributeImpl, simpleReference: boolean) {
        super(ctx, attribute, simpleReference, false);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.attributeRef;
        }
        // return p.measure(bodyCode);
    }

    public static instanceFromData(ctx: CdmCorpusContext, object: string): AttributeReferenceImpl {
        // let bodyCode = () =>
        {
            let simpleReference: boolean = true;
            let attribute: string | AttributeImpl;
            if (typeof (object) === 'string') {
                attribute = object;
            } else {
                simpleReference = false;
                attribute = cdmObject.createAttribute(ctx, object) as AttributeImpl;
            }

            return new AttributeReferenceImpl(ctx, attribute, simpleReference);
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
    public copyRefData(resOpt: resolveOptions, copy: AttributeImpl, refTo: CdmJsonType, options: copyOptions): CdmJsonType {
        // let bodyCode = () =>
        {
            // there is no persisted object wrapper
            return undefined;
        }
        // return p.measure(bodyCode);
    }
    public copyRefObject(resOpt: resolveOptions, refTo: string | AttributeImpl, simpleReference: boolean): cdmObjectRef {
        // let bodyCode = () =>
        {
            return new AttributeReferenceImpl(this.ctx, refTo, simpleReference);
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
