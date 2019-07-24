import { IExplorerAttributeBase } from "./IExplorerAttributeBase";
import { IExplorerTrait } from "./IExplorerTrait";
import { IExplorerResolvedEntity } from "./IExplorerResolvedEntity";
import { IExplorerEntityReference, ResolveOptions } from "./IExplorerEntity";

// Defines the interface of the attributes used by a resolved entity
export interface IExplorerTypeAttribute extends IExplorerAttributeBase {
    name: string;
    displayName: string;
    description: string;
    isPrimaryKey: boolean;
    dataFormat: string;
    maximumLength: number;
    maximumValue: string;
    minimumValue: string;
    isReadOnly: boolean;
    isNullable: boolean;
    sourceName: string;
    valueConstrainedToList: boolean;
    defaultValue: any;
    traits: IExplorerTrait[];
    entityReferences: IExplorerEntityReference[];
    resolvedEntity: IExplorerResolvedEntity;
    isInherited: boolean;
    copyData(resolutionOptions: ResolveOptions, copyOptions: any): any;
}