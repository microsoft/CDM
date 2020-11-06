// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttribute;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * This node maintains the attribute's state during projection and between stages of a operations
 * and links to collection of previous projection states
 *
 * @deprecated This class is extremely likely to be removed in the public interface, and not
 * meant to be called externally at all. Please refrain from using it.
 */
@Deprecated
public final class ProjectionAttributeState {
    /**
     * Keep context for error logging
     */
    private CdmCorpusContext ctx;
    private ResolvedAttribute currentResolvedAttribute;
    private List<ProjectionAttributeState> previousStateList;
    private Integer ordinal;

    /**
     * Create a new empty state
     * @param ctx CdmCorpusContext
     */
    public ProjectionAttributeState(CdmCorpusContext ctx) {
        this.ctx = ctx;
        this.currentResolvedAttribute = null;
        this.previousStateList = null;
    }

    /**
     * Current resolved attribute
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @return ResolvedAttribute
     */
    @Deprecated
    public ResolvedAttribute getCurrentResolvedAttribute() {
        return currentResolvedAttribute;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @param currentResolvedAttribute ResolvedAttribute
     */
    @Deprecated
    public void setCurrentResolvedAttribute(final ResolvedAttribute currentResolvedAttribute) {
        this.currentResolvedAttribute = currentResolvedAttribute;
    }

    /**
     * Keep a list of original polymorphic source states
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @return List of ProjectionAttributeState
     */
    @Deprecated
    public List<ProjectionAttributeState> getPreviousStateList() {
        return previousStateList;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @param previousStateList List of ProjectionAttributeState
     */
    @Deprecated
    public void setPreviousStateList(final List<ProjectionAttributeState> previousStateList) {
        this.previousStateList = previousStateList;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @return Integer
     */
    @Deprecated
    public Integer getOrdinal() {
        return ordinal;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @param ordinal int
     */
    @Deprecated
    public void setOrdinal(final int ordinal) {
        this.ordinal = ordinal;
    }

    /**
     * Creates a copy of the state and sets its previous state to be itself
     * 
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @return ProjectionAttributeState
     */
    @Deprecated
    public ProjectionAttributeState copy() {
        ProjectionAttributeState copy = new ProjectionAttributeState(this.ctx);
        copy.setCurrentResolvedAttribute(this.currentResolvedAttribute);
        copy.setPreviousStateList(new ArrayList<>(Arrays.asList(this)));
        if (this.ordinal != null) {
            copy.setOrdinal(this.ordinal);
        }

        return copy;
    }
}
