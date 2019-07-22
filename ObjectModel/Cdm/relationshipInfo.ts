import { ResolvedTraitSet } from '../internal';

export interface relationshipInfo {
    rts: ResolvedTraitSet;
    isFlexRef: boolean;
    isLegacyRef: boolean;
    isArray: boolean;
    selectsOne: boolean;
    nextDepth: number;
    maxDepthExceeded: boolean;
}
