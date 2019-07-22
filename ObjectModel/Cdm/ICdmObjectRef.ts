import { ICdmObject , ICdmObjectDef , ICdmTraitDef , ICdmTraitRef } from '../internal';

export interface ICdmObjectRef extends ICdmObject {
    getAppliedTraitRefs(): ICdmTraitRef[];
    addAppliedTrait(traitDef: ICdmTraitRef | ICdmTraitDef | string, implicitRef: boolean): ICdmTraitRef;
    removeAppliedTrait(traitDef: ICdmTraitRef | ICdmTraitDef | string): void;
    setObjectDef(def: ICdmObjectDef): ICdmObjectDef;
}
