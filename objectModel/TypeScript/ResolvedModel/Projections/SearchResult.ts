// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ProjectionAttributeState } from '../../internal';

/**
 * @internal
 */
export class SearchResult {
    public foundFlag: boolean;

    public foundDepth: number;

    public found: ProjectionAttributeState;

    public top: ProjectionAttributeState[];

    public leaf: ProjectionAttributeState[];

    constructor() {
        this.foundFlag = false;
        this.found = undefined;
        this.top = [];
        this.leaf = [];
    }
}
