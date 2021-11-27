// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

public class DataTypeReferenceDefinition {
    private JsonNode dataTypeReference;
    private ArrayNode appliedTraits;
    private Boolean optional;

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

    public Boolean getOptional() {
        return optional;
    }

    public void setOptional(Boolean optional) {
        this.optional = optional;
    }
}
