import { ResolvedTrait, TraitApplier } from '../internal';

// to hold the capability specific applier actions for the set of traits
export interface traitAction {
    rt: ResolvedTrait;
    applier: TraitApplier;
}
