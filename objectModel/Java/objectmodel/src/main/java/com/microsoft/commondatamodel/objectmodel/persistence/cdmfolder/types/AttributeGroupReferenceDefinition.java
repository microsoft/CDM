package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.JsonNode;

public class AttributeGroupReferenceDefinition {
    private JsonNode AttributeGroupReference;

    public JsonNode getAttributeGroupReference() {
        return this.AttributeGroupReference;
    }

    public void setAttributeGroupReference(final JsonNode AttributeGroupReference) {
        this.AttributeGroupReference = AttributeGroupReference;
    }
}
