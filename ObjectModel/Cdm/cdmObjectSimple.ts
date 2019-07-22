import {
    CdmCorpusContext,
    cdmObject,
    ICdmObjectDef,
    ICdmObjectRef,
    resolveOptions
} from '../internal';

// some objects are just to structure other obje
export abstract class cdmObjectSimple extends cdmObject {
    public constructor(ctx: CdmCorpusContext) {
        super(ctx);
    }
    public getObjectDefName(): string {
        return undefined;
    }
    public getObjectDef(resOpt: resolveOptions) {
        return undefined;
    }
    public createSimpleReference(resOpt: resolveOptions): ICdmObjectRef {
        return undefined;
    }
}
