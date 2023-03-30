// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

/**
 * OperationAlterTraits class
 */
public class OperationAlterTraits extends OperationBase {
    private ArrayNode traitsToAdd;
    private ArrayNode traitsToRemove;
    private Boolean argumentsContainWildcards;
    private Object applyTo;
    private Object applyToTraits;

    public JsonNode getTraitsToAdd() {
        return traitsToAdd;
    }

    public void setTraitsToAdd(final ArrayNode traitsToAdd) {
        this.traitsToAdd = traitsToAdd;
    }

    public JsonNode getTraitsToRemove() {
        return traitsToRemove;
    }

    public void setTraitsToRemove(final ArrayNode traitsToRemove) {
        this.traitsToRemove = traitsToRemove;
    }

    public Boolean getArgumentsContainWildcards() {
        return argumentsContainWildcards;
    }

    public void setArgumentsContainWildcards(final Boolean argumentsContainWildcards) {
        this.argumentsContainWildcards = argumentsContainWildcards;
    }

    public Object getApplyTo() {
        return applyTo;
    }

    public void setApplyTo(final Object applyTo) {
        this.applyTo = applyTo;
    }

    public Object getApplyToTraits() {
        return applyToTraits;
    }

    public void setApplyToTraits(final Object applyToTraits) {
        this.applyToTraits = applyToTraits;
    }
}
