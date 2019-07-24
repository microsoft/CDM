import * as cdm from "cdm.objectmodel";
import { IExplorerArgument } from "./IExplorerArgument";
import { ExplorerParameter } from "./ExplorerParameter";
import { IExplorerParameter } from "./IExplorerParameter";
import { IExplorerArgumentValue } from "./IExplorerArgumentValue";
import { ExplorerArgumentValue } from "./ExplorerArgumentValue";
import { EntityContainer } from "./EntityContainer";

export class ExplorerArgument implements IExplorerArgument {
    public parameter: IExplorerParameter;
    public value: IExplorerArgumentValue;
    constructor(public argument: cdm.types.ICdmArgumentDef, resOpt: cdm.types.resolveOptions, public entityContainer: EntityContainer) {
        this.parameter = new ExplorerParameter(this.argument.getParameterDef(), resOpt);
        this.value = new ExplorerArgumentValue(this.argument.getValue(), resOpt, entityContainer);
    }
}