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
    public copyRefObject(resOpt: resolveOptions, refTo: string, simpleReference: boolean, host?: CdmObjectReferenceBase): CdmObjectReferenceBase {
        if (!host) {
            return new CdmAttributeContextReference(this.ctx, refTo);
        } else {
            return host.copyToHost(this.ctx, refTo, simpleReference);
        }
    }
    public visitRef(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        return false;
    }
}
