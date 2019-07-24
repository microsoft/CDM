import { ICdmDocumentDef , ICdmObject } from '../internal';

export interface ICdmFolderDef extends ICdmObject {
    getName(): string;
    getRelativePath(): string;
    getSubFolders(): ICdmFolderDef[];
    getDocuments(): ICdmDocumentDef[];
    addFolder(name: string): ICdmFolderDef;
    addDocument(name: string, content: string): ICdmDocumentDef;
    removeDocument(name: string): void;
    getSubFolderFromPath(path: string, makeFolder: boolean): ICdmFolderDef;
    getObjectFromFolderPath(path: string): ICdmObject;
}
