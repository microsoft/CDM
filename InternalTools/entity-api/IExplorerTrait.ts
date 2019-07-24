import { IExplorerArgument } from "./IExplorerArgument";

// Defines the interface of the trait used by attributes and entities
export interface IExplorerTrait {
    name: string;
    isUgly: boolean;
    explanation: string;
    arguments: IExplorerArgument[];
}