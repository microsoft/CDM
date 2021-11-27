// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeResolutionContext,
    AttributeResolutionDirectiveSet,
    resolveOptions
} from '../internal';


export class DepthInfo {
    /**
     * The max depth set if the user specified to not use max depth
     */
    public static readonly maxDepthLimit: number = 32;

    /**
     * The maximum depth that we can resolve entity attributes.
     * This value is set in resolution guidance.
     */
    public maxDepth: number;

    /**
     * The current depth that we are resolving at. Each entity attribute that we resolve
     * into adds 1 to depth.
     */
    public currentDepth: number;

    /**
     * Indicates if the maxDepth value has been hit when resolving
     */
    public maxDepthExceeded: boolean;

    public constructor() {
        this.reset();
    }

    /**
     * Resets the instance to its initial values.
     * @internal
     */
    public reset(): void {
        this.currentDepth = 0;
        this.maxDepth = undefined;
        this.maxDepthExceeded = false;
    }

    /**
     * Creates a copy of this depth info instance.
     * @internal
     */
    public copy(): DepthInfo {
        const copy: DepthInfo = new DepthInfo();
        copy.currentDepth = this.currentDepth;
        copy.maxDepth = this.maxDepth;
        copy.maxDepthExceeded = this.maxDepthExceeded;

        return copy;
    }

    /**
     * Updates this depth info to the next level.
     * @internal
     */
    public updateToNextLevel(resOpt: resolveOptions, isPolymorphic: boolean, arc: AttributeResolutionContext = undefined) {
            let directives: AttributeResolutionDirectiveSet = resOpt.directives;
            let isByRef: boolean = false;

            this.maxDepth = resOpt.maxDepth;

            // if using resolution guidance
            if (arc !== undefined) {
                if (arc.resOpt !== undefined) {
                    directives = arc.resOpt.directives;

                    if (isPolymorphic === undefined) {
                        isPolymorphic = directives?.has('selectOne') === true;
                    }
                }

                if (arc.resGuide?.entityByReference !== undefined) {
                    if (arc.resGuide.entityByReference.referenceOnlyAfterDepth !== undefined) {
                        this.maxDepth = arc.resGuide.entityByReference.referenceOnlyAfterDepth;
                    }

                    if (arc.resGuide.entityByReference.allowReference === true) {
                        isByRef = directives?.has('referenceOnly') === true;
                    }
                }
            }

            if (directives !== undefined) {
                if (directives.has('noMaxDepth')) {
                    // no max? really? what if we loop forever? if you need more than 32 nested entities, then you should buy a different metadata description system
                    this.maxDepth = DepthInfo.maxDepthLimit;
                }
            }

            // if this is a polymorphic, then skip counting this entity in the depth, else count it
            // if it's already by reference, we won't go one more level down so don't increase current depth
            if (isPolymorphic !== true && !isByRef) {
                this.currentDepth++;

                if (this.currentDepth > this.maxDepth) {
                    this.maxDepthExceeded = true;
                }
            }
        }
}
