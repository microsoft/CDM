import { IExplorerDataType } from "./IExplorerDataType";

// Defines the interface of a parameter used by a trait
export interface IExplorerParameter {
    name: string;
    explanation: string;
    dataType: IExplorerDataType;
}