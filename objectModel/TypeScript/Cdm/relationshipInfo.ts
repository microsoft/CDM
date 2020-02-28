// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ResolvedTraitSet } from '../internal';

/**
 * @internal
 */
export interface relationshipInfo {
    /**
     * @internal
     */
    rts: ResolvedTraitSet;
    isByRef: boolean;
    isArray: boolean;
    selectsOne: boolean;
    nextDepth: number;
    maxDepthExceeded: boolean;
}
