import {
    CdmAttributeContext,
    CdmAttributeResolutionGuidance,
    ResolvedAttribute,
    resolveOptions
} from '../internal';

export interface applierContext {
    state?: string;
    resOpt: resolveOptions;
    attCtx?: CdmAttributeContext;
    resGuide: CdmAttributeResolutionGuidance;
    resAttSource: ResolvedAttribute;
    resAttNew?: ResolvedAttribute;
    resGuideNew?: CdmAttributeResolutionGuidance;
    continue?: boolean;
}
