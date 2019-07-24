import { ICdmObject , ICdmTraitDef , ICdmTraitRef , resolveOptions } from '../internal';

export interface ICdmObjectDef extends ICdmObject {
    getExplanation(): string;
    setExplanation(explanation: string): string;
    getName(): string;
    getExhibitedTraitRefs(): ICdmTraitRef[];
    addExhibitedTrait(traitDef: ICdmTraitRef | ICdmTraitDef | string, implicitRef: boolean): ICdmTraitRef;
    removeExhibitedTrait(traitDef: ICdmTraitRef | ICdmTraitDef | string): void;
    isDerivedFrom(resOpt: resolveOptions, base: string): boolean;
    getObjectPath(): string;
}
