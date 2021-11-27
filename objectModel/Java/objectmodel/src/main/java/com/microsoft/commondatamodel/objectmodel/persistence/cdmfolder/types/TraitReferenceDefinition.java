// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.node.ArrayNode;

public class TraitReferenceDefinition {
    private Object traitReference;
    private ArrayNode arguments;
    private ArrayNode appliedTraits;
    private Boolean optional;

    public Object getTraitReference() {
        return traitReference;
    }

    public void setTraitReference(final Object traitReference) {
        this.traitReference = traitReference;
    }

    public ArrayNode getArguments() {
        return arguments;
    }

    public void setArguments(final ArrayNode arguments) {
        this.arguments = arguments;
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
