// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.node.ArrayNode;

public class TraitGroupReferenceDefinition {
    private Object traitGroupReference;
    private ArrayNode appliedTraits;
    private Boolean optional;

    public Object getTraitGroupReference() {
        return traitGroupReference;
    }

    public void setTraitGroupReference(final Object traitGroupReference) {
        this.traitGroupReference = traitGroupReference;
    }

    public ArrayNode getAppliedTraits() {
        return appliedTraits;
    }

    public void setAppliedTraits(final ArrayNode appliedTraits) {
        this.appliedTraits = appliedTraits;
    }

    public Boolean getOptional() {
        return optional;
    }

    public void setOptional(Boolean optional) {
        this.optional = optional;
    }
}
