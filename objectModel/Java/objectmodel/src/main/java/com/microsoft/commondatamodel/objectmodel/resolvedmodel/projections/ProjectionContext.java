// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeContext;
import com.microsoft.commondatamodel.objectmodel.resolvedmodel.ResolvedAttributeSet;

/**
 * Context for each projection or nested projection
 *
 * @deprecated This class is extremely likely to be removed in the public interface, and not
 * meant to be called externally at all. Please refrain from using it.
 */
@Deprecated
public final class ProjectionContext {
    private ProjectionDirective projectionDirective;
    private ResolvedAttributeSet originalSourceResolvedAttributeSet;
    private CdmAttributeContext currentAttributeContext;
    private ProjectionAttributeStateSet CurrentAttributeStateSet;

    public ProjectionContext(ProjectionDirective projDirective, CdmAttributeContext attrCtx) {
        this.projectionDirective = projDirective;
        this.currentAttributeContext = attrCtx;
        this.CurrentAttributeStateSet = new ProjectionAttributeStateSet(projDirective != null && projDirective.getOwner() != null ? projDirective.getOwner().getCtx() : null);
    }

    /**
     * Directive passed to the root projection
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @return ProjectionDirective
     */
    @Deprecated
    public ProjectionDirective getProjectionDirective() {
        return projectionDirective;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @param projectionDirective ProjectionDirective
     */
    @Deprecated
    public void setProjectionDirective(final ProjectionDirective projectionDirective) {
        this.projectionDirective = projectionDirective;
    }

    /**
     * The collection of original source entities's resolved attributes
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @return ResolvedAttributeSet
     */
    @Deprecated
    public ResolvedAttributeSet getOriginalSourceResolvedAttributeSet() {
        return originalSourceResolvedAttributeSet;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @param originalSourceResolvedAttributeSet ResolvedAttributeSet
     */
    @Deprecated
    public void setOriginalSourceResolvedAttributeSet(final ResolvedAttributeSet originalSourceResolvedAttributeSet) {
        this.originalSourceResolvedAttributeSet = originalSourceResolvedAttributeSet;
    }

    /**
     * The attribute context of the current resolve attribute
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @return CdmAttributeContext
     */
    @Deprecated
    public CdmAttributeContext getCurrentAttributeContext() {
        return currentAttributeContext;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @param currentAttributeContext CdmAttributeContext
     */
    @Deprecated
    public void setCurrentAttributeContext(final CdmAttributeContext currentAttributeContext) {
        this.currentAttributeContext = currentAttributeContext;
    }

    /**
     * A list of attribute state
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @return ProjectionAttributeStateSet
     */
    @Deprecated
    public ProjectionAttributeStateSet getCurrentAttributeStateSet() {
        return CurrentAttributeStateSet;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     * @param currentAttributeStateSet ProjectionAttributeStateSet
     */
    @Deprecated
    public void setCurrentAttributeStateSet(final ProjectionAttributeStateSet currentAttributeStateSet) {
        CurrentAttributeStateSet = currentAttributeStateSet;
    }
}
