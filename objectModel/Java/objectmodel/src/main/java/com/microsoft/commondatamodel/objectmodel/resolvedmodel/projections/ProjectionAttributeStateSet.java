// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;
import com.microsoft.commondatamodel.objectmodel.enums.CdmLogCode;

import java.util.*;

/**
 * A collection of ProjectionAttributeState objects
 *
 * @deprecated This class is extremely likely to be removed in the public interface, and not
 * meant to be called externally at all. Please refrain from using it.
 */
@Deprecated
public final class ProjectionAttributeStateSet {
    private static final String TAG = ProjectionAttributeStateSet.class.getSimpleName();

    /**
     * A list containing all the ProjectionAttributeStates
     */
    private List<ProjectionAttributeState> states;

    private CdmCorpusContext ctx;

    /**
     * Create a new empty state set
     * @param ctx CdmCorpusContext
     */
    public ProjectionAttributeStateSet(CdmCorpusContext ctx) {
        this.setCtx(ctx);
        this.states = new ArrayList<>();
    }

    /**
     * @return List of ProjectionAttributeState
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public List<ProjectionAttributeState> getStates() {
        return states;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @return CdmCorpusContext
     */
    @Deprecated
    public CdmCorpusContext getCtx() {
        return ctx;
    }

    private void setCtx(final CdmCorpusContext ctx) {
        this.ctx = ctx;
    }

    /**
     * Add to the collection
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @param pas ProjectionAttributeState
     */
    @Deprecated
    public void add(ProjectionAttributeState pas) {
        if (pas == null ||
                pas.getCurrentResolvedAttribute() == null ||
                StringUtils.isNullOrTrimEmpty(pas.getCurrentResolvedAttribute().getResolvedName())) {
                    Logger.error(this.ctx, TAG, "add", null, CdmLogCode.ErrProjInvalidAttrState);
        } else {
            states.add(pas);
        }
    }

    /**
     * Creates a copy of this projection attribute state set
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public ProjectionAttributeStateSet copy() {
        ProjectionAttributeStateSet copy = new ProjectionAttributeStateSet(this.getCtx());
        copy.getStates().addAll(this.getStates());

        return copy;
    }

    /**
     * Check if exists in collection
     * @param pas ProjectionAttributeState
     * @return boolean
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public boolean contains(ProjectionAttributeState pas) {
        return states.contains(pas);
    }
}