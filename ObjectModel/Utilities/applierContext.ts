import { ICdmAttributeContext, ResolvedAttribute, ResolvedTrait, resolveOptions } from '../internal';

export interface applierContext {
    resOpt: resolveOptions;
    attCtx?: ICdmAttributeContext;
    resTrait: ResolvedTrait;
    resAttSource: ResolvedAttribute;
    resAttNew?: ResolvedAttribute;
    continue?: boolean;
}
