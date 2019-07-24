import { IExplorerEntity } from "./IExplorerEntity";

// Holds the set of entities that were loaded from the provided documents
export interface IEntityContainer {
    loadEntitiesFromDocuments(rootPath: string, documentHierarchy: any);
    resolveEntities(messageType: string, statusCallback: (operation: string, level: any, message: string) => void);
    mapEntities(entityPaths: string[]): IExplorerEntity[];
}

enum LoggingLevel {
    debug = 0,
    info = 1,
    warning = 2,
    error = 3,
}