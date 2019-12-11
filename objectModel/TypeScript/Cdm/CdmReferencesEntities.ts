import { ResolvedEntityReferenceSet , resolveOptions } from '../internal';

export interface CdmReferencesEntities {
    fetchResolvedEntityReference(resOpt: resolveOptions): ResolvedEntityReferenceSet;
}
