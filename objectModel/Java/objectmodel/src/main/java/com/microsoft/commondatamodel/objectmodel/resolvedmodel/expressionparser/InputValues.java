// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.resolvedmodel.expressionparser;

/**
 * A structure to carry all the input values during evaluation/resolution of an expression tree
 *
 * @deprecated This class is extremely likely to be removed in the public interface, and not
 * meant to be called externally at all. Please refrain from using it.
 */
@Deprecated
public class InputValues {
    private Integer nextDepth;
    private Integer maxDepth;
    private Boolean noMaxDepth;
    private Boolean isArray;

    private Integer minCardinality;
    private Integer maxCardinality;

    private Boolean referenceOnly;
    private Boolean normalized;
    private Boolean structured;


    public Integer getNextDepth() {
        return nextDepth;
    }

    public void setNextDepth(final Integer nextDepth) {
        this.nextDepth = nextDepth;
    }

    public Integer getMaxDepth() {
        return maxDepth;
    }

    public void setMaxDepth(final Integer maxDepth) {
        this.maxDepth = maxDepth;
    }

    public Boolean getNoMaxDepth() {
        return noMaxDepth;
    }

    public void setNoMaxDepth(final Boolean noMaxDepth) {
        this.noMaxDepth = noMaxDepth;
    }

    public Boolean getIsArray() {
        return isArray;
    }

    public void setIsArray(final Boolean isArray) {
        this.isArray = isArray;
    }

    public Integer getMinCardinality() {
        return minCardinality;
    }

    public void setMinCardinality(final Integer minCardinality) {
        this.minCardinality = minCardinality;
    }

    public Integer getMaxCardinality() {
        return maxCardinality;
    }

    public void setMaxCardinality(final Integer maxCardinality) {
        this.maxCardinality = maxCardinality;
    }

    public Boolean getReferenceOnly() {
        return referenceOnly;
    }

    public void setReferenceOnly(final Boolean referenceOnly) {
        this.referenceOnly = referenceOnly;
    }

    public Boolean getNormalized() {
        return normalized;
    }

    public void setNormalized(final Boolean normalized) {
        this.normalized = normalized;
    }

    public Boolean getStructured() {
        return structured;
    }

    public void setStructured(final Boolean structured) {
        this.structured = structured;
    }
}
