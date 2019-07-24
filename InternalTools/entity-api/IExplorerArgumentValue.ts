import { ResolveOptions } from "./IExplorerEntity";

// Defines the interface the interface of the value of an argument
export interface IExplorerArgumentValue {
    type: ExplorerArgumentValueType
    argumentValue: string | IConstantEntityArgumentValues;
    copyData(resolutionOptions: ResolveOptions);
}

export enum ExplorerArgumentValueType {
    constantEntity,
    string,
    other
}

export interface IConstantEntityArgumentValues {
    attributeNames: string[];
    constantValues: string[][];
}