import * as cdm from "cdm.objectmodel";
import { IExplorerParameter } from "./IExplorerParameter";
import { IExplorerDataType } from "./IExplorerDataType";
import { ExplorerDataType } from "./ExplorerDataType";

export class ExplorerParameter implements IExplorerParameter {
    public name: string;
    public explanation: string;
    public dataType: IExplorerDataType;

    constructor(public parameter: cdm.types.ICdmParameterDef, public resOpt: cdm.types.resolveOptions) {
        this.name = this.parameter.getName();
        this.explanation = this.parameter.getExplanation();
        this.dataType = new ExplorerDataType(this.parameter.getDataTypeRef(), this.resOpt)
    }
}