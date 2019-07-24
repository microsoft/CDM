import * as cdm from "cdm.objectmodel";
import { IExplorerArgumentValue, ExplorerArgumentValueType, IConstantEntityArgumentValues } from "./IExplorerArgumentValue";
import { ResolveOptions } from "./IExplorerEntity";
import { EntityApiUtils } from "./utils";
import { EntityContainer } from "./EntityContainer";

export class ExplorerArgumentValue implements IExplorerArgumentValue {
    public type: ExplorerArgumentValueType;
    public argumentValue: any;
    constructor(public value: any, resOpt: cdm.types.resolveOptions, public entityContainer: EntityContainer) {
        if (typeof (this.value) === "string") {
            this.type = ExplorerArgumentValueType.string;
            this.argumentValue = value;
            return;
        }

        let cdmObj = value as cdm.types.ICdmObject;
        let entDef: cdm.types.ICdmConstantEntityDef;
        if (cdmObj.getObjectType() === cdm.types.cdmObjectType.entityRef && (entDef = cdmObj.getObjectDef(resOpt) as cdm.types.ICdmConstantEntityDef) && entDef.getObjectType() === cdm.types.cdmObjectType.constantEntityDef) {
            let shapeAttNames = this.entityContainer.getAttributeNamesForConstEntity(entDef, resOpt);
            let entValues = entDef.getConstantValues();
            this.type = ExplorerArgumentValueType.constantEntity
            this.argumentValue = <IConstantEntityArgumentValues>{ attributeNames: shapeAttNames, constantValues: entValues };
            return;
        }

        this.type = ExplorerArgumentValueType.other;
    }

    public copyData(resolutionOptions: ResolveOptions): any {
        let resOpt = EntityApiUtils.convertOptions(resolutionOptions);
        return this.value.copyData(resOpt);
    }
}