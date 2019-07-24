import { ICdmObjectDef, ICdmParameterDef, ICdmTraitRef, ParameterCollection, resolveOptions, TraitApplier } from '../internal';

export interface ICdmTraitDef extends ICdmObjectDef {
    elevated: boolean;
    modifiesAttributes: boolean;
    ugly: boolean;
    associatedProperties: string[];
    getExtendsTrait(): ICdmTraitRef;
    setExtendsTrait(traitDef: ICdmTraitRef | ICdmTraitDef | string, implicitRef: boolean): ICdmTraitRef;
    getHasParameterDefs(): ICdmParameterDef[];
    getAllParameters(resOpt: resolveOptions): ParameterCollection;
    addTraitApplier(applier: TraitApplier): void;
    getTraitAppliers(): TraitApplier[];
}
