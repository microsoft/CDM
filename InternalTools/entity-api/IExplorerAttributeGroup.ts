import { IExplorerAttributeBase } from "./IExplorerAttributeBase";
import { IExplorerResolvedEntity } from "./IExplorerResolvedEntity";

// Extends the attribute base interface to support groups of attributes which can hold more groups of single attributes
export interface IExplorerAttributeGroup extends IExplorerAttributeBase {
    attributes: IExplorerAttributeBase[];
    resolvedEntity: IExplorerResolvedEntity;
}