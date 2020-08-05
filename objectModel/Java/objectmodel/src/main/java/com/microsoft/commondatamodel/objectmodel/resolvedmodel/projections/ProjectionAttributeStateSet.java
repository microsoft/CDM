// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel.projections;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmCorpusContext;
import com.microsoft.commondatamodel.objectmodel.utilities.StringUtils;
import com.microsoft.commondatamodel.objectmodel.utilities.logger.Logger;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * A collection of ProjectionAttributeState with a hash for a easy search and links to collection of previous projection states
 *
 * @deprecated This class is extremely likely to be removed in the public interface, and not
 * meant to be called externally at all. Please refrain from using it.
 */
@Deprecated
public final class ProjectionAttributeStateSet {
    private Map<String, ProjectionAttributeState> set = new LinkedHashMap<>();

    private CdmCorpusContext ctx;

    /**
     * Create a new empty state set
     */
    public ProjectionAttributeStateSet(CdmCorpusContext ctx) {
        this.ctx = ctx;
    }

    /**
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
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
     */
    @Deprecated
    public void add(ProjectionAttributeState pas) {
        if (pas == null ||
            pas.getCurrentResolvedAttribute() == null ||
            StringUtils.isNullOrTrimEmpty(pas.getCurrentResolvedAttribute().getResolvedName())) {
            Logger.error(ProjectionAttributeStateSet.class.getSimpleName(), this.ctx, "Invalid ProjectionAttributeState provided for addition to the Set. Add operation failed.", "add");
        } else {
            set.put(pas.getCurrentResolvedAttribute().getResolvedName(), pas);
        }
    }

    /**
     * Remove from collection if key is found
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public boolean remove(String resolvedAttributeName) {
        if (set.containsKey(resolvedAttributeName)) {
            set.remove(resolvedAttributeName);
            return true;
        } else {
            Logger.warning(ProjectionAttributeStateSet.class.getSimpleName(), this.ctx, "Invalid ProjectionAttributeState provided for removal from the Set. Remove operation failed.", "remove");
            return false;
        }
    }

    /**
     * Remove from collection if key is found
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public boolean remove(ProjectionAttributeState pas) {
        if (set.containsKey(pas.getCurrentResolvedAttribute().getResolvedName()) && set.get(pas.getCurrentResolvedAttribute().getResolvedName()) == pas) {
            return this.remove(pas.getCurrentResolvedAttribute().getResolvedName());
        } else {
            Logger.warning(ProjectionAttributeStateSet.class.getSimpleName(), this.ctx, "Invalid ProjectionAttributeState provided for removal from the Set. Remove operation failed.", "remove");
            return false;
        }
    }

    /**
     * Check if exists in collection
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public boolean contains(String resolvedAttributeName) {
        return set.containsKey(resolvedAttributeName);
    }

    /**
     * Find in collection
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public ProjectionAttributeState getValue(String resolvedAttributeName) {
        if (set.containsKey(resolvedAttributeName)) {
            return set.get(resolvedAttributeName);
        } else {
            return null;
        }
    }

    /**
     * Get a list of values
     *
     * @deprecated This function is extremely likely to be removed in the public interface, and not
     * meant to be called externally at all. Please refrain from using it.
     */
    @Deprecated
    public Collection<ProjectionAttributeState> getValues() {
        return set.values();
    }
}
