import * as cdm from "cdm.objectmodel";
import { IExplorerDataType } from "./IExplorerDataType";

export class ExplorerDataType implements IExplorerDataType {

    public get name() {
        return this.dataTypeDef.getName();
    }

    public get explanation() {
        return this.dataTypeDef.getExplanation();
    }

    private dataTypeDef: cdm.types.ICdmDataTypeDef;
    constructor(public dataTypeRef: cdm.types.ICdmDataTypeRef, public resOpt: cdm.types.resolveOptions) {
        this.dataTypeDef = this.dataTypeRef.getObjectDef(this.resOpt) as cdm.types.ICdmDataTypeDef;
    }
}