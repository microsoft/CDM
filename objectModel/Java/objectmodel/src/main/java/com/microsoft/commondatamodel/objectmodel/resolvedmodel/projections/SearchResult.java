// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections;

import java.util.ArrayList;
import java.util.List;

/**
 * @deprecated This class is extremely likely to be removed in the public interface, and not
 * meant to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class SearchResult {
    private boolean foundFlag;
    private int foundDepth;
    private ProjectionAttributeState found;
    private List<ProjectionAttributeState> top;
    private List<ProjectionAttributeState> leaf;

    public SearchResult() {
        this.foundFlag = false;
        this.found = null;
        this.top = new ArrayList<>();
        this.leaf = new ArrayList<>();
    }

    public boolean getFoundFlag() {
        return foundFlag;
    }

    public void setFoundFlag(final boolean foundFlag) {
        this.foundFlag = foundFlag;
    }

    public int getFoundDepth() {
        return foundDepth;
    }

    public void setFoundDepth(final int foundDepth) {
        this.foundDepth = foundDepth;
    }

    public ProjectionAttributeState getFound() {
        return found;
    }

    public void setFound(final ProjectionAttributeState found) {
        this.found = found;
    }

    public List<ProjectionAttributeState> getTop() {
        return top;
    }

    public void setTop(final List<ProjectionAttributeState> top) {
        this.top = top;
    }

    public List<ProjectionAttributeState> getLeaf() {
        return leaf;
    }

    public void setLeaf(final List<ProjectionAttributeState> leaf) {
        this.leaf = leaf;
    }
}