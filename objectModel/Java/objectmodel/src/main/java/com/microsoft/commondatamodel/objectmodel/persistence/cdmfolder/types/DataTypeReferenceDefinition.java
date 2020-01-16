package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

public class DataTypeReferenceDefinition {
    private JsonNode dataTypeReference;
    private ArrayNode appliedTraits;

    public JsonNode getDataTypeReference() {
        return this.dataTypeReference;
    }

    public void setDataTypeReference(final JsonNode dataTypeReference) {
        this.dataTypeReference = dataTypeReference;
    }

    public ArrayNode getAppliedTraits() {
        return this.appliedTraits;
    }

    public void setAppliedTraits(final ArrayNode appliedTraits) {
        this.appliedTraits = appliedTraits;
    }
}
