// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmCorpusContext, Logger, ProjectionAttributeState, cdmLogCode } from '../../internal';

/**
 * A collection of ProjectionAttributeState objects
 * @internal
 */
export class ProjectionAttributeStateSet {
    private TAG: string = ProjectionAttributeStateSet.name;

    /**
     * A list containing all the ProjectionAttributeStates
     * @internal
     */
    public states: ProjectionAttributeState[];

    /**
     * @internal
     */
    public ctx: CdmCorpusContext;

    /**
     * Create a new empty state
     */
    constructor(ctx: CdmCorpusContext) {
        this.ctx = ctx;
        this.states = [];
    }

    /**
     * Add to the collection
     * @internal
     */
    public add(pas: ProjectionAttributeState): void {
        if (!pas || !pas.currentResolvedAttribute || !pas.currentResolvedAttribute.resolvedName) {
            Logger.error(this.ctx, this.TAG, this.add.name, undefined, cdmLogCode.ErrProjInvalidAttrState);
        } else {
            this.states.push(pas);
        }
    }

    /**
     * Creates a copy of this projection attribute state set
     */
    public copy(): ProjectionAttributeStateSet {
        const copy: ProjectionAttributeStateSet = new ProjectionAttributeStateSet(this.ctx);
        for (const state of this.states) {
            copy.states.push(state);
        }

        return copy;
    }

    /**
     * Check if exists in collection
     * @internal
     */
    public contains(pas: ProjectionAttributeState): boolean {
        return this.states.includes(pas);
    }
}
