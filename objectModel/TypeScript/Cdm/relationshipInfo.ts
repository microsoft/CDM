import { ResolvedTraitSet } from '../internal';

/**
 * @internal
 */
export interface relationshipInfo {
    rts: ResolvedTraitSet;
    isByRef: boolean;
    isArray: boolean;
    selectsOne: boolean;
    nextDepth: number;
    maxDepthExceeded: boolean;
}
