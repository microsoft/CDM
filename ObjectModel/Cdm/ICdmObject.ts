import {
    AttributeContextParameters,
    CdmCorpusContext,
    CdmJsonType,
    cdmObjectType,
    copyOptions,
    friendlyFormatNode,
    ICdmDocumentDef,
    ICdmObjectDef,
    ICdmObjectRef,
    ResolvedAttributeSet,
    ResolvedTraitSet,
    resolveOptions,
    VisitCallback
} from '../internal';

export interface ICdmObject {
    ID: number;
    ctx: CdmCorpusContext;
    declaredInDocument: ICdmDocumentDef;
    objectType: cdmObjectType;
    visit(path: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean;
    validate(): boolean;
    getObjectType(): cdmObjectType;
    getObjectDef(resOpt: resolveOptions): ICdmObjectDef;
    getObjectDefName(): string;
    copyData(resOpt: resolveOptions, options?: copyOptions): CdmJsonType;
    getResolvedTraits(resOpt: resolveOptions): ResolvedTraitSet;
    getResolvedAttributes(resOpt: resolveOptions, acpInContext?: AttributeContextParameters): ResolvedAttributeSet;
    copy(resOpt: resolveOptions): ICdmObject;
    getFriendlyFormat(): friendlyFormatNode;
    createSimpleReference(resOpt: resolveOptions): ICdmObjectRef;
}
