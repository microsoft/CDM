import { IExplorerEntityReference } from "./IExplorerEntity";

// The base interface for all attributes
export interface IExplorerAttributeBase {
    isAttributeGroup: boolean;
    entityReferences: IExplorerEntityReference[];
}