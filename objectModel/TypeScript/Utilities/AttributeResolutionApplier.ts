import { applierContext, ResolvedTrait, resolveOptions, CdmAttributeResolutionGuidance } from '../internal';

export interface AttributeResolutionApplier {
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

    willAlterDirectives?(resOpt: resolveOptions, resGuide: CdmAttributeResolutionGuidance): boolean;
    doAlterDirectives?(resOpt: resolveOptions, resGuid: CdmAttributeResolutionGuidance): void;
}

// one of the doXXX steps that an applier may perform
export type applierAction = (onStep: applierContext) => void;
export type applierQuery = (onStep: applierContext) => boolean;
// a discrete action for an applier to perform upon a trait/attribute/etc.
