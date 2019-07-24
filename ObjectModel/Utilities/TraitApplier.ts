import { applierContext, ResolvedTrait, resolveOptions } from '../internal';

export interface TraitApplier {
    matchName: string;
    priority: number;
    overridesBase: boolean;

    willCreateContext?: applierQuery;
    doCreateContext?: applierAction;
    willRemove?: applierQuery;
    willAttributeModify?: applierQuery;
    doAttributeModify?: applierAction;
    willGroupAdd?: applierQuery;
    doGroupAdd?: applierAction;
    willRoundAdd?: applierQuery;
    doRoundAdd?: applierAction;
    willAttributeAdd?: applierQuery;
    doAttributeAdd?: applierAction;

    willAlterDirectives?(resOpt: resolveOptions, resTrait: ResolvedTrait): boolean;
    doAlterDirectives?(resOpt: resolveOptions, resTrait: ResolvedTrait): void;
}

// one of the doXXX steps that an applier may perform
export type applierAction = (onStep: applierContext) => void;
export type applierQuery = (onStep: applierContext) => boolean;
// a discrete action for an applier to perform upon a trait/attribute/etc.
