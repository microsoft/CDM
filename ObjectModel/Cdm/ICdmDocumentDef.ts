import {
    cdmObjectType,
    ICdmAttributeGroupDef,
    ICdmConstantEntityDef,
    ICdmDataTypeDef,
    ICdmEntityDef,
    ICdmFolderDef,
    ICdmImport,
    ICdmObject,
    ICdmRelationshipDef,
    ICdmTraitDef,
    resolveOptions
} from '../internal';

export interface ICdmDocumentDef extends ICdmObject {
    getName(): string;
    setName(name: string): string;
    getSchema(): string;
    getSchemaVersion(): string;
    getDefinitions()
        : (ICdmTraitDef | ICdmDataTypeDef | ICdmRelationshipDef | ICdmAttributeGroupDef | ICdmEntityDef | ICdmConstantEntityDef)[];
    addDefinition<T>(ofType: cdmObjectType, name: string): T;
    getImports(): ICdmImport[];
    addImport(coprusPath: string, moniker: string): void;
    getObjectFromDocumentPath(path: string): ICdmObject;
    getFolder(): ICdmFolderDef;
    refresh(resOpt: resolveOptions): void;
}
