import {
    cdmObjectType,
    cdmStatusLevel,
    cdmValidationStep,
    ICdmDocumentDef,
    ICdmFolderDef,
    ICdmObject,
    ICdmObjectDef,
    ICdmObjectRef,
    ICdmProfiler,
    resolveOptions,
    RptCallback
} from '../internal';

export interface ICdmCorpusDef extends ICdmFolderDef {
    rootPath: string;
    profiler: ICdmProfiler; // internal use
    MakeObject<T extends ICdmObject>(ofType: cdmObjectType, nameOrRef?: string, simmpleNameRef?: boolean): T;
    MakeRef(ofType: cdmObjectType, refObj: string | ICdmObjectDef, simpleNameRef: boolean): ICdmObjectRef;
    getObjectFromCorpusPath(objectPath: string): ICdmObject;
    setResolutionCallback(status: RptCallback, reportAtLevel?: cdmStatusLevel, errorAtLevel?: cdmStatusLevel): void;
    resolveImports(importResolver: (corpusPath: string) => Promise<[string, string]>): Promise<boolean>;
    addDocumentFromContent(corpusPath: string, content: string): ICdmDocumentDef;
    resolveReferencesAndValidate(stage: cdmValidationStep, stageThrough: cdmValidationStep, resOpt: resolveOptions)
        : Promise<cdmValidationStep>;
}
