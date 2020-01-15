package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.node.ArrayNode;

public class TraitReferenceDefinition {
    public Object traitReference;
    public ArrayNode arguments;
    public ArrayNode appliedTraits;

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
}
