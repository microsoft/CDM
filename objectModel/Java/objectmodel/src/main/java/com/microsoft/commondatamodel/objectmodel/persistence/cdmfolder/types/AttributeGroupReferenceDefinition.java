// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types;

import com.fasterxml.jackson.databind.JsonNode;

public class AttributeGroupReferenceDefinition {
    private JsonNode attributeGroupReference;
    private Boolean optional;

    public JsonNode getAttributeGroupReference() {
        return this.attributeGroupReference;
    }

    public void setAttributeGroupReference(final JsonNode AttributeGroupReference) {
        this.attributeGroupReference = AttributeGroupReference;
    }

    public Boolean getOptional() {
        return optional;
    }

    public void setOptional(Boolean optional) {
        this.optional = optional;
    }
}
