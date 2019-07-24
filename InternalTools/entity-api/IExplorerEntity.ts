import { IExplorerDocument } from "./IExplorerDocument";
import { IExplorerResolvedEntity } from "./IExplorerResolvedEntity";

// Defines the interface of an entity
// Corresponding to each entity loaded there exists only a single entity
// The entity container stores all the entities that were created
export interface IExplorerEntity {
    name: string;
    path: string;
    declaredIn: IExplorerDocument;
    entityReferences: IExplorerEntityReference[];
    getBaseEntity(resolutionOptions: ResolveOptions): IExplorerEntity;
    copyData(resolutionOptions: ResolveOptions, copyOptions: any): any;
    createResolvedEntity(resolutionOptions: ResolveOptions, cache?: boolean): IExplorerResolvedEntity
}

export enum DirectiveSet {
    None = 0,
    ReferenceOnly = 1 << 0,
    Normalized = 1 << 1,
    Structured = 1 << 2,
    All = ~(~0 << 3)
}

export interface ResolveOptions {
    withRespectToDocument: IExplorerDocument,
    directives: DirectiveSet
}

export interface IExplorerEntityReference {
    referencingEntity: IExplorerEntity,
    referencingAttributeName: string,
    referencedEntity: IExplorerEntity,
    referencedAttributeName: string,
}