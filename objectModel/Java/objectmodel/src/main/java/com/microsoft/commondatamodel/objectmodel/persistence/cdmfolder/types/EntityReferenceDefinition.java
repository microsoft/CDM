package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.node.ArrayNode;

public class EntityReferenceDefinition {
    private Object entityReference;
    private ArrayNode appliedTraits;

    public Object getEntityReference() {
        return entityReference;
    }

    public void setEntityReference(final Object entityReference) {
        this.entityReference = entityReference;
    }

    public ArrayNode getAppliedTraits() {
        return appliedTraits;
    }

    public void setAppliedTraits(final ArrayNode appliedTraits) {
        this.appliedTraits = appliedTraits;
    }
}

