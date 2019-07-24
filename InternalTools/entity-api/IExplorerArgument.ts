import { IExplorerParameter } from "./IExplorerParameter";
import { IExplorerArgumentValue } from "./IExplorerArgumentValue";

// Defines the interace of an argument present on a trait
export interface IExplorerArgument {
    parameter: IExplorerParameter;
    value: IExplorerArgumentValue;
}