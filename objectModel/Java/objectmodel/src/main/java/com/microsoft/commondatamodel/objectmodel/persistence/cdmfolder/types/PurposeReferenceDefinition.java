package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.node.ArrayNode;

public class PurposeReferenceDefinition {
    private Object purposeReference;
    private ArrayNode appliedTraits;

    public Object getPurposeReference() {
        return purposeReference;
    }

    public void setPurposeReference(final Object purposeReference) {
        this.purposeReference = purposeReference;
    }

    public ArrayNode getAppliedTraits() {
        return appliedTraits;
    }

    public void setAppliedTraits(final ArrayNode appliedTraits) {
        this.appliedTraits = appliedTraits;
    }
}

