import { EntityContainer } from "./EntityContainer";
import { EntityFileLoader } from "./EntityFileLoader";
import { ExplorerArgument } from "./ExplorerArgument";
import { ExplorerArgumentValue } from "./ExplorerArgumentValue";
import { ExplorerAttributeBase } from "./ExplorerAttributeBase";
import { ExplorerAttributeGroup } from "./ExplorerAttributeGroup";
import { ExplorerDataType } from "./ExplorerDataType";
import { ExplorerDocument } from "./ExplorerDocument";
import { ExplorerEntity } from "./ExplorerEntity";
import { ExplorerParameter } from "./ExplorerParameter";
import { ExplorerResolvedEntity } from "./ExplorerResolvedEntity";
import { ExplorerTrait } from "./ExplorerTrait";
import { ExplorerTypeAttribute } from "./ExplorerTypeAttribute";

export function getEntityApiClasses() {
    return [
        EntityContainer,
        EntityFileLoader,
        ExplorerArgument,
        ExplorerArgumentValue,
        ExplorerAttributeBase,
        ExplorerAttributeGroup,
        ExplorerDataType,
        ExplorerDocument,
        ExplorerEntity,
        ExplorerParameter,
        ExplorerResolvedEntity,
        ExplorerTrait,
        ExplorerTypeAttribute,
    ]
}

export * from "./EntityContainer";
export * from "./IEntityContainer";
export * from "./IExplorerArgument";
export * from "./IExplorerArgumentValue";
export * from "./IExplorerAttributeBase";
export * from "./IExplorerAttributeGroup";
export * from "./IExplorerDocument";
export * from "./IExplorerEntity";
export * from "./IExplorerParameter";
export * from "./IExplorerResolvedEntity"
export * from "./IExplorerTrait"
export * from "./IExplorerTypeAttribute";
export * from "./IEntityState";
export * from "./EntityFileLoader";
