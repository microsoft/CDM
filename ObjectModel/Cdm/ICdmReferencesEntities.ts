import { ResolvedEntityReferenceSet , resolveOptions } from '../internal';

export interface ICdmReferencesEntities {
    getResolvedEntityReferences(resOpt: resolveOptions): ResolvedEntityReferenceSet;
}
