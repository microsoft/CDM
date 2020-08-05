// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmCorpusContext, Logger, ProjectionAttributeState } from '../../internal';

/**
 * A collection of ProjectionAttributeState with a hash for a easy search
 * and links to collection of previous projection states
 * @internal
 */
export class ProjectionAttributeStateSet {
    /**
     * A set with the resolved attribute name as a the key and the projection attribute state as value
     */
    private set: Map<string, ProjectionAttributeState> = new Map<string, ProjectionAttributeState>();

    /**
     * @internal
     */
    public ctx: CdmCorpusContext;

    /**
     * Create a new empty state
     */
    constructor(ctx: CdmCorpusContext) {
        this.ctx = ctx;
    }

    /**
     * Add to the collection
     * @internal
     */
    public add(pas: ProjectionAttributeState): void {
        if (!pas || !pas.currentResolvedAttribute || !pas.currentResolvedAttribute.resolvedName) {
            Logger.error(ProjectionAttributeStateSet.name, this.ctx, 'Invalid ProjectionAttributeState provided for addition to the Set. Add operation failed.', this.add.name);
        } else {
            this.set.set(pas.currentResolvedAttribute.resolvedName, pas);
        }
    }

    /**
     * Remove from collection if key is found
     * @internal
     */
    public remove(keyOrValue: [string, ProjectionAttributeState]): boolean {
        if (typeof(keyOrValue) === 'string') {
            if (this.set.has(keyOrValue)) {
                this.set.delete(keyOrValue);

                return true;
            }
        } else if (keyOrValue instanceof ProjectionAttributeState) {
            if (this.set.has(keyOrValue.currentResolvedAttribute.resolvedName) && this.set.get(keyOrValue.currentResolvedAttribute.resolvedName) === keyOrValue) {
                this.set.delete(keyOrValue.currentResolvedAttribute.resolvedName);

                return true;
            }
        }
        Logger.warning(ProjectionAttributeStateSet.name, this.ctx, 'Invalid ProjectionAttributeState provided for removal from the Set. Remove operation failed.', this.remove.name);

        return false;
    }

    /**
     * Check if exists in collection
     * @internal
     */
    public contains(resolvedAttributeName: string): boolean {
        return this.set.has(resolvedAttributeName);
    }

    /**
     * Find in collection
     * @internal
     */
    public getValue(resolvedAttributeName: string): ProjectionAttributeState {
        if (this.set.has(resolvedAttributeName)) {
            return this.set.get(resolvedAttributeName);
        } else {
            return undefined;
        }
    }

    /**
     * Get a list of values
     * @internal
     */
    public get values(): Iterable<ProjectionAttributeState> {
        return this.set.values();
    }
}
