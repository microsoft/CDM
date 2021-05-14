// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import com.microsoft.commondatamodel.objectmodel.cdm.EntityByReference;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.AttributeResolutionContext;

public class DepthInfo {
    /**
     * The max depth set if the user specified to not use max depth
     */
    public static int maxDepthLimit = 32;

    /**
     * The maximum depth that we can resolve entity attributes.
     * This value is set in resolution guidance.
     */
    private Integer maxDepth;
    /**
     * The current depth that we are resolving at. Each entity attribute that we resolve
     * into adds 1 to depth.
     */
    private int currentDepth;
    /**
     * Indicates if the maxDepth value has been hit when resolving
     */
    private boolean maxDepthExceeded;

    public Integer getMaxDepth() {
        return this.maxDepth;
    }

    public void setMaxDepth(Integer maxDepth) {
        this.maxDepth = maxDepth;
    }

    public int getCurrentDepth() {
        return this.currentDepth;
    }

    public void setCurrentDepth(int currentDepth) {
        this.currentDepth = currentDepth;
    }

    public boolean getMaxDepthExceeded() {
        return this.maxDepthExceeded;
    }

    public void setMaxDepthExceeded(boolean maxDepthExceeded) {
        this.maxDepthExceeded = maxDepthExceeded;
    }

    public DepthInfo() {
        this.reset();
    }

    /**
     * Resets the instance to its initial values.
     * @deprecated
     */
    public void reset() {
        this.currentDepth = 0;
        this.maxDepth = null;
        this.maxDepthExceeded = false;
    }

    /**
     * Creates a copy of this depth info instance.
     * @deprecated
     */
    public DepthInfo copy() {
        final DepthInfo copy = new DepthInfo();
        copy.currentDepth = this.currentDepth;
        copy.maxDepth = this.maxDepth;
        copy.maxDepthExceeded = this.maxDepthExceeded;

        return copy;
    }

    /**
     * Updates this depth info to the next level.
     * @deprecated
     */
    public void updateToNextLevel(ResolveOptions resOpt, Boolean isPolymorphic, AttributeResolutionContext arc) {
        AttributeResolutionDirectiveSet directives = resOpt.getDirectives();
        boolean isByRef = false;

        this.maxDepth = resOpt.getMaxDepth();

        // if using resolution guidance, read its properties first
        if (arc != null) {
            if (arc.getResOpt() != null) {
                directives = arc.getResOpt().getDirectives();
                
                if (isPolymorphic == null && directives != null)
                {
                    isPolymorphic = directives.has("selectOne");
                }
            }

            if (arc.getResGuide().getEntityByReference() != null)
            {
                EntityByReference entityByReference = arc.getResGuide().getEntityByReference();;
                if (entityByReference.getReferenceOnlyAfterDepth() != null)
                {
                    this.maxDepth = entityByReference.getReferenceOnlyAfterDepth();
                }

                if (entityByReference.doesAllowReference() && directives != null) {
                    isByRef = directives.has("referenceOnly");
                }
            }
        }

        if (directives != null) {
            if (directives.has("noMaxDepth")) {
                // no max? really? what if we loop forever? if you need more than 32 nested entities, then you should buy a different metadata description system
                this.maxDepth = maxDepthLimit;
            }
        }

        // if this is a polymorphic, then skip counting this entity in the depth, else count it
        // if it's already by reference, we won't go one more level down so don't increase current depth
        if ((isPolymorphic == null || !isPolymorphic) && !isByRef) {
            this.currentDepth++;

            if (this.currentDepth > this.maxDepth) {
                this.maxDepthExceeded = true;
            }
        }
    }
}
