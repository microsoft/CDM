import { IExplorerTrait } from "./IExplorerTrait";
import { ResolveOptions, IExplorerEntity, IExplorerEntityReference } from "./IExplorerEntity";
import { IExplorerAttributeBase } from "./IExplorerAttributeBase";

// Defines the interface of a resolved entity
// A resolved entity is created by calling the createResolvedEntity method on an explorer entity.
export interface IExplorerResolvedEntity {
    name: string;
    traits: IExplorerTrait[];
    displayName: string;
    description: string;
    version: string;
    cdmSchemas: string[];
    sourceName: string;
    attributes: IExplorerAttributeBase[];
    entityReferences: IExplorerEntityReference[];
    explorerEntity: IExplorerEntity;
    copyData(resolutionOptions: ResolveOptions, copyOptions: any): any;
}