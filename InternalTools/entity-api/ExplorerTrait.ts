import * as cdm from "cdm.objectmodel";
import { IExplorerTrait } from "./IExplorerTrait";
import { ExplorerArgument } from "./ExplorerArgument";
import { EntityContainer } from "./EntityContainer";

export class ExplorerTrait implements IExplorerTrait {
    public get name(): string{
        return this.traitDef.getName();
    }

    public get isUgly(): boolean{
        return this.traitDef.ugly;
    }

    public get explanation(): string {
        return this.traitDef.getExplanation();
    }

    public traitDef: cdm.types.ICdmTraitDef;
    public arguments: ExplorerArgument[] = [];
    constructor(public traitRef: cdm.types.ICdmTraitRef, resOpt: cdm.types.resolveOptions, entityContainer: EntityContainer) {
        this.traitDef = traitRef.getObjectDef(resOpt) as cdm.types.ICdmTraitDef;
        if (traitRef.getArgumentDefs()) {
            this.arguments = traitRef.getArgumentDefs().map(argument => new ExplorerArgument(argument, resOpt, entityContainer));
        }
    }
}