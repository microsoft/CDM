import { IExplorerEntity } from "./IExplorerEntity";

// The interface in which the entities read from a file are initially loaded into
// These are later passed to the entity container from which explorer entities are generated
export interface IEntityState {
    id: string;
    folderId: string;
    name: string;
    path: string;
    docName: string;
    loadState: number;
    description: string;
    file: IFileInfo;
    createUX: boolean;
    rawContent?: any;
    entity?: IExplorerEntity;
    relsOut?: Array<IRelationship>;
    relsIn?: Array<IRelationship>;
    referencedEntityNames?: Set<string>;
    referencedEntityCache?: Map<IExplorerEntity, boolean>;
}

export interface IRelationship {
    referencingAttribute: any;
    referencingEntity: IExplorerEntity;
    referencedAttribute: any;
    referencedEntity: IExplorerEntity;
}

export interface IFileInfo {
    name: string;
    path: string;
}

export interface IFolder {
    id: string;
    name: string
    entities: IEntityState[];
    folders: IFolder[];
}

export interface INavigatorData {
    root: IFolder;
    readRoot: string;
    sourceRoot: string;
}

export enum LoadStatus {
    loadPending,
    loadSuccess,
    loadFail,
    loadModeResult,
}

export enum LoggingLevel {
    debug = 0,
    info = 1,
    warning = 2,
    error = 3,
}