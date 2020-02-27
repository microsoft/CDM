// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmTraitDefinition } from '../internal';

/**
 * @internal
 */
export class resolveContextScope {
    /**
     * @internal
     */
    public currentTrait?: CdmTraitDefinition;

    /**
     * @internal
     */
    public currentParameter?: number;
}
