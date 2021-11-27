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
    isByRef: boolean;
    /**
     * @internal
     */
    isArray: boolean;
    /**
     * @internal
     */
    selectsOne: boolean;
}
