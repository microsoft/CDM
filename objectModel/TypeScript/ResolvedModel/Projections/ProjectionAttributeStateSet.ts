// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmCorpusContext, Logger, ProjectionAttributeState } from '../../internal';

/**
 * A collection of ProjectionAttributeState objects
 * @internal
 */
export class ProjectionAttributeStateSet {
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
            Logger.error(ProjectionAttributeStateSet.name, this.ctx, 'Invalid ProjectionAttributeState provided for addition to the Set. Add operation failed.', this.add.name);
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
     * Remove from collection
     * @internal
     */
    public remove(pas: ProjectionAttributeState): boolean {
        if (pas && this.contains(pas)) {
            const index: number = this.states.indexOf(pas);
            this.states.splice(index, 1);
            return true;
        } else {
            Logger.warning(ProjectionAttributeStateSet.name, this.ctx, 'Invalid ProjectionAttributeState provided for removal from the Set. Remove operation failed.', this.remove.name);
            return false;
        }
    }

    /**
     * Check if exists in collection
     * @internal
     */
    public contains(pas: ProjectionAttributeState): boolean {
        return this.states.includes(pas);
    }
}
