// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmCorpusContext, ResolvedAttribute } from '../../internal';

/**
 * This node maintains the attribute's state during projection and between stages of a operations
 * and links to collection of previous projection states
 * @internal
 */
export class ProjectionAttributeState {
    /**
     * Keep context for error logging
     */
    private ctx: CdmCorpusContext;

    /**
     * Current resolved attribute
     * @internal
     */
    public currentResolvedAttribute: ResolvedAttribute;

    /**
     * Keep a list of original polymorphic source states
     */
    public previousStateList: ProjectionAttributeState[]

    /**
     * Create a new empty state
     */
    constructor(ctx: CdmCorpusContext) {
        this.ctx = ctx;
    }
}
